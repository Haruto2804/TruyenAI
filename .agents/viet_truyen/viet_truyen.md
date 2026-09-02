# HỆ THỐNG VIẾT TIỂU THUYẾT ĐA TÁC TỬ (MULTI-AGENT NOVEL WRITING FRAMEWORK)

Tài liệu này định nghĩa quy chuẩn vận hành, vai trò của 8 Agent, cấu trúc lưu trữ và quy tắc đồng bộ tự động hóa 100% cho toàn bộ các bộ truyện được sáng tác trên hệ thống Thiên Thư AI.

---

## 📁 1. CẤU TRÚC LƯU TRỮ CHUẨN (NOVEL FOLDER ARCHITECTURE)

Mọi bộ truyện mới khi khởi tạo BẮT BUỘC phải được tổ chức theo cấu trúc thư mục phân cấp như sau:

```text
.agents/viet_truyen/
├── viettruyen.md                                 # [Master Framework] Tài liệu quy chuẩn này
├── writing_style_guide.md                        # [Phụ lục] Cẩm nang văn phong & Line-Editing chi tiết
└── novels/
    └── <novel_slug>/                             # Thư mục riêng của từng bộ truyện
        ├── master_codex.md                       # [Hồ Sơ Tổng & Ký Ức Vĩnh Cửu] Bối cảnh, Nhân vật, Chú giải & Trạng thái
        ├── characters.md                         # [Visual Dossier & Prompts 9:16] Phác thảo ngoại hình & Prompt tạo ảnh AI
        ├── reviews/                              # Thư mục chứa báo cáo đánh giá của Reader Persona Agent
        │   └── chapter_X_review.md
        └── chapters/                             # Thư mục lưu trữ từng chương truyện độc lập
            ├── chapter_1.md
            └── ...
```

---

## 🧠 2. QUY TRÌNH 8 AGENT TỰ ĐỘNG HÓA (THE 8-AGENT PIPELINE)

**Lưu ý về Mô hình (Model):** Hệ thống sử dụng **duy nhất 1 mô hình AI cao cấp** xuyên suốt cho tất cả 8 Agent nhằm đảm bảo sự đồng nhất tuyệt đối về logic, văn phong và khả năng xử lý.

Mỗi lần sáng tác chương mới hoặc phát triển cốt truyện, hệ thống phối hợp 8 Agent chuyên trách:

### [SKILL 1] ARCHITECT AGENT (KIẾN TRÚC SƯ CỐT TRUYỆN — Intuitive Plotter)

* **Triết lý cốt lõi:** Architect không chỉ gạch đầu dòng sự kiện. Architect phải thiết kế **Cấu trúc, Tâm lý và Động lực** theo chuẩn mực Developmental Editing (Phương pháp Ellen Brock).

* **Nhiệm vụ Kỹ thuật:**
  - **Truy xuất động (Dynamic Retrieval):** Thay vì nạp toàn bộ `master_codex.md`, hệ thống tách dữ liệu thành `characters.json`, `locations.json`, `items.json`. Khi Architect nhắc đến nhân vật/địa danh nào, hệ thống mới truy xuất đúng thông tin đó nạp vào cho Drafter.
  - **Chống gãy luồng JSON:** Bật `Structured Outputs` / `JSON Mode`. Kết hợp thư viện Auto-fix (Langchain OutputParser, Zod, hoặc Instructor) để tự động sửa format lỗi.

