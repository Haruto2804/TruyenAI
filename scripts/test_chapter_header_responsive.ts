import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const browser = await chromium.launch();

  // Test 1: Desktop Viewport (1440 x 900)
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/5", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const header = page.locator("div.sticky.top-20").first();
    await header.screenshot({ path: path.join(process.cwd(), "test_screenshots", "chapter_header_desktop.png") });
    console.log("Saved chapter_header_desktop.png");
    await context.close();
  }

  // Test 2: Tablet Viewport (768 x 1024)
  {
    const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/5", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const header = page.locator("div.sticky.top-20").first();
    await header.screenshot({ path: path.join(process.cwd(), "test_screenshots", "chapter_header_tablet.png") });
    console.log("Saved chapter_header_tablet.png");
    await context.close();
  }

  // Test 3: Mobile Viewport (375 x 667)
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/5", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const header = page.locator("div.sticky.top-20").first();
    await header.screenshot({ path: path.join(process.cwd(), "test_screenshots", "chapter_header_mobile.png") });
    console.log("Saved chapter_header_mobile.png");
    await context.close();
  }

  await browser.close();
  console.log("All header responsive tests completed!");
}

main().catch(console.error);
