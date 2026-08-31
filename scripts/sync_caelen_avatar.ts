import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { slug: "dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" }
  });

  if (!story) return;

  const caelen = await prisma.character.findFirst({
    where: {
      storyId: story.id,
      name: { contains: "Caelen" }
    }
  });

  if (caelen) {
    await prisma.character.update({
      where: { id: caelen.id },
      data: {
        avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/caelen-von-ravenwood.jpg"
      }
    });
    console.log("Updated Caelen avatar in database!");
  }
}

main().finally(() => prisma.$disconnect());
