import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Tỷ giá (giống trong trang nạp)
const calculateLinhThach = (amount: number) => {
  if (amount >= 100000) return (amount / 10) + 1500;
  if (amount >= 50000) return (amount / 10) + 500;
  if (amount >= 20000) return (amount / 10) + 100;
  return amount / 10;
};

export async function POST(req: Request) {
  try {
    // API KEY từ SePay (Cấu hình trong .env: SEPAY_WEBHOOK_TOKEN)
    const webhookToken = process.env.SEPAY_WEBHOOK_TOKEN;
    if (webhookToken) {
      const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
      const isValid = 
        authHeader === `Bearer ${webhookToken}` || 
        authHeader === `Apikey ${webhookToken}` ||
        authHeader === webhookToken;

      if (!isValid) {
        return NextResponse.json({ success: false, message: "Unauthorized: Invalid webhook token" }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("[SePay Webhook] CRITICAL: SEPAY_WEBHOOK_TOKEN is missing in production. Refusing request.");
      return NextResponse.json({ success: false, message: "Webhook not configured" }, { status: 503 });
    } else {
      console.warn("[SePay Webhook] Warning: SEPAY_WEBHOOK_TOKEN is not configured in development.");
    }

    const data = await req.json();

    // SePay Webhook Payload
    const { 
      id: sepayId,
      transferAmount, 
      content, 
      transferType 
    } = data;

    // Chỉ xử lý tiền vào (in)
    if (transferType !== "in" || transferAmount <= 0) {
      return NextResponse.json({ success: true, message: "Not a valid incoming transaction" });
    }

    // Parse nội dung tìm mã NAP XXXXXXXX
    const contentStr = (content || "").toUpperCase();
    const match = contentStr.match(/NAP\s+([A-Z0-9]{8})/);
    
    if (!match) {
      return NextResponse.json({ success: true, message: "No NAP code found in content" });
    }

    const shortId = match[1].toLowerCase();

    // Tìm user có ID bắt đầu bằng chuỗi 8 ký tự đó
    const user = await prisma.user.findFirst({
      where: {
        id: { startsWith: shortId }
      }
    });

    if (!user) {
      return NextResponse.json({ success: true, message: "User not found for code " + shortId });
    }

    // Kiểm tra xem transaction này đã được xử lý chưa (tránh webhook gọi 2 lần)
    const existingTx = await prisma.transaction.findUnique({
      where: { referenceId: String(sepayId) }
    });

    if (existingTx) {
      return NextResponse.json({ success: true, message: "Transaction already processed" });
    }

    const addedLinhThach = calculateLinhThach(transferAmount);

    // Giao dịch cộng Linh Thạch
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId: user.id,
          amount: addedLinhThach,
          type: "TOPUP",
          description: `Nạp ${transferAmount.toLocaleString()} VNĐ qua ngân hàng`,
          referenceId: String(sepayId),
          status: "SUCCESS"
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          linhThach: { increment: addedLinhThach }
        }
      })
    ]);

    return NextResponse.json({ success: true, message: "Topup successful", linhThach: addedLinhThach });
  } catch (error) {
    console.error("SePay Webhook Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
