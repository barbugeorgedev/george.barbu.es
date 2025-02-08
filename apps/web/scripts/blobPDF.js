const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const axios = require("axios");
const { put } = require("@vercel/blob");
require("dotenv").config();

const SITE_URL = process.env.NEXT_PUBLIC_API_URL;
const BLESS_TOKEN =
  process.env.BLESS_TOKEN || "RjqthAbPwIgeJwdc38d38908114afa2ccbbd5ee959";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const STORAGE_NAME = process.env.BLOB_STORAGE_NAME || "pdf";
const BASE_BLOB_URL = "https://fjzxtnzjts3m1a6q.public.blob.vercel-storage.com"; // Your Vercel Blob Base URL

const PAGES = ["/"];

if (!BLOB_TOKEN) {
  console.error("❌ Missing BLOB_READ_WRITE_TOKEN. Set it in your .env file.");
  process.exit(1);
}

// Function to check if the server is ready
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

// Generate header and footer styles
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

// Function to generate a PDF and upload to Vercel Blob
const generateAndUploadPDF = async (page, route) => {
  try {
    const url = `${SITE_URL}${route}`;
    console.log(`📄 Generating PDF for: ${url}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });

    // Ensure all images are fully loaded
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

    await page.evaluate(() => {
      document.querySelectorAll('[data-exclude="true"]').forEach((el) => {
        el.style.visibility = "hidden";
      });
    });

    const asideHTML = generateAsideContent({
      height: "1080px",
      width: "321px",
    });

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

    // Constructing the full URL based on BASE_BLOB_URL
    const exportedUrl = `${BASE_BLOB_URL}/${STORAGE_NAME}/${fileName}`;
    console.log(`✅ PDF successfully uploaded.`);
    console.log(`📂 Storage Name: ${STORAGE_NAME}`);
    console.log(`🌐 Exported URL: ${exportedUrl}`);

    return exportedUrl;
  } catch (error) {
    console.error(`❌ Error generating PDF for ${route}:`, error);
  }
};

// Main function
(async () => {
  let browser;

  try {
    await checkServerAvailability();

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

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
