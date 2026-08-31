# TÁC PHẨM: ĐẠI CÔNG TỬ RÁC RƯỞI CỦA GIA TỘC BĂNG SƯƠNG
*(Tên tiếng Anh: The Trash Scion of House Ravenwood)*

---

## [SKILL 1] ARCHITECT AGENT - WORLD-BUILDING & MASTER PLAN

### 1. Bối Cảnh Thế Giới (World Codex)
* **Thế giới**: Đại Lục Erebia – một thế giới ma pháp cổ điển đang bước vào thời kỳ suy tàn của các gia tộc huyết thống cổ xưa trước sự trỗi dậy của Thần Điện Quang Minh và các liên minh thương hội mới.
* **Địa bàn chính**: **Bắc Cảnh Frostford** – Lãnh địa cằn cỗi quanh năm phủ băng tuyết của **Gia tộc Công tước Ravenwood (Huyết Ưng Băng Sương)**. Đây là tiền đồn kiên cố cuối cùng ngăn cách nhân loại với "Vực Thẳm Hoang Vu" (The Abyssal Rift).
* **Hệ thống Sức Mạnh**:
  - **Ma Lực & Ma Hạch (Mana Core):** Chia làm 7 Bậc (Sơ Giai -> Trung Giai -> Cao Giai -> Địa Giai -> Thiên Giai -> Bán Thần -> Thần Vực).
  - **Cổ Ngữ Ma Pháp (Rune Magic):** Dòng phép thuật cổ xưa khắc sâu vào huyết mạch của các quý tộc nguyên thủy, có sức công phá kinh hoàng nhưng tiêu hao sinh mệnh lực nếu ma hạch không thuần khiết.

### 2. Hồ Sơ Nhân Vật (Character Codex)
* **Caelen Von Ravenwood (Nhân vật chính):**
  - *Thân phận cũ:* Quân sư chiến lược kiêm sát thủ sinh tồn ở thời hiện đại, chết do phản bội.
  - *Thân phận mới:* Đệ tam công tử của gia tộc Ravenwood. Bề ngoài là một tên phế vật đồi bại, hoang dâm vô độ, nghiện rượu đắt tiền và vũ lực kém cỏi, bị cả gia tộc và kinh đô sỉ vả là "Đống rác của Bắc Cảnh".
  - *Bí mật ẩn giấu:* Caelen nguyên bản thực chất bị đầu độc liên tục bằng độc dược "Hắc Tử La Lan" làm nghẽn kinh mạch từ nhỏ. Khi linh hồn mới nhập xác, hắn thức tỉnh **"Thấu Thị Cổ Ngữ & Ma Đồng Giải Cấu"** (khả năng nhìn thấu mạch chảy ma lực và điểm yếu của mọi chiêu thức).
  - *Tính cách:* Điềm tĩnh đến tàn nhẫn, khẩu thị tâm phi, hành động chuẩn xác, giấu nghề tuyệt đỉnh ("giả heo ăn hổ"), tuyệt đối không thương hại kẻ thù.
* **Lilian (Hầu nữ thân cận):**
  - *Thân phận:* Hầu nữ được gia tộc phái theo chăm sóc Caelen từ năm 14 tuổi, thực chất là điệp viên do Nhị Trưởng lão cài cắm để giám sát và hạ độc định kỳ.
  - *Tâm lý:* Luôn coi thường Caelen, nghĩ rằng bản thân nắm quyền sinh sát trong tay cho đến khi bị Caelen lật tẩy.
* **Evelyn Von Ravenwood (Đại tiểu thư - Chị ruột):**
  - Nữ kiếm vương lạnh lùng của Bắc Cảnh, chỉ huy Đội Quân Thiết Kỵ Băng Sương. Thất vọng tột cùng về cậu em trai vô tích sự nhưng trong thâm tâm vẫn mang mặc cảm tội lỗi vì không bảo vệ được mẹ.
