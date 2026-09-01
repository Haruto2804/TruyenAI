import { chromium } from "playwright";
import * as path from "path";

async function run() {
  const browser = await chromium.launch();
  
  // 1. Mobile iPhone Pro Max (430x932)
  const mobileContext = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  
  // Screenshot Hero & Specs
  await mobilePage.screenshot({
    path: path.join(process.cwd(), "test_screenshots", "redesign_mobile_hero_specs.png"),
    fullPage: false
  });

  // Open Character Modal
  const firstCharCard = mobilePage.locator('.grid div[class*="group relative cursor-pointer"]').first();
  if (await firstCharCard.isVisible()) {
    await firstCharCard.click();
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({
      path: path.join(process.cwd(), "test_screenshots", "redesign_mobile_char_dossier.png"),
      fullPage: false
    });
    
    // Close character modal
    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(400);
  }

  // Open Lore Modal
  const firstLoreCard = mobilePage.locator('.grid div[class*="border border-white/10"]').first();
  if (await firstLoreCard.isVisible()) {
    await firstLoreCard.click();
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({
      path: path.join(process.cwd(), "test_screenshots", "redesign_mobile_lore_modal.png"),
      fullPage: false
    });
    await mobilePage.keyboard.press("Escape");
  }

  // 2. Desktop (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  
  await desktopPage.screenshot({
    path: path.join(process.cwd(), "test_screenshots", "redesign_desktop_hero_specs.png"),
    fullPage: false
  });

  // Open Desktop Character Split Modal
  const desktopCharCard = desktopPage.locator('.grid div[class*="group relative cursor-pointer"]').first();
  if (await desktopCharCard.isVisible()) {
    await desktopCharCard.click();
    await desktopPage.waitForTimeout(600);
    await desktopPage.screenshot({
      path: path.join(process.cwd(), "test_screenshots", "redesign_desktop_char_split.png"),
      fullPage: false
    });
  }

  await browser.close();
  console.log("Screenshots captured successfully!");
}

run().catch(console.error);
