import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { slug: "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" }
  });

  if (!story) return;

  const characters = [
    {
      name: "Caelen Von Ravenwood",
      role: "Nhân vật chính / Đệ tam công tử Gia Tộc Ravenwood",
      aliases: "Đống rác Bắc Cảnh, Công tử phế vật, Caelen",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/caelen-von-ravenwood.jpg",
      description: `Chiến lược gia sinh tồn kiêm sát thủ thời hiện đại chuyển sinh vào thân xác Đệ tam công tử bị cả kinh đô khinh miệt là "phế vật", kẻ bị đầu độc bằng kịch độc Hắc Tử La Lan suốt 5 năm.

Thức tỉnh **Ma Đồng Giải Cấu** nhìn thấu mọi mạch chảy ma lực và kích hoạt **Huyết Mạch Băng Sương Cổ Ngữ**. Điềm tĩnh tuyệt đối, thâm trầm, mưu sâu kế độc — luôn giả vờ yếu thế để ngấm ngầm bẻ gãy từng quân cờ của đối phương khi chúng tự mãn nhất.`
    },
    {
      name: "Lilian",
      role: "Hầu nữ thân cận / Gián điệp ngầm của Nhị Trưởng Lão",
      aliases: "Ả hầu gái, Lilian",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/lilian.jpg",
      description: `Nữ quan thân cận được cài cắm bên cạnh Caelen từ năm 14 tuổi để định kỳ hạ độc *Hắc Tử La Lan* theo lệnh Nhị Trưởng Lão Karlov.

Bề ngoài ngây thơ ngoan ngoãn nhưng bên trong vô cùng sắc sảo và nhạy bén. Sau khi bị Caelen phát giác và chấn áp bằng thủ đoạn tàn nhẫn ở Chương 1, nàng đã triệt để quy phục, trở thành con mắt nội gián ngầm đắc lực giúp Caelen thao túng thế cục hậu viện.`
    },
    {
      name: "Evelyn Von Ravenwood",
      role: "Đại tiểu thư / Quân đoàn trưởng Thiết Kỵ / Kiếm Vương Bắc Cảnh",
      aliases: "Nữ Kiếm Vương, Evelyn, Tỷ tỷ Thiết Huyết",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/evelyn-von-ravenwood.jpg",
      description: `Đại tiểu thư Gia tộc Ravenwood, Nữ Kiếm Vương phương Bắc chỉ huy Đội Quân Thiết Kỵ Băng Sương khét tiếng sa trường.

Bên ngoài lạnh lùng, nghiêm nghị và thất vọng tột cùng trước sự sa đọa trước đây của em trai, nhưng nội tâm luôn mang mặc cảm bảo vệ dòng máu gia tộc. Sở hữu kiếm thuật Địa Giai Trung Kỳ và thanh đại kiếm *Băng Phách*, sẵn sàng chém đứt bất kỳ ai dám sỉ nhục tôn nghiêm Bắc Cảnh.`
    },
    {
      name: "Valerie De Valois",
      role: "Tam Công Chúa Đế Quốc Solaria / Vị hôn thê đối địch",
      aliases: "Công Chúa Solaria, Phượng Hoàng Lửa Vàng, Valerie",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/valerie-de-valois.jpg",
      description: `Tam Công Chúa kiêu ngạo, tàn nhẫn và đầy toan tính của Đế Quốc Solaria, Hỏa hệ Ma Pháp Sư Quang Minh đạt cảnh giới Cao Giai Đỉnh Phong.

Mang theo *Huyết Chiếu Hoàng Gia* đến Bắc Cảnh để công khai hủy bỏ hôn ước và lập mưu đày Caelen ra Tiền Tuyến Hắc Vực làm vật tế thần, nhằm tạo cớ cho Thần Điện Quang Minh can thiệp và thôn tính quyền lực phương Bắc.`
    },
    {
      name: "Nhị Trưởng Lão Karlov",
      role: "Nhị Trưởng Lão Gia Tộc Ravenwood / Phản diện nội viện",
      aliases: "Karlov, Nhị Trưởng Lão, Nhị Trưởng lão, Nhị Trưởng lão Karlov, Lão già giảo hoạt",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/karlov.jpg",
      description: `Nhị Trưởng Lão thâm hiểm, giảo hoạt nắm giữ quyền quản sự hậu viện và tài chính phân nhánh của Gia tộc Ravenwood.

Kẻ chủ mưu sai khiến nữ hầu Lilian định kỳ hạ độc Caelen bằng *Hắc Tử La Lan* suốt 5 năm nhằm triệt hạ tư cách thừa kế của dòng chính. Trong Chương 2, lão mưu toan dùng Cấm Thuật Huyết Hồn và văn thư nhận tội để đày ải Caelen ra tiền tuyến hòng chiếm đoạt quyền thừa kế Bắc Cảnh, nhưng đã bị Caelen cùng Đại tỷ Evelyn vạch trần và trừng phạt đích đáng.`
    },
    {
      name: "Hắc Y Sứ Giả Vane",
      role: "Sát thủ cấp cao / Sứ giả Hội Lưỡi Hái Hắc Ám",
      aliases: "Vane, Hắc Y Sứ Giả, Sứ giả Vane, Sát thủ Hắc Ám, Tử Thần Vực Thẳm",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/vane.jpg",
      description: `Sát thủ Cao Giai Sơ Kỳ tàn nhẫn, mang mặt nạ kim loại đen thuộc Hội Lưỡi Hái Hắc Ám. Sở hữu ma pháp Ám Hắc và Tử Linh, vũ khí tẩm kịch độc Thực Cốt Chu Sa.

Nhận lời ủy thác của Karlov để ám toán Caelen tại Hẻm Sói Băng nhưng bị Caelen chặn đứng và bị Nữ Kiếm Vương Evelyn chém đứt một cánh tay trái, buộc phải thi triển cấm thuật Huyết Độn tháo chạy.`
    },
    {
      name: "Boris Tai Đỏ",
      role: "Thủ lĩnh Thảo Khấu Biên Ải Frostfang",
      aliases: "Boris, Boris Tai Đỏ, Boris Red-Ear, Tướng cướp man di",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/boris.jpg",
      description: `Gã khổng lồ man di hung bạo cao hơn hai mét, thủ lĩnh của hơn một trăm thảo khấu Biên Ải Frostfang. Đạt cảnh giới Trung Giai Sơ Kỳ Thổ hệ, sử dụng đại rìu chiến thép đen hai lưỡi.

Cấu kết với Karlov phục kích Caelen tại Hẻm Sói Băng nhưng đã bị Caelen nhìn thấu điểm hở ma lực và chém đầu tại chỗ ở Chương 5.`
    }
  ];

  for (const char of characters) {
    const found = await prisma.character.findFirst({
      where: {
        storyId: story.id,
        OR: [
          { name: char.name },
          { name: { contains: char.name.split(" ").pop() || char.name } },
          { aliases: { contains: char.name.split(" ").pop() || char.name } }
        ]
      }
    });

    if (found) {
      await prisma.character.update({
        where: { id: found.id },
        data: { 
          name: char.name,
          role: char.role,
          aliases: char.aliases,
          avatarUrl: char.avatarUrl,
          description: char.description
        }
      });
      console.log(`Updated ${char.name} summary -> DB OK`);
    } else {
      await prisma.character.create({
        data: {
          storyId: story.id,
          name: char.name,
          role: char.role,
          aliases: char.aliases,
          avatarUrl: char.avatarUrl,
          description: char.description
        }
      });
      console.log(`Created ${char.name} -> DB OK`);
    }
  }
}

main().finally(() => prisma.$disconnect());
