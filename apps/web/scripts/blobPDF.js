const puppeteer = require("puppeteer");
const axios = require("axios");
const { put } = require("@vercel/blob");
require("dotenv").config();

const SITE_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_URL = `${SITE_URL}/api/cache?clear=${process.env.REVALIDATE_SECRET}`;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const STORAGE_NAME = process.env.BLOB_STORAGE_NAME || "pdf";
const BASE_BLOB_URL = "https://fjzxtnzjts3m1a6q.public.blob.vercel-storage.com"; // Your Vercel Blob Base URL

const PAGES = ["/"];

if (!BLOB_TOKEN) {
  console.error("❌ Missing BLOB_READ_WRITE_TOKEN. Set it in your .env file.");
  process.exit(1);
}

// **1. Clear Vercel Cache Before Generating PDFs**
const clearCache = async () => {
  try {
    console.log("🧹 Clearing Vercel cache...");
    const response = await axios.get(REVALIDATE_URL);
    if (response.status === 200) {
      console.log("✅ Cache cleared successfully!");
    } else {
      console.error("⚠️ Cache clear request failed:", response.data);
    }
  } catch (error) {
    console.error("❌ Error clearing cache:", error.message);
  }
};

// **2. Function to check if the server is ready**
const checkServerAvailability = async () => {
  let retries = 5;
  let delay = 2000;

  while (retries > 0) {
    try {
      const response = await axios.get(SITE_URL);
      if (response.status === 200) {
        console.log("✅ Server is ready!");
        return true;
      }
    } catch (error) {
      console.error(`❌ Server not ready, retrying in ${delay / 1000}s...`);
    }

    retries--;
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 1.5;
  }

  throw new Error("❌ Server did not start in time");
};

// **3. Function to Generate and Upload PDF**
const generateAndUploadPDF = async (page, route) => {
  try {
    const url = `${SITE_URL}${route}`;
    console.log(`📄 Generating PDF for: ${url}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "30px", bottom: "30px" },
      printBackground: true,
    });

    console.log(`⬆️ Uploading PDF to Vercel Blob...`);
    const fileName = `${route.replace("/", "") || "george.barbu"}.pdf`;
    const { url: blobUrl } = await put(
      `${STORAGE_NAME}/${fileName}`,
      pdfBuffer,
      {
        access: "public",
        token: BLOB_TOKEN,
      },
    );

    const exportedUrl = `${BASE_BLOB_URL}/${STORAGE_NAME}/${fileName}`;
    console.log(`✅ PDF successfully uploaded: ${exportedUrl}`);

    return exportedUrl;
  } catch (error) {
    console.error(`❌ Error generating PDF for ${route}:`, error);
  }
};

// **4. Main function**
(async () => {
  let browser;

  try {
    await clearCache(); // 🧹 Clear Cache before generating PDFs
    await checkServerAvailability();

    if (process.env.NODE_ENV !== "development") {
      const chromium = require("@sparticuz/chromium");
      chromium.setGraphicsMode = false;
      const puppeteer = require("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      browser = await puppeteer.launch({ headless: "new" });
    }

    const page = await browser.newPage();

    for (const route of PAGES) {
      await generateAndUploadPDF(page, route);
    }

    console.log("🎉 All PDFs uploaded successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (browser) {
      console.log("🔒 Closing browser...");
      await browser.close();
    }

    console.log("👋 Exiting script...");
    process.exit(0);
  }
})();
