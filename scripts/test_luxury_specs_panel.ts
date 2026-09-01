import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to story page...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Screenshot Left Column specifically (Cover + New Specs Card)
  const leftCol = page.locator("div.w-48, div.sm\\:w-64, div.md\\:w-72").first();
  await leftCol.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await leftCol.screenshot({ path: path.join(process.cwd(), "test_screenshots", "story_left_column_luxury_specs.png") });
  console.log("Saved story_left_column_luxury_specs.png");

  // Also screenshot Hero Section as a whole
  const heroSection = page.locator("div.relative.overflow-hidden.bg-white\\/5").first();
  await heroSection.screenshot({ path: path.join(process.cwd(), "test_screenshots", "story_hero_section_full.png") });
  console.log("Saved story_hero_section_full.png");

  await browser.close();
  console.log("Luxury specs test completed!");
}

main().catch(console.error);
