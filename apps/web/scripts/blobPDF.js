const axios = require("axios");
const { put } = require("@vercel/blob");
require("dotenv").config();

const SITE_URL =
  process.env.NODE_ENV !== "development"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3000";
const REVALIDATE_URL = `${SITE_URL}/api/cache?clear=${process.env.REVALIDATE_SECRET}`;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PROJECT_ID = process.env.BLOB_PROJECT_ID || "fjzxtnzjts3m1a6q";
const STORAGE_NAME = process.env.BLOB_STORAGE_NAME || "pdf";

const PAGES = ["/"];

if (!BLOB_TOKEN) {
  console.error("❌ Missing BLOB_READ_WRITE_TOKEN. Set it in your .env file.");
  process.exit(1);
}

// **1. Clear Vercel Cache Before Generating PDFs**
const clearCache = async () => {
  try {
    console.log("🧹 Clearing Vercel cache...");
    console.log(`🔗 Revalidate URL: ${REVALIDATE_URL}`);

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

// **2. Check if the server is available before running the script**
const checkServerAvailability = async () => {
  let retries = 5;
  let delay = 2000;

  while (retries > 0) {
    try {
      console.log(`🔍 Checking server availability at: ${SITE_URL}`);
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

// **3. Generate Aside Content**
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

// **4. Generate and Upload PDF**
const generateAndUploadPDF = async (page, route) => {
  try {
    const url = `${SITE_URL}${route}`;
    console.log(`📄 Navigating to ${url} to generate PDF...`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });

    console.log("🖼️ Waiting for all images to load...");
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              }),
        ),
      );
    });
    console.log("✅ All images loaded.");

    console.log("🔍 Hiding elements marked for exclusion...");
    await page.evaluate(() => {
      document.querySelectorAll('[data-exclude="true"]').forEach((el) => {
        el.style.visibility = "hidden";
      });
    });

    console.log("🎨 Adding aside elements for header/footer...");
    const asideHTML = generateAsideContent({
      height: "1080px",
      width: "321px",
    });
    await page.evaluate((asideContent) => {
      document.body.insertAdjacentHTML("beforeend", asideContent);
    }, asideHTML);

    console.log("🖨️ Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "30px", bottom: "30px" },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: generateAsideContent({ position: "top" }),
      footerTemplate: generateAsideContent({ position: "bottom" }),
    });
    console.log("✅ PDF generated successfully!");

    console.log(`⬆️ Uploading PDF to Vercel Blob storage (${STORAGE_NAME})...`);
    const fileName = `${route.replace("/", "") || "george.barbu"}.pdf`;
    const { url: blobUrl } = await put(
      `${STORAGE_NAME}/${fileName}`,
      pdfBuffer,
      {
        access: "public",
        token: BLOB_TOKEN,
      },
    );

    console.log(`✅ PDF uploaded successfully: ${blobUrl}`);
    return blobUrl;
  } catch (error) {
    console.error(`❌ Error generating PDF for ${route}:`, error);
  }
};

// **5. Main function**
(async () => {
  let browser;

  try {
    await clearCache();
    await checkServerAvailability();

    console.log("🌍 Environment:", process.env.NODE_ENV);

    if (process.env.NODE_ENV !== "development") {
      console.log("🚀 Launching Puppeteer in production mode...");
      const chromium = require("@sparticuz/chromium");
      chromium.setGraphicsMode = false;
      const puppeteer = require("puppeteer-core");

      console.log("🔍 Chromium args:", chromium.args);
      console.log(
        "📌 Chromium executable path:",
        await chromium.executablePath(),
      );

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      console.log("🛠 Launching Puppeteer in development mode...");
      const puppeteer = require("puppeteer");

      browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-print-preview",
        ],
        ignoreDefaultArgs: ["--disable-extensions"],
      });
    }

    console.log("🆕 Opening a new page...");
    const page = await browser.newPage();

    for (const route of PAGES) {
      console.log(`📄 Processing page: ${route}`);
      await generateAndUploadPDF(page, route);
    }

    console.log("🎉 All PDFs uploaded successfully!");
  } catch (error) {
    console.error("❌ Fatal Error:", error);
  } finally {
    if (browser) {
      console.log("🔒 Closing browser...");
      await browser.close();
    }

    console.log("👋 Exiting script...");
    process.exit(0);
  }
})();
