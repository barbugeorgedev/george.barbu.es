require("dotenv").config({
  path: `.env.production`,
});

const puppeteer = require("puppeteer");
const fs = require("fs");
const shell = require("shelljs");
const contentHtml = fs.readFileSync(
  process.env.GATSBY_PUBLIC_PATH + process.env.GATSBY_INDEX_HTML_PATH,
  "utf8",
);

shell.mkdir("-p", "./public/exports");

(async () => {
  const content = `
          <style>
            html {
              -webkit-print-color-adjust: exact;
            }
            #header, #footer { padding: 0 !important; }
          </style>
          <aside style="width: 237.5px;background: #313638;height: 1080px;"></aside>
        `;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  });
  const page = await browser.newPage();
  await page.waitForTimeout(4000);
  await page.setCacheEnabled(false);
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.setContent(contentHtml);
  await page.waitForTimeout(4000);
  let remove_selector = '[data-exclude="true"]';
  await page.evaluate((sel) => {
    var elements = document.querySelectorAll(sel);
    for (var i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, remove_selector);
  await page.pdf({
    path: process.env.GATSBY_PUBLIC_PATH + process.env.GATSBY_PDF_EXPORT_PATH,
    format: "A4",
    headerTemplate: content,
    footerTemplate: content,
    margin: { top: "30px", bottom: "30px" },
    printBackground: true,
    displayHeaderFooter: true,
  });
  await browser.close();
})();
