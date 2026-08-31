import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  const browser = await chromium.launch();

  // Desktop Reader
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/1", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_chapter_1_rewritten.png") });

  await browser.close();
  console.log("Captured chapter 1 rewritten screenshot!");
}

main().catch(console.error);
