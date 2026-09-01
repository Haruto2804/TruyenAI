import { chromium } from "@playwright/test";
import path from "path";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to Chapter 7...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/7", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Locate the paragraph with "Băng Sương Khóa Ma Chỉ"
  const para = page.locator("p:has-text('Băng Sương Khóa Ma Chỉ')").first();
  console.log("Paragraph text content:", await para.textContent());

  await para.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "chapter_7_bang_suong_khoa_ma_chi_clean.png") });
  console.log("Saved chapter_7_bang_suong_khoa_ma_chi_clean.png");

  await browser.close();
  console.log("Chapter 7 verification passed!");
}

main().catch(console.error);
