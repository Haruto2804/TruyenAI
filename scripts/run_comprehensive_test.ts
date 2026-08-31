import { chromium } from "@playwright/test";
import path from "path";

async function testPage() {
  const screenshotsDir = path.join(process.cwd(), "test_screenshots");
  const browser = await chromium.launch();

  const consoleErrors: string[] = [];

  // Desktop Test
  console.log("=== Testing Desktop (1440x900) ===");
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();
  desktopPage.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[Desktop Console Error] ${msg.text()}`);
    }
  });
  desktopPage.on("pageerror", (err) => {
    consoleErrors.push(`[Desktop Page Error] ${err.message}`);
  });

  await desktopPage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", {
    waitUntil: "networkidle"
  });
  await desktopPage.waitForTimeout(800);

  // 1. Screenshot Hero Section with balanced left panel & StorySummary
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_hero_section.png") });

  // 2. Test StorySummary Expand & Collapse
  const expandBtn = desktopPage.locator("button:has-text('Xem thêm')").first();
  if (await expandBtn.isVisible()) {
    console.log("Testing StorySummary Expand...");
    await expandBtn.click();
    await desktopPage.waitForTimeout(400);
    await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_hero_expanded.png") });
    
    const collapseBtn = desktopPage.locator("button:has-text('Thu gọn')").first();
    await collapseBtn.click();
    await desktopPage.waitForTimeout(400);
  }

  // 3. Scroll to Character Section and open Character Modal
  console.log("Testing Character Modal Desktop...");
  const charCard = desktopPage.locator("text=Xem hồ sơ chi tiết").first();
  await charCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(400);
  await charCard.click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_char_modal_centered.png") });

  // Close Character Modal
  await desktopPage.keyboard.press("Escape");
  await desktopPage.waitForTimeout(400);

  // 4. Scroll to Lore Section and open Lore Modal
  console.log("Testing Lore Modal Desktop...");
  const loreCard = desktopPage.locator("text=Chi tiết thuật ngữ").first();
  await loreCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(400);
  await loreCard.click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(screenshotsDir, "desktop_lore_modal_centered.png") });

  // Mobile Test
  console.log("=== Testing Mobile (390x844) ===");
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[Mobile Console Error] ${msg.text()}`);
    }
  });
  mobilePage.on("pageerror", (err) => {
    consoleErrors.push(`[Mobile Page Error] ${err.message}`);
  });

  await mobilePage.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", {
    waitUntil: "networkidle"
  });
  await mobilePage.waitForTimeout(800);

  // 5. Screenshot Mobile Hero
  await mobilePage.screenshot({ path: path.join(screenshotsDir, "mobile_hero_section.png") });

  // 6. Test Character Modal Mobile
  console.log("Testing Character Modal Mobile...");
  const mobileCharCard = mobilePage.locator("text=Xem hồ sơ chi tiết").first();
  await mobileCharCard.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(400);
  await mobileCharCard.click();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, "mobile_char_modal_centered.png") });

  // Close Mobile Character Modal via Escape
  await mobilePage.keyboard.press("Escape");
  await mobilePage.waitForTimeout(400);

  // 7. Test Lore Modal Mobile
  console.log("Testing Lore Modal Mobile...");
  const mobileLoreCard = mobilePage.locator("text=Chi tiết thuật ngữ").first();
  await mobileLoreCard.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(400);
  await mobileLoreCard.click();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(screenshotsDir, "mobile_lore_modal_centered.png") });

  await browser.close();

  console.log("Console Errors found:", consoleErrors);
  console.log("Comprehensive test completed successfully!");
}

testPage().catch(console.error);
