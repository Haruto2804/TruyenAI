import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Lỗi: Không tìm thấy GEMINI_API_KEY trong biến môi trường.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  console.log("Đang khởi tạo AI...");
  // Sử dụng Gemini 1.5 Pro vì mô hình này thông minh hơn trong việc tuân thủ các quy tắc phức tạp (skill)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // 1. Đọc nội dung các Skill và Rules để nạp "Kiến thức" toàn diện cho AI
  const contextFiles = [
    path.join(process.cwd(), ".agents", "skills", "viet-truyen-master", "SKILL.md"),
    path.join(process.cwd(), ".agents", "skills", "doc-gia-kho-tinh", "doc_gia_kho_tinh.md"),
    path.join(process.cwd(), ".agents", "skills", "tac-gia-kho-tinh", "tac_gia_kho_tinh.md"),
    path.join(process.cwd(), ".agents", "rules", "publishing_rules.md"),
    path.join(process.cwd(), ".agents", "viet_truyen", "viet_truyen.md"),
    path.join(process.cwd(), ".agents", "rules", "viet_truyen_workflow.md")
  ];

  let systemContext = "";
  for (const filePath of contextFiles) {
    if (fs.existsSync(filePath)) {
      systemContext += `\n=== TÀI LIỆU: ${path.basename(filePath)} ===\n`;
      systemContext += fs.readFileSync(filePath, "utf-8");
      systemContext += `\n========================================\n`;
      console.log(`Đã nạp thành công tài liệu: ${path.basename(filePath)}`);
    } else {
      console.warn(`Cảnh báo: Không tìm thấy file tại ${filePath}`);
    }
  }

  // 2. Định nghĩa thư mục lưu truyện CHUẨN theo cấu trúc của viet-truyen-master
  const novelSlug = process.env.NOVEL_SLUG || "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong";
  const novelDir = path.join(process.cwd(), ".agents", "viet_truyen", "novels", novelSlug);
  const outputDir = path.join(novelDir, "chapters");
  
  // Đọc thêm master_codex.md của bộ truyện nếu có
  const codexPath = path.join(novelDir, "master_codex.md");
  if (fs.existsSync(codexPath)) {
    systemContext += `\n=== MASTER CODEX (${novelSlug}) ===\n`;
    systemContext += fs.readFileSync(codexPath, "utf-8");
    systemContext += `\n===================================\n`;
    console.log(`Đã nạp master_codex của bộ truyện: ${novelSlug}`);
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 3. Tự động đếm số chương hiện có để tính số thứ tự cho chương tiếp theo
  const files = fs.readdirSync(outputDir).filter(f => f.startsWith("chapter_") && f.endsWith(".md"));
  const nextChapterNum = files.length + 1;
  const fileName = `chapter_${nextChapterNum}.md`;
  const filePath = path.join(outputDir, fileName);

  // 4. Lắp ráp Prompt kết hợp với hệ thống Skill
  const prompt = `
Bạn là TÁC GIẢ TỐI CAO (Đại Tiểu Thuyết Gia) trong hệ thống VIET-TRUYEN MASTER.
Để viết ra một chương truyện xuất sắc, bạn BẮT BUỘC phải học hỏi và tuân thủ nghiêm ngặt toàn bộ các quy tắc, workflow, góc nhìn của "Độc Giả Khó Tính" và "Tác Giả Khó Tính" dưới đây:

${systemContext}

YÊU CẦU THỰC THI (ĐÃ ĐƯỢC CHẮT LỌC TỪ CÁC TÀI LIỆU TRÊN):
- Hãy viết Chương ${nextChapterNum} cho bộ tiểu thuyết dựa theo cốt truyện trong "viet_truyen.md".
- Áp dụng triệt để quy tắc Pacing 3 nhịp (Không khí -> Tâm lý -> Hành động) và Kích hoạt ngũ quan.
- Vượt qua bài kiểm duyệt khắc nghiệt của "Độc Giả Khó Tính" và "Tác Giả Khó Tính".
- Tuân thủ Publishing Rules và Workflow.
- Chương phải kết thúc bằng một "Cliffhanger Hook" (Móc câu lửng) ở 3 câu cuối.
- TUYỆT ĐỐI KHÔNG dùng các ký tự asterisk (**) in đậm thừa thãi trong văn bản.
- Trả về nguyên văn bản Markdown của chương truyện, không thêm các lời giải thích thừa như "Đây là chương truyện...".
`;

  try {
    console.log(`Đang yêu cầu AI viết Chương ${nextChapterNum}... Quá trình này có thể mất 1-2 phút.`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI đã viết xong. Đang lưu file...");
    
    fs.writeFileSync(filePath, text, "utf-8");
    console.log(`Đã lưu thành công tại: ${filePath}`);
    
    console.log("GỢI Ý: Kịch bản đã sẵn sàng để tích hợp với lệnh 'npm run sync:novel'!");
    
  } catch (error) {
    console.error("Có lỗi xảy ra khi gọi API:", error);
    process.exit(1);
  }
}

main();
