---
name: novel-character-illustrator
description: "Tự động đọc bối cảnh truyện (Master Codex), trích xuất và kiến tạo hồ sơ nhân vật SIÊU CHI TIẾT (Diện mạo từ đầu đến chân, trang phục, trang sức, thần thái, tính cách, sở thích, thói quen, võ học ma pháp, ân oán), tạo ảnh chân dung nghệ thuật AI chuẩn phong cách Dark Fantasy Manhwa Semi-Realistic 9:16, hiển thị bản xem trước (Preview) cho người dùng duyệt và đồng bộ lên Website/Database."
---

# NOVEL CHARACTER ILLUSTRATOR & MASTER DOSSIER ARCHITECT
## (HỌA SƯ NHÂN VẬT & KIẾN TRÚC SƯ HỒ SƠ SIÊU CHI TIẾT 9:16)

Skill này chuyên trách việc phân tích bối cảnh, thiết lập **Hồ Sơ Nhân Vật Siêu Chi Tiết (Full Ultra-Detailed Dossier)** và sinh ảnh chân dung nghệ thuật đỉnh cao chuẩn phong cách **Dark Fantasy Noble / Korean Manhwa Semi-Realistic (Tỷ lệ 9:16)** với quy trình **Human-in-the-Loop Review (Xem trước $\rightarrow$ Duyệt $\rightarrow$ Đăng)**.

---

## 📋 1. QUY CHUẨN HỒ SƠ NHÂN VẬT SIÊU CHI TIẾT (MANDATORY DOSSIER SCHEMA)

Mọi nhân vật khi được tạo ra trong `master_codex.md` và Database **BẮT BUỘC** phải có đầy đủ 100% các trường siêu chi tiết sau:

```markdown
### [Tên Đầy Đủ Của Nhân Vật]
* **Vai trò & Thân phận:** [Vai trò trong cốt truyện / Thân phận thế gia / Chức vị]
* **Danh xưng & Biệt hiệu:** [Các biệt danh, danh xưng giang hồ, tước vị]
* **Cảnh giới & Tu vi:** [Cấp bậc ma pháp / Ma hạch / Chiến khí / Tu vi võ đạo]
* **Ảnh Avatar (9:16):** `/characters/<novel_slug>/<char_slug>.jpg`

* **🎨 Diện Mạo & Ngoại Hình Siêu Chi Tiết (Head-to-Toe):**
  - *Vóc dáng & Thể hình:* [Chiều cao, dáng người (thon gọn, vạm vỡ, thanh mảnh), khung xương, màu da (trắng sứ, ngăm phong sương), mùi hương đặc trưng].
  - *Mái tóc:* [Màu sắc chính xác kèm ánh sáng phản chiếu, độ dài, kiểu tóc (bồng bềnh, búi cao quý tộc, thắt bím, buông xõa), lọn tóc mai].
  - *Đôi mắt & Ánh nhìn:* [Màu sắc con ngươi, hình dáng mắt (phượng hoàng, mắt hổ, mắt sắc lạnh), hiệu ứng ma nhãn/cổ ngữ phát sáng, chiều sâu ánh mắt (lạnh lùng, thâm sâu, kiêu ngạo, nhu hòa)].
  - *Ngũ quan & Thần thái:* [Đường nét khuôn mặt, sống mũi, gò má, khóe môi, khí chất toát ra (vương giả, sát thủ, tiểu thư đài các, ác ma)].
  - *Trang phục & Y phục:* [Chi tiết từ áo khoác ngoài, áo trong, chất liệu vải (lụa ma thuật, gấm đen, da thú Bắc Cảnh), màu sắc chủ đạo, đường thêu kim tuyến/chỉ bạc, cổ áo, cầu vai, viền đăng ten, áo choàng, găng tay, thắt lưng, ủng da cao cổ].
  - *Trang sức & Phụ kiện:* [Nhẫn gia huy khảm ngọc, hoa tai sapphire/ruby, trâm cài tóc đính bảo thạch, dây chuyền hộ mệnh, trâm bạc độc môn].

* **⚔️ Vũ Khí, Bảo Vật & Tuyệt Kỹ:**
  - *Binh khí bản mệnh:* [Tên kiếm, đao, trượng, cung, ám khí... kèm chất liệu và nguồn gốc].
  - *Huyết mạch & Ma pháp:* [Tên huyết mạch cổ, ma pháp nguyên tố, bí thuật độc quyền].
  - *Điểm mạnh & Điểm yếu:* [Ưu thế chiến đấu tuyệt đối & sơ hở/điểm chí mạng].

* **🧠 Tính Cách & Chiều Sâu Tâm Lý:**
  - *Bản chất cốt lõi:* [Chân thực, quyết đoán, mưu sâu kế độc, ngạo cốt, trung thành, tàn nhẫn hay trọng tình].
  - *Phong cách hành sự:* [Cách giải quyết kẻ thù, cách đàm phán chính trị, thái độ trước nguy cơ diệt vong].
  - *Tâm ma / Vết thương quá khứ:* [Nỗi ám ảnh tâm lý, ký ức tuổi thơ, động lực sinh tồn tối thượng].

* **❤️ Sở Thích & Thói Quen Vi Mô (Micro-Habits):**
  - *Món ăn & Đồ uống yêu thích:* [Loại rượu vang tuyết, loại trà, món ăn ưa chuộng].
  - *Sở thích cá nhân:* [Nghiên cứu cổ thư, lau kiếm dưới trăng, đánh cờ chiến thuật, nuôi linh thú, ngắm hoa tuyết].
  - *Điều căm ghét tột cùng:* [Kẻ phản bội, sự yếu đuối hèn nhát, mùi hương giả tạo, sự ồn ào vô nghĩa].
  - *Thói quen cơ thể đặc trưng:* [Hành động nhỏ lặp lại khi suy nghĩ: xoay nhẫn ngón trỏ, nheo mắt, nhấp ngụm rượu trước khi ra tay...].

* **🕸️ Mạng Lưới Mối Quan Hệ & Ân Oán:**
  - *Với Nhân vật A:* [Bản chất quan hệ + Chi tiết mâu thuẫn/liên minh + Bí mật ngầm].
  - *Với Nhân vật B:* [Bản chất quan hệ + Chi tiết mâu thuẫn/liên minh + Bí mật ngầm].
```

