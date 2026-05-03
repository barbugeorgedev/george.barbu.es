/**
 * Lists all blobs in the Vercel Blob store, keeps the N newest by uploadedAt,
 * deletes the rest. Requires BLOB_READ_WRITE_TOKEN or NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN.
 *
 * Usage (from apps/web): node scripts/pruneBlobs.js
 * Optional: KEEP_BLOBS=4 (default 4)
 */
const path = require("path");
const { list, del } = require("@vercel/blob");

require("dotenv").config();
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const KEEP = Math.max(0, parseInt(process.env.KEEP_BLOBS || "4", 10) || 4);
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.error(
    "Missing token: set BLOB_READ_WRITE_TOKEN or NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN",
  );
  process.exit(1);
}

process.env.BLOB_READ_WRITE_TOKEN = BLOB_TOKEN;

async function listAllBlobs() {
  const out = [];
  let cursor;
  for (;;) {
    const res = await list({ limit: 1000, cursor });
    out.push(...res.blobs);
    if (!res.hasMore) break;
    cursor = res.cursor;
    if (!cursor) break;
  }
  return out;
}

async function main() {
  console.log("Listing blobs…");
  const blobs = await listAllBlobs();
  console.log(`Total: ${blobs.length}`);

  if (blobs.length <= KEEP) {
    console.log(`Nothing to delete (≤ ${KEEP} blobs).`);
    return;
  }

  const sorted = [...blobs].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
  const toDelete = sorted.slice(KEEP);
  const urls = toDelete.map((b) => b.url);

  console.log(`Keeping ${KEEP} newest, deleting ${urls.length}…`);

  const BATCH = 50;
  for (let i = 0; i < urls.length; i += BATCH) {
    const chunk = urls.slice(i, i + BATCH);
    await del(chunk);
    console.log(`  deleted ${Math.min(i + BATCH, urls.length)} / ${urls.length}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
