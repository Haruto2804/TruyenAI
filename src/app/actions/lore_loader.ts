"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export interface LoreItem {
  id: string;
  term: string;
  category: string | null;
  definition: string;
  aliases: string | null;
  storyId: string;
}

export async function getPublicLores({
  storyId,
  category = "ALL",
  skip = 0,
  take = 8,
  search = ""
}: {
  storyId: string;
  category?: string;
  skip?: number;
  take?: number;
  search?: string;
}) {
  try {
    const trimmed = search.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { storyId };

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (trimmed) {
      where.OR = [
        { term: { contains: trimmed, mode: "insensitive" } },
        { definition: { contains: trimmed, mode: "insensitive" } },
        { aliases: { contains: trimmed, mode: "insensitive" } },
      ];
    }

    const [lores, total] = await Promise.all([
      prisma.lore.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take,
      }),
      prisma.lore.count({ where })
    ]);

    return {
      success: true,
      lores,
      total,
      hasMore: skip + lores.length < total
    };
  } catch (error) {
    console.error("Error fetching public lores:", error);
    return { success: false, lores: [], total: 0, hasMore: false };
  }
}

export async function getAdminLores({
  storyId,
  category,
  skip = 0,
  take = 12,
  search = ""
}: {
  storyId: string;
  category?: string;
  skip?: number;
  take?: number;
  search?: string;
}) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isDev = process.env.NODE_ENV === "development";
  if (!isAdmin && !isDev) {
    return { success: false, error: "Unauthorized", lores: [], total: 0, hasMore: false };
  }

  try {
    const trimmed = search.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { storyId };

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (trimmed) {
      where.OR = [
        { term: { contains: trimmed, mode: "insensitive" } },
        { definition: { contains: trimmed, mode: "insensitive" } },
        { aliases: { contains: trimmed, mode: "insensitive" } },
      ];
    }

    const [lores, total] = await Promise.all([
      prisma.lore.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.lore.count({ where })
    ]);

    return {
      success: true,
      lores,
      total,
      hasMore: skip + lores.length < total
    };
  } catch (error) {
    console.error("Error fetching admin lores:", error);
    return { success: false, error: "Internal Error", lores: [], total: 0, hasMore: false };
  }
}
