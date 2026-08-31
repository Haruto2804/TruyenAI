import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { slug: "dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" }
  });

  if (!story) return;

  const characters = [
    {
      name: "Caelen Von Ravenwood",
      role: "Nhân vật chính / Đệ tam công tử Gia Tộc Ravenwood",
      aliases: "Đống rác Bắc Cảnh, Công tử phế vật, Caelen",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/caelen-von-ravenwood.jpg",
      description: `Chiến lược gia sinh tồn kiêm sát thủ thời hiện đại chuyển sinh vào thân xác Đệ tam công tử bị cả kinh đô khinh miệt là "phế vật", kẻ bị đầu độc bằng kịch độc Hắc Tử La Lan suốt 5 năm.

Thức tỉnh **Ma Đồng Giải Cấu** nhìn thấu mọi mạch chảy ma lực và kích hoạt **Huyết Mạch Băng Sương Cổ Ngữ**. Điềm tĩnh tuyệt đối, thâm trầm, mưu sâu kế độc — luôn giả vờ yếu thế để ngấm ngầm bẻ gãy từng quân cờ của đối phương khi chúng tự mãn nhất.`
    },
    {
      name: "Lilian",
      role: "Hầu nữ thân cận / Gián điệp ngầm của Nhị Trưởng Lão",
      aliases: "Ả hầu gái, Lilian",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/lilian.jpg",
      description: `Nữ quan thân cận được cài cắm bên cạnh Caelen từ năm 14 tuổi để định kỳ hạ độc *Hắc Tử La Lan* theo lệnh Nhị Trưởng Lão Karlov.

Bề ngoài ngây thơ ngoan ngoãn nhưng bên trong vô cùng sắc sảo và nhạy bén. Sau khi bị Caelen phát giác và chấn áp bằng thủ đoạn tàn nhẫn ở Chương 1, nàng đã triệt để quy phục, trở thành con mắt nội gián ngầm đắc lực giúp Caelen thao túng thế cục hậu viện.`
    },
    {
      name: "Evelyn Von Ravenwood",
      role: "Đại tiểu thư / Quân đoàn trưởng Thiết Kỵ / Kiếm Vương Bắc Cảnh",
      aliases: "Nữ Kiếm Vương, Evelyn, Tỷ tỷ Thiết Huyết",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/evelyn-von-ravenwood.jpg",
      description: `Đại tiểu thư Gia tộc Ravenwood, Nữ Kiếm Vương phương Bắc chỉ huy Đội Quân Thiết Kỵ Băng Sương khét tiếng sa trường.

Bên ngoài lạnh lùng, nghiêm nghị và thất vọng tột cùng trước sự sa đọa trước đây của em trai, nhưng nội tâm luôn mang mặc cảm bảo vệ dòng máu gia tộc. Sở hữu kiếm thuật Địa Giai Trung Kỳ và thanh đại kiếm *Băng Phách*, sẵn sàng chém đứt bất kỳ ai dám sỉ nhục tôn nghiêm Bắc Cảnh.`
    },
    {
      name: "Valerie De Valois",
      role: "Tam Công Chúa Đế Quốc Solaria / Vị hôn thê đối địch",
      aliases: "Công Chúa Solaria, Phượng Hoàng Lửa Vàng, Valerie",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/valerie-de-valois.jpg",
      description: `Tam Công Chúa kiêu ngạo, tàn nhẫn và đầy toan tính của Đế Quốc Solaria, Hỏa hệ Ma Pháp Sư Quang Minh đạt cảnh giới Cao Giai Đỉnh Phong.

Mang theo *Huyết Chiếu Hoàng Gia* đến Bắc Cảnh để công khai hủy bỏ hôn ước và lập mưu đày Caelen ra Tiền Tuyến Hắc Vực làm vật tế thần, nhằm tạo cớ cho Thần Điện Quang Minh can thiệp và thôn tính quyền lực phương Bắc.`
    }
  ];

  for (const char of characters) {
    const found = await prisma.character.findFirst({
      where: {
        storyId: story.id,
        name: { contains: char.name.split(" ")[0] }
      }
    });

    if (found) {
      await prisma.character.update({
        where: { id: found.id },
        data: { 
          role: char.role,
          aliases: char.aliases,
          avatarUrl: char.avatarUrl,
          description: char.description
        }
      });
      console.log(`Updated ${char.name} summary -> DB OK`);
    }
  }
}

main().finally(() => prisma.$disconnect());
