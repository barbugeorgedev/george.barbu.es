const puppeteer = require("puppeteer");
const shell = require("shelljs");
const path = require("path");
const { exec } = require("child_process");
const axios = require("axios");
require("dotenv").config();

// Ensure export directory exists
shell.mkdir("-p", "./public/exports");

const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL || "http://localhost:3000"; // Local URL for Next.js app
const PAGES = ["/"]; // Pages to scrape
const OUTPUT_DIR = "./public/exports"; // Where the PDFs will be saved

// Function to check if the server is running by sending an HTTP request
const checkServerAvailability = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      const response = await axios.get(SITE_URL);
      if (response.status === 200) {
        console.log("Server is ready!");
        return true;
      }
    } catch (error) {
      console.error("Server not ready, retrying...", error.message);
    }
    retries--;
    console.log(`Retrying... (${5 - retries} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
  }
  throw new Error("Server did not start in time");
};

(async () => {
  let serverProcess;
  let browser;
  try {
    // Start local server using child_process
    console.log("Starting local server...");
    serverProcess = exec("yarn dev", { cwd: path.join(__dirname, "..") });

    // Wait for the server to be ready
    await checkServerAvailability();

    // Now start Puppeteer and generate PDFs
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    for (const route of PAGES) {
      try {
        const url = `${SITE_URL}${route}`;
        const outputPath = path.join(
          OUTPUT_DIR,
          `${route.replace("/", "") || "homepage"}.pdf`,
        );

        console.log(`Generating PDF for: ${url}`);

        // Navigate to the page
        await page.goto(url, { waitUntil: "networkidle2" });

        // Generate and save the PDF
        await page.pdf({
          path: outputPath,
          format: "A4",
          printBackground: true,
        });

        console.log(`✅ PDF saved for ${route} to: ${outputPath}`);
      } catch (error) {
        console.error(`❌ Error generating PDF for ${route}:`, error);
      }
    }

    console.log("All PDFs generated successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    // Ensure the server and browser are closed
    if (serverProcess) {
      console.log("Stopping local server...");
      serverProcess.kill("SIGINT"); // Stop the server process
    }

    if (browser) {
      console.log("Closing browser...");
      await browser.close(); // Close the Puppeteer browser
    }

    console.log("Exiting script...");
    process.exit(0); // Exit the Node.js process
  }
})();
