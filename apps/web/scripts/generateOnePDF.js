/**
 * Generate PDF for a single resume slug against production (or NEXT_PUBLIC_API_URL).
 * Usage: node scripts/generateOnePDF.js senior-frontend-performance-engineer
 */
const path = require("path");
const fs = require("fs");
const { put } = require("@vercel/blob");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const SITE_URL = process.env.NEXT_PUBLIC_API_URL || "https://george.barbu.es";
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
const STORAGE_NAME = process.env.NEXT_PUBLIC_BLOB_STORAGE_NAME || "pdf";
const slug = process.argv[2];

if (!slug) {
  console.error("Usage: node scripts/generateOnePDF.js <slug>");
  process.exit(1);
}
if (!BLOB_TOKEN) {
  console.error("Missing blob token");
  process.exit(1);
}

const generateAsideContent = ({
  position = "top",
  height = "30px",
  width = "318px",
} = {}) => `
  <style>
    html { -webkit-print-color-adjust: exact; }
    main { background: transparent !important; }
    #header, #footer { padding: 0!important; border: 0!important; background: transparent!important; }
  </style>
  <aside style="width: ${width}; background: #313638; height: ${height}; position: fixed; ${position}: 0; z-index: -999; border: 0!important;"></aside>
`;

(async () => {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
    ],
  });
  const page = await browser.newPage();
  page.on("console", (msg) => console.log("BROWSER:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGEERROR:", err.message));
  page.on("requestfailed", (req) =>
    console.log("REQFAIL:", req.url(), req.failure()?.errorText),
  );

  const url = `${SITE_URL}/${slug}`;
  console.log(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });

  // Wait until resume content is present (not the Apollo error screen)
  await page.waitForFunction(
    () => {
      const text = (document.body?.innerText || "").toLowerCase();
      return (
        text.includes("professional experience") ||
        text.includes("professional summary") ||
        text.includes("liquidity media") ||
        (text.includes("failed to fetch") && text.length < 80)
      );
    },
    { timeout: 90000 },
  );

  // Give layout/fonts a beat after data arrives
  await new Promise((r) => setTimeout(r, 1500));

  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log("PAGE TEXT PREVIEW:\n", bodyText);
  if (/failed to fetch/i.test(bodyText) && bodyText.length < 80) {
    throw new Error("Page failed to load resume data (Failed to fetch)");
  }

  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            }),
      ),
    );
  });

  await page.evaluate(() => {
    document.querySelectorAll('[data-exclude="true"]').forEach((el) => {
      el.style.visibility = "hidden";
    });
  });

  const asideHTML = generateAsideContent({ height: "1080px", width: "321px" });
  await page.evaluate((asideContent) => {
    document.body.insertAdjacentHTML("beforeend", asideContent);
  }, asideHTML);

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "30px", bottom: "30px" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: generateAsideContent({ position: "top" }),
    footerTemplate: generateAsideContent({ position: "bottom" }),
  });

  const outDir = path.join(__dirname, "../public/exports");
  fs.mkdirSync(outDir, { recursive: true });
  const localPath = path.join(outDir, `${slug}.pdf`);
  fs.writeFileSync(localPath, pdfBuffer);
  console.log(`Saved locally: ${localPath}`);

  const { url: blobUrl } = await put(
    `${STORAGE_NAME}/${slug}.pdf`,
    pdfBuffer,
    { access: "public", token: BLOB_TOKEN },
  );
  console.log(`Uploaded: ${blobUrl}`);

  // ATS variant
  const atsUrl = `${SITE_URL}/${slug}-ats`;
  console.log(`Navigating to ${atsUrl}`);
  await page.goto(atsUrl, { waitUntil: "networkidle0", timeout: 120000 });
  await page.evaluate(() => {
    document.documentElement.classList.add("pdf-export");
    const style = document.createElement("style");
    style.textContent = `
      @page { background-color: #ffffff; margin: 30px; }
      body, html { background-color: #ffffff !important; margin: 0; padding: 0; }
    `;
    document.head.appendChild(style);
  });
  const atsBuffer = await page.pdf({
    format: "A4",
    margin: { top: "30px", bottom: "30px" },
    printBackground: true,
    displayHeaderFooter: false,
  });
  const atsLocal = path.join(outDir, `${slug}-ats.pdf`);
  fs.writeFileSync(atsLocal, atsBuffer);
  console.log(`Saved locally: ${atsLocal}`);

  const { url: atsBlobUrl } = await put(
    `${STORAGE_NAME}/${slug}-ats.pdf`,
    atsBuffer,
    { access: "public", token: BLOB_TOKEN },
  );
  console.log(`Uploaded ATS: ${atsBlobUrl}`);

  await browser.close();
  console.log("Done");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