* **Valerie De Valois (Tam Công chúa Đế Quốc Solaria - Vị hôn thê trên danh nghĩa):**
  - Kiêu hãnh, thực dụng, mang sứ đoàn đến Bắc Cảnh để xé bỏ hôn ước sỉ nhục này và biến Caelen thành con tốt thí mạng trong cuộc thanh trừng chính trị sắp tới.

### 3. Dàn Ý Chi Tiết Chương 1 (Beat Sheet - JSON Output)

```json
{
  "chapter_number": 1,
  "title": "Tỉnh Giấc Trong Vũng Bùn Nhục Nhã",
  "scenes": [
    {
      "scene_id": 1,
      "setting": "Phòng ngủ xa hoa nhưng bừa bộn tại Pháo đài Băng Sương, mùi rượu nho cay nồng hòa lẫn xạ hương",
      "characters": ["Caelen Von Ravenwood", "Lilian"],
      "objective": "Caelen thức tỉnh linh hồn trong thân xác mới, nhận diện tình trạng bị hạ độc 'Hắc Tử La Lan' và phản kích hầu nữ gián điệp",
      "key_reveal": "Caelen không phải phế vật bẩm sinh mà bị hạ độc đầu độc ma hạch suốt 5 năm qua. Thức tỉnh Ma Đồng Giải Cấu.",
      "conflict": "Cơn co giật do độc tính bộc phát và sự khinh miệt ra mặt của Lilian."
    },
    {
      "scene_id": 2,
      "setting": "Bàn trang điểm và góc tối phòng ngủ, lò sưởi bập bùng ánh lửa đỏ",
      "characters": ["Caelen", "Lilian"],
      "objective": "Caelen dùng thủ đoạn tàn độc ép Lilian khai ra kẻ chủ mưu đứng sau, đảo ngược vị thế chủ tớ",
      "key_reveal": "Lilian nhận lệnh từ Nhị Trưởng Lão Karlov; Tam Công chúa Valerie vừa tới pháo đài để từ hôn vào sáng nay.",
      "conflict": "Cuộc đấu trí và trấn áp thể xác tàn khốc giữa một kẻ vừa 'tỉnh rượu' và sát thủ hầu cận."
    },
    {
      "scene_id": 3,
      "setting": "Ban công tuyết phủ nhìn ra sân luyện võ của Pháo đài Băng Sương",
      "characters": ["Caelen"],
      "objective": "Caelen đứng đón gió tuyết, vận chuyển ma lực đốt tan tàn dư độc dược, vạch ra kế hoạch sinh tồn trước buổi tiệc từ hôn",
      "key_reveal": "Ma hạch Băng Sương Cổ Ngữ bắt đầu khởi động; hắn quyết định sẽ biến buổi tiệc từ hôn thành sân khấu của riêng mình.",
      "conflict": "Thời gian gấp rút, tiếng chuông báo hiệu đoàn xe Hoàng gia vang vọng dưới cổng thành."
    }
  ]
}
```

---

## [SKILL 2] DRAFTER AGENT - VĂN XUÔI NGUYÊN TÁC (PROSE DRAFT)

### CHƯƠNG 1: TỈNH GIẤC TRONG VŨNG BÙN NHỤC NHÃ

Mùi rượu nho lên men chua lòm xộc thẳng vào cánh mũi, quyện chặt với thứ hương hoa dạ lan nồng nặc đến buồn nôn.

Caelen mở mắt.

Trần nhà vòm bằng đá hoa cương xám tro đập vào tầm nhìn, mờ ảo sau lớp rèm lụa viền vàng rách bươm. Từng thớ cơ trên người hắn co giật từng hồi, đau nhức tựa như có hàng vạn mũi kim gỉ sét đang cắm sâu vào tủy sống. Nơi cuống họng khô khốc trào lên một ngụm dịch lỏng tanh nồng mùi sắt rỉ.

*Độc.*

Không phải độc dược thông thường, mà là chất kịch độc ma thuật ăn mòn kinh mạch một cách êm ái qua năm tháng.

