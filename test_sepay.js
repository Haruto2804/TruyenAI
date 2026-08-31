const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testWebhook() {
  // Lấy user đầu tiên trong DB
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log("Không tìm thấy user nào trong DB!");
    process.exit(1);
  }

  const shortId = user.id.substring(0, 8).toUpperCase();
  console.log(`\n======================================================`);
  console.log(`Đang test nạp 50,000 VNĐ cho user ID: ${user.id}`);
  console.log(`(Mã NAP: NAP ${shortId})`);
  console.log(`======================================================\n`);

  // Tạo một payload giả lập từ SePay
  const payload = {
    id: Math.floor(Math.random() * 1000000), // ID giao dịch giả
    gateway: "Vietcombank",
    transactionDate: new Date().toISOString(),
    accountNumber: "0123456789",
    code: `NAP ${shortId}`,
    content: `NGUYEN VAN A CHUYEN TIEN NAP ${shortId}`,
    transferType: "in",
    transferAmount: 50000,
    accumulated: 1000000,
    subAccount: null,
    referenceCode: "MB123456",
    description: ""
  };

  try {
    const res = await fetch('http://localhost:3000/api/sepay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Kết quả từ API trả về:", data);
    console.log("\n-> Hãy ra trình duyệt ấn F5 để kiểm tra số dư Linh Thạch mới nhé!\n");
  } catch (error) {
    console.error("Lỗi gọi API:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhook();
