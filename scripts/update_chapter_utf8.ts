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
    ".agents/viet_truyen/novels/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/chapters/chapter_1.md"
  );

  const rawContent = fs.readFileSync(chapterFile, "utf-8");
  
  // Extract title and content
  const lines = rawContent.split("\n");
  let title = "Tỉnh Giấc Trong Vũng Bùn Nhục Nhã";
  let content = rawContent;

  if (lines[0].startsWith("# ")) {
    title = lines[0].replace("# CHƯƠNG 1: ", "").replace("# ", "").trim();
    content = lines.slice(1).join("\n").trim();
  }

  const chapter = await prisma.chapter.findFirst({
    where: { storyId: story.id, chapterNo: 1 }
  });

  if (chapter) {
    await prisma.chapter.update({
      where: { id: chapter.id },
      data: {
        title,
        content
      }
    });
    console.log("Updated chapter 1 content in UTF-8 successfully!");
  }
}

main().finally(() => prisma.$disconnect());
