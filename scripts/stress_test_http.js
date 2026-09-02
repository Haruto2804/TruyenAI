const URL = 'http://localhost:3000'; // Đổi URL tại đây
const CONCURRENCY_LEVELS = [3, 10, 50, 100, 300, 500, 1000]; // Tăng dần số lượng user

async function fetchWithTiming(url) {
  const start = performance.now();
  try {
    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    const end = performance.now();
    return {
      success: response.ok,
      status: response.status,
      timeMs: end - start
    };
  } catch (error) {
    const end = performance.now();
    return {
      success: false,
      status: 'ERROR',
      timeMs: end - start
    };
  }
}

async function runLoadTest(concurrency) {
  console.log(`\n⏳ Đang test với ${concurrency} user truy cập đồng thời...`);
  
  const promises = [];
  for (let i = 0; i < concurrency; i++) {
    promises.push(fetchWithTiming(URL));
  }

  const results = await Promise.all(promises);

  const successfulRequests = results.filter(r => r.success);
  const failedRequests = results.filter(r => !r.success);
  
  const times = successfulRequests.map(r => r.timeMs).sort((a, b) => a - b);
  
  const minTime = times.length > 0 ? times[0] : 0;
  const maxTime = times.length > 0 ? times[times.length - 1] : 0;
  const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  
  // Tính p95 (95% request hoàn thành dưới thời gian này)
  const p95Index = Math.floor(times.length * 0.95);
  const p95Time = times.length > 0 ? times[p95Index] : 0;

  return {
    'Số User (Concurrency)': concurrency,
    'Thành công': successfulRequests.length,
    'Thất bại': failedRequests.length,
    'Nhanh nhất (ms)': Math.round(minTime),
    'Chậm nhất (ms)': Math.round(maxTime),
    'Trung bình (ms)': Math.round(avgTime),
    'P95 (ms)': Math.round(p95Time), // Thời gian của 95% request
  };
}

async function main() {
  console.log(`🚀 Bắt đầu bài Test Chịu Tải (Stress Test) HTTP cho URL: ${URL}`);
  console.log('Lưu ý: Đang đo tốc độ phản hồi của Server, không bao gồm thời gian render giao diện trên trình duyệt.\n');

  const statsTable = [];

  for (const level of CONCURRENCY_LEVELS) {
    const stats = await runLoadTest(level);
    statsTable.push(stats);
    // Tạm nghỉ 2 giây giữa mỗi lần test để server "thở"
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n📊 BẢNG THỐNG KÊ KẾT QUẢ TEST CHỊU TẢI:\n');
  console.table(statsTable);
  console.log('\n✅ Hoàn tất bài test!');
}

main().catch(console.error);
