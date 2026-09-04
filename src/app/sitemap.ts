import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://thienthuai.com";

  // Lấy danh sách truyện và chương mới nhất
  const stories = await prisma.story.findMany({
    select: {
      slug: true,
      updatedAt: true,
      chapters: {
        select: {
          chapterNo: true,
          updatedAt: true,
        },
        orderBy: { chapterNo: "desc" },
        take: 5, // Top 5 chương mới nhất mỗi truyện để sitemap không quá nặng
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tu-truyen`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/nap-the`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${baseUrl}/truyen/${story.slug}`,
    lastModified: story.updatedAt,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const chapterRoutes: MetadataRoute.Sitemap = stories.flatMap((story) =>
    story.chapters.map((chap) => ({
      url: `${baseUrl}/truyen/${story.slug}/${chap.chapterNo}`,
      lastModified: chap.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...storyRoutes, ...chapterRoutes];
}
