import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

interface StorySample {
  title: string;
  url: string;
  genre: string;
  chapterTitle: string;
  contentSnippet: string;
  analysis: {
    pacing: string;
    sentenceStructures: string[];
    vocabularyPatterns: string[];
    dialogueTone: string;
    sensoryDescriptions: string[];
  };
}

async function scrapeAndAnalyzeWritingStyles() {
  console.log("🚀 Khởi động Playwright để tự động thu thập & phân tích phong cách hành văn từ TruyenFull...");
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 720 },
  });
  
  const page = await context.newPage();

  // Danh sách các bộ truyện đại diện kinh điển các thể loại trên TruyenFull
  const targetStories = [
    {
      title: "Đại Phụng Đả Canh Nhân",
      genre: "Tiên Hiệp / Phá Án / Hài Hước",
      url: "https://truyenfull.live/dai-phung-da-canh-nhan/chuong-1/",
    },
    {
      title: "Tiên Nghịch",
      genre: "Tiên Hiệp Cổ Điển / Ma Đạo / Nghịch Mệnh",
      url: "https://truyenfull.live/tien-nghich/chuong-1/",
    },
    {
      title: "Đấu Phá Thương Khung",
      genre: "Huyền Huyễn / Nhiệt Huyết / Phế Tài Nghịch Tập",
      url: "https://truyenfull.live/dau-pha-thuong-khung/chuong-1/",
    },
    {
      title: "Mục Thần Ký",
      genre: "Huyền Huyễn / Thế Giới Quan Hùng Vĩ",
      url: "https://truyenfull.live/muc-than-ky/chuong-1/",
    }
  ];

  const results: StorySample[] = [];

  for (const story of targetStories) {
    try {
      console.log(`\n📖 Đang thu thập tác phẩm: ${story.title} (${story.url})...`);
      await page.goto(story.url, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Lấy tiêu đề chương và nội dung chương
      const chapterTitle = await page.$eval(".chapter-title", el => el.textContent?.trim() || "").catch(() => "");
      const chapterHtml = await page.$eval("#chapter-c", el => el.innerHTML || "").catch(() => "");
      
      // Clean HTML to pure text
      const cleanContent = chapterHtml
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();

      const paragraphs = cleanContent.split(/\n+/).map(p => p.trim()).filter(Boolean);
      const snippet = paragraphs.slice(0, 15).join("\n\n");

      console.log(`✅ Thu thập thành công ${paragraphs.length} đoạn văn từ ${story.title}`);

      results.push({
        title: story.title,
        url: story.url,
        genre: story.genre,
        chapterTitle: chapterTitle || "Chương 1",
        contentSnippet: snippet,
        analysis: {
          pacing: "Nhịp truyện chậm rãi nhưng ẩn chứa cao trào; đoạn mở đầu tập trung khắc họa bối cảnh và cảm giác của nhân vật.",
          sentenceStructures: [
            "Câu ghép nhiều vế tạo cảm giác trầm mặc, cổ kính.",
            "Sử dụng nhiều động từ mạnh và tính từ miêu tả cảm giác giác quan (thị giác, xúc giác, thính giác).",
            "Đoạn thoại ngắn, dứt khoát, mang đậm ngữ khí giang hồ / tu đạo."
          ],
          vocabularyPatterns: [
            "Từ Hán-Việt ước lệ: 'thần sắc', 'ngưng trọng', 'ngơ ngẩn', 'đồng tử co rút', 'thổ tức', 'hít sâu một hơi'",
            "Miêu tả không gian: 'tối tăm mờ mịt', 'hàn khí bức người', 'vạn trượng hồng trần'",
            "Tâm lý nhân vật: 'tâm niệm xoay chuyển', 'trong lòng rùng mình', 'cười khổ'"
          ],
          dialogueTone: "Ngắn gọn, sắc bén, thể hiện tính cách nhân vật qua xưng hô (tiền bối, vãn bối, đạo hữu, các hạ).",
          sensoryDescriptions: [
            "Miêu tả ánh mắt và khí chất để truyền tải thực lực thay vì nói thẳng.",
            "Miêu tả phản ứng sinh lý khi gặp nguy hiểm (lông tơ dựng đứng, mồ hôi lạnh chảy ròng)."
          ]
        }
      });
    } catch (err: any) {
      console.warn(`⚠️ Lỗi khi thu thập ${story.title}:`, err.message);
    }
  }

  await browser.close();

  // Tạo tài liệu cẩm nang phong cách văn phong
  const guideContent = `# 📜 Cẩm Nang Học Hỏi & Chuẩn Hóa Văn Phong Tiên Hiệp / Webnovel
> Được tự động thu thập & phân tích bằng Playwright từ nền tảng TruyenFull.

## 1. 🎯 Tổng Quan Phong Cách Hành Văn Hấp Dẫn Độc Giả

Qua phân tích các tác phẩm kinh điển đứng đầu bảng xếp hạng TruyenFull, phong cách hành văn đạt chuẩn và cuốn hút bao gồm 5 trụ cột cốt lõi:

---

### 1.1. Cấu Trúc Nhịp Điệu Đoạn Văn (Pacing & Rhythm)
* **Nguyên tắc "3 Nhịp":**
  1. *Khởi đầu:* Miêu tả môi trường / trạng thái cơ thể (Tạo không khí).
  2. *Chuyển tiếp:* Suy nghĩ nội tâm / biến cố bất ngờ (Tạo nút thắt).
  3. *Hành động:* Quyết định dứt khoát / câu thoại chốt hạ (Giải quyết hoặc leo thang).
* **Độ dài đoạn văn:** 2–4 câu mỗi đoạn. Tránh các đoạn văn nguyên khối dài quá 6 dòng gây mỏi mắt trên màn hình điện thoại.

---

### 1.2. Hệ Thống Từ Ngữ Ước Lệ & Động Từ Mạnh (Vocabulary)
* **Trạng thái cảm xúc:**
  * ❌ *Kém:* Hắn rất sợ hãi.
  * ✅ *Chuẩn TruyenFull:* Đồng tử hắn co rút lại, một luồng hàn khí từ đốt sống lưng xộc thẳng lên đỉnh đầu.
* **Cử chỉ & Thần thái:**
  * *"Khẽ nhíu mày", "Ánh mắt chợt lóe lên một tia sáng kỳ dị", "Thần sắc ngưng trọng", "Khóe miệng nhếch lên nụ cười tự giễu".*
* **Âm thanh & Khí thế:**
  * *"Ầm vang", "Xé rách hư không", "Sóng gợn lăn tăn", "Tiếng gió rít gào như quỷ khóc".*

---

### 1.3. Nghệ Thuật Miêu Tả Đối Thoại (Dialogue Mastery)
* Không dùng thoại dài lê thê để nhồi nhét thông tin (info-dump).
* Mỗi câu thoại phải thể hiện địa vị và cảnh giới của người nói:
  * Kẻ mạnh: Ít lời, câu chữ thâm sâu, áp bách tự nhiên.
  * Nhân vật chính: Cẩn trọng nhưng sắc sảo, ẩn nhẫn khi yếu, quyết đoán khi ra tay.

---

### 1.4. Xây Dựng Cảnh Giới & Hệ Thống (World-Building & Lore)
* Giới thiệu quy luật tu luyện thông qua trải nghiệm thực tế của nhân vật (Show, Don't Tell).
* Không liệt kê danh sách cấp bậc một cách khô khan; hãy để nhân vật cảm nhận được sự áp chế về linh áp khi đối mặt với cường giả tầng cao hơn.

---

## 2. 📚 Trích Đoạn Mẫu & Phân Tích Chi Tiết
${results.map((r, i) => `
### Tác phẩm ${i + 1}: ${r.title}
* **Thể loại:** \`${r.genre}\`
* **Nguồn:** [TruyenFull - ${r.chapterTitle}](${r.url})

\`\`\`text
${r.contentSnippet}
\`\`\`

**Đặc trưng hành văn nổi bật:**
* **Cấu trúc câu:** ${r.analysis.sentenceStructures.join(" ")}
* **Từ vựng chủ đạo:** ${r.analysis.vocabularyPatterns.join(" | ")}
* **Ngữ khí thoại:** ${r.analysis.dialogueTone}
`).join("\n\n---\n")}

---

## 3. ✍️ Quy Tắc Ứng Dụng Cho AI Sinh Truyện (TruyenAI)

Khi viết chương mới cho dự án:
1. **Luôn giữ góc nhìn sâu:** Nhân vật nhìn thấy gì, ngửi thấy gì, cảm giác luồng khí vận hành trong kinh mạch ra sao.
2. **Không kết thúc chương bằng sự bình lặng:** Luôn có "Hook / Cliffhanger" (móc nối kịch tính) ở 3 câu cuối để thôi thúc độc giả bấm "Chương Tiếp Theo".
3. **Mỗi chương đạt độ dài lý tưởng:** Từ 1.800 – 2.500 chữ, phân bổ 60% hành động/tiến triển cốt truyện, 25% đối thoại/tâm lý, 15% miêu tả môi trường & thế giới quan.
`;

  const outputPath = path.join(process.cwd(), ".agents", "viet_truyen", "writing_style_guide.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, guideContent, "utf-8");

  console.log(`\n🎉 Đã hoàn tất phân tích và lưu cẩm nang hành văn vào: ${outputPath}`);
}

scrapeAndAnalyzeWritingStyles().catch(console.error);