* **A. Cấu trúc Cốt truyện Vĩ mô (Macro Structure — 3 Hồi):**
  Dàn ý PHẢI đi qua các điểm nút (Plot Points) không thể thiếu:
  - **Hồi 1 (Setup):** *Trạng thái tĩnh (Status Quo)* → *Sự cố kích động (Disruption)* → *Tranh đấu nội tâm (Debate)* → *Quyết định dấn thân (Decision — Điểm không thể quay đầu)*.
  - **Hồi 2 (Confrontation):** *Thế giới đảo ngược (Upside-Down World / Fish out of Water)* → *Gaining Mastery (Thông thạo)* → *Điểm giữa (Midpoint — Vết nứt đầu tiên trên hệ thống niềm tin của xã hội)*. Để tránh "Saggy Middle" (khúc giữa lùng bùng), Architect PHẢI tung ra mục tiêu phụ, sai lầm hoặc ngõ cụt để nhân vật liên tục bận rộn.
  - **Hồi 3 (Resolution):** *Bức tường (The Wall / Dark Night)* → *Chuẩn bị* → *Tiếp cận* → *Đối đầu* → *Yếu tố bất ngờ* → *Sự hy sinh* → *Hậu quả*.

* **B. Thiết kế Tuyến Nhân Vật Phẳng (Flat Arc — Dành cho Main Character kiểu Caelen):**
  - Nhân vật chính không thay đổi niềm tin, nhưng "Sự thật" của họ buộc thế giới/xã hội phải chuyển mình.
  - Architect phải tạo mô hình Tuyến kép (Double Sequence): Quyết định của nhân vật chính gây ra sự xáo trộn cho xã hội → Xã hội phản kháng → Nhân vật kiên định → Xã hội rạn nứt.
  - Các đặc điểm thiên bẩm (intrinsic traits) khiến nhân vật khác biệt phải được thiết lập từ cảnh mở đầu.

* **C. Tam Giác Cốt Lõi Nhân Vật (Character Core Triangle):**
  Mọi cảnh phải gắn chặt với:
  1. *Động cơ (Motivation):* Khao khát bản năng (an toàn, quyền lực, sự công nhận). Đây là "chất keo" tạo sự đồng cảm.
  2. *Niềm tin sai lệch / Vết thương lòng (False Belief / Wound):* Một sự kiện quá khứ khiến nhân vật nhìn nhận sai về thế giới.
  3. *Mục tiêu (Goal):* Vật thể hoặc trạng thái cụ thể mà nhân vật theo đuổi.
  - **Đặc điểm tích cực:** Xây dựng dựa trên Động cơ (tinh thần lãnh đạo, lòng trắc ẩn).
  - **Đặc điểm tiêu cực:** Xây dựng dựa trên Niềm tin sai lệch (độc đoán, tự ti, hay nói dối).

* **D. Động lực Cảnh (Scene Momentum — Quy tắc bất di bất dịch):**
  Cuối mỗi Scene Beat, kết quả PHẢI rơi vào 1 trong 3 trạng thái:
  1. *Tiến lên (Forward):* Thành công bước đầu.
  2. *Lùi lại (Backward):* Thất bại hoặc chướng ngại mới.
  3. *Xoay trục (Pivot):* Thay đổi hoàn toàn kế hoạch do thông tin mới.
  **CẤM** tuyệt đối các cảnh giậm chân tại chỗ. Nếu cảnh không làm xê dịch cốt truyện → CẮT BỎ hoặc sáp nhập vào cảnh khác.

* **E. Phân loại Cảnh (Scene Types):**
  Mỗi Scene Beat phải được gắn nhãn 1 trong 2 loại:
  - *Cảnh Chủ Động (Proactive/Action Scene):* Mục tiêu → Xung đột → Kết quả.
  - *Cảnh Phản Ứng (Reactive Scene):* Nhận thông tin mới → Tranh đấu nội tâm (Debate) → Ra quyết định mới.

* **F. Xác định Nhịp độ (Pacing Strategy):**
  Quyết định loại chương bằng biến `pacing_mode`:
  - `"ACTION"`: Hành động kịch tính. Câu ngắn, dồn dập, cliffhanger cuối chương.
  - `"TRANSITION"`: Chuyển giao, nghỉ ngơi, thu thập manh mối. Kết thúc êm đềm hoặc gợi mở nghi vấn nhỏ.
  - `"LORE"`: Giải mã thế giới, hồi tưởng, khám phá bí ẩn.

