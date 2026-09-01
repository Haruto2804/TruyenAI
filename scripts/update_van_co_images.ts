import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

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

const UPLOADS_DIR = "C:/Users/ngohi/.gemini/antigravity-ide/brain/2959f54a-e4ea-4933-95f5-67fe1fa2fb93/.user_uploaded";

async function uploadToCloudinary(filePath: string, folder: string, publicId: string): Promise<string> {
  const res = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  return res.secure_url;
}

async function main() {
  console.log("🚀 Bắt đầu tải ảnh Vạn Cổ Đệ Nhất Thương Minh lên Cloudinary & Cập nhật DB...");

  const coverSrc = path.join(UPLOADS_DIR, "media_1788247980710.jpg");
  const coTruongKhanhSrc = path.join(UPLOADS_DIR, "media_1788247980690.jpg");
  const thamLacCamSrc = path.join(UPLOADS_DIR, "media_1788247980399.jpg");
  const vuongDangSrc = path.join(UPLOADS_DIR, "media_1788247980377.jpg");
  const vuongChanThienSrc = path.join(UPLOADS_DIR, "media_1788247980363.jpg");

  // 1. Upload Cover
  console.log("📤 Đang tải Cover Vạn Cổ Đệ Nhất Thương Minh...");
  const coverUrl = await uploadToCloudinary(coverSrc, "truyen-ai/covers", "van-co-de-nhat-thuong-minh");
  console.log(`  ✅ Cover URL: ${coverUrl}`);

  // 2. Upload Characters
  console.log("📤 Đang tải ảnh Cố Trường Khanh...");
  const coTruongKhanhUrl = await uploadToCloudinary(coTruongKhanhSrc, "truyen-ai/characters/van-co-de-nhat-thuong-minh", "co-truong-khanh");
  console.log(`  ✅ Cố Trường Khanh URL: ${coTruongKhanhUrl}`);

  console.log("📤 Đang tải ảnh Thẩm Lạc Cẩm...");
  const thamLacCamUrl = await uploadToCloudinary(thamLacCamSrc, "truyen-ai/characters/van-co-de-nhat-thuong-minh", "tham-lac-cam");
  console.log(`  ✅ Thẩm Lạc Cẩm URL: ${thamLacCamUrl}`);

  console.log("📤 Đang tải ảnh Vương Đằng...");
  const vuongDangUrl = await uploadToCloudinary(vuongDangSrc, "truyen-ai/characters/van-co-de-nhat-thuong-minh", "vuong-dang");
  console.log(`  ✅ Vương Đằng URL: ${vuongDangUrl}`);

  console.log("📤 Đang tải ảnh Vương Chấn Thiên...");
  const vuongChanThienUrl = await uploadToCloudinary(vuongChanThienSrc, "truyen-ai/characters/van-co-de-nhat-thuong-minh", "vuong-chan-thien");
  console.log(`  ✅ Vương Chấn Thiên URL: ${vuongChanThienUrl}`);

  // 3. Update Database
  const story = await prisma.story.findUnique({
    where: { slug: "van-co-de-nhat-thuong-minh" },
    include: { characters: true },
  });

  if (!story) {
    throw new Error("Không tìm thấy bộ truyện van-co-de-nhat-thuong-minh trong cơ sở dữ liệu!");
  }

  await prisma.story.update({
    where: { id: story.id },
    data: { coverUrl },
  });
  console.log(`✨ Đã cập nhật Story.coverUrl trong Database.`);

  for (const char of story.characters) {
    let newAvatar = "";
    if (char.name.includes("Cố Trường Khanh")) newAvatar = coTruongKhanhUrl;
    else if (char.name.includes("Thẩm Lạc Cẩm")) newAvatar = thamLacCamUrl;
    else if (char.name.includes("Vương Đằng")) newAvatar = vuongDangUrl;
    else if (char.name.includes("Vương Chấn Thiên")) newAvatar = vuongChanThienUrl;

    if (newAvatar) {
      await prisma.character.update({
        where: { id: char.id },
        data: { avatarUrl: newAvatar },
      });
      console.log(`✨ Đã cập nhật Character.avatarUrl cho [${char.name}].`);
    }
  }

  // 4. Save local backup in public folder
  const localCoverDir = path.join(process.cwd(), "public", "covers");
  const localCharDir = path.join(process.cwd(), "public", "characters", "van-co-de-nhat-thuong-minh");
  fs.mkdirSync(localCoverDir, { recursive: true });
  fs.mkdirSync(localCharDir, { recursive: true });

  fs.copyFileSync(coverSrc, path.join(localCoverDir, "van-co-de-nhat-thuong-minh.jpg"));
  fs.copyFileSync(coTruongKhanhSrc, path.join(localCharDir, "co-truong-khanh.jpg"));
  fs.copyFileSync(thamLacCamSrc, path.join(localCharDir, "tham-lac-cam.jpg"));
  fs.copyFileSync(vuongDangSrc, path.join(localCharDir, "vuong-dang.jpg"));
  fs.copyFileSync(vuongChanThienSrc, path.join(localCharDir, "vuong-chan-thien.jpg"));

  console.log("🎉 Hoàn tất 100%! Tất cả ảnh đã hiển thị trên Cloudinary CDN và giao diện web!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
