"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Mua chương VIP
export async function purchaseChapter(chapterId: string, price: number) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Bạn cần đăng nhập để mua chương" };
  }

  const userId = session.user.id;

  try {
    // Lấy thông tin user (để đảm bảo số dư chính xác nhất)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { linhThach: true }
    });

    if (!user) return { success: false, message: "Không tìm thấy user" };
    if (user.linhThach < price) {
      return { success: false, message: "Không đủ Linh Thạch" };
    }

    // Kiểm tra đã mua chưa
    const existing = await prisma.unlockedChapter.findUnique({
      where: { userId_chapterId: { userId, chapterId } }
    });

    if (existing) {
      return { success: true, message: "Đã mua chương này" };
    }

    // Thực hiện trừ tiền và lưu lịch sử mua
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { linhThach: { decrement: price } }
      }),
      prisma.unlockedChapter.create({
        data: {
          userId,
          chapterId,
          price
        }
      }),
      prisma.transaction.create({
        data: {
          userId,
          amount: -price,
          type: "UNLOCK_CHAPTER",
          description: `Mua chương VIP`,
          status: "SUCCESS"
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error("Purchase error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}

// Tặng thưởng tác giả
export async function donateToStory(storyId: string, amount: number) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Bạn cần đăng nhập để tặng thưởng" };
  }

  if (amount <= 0) return { success: false, message: "Số Linh Thạch không hợp lệ" };

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { linhThach: true }
    });

    if (!user || user.linhThach < amount) {
      return { success: false, message: "Không đủ Linh Thạch" };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { linhThach: { decrement: amount } }
      }),
      prisma.transaction.create({
        data: {
          userId,
          amount: -amount,
          type: "DONATE",
          description: `Tặng thưởng cho truyện ID: ${storyId}`,
          status: "SUCCESS"
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error("Donate error:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}