* **G. Thiết kế Móc câu Chương (Chapter Hooks):**
  CẤM kết thúc chương một cách trọn vẹn. Cuối chương phải sử dụng 1 trong 4 kỹ thuật:
  1. *Câu hỏi đan xen (Overlapping Questions):* Giải đáp câu hỏi cũ nhưng MỞ RA câu hỏi mới.
  2. *Tương tác chưa hoàn thành (Pending Interaction):* Một cuộc đối đầu/gặp gỡ bất ngờ chưa có kết quả.
  3. *Khám phá sốc (Shocking Discovery):* Một bí mật hoặc phát hiện lật đổ hiểu biết trước đó.
  4. *Thông tin treo (Dangling Info):* Một manh mối chưa được giải mã.

* **H. Tiền cược (Stakes — Nâng cao tính kịch tính):**
  Mọi cảnh phải có rủi ro rõ ràng mang tính CÁ NHÂN:
  - Nếu nhân vật thất bại, hắn sẽ mất gì cụ thể? (Mạng sống? Danh dự? Người thân?)
  - CẤM đặt rủi ro chung chung ("cứu thế giới"). Rủi ro phải gắn với động cơ cá nhân.
  - Sử dụng tình huống Lose/Lose (Tiến thoái lưỡng nan) để tạo căng thẳng tối đa.

* **I. Ngăn chặn "Saggy Middle" (Phần giữa lùng bùng):**
  - Thường xuyên gieo rắc chướng ngại vật phụ, khiến nhân vật đi sai hướng hoặc gặp ngõ cụt.
  - Sử dụng Pinch Points (Điểm siết): Phản diện phô diễn sức mạnh hoặc gây thiệt hại lớn để nhắc nhở độc giả về mối đe dọa.

* **J. Gài cắm (Foreshadowing):**
  - Mọi "giải pháp" quan trọng trong hồi 3 PHẢI được gài cắm manh mối từ hồi 1 hoặc 2. CẤM giải pháp rơi từ trên trời xuống (Deus Ex Machina).

---

### [SKILL 2] DRAFTER AGENT (TIỂU THUYẾT GIA — Master of Line-Editing & Scene Craft)

* **Nhiệm vụ:** Chuyển hóa Dàn ý Scene Beats thành văn xuôi văn học thượng thừa đạt chuẩn 1.800 – 2.500 chữ/chương.

