import prisma from "../src/lib/prisma";

const DEFAULT_GENRES = [
  { name: "Tiên Hiệp", slug: "tien-hiep", description: "Tu tiên đắc đạo, tầm cầu trường sinh, pháp bảo thông thiên, tranh đoạt thiên địa tạo hóa." },
  { name: "Huyền Huyễn", slug: "huyen-huyen", description: "Thế giới kỳ ảo, dị giới tranh phong, đấu khí, ma pháp, huyết mạch vi tôn." },
  { name: "Xuyên Không", slug: "xuyen-khong", description: "Linh hồn hoặc thể xác xuyên qua thời không, thế giới dị giới hoặc cổ đại." },
  { name: "Hệ Thống", slug: "he-thong", description: "Nhân vật chính sở hữu hệ thống thông minh, nhiệm vụ thưởng phạt, thăng cấp thần tốc." },
  { name: "Phản Diện", slug: "phan-dien", description: "Nhân vật chính quyết đoán, sát phạt, tâm cơ thâm trầm, đóng vai ác nhân quật khởi." },
  { name: "Đô Thị", slug: "do-thi", description: "Bối cảnh hiện đại, thương trường hào môn, ẩn thế cao nhân, thần y lánh đời." },
  { name: "Khoa Huyễn", slug: "khoa-huyen", description: "Công nghệ tương lai, cơ giáp, tinh tế chiến hạm, khám phá vũ trụ vô tận." },
  { name: "Trinh Thám", slug: "trinh-tham", description: "Phá án ly kỳ, giải mã bí ẩn, đấu trí căng thẳng, bí ẩn kinh dị." },
  { name: "Trọng Sinh", slug: "trong-sinh", description: "Chết đi sống lại ở kiếp trước, nắm bắt tiên cơ, nghịch thiên cải mệnh." },
  { name: "Kiếm Hiệp", slug: "kiem-hiep", description: "Giang hồ ân oán, hiệp nghĩa giang hồ, kiếm pháp tuyệt luân, bang phái tranh hùng." },
  { name: "Mạt Thế", slug: "mat-the", description: "Thế giới sụp đổ, tang thi dị biến, sinh tồn khắc nghiệt, xây dựng căn cứ." },
  { name: "Võng Du", slug: "vong-du", description: "Thế giới thực tế ảo, game nhập vai, kỹ năng trang bị, tranh đoạt lãnh địa." },
  { name: "Dị Năng", slug: "di-nang", description: "Năng lực siêu nhiên, dị biến gien, giác tỉnh siêu năng lực bảo vệ hoặc chinh phục." },
  { name: "Cổ Đại", slug: "co-dai", description: "Bối cảnh triều đình, cung đấu quyền mưu, lịch sử hư cấu, chiến tranh vương triều." },
];

async function main() {
  console.log("🌱 SEEDING DEFAULT GENRES INTO DATABASE...");

  for (const genre of DEFAULT_GENRES) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {
        name: genre.name,
        description: genre.description,
      },
      create: genre,
    });
    console.log(`✅ Genre: ${genre.name} (${genre.slug})`);
  }

  const count = await prisma.genre.count();
  console.log(`\n🎉 Seeded successfully! Total genres: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
