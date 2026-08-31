"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(storyId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Yêu cầu đăng nhập" };
  }

  const userId = session.user.id;

  try {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      revalidatePath(`/truyen/[slug]`, "page");
      return { success: true, isBookmarked: false, message: "Đã xóa khỏi Tủ Truyện" };
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          storyId,
        },
      });
      revalidatePath(`/truyen/[slug]`, "page");
      return { success: true, isBookmarked: true, message: "Đã thêm vào Tủ Truyện" };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, message: "Lỗi hệ thống" };
  }
}

export async function updateReadingProgress(storyId: string, chapterId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const userId = session.user.id;

  try {
    const existing = await prisma.readingProgress.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId,
        },
      },
    });

    if (existing) {
      // Only update if it's a different chapter to save DB writes
      if (existing.chapterId !== chapterId) {
        await prisma.readingProgress.update({
          where: { id: existing.id },
          data: { chapterId },
        });
      }
    } else {
      await prisma.readingProgress.create({
        data: {
          userId,
          storyId,
          chapterId,
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating reading progress:", error);
    return { success: false };
  }
}