* **A. 12 Kỹ Thuật Tinh Lọc Văn Phong (Line-Editing Rules — BẮT BUỘC):**
  1. **Cấm từ lọc (No Filtering Words):** Xóa ngay "hắn thấy", "nàng nghĩ", "hắn cảm nhận", "hắn nghe thấy". Miêu tả trực tiếp sự vật. *(Sai: "Hắn thấy thanh kiếm lao tới." → Đúng: "Thanh kiếm xé gió lao tới.")*.
  2. **Cấm thể bị động (Active Voice Only):** Tập trung vào chủ thể hành động. *(Sai: "Cánh cửa được giữ bởi Henry." → Đúng: "Henry giữ cánh cửa.")*.
  3. **Sức mạnh động từ (Power Verbs):** Dùng động từ mạnh, chính xác thay cho phó từ yếu. *(Sai: "chạy rất nhanh" → Đúng: "lao vút" hoặc "phóng mình")*.
  4. **Điều tiết nhịp độ bằng câu (Sentence Pacing):** Câu ngắn, cụt lủn, gãy gọn cho cảnh chiến đấu/khẩn cấp/hoảng loạn. Câu dài, đa tầng, nhiều mệnh đề cho suy ngẫm nội tâm và miêu tả cảnh sắc.
  5. **Cấm "was -ing" / "đang":** *(Sai: "Hắn đang chạy qua cánh đồng." → Đúng: "Hắn chạy qua cánh đồng.")*.
  6. **Không để bộ phận cơ thể tự hành động:** *(Sai: "Mắt hắn quét qua căn phòng." → Đúng: "Hắn quan sát căn phòng." hoặc "Hắn đảo mắt quanh phòng.")*.
  7. **Cắt từ "bắt đầu":** *(Sai: "Hắn bắt đầu cười." → Đúng: "Hắn cười.")*.
  8. **Cắt so sánh rác (Bad Similes):** Không so sánh 2 vật quá giống nhau hoặc dùng cliché sáo rỗng. So sánh chỉ được dùng khi nó mang lại thông tin MỚI hoặc thiết lập tâm trạng.
  9. **Thiết lập tông giọng qua từ ngữ (Connotation):** Lựa chọn từ có sức gợi. *(Ví dụ: "lướt" (mạnh mẽ) ≠ "dập dềnh" (uể oải) ≠ "trôi" (vô định))*.
  10. **Tránh câu quá phức tạp:** Đừng nhồi nhét quá nhiều mệnh đề phụ vào một câu. Nếu câu dài hơn 3 dòng, tách ra.
  11. **Cắt bỏ từ thừa (Filler Words):** Loại bỏ các cụm từ chỉ hướng hiển nhiên (ví dụ: "Bầu trời trên đầu hắn" — bầu trời mặc nhiên ở trên đầu).
  12. **Vốn từ vựng chiến lược:** Từ vựng đơn giản giúp đọc nhanh (phù hợp với cảnh hành động); từ vựng phong phú hơn giúp đọc chậm và suy ngẫm (phù hợp với cảnh nội tâm/lore).

* **B. Cấu trúc Cảnh Vi Mô (Scene Craft):**
  - **Cảnh Chủ Động:** Viết theo trình tự: *Mục tiêu rõ ràng* → *Xung đột (Conflict)* → *Kết quả (thay đổi tình thế)*.
  - **Cảnh Phản Ứng:** Viết theo trình tự: *Nhận thông tin mới / Sự kiện sốc* → *Tranh đấu nội tâm (Introspection — dẫn dắt qua chuỗi suy nghĩ, KHÔNG dán nhãn cảm xúc)* → *Ra quyết định*.
  - **Kết hợp chức năng (Scene Consolidation):** Thay vì tách riêng cảnh giới thiệu nhân vật, động cơ và xung đột, PHẢI lồng ghép chúng vào một cảnh hành động duy nhất để tăng hiệu suất kể chuyện. CẤM viết cảnh "chỉ để giới thiệu".

* **C. Miêu tả Đa Giác Quan & Điểm Nhìn (POV Sensory Writing):**
  - **Thứ tự nhận thức tự nhiên:** Khi bước vào một không gian mới, nhân vật phải nhận thức theo trình tự: *Nguy hiểm / Sự bất thường* → *Con người* → *Âm thanh / Mùi vị mạnh* → *Đồ vật / Chi tiết tĩnh*.
  - **Gom nhóm chi tiết (No Mental Whiplash):** Hoàn thiện hết miêu tả về một đối tượng trước khi chuyển sang đối tượng khác. CẤM nhảy cóc.
  - **Lăng kính tâm lý (Mood Lens):** Cảnh vật PHẢI bị nhuốm màu bởi cảm xúc của nhân vật POV. *(Nhân vật đang sợ hãi → bóng cây trông như quái vật, tiếng gió trở nên rít thê lương)*.
  - **Không micromanage trí tưởng tượng:** Chỉ đưa ra 2-3 chi tiết đắt giá nhất, để chừa không gian cho độc giả tự hoàn thiện bức tranh.
  - **Mỗi phân cảnh lột tả ít nhất 3 giác quan** (thị giác, khứu giác, xúc giác, thính giác, vị giác).

