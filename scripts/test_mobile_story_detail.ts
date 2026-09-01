import { chromium } from "@playwright/test";
import path from "path";

async function testViewport(width: number, height: number, name: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  console.log(`Testing ${name} (${width}x${height})...`);
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Take screenshot of the top hero area
  const hero = page.locator("div.relative.overflow-hidden.bg-white\\/5").first();
  await hero.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const screenshotPath = path.join(process.cwd(), "test_screenshots", `story_detail_hero_${name}.png`);
  await hero.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot: ${screenshotPath}`);

  await browser.close();
}

async function main() {
  // Mobile iPhone SE / 13 mini
  await testViewport(375, 812, "mobile_375");
  // Mobile iPhone 14 Pro Max
  await testViewport(430, 932, "mobile_430");
  // Tablet iPad
  await testViewport(768, 1024, "tablet_768");
  // Desktop
  await testViewport(1440, 900, "desktop_1440");
  console.log("All viewports tested successfully!");
}

main().catch(console.error);
