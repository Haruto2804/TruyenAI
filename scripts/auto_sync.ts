import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Load .env manually for scripts
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient();

// Helper: Upload file to Cloudinary and return CDN URL
async function uploadToCloud(filePath: string, folder: string, publicId?: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (err: any) {
    console.warn(`    ⚠️ Cloudinary upload fallback for ${filePath}: ${err.message}`);
    return "";
  }
}

// Helper: Find character avatar file and upload to Cloudinary
async function findAndUploadCharacterAvatar(novelSlug: string, charName: string, aliases: string | null): Promise<string | null> {
  const charDir = path.join(process.cwd(), "public", "characters", novelSlug);
  if (!fs.existsSync(charDir)) {
    fs.mkdirSync(charDir, { recursive: true });
    return null;
  }

  const files = fs.readdirSync(charDir);
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"];

  // Exact full slug
  const nameClean = charName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const fullSlug = nameClean.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  // Distinct core name tokens
  const stopWords = ["nhi", "truong", "lao", "hac", "su", "gia", "von", "de", "valois", "ravenwood", "thieu", "chu", "tong", "quan"];
  const coreTokens = nameClean.split(/[^a-z0-9]+/).filter(w => !stopWords.includes(w) && w.length >= 3);

  let targetFile: string | null = null;
  let targetSlug: string = fullSlug;

  // 1. Try exact full slug first
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;
    const base = path.basename(file, ext).toLowerCase();
    if (base === fullSlug) {
      targetFile = file;
      targetSlug = base;
      break;
    }
  }

  // 2. Try distinct core tokens
  if (!targetFile) {
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!imageExtensions.includes(ext)) continue;
      const base = path.basename(file, ext).toLowerCase();

      for (const token of coreTokens) {
        if (base === token || base.startsWith(token + "-") || base.endsWith("-" + token) || base.startsWith(token + "_")) {
          targetFile = file;
          targetSlug = base;
          break;
        }
      }
      if (targetFile) break;
    }
  }

  if (targetFile) {
    const localPath = path.join(charDir, targetFile);
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudUrl = await uploadToCloud(localPath, `truyen-ai/characters/${novelSlug}`, targetSlug);
      if (cloudUrl) return cloudUrl;
    }
    return `/characters/${novelSlug}/${targetFile}`;
  }

  return null;
}

// Helper: Find story cover and upload to Cloudinary
async function findAndUploadStoryCover(novelSlug: string): Promise<string> {
  const coversDir = path.join(process.cwd(), "public", "covers");
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif"];
  for (const ext of imageExtensions) {
    const coverPath = path.join(coversDir, `${novelSlug}${ext}`);
    if (fs.existsSync(coverPath)) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const cloudUrl = await uploadToCloud(coverPath, "truyen-ai/covers", novelSlug);
        if (cloudUrl) return cloudUrl;
      }
      return `/covers/${novelSlug}${ext}`;
    }
  }
  return `/covers/${novelSlug}.jpg`;
}

