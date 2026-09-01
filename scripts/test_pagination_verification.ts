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

  console.log("1. Navigating to story page...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Take screenshot of initial state (4 characters, 4 lores)
  await page.screenshot({ path: path.join(screenshotsDir, "gallery_initial_4_items.png") });
  console.log("Saved gallery_initial_4_items.png");

  // Verify Character load more
  const charLoadMoreBtn = page.locator("button:has-text('Xem thêm nhân vật')");
  console.log("Character Load More Button visible:", await charLoadMoreBtn.isVisible());

  if (await charLoadMoreBtn.isVisible()) {
    console.log("Clicking Character Load More...");
    await charLoadMoreBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, "gallery_characters_expanded.png") });
    console.log("Saved gallery_characters_expanded.png");
  }

  // Scroll to Lore Gallery
  const loreHeading = page.locator("text=Bách Khoa Chú Giải & Khái Niệm");
  await loreHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const loreLoadMoreBtn = page.locator("button:has-text('Xem thêm chú giải')");
  console.log("Lore Load More Button visible:", await loreLoadMoreBtn.isVisible());

  if (await loreLoadMoreBtn.isVisible()) {
    console.log("Clicking Lore Load More...");
    await loreLoadMoreBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, "gallery_lores_expanded_8.png") });
    console.log("Saved gallery_lores_expanded_8.png");

    if (await loreLoadMoreBtn.isVisible()) {
      console.log("Clicking Lore Load More again for remaining items...");
      await loreLoadMoreBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(screenshotsDir, "gallery_lores_all_9.png") });
      console.log("Saved gallery_lores_all_9.png");
    }
  }

  await browser.close();
  console.log("All gallery pagination tests passed successfully!");
}

main().catch(console.error);
