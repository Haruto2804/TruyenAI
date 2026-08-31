# HỆ THỐNG VIẾT TIỂU THUYẾT ĐA TÁC TỬ (MULTI-AGENT NOVEL WRITING FRAMEWORK)

Tài liệu này định nghĩa quy chuẩn vận hành, vai trò của 4 Agent, cấu trúc lưu trữ và quy tắc đồng bộ bắt buộc cho toàn bộ các bộ truyện được sáng tác trên hệ thống Thiên Thư AI.

---

## 📁 1. CẤU TRÚC LƯU TRỮ CHUẨN (NOVEL FOLDER ARCHITECTURE)

Mọi bộ truyện mới khi khởi tạo BẮT BUỘC phải được tổ chức theo cấu trúc thư mục phân cấp như sau:

```text
.agents/viet_truyen/
├── viettruyen.md                                 # [Master Framework] Tài liệu quy chuẩn này
└── novels/
    └── <novel_slug>/                             # Thư mục riêng của từng bộ truyện (vd: dai-cong-tu-rac-ruoi-cua-gia-toc-bang-suong)
        ├── master_codex.md                       # [Hồ Sơ Tổng & Bộ Nhớ Vĩnh Cửu] Lưu trữ 4 Skills, Bối cảnh, Nhân vật, Chú giải & Trạng thái
        └── chapters/                             # Thư mục lưu trữ từng chương truyện độc lập
            ├── chapter_1.md                      # Nội dung văn xuôi Chương 1
            ├── chapter_2.md                      # Nội dung văn xuôi Chương 2
            └── ...
```

---

## 🧠 2. QUY TRÌNH 4 AGENT & ĐỐI CHIẾU DỮ LIỆU (THE 4-AGENT PIPELINE)

Mỗi lần sáng tác chương mới hoặc phát triển cốt truyện, AI phải đóng vai lần lượt 4 Agent chuyên biệt:

### [SKILL 1] ARCHITECT AGENT (KIẾN TRÚC SƯ CỐT TRUYỆN)
* **Nhiệm vụ:**
  - Đọc và đối chiếu `master_codex.md` trước khi lên kịch bản để đảm bảo tính nhất quán (Logic nhân quả, không mâu thuẫn tình tiết).
  - Phác thảo dàn ý chi tiết từng cảnh (Scene Beats) theo cấu trúc 3 hồi dưới định dạng chuẩn JSON.
  - Xác định rõ: Nhân vật xuất hiện, Mục tiêu cảnh, Xung đột cốt lõi, Thông tin/Khái niệm mới được tiết lộ.

### [SKILL 2] DRAFTER AGENT (TIỂU THUYẾT GIA NGUYÊN TÁC)
* **Nhiệm vụ:** Chuyển hóa Dàn ý Scene Beats thành văn xuôi văn học thượng thừa.
* **Quy tắc vàng (Strict Constraints):**
  1. **Show, Don't Tell:** Miêu tả hành động, biểu cảm, biến chuyển nội tâm; cấm tóm tắt cảm xúc suông.
  2. **Kích hoạt Ngũ Quan:** Mỗi phân cảnh phải lột tả ít nhất 3 giác quan (Ánh sáng/Thị giác, Âm thanh/Thính giác, Mùi hương/Khứu giác, Nhiệt độ/Xúc giác, Vị giác).
  3. **Hội thoại chân thực:** Ngắn gọn, có hồn, luôn xen kẽ hành động vi mô (micro-actions).
  4. **Lọc bỏ AI Cliches:** Tuyệt đối cấm các từ ngữ sáo rỗng AI ("như một minh chứng cho", "đầy hứa hẹn", "bỗng nhiên", "một bản giao hưởng").
  5. **Nhịp điệu biến hóa:** Dồn dập trong chiến đấu, sâu lắng tinh tế trong nội tâm.

