# QUY TẮC ĐĂNG TẢI & ĐỒNG BỘ TRUYỆN (PUBLISHING & SYNC RULES)

Mỗi khi đăng tải hoặc đồng bộ truyện lên hệ thống web và cơ sở dữ liệu, BẮT BUỘC phải tuân thủ nghiêm ngặt các điều khoản sau:

## 1. Chuẩn Hóa Tiêu Đề Chương (Chapter Title Format)
* Khi lưu trữ hoặc đăng tải chương truyện vào Database, tiêu đề chương **BẮT BUỘC PHẢI CÓ DẠNG**:
  ```text
  Chương <số>: <Tiêu đề chương>
  ```
  *(Ví dụ: `Chương 1: Người Chết Không Để Lại Dấu Vết`, `Chương 2: Những Bức Ảnh Đang Mờ Dần`)*.
* Tuyệt đối không được chỉ lưu tiêu đề trần (Ví dụ: `Người Chết Không Để Lại Dấu Vết`) mà thiếu tiền tố `Chương <số>: `.

## 2. Đồng Bộ Toàn Diện Vào Database (Full Entity Synchronization)
Mỗi lần chạy đồng bộ hoặc đăng truyện mới, KHÔNG ĐƯỢC chỉ đăng mỗi nội dung chương truyện, mà **PHẢI ĐỒNG BỘ TOÀN DIỆN**:
1. **Mô tả truyện (Story Summary & Genre):** Cập nhật đầy đủ tóm tắt, thể loại, bối cảnh từ `master_codex.md` vào bảng `Story`.
2. **Hồ sơ nhân vật (Character Dossier):** Quét toàn bộ nhân vật chính, nhân vật phụ, vai trò, đặc điểm nhận diện, tính cách từ `master_codex.md` và lưu vào bảng `Character`.
3. **Bách khoa chú giải (Lores & Glossary):** Quét toàn bộ thuật ngữ, khái niệm, địa danh, đạo cụ, bí thuật từ `master_codex.md` và lưu vào bảng `Lore` (phục vụ tính năng X-Ray Reader).
4. **Chương truyện (Chapters):** Lọc sạch asterisks thừa, chuẩn hóa định dạng và lưu vào bảng `Chapter` (`isVip: false`, `price: 0`).

## 3. Quy Tắc Bảo Mật Cốt Truyện & Tăng Tính Bí Ẩn (Anti-Spoiler & Mystery Rule)
* **TUYỆT ĐỐI KHÔNG TIẾT LỘ TWIST / SPOILER:**
  - Hồ sơ nhân vật hiển thị công khai trên Web (X-Ray Reader Modal) **KHÔNG ĐƯỢC PHÉP** chứa bất kỳ cú plot twist, bí mật đảo ngược tình thế, hay tiết lộ chân tướng thủ phạm/kết cục (Ví dụ: cấm tiết lộ ai chưa chết, ai là kẻ chủ mưu thực sự, bí mật thí nghiệm chấn động...).
  - Mọi bí mật lớn phải được chuyển thể thành **Ẩn số (Mysteries)**, **Nghi vấn mở đầu** hoặc **Manh mối khơi gợi sự tò mò** để thôi thúc độc giả đọc tiếp.
  - Phân tách độc lập:
    * `master_codex.md`: Ký ức nội bộ của Agent tác giả (chứa toàn bộ bí mật và twist để phục vụ mạch viết).
    * `characters.md`: Hồ sơ diện mạo & tâm lý công khai dành cho độc giả (100% không spoiler).
