import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

// Load .env
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

async function main() {
  const slug = "van-co-de-nhat-thuong-minh";
  const filePath = path.join(process.cwd(), "public", "covers", "van-co-de-nhat-thuong-minh.jpg");

  console.log(`Đang tải ảnh bìa mới cho [${slug}] lên Cloudinary...`);
  
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    folder: "truyen-ai/covers",
    public_id: slug,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });

  const secureUrl = uploadResult.secure_url;
  console.log(`✅ Upload Cloudinary thành công: ${secureUrl}`);

  const updatedStory = await prisma.story.update({
    where: { slug },
    data: { coverUrl: secureUrl },
    select: { id: true, title: true, slug: true, coverUrl: true },
  });

  console.log("✅ Đã cập nhật Story trong Database:", updatedStory);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
