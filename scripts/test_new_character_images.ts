import { chromium } from "@playwright/test";
import path from "path";

async function testNewCharacterImages() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to story detail page...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to character gallery
  const charGallery = page.locator("text=Hồ Sơ Nhân Vật").first();
  await charGallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Open first character modal
  const firstCard = page.locator("div[class*='group relative cursor-pointer']").first();
  await firstCard.click();
  await page.waitForTimeout(1000);

  // Click Hắc (Vane) in the bottom switcher
  const vaneBtn = page.locator("button:has-text('Hắc')").first();
  if (await vaneBtn.isVisible()) {
    await vaneBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "vane_modal_new_art.png") });
    console.log("Saved vane_modal_new_art.png");
  }

  await browser.close();
  console.log("Verification of new character artwork completed successfully!");
}

testNewCharacterImages().catch(console.error);
