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

  console.log("1. Testing Story page Character Gallery...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Check if Karlov is in the character list
  const karlovCard = page.locator("h3:has-text('Nhị Trưởng Lão Karlov')").first();
  const hasKarlov = await karlovCard.isVisible();
  console.log("Karlov visible in Gallery:", hasKarlov);

  if (hasKarlov) {
    await karlovCard.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, "karlov_gallery_modal.png") });
    console.log("Saved karlov_gallery_modal.png");
  }

  console.log("2. Testing Chapter 1 Karlov mention & popover...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/1", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const karlovMentionChap1 = page.locator("button[title*='Karlov']").first();
  const mentionChap1Count = await page.locator("button[title*='Karlov']").count();
  console.log(`Chapter 1 has ${mentionChap1Count} mentions for Karlov`);

  if (mentionChap1Count > 0) {
    await karlovMentionChap1.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, "chapter_1_karlov_dossier.png") });
    console.log("Saved chapter_1_karlov_dossier.png");
  }

  console.log("3. Testing Chapter 2 Karlov mention & popover...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/2", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const mentionChap2Count = await page.locator("button[title*='Karlov']").count();
  console.log(`Chapter 2 has ${mentionChap2Count} mentions for Karlov`);

  if (mentionChap2Count > 0) {
    const karlovMentionChap2 = page.locator("button[title*='Karlov']").first();
    await karlovMentionChap2.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, "chapter_2_karlov_dossier.png") });
    console.log("Saved chapter_2_karlov_dossier.png");
  }

  await browser.close();
  console.log("All Karlov verifications complete!");
}

main().catch(console.error);
