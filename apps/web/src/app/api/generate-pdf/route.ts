import { exec } from "child_process";

const ALLOWED_ORIGIN = process.env.SANITY_STUDIO_URL || "http://localhost:3333";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN, // Use correct origin
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-sanity-secret",
    },
  });
}

export async function POST(req: Request): Promise<Response> {
  console.log("📩 Received PDF generation request...");

  const secret = req.headers.get("x-sanity-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    console.error("❌ Unauthorized request. Invalid secret.");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN, // Use correct origin
      },
    });
  }

  console.log("🖨️ Running PDF generation script...");

  return new Promise((resolve) => {
    exec("node ./scripts/blobPDF.js", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        resolve(
          new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": ALLOWED_ORIGIN, // Use correct origin
            },
          }),
        );
        return;
      }

      if (stderr) console.warn(`⚠️ Stderr: ${stderr}`);

      console.log(`✅ PDF generation complete:\n${stdout}`);
      // Extract URL using regex
      const match = stdout.match(/PDF successfully uploaded: (\S+)/);
      const pdfUrl = match ? match[1] : null;

      resolve(
        new Response(
          JSON.stringify({
            message: "PDF generation triggered successfully",
            pdfUrl: pdfUrl,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": ALLOWED_ORIGIN, // Use correct origin
            },
          },
        ),
      );
    });
  }) as Promise<Response>;
}
