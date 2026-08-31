---
name: novel-character-illustrator
description: "Tự động đọc bối cảnh truyện (Master Codex), trích xuất đặc điểm ngoại hình, tạo ảnh chân dung nhân vật AI chuẩn phong cách Dark Fantasy Manhwa Semi-Realistic 9:16, hiển thị bản xem trước (Preview) cho người dùng duyệt và chỉ cập nhật lên Web/Database khi đã được phê duyệt."
---

# NOVEL CHARACTER ILLUSTRATOR (HỌA SƯ NHÂN VẬT TIỂU THUYẾT 9:16)

Skill này chuyên trách việc phân tích bối cảnh, trích xuất nhân dạng, sinh ảnh chân dung nghệ thuật siêu phẩm chuẩn phong cách **Dark Fantasy Noble / Korean Manhwa Semi-Realistic (Tỷ lệ 9:16)** và thực hiện quy trình **Human-in-the-Loop Review (Xem trước $\rightarrow$ Duyệt $\rightarrow$ Đăng)**.

---

## 🎨 1. PHONG CÁCH ĐỒ HỌA MẪU CHUẨN (STYLE DNA - 9:16)

* **Tỷ lệ khung hình (Aspect Ratio):** `9:16` (Vertical High-Detail Portrait).
* **Nghệ thuật cốt lõi (Core Art Style):**
  - *Korean Webtoon / Manhwa High-End Semi-Realism* pha trộn *Dark Victorian Gothic Fantasy*.
  - **Khuôn mặt & Thần thái:** Đẹp sắc sảo, xương hàm nam tính góc cạnh hoặc nữ thần thanh tú kiêu kỳ, đôi mắt có chiều sâu chứa ma pháp/cổ ngữ, biểu cảm lạnh lùng quý tộc sâu cay.
  - **Trang phục & Phụ kiện:** Lễ phục quý tộc xa hoa, cổ áo dựng đứng viền đăng ten, thêu chỉ vàng kim cổ điển (gold filigree), đính ngọc bích / đá sapphire xanh lam / hồng ngọc, nhẫn nạm ngọc, trâm bạc tinh xảo.
  - **Ánh sáng & Màu sắc:** Cinematic moody lighting, rim light sắc nét, tông màu xanh bóng đêm (midnight blue), đen tuyền, vàng hoàng kim (royal gold), tương phản cao, làn da sứ phát sáng nhẹ dưới ánh trăng/nến.

---

## 🔄 2. QUY TRÌNH 4 BƯỚC VẬN HÀNH (4-STEP WORKFLOW)

```text
[1. ĐỌC MASTER CODEX TRUYỆN] 
       ↓ Trích xuất đặc điểm nhận dạng, trang phục, khí chất
[2. PROMPT CRAFTING & SINH ẢNH 9:16] 
       ↓ Sinh ảnh qua generate_image (AspectRatio: '9:16')
[3. TRÌNH BÀY PREVIEW ĐỢI NGƯỜI DÙNG DUYỆT] 
       ↓ (Nếu người dùng phản hồi "Duyệt / Đồng ý")
[4. LƯU ẢNH VÀO PUBLIC, CẬP NHẬT MASTER CODEX & DATABASE WEB]
```

---

## BƯỚC 1: ĐỌC BỐI CẢNH & TRÍCH XUẤT NHÂN DẠNG
1. Đọc file `.agents/viet_truyen/novels/<novel_slug>/master_codex.md` và các chương văn xuôi.
2. Trích xuất các chi tiết:
   - Tên & Thân phận.
   - Thần thái & Cảm xúc (lạnh lùng, thâm sâu, ngạo nghễ, tàn nhẫn, bí ẩn).
   - Tóc, Mắt, Da, Trang phục, Ma pháp / Aura đặc trưng.

---

## BƯỚC 2: PROMPT ENGINEERING & SINH ẢNH 9:16
Cấu trúc prompt tiếng Anh chuẩn:
```text
A stunning semi-realistic digital painting of [Character Name and Role], [Expression & Gaze], [Hair style and color], [Facial features and skin], wearing [Extravagant noble royal attire, high embroidered collar with intricate gold filigree, ornate jewelry and sapphire gemstone brooches, rings], [Sitting on a dark carved throne or in a gothic palace room], [Subtle magical ice/frost runes glowing], dramatic chiaroscuro lighting, volumetric moonlight, cold midnight blue and rich gold color palette, extremely detailed, 8k resolution, manhwa cover masterpiece, 9:16 ratio.
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
### 🎨 BẢN XEM TRƯỚC HỒ SƠ NHÂN VẬT: [Tên Nhân Vật]

![Chân dung [Tên Nhân Vật]]([Đường dẫn ảnh])

* **Bộ Truyện:** [Tên Truyện]
* **Thân Phận:** [Vai Trò / Thân Phận]
* **Phong Cách:** Korean Manhwa Dark Fantasy Semi-Realism (9:16)
* **Prompt Đã Dùng:** `[Prompt tiếng Anh]`

---
👉 **Đạo hữu có duyệt bức ảnh chân dung này không?**
- Nếu **ĐỒNG Ý**: Tôi sẽ tự động lưu và cập nhật vào hồ sơ nhân vật trên website.
- Nếu **MUỐN CHỈNH SỬA**: Hãy nêu chi tiết điểm bạn muốn thay đổi (ví dụ: *tóc ngắn hơn, mắt sáng hơn, đổi trang phục...*).
```

---

## BƯỚC 4: ĐỒNG BỘ KHI NGƯỜI DÙNG DUYỆT (SYNC & PUBLISH)
Khi người dùng phản hồi duyệt ("Đồng ý", "Duyệt", "Lưu", "Thay thế"):

1. **QUY TẮC GHI ĐÈ TRỰC TIẾP (DIRECT OVERWRITE LAW):**
   - File ảnh của mỗi nhân vật luôn có một đường dẫn cố định duy nhất:
     `public/characters/<novel_slug>/<character_slug>.jpg`
   - Mỗi khi tạo mới hoặc thay thế ảnh cho nhân vật, **BẮT BUỘC ghi đè (overwrite) trực tiếp** lên tập tin cũ tại đường dẫn này.
   - Không được tạo thêm file trùng lặp đuôi `_v2`, `_copy` hay timestamp làm rác thư mục.
2. **Cập nhật Master Codex:** Ghi đường dẫn ảnh cố định `/characters/<novel_slug>/<character_slug>.jpg` vào trường `* **Ảnh Avatar:**` trong `master_codex.md`.
3. **Cập nhật Database Web:**
   ```typescript
   await prisma.character.update({
     where: { id: characterId },
     data: { avatarUrl: `/characters/${novelSlug}/${characterSlug}.jpg` }
   });
   ```
4. **Kích hoạt Revalidation:** Thực thi `revalidateAllCharacterPaths(storySlug)` để website cập nhật ngay lập tức.

