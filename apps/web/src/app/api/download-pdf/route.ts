import { list } from "@vercel/blob";
import env from "@dotenv";

export const dynamic = "force-dynamic"; // Ensures the route is always server-side

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return new Response(JSON.stringify({ error: "File name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const STORAGE_NAME = process.env.NEXT_PUBLIC_BLOB_STORAGE_NAME || "pdf";
    const fileUrl = `https://${STORAGE_NAME}.blob.vercel-storage.com/${fileName}`;

    return Response.redirect(fileUrl, 302);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    return new Response(JSON.stringify({ error: "Failed to download PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
