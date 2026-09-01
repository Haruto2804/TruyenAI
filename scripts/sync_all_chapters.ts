import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { slug: "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" }
  });

  if (!story) {
    console.error("Story not found");
    return;
  }

  const chaptersDir = path.join(
    process.cwd(),
    ".agents/viet_truyen/novels/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/chapters"
  );

  const files = fs.readdirSync(chaptersDir)
    .filter(f => f.startsWith("chapter_") && f.endsWith(".md"))
    .sort((a, b) => {
      const numA = parseInt(a.replace("chapter_", "").replace(".md", ""), 10);
      const numB = parseInt(b.replace("chapter_", "").replace(".md", ""), 10);
      return numA - numB;
    });

  console.log(`Found ${files.length} chapter files:`, files);

  for (const file of files) {
    const chapterNo = parseInt(file.replace("chapter_", "").replace(".md", ""), 10);
    const filePath = path.join(chaptersDir, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");

    const lines = rawContent.split("\n");
    let title = `Chương ${chapterNo}`;
    let content = rawContent;

    if (lines[0].startsWith("# ")) {
      title = lines[0].replace(/^#\s+(CHƯƠNG\s+\d+:\s+)?/i, "").trim();
      content = lines.slice(1).join("\n").trim();
    }

    const existing = await prisma.chapter.findFirst({
      where: { storyId: story.id, chapterNo }
    });

    if (existing) {
      await prisma.chapter.update({
        where: { id: existing.id },
        data: {
          title: `Chương ${chapterNo}: ${title}`,
          content
        }
      });
      console.log(`Updated Chapter ${chapterNo}: ${title}`);
    } else {
      await prisma.chapter.create({
        data: {
          storyId: story.id,
          chapterNo,
          title: `Chương ${chapterNo}: ${title}`,
          content,
          isVip: false,
          price: 0
        }
      });
      console.log(`Created Chapter ${chapterNo}: ${title}`);
    }
  }

  console.log("All chapters synced to Database successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
