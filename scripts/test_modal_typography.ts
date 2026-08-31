import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  const browser = await chromium.launch();

  // Desktop Context
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(1000);

  // Scroll to Character Section
  await desktopPage.evaluate(() => window.scrollBy(0, 700));
  await desktopPage.waitForTimeout(500);

  // Click on the character card in the CharacterGallery
  const charHeading = desktopPage.locator("h2:has-text('Hồ Sơ Nhân Vật')");
  await charHeading.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);

  const charCards = desktopPage.locator("text=Xem hồ sơ chi tiết");
  await charCards.first().click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_char_dossier_responsive.png") });

  // Close char modal
  await desktopPage.keyboard.press("Escape");
  await desktopPage.waitForTimeout(500);

  // Scroll to Lore Section
  const loreHeading = desktopPage.locator("h2:has-text('Bách Khoa Chú Giải')");
  await loreHeading.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);

  const loreCards = desktopPage.locator("text=Chi tiết thuật ngữ");
  await loreCards.first().click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_lore_modal_responsive.png") });

  // Mobile Context
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);

  // Scroll to Character Section on Mobile
  const mobileCharHeading = mobilePage.locator("h2:has-text('Hồ Sơ Nhân Vật')");
  await mobileCharHeading.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);

  const mobileCharCards = mobilePage.locator("text=Xem hồ sơ chi tiết");
  await mobileCharCards.first().click();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, "mobile_char_dossier_responsive.png") });

  await browser.close();
  console.log("Captured updated responsive modal screenshots!");
}

main().catch(console.error);
