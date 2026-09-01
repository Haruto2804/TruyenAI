# HỆ THỐNG VIẾT TIỂU THUYẾT ĐA TÁC TỬ (MULTI-AGENT NOVEL WRITING FRAMEWORK)

Tài liệu này định nghĩa quy chuẩn vận hành, vai trò của 6 Agent, cấu trúc lưu trữ và quy tắc đồng bộ tự động hóa 100% cho toàn bộ các bộ truyện được sáng tác trên hệ thống Thiên Thư AI.

---

## 📁 1. CẤU TRÚC LƯU TRỮ CHUẨN (NOVEL FOLDER ARCHITECTURE)

Mọi bộ truyện mới khi khởi tạo BẮT BUỘC phải được tổ chức theo cấu trúc thư mục phân cấp như sau:

```text
.agents/viet_truyen/
├── viettruyen.md                                 # [Master Framework] Tài liệu quy chuẩn này
└── novels/
    └── <novel_slug>/                             # Thư mục riêng của từng bộ truyện (vd: tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong)
        ├── master_codex.md                       # [Hồ Sơ Tổng & Ký Ức Vĩnh Cửu] Bối cảnh, Nhân vật, Chú giải & Trạng thái
        ├── characters.md                         # [Visual Dossier & Prompts 9:16] Phác thảo ngoại hình & Prompt tạo ảnh AI
        └── chapters/                             # Thư mục lưu trữ từng chương truyện độc lập
            ├── chapter_1.md                      # Nội dung văn xuôi Chương 1 (đã làm sạch asterisks)
            ├── chapter_2.md                      # Nội dung văn xuôi Chương 2
            └── ...
```

---

## 🧠 2. QUY TRÌNH 6 AGENT TỰ ĐỘNG HÓA (THE 6-AGENT PIPELINE)

Mỗi lần sáng tác chương mới hoặc phát triển cốt truyện, hệ thống phối hợp 6 Agent chuyên trách:

### [SKILL 1] ARCHITECT AGENT (KIẾN TRÚC SƯ CỐT TRUYỆN)
* **Nhiệm vụ:**
  - Đọc và đối chiếu `master_codex.md` trước khi lên kịch bản để đảm bảo tính nhất quán (Logic nhân quả, không mâu thuẫn tình tiết).
  - Phác thảo dàn ý chi tiết từng cảnh (Scene Beats) theo cấu trúc 3 hồi dưới định dạng chuẩn JSON.
  - Xác định rõ: Nhân vật xuất hiện, Mục tiêu cảnh, Xung đột cốt lõi, Khái niệm / Bí thuật / Độc dược mới được tiết lộ.

### [SKILL 2] DRAFTER AGENT (TIỂU THUYẾT GIA NGUYÊN TÁC)
* **Nhiệm vụ:** Chuyển hóa Dàn ý Scene Beats thành văn xuôi văn học thượng thừa.
* **Quy tắc vàng (Strict Constraints):**
  1. **Show, Don't Tell:** Miêu tả hành động, biểu cảm, biến chuyển nội tâm; cấm tóm tắt cảm xúc suông.
  2. **Kích hoạt Ngũ Quan:** Mỗi phân cảnh phải lột tả ít nhất 3 giác quan (Ánh sáng/Thị giác, Âm thanh/Thính giác, Mùi hương/Khứu giác, Nhiệt độ/Xúc giác, Vị giác).
  3. **Hội thoại chân thực:** Ngắn gọn, có hồn, luôn xen kẽ hành động vi mô (micro-actions).
  4. **Lọc bỏ AI Cliches & Asterisks:** Tuyệt đối cấm các từ ngữ sáo rỗng AI và không lưu trữ dấu sao `**` thừa trong văn bản chương.
  5. **Nhịp điệu biến hóa:** Dồn dập trong chiến đấu, sâu lắng tinh tế trong nội tâm.

