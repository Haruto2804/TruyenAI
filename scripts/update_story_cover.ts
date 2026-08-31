import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findFirst({
    where: {
      OR: [
        { slug: "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" },
        { slug: "dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" }
      ]
    }
  });

  if (!story) {
    console.error("Story not found");
    return;
  }

  await prisma.story.update({
    where: { id: story.id },
    data: {
      coverUrl: "/covers/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong.jpg"
    }
  });

  console.log(`Updated coverUrl for story: ${story.title} -> /covers/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong.jpg`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
