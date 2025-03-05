import { list } from "@vercel/blob";

export const dynamic = "force-dynamic"; // Ensures the route is always server-side

export async function GET() {
  try {
    const STORAGE_NAME = process.env.NEXT_PUBLIC_BLOB_STORAGE_NAME || "pdf";
    // Fetch all blobs with the given prefix
    const { blobs } = await list({ prefix: STORAGE_NAME });

    if (!blobs || blobs.length === 0) {
      console.warn("No PDFs found.");
      return new Response(JSON.stringify({ error: "No PDFs found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sort blobs by upload time (latest first)
    const latestBlob = blobs.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];

    // Add a check if latestBlob is undefined
    if (!latestBlob) {
      return new Response(JSON.stringify({ error: "No valid PDF found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return Response.redirect(latestBlob.url, 302);
  } catch (error) {
    console.error("Error fetching latest PDF:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch latest PDF" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
