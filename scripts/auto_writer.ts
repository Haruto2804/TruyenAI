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

function getMaxChapterNum(chaptersDir: string): number {
  if (!fs.existsSync(chaptersDir)) return 0;
  const files = fs.readdirSync(chaptersDir);
  let maxNum = 0;
  for (const file of files) {
    const match = file.match(/^chapter_(\d+)\.md$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return maxNum;
}

function getPreviousChapterExcerpt(chaptersDir: string, prevNum: number): string {
  if (prevNum <= 0) return "";
  const prevFile = path.join(chaptersDir, `chapter_${prevNum}.md`);
  if (!fs.existsSync(prevFile)) return "";
  try {
    const content = fs.readFileSync(prevFile, "utf-8").trim();
    const lines = content.split("\n");
    const excerptLines = lines.length > 120 ? lines.slice(-120) : lines;
    return excerptLines.join("\n");
  } catch (err: any) {
    console.warn(`Không thể đọc trích đoạn chương trước: ${err.message}`);
    return "";
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("🚀 BẮT ĐẦU KỊCH BẢN SÁNG TÁC TIỂU THUYẾT ĐA TRUYỆN (TYPESCRIPT)");
  console.log("=".repeat(60));

  // 1. Đọc nội dung các Skill và Rules chung
  const contextFiles = [
    path.join(process.cwd(), ".agents", "skills", "viet-truyen-master", "SKILL.md"),
    path.join(process.cwd(), ".agents", "skills", "doc-gia-kho-tinh", "doc_gia_kho_tinh.md"),
    path.join(process.cwd(), ".agents", "skills", "tac-gia-kho-tinh", "tac_gia_kho_tinh.md"),
    path.join(process.cwd(), ".agents", "rules", "publishing_rules.md"),
    path.join(process.cwd(), ".agents", "rules", "viet_truyen_workflow.md")
  ];

  let baseSystemRules = "";
  for (const filePath of contextFiles) {
    if (fs.existsSync(filePath)) {
      baseSystemRules += `\n=== TÀI LIỆU CHUẨN: ${path.basename(filePath)} ===\n`;
      baseSystemRules += fs.readFileSync(filePath, "utf-8");
      baseSystemRules += `\n========================================\n`;
      console.log(`Đã nạp thành công tài liệu: ${path.basename(filePath)}`);
    } else {
      console.warn(`Cảnh báo: Không tìm thấy file tại ${filePath}`);
    }
  }

  // 2. Danh sách các truyện cần viết
  const novelsRoot = path.join(process.cwd(), ".agents", "viet_truyen", "novels");
  if (!fs.existsSync(novelsRoot)) {
    console.error(`Lỗi: Thư mục novels không tồn tại tại ${novelsRoot}`);
    process.exit(1);
  }

  const targetSlug = (process.env.NOVEL_SLUG || "all").trim().toLowerCase();
  let novelFolders: string[] = [];

  if (targetSlug && targetSlug !== "all") {
    const targetDir = path.join(novelsRoot, targetSlug);
    if (fs.existsSync(targetDir) && fs.statSync(targetDir).isDirectory()) {
      novelFolders = [targetSlug];
    } else {
      console.error(`Lỗi: Không tìm thấy truyện có slug '${targetSlug}'`);
      process.exit(1);
    }
  } else {
    novelFolders = fs.readdirSync(novelsRoot).filter(f => fs.statSync(path.join(novelsRoot, f)).isDirectory());
  }

  const chaptersPerNovel = parseInt(process.env.CHAPTERS_PER_NOVEL || "5", 10);
  const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  console.log(`\n📊 CẤU HÌNH THỰC THI:`);
  console.log(`- Mô hình: ${modelName}`);
  console.log(`- Số truyện: ${novelFolders.length} (${novelFolders.join(", ")})`);
  console.log(`- Số chương mỗi truyện: ${chaptersPerNovel}`);
  console.log(`- Tổng chương dự kiến: ${novelFolders.length * chaptersPerNovel}\n`);

  const model = genAI.getGenerativeModel({ model: modelName });
  let totalCreated = 0;

  for (let idx = 0; idx < novelFolders.length; idx++) {
    const novelSlug = novelFolders[idx];
    const novelDir = path.join(novelsRoot, novelSlug);
    const chaptersDir = path.join(novelDir, "chapters");
    if (!fs.existsSync(chaptersDir)) {
      fs.mkdirSync(chaptersDir, { recursive: true });
    }

    console.log("\n" + "#".repeat(60));
    console.log(`📚 [${idx + 1}/${novelFolders.length}] TIỂU THUYẾT: ${novelSlug}`);
    console.log("#".repeat(60));

    let novelContext = "";
    const codexPath = path.join(novelDir, "master_codex.md");
    if (fs.existsSync(codexPath)) {
      novelContext += `\n=== MASTER CODEX CỦA BỘ TRUYỆN (${novelSlug}) ===\n`;
      novelContext += fs.readFileSync(codexPath, "utf-8");
      novelContext += `\n================================================\n`;
      console.log(`Đã nạp master_codex cho bộ truyện: ${novelSlug}`);
    }

    const charsPath = path.join(novelDir, "characters.md");
    if (fs.existsSync(charsPath)) {
      novelContext += `\n=== HỒ SƠ NHÂN VẬT (${novelSlug}) ===\n`;
      novelContext += fs.readFileSync(charsPath, "utf-8");
      novelContext += `\n=====================================\n`;
      console.log(`Đã nạp characters.md cho bộ truyện: ${novelSlug}`);
    }

    for (let step = 1; step <= chaptersPerNovel; step++) {
      const currentMax = getMaxChapterNum(chaptersDir);
      const nextChapterNum = currentMax + 1;
      const filePath = path.join(chaptersDir, `chapter_${nextChapterNum}.md`);

      console.log(`\n✍️ [${step}/${chaptersPerNovel}] Sáng tác Chương ${nextChapterNum} cho '${novelSlug}'...`);

      const prevExcerpt = getPreviousChapterExcerpt(chaptersDir, currentMax);
      let prevContextPrompt = "";
      if (prevExcerpt) {
        prevContextPrompt = `
=== TRÍCH ĐOẠN KẾT THÚC CỦA CHƯƠNG ${currentMax} (ĐỂ NỐI TIẾP LIỀN MẠCH) ===
${prevExcerpt}
========================================================================
`;
      }

      const prompt = `
Bạn là TÁC GIẢ TỐI CAO (Đại Tiểu Thuyết Gia) trong hệ thống VIET-TRUYEN MASTER.
Để viết ra một chương truyện xuất sắc, bạn BẮT BUỘC phải học hỏi và tuân thủ nghiêm ngặt toàn bộ các quy tắc, workflow, góc nhìn của "Độc Giả Khó Tính" và "Tác Giả Khó Tính" dưới đây:

${baseSystemRules}

${novelContext}

${prevContextPrompt}

YÊU CẦU THỰC THI BẮT BUỘC CHO CHƯƠNG ${nextChapterNum}:
- Hãy viết Chương ${nextChapterNum} cho bộ tiểu thuyết trên.
- NỐI TIẾP LIỀN MẠCH: Nếu có trích đoạn chương trước, phải mở đầu chương tiếp nối ngay lập tức từ bối cảnh, hành động và cảm xúc dang dở của đoạn kết đó.
- Áp dụng triệt để quy tắc Pacing 3 nhịp (Không khí -> Tâm lý -> Hành động) và Kích hoạt ngũ quan.
- Vượt qua bài kiểm duyệt khắc nghiệt của "Độc Giả Khó Tính" và "Tác Giả Khó Tính".
- QUY TẮC ĐỊNH DẠNG TIÊU ĐỀ BẮT BUỘC: Dòng đầu tiên của chương PHẢI LÀ tiêu đề định dạng Markdown H1:
  # Chương ${nextChapterNum}: <Tiêu đề chương thật kêu và hấp dẫn>
  (Ví dụ: # Chương ${nextChapterNum}: Huyết Vực Chờ Mong, Tuyết Khóc Hoang Vu)
- Chương phải có ít nhất 1.500 - 2.500 từ, có chiều sâu, đa giác quan và bám sát mạch truyện.
- Chương phải kết thúc bằng một "Cliffhanger Hook" (Móc câu lửng) ở 3 câu cuối để lôi cuốn độc giả sang chương tiếp.
- TUYỆT ĐỐI KHÔNG dùng các ký tự asterisk (**) in đậm thừa thãi trong văn bản.
- Trả về nguyên văn bản Markdown của chương truyện, không thêm các lời chào hỏi hay giải thích thừa thãi ngoài nội dung chương.
`;

      try {
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        if (!text) {
          console.warn(`❌ Không nhận được nội dung từ AI cho Chương ${nextChapterNum}. Bỏ qua.`);
          continue;
        }

        const lines = text.split("\n");
        const firstLine = lines[0]?.trim() || "";
        if (!firstLine.startsWith("#")) {
          if (firstLine.toLowerCase().startsWith(`chương ${nextChapterNum}`) || firstLine.toLowerCase().startsWith("chương")) {
            lines[0] = `# ${firstLine}`;
          } else {
            lines.unshift(`# Chương ${nextChapterNum}: Khởi Đầu Phong Ba`, "");
          }
          text = lines.join("\n");
        }

        fs.writeFileSync(filePath, text, "utf-8");
        const words = text.split(/\s+/).filter(Boolean).length;
        console.log(`✅ Đã lưu thành công: chapter_${nextChapterNum}.md (${words} từ)`);
        totalCreated++;

        // Nghỉ 2 giây giữa các chương
        await new Promise(res => setTimeout(res, 2000));
      } catch (err: any) {
        console.error(`❌ Lỗi khi gọi API cho Chương ${nextChapterNum}:`, err?.message || err);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`🎉 HOÀN TẤT! Tổng số chương mới đã tạo: ${totalCreated}`);
  console.log("=".repeat(60));
}

main().catch(err => {
  console.error("Lỗi chương trình:", err);
  process.exit(1);
});