### [SKILL 3] EDITOR AGENT (BIÊN TẬP VIÊN KIỂM DUYỆT)
* **Nhiệm vụ:** Rà soát bản nháp, đối chiếu với `master_codex.md`, chấm điểm theo định dạng JSON:
  - `score` (Thang điểm 10).
  - `critique` (Nhận xét chi tiết về Nhất quán, Ngũ quan, Show Don't Tell, Nhịp điệu).
  - `action`: Trả về `"PASS"` (nếu score >= 8.5) hoặc `"REWRITE"` (nếu chưa đạt).

### [SKILL 4] MEMORY MANAGER AGENT (NGƯỜI QUẢN LÝ KÝ ỨC & ĐỒNG BỘ)
* **Nhiệm vụ:** Trích xuất siêu dữ liệu (Metadata) sau mỗi chương và thực thi **Giao Thức Đồng Bộ (Sync Protocol)**.

### [SKILL 5] ILLUSTRATOR AGENT (HỌA SƯ NHÂN VẬT & MINH HỌA)
* **Nhiệm vụ:** Đọc bối cảnh `master_codex.md`, trích xuất nhân dạng, sinh ảnh AI tỷ lệ 3:4 chân dung chất lượng cao.
* **Quy tắc duyệt (Review Gate):** Luôn tạo bản xem trước (Preview) cho người dùng phê duyệt trước khi lưu và đồng bộ lên Database web.
* **Chi tiết kỹ thuật:** Xem file skill riêng tại [SKILL.md](file:///c:/Users/ngohi/OneDrive/Documents/TruyenAI/.agents/skills/novel-character-illustrator/SKILL.md).

---


## ⚡ 3. GIAO THỨC ĐỒNG BỘ BẮT BUỘC (MANDATORY SYNC PROTOCOL)

Khi sáng tác bất kỳ chương mới nào:

1. **Phát Hiện Nhân Vật Mới (New Characters):**
   - Nếu trong chương xuất hiện nhân vật mới (dù là phụ hay phản diện ngắn hạn), phải lập tức trích xuất và lập **Hồ Sơ Nhân Vật Siêu Chi Tiết (Ultra-Detailed Dossier)** theo chuẩn:
     - `Tên đầy đủ`, `Vai trò`, `Danh xưng & Biệt hiệu`, `Cảnh giới tu vi`.
     - `Diện mạo & Ngoại hình (Head-to-Toe)`: Chiều cao, vóc dáng, màu da, mái tóc, đôi mắt ma nhãn, ngũ quan thần thái, trang phục quý tộc/chiến bào chi tiết từng đường kim mũi chỉ, trang sức phụ kiện.
     - `Vũ khí, Bảo vật & Tuyệt kỹ ma pháp`.
     - `Tính cách & Chiều sâu tâm lý` (bản chất, phong cách hành sự, tâm ma quá khứ).
     - `Sở thích & Thói quen vi mô` (món ăn/rượu trà ưa chuộng, thói quen khi tính kế, điều ghét cay ghét đắng).
     - `Mạng lưới quan hệ & Ân oán`.
   - **Ghi ngay vào mục `## 2. Character Codex` trong file `master_codex.md`** của bộ truyện đó.
   - Đồng bộ vào cơ sở dữ liệu (`prisma.character.upsert`).

2. **Phát Hiện Khái Niệm / Thuật Ngữ / Chú Giải Mới (New Lore & Glossary):**
   - Nếu xuất hiện thuật ngữ lạ, bí thuật, độc dược, địa danh, bảo vật, công pháp, cảnh giới mà người đọc có thể bỡ ngỡ:
   - **Ghi ngay vào mục `## 3. Lore & Glossary Codex` trong file `master_codex.md`** kèm phân loại (`Độc Dược`, `Bí Thuật`, `Địa Danh`, `Bảo Vật`...) và lời giải thích ngắn gọn, dễ hiểu.
   - Đồng bộ vào cơ sở dữ liệu (`prisma.lore.create`).

3. **Cập Nhật Trạng Thái (State Updates):**
   - Ghi lại các thay đổi quan trọng sau chương vào `master_codex.md`:
     - *Status:* Thay đổi tu vi, vết thương, trạng thái sinh tử.
     - *Inventory:* Đồ vật/vũ khí vừa nhận được hoặc bị phá hủy.
     - *Relationships:* Biến chuyển quan hệ đồng minh, thù địch, nội gián.
     - *Plot Hooks:* Các manh mối/bí mật chưa được giải quyết.

4. **Tạo File Chương Riêng Biệt:**
   - Lưu trữ bản văn xuôi hoàn chỉnh đã qua duyệt vào `.agents/viet_truyen/novels/<novel_slug>/chapters/chapter_<N>.md`.
   - Đăng tải / Cập nhật chương lên cơ sở dữ liệu web (`prisma.chapter.upsert`).