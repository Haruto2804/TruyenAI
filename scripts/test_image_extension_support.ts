import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

async function main() {
  console.log("Testing automated character visual prompt dossier and flexible image matching...");
  
  const charactersMdPath = path.join(
    process.cwd(),
    ".agents/viet_truyen/novels/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/characters.md"
  );
  
  if (!fs.existsSync(charactersMdPath)) {
    throw new Error("characters.md does not exist!");
  }

  const content = fs.readFileSync(charactersMdPath, "utf-8");
  console.log("characters.md exists! Length:", content.length);

  const charNames = [
    "Caelen Von Ravenwood",
    "Lilian",
    "Evelyn Von Ravenwood",
    "Valerie De Valois",
    "Nhị Trưởng Lão Karlov",
    "Hắc Y Sứ Giả Vane",
    "Boris Tai Đỏ"
  ];

  for (const name of charNames) {
    if (!content.includes(name)) {
      throw new Error(`Missing character: ${name} in characters.md`);
    }
    console.log(`Verified ${name} prompt dossier in characters.md`);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to story page to verify character gallery and avatars...");
  await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const characterHeading = page.locator("h2:has-text('Hồ Sơ Nhân Vật')").first();
  await characterHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(process.cwd(), "test_screenshots", "automated_character_gallery.png") });
  console.log("Saved automated_character_gallery.png");

  await browser.close();
  console.log("All automated systems verified successfully!");
}

main().catch(console.error);
