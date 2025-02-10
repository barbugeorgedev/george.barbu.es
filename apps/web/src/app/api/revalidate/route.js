import { revalidatePath } from "next/cache";

export async function POST(req) {
  const { path } = await req.json();
  revalidatePath(path); // ✅ Force refresh ISR cache for given path

  return new Response(JSON.stringify({ revalidated: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
