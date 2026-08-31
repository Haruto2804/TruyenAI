"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const LEVEL_2_EXP = 10;
const RATE_LIMIT_MS = 60 * 1000; // 60 seconds

export async function addComment(storyId: string, content: string, parentId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Bạn cần đăng nhập để bình luận." };
  }

  const userId = session.user.id;

  // 1. Check Level (Trúc Cơ / EXP >= 10)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { exp: true },
  });

  if (!user || user.exp < LEVEL_2_EXP) {
    return { success: false, message: "Bạn cần đạt cấp Trúc Cơ (10 EXP) để bình luận. Hãy tu luyện thêm nhé!" };
  }

  // 2. Check Rate Limit (1 comment per minute)
  const lastComment = await prisma.comment.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (lastComment) {
    const timeSinceLastComment = Date.now() - lastComment.createdAt.getTime();
    if (timeSinceLastComment < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil((RATE_LIMIT_MS - timeSinceLastComment) / 1000);
      return { success: false, message: `Vui lòng đợi ${waitSeconds}s trước khi gửi bình luận tiếp theo.` };
    }
  }

  // 3. Validation
  if (!content || content.trim().length === 0) {
    return { success: false, message: "Nội dung bình luận không được để trống." };
  }
  if (content.length > 500) {
    return { success: false, message: "Nội dung bình luận quá dài (tối đa 500 ký tự)." };
  }

  // 4. Save Comment (using Transaction just to be safe if we had multiple operations)
  try {
    const newComment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        storyId,
        parentId: parentId || null,
      },
    });

    return { success: true, message: "Gửi bình luận thành công!" };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, message: "Có lỗi xảy ra khi lưu bình luận. Vui lòng thử lại sau." };
  }
}

export async function getComments(storyId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { 
        storyId,
        parentId: null // Only fetch top-level comments first
      },
      include: {
        user: {
          select: { name: true, image: true, exp: true, path: true }
        },
        replies: {
          include: {
            user: {
              select: { name: true, image: true, exp: true, path: true }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    
    return { success: true, comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { success: false, comments: [] };
  }
}