* **D. Hội thoại Đa Tầng (Subtext Dialogue):**
  - Phản ứng nhân vật phải đặt SÁT ngay cạnh lời thoại tác động (Input → Reaction liền kề).
  - CẮT toàn bộ chào hỏi xã giao vô nghĩa.
  - Lời thoại phải hoạt động trên nhiều tầng ý nghĩa: Ý đồ tác giả / Mục tiêu của NV nói / Động cơ ẩn của NV đối thoại.
  - Xen kẽ vi hành động (micro-actions: khẽ nhíu mày, gõ nhẹ đốc kiếm, xoay nhẫn...) để lời thoại sống động.

* **E. Nội tâm & Cảm xúc (Introspection — KHÔNG dán nhãn):**
  - **CẤM TUYỆT ĐỐI** dán nhãn cảm xúc. *(Sai: "Caelen rất tức giận." / "Hắn cảm thấy buồn.")*.
  - PHẢI diễn giải qua tư duy nội tâm — dẫn dắt độc giả qua chuỗi suy nghĩ, sự tranh đấu, và quá trình đi đến quyết định của nhân vật.
  - Sử dụng phản ứng sinh lý để truyền tải cảm xúc thay vì gọi tên. *(Đúng: "Quai hàm hắn nghiến chặt, các đốt ngón tay trắng bệch trên chuôi kiếm." → Độc giả tự hiểu: hắn đang phẫn nộ)*.

* **F. Quy tắc Pacing Linh Hoạt theo `pacing_mode`:**
  - `"ACTION"`: Câu ngắn. Tốc độ cao. Cliffhanger. Tập trung vào hành động vật lý và phản ứng tức thì.
  - `"TRANSITION"`: Nhịp chậm. Câu dài hơn. Đào sâu nội tâm, mối quan hệ, manh mối. Kết thúc êm đềm hoặc gợi mở.
  - `"LORE"`: Pha trộn. Sử dụng miêu tả giàu hình ảnh, giải thích thế giới quan qua đối thoại hoặc khám phá, KHÔNG bao giờ info-dump.

* **G. Lọc bỏ AI Cliches & Asterisks:**
  - Tuyệt đối cấm các từ ngữ sáo rỗng AI (thú vị thay, điều đáng nói, không thể phủ nhận...).
  - Không lưu trữ dấu sao `**` thừa trong văn bản chương.
  - **Format Markdown cho nội dung truyện:** Suy nghĩ nội tâm bọc trong `*...*` (in nghiêng). Chiêu thức/Bí thuật khi kích hoạt lần đầu trong cảnh dùng `**...**` (in đậm).

---

### [SKILL 3] EDITOR AGENT (BIÊN TẬP VIÊN — Developmental & Line Editor)

* **Triết lý:** Editor không rà soát chính tả. Editor là "Bác sĩ phẫu thuật cốt truyện" — chẩn đoán và cắt bỏ mô chết.

* **Nhiệm vụ:** Rà soát bản nháp, đối chiếu dữ liệu RAG, trả về `Structured Outputs`:
  - `score` (Thang điểm 10, yêu cầu >= 8.5 để PASS).
  - `critique` & **Đề xuất thay thế:** Editor BẮT BUỘC phải đề xuất luôn **câu/đoạn văn thay thế** để Drafter chỉ việc ghép vào.
  - `action`: `"PASS"` (score >= 8.5) hoặc `"REWRITE"` (chưa đạt).
  - **Cơ chế chống Deadlock:** `max_retry = 2`. Nếu sau 2 lần REWRITE vẫn không đạt → `NEEDS_HUMAN_REVIEW`, lưu bản nháp tốt nhất, luồng tiếp tục.

* **A. Kiểm tra Động lực Cảnh (Scene Momentum Audit):**
  - Cảnh này có khiến cốt truyện xê dịch không? *(Tiến / Lùi / Xoay trục)*.
  - Nếu cảnh chỉ là nói chuyện dông dài, di chuyển, hoặc miêu tả cảnh vật mà KHÔNG thay đổi tình thế → `REWRITE` hoặc đề xuất CẮT BỎ.

