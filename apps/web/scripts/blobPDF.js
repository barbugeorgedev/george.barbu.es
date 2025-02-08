const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const { put } = require("@vercel/blob");
const axios = require("axios");
require("dotenv").config();

const SITE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_PDF_NAME = process.env.DEFAULT_PDF_NAME || "george.barbu";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_BASE = process.env.BLOB_READ_WRITE_TOKEN || "fjzxtnzjts3m1a6q";
const STORAGE_NAME = process.env.BLOB_STORAGE_NAME || "pdf";
const BASE_BLOB_URL = `https://${BLOB_BASE}.public.blob.vercel-storage.com`;
const PAGES = ["/"];

if (!BLOB_TOKEN) {
  console.error("❌ Missing BLOB_READ_WRITE_TOKEN. Set it in your .env file.");
  process.exit(1);
}

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

async function generatePDF(route) {
  let browser;
  try {
    const executablePath = await chromium.executablePath;

    if (!executablePath) {
      throw new Error("Chromium executablePath not found!");
    }

    browser = await puppeteer.launch({
      executablePath,
      args: chromium.args,
      headless: true,
      defaultViewport: chromium.defaultViewport,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    const url = `${process.env.NEXT_PUBLIC_API_URL}${route}`;
    console.log(`📄 Generating PDF for: ${url}`);

    await page.goto(url, { waitUntil: "networkidle2" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    return pdfBuffer;
  } catch (error) {
    console.error("❌ Puppeteer error:", error);
    throw new Error("Failed to generate PDF.");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

const uploadPDF = async (pdfBuffer, fileName) => {
  try {
    console.log(`⬆️ Uploading PDF to Vercel Blob...`);
    const { url: blobUrl } = await put(
      `${STORAGE_NAME}/${fileName}`,
      pdfBuffer,
      {
        access: "public",
        token: BLOB_TOKEN,
      },
    );

    const exportedUrl = `${BASE_BLOB_URL}/${STORAGE_NAME}/${fileName}`;
    console.log(`✅ PDF successfully uploaded.`);
    console.log(`📂 Storage Name: ${STORAGE_NAME}`);
    console.log(`🌐 Exported URL: ${exportedUrl}`);
    return exportedUrl;
  } catch (error) {
    console.error("❌ Error uploading PDF:", error);
  }
};

(async () => {
  try {
    await checkServerAvailability();

    for (const route of PAGES) {
      const pdfBuffer = await generatePDF(route);
      const fileName = `${route.replace("/", "") || DEFAULT_PDF_NAME}.pdf`;
      await uploadPDF(pdfBuffer, fileName);
    }

    console.log("🎉 All PDFs uploaded successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    console.log("👋 Exiting script...");
    process.exit(0);
  }
})();
