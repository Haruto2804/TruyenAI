import { chromium } from "@playwright/test";
import path from "path";

async function testCharacterModal() {
  const browser = await chromium.launch();
  
  // 1. Test Mobile Modal (375px)
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();

    console.log("Navigating to story page on Mobile (375px)...");
    await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Scroll to Character Gallery
    const firstCharCard = page.locator("h3:has-text('Caelen Von Ravenwood')").first();
    await firstCharCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Click to open character modal
    console.log("Clicking first character card on mobile...");
    await firstCharCard.click();
    await page.waitForTimeout(1000);

    // Screenshot open modal on Mobile
    await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "character_modal_mobile_375.png") });
    console.log("Saved character_modal_mobile_375.png");

    await context.close();
  }

  // 2. Test Desktop Modal (1440px)
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Navigating to story page on Desktop (1440px)...");
    await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const firstCharCard = page.locator("h3:has-text('Caelen Von Ravenwood')").first();
    await firstCharCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    console.log("Clicking first character card on desktop...");
    await firstCharCard.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "character_modal_desktop_1440.png") });
    console.log("Saved character_modal_desktop_1440.png");

    await context.close();
  }

  await browser.close();
  console.log("Modal verification complete!");
}

testCharacterModal().catch(console.error);
