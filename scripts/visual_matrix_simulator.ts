import { chromium, devices } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Ma trận thiết bị cần giả lập
const DEVICE_MATRIX = [
  { name: "iPhone_14_Pro_Max", config: devices["iPhone 14 Pro Max"] },
  { name: "Pixel_7", config: devices["Pixel 7"] },
  { name: "iPad_Pro_11", config: devices["iPad Pro 11"] },
  { name: "Desktop_1920x1080", config: { viewport: { width: 1920, height: 1080 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } },
  { name: "Mobile_Compact_360", config: { viewport: { width: 360, height: 740 }, userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G960F)" } },
];

// Danh sách các URL cần quét và kiểm tra
const TEST_ROUTES = [
  { path: "/", label: "Trang_Chu" },
  { path: "/truyen/ta-sinh-ra-la-phan-dien", label: "Chi_Tiet_Truyen" },
  { path: "/truyen/ta-sinh-ra-la-phan-dien/1", label: "Doc_Chuong_1" },
];

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.join(process.cwd(), "test_artifacts", "visual_matrix");

interface InspectionIssue {
  device: string;
  route: string;
  type: "OVERFLOW" | "BROKEN_IMAGE" | "LAYOUT_WIDTH";
  details: string;
  screenshot: string;
}

async function runVisualMatrixSimulator() {
  console.log("==================================================");
  console.log("🚀 BẮT ĐẦU GIẢ LẬP ĐA THIẾT BỊ VÀ QUÉT LỖI TEXT/GIAO DIỆN");
  console.log("==================================================\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const issues: InspectionIssue[] = [];

  for (const dev of DEVICE_MATRIX) {
    console.log(`📱 Giả lập thiết bị: [${dev.name}] (Kích thước: ${dev.config.viewport?.width}x${dev.config.viewport?.height})`);
    const deviceDir = path.join(OUTPUT_DIR, dev.name);
    if (!fs.existsSync(deviceDir)) {
      fs.mkdirSync(deviceDir, { recursive: true });
    }

    const context = await browser.newContext({
      ...dev.config,
    });

    const page = await context.newPage();

    for (const route of TEST_ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      const screenshotFileName = `${route.label}.png`;
      const screenshotPath = path.join(deviceDir, screenshotFileName);

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
        // Chờ 1 chút để font và animation render ổn định
        await page.waitForTimeout(1000);

        // 1. Chụp ảnh màn hình Viewport
        await page.screenshot({ path: screenshotPath, fullPage: false });

        // 2. Phân tích DOM tìm lỗi tràn viền (Horizontal Overflow)
        const analysis = await page.evaluate(() => {
          const docWidth = document.documentElement.clientWidth;
          const bodyWidth = document.body.scrollWidth;
          const overflows: Array<{ tag: string; className: string; text: string; width: number }> = [];

          // Quét tất cả các phần tử xem có phần tử nào đâm ra ngoài viewport không
          const elements = document.querySelectorAll("*");
          elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 2 && rect.width > 0 && rect.height > 0) {
              const textContent = (el as HTMLElement).innerText?.slice(0, 40) || "";
              overflows.push({
                tag: el.tagName.toLowerCase(),
                className: (el as HTMLElement).className?.toString().slice(0, 50) || "",
                text: textContent.replace(/\n/g, " "),
                width: Math.round(rect.width),
              });
            }
          });

          // Quét ảnh bị vỡ
          const brokenImages: string[] = [];
          const images = document.querySelectorAll("img");
          images.forEach((img) => {
            if (img.complete && img.naturalWidth === 0) {
              brokenImages.push(img.src);
            }
          });

          return {
            hasHorizontalScroll: bodyWidth > docWidth + 2,
            docWidth,
            bodyWidth,
            overflowElements: overflows.slice(0, 3), // Lấy top 3 lỗi tiêu biểu
            brokenImages,
          };
        });

        if (analysis.hasHorizontalScroll) {
          console.warn(`  ⚠️ Cảnh báo tràn ngang trên ${route.label} (${analysis.bodyWidth}px > ${analysis.docWidth}px)`);
          issues.push({
            device: dev.name,
            route: route.path,
            type: "LAYOUT_WIDTH",
            details: `Tràn chiều ngang màn hình: bodyWidth=${analysis.bodyWidth}px > viewport=${analysis.docWidth}px`,
            screenshot: screenshotPath,
          });
        }

        if (analysis.overflowElements.length > 0) {
          analysis.overflowElements.forEach((item) => {
            issues.push({
              device: dev.name,
              route: route.path,
              type: "OVERFLOW",
              details: `<${item.tag} class="${item.className}"> text: "${item.text}"`,
              screenshot: screenshotPath,
            });
          });
        }

        if (analysis.brokenImages.length > 0) {
          issues.push({
            device: dev.name,
            route: route.path,
            type: "BROKEN_IMAGE",
            details: `Ảnh bị lỗi load: ${analysis.brokenImages.join(", ")}`,
            screenshot: screenshotPath,
          });
        }

        console.log(`  ✅ Đã quét [${route.label}] -> Ảnh: test_artifacts/visual_matrix/${dev.name}/${screenshotFileName}`);
      } catch (err: any) {
        console.error(`  ❌ Lỗi khi duyệt ${url}: ${err.message}`);
      }
    }

    await context.close();
    console.log("");
  }

  await browser.close();

  // Báo cáo tổng kết
  console.log("==================================================");
  console.log("📊 BÁO CÁO TỔNG KẾT KIỂM THỬ GIAO DIỆN MA TRẬN");
  console.log("==================================================");
  if (issues.length === 0) {
    console.log("🎉 TẤT CẢ GIAO DIỆN HOÀN HẢO! Không phát hiện lỗi tràn viền, text đâm ra ngoài hay ảnh vỡ trên bất kỳ thiết bị nào.");
  } else {
    console.log(`⚠️ Phát hiện ${issues.length} vấn đề cần lưu ý:`);
    issues.forEach((iss, index) => {
      console.log(`\n[#${index + 1}] Thiết bị: ${iss.device} | Route: ${iss.route}`);
      console.log(`    Loại: ${iss.type}`);
      console.log(`    Chi tiết: ${iss.details}`);
      console.log(`    Ảnh chụp: ${iss.screenshot}`);
    });
  }
  console.log(`\n📁 Toàn bộ ảnh chụp đã được lưu tại: ${OUTPUT_DIR}\n`);
}

runVisualMatrixSimulator().catch((err) => {
  console.error("Lỗi thực thi kiểm thử ma trận:", err);
});
