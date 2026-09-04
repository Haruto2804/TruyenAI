"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export interface PublicChapterItem {
  id: string;
  chapterNo: number;
  title: string;
  createdAt: Date;
  isVip?: boolean;
  price?: number;
}

export interface AdminChapterItem {
  id: string;
  chapterNo: number;
  title: string;
  createdAt: Date;
  contentLength: number;
}

export async function getPublicChapters({
  storyId,
  skip = 0,
  take = 30,
  order = "asc",
  search = ""
}: {
  storyId: string;
  skip?: number;
  take?: number;
  order?: "asc" | "desc";
  search?: string;
}) {
  try {
    const trimmed = search.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { storyId };

    if (trimmed) {
      const chapterNoSearch = parseInt(trimmed, 10);
      if (!isNaN(chapterNoSearch)) {
        where.OR = [
          { chapterNo: chapterNoSearch },
          { title: { contains: trimmed, mode: "insensitive" } }
        ];
      } else {
        where.title = { contains: trimmed, mode: "insensitive" };
      }
    }

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where,
        orderBy: { chapterNo: order },
        skip,
        take,
        select: {
          id: true,
          chapterNo: true,
          title: true,
          createdAt: true,
          isVip: true,
          price: true
        }
      }),
      prisma.chapter.count({ where })
    ]);

    return {
      success: true,
      chapters,
      total,
      hasMore: skip + chapters.length < total
    };
  } catch (error) {
    console.error("Error fetching public chapters:", error);
    return { success: false, chapters: [], total: 0, hasMore: false };
  }
}

export async function getAdminChapters({
  storyId,
  skip = 0,
  take = 30,
  order = "desc",
  search = ""
}: {
  storyId: string;
  skip?: number;
  take?: number;
  order?: "asc" | "desc";
  search?: string;
}) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isDev = process.env.NODE_ENV === "development";
  if (!isAdmin && !isDev) {
    return { success: false, error: "Unauthorized", chapters: [], total: 0, hasMore: false };
  }

  try {
    const trimmed = search.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { storyId };

    if (trimmed) {
      const chapterNoSearch = parseInt(trimmed, 10);
      if (!isNaN(chapterNoSearch)) {
        where.OR = [
          { chapterNo: chapterNoSearch },
          { title: { contains: trimmed, mode: "insensitive" } }
        ];
      } else {
        where.title = { contains: trimmed, mode: "insensitive" };
      }
    }

    const [chaptersRaw, total] = await Promise.all([
      prisma.chapter.findMany({
        where,
        orderBy: { chapterNo: order },
        skip,
        take,
        select: {
          id: true,
          chapterNo: true,
          title: true,
          createdAt: true,
          content: true
        }
      }),
      prisma.chapter.count({ where })
    ]);

    const chapters: AdminChapterItem[] = chaptersRaw.map((c) => ({
      id: c.id,
      chapterNo: c.chapterNo,
      title: c.title,
      createdAt: c.createdAt,
      contentLength: c.content.length
    }));

    return {
      success: true,
      chapters,
      total,
      hasMore: skip + chapters.length < total
    };
  } catch (error) {
    console.error("Error fetching admin chapters:", error);
    return { success: false, error: "Internal Error", chapters: [], total: 0, hasMore: false };
  }
}
