import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to Chapter 4...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/4", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Find paragraph containing "Vane đại nhân"
  const paragraph = page.locator("p:has-text('Vane đại nhân')").first();
  console.log("Paragraph text content:", await paragraph.textContent());
  
  await paragraph.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "chapter_4_vane_asterisk_fix.png") });
  console.log("Saved chapter_4_vane_asterisk_fix.png");

  // Click on Vane button in text
  const vaneBtn = paragraph.locator("button:has-text('Vane')").first();
  console.log("Vane button visible:", await vaneBtn.isVisible());
  if (await vaneBtn.isVisible()) {
    await vaneBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "chapter_4_vane_modal_opened.png") });
    console.log("Saved chapter_4_vane_modal_opened.png");
  }

  // Also check Chapter 5 (Boris)
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/5", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const borisPara = page.locator("p:has-text('Boris Tai Đỏ')").first();
  console.log("Chapter 5 Boris Paragraph text:", await borisPara.textContent());
  await borisPara.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "chapter_5_boris_asterisk_fix.png") });
  console.log("Saved chapter_5_boris_asterisk_fix.png");

  await browser.close();
  console.log("All asterisk fix tests completed!");
}

main().catch(console.error);
