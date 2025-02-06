const puppeteer = require("puppeteer");
const shell = require("shelljs");
const path = require("path");
const { spawn } = require("child_process");
const axios = require("axios");
require("dotenv").config();

// Ensure export directory exists
shell.mkdir("-p", "./public/exports");

const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL || "http://localhost:3001";
const PAGES = ["/"];
const OUTPUT_DIR = "./public/exports";

// Function to kill the server process on port 3001
const killServerProcess = () => {
  if (process.platform === "win32") {
    console.log("🚨 Killing any Node.js process occupying port 3001...");
    shell.exec(
      "for /f \"tokens=5\" %i in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %i",
    );
  } else {
    console.log("🚨 Killing any process occupying port 3001...");
    shell.exec("lsof -ti :3001 | xargs kill -9 || true"); // macOS/Linux
  }
};

// Check if server is running
const checkServerAvailability = async () => {
  let retries = 5;
  let delay = 2000; // Start with 2s delay

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
    delay *= 1.5; // Exponential backoff
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

// Generate PDF from a given route
const generatePDF = async (page, route) => {
  try {
    const url = `${SITE_URL}${route}`;
    const outputPath = path.join(
      OUTPUT_DIR,
      `${route.replace("/", "") || "george.barbu"}.pdf`,
    );

    console.log(`📄 Generating PDF for: ${url}`);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });

    // Ensure all lazy-loaded images are fully rendered
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

    // Debug: Capture a screenshot to ensure layout is correct
    // console.log("📸 Capturing screenshot for debugging...");
    // await page.screenshot({
    //   path: path.join(OUTPUT_DIR, "debug-screenshot.png"),
    //   fullPage: true,
    // });

    const asideHTML = generateAsideContent({
      height: "1080px",
      width: "321px",
    });

    await page.evaluate((asideContent) => {
      document.body.insertAdjacentHTML("beforeend", asideContent);
    }, asideHTML);

    // Generate PDF with custom header, footer, and aside
    await page.pdf({
      path: outputPath,
      format: "A4",
      margin: { top: "30px", bottom: "30px" },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: generateAsideContent({ position: "top" }),
      footerTemplate: generateAsideContent({ position: "bottom" }),
    });

    console.log(`📂 PDF saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generating PDF for ${route}:`, error);
  }
};

(async () => {
  let serverProcess;
  let browser;

  try {
    killServerProcess();
    console.log("🚀 Starting local server...");
    serverProcess = spawn("yarn", ["dev-pdf"], {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      shell: true, // Important for Windows
    });

    await checkServerAvailability();
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s after server is ready

    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-print-preview",
      ],
      ignoreDefaultArgs: ["--disable-extensions"],
    });

    const page = await browser.newPage();

    for (const route of PAGES) {
      await generatePDF(page, route);
    }

    console.log("🎉 All PDFs generated successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (serverProcess) {
      console.log("🛑 Stopping local server...");
      process.kill(serverProcess.pid, "SIGTERM"); // Gracefully terminate
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (browser) {
      console.log("🔒 Closing browser...");
      await browser.close();
    }

    console.log("👋 Exiting script...");
    process.exit(0);
  }
})();