Ký ức xa lạ ùa về như thác lũ. Đại Lục Erebia... Bắc Cảnh Ravenwood... Caelen Von Ravenwood, đệ tam công tử của gia tộc Công tước Băng Sương danh chấn thiên hạ, kẻ nổi danh khắp kinh đô là nỗi ô nhục lớn nhất mà dòng họ này từng sinh ra: một tên nghiện rượu, đồi bại, hoang phí và bất tài.

"Thiếu gia, ngài lại nôn mửa ra thảm Ba Tư nữa rồi."

Một giọng nói trong trẻo cất lên từ mép giường, nhưng ngữ điệu lại lạnh lùng và cứng nhắc, không hề có nửa điểm kính trọng.

Lilian đứng đó. Nàng ta vận bộ váy hầu gái viền ren màu lam sẫm, hai tay bưng khay bạc đựng một chén canh giải rượu còn bốc khói nghi ngút. Đôi mắt màu lục bích của nàng liếc nhìn Caelen đang nằm bẹp trên sàn đá, khóe môi khẽ nhếch lên một tia khinh miệt không buồn che giấu.

"Uống đi. Đây là canh hoa Tuyết Liên do chính Nhị Trưởng lão dặn dò nhà bếp nấu cho ngài. Ngài say khướt suốt ba ngày nay rồi, dưới đại sảnh... khách quý đã đến đông đủ cả."

Caelen không đáp. Hắn chống một tay xuống nền đá cẩm thạch lạnh buốt, từ từ gượng dậy. Từng giọt mồ hôi lạnh túa ra trên trán hắn, lăn qua gò má góc cạnh nhưng tái nhợt vì trụy lạc lâu ngày. 

Trong khoảnh khắc mắt hắn chạm vào chén canh nghi ngút khói, đáy mắt màu tro tàn của Caelen đột nhiên lóe lên một chuỗi ký tự cổ tựa như băng tinh xoay chuyển.

*Ma Đồng Giải Cấu kích hoạt.*

Dòng chảy ma lực mỏng manh như sợi tơ đen kịt đang cuộn xoáy dưới đáy bát canh lập tức hiện rõ mồn một. 

*Hắc Tử La Lan. Liều lượng gấp ba lần ngày thường. Kẻ hạ độc muốn hắn hoặc là chết đột tử vì vỡ tim, hoặc là phát điên ngay trong buổi tiệc trưa nay.*

"Thiếu gia? Ngài ngơ ngác cái gì?" Lilian bước tới gần hơn, khay bạc khẽ rung nhẹ, giọng điệu mang theo sự mất kiên nhẫn rõ rệt. "Uống nhanh lên rồi còn thay lễ phục. Tam Công chúa của Đế quốc đã chờ ở Nghị Sự Điện suốt nửa canh giờ rồi. Ngài muốn để cả gia tộc mất mặt thêm lần nữa sao?"

Nàng ta đưa chén canh tới sát mặt Caelen, bàn tay giấu sau ống tay áo khẽ siết lại, sẵn sàng dùng lực ép hắn uống nếu hắn từ chối như mọi bận.

Thế nhưng, Caelen không cự tuyệt, cũng không phát tiết cơn giận vô cớ như kẻ phế vật trước đây.

Hắn vươn tay ra, những ngón tay thon dài run rẩy chạm vào thành chén bạc. Lilian thở phào trong bụng, ánh mắt ánh lên vẻ đắc ý quen thuộc.

*Xoảng!*

Âm thanh chát chúa vang vọng khắp căn phòng tĩnh mịch.

Chén canh nóng bỏng hắt thẳng vào ngực áo Lilian, nước canh văng tung tóe khắp mặt sàn, bốc lên làn khói xám xịt mang theo mùi lưu huỳnh khét lẹt khi tiếp xúc với thảm lông thú.

"A!" Lilian giật mình lùi lại, đôi mắt trợn tròn vì kinh hãi và phẫn nộ: "Caelen! Ngươi phát điên cái gì—"

