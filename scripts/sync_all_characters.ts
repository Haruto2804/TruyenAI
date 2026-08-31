import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { slug: "dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" }
  });

  if (!story) return;

  const characters = [
    {
      name: "Caelen Von Ravenwood",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/caelen-von-ravenwood.jpg"
    },
    {
      name: "Lilian",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/lilian.jpg"
    },
    {
      name: "Evelyn Von Ravenwood",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/evelyn-von-ravenwood.jpg"
    },
    {
      name: "Valerie De Valois",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/valerie-de-valois.jpg"
    }
  ];

  for (const char of characters) {
    const found = await prisma.character.findFirst({
      where: {
        storyId: story.id,
        name: { contains: char.name.split(" ")[0] }
      }
    });

    if (found) {
      await prisma.character.update({
        where: { id: found.id },
        data: { avatarUrl: char.avatarUrl }
      });
      console.log(`Updated ${char.name} avatar -> ${char.avatarUrl}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
