# QUY TRÌNH VIẾT TRUYỆN LIÊN TỤC VÀ ĐĂNG TẢI (CONTINUOUS IMPROVEMENT WORKFLOW)

Từ bây giờ, đối với toàn bộ quá trình viết truyện, bạn **BẮT BUỘC** phải tuân thủ nghiêm ngặt quy trình tối ưu hóa và xuất bản sau đây. Vòng lặp này đảm bảo chất lượng tác phẩm luôn đạt trạng thái hoàn hảo (10/10) trước khi đến tay độc giả.

## VÒNG LẶP KIỂM DUYỆT KHẮT KHE (THE PERFECTION LOOP)

Sau khi hoàn thành bản nháp (draft) của bất kỳ chương truyện nào, KHÔNG ĐƯỢC PHÉP ĐĂNG NGAY. Phải đưa chương truyện qua vòng lặp kiểm duyệt sau:

1. **Phân tích Logic Cốt Truyện (Độc Giả Khó Tính):**
   - Đọc và áp dụng quy tắc tại `c:\Users\ngohi\OneDrive\Documents\TruyenAI\.agents\skills\doc-gia-kho-tinh\doc_gia_kho_tinh.md`.
   - Rà soát ma trận 4 lớp (Nhân vật, Bối cảnh, Sức mạnh, Nhân quả).
   - Tự phản biện và đưa ra đề xuất sửa đổi để lấp mọi lỗ hổng logic, dù là nhỏ nhất.

2. **Phân tích Văn Phong (Tác Giả Khó Tính):**
   - Đọc và áp dụng quy tắc tại `c:\Users\ngohi\OneDrive\Documents\TruyenAI\.agents\skills\tac-gia-kho-tinh\tac_gia_kho_tinh.md`.
   - Rà soát Line-Editing cực kỳ gắt gao. Tìm và diệt: Telling (kể lể), Câu bị động, Author Intrusion (tác giả xen vào), Lỗi cảm xúc kép, Từ lọc (Filtering words).

3. **Cải Tiến Bắt Buộc (Iterative Refinement):**
   - Thực hiện viết lại (Rewrite) dựa trên kết quả phân tích của cả hai Persona trên.
   - **Làm liên tục, lặp đi lặp lại vòng phân tích - sửa đổi này cho đến khi bản thảo đạt được trạng thái hoàn hảo nhất (Không còn lỗi nào bị bắt, điểm đánh giá 10/10).**

## QUY TRÌNH ĐĂNG TẢI TRUYỆN (PUBLISHING PROCESS)

Sau khi bản thảo đã phá đảo vòng lặp kiểm duyệt và đạt trạng thái hoàn hảo nhất, tiến hành đăng tải theo các bước sau:

1. **Tuân Thủ Quy Tắc Đăng Tải:**
   - Đọc và áp dụng NGAY LẬP TỨC các quy định tại `c:\Users\ngohi\OneDrive\Documents\TruyenAI\.agents\rules\publishing_rules.md`.
   - Chuẩn hóa tiêu đề chương đúng định dạng `Chương <số>: <Tiêu đề>`.
   - Lọc sạch asterisks (`**`, `*`) thừa nếu có.
   - Cập nhật mọi nhân vật mới (Character Dossier) và khái niệm mới (Lores/Glossary) vào các tệp `.md` tương ứng. Đảm bảo quy tắc bảo mật cốt truyện (Không Spoiler).

2. **Đồng Bộ Tự Động (Auto-Sync):**
   - Sau khi các tệp markdown đã được chuẩn hóa và lưu trữ đúng vị trí, chạy câu lệnh đồng bộ toàn diện vào Database:
     ```bash
     npm run sync:novel
     ```
   - Chờ tiến trình chạy ngầm hoàn tất để xác nhận truyện đã được xuất bản thành công.