// Generate characters.md file with Visual Dossier for User
function generateCharactersMarkdown(novelSlug: string, novelTitle: string, characters: any[]) {
  const charactersMdPath = path.join(process.cwd(), ".agents", "viet_truyen", "novels", novelSlug, "characters.md");
  
  let md = `# HỒ SƠ DIỆN MẠO NHÂN VẬT (VISUAL DOSSIER)\n`;
  md += `**Tác phẩm:** ${novelTitle}\n`;
  md += `**Thư mục lưu ảnh:** \`public/characters/${novelSlug}/\`\n`;
  md += `**Quy tắc:** Bạn chỉ cần lưu ảnh đại diện của nhân vật vào \`public/characters/${novelSlug}/<ten-nhan-vat>.png\` (hoặc \`.jpg\`, \`.webp\`) rồi chạy \`npm run sync:novel\`. Hệ thống sẽ tự động đồng bộ lên Database và CDN!\n\n`;
  md += `---\n\n`;

  characters.forEach((char, idx) => {
    const slugName = char.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-");
    const avatarStatus = char.avatarUrl && fs.existsSync(path.join(process.cwd(), "public", char.avatarUrl))
      ? `✅ Đã có ảnh (\`${char.avatarUrl}\`)`
      : `⚠️ Chưa có ảnh (\`public/characters/${novelSlug}/${slugName}.png\`)`;

    md += `## ${idx + 1}. ${char.name}\n`;
    md += `- **Vai trò:** ${char.role || "Chưa xác định"}\n`;
    md += `- **Biệt danh & Danh xưng:** ${char.aliases || "Không có"}\n`;
    md += `- **Trạng thái Avatar:** ${avatarStatus}\n\n`;
    
    md += `### 🎭 Phác thảo diện mạo chi tiết (Visual Dossier):\n`;
    md += `${char.description || "Chưa có mô tả chi tiết."}\n\n`;
    md += `---\n\n`;
  });

  fs.writeFileSync(charactersMdPath, md, "utf-8");
  console.log(`Saved Character Dossier -> ${charactersMdPath}`);
}

function parseDynamicCharacters(codexContent: string): any[] {
  const chars: any[] = [];
  let inCharSection = false;
  let currentChar: any = null;

  const lines = codexContent.split("\n");
  for (const line of lines) {
    if (line.includes("2. CHARACTER CODEX") || line.includes("HỒ SƠ NHÂN VẬT")) {
      inCharSection = true;
      continue;
    }
    if (inCharSection && line.startsWith("## ") && !line.includes("CHARACTER") && !line.includes("NHÂN VẬT")) {
      inCharSection = false;
      if (currentChar) { chars.push(currentChar); currentChar = null; }
      break;
    }

    if (inCharSection) {
      if (line.startsWith("### ")) {
        if (currentChar) {
          chars.push(currentChar);
          currentChar = null;
        }
        // If it's a subheader like "### 5. Các nhân vật phụ", don't treat it as a single character
        if (line.toLowerCase().includes("nhân vật phụ") || line.toLowerCase().includes("supporting characters")) {
          continue;
        }

        const match = line.match(/^###\s+(?:\d+\.\s+)?(.+?)(?:\s*\([^)]*\))?$/);
        const name = match ? match[1].trim() : line.replace("###", "").trim();
        currentChar = {
          name,
          role: "",
          aliases: "",
          description: ""
        };
      } else if (currentChar) {
        const kvMatch = line.match(/^\s*[*+-]?\s*\*\*(.+?)(?::)?\*\*(?::)?\s*(.*)$/);
        if (kvMatch) {
          const rawKey = kvMatch[1].replace(/[:*]/g, "").trim();
          const val = kvMatch[2].trim();
          const lowerKey = rawKey.toLowerCase();

          // Strict Anti-Spoiler Guard: Never expose secret, wound, or twist to public database
          if (lowerKey.includes("bí mật") || lowerKey.includes("vết thương") || lowerKey.includes("wound") || lowerKey.includes("twist")) {
            continue;
          }

          if (lowerKey.includes("vai trò") || lowerKey.includes("thân phận")) {
            currentChar.role = val;
          } else if (lowerKey.includes("danh xưng") || lowerKey.includes("biệt danh") || lowerKey.includes("biệt hiệu") || lowerKey.includes("bí danh")) {
            currentChar.aliases = val;
          } else {
            const detail = `**${rawKey}:** ${val}`;
            currentChar.description = currentChar.description ? `${currentChar.description}\n\n${detail}` : detail;
          }
        } else if (line.trim().length > 0 && !line.startsWith("#")) {
          currentChar.description = currentChar.description ? `${currentChar.description}\n\n${line.trim()}` : line.trim();
        }
      } else if (line.trim().startsWith("* **") && line.includes(":**")) {
        // Handle supporting characters list: "* **Thanh tra Lindqvist:** Điều tra viên..."
        const suppMatch = line.match(/^\s*\*\s*\*\*(.+?)\*\*:\s*(.+)$/);
        if (suppMatch) {
          const suppName = suppMatch[1].replace(/\s*\([^)]*\)/g, "").trim();
          const suppDesc = suppMatch[2].trim();
          chars.push({
            name: suppName,
            role: "Nhân vật phụ",
            aliases: "",
            description: `**Mô tả:** ${suppDesc}`
          });
        }
      }
    }
  }
  if (currentChar) chars.push(currentChar);

  return chars;
}