Chữ "đấy" chưa kịp bật ra khỏi cổ họng thì một bàn tay ướt đẫm mồ hôi lạnh đã siết chặt lấy thanh quản của nàng.

Tốc độ nhanh đến mức không khí bị xé toạc bằng một tiếng *vút* sắc lẹm.

*Rầm!*

Caelen đẩy mạnh Lilian vào cột giường gỗ sồi chạm khắc hình chim ưng. Lưng nàng ta đập mạnh vào thân gỗ, phát ra một tiếng vang nghẹn ngào. Toàn bộ trọng lượng của Caelen dồn lên cánh tay, gân xanh hằn rõ trên mu bàn tay trắng bệch, ngón tay hắn như gọng kìm bằng thép nguội khóa chặt yết hầu của ả hầu gái.

"Tên phế vật... ngươi dám..." Khuôn mặt thanh tú của Lilian đỏ bừng vì nghẹt thở, hai tay nàng ta vung lên, những móng tay nhọn hoắt tẩm độc cào mạnh về phía mắt Caelen.

Caelen nghiêng đầu né chuẩn xác trong tích tắc. Tay kia của hắn vung lên, chuẩn xác bẻ gập cổ tay phải của Lilian ra sau lưng.

*Rắc!*

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

*Một mũi tên trúng hai đích.* 

Vừa hủy bỏ cuộc hôn nhân nhục nhã với một tên phế vật, vừa nhân cơ hội đó đổ tội phản quốc lên đầu huyết mạch dòng chính của gia tộc Ravenwood, giúp Nhị Trưởng lão danh chính ngôn thuận đoạt quyền thừa kế Bắc Cảnh. Một nước cờ chính trị hoàn hảo.

"Tốt." 

Caelen buông tay.

Lilian ngã quỵ xuống sàn đá, ôm lấy cổ họng ho sặc sụa, từng ngụm không khí tràn vào phổi rát buốt.

Caelen bước qua vũng nước canh độc hại trên sàn, đi thẳng về phía ban công đá. Gió tuyết phương Bắc lập tức ùa vào, thổi tung mái tóc đen dài rối bời và tà áo lụa mỏng dính của hắn. Hơi lạnh âm hai mươi độ táp vào da thịt như dao cạo, nhưng lại khiến đầu óc Caelen tỉnh táo lạ thường.

Dưới sân thành, cờ xí mang huy hiệu Hoàng gia Solaria hình Mặt Trời Vàng đang phần phật bay trong bão tuyết. Một cỗ xe ngựa nạm vàng ròng tráng lệ được hộ tống bởi hai mươi hiệp sĩ khoác giáp bạc sáng loáng vừa tiến vào cổng chính Pháo đài Băng Sương.

Tiếng chuông đồng ngân vang từng hồi giục giã, báo hiệu giờ khai tiệc đã điểm.

Caelen nhắm mắt lại, hít một hơi thật sâu làn không khí buốt giá. Hắn vận chuyển ý niệm, kích hoạt dòng huyết mạch ngủ sâu bên trong cơ thể. Một luồng khí lưu màu lam nhạt bùng lên từ sâu trong đan điền, nhanh chóng đóng băng toàn bộ tàn dư độc tố Hắc Tử La Lan trong mạch máu, nghiền nát chúng thành hư vô.

*Rắc... rắc...*

Khí thế quanh người hắn đột ngột biến đổi. Cốt lõi ma lực vốn bị phong ấn bấy lâu nay khẽ rung lên, một vòng tròn cổ ngữ băng giá xoay tròn trong đáy mắt hắn.

"Muốn biến ta thành vật tế thần sao?"

Khóe môi Caelen nhếch lên một nụ cười ngạo nghễ đầy tàn nhẫn.

"Lilian, nhặt cây trâm lên và lấy lễ phục Đại Lễ của gia tộc ra đây. Hôm nay... bổn thiếu gia sẽ đích thân đi tiếp đón vị hôn thê cao quý của mình."

---

## [SKILL 3] EDITOR AGENT - REVIEW & CRITIQUE

