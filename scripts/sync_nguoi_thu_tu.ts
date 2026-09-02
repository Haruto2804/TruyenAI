import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { slug: "nguoi-thu-tu" }
  });

  if (!story) {
    console.error("Story not found");
    // List available slugs to help debug
    const stories = await prisma.story.findMany();
    console.log("Available stories:");
    stories.forEach(s => console.log(`- ${s.slug} (${s.title})`));
    return;
  }

  const chaptersDir = path.join(
    process.cwd(),
    ".agents/viet_truyen/novels/nguoi-thu-tu/chapters"
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
    let rawContent = fs.readFileSync(filePath, "utf-8");

    // Clean asterisks from prose lines (preserving headings) - like clean_and_sync_chapters
    const lines = rawContent.split("\n");
    const cleanedLines = lines.map(line => {
      if (line.startsWith("#")) return line;
      // Strip asterisks from prose
      return line.replace(/\*+/g, "");
    });

    const firstLine = cleanedLines.find(l => l.startsWith("# "));
    let title = `Chương ${chapterNo}`;
    if (firstLine) {
      title = firstLine.replace(/^#\s*/, "").trim();
    }

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
        isVip: false,
        price: 0
      },
      create: {
        storyId: story.id,
        chapterNo: chapterNo,
        title: title,
        content: bodyContent,
        isVip: false,
        price: 0
      }
    });

    console.log(`Synced Chapter ${chapterNo}: ${title}`);
  }

  console.log("All chapters synced to Database successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