---

## 🎨 2. PHONG CÁCH ĐỒ HỌA MẪU CHUẨN (STYLE DNA - 9:16)

* **Tỷ lệ khung hình (Aspect Ratio):** `9:16` (Vertical High-Detail Portrait).
* **Nghệ thuật cốt lõi (Core Art Style):**
  - *Korean Webtoon / Manhwa High-End Semi-Realism* pha trộn *Dark Victorian Gothic Fantasy*.
  - **Khuôn mặt & Thần thái:** Đẹp sắc sảo, xương hàm nam tính góc cạnh hoặc nữ thần thanh tú kiêu kỳ, đôi mắt có chiều sâu chứa ma pháp/cổ ngữ, biểu cảm lạnh lùng quý tộc sâu cay.
  - **Trang phục & Phụ kiện:** Lễ phục quý tộc xa hoa, cổ áo dựng đứng viền đăng ten, thêu chỉ vàng kim cổ điển (gold filigree), đính ngọc bích / đá sapphire xanh lam / hồng ngọc, nhẫn nạm ngọc, trâm bạc tinh xảo.
  - **Ánh sáng & Màu sắc:** Cinematic moody lighting, rim light sắc nét, tông màu xanh bóng đêm (midnight blue), đen tuyền, vàng hoàng kim (royal gold), tương phản cao, làn da sứ phát sáng nhẹ dưới ánh trăng/nến.

---

## 🔄 3. QUY TRÌNH 4 BƯỚC VẬN HÀNH (4-STEP WORKFLOW)

```text
[1. THIẾT LẬP HỒ SƠ SIÊU CHI TIẾT TRONG MASTER CODEX] 
       ↓ Trích xuất đầy đủ 100% diện mạo, trang phục, trang sức, tính cách, sở thích
[2. PROMPT CRAFTING & SINH ẢNH 9:16] 
       ↓ Sinh ảnh qua generate_image (AspectRatio: '9:16')
[3. TRÌNH BÀY PREVIEW ĐỢI NGƯỜI DÙNG DUYỆT] 
       ↓ (Nếu người dùng phản hồi "Duyệt / Đồng ý")
[4. GHI ĐÈ FILE ẢNH CỐ ĐỊNH, ĐỒNG BỘ CODEX & DATABASE WEB]
```

---

