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

// Chrome executable paths for different environments
const CHROME_PATHS = {
  win32: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  linux: "/usr/bin/chromium",
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  vercel: "/var/task/node_modules/chromium/lib/chromium/chrome-linux/chrome",
};

async function getBrowserInstance() {
  try {
    console.log(
      "📊 Launching browser in",
      process.env.VERCEL ? "Vercel" : "local",
      "environment",
    );

    let executablePath;
    let launchOptions;

    if (process.env.VERCEL) {
      // Vercel environment
      executablePath = CHROME_PATHS.vercel;
      launchOptions = {
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
        ],
        executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      };
    } else {
      // Local environment
      executablePath =
        (await chromium.executablePath) || CHROME_PATHS[process.platform];
      launchOptions = {
        args: chromium.args,
        executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      };
    }

    console.log("🔍 Using Chrome executable path:", executablePath);

    if (!executablePath) {
      throw new Error(
        "No Chrome executable path found for current environment",
      );
    }

    const browser = await puppeteer.launch(launchOptions);
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

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1,
    });

    const url = `${SITE_URL}${route}`;
    console.log(`📄 Generating PDF for: ${url}`);

    // Navigate with extended timeout and wait options
    await page.goto(url, {
      waitUntil: ["networkidle0", "load", "domcontentloaded"],
      timeout: 60000, // 60 seconds
    });

    // Additional wait to ensure dynamic content loads
    await page.waitForTimeout(5000);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      timeout: 60000,
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
    process.exit(0);
  }
})();