### [SKILL 3] EDITOR AGENT (BIÊN TẬP VIÊN KIỂM DUYỆT)
* **Nhiệm vụ:** Rà soát bản nháp, đối chiếu với `master_codex.md`, chấm điểm theo định dạng JSON:
  - `score` (Thang điểm 10).
  - `critique` (Nhận xét chi tiết về Nhất quán, Ngũ quan, Show Don't Tell, Nhịp điệu).
  - `action`: Trả về `"PASS"` (nếu score >= 8.5) hoặc `"REWRITE"` (nếu chưa đạt).

### [SKILL 4] MEMORY MANAGER AGENT (QUẢN LÝ KÝ ỨC & TIẾN TRÌNH)
* **Nhiệm vụ:** Trích xuất biến động trạng thái (tu vi, vết thương, ân oán, trang bị, manh mối) sau mỗi chương và ghi vào `master_codex.md`.

### [SKILL 5] VISUAL DIRECTOR AGENT (ĐẠO DIỄN HÌNH ẢNH & PROMPT MASTER)
* **Nhiệm vụ:**
  - Khi xuất hiện nhân vật mới, tự động phác thảo diện mạo chi tiết từ đầu đến chân (Head-to-Toe Visual Dossier).
  - Soạn sẵn Prompt tiếng Anh chuẩn studio (Midjourney v6 / FLUX.1 / SDXL, tỉ lệ dọc 9:16, Manhwa Artstyle, 8k resolution, cinematic lighting).
  - **Tự động xuất / cập nhật vào file `characters.md`** của bộ truyện để tác giả/admin dễ dàng xem trực quan và copy đi tạo ảnh.
* **Quy tắc nhận diện file ảnh thông minh (`tennhanvat.*`):**
  - Hệ thống tự động phát hiện và nhận diện **BẤT KỲ ĐỊNH DẠNG ẢNH NÀO** (`.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`) trong thư mục `public/characters/<novel_slug>/`.
  - Tác giả chỉ cần thả file ảnh vào thư mục theo tên/slug nhân vật (ví dụ: `caelen.png`, `lilian.webp`, `karlov.jpg`) mà không cần can thiệp code!

### [SKILL 6] LOREKEEPER AGENT (BÁCH KHOA TOÀN THƯ & TỰ ĐỘNG PHÁT HIỆN CHÚ GIẢI)
* **Nhiệm vụ:**
  - Tự động quét phân tích nội dung chương truyện để phát hiện các thuật ngữ, độc dược, bí thuật, địa danh, bảo vật, công pháp, cảnh giới mới mà người đọc cần tra cứu.
  - Phân loại danh mục (`Độc Dược`, `Bí Thuật`, `Địa Danh`, `Bảo Vật`, `Thế Lực`, `Cảnh Giới`...) và viết định nghĩa cô đọng, dễ hiểu.
  - **Tự động ghi vào `master_codex.md` và Database** để kích hoạt tính năng X-Ray Interactive Reader (người đọc chạm vào từ khóa là hiện bảng giải nghĩa tức thì).

---

## ⚡ 3. GIAO THỨC ĐỒNG BỘ 1-LỆNH (AUTOMATED 1-COMMAND SYNC)

Mọi thay đổi về truyện, chương mới, nhân vật mới, ảnh mới (mọi định dạng), chú giải mới đều được tự động hóa 100% bằng 1 câu lệnh duy nhất:

```bash
npm run sync:novel
```

**Cơ chế thực thi của lệnh:**
1. Quét toàn bộ danh sách truyện trong `.agents/viet_truyen/novels/`.
2. Đồng bộ Story Info từ `master_codex.md`.
3. Tự động scan thư mục ảnh `public/characters/<novel_slug>/` để gán đường dẫn Avatar với bất kỳ đuôi mở rộng nào (`.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`).
4. Tự động sinh / cập nhật file `characters.md` với đầy đủ Visual Dossier & AI Prompts 9:16.
5. Tự động nạp toàn bộ Chú giải (Lores) vào Database.
6. Tự động nạp toàn bộ Chương truyện (`chapters/chapter_*.md`), lọc sạch asterisks và lưu vào Database.