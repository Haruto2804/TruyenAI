import { chromium } from "@playwright/test";
import path from "path";

async function testHoverAndMobileSheet() {
  const browser = await chromium.launch();

  // 1. Test PC Hover Tooltip (1440px)
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Navigating to chapter reader on Desktop (1440px)...");
    await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/1", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Find first interactive character or lore button
    const interactiveWord = page.locator("button:has-text('Caelen')").first();
    await interactiveWord.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    console.log("Hovering over interactive word 'Caelen' on PC...");
    await interactiveWord.hover();
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "pc_hover_tooltip_card.png") });
    console.log("Saved pc_hover_tooltip_card.png");

    await context.close();
  }

  // 2. Test Mobile Bottom-Sheet on Click (375px)
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();

    console.log("Navigating to chapter reader on Mobile (375px)...");
    await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/1", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const interactiveWord = page.locator("button:has-text('Caelen')").first();
    await interactiveWord.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    console.log("Clicking/Tapping interactive word on Mobile...");
    await interactiveWord.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "mobile_bottom_sheet_annotation.png") });
    console.log("Saved mobile_bottom_sheet_annotation.png");

    await context.close();
  }

  await browser.close();
  console.log("Interactive Reader Hover & Mobile Bottom Sheet verification complete!");
}

testHoverAndMobileSheet().catch(console.error);