// Dynamic parser for Lores markdown
function parseDynamicLores(codexContent: string): any[] {
  const lores: any[] = [];
  let inLoreSection = false;
  let currentLore: any = null;

  const lines = codexContent.split("\n");
  for (const line of lines) {
    const normalizedLine = line.toUpperCase();
    if (normalizedLine.includes("LORE") || normalizedLine.includes("GLOSSARY") || normalizedLine.includes("CHÚ GIẢI") || normalizedLine.includes("THUẬT NGỮ")) {
      if (line.startsWith("##")) {
        inLoreSection = true;
        continue;
      }
    }
    if (inLoreSection && line.startsWith("## ") && !normalizedLine.includes("LORE") && !normalizedLine.includes("GLOSSARY") && !normalizedLine.includes("CHÚ GIẢI")) {
      inLoreSection = false;
      if (currentLore) { lores.push(currentLore); currentLore = null; }
      break;
    }

    if (inLoreSection) {
      if (line.startsWith("### ")) {
        if (currentLore) lores.push(currentLore);
        const match = line.match(/^###\s+(?:\d+\.\s+)?(.+)$/);
        currentLore = {
          term: match ? match[1].trim() : line.replace("###", "").trim(),
          category: "Khái Niệm",
          aliases: "",
          definition: ""
        };
      } else if (currentLore) {
        const kvMatch = line.match(/^\s*[*+-]?\s*\*\*(.+?)(?::)?\*\*(?::)?\s*(.*)$/);
        if (kvMatch) {
          const rawKey = kvMatch[1].replace(/[:*]/g, "").trim().toLowerCase();
          const val = kvMatch[2].trim();
          if (rawKey.includes("phân loại")) {
            const m = val.match(/`([^`]+)`/) || [null, val];
            currentLore.category = (m[1] || val).replace(/[`🔮🧪💎🏰🛡️⚡📜🌿✨🗡️]/g, "").trim();
          } else if (rawKey.includes("đồng nghĩa") || rawKey.includes("biệt danh")) {
            currentLore.aliases = val.replace(/\.$/, "");
          } else if (rawKey.includes("định nghĩa") || rawKey.includes("mô tả")) {
            currentLore.definition = val;
          }
        } else if (line.trim().length > 0 && !line.startsWith("#")) {
          if (currentLore.definition) currentLore.definition += "\n" + line.trim();
        }
      }
    }
  }
  if (currentLore) lores.push(currentLore);

  // Table parser fallback
  let inLoreTable = false;
  for (const line of lines) {
    const normalizedLine = line.toUpperCase();
    if (normalizedLine.includes("DANH MỤC CHÚ GIẢI") || normalizedLine.includes("DANH MỤC THUẬT NGỮ") || normalizedLine.includes("LORE & GLOSSARY")) {
      if (line.startsWith("##")) {
        inLoreTable = true;
        continue;
      }
    }
    if (inLoreTable && line.startsWith("## ") && !normalizedLine.includes("DANH MỤC") && !normalizedLine.includes("LORE")) {
      inLoreTable = false;
      break;
    }
    if (inLoreTable && line.startsWith("|") && !line.includes("---") && !line.includes("Danh Mục")) {
      const parts = line.split("|").map(p => p.trim()).filter(Boolean);
      if (parts.length >= 3) {
        const category = parts[0].replace(/[`🔮🧪💎🏰🛡️⚡📜🌿✨🗡️]/g, "").trim();
        const term = parts[1].replace(/\*\*/g, "").trim();
        const definition = parts[2].trim();
        if (term && definition && !lores.find(l => l.term === term)) {
          lores.push({
            term,
            category: category || "Khái Niệm",
            aliases: term,
            definition
          });
        }
      }
    }
  }

  return lores;
}

async function syncNovel(novelSlug: string) {
  const novelDir = path.join(process.cwd(), ".agents", "viet_truyen", "novels", novelSlug);
  if (!fs.existsSync(novelDir)) {
    console.error(`Novel directory not found: ${novelDir}`);
    return;
  }

  const codexPath = path.join(novelDir, "master_codex.md");
  if (!fs.existsSync(codexPath)) {
    console.error(`master_codex.md not found in ${novelDir}`);
    return;
  }

  console.log(`\n========================================`);
  console.log(`AUTOMATED SYNCING NOVEL: [${novelSlug}]`);
  console.log(`========================================`);

  const codexContent = fs.readFileSync(codexPath, "utf-8");

  // 1. Parse Story Info Dynamically
  const titleMatch = codexContent.match(/>\s*\*\*Tên tiểu thuyết:\*\*\s*(.*)/i) ||
                     codexContent.match(/\*\*(?:Tựa Truyện|Tựa truyện|Tên truyện):\*\*\s*(.*)/i) ||
                     codexContent.match(/#\s*(?:HỒ SƠ TỔNG QUAN.*?:\s*|MASTER CODEX:\s*)(.*)/i) ||
                     codexContent.match(/^#\s*(.*)/m);
  let title = titleMatch ? titleMatch[1].trim() : novelSlug;
  if (title.includes("(") && title.includes(")")) {
    title = title.replace(/\s*\([^)]*\)/g, "").trim();
  }

  const genreMatch = codexContent.match(/>\s*\*\*Thể loại:\*\*\s*(.*)/i) ||
                     codexContent.match(/\*\*Thể loại:\*\*\s*(.*)/i);
  const genre = genreMatch ? genreMatch[1].trim() : (novelSlug === "ta-sinh-ra-la-phan-dien" ? "Tiên Hiệp Game RPG, Hệ Thống Phản Diện" : "Huyền Huyễn, Trinh Thám");

  const summaryMatch = codexContent.match(/>\s*\*\*Mô tả ngắn:\*\*\s*(.*)/i) ||
                       codexContent.match(/\*\*(?:Mô tả|Tóm tắt|Mô tả bối cảnh):\*\*\s*(.*)/i);
  let summary = summaryMatch ? summaryMatch[1].trim() : "";
  if (!summary) {
    if (novelSlug === "nguoi-thu-tu") {
      summary = `Thành phố cảng sương mù Ashford – nơi một giáo sư tâm lý hình sự chết trong phòng khóa kín, để lại manh mối về một dự án bí mật mang tên Lethe có khả năng xóa sự tồn tại của con người khỏi nhận thức nhân loại. Nữ phóng viên điều tra Maren Engel dấn thân vào vụ án để tìm kiếm sự thật về người mẹ mất tích, nhưng càng đào sâu, cô càng nhận ra ký ức của chính mình cũng đang bị thao túng...`;
    } else if (novelSlug === "ta-sinh-ra-la-phan-dien") {
      summary = `Bối cảnh diễn ra trong thế giới của tựa game RPG độ khó ác mộng mang tên 《Cửu Giới Tru Tiên Lục》.\n\nNinh Huyền Dạ – đích tử của Cổ Tộc Vô Cực tại Thượng Giới, đồng thời là Chân Truyền của Thái Sơ Tiên Tông, thức tỉnh trong thân xác Boss Phản Diện Màn Đầu mang số mệnh làm đá lót đường cho Khí Vận Chi Tử.\n\nKích hoạt Hệ Thống Nghịch Thiên Cải Mệnh Phản Diện, nhìn thấu điểm Khí Vận và kịch bản cuộc đời của mọi NPC. Đối diện với Khí Vận Chi Tử mang theo tàn hồn lão tổ tới cửa chất vấn, Ninh Huyền Dạ bắt đầu giăng bẫy tước đoạt cơ duyên, biến toàn bộ thiên kiêu thành quân cờ trên bàn cờ của mình...`;
    } else if (novelSlug === "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong") {
      summary = `Đại Lục Erebia – một thế giới ma pháp cổ điển đang bước vào thời kỳ suy tàn của các đại gia tộc huyết thống trước sự trỗi dậy của Thần Điện Quang Minh.\n\nCaelen Von Ravenwood – Đệ tam công tử của gia tộc Công tước Băng Sương khét tiếng phương Bắc, kẻ bị cả kinh đô khinh miệt là "Đống rác của Bắc Cảnh", một kẻ nghiện rượu, đồi bại và bất tài. Không ai biết rằng, hắn thực chất đã bị đầu độc bằng kịch độc "Hắc Tử La Lan" làm nghẽn kinh mạch suốt năm năm qua.\n\nKhi một linh hồn chiến thuật gia kiêm sát thủ thời hiện đại nhập xác, Ma Đồng Giải Cấu thức tỉnh, nhìn thấu mọi mạch chảy mana và điểm yếu ma pháp. Đối diện với vị hôn thê Công chúa kiêu ngạo mang Huyết Chiếu đến phế hôn và âm mưu đày hắn làm vật tế thần nơi Vực Thẳm Hoang Vu, "tên phế vật" bắt đầu mỉm cười...`;
    } else {
      summary = `Bị đối thủ hãm hại phá sản, mang trên lưng món nợ khổng lồ 10 vạn Linh Thạch và đan điền bị phong ấn. Cố Trường Khanh thức tỉnh "Thiên Cơ Định Giá Nhãn" nhìn thấu giá trị thực và xu hướng thị trường của vạn vật.\n\nKết hợp cùng Thẩm Lạc Cẩm — tuyệt sắc đệ nhất tài nữ lưu vong mang độc Cửu U nhưng nắm giữ mạng lưới thương lộ 10 vạn dặm, cả hai bắt đầu từ một quán cầm đồ rách nát, từng bước nuốt chửng các đại thương hội, phát hành tiền tệ tín dụng và xây dựng đế chế tài phiệt thống trị Vạn Giới!`;
    }
  }

  const coverUrl = await findAndUploadStoryCover(novelSlug);

  const story = await prisma.story.upsert({
    where: { slug: novelSlug },
    update: { title, genre, summary, coverUrl },
    create: { title, slug: novelSlug, genre, summary, coverUrl }
  });
  console.log(`Story ID: ${story.id} (${story.title}) -> Cover: ${coverUrl}`);

  // 2. Parsed Characters (Prioritize curated public characters.md, fallback to master_codex.md)
  const charactersMdPath = path.join(novelDir, "characters.md");
  let defaultCharacters: any[] = [];
  if (fs.existsSync(charactersMdPath)) {
    const charsContent = fs.readFileSync(charactersMdPath, "utf-8");
    defaultCharacters = parseDynamicCharacters(charsContent);
  }
  
  if (defaultCharacters.length === 0) {
    defaultCharacters = parseDynamicCharacters(codexContent);
    // Filter out spoilers / twists if parsed from raw master_codex
    defaultCharacters.forEach(c => {
      if (c.description) {
        c.description = c.description
          .split("\n\n")
          .filter((chunk: string) => !chunk.toLowerCase().includes("twist") && !chunk.toLowerCase().includes("bí mật lớn nhất"))
          .join("\n\n");
      }
    });
    // Only generate characters.md if it didn't exist
    generateCharactersMarkdown(novelSlug, story.title, defaultCharacters);
  }

  // Auto-detect avatar image and upload to Cloudinary CDN
  const charactersToSync = await Promise.all(
    defaultCharacters.map(async (char) => {
      const detectedAvatar = await findAndUploadCharacterAvatar(novelSlug, char.name, char.aliases);
      const slugName = char.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-");
      return {
        ...char,
        avatarUrl: detectedAvatar || `/characters/${novelSlug}/${slugName}.jpg`
      };
    })
  );

  // Re-sync Characters to DB
  await prisma.character.deleteMany({ where: { storyId: story.id } });
  for (const char of charactersToSync) {
    await prisma.character.create({
      data: {
        storyId: story.id,
        name: char.name,
        role: char.role || "Nhân vật",
        aliases: char.aliases,
        avatarUrl: char.avatarUrl,
        description: char.description || char.name
      }
    });
    console.log(`[Character Auto-Sync] ${char.name} -> DB OK`);
  }

  // 3. Sync Lores from master_codex.md (both dynamic table and predefined)
  const finalLores = parseDynamicLores(codexContent);

  await prisma.lore.deleteMany({ where: { storyId: story.id } });
  for (const lore of finalLores) {
    await prisma.lore.create({
      data: {
        storyId: story.id,
        term: lore.term,
        category: lore.category,
        aliases: lore.aliases || lore.term,
        definition: lore.definition
      }
    });
    console.log(`[Lore Auto-Sync] ${lore.term} (${lore.category}) -> DB OK`);
  }

  // 4. Sync Chapters from chapters/ folder
  const chaptersDir = path.join(novelDir, "chapters");
  if (fs.existsSync(chaptersDir)) {
    const chapterFiles = fs.readdirSync(chaptersDir).filter(f => f.startsWith("chapter_") && f.endsWith(".md"));
    chapterFiles.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10);
      const numB = parseInt(b.replace(/\D/g, ""), 10);
      return numA - numB;
    });

    for (const file of chapterFiles) {
      const chapterPath = path.join(chaptersDir, file);
      const rawText = fs.readFileSync(chapterPath, "utf-8");
      
      const chapterMatch = file.match(/chapter_(\d+)\.md/);
      if (!chapterMatch) continue;
      const chapterNo = parseInt(chapterMatch[1], 10);

      const lines = rawText.split("\n");
      const firstLine = lines.find(l => l.startsWith("# "));
      let cleanSubTitle = "";
      if (firstLine) {
        cleanSubTitle = firstLine.replace(/^#\s*/, "").replace(/^Chương\s*\d+[:\s-]*/i, "").trim();
      }
      
      // Standardize Chapter Title strictly to: "Chương <số>: <Tiêu đề chương>"
      const finalTitle = cleanSubTitle ? `Chương ${chapterNo}: ${cleanSubTitle}` : `Chương ${chapterNo}`;

      const bodyLines = lines.filter(l => !l.startsWith("# "));
      // Clean asterisks permanently
      const cleanedBody = bodyLines.join("\n").replace(/\*+/g, "").trim();

      await prisma.chapter.upsert({
        where: {
          storyId_chapterNo: {
            storyId: story.id,
            chapterNo: chapterNo
          }
        },
        update: {
          title: finalTitle,
          content: cleanedBody,
          isVip: false,
          price: 0
        },
        create: {
          storyId: story.id,
          chapterNo: chapterNo,
          title: finalTitle,
          content: cleanedBody,
          isVip: false,
          price: 0
        }
      });

      console.log(`[Chapter Auto-Sync] #${chapterNo}: ${finalTitle} -> DB OK`);
    }
  }

  console.log(`\n🎉 NOVEL [${story.title}] SYNCED SUCCESSFULLY!`);
}

async function main() {
  const novelsRoot = path.join(process.cwd(), ".agents", "viet_truyen", "novels");
  if (!fs.existsSync(novelsRoot)) {
    console.error("Novels directory not found!");
    return;
  }

  const novelFolders = fs.readdirSync(novelsRoot).filter(f => {
    return fs.statSync(path.join(novelsRoot, f)).isDirectory();
  });

  for (const novelSlug of novelFolders) {
    await syncNovel(novelSlug);
  }
}

main().finally(() => prisma.$disconnect());
