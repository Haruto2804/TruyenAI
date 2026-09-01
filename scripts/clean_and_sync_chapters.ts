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

  const files = fs.readdirSync(chaptersDir).filter(f => f.startsWith("chapter_") && f.endsWith(".md"));
  files.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""), 10);
    const numB = parseInt(b.replace(/\D/g, ""), 10);
    return numA - numB;
  });

  console.log(`Found ${files.length} chapter files. Cleaning asterisks and syncing...`);

  for (const file of files) {
    const filePath = path.join(chaptersDir, file);
    let raw = fs.readFileSync(filePath, "utf-8");

    // Clean asterisks from prose lines (preserving headings)
    const lines = raw.split("\n");
    const cleanedLines = lines.map(line => {
      if (line.startsWith("#")) return line;
      // Strip asterisks from prose
      return line.replace(/\*+/g, "");
    });
    const cleanedContent = cleanedLines.join("\n");
    fs.writeFileSync(filePath, cleanedContent, "utf-8");

    // Extract Title & Chapter No
    const chapterMatch = file.match(/chapter_(\d+)\.md/);
    if (!chapterMatch) continue;
    const chapterNo = parseInt(chapterMatch[1], 10);

    const firstLine = cleanedLines.find(l => l.startsWith("# "));
    let title = `Chương ${chapterNo}`;
    if (firstLine) {
      title = firstLine.replace(/^#\s*/, "").replace(/^Chương\s*\d+[:\s-]*/i, "").trim();
    }

    // Extract body content
    const bodyLines = cleanedLines.filter(l => !l.startsWith("# "));
    const bodyContent = bodyLines.join("\n").trim();

    await prisma.chapter.upsert({
      where: {
        storyId_chapterNo: {
          storyId: story.id,
          chapterNo: chapterNo
        }
      },
      update: {
        title: title,
        content: bodyContent,
        isVip: chapterNo > 10,
        price: chapterNo > 10 ? 10 : 0
      },
      create: {
        storyId: story.id,
        chapterNo: chapterNo,
        title: title,
        content: bodyContent,
        isVip: chapterNo > 10,
        price: chapterNo > 10 ? 10 : 0
      }
    });

    console.log(`Cleaned and synced Chapter ${chapterNo}: ${title} -> DB OK`);
  }

  console.log("All chapters cleaned of asterisks and successfully synced to DB!");
}

main().finally(() => prisma.$disconnect());