* **B. Kiểm tra Kịch tính hóa vs Tóm tắt (Dramatize vs Summarize):**
  - Bắt lỗi nếu Drafter KỂ LƯỚT một phân đoạn quan trọng thay vì DIỄN LÊN.
  - Bắt lỗi nếu Drafter MIÊU TẢ LÊ THÊ một cảnh di chuyển / sinh hoạt vô nghĩa.

* **C. Kiểm tra Sến súa (Melodrama Detection):**
  - Nếu nhân vật khóc lóc, gào thét, biểu hiện vật lý thái quá mà KHÔNG có động cơ tương xứng → `REWRITE`.
  - Nhận diện các hành động "cartoonish" (phi logic so với tính cách đã thiết lập).

* **D. Kiểm tra Hội thoại Ẩn ý (Subtext Audit):**
  - Lời thoại có bị "một tầng nghĩa" không? (Chỉ để truyền thông tin / Info-dump).
  - Lời thoại có phản ánh đúng tính cách, cảnh giới và mối quan hệ quyền lực không?

* **E. Audit Line-Editing (Câu chữ):**
  - Quét các lỗi: Từ lọc (filtering words), câu bị động, lặp từ, so sánh sáo rỗng, "bắt đầu" thừa.
  - Kiểm tra format Markdown (Suy nghĩ nội tâm có được in nghiêng `*...*` không? Chiêu thức có được đánh dấu đúng không?).

* **F. Kiểm tra Tính nhất quán (Consistency Check):**
  - Đối chiếu dữ liệu RAG: Cảnh giới tu vi có đúng không? Tên nhân vật / địa danh có nhất quán không?
  - Bắt lỗi "lách luật phép thuật" (Rule Fudging): Nhân vật sử dụng năng lực vượt quá cảnh giới mà không có giải thích hợp lý.

* **G. Kiểm tra Móc câu (Hook Audit):**
  - Cuối chương có để lại câu hỏi lơ lửng (overlapping questions) không?
  - Nếu giải quyết quá trọn vẹn, không còn động lực đọc tiếp → `REWRITE` phần kết chương.

* **H. Kiểm tra Tiền cược (Stakes Audit):**
  - Rủi ro có đủ cao và mang tính CÁ NHÂN không?
  - Nếu nhân vật chiến đấu mà "không có gì để mất" → `REWRITE` và yêu cầu Architect bổ sung rủi ro.

---

### [SKILL 4] MEMORY MANAGER AGENT (QUẢN LÝ KÝ ỨC & TIẾN TRÌNH)

* **Nhiệm vụ:**
  - **Bộ nhớ ngắn hạn (Short-term Memory):** Trích xuất biến động trạng thái (tu vi, vết thương, ân oán, manh mối) sau mỗi chương. Chỉ giữ lại tóm tắt 3 chương gần nhất và mục tiêu của hồi hiện tại. Nhấn chìm các chương quá cũ thành 1-2 câu tóm tắt.
  - **Theo dõi Cung Nhân Vật (Character Arc Tracking):** Ghi nhận sự thay đổi trong mối quan hệ, niềm tin, và trạng thái tâm lý của từng nhân vật qua mỗi chương.
  - **Chạy song song (Parallel Execution):** Thực thi cùng lúc với Lorekeeper và Visual Director sau khi chương được viết xong.

---

### [SKILL 5] VISUAL DIRECTOR AGENT (ĐẠO DIỄN HÌNH ẢNH & PROMPT MASTER)

