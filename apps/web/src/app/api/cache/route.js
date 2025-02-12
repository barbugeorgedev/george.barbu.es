import env from "@dotenv";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("clear");

  if (secret !== env.NEXT_PUBLIC_REVALIDATE_SECRET) {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Force revalidate using Next.js API
    await fetch(`${env.NEXT_PUBLIC_API_URL}/api/revalidate`, {
      method: "POST", // ✅ Use POST instead of GET
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/" }),
    });

    return new Response(JSON.stringify({ revalidated: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error revalidating" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
