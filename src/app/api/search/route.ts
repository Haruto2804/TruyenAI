import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 1) {
      return NextResponse.json({ stories: [] });
    }

    const stories = await prisma.story.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { genre: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        genre: true,
        coverUrl: true,
        updatedAt: true,
        _count: {
          select: { chapters: true },
        },
      },
      take: 8,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("[Search API Error]:", error);
    return NextResponse.json({ stories: [] }, { status: 500 });
  }
}
