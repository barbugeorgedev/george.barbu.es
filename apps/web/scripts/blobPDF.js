const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const { put } = require("@vercel/blob");
const axios = require("axios");
require("dotenv").config();

const SITE_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_PDF_NAME = process.env.DEFAULT_PDF_NAME || "george.barbu";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const STORAGE_NAME = process.env.BLOB_STORAGE_NAME || "pdf";
const BASE_BLOB_URL = `https://${BLOB_TOKEN}.public.blob.vercel-storage.com`;
const PAGES = ["/"];

const checkServerAvailability = async () => {
  if (!SITE_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");
  let retries = 5;
  let delay = 2000;

  while (retries > 0) {
    try {
      console.log(`🔍 Checking server availability: ${SITE_URL}`);
      const response = await axios.get(SITE_URL);
      if (response.status === 200) {
        console.log("✅ Server is ready!");
        return true;
      }
    } catch (error) {
      console.error(`❌ Server not ready (${retries} retries left)`);
    }
    retries--;
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= 1.5;
  }
  throw new Error("❌ Server did not start in time");
};

async function getBrowserInstance() {
  try {
    console.log("📊 Launching browser...");
    const executablePath = await chromium.executablePath;

    if (!executablePath) {
      throw new Error("No valid Chromium executable path found");
    }

    console.log("🔍 Using Chrome executable path:", executablePath);
    const browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    console.log("✅ Browser launched successfully");
    return browser;
  } catch (error) {
    console.error("🚨 Error launching browser:", error);
    throw error;
  }
}

async function generatePDF(route) {
  let browser;
  try {
    browser = await getBrowserInstance();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });

    const url = `${SITE_URL}${route}`;
    console.log(`📄 Generating PDF for: ${url}`);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.waitForTimeout(5000);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      timeout: 60000,
    });
    return pdfBuffer;
  } catch (error) {
    console.error("❌ Puppeteer error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) await browser.close();
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
    console.log(`✅ PDF uploaded: ${exportedUrl}`);
    return exportedUrl;
  } catch (error) {
    console.error("❌ Error uploading PDF:", error.message);
    throw error;
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
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
