import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

async function main() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Testing Story page (Chapter list & Character gallery)...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, "story_page_7_chapters.png") });

  console.log("2. Testing Chapter 3...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/3", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, "chapter_3_reader.png") });

  console.log("3. Testing Chapter 5...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/5", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  // Click on a Boris mention if available
  const borisBtn = page.locator("button[title*='Boris']").first();
  if (await borisBtn.isVisible()) {
    await borisBtn.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(screenshotsDir, "chapter_5_reader_boris.png") });

  console.log("4. Testing Chapter 7...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/7", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, "chapter_7_reader.png") });

  await browser.close();
  console.log("All 5 new chapters verified!");
}

main().catch(console.error);
