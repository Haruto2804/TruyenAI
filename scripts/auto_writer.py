import os
import sys
from pathlib import Path
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Lỗi: Không tìm thấy GEMINI_API_KEY trong biến môi trường.")
    sys.exit(1)

client = genai.Client()

def main():
    print("Đang khởi tạo AI...")
    cwd = Path.cwd()
    
    # 1. Đọc nội dung các Skill và Rules
    context_files = [
        cwd / ".agents" / "skills" / "viet-truyen-master" / "SKILL.md",
        cwd / ".agents" / "skills" / "doc-gia-kho-tinh" / "doc_gia_kho_tinh.md",
        cwd / ".agents" / "skills" / "tac-gia-kho-tinh" / "tac_gia_kho_tinh.md",
        cwd / ".agents" / "rules" / "publishing_rules.md",
        cwd / ".agents" / "viet_truyen" / "viet_truyen.md",
        cwd / ".agents" / "rules" / "viet_truyen_workflow.md",
    ]

    system_context = ""
    for file_path in context_files:
        if file_path.exists():
            system_context += f"\n=== TÀI LIỆU: {file_path.name} ===\n"
            system_context += file_path.read_text(encoding="utf-8")
            system_context += "\n========================================\n"
            print(f"Đã nạp thành công tài liệu: {file_path.name}")
        else:
            print(f"Cảnh báo: Không tìm thấy file tại {file_path}")

    # 2. Thư mục lưu truyện CHUẨN
    novel_slug = os.environ.get("NOVEL_SLUG", "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong")
    novel_dir = cwd / ".agents" / "viet_truyen" / "novels" / novel_slug
    output_dir = novel_dir / "chapters"

    codex_path = novel_dir / "master_codex.md"
    if codex_path.exists():
        system_context += f"\n=== MASTER CODEX ({novel_slug}) ===\n"
        system_context += codex_path.read_text(encoding="utf-8")
        system_context += "\n===================================\n"
        print(f"Đã nạp master_codex của bộ truyện: {novel_slug}")

    output_dir.mkdir(parents=True, exist_ok=True)

    # 3. Đếm số chương hiện có
    existing_chapters = [f for f in output_dir.iterdir() if f.name.startswith("chapter_") and f.suffix == ".md"]
    next_chapter_num = len(existing_chapters) + 1
    file_path = output_dir / f"chapter_{next_chapter_num}.md"

    # 4. Lắp ráp Prompt
    prompt = f"""
Bạn là TÁC GIẢ TỐI CAO (Đại Tiểu Thuyết Gia) trong hệ thống VIET-TRUYEN MASTER.
Để viết ra một chương truyện xuất sắc, bạn BẮT BUỘC phải học hỏi và tuân thủ nghiêm ngặt toàn bộ các quy tắc, workflow, góc nhìn của "Độc Giả Khó Tính" và "Tác Giả Khó Tính" dưới đây:

{system_context}

YÊU CẦU THỰC THI (ĐÃ ĐƯỢC CHẮT LỌC TỪ CÁC TÀI LIỆU TRÊN):
- Hãy viết Chương {next_chapter_num} cho bộ tiểu thuyết dựa theo cốt truyện trong "viet_truyen.md".
- Áp dụng triệt để quy tắc Pacing 3 nhịp (Không khí -> Tâm lý -> Hành động) và Kích hoạt ngũ quan.
- Vượt qua bài kiểm duyệt khắc nghiệt của "Độc Giả Khó Tính" và "Tác Giả Khó Tính".
- Tuân thủ Publishing Rules và Workflow.
- Chương phải kết thúc bằng một "Cliffhanger Hook" (Móc câu lửng) ở 3 câu cuối.
- TUYỆT ĐỐI KHÔNG dùng các ký tự asterisk (**) in đậm thừa thãi trong văn bản.
- Trả về nguyên văn bản Markdown của chương truyện, không thêm các lời giải thích thừa như "Đây là chương truyện...".
"""

    print(f"Đang yêu cầu AI viết Chương {next_chapter_num} bằng model gemini-3.8-flash...")

    try:
        interaction = client.interactions.create(
            model="gemini-3.8-flash",
            input=prompt
        )
        text = interaction.output_text
        print("AI đã viết xong. Đang lưu file...")
        file_path.write_text(text, encoding="utf-8")
        print(f"Đã lưu thành công tại: {file_path}")
        print("GỢI Ý: Kịch bản đã sẵn sàng để tích hợp với lệnh 'npm run sync:novel'!")
    except Exception as e:
        print(f"Có lỗi xảy ra khi gọi API: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
