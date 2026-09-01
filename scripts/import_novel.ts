import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const storyData = {
    title: "Tam Công Tử Rác Rưởi Của Gia Tộc Băng Sương",
    slug: "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong",
    genre: "Fantasy Tây Phương",
    summary: `Đại Lục Erebia – một thế giới ma pháp cổ điển đang bước vào thời kỳ suy tàn của các đại gia tộc huyết thống trước sự trỗi dậy của Thần Điện Quang Minh.

Caelen Von Ravenwood – Đệ tam công tử của gia tộc Công tước Băng Sương khét tiếng phương Bắc, kẻ bị cả kinh đô khinh miệt là "Đống rác của Bắc Cảnh", một kẻ nghiện rượu, đồi bại và bất tài. Không ai biết rằng, hắn thực chất đã bị đầu độc bằng kịch độc "Hắc Tử La Lan" làm nghẽn kinh mạch suốt năm năm qua.

Khi một linh hồn chiến thuật gia kiêm sát thủ thời hiện đại nhập xác, Ma Đồng Giải Cấu thức tỉnh, nhìn thấu mọi mạch chảy mana và điểm yếu ma pháp. Đối diện với vị hôn thê Công chúa kiêu ngạo mang Huyết Chiếu đến phế hôn và âm mưu đày hắn làm vật tế thần nơi Vực Thẳm Hoang Vu, "tên phế vật" bắt đầu mỉm cười...`,
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
  };

  console.log("Upserting story...");
  const story = await prisma.story.upsert({
    where: { slug: storyData.slug },
    update: {
      title: storyData.title,
      genre: storyData.genre,
      summary: storyData.summary,
      coverUrl: storyData.coverUrl
    },
    create: storyData
  });

  console.log(`Story ID: ${story.id}`);

  // Thêm Characters
  console.log("Importing characters...");
  // Xóa cũ nếu có để tránh trùng lặp
  await prisma.character.deleteMany({
    where: { storyId: story.id }
  });

  const characters = [
    {
      name: "Caelen Von Ravenwood",
      role: "Nhân vật chính / Đệ tam công tử",
      aliases: "Đống rác Bắc Cảnh, Công tử phế vật",
      description: "Chiến thuật gia hiện đại chuyển sinh. Thức tỉnh Ma Đồng Giải Cấu và Huyết mạch Băng Sương Cổ Ngữ, hành sự tàn nhẫn, giả heo ăn thịt hổ.",
      avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Lilian",
      role: "Hầu nữ / Gián điệp ngầm",
      aliases: "Ả hầu gái",
      description: "Hầu nữ thân cận do Nhị Trưởng lão cài cắm để hạ độc Caelen suốt 5 năm bằng Hắc Tử La Lan. Đã bị Caelen khống chế và biến thành con cờ ngầm.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Evelyn Von Ravenwood",
      role: "Đại tiểu thư / Kiếm Vương Bắc Cảnh",
      aliases: "Nữ kiếm vương, Tỷ tỷ",
      description: "Chị ruột của Caelen, chỉ huy Thiết Kỵ Băng Sương. Ngoài mặt lạnh lùng nghiêm khắc nhưng luôn mang gánh nặng bảo vệ gia tộc.",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Valerie De Valois",
      role: "Tam Công chúa / Vị hôn thê đối địch",
      aliases: "Công chúa Solaria, Valerie, Phượng Hoàng Lửa Vàng",
      description: "Tam Công chúa kiêu ngạo của Đế quốc Solaria. Mang Huyết Chiếu đến Bắc Cảnh để hủy hôn và gài bẫy đày Caelen ra tiền tuyến chịu tội thay.",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/valerie-de-valois.jpg"
    },
    {
      name: "Nhị Trưởng Lão Karlov",
      role: "Nhị Trưởng Lão Gia Tộc Ravenwood / Phản diện nội tộc",
      aliases: "Karlov, Nhị Trưởng Lão, Nhị Trưởng lão, Nhị Trưởng lão Karlov, Lão già giảo hoạt",
      description: "Nhị Trưởng Lão thâm hiểm, giảo hoạt nắm giữ quyền quản sự hậu viện và tài chính phân nhánh của Gia tộc Ravenwood. Kẻ chủ mưu sai khiến hầu nữ Lilian định kỳ hạ độc Caelen bằng Hắc Tử La Lan suốt 5 năm.",
      avatarUrl: "/characters/tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong/karlov.jpg"
    }
  ];

  for (const char of characters) {
    await prisma.character.create({
      data: {
        storyId: story.id,
        name: char.name,
        role: char.role,
        aliases: char.aliases,
        description: char.description,
        avatarUrl: char.avatarUrl
      }
    });
  }

  // Thêm Chapter 1
  console.log("Importing Chapter 1...");
  const chap1Content = `Mùi rượu nho lên men chua lòm xộc thẳng vào cánh mũi, quyện chặt với thứ hương hoa dạ lan nồng nặc đến buồn nôn.

Caelen mở mắt.

Trần nhà vòm bằng đá hoa cương xám tro đập vào tầm nhìn, mờ ảo sau lớp rèm lụa viền vàng rách bươm. Từng thớ cơ trên người hắn co giật từng hồi, đau nhức tựa như có hàng vạn mũi kim gỉ sét đang cắm sâu vào tủy sống. Nơi cuống họng khô khốc trào lên một ngụm dịch lỏng tanh nồng mùi sắt rỉ.

Độc.

Không phải độc dược thông thường, mà là chất kịch độc ma thuật ăn mòn kinh mạch một cách êm ái qua năm tháng.

Ký ức xa lạ ùa về như thác lũ. Đại Lục Erebia... Bắc Cảnh Ravenwood... Caelen Von Ravenwood, đệ tam công tử của gia tộc Công tước Băng Sương danh chấn thiên hạ, kẻ nổi danh khắp kinh đô là nỗi ô nhục lớn nhất mà dòng họ này từng sinh ra: một tên nghiện rượu, đồi bại, hoang phí và bất tài.

"Thiếu gia, ngài lại nôn mửa ra thảm Ba Tư nữa rồi."

Một giọng nói trong trẻo cất lên từ mép giường, nhưng ngữ điệu lại lạnh lùng và cứng nhắc, không hề có nửa điểm kính trọng.

Lilian đứng đó. Nàng ta vận bộ váy hầu gái viền ren màu lam sẫm, hai tay bưng khay bạc đựng một chén canh giải rượu còn bốc khói nghi ngút. Đôi mắt màu lục bích của nàng liếc nhìn Caelen đang nằm bẹp trên sàn đá, khóe môi khẽ nhếch lên một tia khinh miệt không buồn che giấu.

"Uống đi. Đây là canh hoa Tuyết Liên do chính Nhị Trưởng lão dặn dò nhà bếp nấu cho ngài. Ngài say khướt suốt ba ngày nay rồi, dưới đại sảnh... khách quý đã đến đông đủ cả."

Caelen không đáp. Hắn chống một tay xuống nền đá cẩm thạch lạnh buốt, từ từ gượng dậy. Từng giọt mồ hôi lạnh túa ra trên trán hắn, lăn qua gò má góc cạnh nhưng tái nhợt vì trụy lạc lâu ngày. 

Trong khoảnh khắc mắt hắn chạm vào chén canh nghi ngút khói, đáy mắt màu tro tàn của Caelen đột nhiên lóe lên một chuỗi ký tự cổ tựa như băng tinh xoay chuyển.

Ma Đồng Giải Cấu kích hoạt.

Dòng chảy ma lực mỏng manh như sợi tơ đen kịt đang cuộn xoáy dưới đáy bát canh lập tức hiện rõ mồn một. 

Hắc Tử La Lan. Liều lượng gấp ba lần ngày thường. Kẻ hạ độc muốn hắn hoặc là chết đột tử vì vỡ tim, hoặc là phát điên ngay trong buổi tiệc trưa nay.

"Thiếu gia? Ngài ngơ ngác cái gì?" Lilian bước tới gần hơn, khay bạc khẽ rung nhẹ, giọng điệu mang theo sự mất kiên nhẫn rõ rệt. "Uống nhanh lên rồi còn thay lễ phục. Tam Công chúa của Đế quốc đã chờ ở Nghị Sự Điện suốt nửa canh giờ rồi. Ngài muốn để cả gia tộc mất mặt thêm lần nữa sao?"

Nàng ta đưa chén canh tới sát mặt Caelen, bàn tay giấu sau ống tay áo khẽ siết lại, sẵn sàng dùng lực ép hắn uống nếu hắn từ chối như mọi bận.

Thế nhưng, Caelen không cự tuyệt, cũng không phát tiết cơn giận vô cớ như kẻ phế vật trước đây.

Hắn vươn tay ra, những ngón tay thon dài run rẩy chạm vào thành chén bạc. Lilian thở phào trong bụng, ánh mắt ánh lên vẻ đắc ý quen thuộc.

Xoảng!

Âm thanh chát chúa vang vọng khắp căn phòng tĩnh mịch.

Chén canh nóng bỏng hắt thẳng vào ngực áo Lilian, nước canh văng tung tóe khắp mặt sàn, bốc lên làn khói xám xịt mang theo mùi lưu huỳnh khét lẹt khi tiếp xúc với thảm lông thú.

"A!" Lilian giật mình lùi lại, đôi mắt trợn tròn vì kinh hãi và phẫn nộ: "Caelen! Ngươi phát điên cái gì—"

Chữ "đấy" chưa kịp bật ra khỏi cổ họng thì một bàn tay ướt đẫm mồ hôi lạnh đã siết chặt lấy thanh quản của nàng.

Tốc độ nhanh đến mức không khí bị xé toạc bằng một tiếng vút sắc lẹm.

Rầm!

Caelen đẩy mạnh Lilian vào cột giường gỗ sồi chạm khắc hình chim ưng. Lưng nàng ta đập mạnh vào thân gỗ, phát ra một tiếng vang nghẹn ngào. Toàn bộ trọng lượng của Caelen dồn lên cánh tay, gân xanh hằn rõ trên mu bàn tay trắng bệch, ngón tay hắn như gọng kìm bằng thép nguội khóa chặt yết hầu của ả hầu gái.

"Tên phế vật... ngươi dám..." Khuôn mặt thanh tú của Lilian đỏ bừng vì nghẹt thở, hai tay nàng ta vung lên, những móng tay nhọn hoắt tẩm độc cào mạnh về phía mắt Caelen.

Caelen nghiêng đầu né chuẩn xác trong tích tắc. Tay kia của hắn vung lên, chuẩn xác bẻ gập cổ tay phải của Lilian ra sau lưng.

Rắc!

Tiếng khớp xương trật ra khô khốc vang lên. Cây trâm bạc giấu trong kẽ tay Lilian rơi cắm phập xuống nền gỗ.

"Ưm...!" Lilian cắn chặt môi để không thét lên, nước mắt vì đau đớn ứa ra nơi khóe mi. Nàng ta kinh hãi nhìn người đàn ông trước mặt. 

Đây không phải là tên công tử bột yếu ớt, chỉ biết vung tiền và gào thét khi say xỉn. Đôi mắt xám tro kia phẳng lặng như mặt hồ băng ngàn năm, lạnh lùng, vô cảm và mang theo sát khí đặc quánh của kẻ đã từng bước ra từ vô số vũng máu.

"Năm năm." Giọng Caelen khàn đặc, trầm thấp như tiếng gió rít qua khe đá. Hắn ghé sát tai nàng ta, hơi thở lạnh buốt phả vào vành tai Lilian khiến từng sợi lông tơ của nàng dựng đứng. "Hắc Tử La Lan, ba ngày một chén nhỏ. Karlov hứa cho ngươi cái gì? Một chức quản sự ở Kinh Đô, hay là tự do?"

Đồng tử Lilian co rút lại thành hai chấm nhỏ xíu. Toàn thân nàng ta run rẩy kịch liệt.

Bí mật này... ngay cả các trưởng lão khác cũng không hề hay biết! Tại sao tên phế vật này lại biết đích danh Nhị Trưởng lão Karlov?

"Ta... ta không biết ngài đang nói gì..." Lilian run rẩy thốt lên qua kẽ răng.

Caelen siết chặt thêm nửa phân. Không khí trong phổi Lilian cạn kiệt, lồng ngực nàng ta phập phồng tuyệt vọng, móng chân quẫy đạp trên thảm lông.

"Ngươi chỉ có một cơ hội." Caelen nhả từng chữ, ánh mắt không hề chớp. "Khai ra lý do Tam Công chúa Valerie đến đây hôm nay. Trả lời sai một chữ, ta sẽ bẻ gãy từng ngón tay của ngươi, rồi ném ngươi xuống Vực Thẳm Hoang Vu cho bầy Ma Lang róc thịt."

Sát khí chân thực và tàn bạo đến mức bóp nghẹt mọi ý chí phản kháng của Lilian. Nàng ta nhận ra người này hoàn toàn nghiêm túc. Hắn thật sự sẽ giết nàng mà không chớp mắt một cái.

"T... Tôi nói! Tôi nói!" Lilian bật khóc nức nở, giọng đứt quãng: "Tam Công chúa... nàng mang theo Huyết Chiếu Hoàng gia... đến để phế bỏ hôn ước... và... và ép ngài ký vào văn thư nhận tội thông đồng với Dị Giáo... để đày ngài ra Tiền Tuyến Hắc Vực..."

Caelen khẽ nheo mắt lại. 

Một mũi tên trúng hai đích. 

Vừa hủy bỏ cuộc hôn nhân nhục nhã với một tên phế vật, vừa nhân cơ hội đó đổ tội phản quốc lên đầu huyết mạch dòng chính của gia tộc Ravenwood, giúp Nhị Trưởng lão danh chính ngôn thuận đoạt quyền thừa kế Bắc Cảnh. Một nước cờ chính trị hoàn hảo.

"Tốt." 

Caelen buông tay.

Lilian ngã quỵ xuống sàn đá, ôm lấy cổ họng ho sặc sụa, từng ngụm không khí tràn vào phổi rát buốt.

Caelen bước qua vũng nước canh độc hại trên sàn, đi thẳng về phía ban công đá. Gió tuyết phương Bắc lập tức ùa vào, thổi tung mái tóc đen dài rối bời và tà áo lụa mỏng dính của hắn. Hơi lạnh âm hai mươi độ táp vào da thịt như dao cạo, nhưng lại khiến đầu óc Caelen tỉnh táo lạ thường.

Dưới sân thành, cờ xí mang huy hiệu Hoàng gia Solaria hình Mặt Trời Vàng đang phần phật bay trong bão tuyết. Một cỗ xe ngựa nạm vàng ròng tráng lệ được hộ tống bởi hai mươi hiệp sĩ khoác giáp bạc sáng loáng vừa tiến vào cổng chính Pháo đài Băng Sương.

Tiếng chuông đồng ngân vang từng hồi giục giã, báo hiệu giờ khai tiệc đã điểm.

Caelen nhắm mắt lại, hít một hơi thật sâu làn không khí buốt giá. Hắn vận chuyển ý niệm, kích hoạt dòng huyết mạch ngủ sâu bên trong cơ thể. Một luồng khí lưu màu lam nhạt bùng lên từ sâu trong đan điền, nhanh chóng đóng băng toàn bộ tàn dư độc tố Hắc Tử La Lan trong mạch máu, nghiền nát chúng thành hư vô.

Rắc... rắc...

Khí thế quanh người hắn đột ngột biến đổi. Cốt lõi ma lực vốn bị phong ấn bấy lâu nay khẽ rung lên, một vòng tròn cổ ngữ băng giá xoay tròn trong đáy mắt hắn.

"Muốn biến ta thành vật tế thần sao?"

Khóe môi Caelen nhếch lên một nụ cười ngạo nghễ đầy tàn nhẫn.

"Lilian, nhặt cây trâm lên và lấy lễ phục Đại Lễ của gia tộc ra đây. Hôm nay... bổn thiếu gia sẽ đích thân đi tiếp đón vị hôn thê cao quý của mình."`;

  await prisma.chapter.upsert({
    where: {
      storyId_chapterNo: {
        storyId: story.id,
        chapterNo: 1
      }
    },
    update: {
      title: "Chương 1: Tỉnh Giấc Trong Vũng Bùn Nhục Nhã",
      content: chap1Content
    },
    create: {
      storyId: story.id,
      chapterNo: 1,
      title: "Chương 1: Tỉnh Giấc Trong Vũng Bùn Nhục Nhã",
      content: chap1Content,
      isVip: false,
      price: 0
    }
  });

  console.log("Đã nhập thành công bộ truyện, danh sách 4 nhân vật và Chương 1 vào hệ thống Web!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
