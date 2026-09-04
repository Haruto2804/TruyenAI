import os
import sys
import time
import re
from pathlib import Path
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Lỗi: Không tìm thấy GEMINI_API_KEY trong biến môi trường.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

def get_max_chapter_num(chapters_dir: Path) -> int:
    if not chapters_dir.exists():
        return 0
    max_num = 0
    for f in chapters_dir.iterdir():
        if f.is_file() and f.suffix == ".md":
            match = re.search(r"chapter_(\d+)\.md", f.name)
            if match:
                num = int(match.group(1))
                if num > max_num:
                    max_num = num
    return max_num

def get_previous_chapter_excerpt(chapters_dir: Path, prev_num: int) -> str:
    if prev_num <= 0:
        return ""
    prev_file = chapters_dir / f"chapter_{prev_num}.md"
    if not prev_file.exists():
        return ""
    try:
        content = prev_file.read_text(encoding="utf-8").strip()
        lines = content.split("\n")
        # Trích xuất 120 dòng cuối để AI nắm vững bối cảnh và cảm xúc liền mạch
        excerpt_lines = lines[-120:] if len(lines) > 120 else lines
        return "\n".join(excerpt_lines)
    except Exception as e:
        print(f"Không thể đọc trích đoạn chương trước: {e}", flush=True)
        return ""

def generate_chapter_content(client, model_name: str, prompt: str, max_retries: int = 2) -> str:
    for attempt in range(max_retries + 1):
        try:
            text = ""
            try:
                stream = client.interactions.create(
                    model=model_name,
                    input=prompt,
                    stream=True
                )
                print("⚡ Đã kết nối thành công! Đang stream nội dung chương truyện:\n" + ("=" * 50), flush=True)
                text_chunks = []
                for event in stream:
                    if hasattr(event, "delta") and hasattr(event.delta, "text") and event.delta.text:
                        chunk = event.delta.text
                        text_chunks.append(chunk)
                        print(chunk, end="", flush=True)
                print("\n" + ("=" * 50), flush=True)
                text = "".join(text_chunks).strip()
            except Exception as stream_err:
                print(f"\n⚠️ Chế độ streaming gặp lỗi ({stream_err}), chuyển sang non-streaming...", flush=True)
                interaction = client.interactions.create(
                    model=model_name,
                    input=prompt
                )
                text = interaction.output_text.strip()

            if text:
                return text
            print("Cảnh báo: Phản hồi từ AI rỗng. Đang thử lại...", flush=True)
        except Exception as api_err:
            print(f"⚠️ Lỗi gọi Gemini API (lần thử {attempt + 1}/{max_retries + 1}): {api_err}", flush=True)
            if attempt < max_retries:
                wait_seconds = (attempt + 1) * 5
                print(f"Đang chờ {wait_seconds}s trước khi thử lại...", flush=True)
                time.sleep(wait_seconds)
            else:
                raise api_err
    return ""

