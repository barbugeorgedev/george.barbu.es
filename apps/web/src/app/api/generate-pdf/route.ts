import { exec } from "child_process";

export async function POST(req: Request): Promise<Response> {
  const secret = req.headers.get("x-sanity-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("🖨️ Running PDF generation script...");

  return new Promise((resolve) => {
    exec("yarn pdf:blob", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        resolve(
          new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }),
        );
        return;
      }

      if (stderr) console.warn(`⚠️ Stderr: ${stderr}`);

      console.log(`✅ PDF generation complete:\n${stdout}`);
      resolve(
        new Response(
          JSON.stringify({ message: "PDF generation triggered successfully" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );
    });
  }) as Promise<Response>;
}
