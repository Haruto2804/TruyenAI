const { chromium } = require('@playwright/test');

const URL = 'http://localhost:3000'; // Đổi URL tại đây nếu cần
const TOTAL_USERS = 1000;
const CONCURRENT_USERS = 50; // Chạy 50 user cùng lúc để tránh crash RAM

async function simulateUsers() {
  console.log(`Bắt đầu giả lập ${TOTAL_USERS} user truy cập ${URL}...`);
  console.log(`Chạy đồng thời: ${CONCURRENT_USERS} users mỗi batch.`);
  
  // Khởi chạy 1 trình duyệt duy nhất
  const browser = await chromium.launch({ headless: true });
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < TOTAL_USERS; i += CONCURRENT_USERS) {
    const batchSize = Math.min(CONCURRENT_USERS, TOTAL_USERS - i);
    console.log(`Đang chạy batch từ user ${i + 1} đến ${i + batchSize}...`);
    
    const promises = Array.from({ length: batchSize }).map(async (_, index) => {
      const userNumber = i + index + 1;
      let context;
      try {
        // Mỗi user là 1 incognito context (cookie/session riêng hoàn toàn)
        context = await browser.newContext();
        const page = await context.newPage();
        
        // Truy cập trang web
        await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        // Giả lập thao tác người dùng (đợi 1-3 giây rồi cuộn trang)
        await page.waitForTimeout(Math.random() * 2000 + 1000);
        await page.evaluate(() => window.scrollBy(0, 500));
        
        // Đóng trang
        await context.close();
        successCount++;
      } catch (err) {
        errorCount++;
        console.error(`- Lỗi ở user ${userNumber}: ${err.message}`);
        if (context) await context.close().catch(() => {});
      }
    });

    // Đợi batch hiện tại xong mới chạy batch tiếp theo
    await Promise.all(promises);
  }

  await browser.close();
  console.log('=== HOÀN TẤT GIẢ LẬP ===');
  console.log(`Tổng số request thành công: ${successCount}`);
  console.log(`Tổng số request lỗi: ${errorCount}`);
}

simulateUsers().catch(console.error);