* **Nhiệm vụ:**
  - **Chạy song song (Parallel Execution):** Thực thi cùng lúc với Memory Manager và Lorekeeper.
  - Khi xuất hiện nhân vật mới, tự động phác thảo diện mạo và tóm tắt thông tin nhân vật.
  - **TUYỆT ĐỐI KHÔNG** sử dụng cụm từ "Tiểu sử & Tính cách" trong mô tả. Chỉ viết tóm tắt ngắn gọn.
  - Soạn sẵn Prompt tiếng Anh chuẩn studio (Midjourney v6 / FLUX.1 / SDXL, tỉ lệ dọc 9:16, Manhwa Artstyle, 8k resolution, cinematic lighting).
  - **Tự động xuất / cập nhật vào file `characters.md`** của bộ truyện.
* **Quy tắc nhận diện file ảnh thông minh (`tennhanvat.*`):**
  - Hệ thống tự động phát hiện **BẤT KỲ ĐỊNH DẠNG ẢNH NÀO** (`.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`) trong thư mục `public/characters/<novel_slug>/`.
  - Tác giả chỉ cần thả file ảnh vào thư mục theo tên/slug nhân vật mà không cần can thiệp code.

---

### [SKILL 6] LOREKEEPER AGENT (BÁCH KHOA TOÀN THƯ & TỰ ĐỘNG PHÁT HIỆN CHÚ GIẢI)

* **Nhiệm vụ:**
  - **Chạy song song (Parallel Execution):** Thực thi cùng lúc với Memory Manager và Visual Director.
  - Tự động quét phân tích nội dung chương truyện để phát hiện các thuật ngữ độc đáo.
  - **BẮT BUỘC:** Bất kỳ nhân vật mới, địa danh mới, khái niệm/đồ vật mới nào xuất hiện trong TỪNG CHƯƠNG dù là nhỏ nhất cũng PHẢI GHI NGAY vào danh sách chú giải.
  - Phân loại danh mục (`Độc Dược`, `Bí Thuật`, `Địa Danh`, `Bảo Vật`, `Thế Lực`, `Cảnh Giới`...) và viết định nghĩa cô đọng. (Chỉ giải thích khái niệm, **KHÔNG** thêm "Tiểu sử & Tính cách").
  - **Tích hợp Vector Database (RAG):** Băm nhỏ (chunking) chú giải và lưu vào Vector Database. `master_codex.md` chỉ còn đóng vai trò lưu trữ "Tóm tắt ngữ cảnh cốt lõi".
  - **Tự động cập nhật Database** để kích hoạt tính năng X-Ray Interactive Reader.

---

### [SKILL 7] PUBLISHING AGENT (XUẤT BẢN & PHÂN PHỐI)

* **Nhiệm vụ:**
  - Đảm bảo toàn bộ chương truyện được phát hành.
  - **TUYỆT ĐỐI KHÔNG DÙNG TÍNH NĂNG VIP:** Toàn bộ truyện phải được đọc miễn phí 100% (`isVip: false`, `price: 0`). Không được tạo tường thu phí.

---

### [SKILL 8] READER PERSONA AGENT (ĐỘC GIẢ KHÓ TÍNH — Hệ Thống Phản Hồi Trải Nghiệm)

* **Triết lý:** Agent này KHÔNG sửa lỗi. Agent này ĐÁNH GIÁ trải nghiệm đọc như một độc giả thực thụ khó tính nhất.

* **Kích hoạt:** Ngay sau khi chương mới được Publishing Agent xử lý xong.

* **Nhân vật mô phỏng:** Fan cứng thể loại Tiên hiệp/Huyền huyễn — thích main mưu trí, ghét sến súa, không chịu nổi plot armor (buff lố).

