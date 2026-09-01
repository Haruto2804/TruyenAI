import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const charSection = page.locator("text=Hồ Sơ Nhân Vật").locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')][1]");
  await charSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await charSection.screenshot({ path: path.join(process.cwd(), "test_screenshots", "character_gallery_focus.png") });
  console.log("Saved character_gallery_focus.png");

  await browser.close();
}

main().catch(console.error);
