import { list } from "@vercel/blob";

export async function GET() {
  try {
    const STORAGE_NAME = process.env.BLOB_STORAGE_NAME || "pdf";

    // Fetch all blobs from storage
    const { blobs } = await list({ prefix: STORAGE_NAME });

    if (!blobs || blobs.length === 0) {
      return Response.json({ error: "No PDFs found." }, { status: 404 });
    }

    // Sort blobs by upload time (latest first)
    const latestBlob = blobs.sort(
      (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt),
    )[0];

    // Redirect to the latest PDF
    return Response.redirect(latestBlob.url, 302);
  } catch (error) {
    console.error("Error fetching latest PDF:", error);
    return Response.json(
      { error: "Failed to fetch latest PDF" },
      { status: 500 },
    );
  }
}
