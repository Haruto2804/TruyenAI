import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on("console", msg => console.log("PAGE LOG:", msg.type(), msg.text()));
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));

  console.log("Navigating to page...");
  const resp = await page.goto("http://localhost:3000/truyen/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong");
  console.log("Status:", resp?.status());
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  console.log("Has Caelen:", content.includes("Caelen"));
  console.log("Has Lore:", content.includes("Hắc Tử La Lan"));

  await browser.close();
}

main().catch(console.error);
