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
      description: `【Ngoại hình】Cao 1m84, vóc dáng thon dài săn chắc mang thể chất bùng nổ của sát thủ. Tóc bạc ánh lam tro bồng bềnh tự nhiên phủ nhẹ trước trán. Đôi mắt xanh thẳm sắc lạnh như hồ băng Bắc Cảnh (khi kích hoạt Ma Đồng Giải Cấu, con ngươi hiện ma trận cổ ngữ xoay chuyển lam quang). Quân phục quý tộc đen tuyền (Midnight Black) may đo thủ công, ve áo thêu hoa văn Huyết Ưng bằng chỉ bạc, cầu vai tua rua bạc vương giả đính xích bạc vắt ngang ngực, nhẫn bạc gia huy khắc Đầu Ưng đeo ở ngón trỏ tay trái.
【Tính cách】Chiến lược gia sinh tồn thượng thừa, điềm tĩnh tuyệt đối, máu lạnh với kẻ thù, giả heo ăn thịt hổ, ngấm ngầm bẻ gãy từng quân cờ của đối phương khi chúng tự mãn nhất.
【Sở thích】Rượu vang tuyết ướp lạnh không đường; đọc cổ thư ma trận trong thư phòng tối dưới ánh nến; ngắm bão tuyết về đêm.
【Thói quen】Xoay nhẫn bạc ở ngón trỏ khi tính kế diệt khẩu; nheo nhẹ mắt trái khi phát hiện tử huyệt của đối thủ.
【Võ công & Ma pháp】Ma Đồng Giải Cấu (thấu suốt dòng chảy mana & điểm yếu chiêu thức); Huyết Mạch Băng Sương Cổ Ngữ.`
    },
    {
      name: "Lilian",
      role: "Hầu nữ thân cận / Gián điệp ngầm của Nhị Trưởng Lão",
      aliases: "Ả hầu gái, Lilian",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/lilian.jpg",
      description: `【Ngoại hình】Cao 1m65, thân hình thanh nhã, làn da trắng tuyết tỏa hương hoa oải hương dịu nhẹ. Mái tóc xám bạc ánh tro (Silver Ash) óng ả tết bím lớn lệch sang vai phải đính các hạt ngọc bạc tinh xảo. Đôi mắt hổ phách vàng kim (Amber Gold) to tròn sắc sảo nhưng luôn phảng phất sự cảnh giác toan tính ngầm. Lễ phục nhung xanh bóng đêm (Midnight Navy) bo viền lông thú trắng muốt (White Fur Trim) dày dặn, ngực áo thêu Bạch Ưng Tung Cánh lộng lẫy, trâm cài ngọc đính bảo thạch trước cổ áo.
【Tính cách】Thông minh, biết thức thời, sinh tồn là trên hết. Từng hạ độc theo lệnh Nhị Trưởng Lão nhưng sau khi bị Caelen phơi bày và bẻ khớp tay thì chuyển sang khiếp sợ và tuyệt đối phục tùng Caelen.
【Sở thích】Pha trà thảo mộc cúc tuyết; chăm sóc dược liệu hiếm trong vườn kính.
【Thói quen】Nắm chặt hai tay vào vạt áo và cúi thấp đầu khi đứng trước Caelen.
【Kỹ năng】Nhận biết và điều chế độc dược mạn tính vô sắc vô vị (Hắc Tử La Lan).`
    },
    {
      name: "Evelyn Von Ravenwood",
      role: "Đại tiểu thư / Quân đoàn trưởng Thiết Kỵ / Kiếm Vương Bắc Cảnh",
      aliases: "Nữ Kiếm Vương, Evelyn, Tỷ tỷ Thiết Huyết",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/evelyn-von-ravenwood.jpg",
      description: `【Ngoại hình】Cao 1m76, dáng vóc cao ráo, cân đối và săn chắc chuẩn nữ chiến thần hoàng gia. Mái tóc dài màu bạc ánh lam băng (Frost Silver) buông xõa dài qua vai và lưng. Đôi mắt xanh băng sương (Ice Blue) sắc như lưỡi kiếm vừa tuốt vỏ tràn đầy sát khí kiên định. Toàn thân khoác bộ giáp Băng Thiết màu bạc sáng chói (Full Plate Silver Frost Armor) chạm khắc phù văn hoa tuyết sắc sảo, áo choàng lông thú đen tuyền phủ kín hai vai, tay cầm Đại kiếm Băng Phách bằng băng lam trong suốt tỏa ra hàn khí buốt giá.
【Tính cách】Nghiêm khắc, cương trực, đặt tôn nghiêm gia tộc lên trên tính mạng bản thân. Thất vọng trước quá khứ sa đọa của em trai nhưng sẵn sàng rút kiếm chém đứt bất kỳ ai dám sỉ nhục dòng máu Ravenwood.
【Sở thích】Rèn luyện kiếm pháp lúc rạng đông trong bão tuyết; uống rượu mạnh Bắc Cảnh.
【Tuyệt kỹ】Băng Sương Kiếm Vũ, Bắc Cảnh Tuyệt Trảm (Địa Giai Trung Kỳ).`
    },
    {
      name: "Valerie De Valois",
      role: "Tam Công Chúa Đế Quốc Solaria / Vị hôn thê đối địch",
      aliases: "Công Chúa Solaria, Phượng Hoàng Lửa Vàng, Valerie",
      avatarUrl: "/characters/dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/valerie-de-valois.jpg",
      description: `【Ngoại hình】Cao 1m70, thân hình đồng hồ cát quyến rũ, làn da trắng muốt tỏa hương hoa hồng hoàng gia ngào ngạt. Mái tóc vàng kim óng ả (Platinum Blonde) dài bồng bềnh uốn lượn như suối vàng. Đôi mắt màu tím thạch anh (Amethyst Violet) sắc sảo, đuôi mắt phượng kiêu kỳ luôn nhìn kẻ khác từ trên cao xuống. Váy dạ hội hoàng gia gấm xanh lục bảo (Emerald Green) thêu hoa văn chỉ vàng kim nguyên chất (Gold Filigree), hoa tai thạch anh tím nạm vàng rủ dài, phía sau tỏa vầng hào quang Thái Dương Thần Thánh.
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
