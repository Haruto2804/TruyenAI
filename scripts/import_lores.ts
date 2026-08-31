import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { slug: "dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" }
  });

  if (!story) {
    console.error("Story not found");
    return;
  }

  const lores = [
    {
      term: "Hắc Tử La Lan",
      category: "Độc Dược",
      aliases: "Tử La Lan, Độc hoa La Lan",
      definition: "Loại kịch độc ma thuật mạn tính chiết xuất từ hoa Tử La Lan của Vực Thẳm Hoang Vu. Khi ngấm vào máu sẽ làm đông đặc mạch chảy mana, ăn mòn ma hạch một cách êm ái khiến nạn nhân suy kiệt dần và biến thành phế nhân mà không ai hay biết."
    },
    {
      term: "Ma Đồng Giải Cấu",
      category: "Bí Thuật",
      aliases: "Thấu Thị Cổ Ngữ, Ma Đồng",
      definition: "Nhãn thuật cổ xưa thức tỉnh từ huyết mạch nguyên thủy Băng Sương. Cho phép người sở hữu nhìn thấu dòng chảy mana vi mô, cấu trúc cổ ngữ và phát hiện điểm yếu chí mạng trong mọi chiêu thức, ma pháp hoặc độc tố của đối phương."
    },
    {
      term: "Vực Thẳm Hoang Vu",
      category: "Địa Danh",
      aliases: "Hắc Vực, The Abyssal Rift",
      definition: "Vùng đất chết ngập tràn chướng khí và ma thú khát máu ở cực Bắc đại lục Erebia. Nơi đây là ranh giới giam giữ các sinh vật cổ xưa, do Gia tộc Công tước Ravenwood trấn thủ ngàn năm qua."
    },
    {
      term: "Gia Tộc Ravenwood",
      category: "Thế Lực",
      aliases: "Huyết Ưng Băng Sương, Công quốc Ravenwood",
      definition: "Một trong tứ đại gia tộc công tước cổ xưa nhất Đế quốc Solaria, mang huy hiệu Huyết Ưng Băng Sương. Sở hữu huyết mạch Băng Sương thượng cổ và chỉ huy Đội Quân Thiết Kỵ Băng Sương khét tiếng."
    },
    {
      term: "Huyết Chiếu Hoàng Gia",
      category: "Bảo Vật",
      aliases: "Huyết Chiếu Solaria, Huyết Chiếu",
      definition: "Sắc lệnh tối cao đóng dấu bằng giọt máu thần thánh của Hoàng đế Solaria, mang hiệu lực pháp lý và uy áp hoàng quyền tuyệt đối trên toàn cương thổ đế quốc."
    }
  ];

  console.log("Upserting lores...");
  for (const lore of lores) {
    const existing = await prisma.lore.findFirst({
      where: { storyId: story.id, term: lore.term }
    });

    if (existing) {
      await prisma.lore.update({
        where: { id: existing.id },
        data: lore
      });
    } else {
      await prisma.lore.create({
        data: {
          storyId: story.id,
          ...lore
        }
      });
    }
  }

  console.log(`Đã nạp thành công ${lores.length} chú giải khái niệm cho truyện!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
