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

  const chapterFile = path.join(
    process.cwd(),
    ".agents/viet_truyen/novels/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/chapters/chapter_2.md"
  );

  const rawContent = fs.readFileSync(chapterFile, "utf-8");
  
  // Extract title and content
  const lines = rawContent.split("\n");
  let title = "Bản Hợp Đồng Trên Bàn Cờ Quyền Lực";
  let content = rawContent;

  if (lines[0].startsWith("# ")) {
    title = lines[0].replace("# CHƯƠNG 2: ", "").replace("# ", "").trim();
    content = lines.slice(1).join("\n").trim();
  }

  const existingChapter = await prisma.chapter.findFirst({
    where: { storyId: story.id, chapterNo: 2 }
  });

  if (existingChapter) {
    await prisma.chapter.update({
      where: { id: existingChapter.id },
      data: {
        title,
        content
      }
    });
    console.log("Updated chapter 2 in database successfully!");
  } else {
    await prisma.chapter.create({
      data: {
        storyId: story.id,
        chapterNo: 2,
        title,
        content,
        isVip: false,
        price: 0
      }
    });
    console.log("Created and synced Chapter 2 into database successfully!");
  }
}

main().finally(() => prisma.$disconnect());