## BƯỚC 1: TRÍCH XUẤT NHÂN DẠNG & THIẾT LẬP HỒ SƠ
1. Đọc và cập nhật file `.agents/viet_truyen/novels/<novel_slug>/master_codex.md`.
2. Bắt buộc hoàn thiện đầy đủ mọi mục trong **QUY CHUẨN HỒ SƠ NHÂN VẬT SIÊU CHI TIẾT**.

---

## BƯỚC 2: PROMPT ENGINEERING & SINH ẢNH 9:16
Cấu trúc prompt tiếng Anh chuẩn:
```text
A stunning semi-realistic digital painting of [Character Name and Role], [Expression & Gaze], [Hair style and color], [Facial features and skin tone], wearing [Extravagant noble royal attire, high embroidered collar with intricate gold filigree, ornate jewelry and sapphire gemstone brooches, rings, gloves], [Environment: gothic palace room, ice fortress, or throne chamber], [Subtle magical glowing runes or elemental aura], dramatic chiaroscuro lighting, volumetric moonlight, cold midnight blue and rich gold color palette, extremely detailed, 8k resolution, manhwa cover masterpiece, 9:16 ratio.
```

**Thực thi:**
- Gọi `generate_image` với:
  - `AspectRatio`: `'9:16'`
  - `ImageName`: `char_<story_slug>_<char_slug>`
  - `Prompt`: Prompt chi tiết.

---

## BƯỚC 3: HIỂN THỊ BẢN XEM TRƯỚC (PREVIEW & REVIEW GATE)
**QUY TẮC BẮT BUỘC:** Hiển thị ảnh cho người dùng xem trước và hỏi ý kiến duyệt.

### Mẫu Trình Bày Bản Xem Trước (Preview Template):
```markdown
### 🎨 BẢN XEM TRƯỚC HỒ SƠ NHÂN VẬT SIÊU CHI TIẾT: [Tên Nhân Vật]

![Chân dung [Tên Nhân Vật]]([Đường dẫn ảnh])

* **Bộ Truyện:** [Tên Truyện]
* **Thân Phận & Vai Trò:** [Vai Trò / Thân Phận]
* **Ngoại hình tóm lược:** [Mô tả tóc, mắt, trang phục, trang sức]
* **Sở thích & Tính cách:** [Sở thích, thói quen, bản chất]
* **Phong Cách Đồ Họa:** Korean Manhwa Dark Fantasy Semi-Realism (9:16)
* **Prompt Đã Dùng:** `[Prompt tiếng Anh]`

---
👉 **Đạo hữu có duyệt bức ảnh chân dung này không?**
- Nếu **ĐỒNG Ý**: Tôi sẽ tự động lưu đè vào file ảnh chuẩn và cập nhật hồ sơ siêu chi tiết lên website.
- Nếu **MUỐN CHỈNH SỬA**: Hãy nêu chi tiết điểm bạn muốn thay đổi.
```

---

## BƯỚC 4: ĐỒNG BỘ KHI NGƯỜI DÙNG DUYỆT (SYNC & PUBLISH)
Khi người dùng phản hồi duyệt ("Đồng ý", "Duyệt", "Lưu", "Thay thế"):

1. **QUY TẮC GHI ĐÈ TRỰC TIẾP (DIRECT OVERWRITE LAW):**
   - File ảnh của mỗi nhân vật luôn có một đường dẫn cố định duy nhất:
     `public/characters/<novel_slug>/<character_slug>.jpg`
   - Mỗi khi tạo mới hoặc thay thế ảnh cho nhân vật, **BẮT BUỘC ghi đè (overwrite) trực tiếp** lên tập tin cũ tại đường dẫn này.
   - Không được tạo thêm file trùng lặp đuôi `_v2`, `_copy` hay timestamp làm rác thư mục.
2. **Cập nhật Master Codex:** Ghi đường dẫn ảnh cố định `/characters/<novel_slug>/<character_slug>.jpg` và toàn bộ hồ sơ siêu chi tiết vào `master_codex.md`.
3. **Cập nhật Database Web:**
   ```typescript
   await prisma.character.update({
     where: { id: characterId },
     data: { 
       avatarUrl: `/characters/${novelSlug}/${characterSlug}.jpg`,
       description: fullDetailedDescriptionString 
     }
   });
   ```
4. **Kích hoạt Revalidation:** Website cập nhật ngay lập tức.