def main():
    cwd = Path.cwd()
    print("=" * 60, flush=True)
    print("🚀 BẮT ĐẦU KỊCH BẢN SÁNG TÁC TIỂU THUYẾT ĐA TRUYỆN TỰ ĐỘNG", flush=True)
    print("=" * 60, flush=True)

    # 1. Đọc nội dung các Skill và Rules chung
    context_files = [
        cwd / ".agents" / "skills" / "viet-truyen-master" / "SKILL.md",
        cwd / ".agents" / "skills" / "doc-gia-kho-tinh" / "doc_gia_kho_tinh.md",
        cwd / ".agents" / "skills" / "tac-gia-kho-tinh" / "tac_gia_kho_tinh.md",
        cwd / ".agents" / "rules" / "publishing_rules.md",
        cwd / ".agents" / "rules" / "viet_truyen_workflow.md",
    ]

    base_system_rules = ""
    for file_path in context_files:
        if file_path.exists():
            base_system_rules += f"\n=== TÀI LIỆU CHUẨN: {file_path.name} ===\n"
            base_system_rules += file_path.read_text(encoding="utf-8")
            base_system_rules += "\n========================================\n"
            print(f"Đã nạp thành công tài liệu: {file_path.name}", flush=True)
        else:
            print(f"Cảnh báo: Không tìm thấy file tại {file_path}", flush=True)

    # 2. Xác định danh sách truyện cần viết
    novels_root = cwd / ".agents" / "viet_truyen" / "novels"
    if not novels_root.exists():
        print(f"Lỗi: Thư mục novels không tồn tại tại {novels_root}", flush=True)
        sys.exit(1)

    target_slug = os.environ.get("NOVEL_SLUG", "all").strip().lower()
    if target_slug and target_slug != "all":
        target_dir = novels_root / target_slug
        if target_dir.exists() and target_dir.is_dir():
            novel_dirs = [target_dir]
        else:
            print(f"Lỗi: Không tìm thấy truyện có slug '{target_slug}'", flush=True)
            sys.exit(1)
    else:
        novel_dirs = sorted([d for d in novels_root.iterdir() if d.is_dir()])

    try:
        chapters_per_novel = int(os.environ.get("CHAPTERS_PER_NOVEL", "5"))
    except ValueError:
        chapters_per_novel = 5

    model_name = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")

    print(f"\n📊 CẤU HÌNH THỰC THI:")
    print(f"- Mô hình AI: {model_name}")
    print(f"- Số truyện cần xử lý: {len(novel_dirs)} ({', '.join(d.name for d in novel_dirs)})")
    print(f"- Số chương mỗi truyện: {chapters_per_novel}")
    print(f"- Tổng số chương dự kiến: {len(novel_dirs) * chapters_per_novel}\n", flush=True)

    total_chapters_created = 0

    for novel_index, novel_dir in enumerate(novel_dirs, start=1):
        novel_slug = novel_dir.name
        print("\n" + "#" * 60, flush=True)
        print(f"📚 [{novel_index}/{len(novel_dirs)}] ĐANG XỬ LÝ TIỂU THUYẾT: {novel_slug}", flush=True)
        print("#" * 60, flush=True)

        chapters_dir = novel_dir / "chapters"
        chapters_dir.mkdir(parents=True, exist_ok=True)

        # Nạp Master Codex riêng của bộ truyện
        novel_context = ""
        codex_path = novel_dir / "master_codex.md"
        if codex_path.exists():
            novel_context += f"\n=== MASTER CODEX CỦA BỘ TRUYỆN ({novel_slug}) ===\n"
            novel_context += codex_path.read_text(encoding="utf-8")
            novel_context += "\n================================================\n"
            print(f"Đã nạp master_codex cho bộ truyện: {novel_slug}", flush=True)

        # Nạp Characters riêng nếu có
        chars_path = novel_dir / "characters.md"
        if chars_path.exists():
            novel_context += f"\n=== HỒ SƠ NHÂN VẬT (CHARACTERS: {novel_slug}) ===\n"
            novel_context += chars_path.read_text(encoding="utf-8")
            novel_context += "\n================================================\n"
            print(f"Đã nạp characters.md cho bộ truyện: {novel_slug}", flush=True)

        for step in range(1, chapters_per_novel + 1):
            current_max = get_max_chapter_num(chapters_dir)
            next_chapter_num = current_max + 1
            file_path = chapters_dir / f"chapter_{next_chapter_num}.md"

            print(f"\n✍️ [{step}/{chapters_per_novel}] Đang sáng tác Chương {next_chapter_num} cho '{novel_slug}'...", flush=True)

            # Lấy trích đoạn kết thúc của chương trước để nối liền cốt truyện
            prev_excerpt = get_previous_chapter_excerpt(chapters_dir, current_max)
            prev_context_prompt = ""
            if prev_excerpt:
                prev_context_prompt = f"""
=== TRÍCH ĐOẠN KẾT THÚC CỦA CHƯƠNG {current_max} (ĐỂ NỐI TIẾP LIỀN MẠCH) ===
{prev_excerpt}
========================================================================
"""

            prompt = f"""
Bạn là TÁC GIẢ TỐI CAO (Đại Tiểu Thuyết Gia) trong hệ thống VIET-TRUYEN MASTER.
Để viết ra một chương truyện xuất sắc, bạn BẮT BUỘC phải học hỏi và tuân thủ nghiêm ngặt toàn bộ các quy tắc, workflow, góc nhìn của "Độc Giả Khó Tính" và "Tác Giả Khó Tính" dưới đây:

{base_system_rules}

{novel_context}

{prev_context_prompt}

YÊU CẦU THỰC THI BẮT BUỘC CHO CHƯƠNG {next_chapter_num}:
- Hãy viết Chương {next_chapter_num} cho bộ tiểu thuyết trên.
- NỐI TIẾP LIỀN MẠCH: Nếu có trích đoạn chương trước, phải mở đầu chương tiếp nối ngay lập tức từ bối cảnh, hành động và cảm xúc dang dở của đoạn kết đó.
- Áp dụng triệt để quy tắc Pacing 3 nhịp (Không khí -> Tâm lý -> Hành động) và Kích hoạt ngũ quan.
- Vượt qua bài kiểm duyệt khắc nghiệt của "Độc Giả Khó Tính" và "Tác Giả Khó Tính".
- QUY TẮC ĐỊNH DẠNG TIÊU ĐỀ BẮT BUỘC: Dòng đầu tiên của chương PHẢI LÀ tiêu đề định dạng Markdown H1:
  # Chương {next_chapter_num}: <Tiêu đề chương thật kêu và hấp dẫn>
  (Ví dụ: # Chương {next_chapter_num}: Huyết Vực Chờ Mong, Tuyết Khóc Hoang Vu)
- Chương phải có ít nhất 1.500 - 2.500 từ, có chiều sâu, đa giác quan và bám sát mạch truyện.
- Chương phải kết thúc bằng một "Cliffhanger Hook" (Móc câu lửng) ở 3 câu cuối để lôi cuốn độc giả sang chương tiếp.
- TUYỆT ĐỐI KHÔNG dùng các ký tự asterisk (**) in đậm thừa thãi trong văn bản.
- Trả về nguyên văn bản Markdown của chương truyện, không thêm các lời chào hỏi hay giải thích thừa thãi ngoài nội dung chương.
"""

            try:
                text = generate_chapter_content(client, model_name, prompt)
                if not text:
                    print(f"❌ Không nhận được nội dung cho Chương {next_chapter_num}. Bỏ qua chương này.", flush=True)
                    continue

                # Chuẩn hóa dòng tiêu đề đầu tiên
                lines = text.split("\n")
                first_line = lines[0].strip() if lines else ""
                if not first_line.startswith("#"):
                    if first_line.lower().startswith(f"chương {next_chapter_num}") or first_line.lower().startswith("chương"):
                        lines[0] = f"# {first_line}"
                    else:
                        lines.insert(0, f"# Chương {next_chapter_num}: Khởi Đầu Phong Ba")
                        lines.insert(1, "")
                    text = "\n".join(lines)

                word_count = len(text.split())
                file_path.write_text(text, encoding="utf-8")
                print(f"✅ Đã lưu thành công: {file_path.name} ({word_count} từ)", flush=True)
                total_chapters_created += 1

                # Nghỉ ngắn giữa các chương để tránh rate limit
                time.sleep(2)
            except Exception as e:
                print(f"❌ Lỗi khi sáng tác Chương {next_chapter_num} của {novel_slug}: {e}", flush=True)

    print("\n" + "=" * 60, flush=True)
    print(f"🎉 HOÀN TẤT! Tổng số chương mới đã tạo: {total_chapters_created}", flush=True)
    print("=" * 60, flush=True)

if __name__ == "__main__":
    main()
