# Project Blueprint: Thiên Thư AI

## 1. Product Concept & Scoping
* **Tên dự án**: **Thiên Thư AI** (*ThienThu.ai*)
* **Slogan / Tagline**: *Kho Tàng Kỳ Thư Vô Tận Từ Trí Tuệ Nhân Tạo*
* **Mô hình**: Nền tảng đọc truyện online do Admin sáng tác bằng AI và xuất bản lên hệ thống; độc giả truy cập để đọc trực tiếp.
* **Giá trị cốt lõi**: Trải nghiệm đọc truyện mượt mà, nội dung do AI tạo ra độc đáo và hấp dẫn, giao diện cao cấp không gây mỏi mắt.
* **Đối tượng người dùng**: Độc giả đọc truyện trực tuyến (chủ yếu sử dụng Smartphone).
* **Mục tiêu MVP**: Đưa sản phẩm lên sóng nhanh nhất, luồng đọc - quản trị - tạo truyện AI hoạt động trơn tru.

---

## 2. Information Architecture & UX
* **Định hướng thiết kế**: **Mobile-First** (Tối ưu vuốt chạm trên di động, hiển thị co giãn chuẩn mực trên máy tính bảng và desktop).
* **Trải nghiệm đọc**: **Distraction-Free Reader** (Tập trung 100% vào nội dung chữ, không quảng cáo hay pop-up rườm rà).
* **Cấu trúc trang (Sitemap)**:
  * `/` : Trang chủ (Danh sách truyện nổi bật, truyện mới, lọc theo thể loại, tìm kiếm).
  * `/truyen/[slug]` : Trang thông tin chi tiết truyện (Bìa, tóm tắt, danh sách chương).
  * `/truyen/[slug]/[chapter]` : Trang đọc chương (Chuyển chương mượt, mục lục, chỉnh cỡ chữ/độ sáng, tự lưu tiến độ).
  * `/admin` : Studio quản trị (Trang CMS cơ bản để quản lý bộ truyện và dán nội dung chương do Antigravity viết).

---

## 3. Styling & Aesthetics
* **Phong cách thẩm mỹ**: **Sleek Cyber-Dark Theme** (Hiện đại, huyền bí, cao cấp).
  * **Background chính**: Deep Dark `hsl(222, 47%, 11%)` & `hsl(222, 47%, 8%)`.
  * **Màu chữ**: Trắng ngà/Off-white `hsl(210, 40%, 96%)` (chống chói mắt khi đọc đêm).
  * **Accent Color**: Tím neon / Cyan AI `hsl(265, 89%, 66%)`.
* **Typography**:
  * **Tiêu đề / Giao diện**: `Outfit` hoặc `Inter` (Sans-serif hiện đại, rõ ràng).
  * **Nội dung truyện**: `Lora` hoặc `Merriweather` (Serif kinh điển, hỗ trợ tiếng Việt tuyệt đối, chuẩn cảm giác đọc tiểu thuyết).

---

## 4. Technical Architecture
* **Framework**: **Next.js 14/15 (App Router)** - Fullstack React + Node.js trong 1 codebase duy nhất.
* **Styling**: **Tailwind CSS** (Responsive Mobile-First).
* **Database & ORM**: **SQLite** quản lý qua **Prisma ORM** (Zero-config, siêu tốc độ đọc, sẵn sàng nâng cấp lên PostgreSQL/MongoDB khi cần).
* **AI Engine (Offline)**: Sử dụng trực tiếp **Antigravity IDE** làm trợ lý đắc lực để sáng tác truyện, sau đó admin sẽ copy/paste vào hệ thống. Không cần API Key bên ngoài.
* **Deployment**: Vercel / Cloudflare (Chi phí hosting ban đầu $0).

---

## 5. SEO & Performance
* **SEO**: 
  * Tự động tạo thẻ Meta OpenGraph (Tiêu đề, tóm tắt, ảnh bìa) khi chia sẻ link lên Facebook, Zalo, Telegram.
  * Server-Side Rendering (SSR) giúp Google Bot thu thập dữ liệu (index) từng chương truyện nhanh chóng.
  * Cấu trúc thẻ ngữ nghĩa chuẩn (`<article>`, `<header>`, `<h1>`).
* **Performance**: Tải trang tức thì nhờ Server Components (Zero-Javascript cho phần nội dung text thuần túy).

---

## 6. Roadmap: MVP vs Phase 2

### Phase 1 (MVP - Bản ra mắt):
1. Giao diện Đọc truyện chuẩn Mobile (Chuyển chương, chỉnh font/size, nhớ chương đang đọc dở trên trình duyệt).
2. Danh mục truyện & Tìm kiếm / Lọc thể loại.
3. Trang Admin quản trị: CMS cơ bản (Thêm/Sửa truyện & Đăng chương mới bằng cách copy/paste nội dung từ Antigravity).
4. Triển khai Live Website.

### Phase 2 (Nâng cấp tương lai):
1. Hệ thống tương tác độc giả: Thả tim, chấm sao, bình luận dưới mỗi chương.
2. AI Text-to-Speech (Chuyển truyện chữ thành Audiobook giọng đọc AI).
3. Đăng nhập tài khoản, tủ truyện cá nhân đồng bộ đa thiết bị.
