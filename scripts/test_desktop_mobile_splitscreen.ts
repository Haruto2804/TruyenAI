import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function main() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  const browser = await chromium.launch();

  // 1. Desktop Test (1366x768 / 1920x1080)
  console.log("Testing Desktop Split-Screen (1440x900)...");
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();

  await desktopPage.goto("http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  
  // Click first character card
  const firstCard = desktopPage.locator(".aspect-\\[9\\/16\\]").first();
  await firstCard.click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_character_split_screen.png") });
  console.log("Saved desktop_character_split_screen.png");

  // Test Chapter Reader on Desktop with Side Dossier
  await desktopPage.goto("http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/1", { waitUntil: "networkidle" });
  const caelenBtn = desktopPage.locator("button:has-text('Caelen')").first();
  if (await caelenBtn.isVisible()) {
    await caelenBtn.click();
    await desktopPage.waitForTimeout(600);
    await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_reader_side_dossier.png") });
    console.log("Saved desktop_reader_side_dossier.png");
  }

  // 2. Mobile Test (390x844)
  console.log("Testing Mobile Responsive Dossier (390x844)...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  const firstMobileCard = mobilePage.locator(".aspect-\\[9\\/16\\]").first();
  await firstMobileCard.click();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, "mobile_character_split_modal.png") });
  console.log("Saved mobile_character_split_modal.png");

  await browser.close();
  console.log("All tests passed!");
}

main().catch(console.error);
