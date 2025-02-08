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

async function getBrowserInstance() {
  // Define chrome executable path based on the platform
  const executablePath =
    process.env.CHROME_EXECUTABLE_PATH ||
    (process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "linux"
        ? "/usr/bin/google-chrome"
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");

  const options = {
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    executablePath: (await chromium.executablePath) || executablePath,
    headless: true,
    defaultViewport: chromium.defaultViewport,
    ignoreHTTPSErrors: true,
  };

  console.log("🔍 Chrome executable path:", options.executablePath);
  return puppeteer.launch(options);
}

async function generatePDF(route) {
  let browser;
  try {
    console.log("📊 Initializing browser...");
    browser = await getBrowserInstance();
    console.log("✅ Browser initialized successfully");

    const page = await browser.newPage();
    const url = `${SITE_URL}${route}`;
    console.log(`📄 Generating PDF for: ${url}`);

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("❌ Puppeteer error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
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
    console.log("👋 Exiting script...");
    process.exit(0);
  }
})();