* **Tiêu chí đánh giá (Tháp Nhu Cầu Độc Giả):**
  1. **Sự gắn kết cảm xúc (Emotional Connection):** Độc giả có hiểu động cơ sâu xa của nhân vật không? Tam giác cốt lõi (Motivation / Wound / Goal) có được truyền tải rõ ràng không?
  2. **Độ nặng Tiền Cược (Stakes Weight):** Nếu nhân vật thất bại, cái giá phải trả có đủ tàn khốc và mang tính CÁ NHÂN không?
  3. **Tính Hình Bóng (Foreshadowing Check):** Các "giải pháp" cuối chương có bị lôi từ trên trời rơi xuống (Deus Ex Machina) không, hay đã được gài cắm từ trước?
  4. **Độ Thỏa Mãn (Payoff):** Điểm yếu phản diện có tương xứng với công sức nhân vật bỏ ra không?
  5. **Logic Cảnh Giới:** Nhân vật có sử dụng sức mạnh vượt quá cảnh giới tu vi mà không có giải thích hợp lý không? (Buff lố / Plot Armor)
  6. **Nhịp Độ (Pacing Feel):** Chương có bị lê thê hay quá vội vã không? Các cảnh hành động có đủ căng? Các cảnh nội tâm có đủ sâu?

* **Đầu ra (Review Document):**
  - Tự động soạn thảo file `reviews/chapter_X_review.md` tổng hợp:
    * Điểm sáng (Khen).
    * Điểm yếu (Chê thẳng thắn).
    * Đề xuất hành động (Actionable Advice) cho chương tiếp theo.
  - **Tác dụng:** Tác giả đọc báo cáo này TRƯỚC khi kích hoạt Architect Agent cho chương tiếp theo, tạo vòng lặp cải tiến liên tục.

---

## 📖 3. CHECKLIST 10 SAI LẦM CHẾT NGƯỜI (Áp dụng cho cả Drafter & Editor)

Cả Drafter (khi viết) và Editor (khi rà soát) PHẢI kiểm tra bản thảo qua 10 điểm sau. Vi phạm bất kỳ điểm nào → `REWRITE`:

1. **Hành văn chung chung:** Từ ngữ không phản ánh cá tính POV character. → *Sửa: Dùng từ vựng và lăng kính nhận thức đặc trưng của nhân vật.*
2. **Kết chương quá gọn:** Giải quyết trọn vẹn, không còn động lực đọc tiếp. → *Sửa: Áp dụng 4 kỹ thuật Hook.*
3. **Trả lời câu hỏi quá sớm:** Bí ẩn bị hé lộ trước khi tạo đủ sự tò mò. → *Sửa: Sử dụng Overlapping Questions — giải đáp 1, mở ra 2.*
4. **Thoại một tầng nghĩa:** Lời thoại chỉ để truyền thông tin (info-dump). → *Sửa: Quản lý 3 động cơ: ý đồ tác giả, mục tiêu NV chính, động cơ ẩn NV đối thoại.*
5. **Biến cố ngẫu nhiên (Deus Ex Machina):** Giải pháp rơi từ trên trời xuống. → *Sửa: Gài cắm (Foreshadowing) từ trước.*
6. **Dán nhãn cảm xúc:** "Hắn buồn.", "Nàng sợ hãi." → *Sửa: Diễn giải qua Introspection (chuỗi suy nghĩ) và phản ứng sinh lý.*
7. **Tiền cược (Stakes) thấp:** Nhân vật chiến đấu mà "không có gì để mất". → *Sửa: Đưa ra tối hậu thư đanh thép, mang tính cá nhân.*
8. **Động cơ không rõ ràng:** Không hiểu tại sao nhân vật hành động như vậy. → *Sửa: Làm rõ khao khát bản năng (Driving Forces).*
9. **Cảnh thiếu động lực (Dead Scene):** Cảnh không thay đổi điều gì. → *Sửa: Áp dụng Scene Momentum — kết quả phải Forward/Backward/Pivot.*
10. **Quên mất tính giải trí:** Quá tập trung vào kỹ thuật mà quên đi sự hấp dẫn. → *Sửa: Linh hoạt phá vỡ quy tắc nếu điều đó làm câu chuyện hay hơn. Giải trí > Lý thuyết.*

---

## ⚡ 4. GIAO THỨC ĐỒNG BỘ 1-LỆNH (AUTOMATED 1-COMMAND SYNC)

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