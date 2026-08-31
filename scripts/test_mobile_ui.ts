import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function runMobileTest() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log("Launching browser for mobile viewport testing (390x844)...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 / Modern Smartphone
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  const routes = [
    { name: "01_home_mobile", url: "http://localhost:3000/" },
    { name: "02_story_detail_mobile", url: "http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" },
    { name: "03_chapter_reader_mobile", url: "http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/1" },
    { name: "04_topup_mobile", url: "http://localhost:3000/nap-the" }
  ];

  for (const route of routes) {
    console.log(`Testing route: ${route.url}...`);
    try {
      await page.goto(route.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1000);
      
      const screenshotPath = path.join(screenshotsDir, `${route.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot to ${screenshotPath}`);
    } catch (err) {
      console.error(`Error on ${route.url}:`, err);
    }
  }

  // Also test clicking a character card to see modal on mobile
  try {
    console.log("Testing Character Modal on mobile...");
    await page.goto("http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
    
    // Click on the first character card
    const firstCard = page.locator(".aspect-\\[9\\/16\\]").first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(screenshotsDir, "05_character_modal_mobile.png") });
      console.log("Saved character modal screenshot");
    }
  } catch (err) {
    console.error("Error testing character modal:", err);
  }

  await browser.close();
  console.log("Mobile UI testing completed!");
}

runMobileTest().catch(console.error);
