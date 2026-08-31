"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function addExpToUser(chapterId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Not logged in" };
  }

  const userId = session.user.id;

  try {
    // Attempt to create a read history record
    // If it already exists, the unique constraint will throw an error
    await prisma.readHistory.create({
      data: {
        userId,
        chapterId,
      }
    });

    // Check daily reading mission (10 Linh Thạch/ngày)
    const today = new Date().toISOString().split('T')[0];
    const dailyReadMission = await prisma.userMission.findUnique({
      where: {
        userId_dateString_type: {
          userId,
          dateString: today,
          type: "DAILY_READ"
        }
      }
    });

    let linhThachGained = 0;
    if (!dailyReadMission) {
      await prisma.userMission.create({
        data: {
          userId,
          dateString: today,
          type: "DAILY_READ",
          isClaimed: true
        }
      });
      linhThachGained = 10; // Thưởng 10 Linh Thạch
      
      // Tạo lịch sử giao dịch nhận thưởng
      await prisma.transaction.create({
        data: {
          userId,
          amount: linhThachGained,
          type: "MISSION_REWARD",
          description: "Thưởng đọc truyện hằng ngày",
          status: "SUCCESS"
        }
      });
    }

    // Award 10 EXP and Linh Thạch (if any)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        exp: {
          increment: 10
        },
        linhThach: {
          increment: linhThachGained
        }
      }
    });

    return { 
      success: true, 
      expGained: 10,
      linhThachGained,
      totalExp: updatedUser.exp 
    };

  } catch (error: any) {
    // Unique constraint violation means they already read this chapter
    if (error.code === 'P2002') {
      return { success: false, message: "Already read this chapter" };
    }
    console.error("Error adding EXP:", error);
    return { success: false, message: "Server error" };
  }
}

export async function updateUserPath(path: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Not logged in" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { path }
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}

export async function updateDisplayName(displayName: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Not logged in" };
  }

  if (!displayName || displayName.trim().length === 0) {
    return { success: false, message: "Tên hiển thị không được để trống" };
  }

  if (displayName.trim().length > 30) {
    return { success: false, message: "Tên hiển thị tối đa 30 ký tự" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { displayName: displayName.trim() }
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Server error" };
  }
}
