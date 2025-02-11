import { list } from "@vercel/blob";

export const dynamic = "force-dynamic"; // Ensures the route is always server-side

export async function GET() {
  try {
    const STORAGE_NAME = process.env.BLOB_STORAGE_NAME || "pdf";

    // Fetch all blobs with the given prefix
    const { blobs } = await list({ prefix: STORAGE_NAME });

    if (!blobs || blobs.length === 0) {
      return Response.json({ error: "No PDFs found." }, { status: 404 });
    }

    // Sort blobs by upload time (latest first)
    const latestBlob = blobs.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];

    console.log("Latest PDF:", latestBlob);

    return Response.redirect(latestBlob.url, 302);
  } catch (error) {
    console.error("Error fetching latest PDF:", error);
    return Response.json(
      { error: "Failed to fetch latest PDF" },
      { status: 500 },
    );
  }
}
