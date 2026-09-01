import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

// Load .env manually
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient();

async function uploadFileToCloudinary(filePath: string, folder: string, publicId?: string): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  return result.secure_url;
}

async function main() {
  console.log("==================================================");
  console.log("☁️ BẮT ĐẦU UPLOAD TOÀN BỘ ẢNH LÊN CLOUDINARY");
  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log("==================================================\n");

  const publicDir = path.join(process.cwd(), "public");

  // 1. Upload All Novel Covers
  console.log("--- 1. ĐANG UPLOAD ẢNH BÌA TRUYỆN (COVERS) ---");
  const coversDir = path.join(publicDir, "covers");
  if (fs.existsSync(coversDir)) {
    const coverFiles = fs.readdirSync(coversDir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
    for (const file of coverFiles) {
      const ext = path.extname(file);
      const slug = path.basename(file, ext);
      const fullPath = path.join(coversDir, file);

      console.log(`Uploading Cover: ${slug} (${file})...`);
      try {
        const cloudUrl = await uploadFileToCloudinary(fullPath, "truyen-ai/covers", slug);
        console.log(`  -> URL Cloudinary: ${cloudUrl}`);

        // Update in DB
        await prisma.story.updateMany({
          where: { slug },
          data: { coverUrl: cloudUrl },
        });
        console.log(`  ✅ Đã cập nhật Story [${slug}] vào Database!`);
      } catch (err: any) {
        console.error(`  ❌ Lỗi upload cover [${file}]:`, err.message);
      }
    }
  }

  // 2. Upload All Character Avatars
  console.log("\n--- 2. ĐANG UPLOAD AVATAR NHÂN VẬT (CHARACTERS) ---");
  const charactersDir = path.join(publicDir, "characters");
  if (fs.existsSync(charactersDir)) {
    const novelFolders = fs.readdirSync(charactersDir).filter(f => fs.statSync(path.join(charactersDir, f)).isDirectory());

    for (const novelSlug of novelFolders) {
      console.log(`\n📁 Bộ truyện: [${novelSlug}]`);
      const novelCharDir = path.join(charactersDir, novelSlug);
      const charFiles = fs.readdirSync(novelCharDir).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));

      const story = await prisma.story.findUnique({
        where: { slug: novelSlug },
        include: { characters: true }
      });

      if (!story) {
        console.warn(`  ⚠️ Không tìm thấy Story [${novelSlug}] trong Database!`);
        continue;
      }

      for (const file of charFiles) {
        const ext = path.extname(file);
        const charSlug = path.basename(file, ext);
        const fullPath = path.join(novelCharDir, file);

        console.log(`  Uploading Character: ${charSlug} (${file})...`);
        try {
          const cloudUrl = await uploadFileToCloudinary(fullPath, `truyen-ai/characters/${novelSlug}`, charSlug);
          console.log(`    -> URL Cloudinary: ${cloudUrl}`);

          // Match character in DB
          const matchedChar = story.characters.find(c => {
            const cleanDbName = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-");
            return cleanDbName === charSlug || charSlug.includes(cleanDbName) || cleanDbName.includes(charSlug);
          });

          if (matchedChar) {
            await prisma.character.update({
              where: { id: matchedChar.id },
              data: { avatarUrl: cloudUrl },
            });
            console.log(`    ✅ Đã cập nhật Avatar cho nhân vật [${matchedChar.name}]!`);
          } else {
            console.warn(`    ⚠️ Không khớp được nhân vật trong DB cho file [${file}]`);
          }
        } catch (err: any) {
          console.error(`    ❌ Lỗi upload avatar [${file}]:`, err.message);
        }
      }
    }
  }

  console.log("\n==================================================");
  console.log("🎉 HOÀN TẤT UPLOAD TOÀN BỘ ẢNH LÊN CLOUDINARY!");
  console.log("==================================================");
}

main().catch(console.error).finally(() => prisma.$disconnect());