```json
{
  "score": 9.6,
  "action": "PASS",
  "critique": {
    "consistency": "Hành vi và tâm lý của Caelen thể hiện sự lạnh lùng, dứt khoát của một chuyên gia chiến thuật kiếp trước, hoàn toàn phù hợp với hồ sơ nhân vật. Sự hoảng loạn của Lilian phản ánh chân thực vị thế bị đảo ngược bất ngờ.",
    "style_and_sensory": "Áp dụng xuất sắc nguyên tắc 'Show, Don't Tell'. Sử dụng đầy đủ 5 giác quan: Mùi rượu chua nồng + dạ lan nôn mửa (Khứu giác), Vị kim loại rỉ sét của độc tố (Vị giác), Nền đá cẩm thạch và gió tuyết âm 20 độ (Xúc giác), Tiếng rắc khớp xương và tiếng chuông đồng (Thính giác), Ánh sáng đá hoa cương và vòng tròn cổ ngữ (Thị giác).",
    "cliche_check": "Không xuất hiện bất kỳ cụm từ văn mẫu AI nào ('như một minh chứng', 'đầy hứa hẹn', 'một bản giao hưởng'). Nhịp điệu dồn dập, gãy gọn ở các pha trấn áp và sâu lắng ở đoạn nội tâm cuối chương.",
    "pacing": "Chương mở đầu tạo ra 'Hook' căng thẳng ngay từ 3 dòng đầu tiên, bộc lộ trực tiếp xung đột sinh tử và kết thúc bằng một cú đẩy kịch tính (Climax setup) dẫn vào bữa tiệc từ hôn ở Chương 2."
  }
}
```

---

## [SKILL 4] MEMORY MANAGER AGENT - STATE TRACKING & METADATA

```json
{
  "chapter_id": 1,
  "state_updates": {
    "status": {
      "Caelen": "Linh hồn chiến thuật gia nhập xác thành công; kích hoạt Ma Đồng Giải Cấu; dùng huyết mạch Băng Sương tự phong tỏa và triệt tiêu 80% độc tố Hắc Tử La Lan; Ma Hạch khôi phục về Sơ Giai đỉnh phong.",
      "Lilian": "Bị trật khớp cổ tay phải; bị chấn áp tinh thần tuyệt đối, trở thành nội gián ngược dưới sự khống chế của Caelen."
    },
    "inventory": [
      {
        "item": "Trâm bạc tẩm độc",
        "holder": "Caelen thu giữ từ Lilian",
        "description": "Vũ khí ám sát cự ly gần của gián điệp Nhị Trưởng lão"
      },
      {
        "item": "Lễ phục Đại Lễ Gia Tộc Ravenwood",
        "holder": "Caelen mặc",
        "description": "Lễ phục dạ hội thêu gia huy Huyết Ưng Băng Sương"
      }
    ],
    "relationships": {
      "Caelen_vs_Lilian": "Từ chủ - tớ giả tạo chuyển thành Kẻ thao túng - Nô lệ bị khống chế bí mật.",
      "Caelen_vs_Karlov": "Đối đầu ngầm sinh tử (Karlov chưa biết Caelen đã thức tỉnh).",
      "Caelen_vs_Valerie": "Hôn thê đối địch; Valerie chuẩn bị mang Huyết Chiếu phế hôn và hãm hại Caelen."
    },
    "lore_revealed": [
      "Độc tố Hắc Tử La Lan là thủ đoạn làm nghẽn kinh mạch kéo dài 5 năm do Nhị Trưởng lão Karlov chủ mưu.",
      "Tam Công chúa Valerie De Valois cấu kết với phe cánh phản bội trong gia tộc Ravenwood để biến Caelen thành con tốt chịu tội thông đồng Dị Giáo.",
      "Huyết mạch Băng Sương của Caelen có thể biến hóa thành Ma Đồng Giải Cấu, nhìn thấu dòng chảy mana và điểm yếu ma pháp."
    ]
  }
}
```
