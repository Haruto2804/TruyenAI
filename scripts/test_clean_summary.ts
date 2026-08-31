import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  const browser = await chromium.launch();

  // Desktop
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await desktopPage.locator(".aspect-\\[9\\/16\\]").first().click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_caelen_clean_summary.png") });

  // Mobile
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await mobilePage.locator(".aspect-\\[9\\/16\\]").first().click();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, "mobile_caelen_clean_summary.png") });

  await browser.close();
  console.log("Captured clean summary screenshots!");
}

main().catch(console.error);
