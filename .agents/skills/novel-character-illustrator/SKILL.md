---
name: novel-character-illustrator
description: "Tự động đọc bối cảnh truyện (Master Codex), trích xuất đặc điểm ngoại hình, tạo ảnh chân dung nhân vật AI chất lượng cao (3:4), hiển thị bản xem trước (Preview) cho người dùng duyệt và chỉ cập nhật lên Web/Database khi đã được phê duyệt."
---

# NOVEL CHARACTER ILLUSTRATOR (HỌA SƯ NHÂN VẬT TIỂU THUYẾT)

Skill này chuyên trách việc phân tích bối cảnh, trích xuất nhân dạng, sinh ảnh chân dung nghệ thuật chất lượng cao (Cinematic Dark Fantasy / Semi-realistic 3:4) và thực hiện quy trình **Human-in-the-Loop Review (Xem trước $\rightarrow$ Duyệt $\rightarrow$ Đăng)**.

---

## 🔄 QUY TRÌNH 4 BƯỚC VẬN HÀNH (4-STEP WORKFLOW)

```text
[1. ĐỌC CODEX & TRÍCH XUẤT] 
       ↓
[2. PROMPT CRAFTING & SINH ẢNH (3:4)] 
       ↓
[3. HIỂN THỊ PREVIEW ĐỢI NGƯỜI DÙNG DUYỆT] 
       ↓ (Nếu duyệt "Đồng ý")
[4. ĐỒNG BỘ VÀO MASTER CODEX & DATABASE WEB]
```

---

## BƯỚC 1: ĐỌC BỐI CẢNH & TRÍCH XUẤT NHÂN DẠNG
Khi được yêu cầu tạo ảnh cho nhân vật $X$ trong bộ truyện $Y$:
1. Đọc file `.agents/viet_truyen/novels/<novel_slug>/master_codex.md` và các chương liên quan.
2. Trích xuất bảng nhân dạng tiêu chuẩn:
   - **Tên & Thân phận:** (VD: *Caelen Von Ravenwood - Đệ tam công tử Gia tộc Băng Sương*).
   - **Độ tuổi & Khuôn mặt:** (VD: *Nam 20 tuổi, xương hàm góc cạnh, mắt màu tro tàn sắc lạnh, thần thái kiếp trước sát thủ giả heo ăn thịt hổ*).
   - **Mái tóc & Làn da:** (VD: *Tóc đen nhánh dài chấm vai bay trong gió tuyết, da trắng tái quý tộc*).
   - **Trang phục & Phụ kiện:** (VD: *Lễ phục Đại Lễ Huyết Ưng viền lông chồn, áo khoác choàng đen thêu chỉ vàng kim, trâm cài bạc*).
   - **Hiệu ứng Khí trường (Aura):** (VD: *Vòng tròn ma pháp cổ ngữ Băng Sương xoay quanh đồng tử Ma Đồng Giải Cấu, sương băng xanh lam nhạt tỏa quanh người*).
   - **Phong cách Nghệ thuật (Art Style):** *Semi-realistic Fantasy Character Portrait, 8k resolution, cinematic dramatic lighting, masterpiece digital illustration, 3:4 aspect ratio.*

---

## BƯỚC 2: PROMPT ENGINEERING & SINH ẢNH
Ghép nối các đặc tính thành prompt tiếng Anh chuẩn nhiếp ảnh mỹ thuật:

### Cấu trúc Prompt Chuẩn:
```text
[Subject & Identity], [Detailed Face & Eyes], [Hair & Expression], [Costume & Clothing Details], [Magical Aura & Element FX], [Background & Setting Atmosphere], [Lighting & Art Quality Modifiers: cinematic rim lighting, 8k, detailed concept art, trending on artstation, masterpiece, 3:4 portrait].
```

**Thực thi sinh ảnh:**
- Gọi công cụ `generate_image` với:
  - `AspectRatio`: `'3:4'` (hoặc `'1:1'`)
  - `ImageName`: `char_<story_slug>_<char_slug>`
  - `Prompt`: Prompt vừa tạo.

---

## BƯỚC 3: HIỂN THỊ BẢN XEM TRƯỚC (PREVIEW & REVIEW GATE)
**QUY TẮC BẮT BUỘC:** Tuyệt đối KHÔNG tự ý đăng ảnh lên cơ sở dữ liệu web ngay lập tức. Phải hiển thị bản xem trước cho người dùng đánh giá.

### Mẫu Trình Bày Bản Xem Trước (Preview Template):
```markdown
### 🎨 BẢN XEM TRƯỚC HỒ SƠ NHÂN VẬT: [Tên Nhân Vật]

![Chân dung [Tên Nhân Vật]]([Đường dẫn ảnh artifact])

* **Bộ Truyện:** [Tên Truyện]
* **Thân Phận:** [Vai Trò / Thân Phận]
* **Đặc Điểm Thần Thái:** [Tóm tắt đặc điểm mắt, tóc, trang phục, aura ma thuật]
* **Prompt Tạo Ảnh:** `[Prompt tiếng Anh đã sử dụng]`

---
👉 **Đạo hữu có duyệt bức ảnh này không?**
1. **Duyệt & Đăng Lên Web:** Tôi sẽ tự động lưu vào hồ sơ nhân vật và đồng bộ lên website ngay lập tức.
2. **Yêu Cầu Chỉnh Sửa:** Hãy nêu chi tiết điểm bạn muốn thay đổi (ví dụ: *đổi màu mắt, thay đổi trang phục, chỉnh thần thái lạnh lùng hơn...*).
```

---

## BƯỚC 4: ĐỒNG BỘ KHI NGƯỜI DÙNG DUYỆT (SYNC & PUBLISH)
Chỉ khi người dùng phản hồi xác nhận (ví dụ: *"Duyệt", "Đồng ý", "Đăng lên đi", "Ok"*):

1. **Lưu file ảnh:** Sao chép hoặc di chuyển ảnh vào thư mục public của dự án:
   `public/characters/<novel_slug>/<character_slug>.png` (hoặc link URL cố định).
2. **Cập nhật Master Codex:** Ghi đường dẫn ảnh vào trường `* **Ảnh Avatar:**` trong `.agents/viet_truyen/novels/<novel_slug>/master_codex.md`.
3. **Cập nhật Database Web:**
   Chạy cập nhật Prisma:
   ```typescript
   await prisma.character.update({
     where: { id: characterId },
     data: { avatarUrl: newAvatarUrl }
   });
   ```
4. **Revalidate Web Cache:** Kích hoạt `revalidateAllCharacterPaths(storySlug)` để website hiển thị ảnh mới tức thì.
