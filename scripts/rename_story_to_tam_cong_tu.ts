import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Finding existing story...");
  let story = await prisma.story.findFirst({
    where: {
      OR: [
        { slug: "dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" },
        { slug: "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong" },
        { title: { contains: "Gia Tộc Băng Sương" } }
      ]
    }
  });

  if (!story) {
    console.log("Story not found, creating new...");
    story = await prisma.story.create({
      data: {
        title: "Tam Công Tử Rác Rưởi Của Gia Tộc Băng Sương",
        slug: "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong",
        genre: "Fantasy Tây Phương",
        summary: `Đại Lục Erebia – một thế giới ma pháp cổ điển đang bước vào thời kỳ suy tàn của các đại gia tộc huyết thống trước sự trỗi dậy của Thần Điện Quang Minh.

Caelen Von Ravenwood – Đệ tam công tử của gia tộc Công tước Băng Sương khét tiếng phương Bắc, kẻ bị cả kinh đô khinh miệt là "Đống rác của Bắc Cảnh", một kẻ nghiện rượu, đồi bại và bất tài. Không ai biết rằng, hắn thực chất đã bị đầu độc bằng kịch độc "Hắc Tử La Lan" làm nghẽn kinh mạch suốt năm năm qua.

Khi một linh hồn chiến thuật gia kiêm sát thủ thời hiện đại nhập xác, Ma Đồng Giải Cấu thức tỉnh, nhìn thấu mọi mạch chảy mana và điểm yếu ma pháp. Đối diện với vị hôn thê Công chúa kiêu ngạo mang Huyết Chiếu đến phế hôn và âm mưu đày hắn làm vật tế thần nơi Vực Thẳm Hoang Vu, "tên phế vật" bắt đầu mỉm cười...`,
        coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
      }
    });
  } else {
    console.log(`Updating story ID ${story.id} title & slug...`);
    story = await prisma.story.update({
      where: { id: story.id },
      data: {
        title: "Tam Công Tử Rác Rưởi Của Gia Tộc Băng Sương",
        slug: "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong"
      }
    });
  }

  console.log(`Story: ${story.title} (Slug: ${story.slug})`);

  // Update Character Avatar URLs
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
          name: char.name,
          role: char.role,
          aliases: char.aliases,
          avatarUrl: char.avatarUrl,
          description: char.description
        }
      });
      console.log(`Updated character: ${char.name}`);
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
      console.log(`Created character: ${char.name}`);
    }
  }

  console.log("Successfully migrated to: Tam Công Tử Rác Rưởi Của Gia Tộc Băng Sương!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
