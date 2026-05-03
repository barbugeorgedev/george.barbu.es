import { NextRequest, NextResponse } from "next/server";
import { list, type ListBlobResultBlob } from "@vercel/blob";

export const dynamic = "force-dynamic";

/** Paginate Vercel Blob list so we never miss the newest object beyond the first page. */
async function listAllBlobsWithPrefix(prefix: string): Promise<ListBlobResultBlob[]> {
  const out: ListBlobResultBlob[] = [];
  let cursor: string | undefined;

  for (;;) {
    const res = await list({ prefix, limit: 1000, cursor });
    out.push(...res.blobs);
    if (!res.hasMore) break;
    cursor = res.cursor;
    if (!cursor) break;
  }

  return out;
}

export function OPTIONS(request: NextRequest) {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  return new NextResponse(null, { status: 204, headers });
}

export async function GET(request: NextRequest) {
  try {
    const STORAGE_NAME = process.env.NEXT_PUBLIC_BLOB_STORAGE_NAME || "pdf";
    const { searchParams } = request.nextUrl;
    const role = searchParams.get("role");

    // Validate role
    if (!role) {
      console.error("No role provided in the request");
      return NextResponse.json(
        { error: "Role parameter is required" },
        { status: 400 },
      );
    }

    const filePrefix =
      process.env.NEXT_PUBLIC_PDF_BLOB_FILENAME_PREFIX || "george_barbu-";
    const stemPrefixed = `${filePrefix}${role}`;
    const legacyPlain = `${role}.pdf`;
    const legacyPrefixed = `${stemPrefixed}.pdf`;
    /** Older uploads used george-barbu_{role}.pdf */
    const legacyUnderscoreStem = `george-barbu_${role}`;

    // Narrow prefix so we list every revision for this resume (handles list pagination).
    const listPrefix = `${STORAGE_NAME}/${stemPrefixed}`;
    let blobs = await listAllBlobsWithPrefix(listPrefix);
    if (blobs.length === 0) {
      blobs = await listAllBlobsWithPrefix(`${STORAGE_NAME}/${legacyUnderscoreStem}`);
    }
    if (blobs.length === 0) {
      blobs = await listAllBlobsWithPrefix(STORAGE_NAME);
    }

    const filteredBlobs = blobs.filter((blob) => {
      const fileName = blob.pathname.split("/").pop() ?? "";
      if (fileName === legacyPlain || fileName === legacyPrefixed) return true;
      if (fileName === `${legacyUnderscoreStem}.pdf`) return true;
      if (
        fileName.startsWith(`${legacyUnderscoreStem}-`) &&
        fileName.endsWith(".pdf")
      ) {
        return true;
      }
      if (fileName.startsWith(`${stemPrefixed}-`) && fileName.endsWith(".pdf")) {
        return true;
      }
      return false;
    });

    if (!filteredBlobs || filteredBlobs.length === 0) {
      console.warn(`No PDFs found for role: ${role}`);
      return NextResponse.json(
        {
          error: `No PDFs found for role: ${role}`,
          allBlobs: blobs.map((blob) => blob.pathname),
        },
        { status: 404 },
      );
    }

    // Sort filtered blobs by upload time (latest first)
    const latestBlob = filteredBlobs.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];

    if (!latestBlob) {
      return NextResponse.json(
        { error: `No valid PDF found for role: ${role}` },
        { status: 404 },
      );
    }

    const isAtsRole = role.endsWith("-ats");
    const baseKey = isAtsRole ? role.slice(0, -"-ats".length) : role;
    const sep = isAtsRole ? "_" : "-";
    const filename = `George-Barbu${sep}${baseKey}.pdf`;

    const headers = new Headers({ "Access-Control-Allow-Origin": "*" });
    return NextResponse.json(
      { url: latestBlob.url, filename },
      { status: 200, headers },
    );
  } catch (error) {
    console.error("Error fetching latest PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch latest PDF",
        details: String(error),
      },
      { status: 500 },
    );
  }
}
