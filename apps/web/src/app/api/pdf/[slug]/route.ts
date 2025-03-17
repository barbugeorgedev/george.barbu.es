import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

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

    // Fetch all blobs
    const { blobs } = await list({ prefix: `${STORAGE_NAME}` });
    // Filter blobs to include only those matching the specific role/slug
    const filteredBlobs = blobs.filter(
      (blob) =>
        blob.pathname.includes(`/${role}-`) ||
        blob.pathname.includes(`/${role}.`),
    );

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

    return NextResponse.json({ url: latestBlob.url }, { status: 200 });
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

const allowedOrigins = ["https://portfolio.barbu.es", "http://localhost:3000"];

export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowOrigin = allowedOrigins.includes(origin || "")
    ? origin
    : undefined;

  const headers = new Headers({
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (allowOrigin) {
    headers.set("Access-Control-Allow-Origin", allowOrigin);
  }

  return new NextResponse(null, { status: 204, headers });
}
