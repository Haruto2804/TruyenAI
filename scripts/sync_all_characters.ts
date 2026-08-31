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
      description: `【Ngoại hình】Cao 1m84, thân hình thon dài săn chắc ẩn giấu sức bùng nổ của sát thủ. Tóc bạc ánh lam tro bồng bềnh, mắt xanh thẳm sắc lạnh như hồ băng Bắc Cảnh (khi kích hoạt Ma Đồng Giải Cấu, con ngươi hiện ma trận cổ ngữ xoay chuyển lam quang). Quân phục quý tộc bóng đêm thêu chỉ bạc tinh xảo, cầu vai tua rua bạc, nhẫn gia huy Đầu Ưng đeo ở ngón trỏ tay trái.
【Tính cách】Chiến lược gia sinh tồn thượng thừa, điềm tĩnh tuyệt đối, máu lạnh với kẻ thù, giả heo ăn thịt hổ, ngấm ngầm bẻ gãy từng quân cờ của đối phương.
【Sở thích】Rượu vang tuyết ướp lạnh không đường; đọc cổ thư ma trận trong thư phòng tối dưới ánh nến; ngắm bão tuyết về đêm.
【Thói quen】Xoay nhẫn bạc ở ngón trỏ khi tính kế diệt khẩu; nheo nhẹ mắt trái khi phát hiện tử huyệt của đối thủ.
【Võ công & Ma pháp】Ma Đồng Giải Cấu (thấu suốt dòng chảy mana & điểm yếu chiêu thức); Huyết Mạch Băng Sương Cổ Ngữ.`
    },
    {
      name: "Lilian",
      role: "Hầu nữ thân cận / Gián điệp ngầm của Nhị Trưởng Lão",
      aliases: "Ả hầu gái, Lilian",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/lilian.jpg",
      description: `【Ngoại hình】Cao 1m65, thân hình mảnh mai mềm mại, thoang thoảng hương hoa oải hương. Tóc nâu hạt dẻ uốn lọn xoăn chấm vai cài nơ đăng ten đen viền trắng. Đôi mắt xanh ngọc lục bảo to tròn ngây thơ nhưng đáy mắt ẩn chứa sự cảnh giác cao độ. Đồng phục hầu nữ trưởng tông đen - trắng thanh lịch.
【Tính cách】Thông minh, biết thức thời, sinh tồn là trên hết. Từng hạ độc theo lệnh Nhị Trưởng Lão nhưng sau khi bị Caelen phơi bày và bẻ khớp tay thì chuyển sang khiếp sợ và tuyệt đối phục tùng Caelen.
【Sở thích】Pha trà thảo mộc cúc tuyết; chăm sóc dược liệu hiếm trong vườn kính.
【Thói quen】Nắm chặt hai tay vào vạt tạp dề và cúi thấp đầu khi đứng trước Caelen.
【Kỹ năng】Nhận biết và điều chế độc dược mạn tính vô sắc vô vị (Hắc Tử La Lan).`
    },
    {
      name: "Evelyn Von Ravenwood",
      role: "Đại tiểu thư / Quân đoàn trưởng Thiết Kỵ / Kiếm Vương Bắc Cảnh",
      aliases: "Nữ Kiếm Vương, Evelyn, Tỷ tỷ Thiết Huyết",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/evelyn-von-ravenwood.jpg",
      description: `【Ngoại hình】Cao 1m76, dáng vóc cao ráo, cân đối và săn chắc chuẩn nữ chiến binh hoàng gia. Tóc vàng bạch kim dài óng ả buộc đuôi ngựa cao kiêu hãnh. Đôi mắt xanh xám tro sắc bén như lưỡi kiếm vừa tuốt vỏ. Chiến giáp nhẹ bằng Băng Thiết màu bạc viền xanh bóng đêm, áo choàng lông sói tuyết phủ vai, mang Đại kiếm Băng Phách dài 1m3 khảm lam ngọc cổ ngữ.
【Tính cách】Nghiêm khắc, cương trực, đặt tôn nghiêm gia tộc lên trên tính mạng bản thân. Thất vọng trước quá khứ sa đọa của em trai nhưng sẵn sàng rút kiếm chém đứt bất kỳ ai dám sỉ nhục dòng máu Ravenwood.
【Sở thích】Rèn luyện kiếm pháp lúc rạng đông trong bão tuyết; uống rượu mạnh Bắc Cảnh.
【Tuyệt kỹ】Băng Sương Kiếm Vũ, Bắc Cảnh Tuyệt Trảm (Địa Giai Trung Kỳ).`
    },
    {
      name: "Valerie De Valois",
      role: "Tam Công Chúa Đế Quốc Solaria / Vị hôn thê đối địch",
      aliases: "Công Chúa Solaria, Phượng Hoàng Lửa Vàng, Valerie",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/valerie-de-valois.jpg",
      description: `【Ngoại hình】Cao 1m70, thân hình đồng hồ cát quyến rũ, làn da trắng muốt tỏa hương hoa hồng hoàng gia ngào ngạt. Tóc đỏ rực như lửa uốn lượn như sóng nước, đội vương miện vàng ròng đính hồng ngọc. Đôi mắt vàng kim kiêu kỳ luôn nhìn kẻ khác từ trên cao xuống. Lễ phục dạ hội đỏ thẫm thêu chỉ vàng kim nguyên chất quý phái.
【Tính cách】Tự phụ, độc đoán, coi con người là những quân cờ trên bàn cờ quyền lực đế quốc. Mang Huyết Chiếu đến Bắc Cảnh để từ hôn và gài bẫy đày Caelen ra tiền tuyến làm vật tế thần.
【Sở thích】Tiệc tùng xa hoa, thu thập trang sức đá quý hiếm, thuần phục những kẻ kiêu ngạo.
【Tuyệt kỹ】Quang Minh Viêm Trận (Cao Giai Đỉnh Phong Hỏa hệ Ma Pháp Sư).`
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
      console.log(`Updated ${char.name} full ultra-detailed dossier -> DB OK`);
    }
  }
}

main().finally(() => prisma.$disconnect());
