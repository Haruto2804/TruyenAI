"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export interface CharacterItem {
  id: string;
  name: string;
  aliases: string | null;
  role: string | null;
  avatarUrl: string | null;
  description: string | null;
  storyId: string;
}

export async function getPublicCharacters({
  storyId,
  skip = 0,
  take = 8,
  search = ""
}: {
  storyId: string;
  skip?: number;
  take?: number;
  search?: string;
}) {
  try {
    const trimmed = search.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { storyId };
    if (trimmed) {
      where.OR = [
        { name: { contains: trimmed, mode: "insensitive" } },
        { role: { contains: trimmed, mode: "insensitive" } },
        { aliases: { contains: trimmed, mode: "insensitive" } },
      ];
    }

    const [characters, total] = await Promise.all([
      prisma.character.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take,
      }),
      prisma.character.count({ where })
    ]);

    return {
      success: true,
      characters,
      total,
      hasMore: skip + characters.length < total
    };
  } catch (error) {
    console.error("Error fetching public characters:", error);
    return { success: false, characters: [], total: 0, hasMore: false };
  }
}

export async function getAdminCharacters({
  storyId,
  skip = 0,
  take = 12,
  search = ""
}: {
  storyId: string;
  skip?: number;
  take?: number;
  search?: string;
}) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isDev = process.env.NODE_ENV === "development";
  if (!isAdmin && !isDev) {
    return { success: false, error: "Unauthorized", characters: [], total: 0, hasMore: false };
  }

  try {
    const trimmed = search.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { storyId };
    if (trimmed) {
      where.OR = [
        { name: { contains: trimmed, mode: "insensitive" } },
        { role: { contains: trimmed, mode: "insensitive" } },
        { aliases: { contains: trimmed, mode: "insensitive" } },
      ];
    }

    const [characters, total] = await Promise.all([
      prisma.character.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.character.count({ where })
    ]);

    return {
      success: true,
      characters,
      total,
      hasMore: skip + characters.length < total
    };
  } catch (error) {
    console.error("Error fetching admin characters:", error);
    return { success: false, error: "Internal Error", characters: [], total: 0, hasMore: false };
  }
}
