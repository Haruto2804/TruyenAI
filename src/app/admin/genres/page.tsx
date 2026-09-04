import prisma from "@/lib/prisma";
import { GenreManagement } from "@/components/admin/GenreManagement";

export default async function AdminGenresPage() {
  const [genres, stories] = await Promise.all([
    prisma.genre.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.story.findMany({
      select: { genre: true },
    }),
  ]);

  // Compute story counts for each genre
  const genresWithCounts = genres.map((g) => {
    const count = stories.filter((s) => {
      if (!s.genre) return false;
      const lowerGenre = s.genre.toLowerCase();
      const lowerName = g.name.toLowerCase();
      return lowerGenre.includes(lowerName);
    }).length;

    return {
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description,
      createdAt: g.createdAt,
      storyCount: count,
    };
  });

  return (
    <div className="space-y-6">
      <GenreManagement initialGenres={genresWithCounts} />
    </div>
  );
}
