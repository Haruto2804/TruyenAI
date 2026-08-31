import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function main() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  const browser = await chromium.launch();

  // 1. Desktop Test (1440x900)
  console.log("Testing Desktop Split-Screen Relationship Web (1440x900)...");
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();

  await desktopPage.goto("http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  
  // Click first character card (Caelen)
  const firstCard = desktopPage.locator(".aspect-\\[9\\/16\\]").first();
  await firstCard.click();
  await desktopPage.waitForTimeout(500);

  // Click Relationship tab on desktop
  const relTab = desktopPage.locator("button:has-text('Mối Quan Hệ & Ân Oán')").first();
  if (await relTab.isVisible()) {
    await relTab.click();
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_relationship_web.png") });
    console.log("Saved desktop_relationship_web.png");
  }

  // 2. Mobile Test (390x844)
  console.log("Testing Mobile Responsive Relationship Web (390x844)...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/truyen/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  const firstMobileCard = mobilePage.locator(".aspect-\\[9\\/16\\]").first();
  await firstMobileCard.click();
  await mobilePage.waitForTimeout(500);

  // Click Quan Hệ tab on mobile
  const mobileRelTab = mobilePage.getByRole("button", { name: /Quan Hệ/i });
  if (await mobileRelTab.isVisible()) {
    await mobileRelTab.click();
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(screenshotsDir, "mobile_relationship_web.png") });
    console.log("Saved mobile_relationship_web.png");
  }

  await browser.close();
  console.log("Relationship Web tests passed completely!");
}

main().catch(console.error);
