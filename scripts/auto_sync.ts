import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Helper: Find character avatar file with ANY image extension in public folder
function findCharacterAvatar(novelSlug: string, charName: string, aliases: string | null): string | null {
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

  // Distinct core name tokens (e.g. "caelen", "evelyn", "lilian", "karlov", "vane", "boris", "valerie")
  const stopWords = ["nhi", "truong", "lao", "hac", "su", "gia", "von", "de", "valois", "ravenwood"];
  const coreTokens = nameClean.split(/[^a-z0-9]+/).filter(w => !stopWords.includes(w) && w.length >= 3);

  // 1. Try exact full slug first
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;
    const base = path.basename(file, ext).toLowerCase();
    if (base === fullSlug) {
      return `/characters/${novelSlug}/${file}`;
    }
  }

  // 2. Try distinct core tokens (e.g. file is "evelyn.png" or "caelen.webp" or "karlov.jpg")
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;
    const base = path.basename(file, ext).toLowerCase();

    for (const token of coreTokens) {
      if (base === token || base.startsWith(token + "-") || base.endsWith("-" + token) || base.startsWith(token + "_")) {
        return `/characters/${novelSlug}/${file}`;
      }
    }
  }

  return null;
}

// Generate characters.md file with Visual Dossier & AI Prompts for User
function generateCharactersMarkdown(novelSlug: string, novelTitle: string, characters: any[]) {
  const charactersMdPath = path.join(process.cwd(), ".agents", "viet_truyen", "novels", novelSlug, "characters.md");
  
  let md = `# HỒ SƠ THIẾT KẾ NHÂN VẬT & PROMPT TẠO ẢNH 9:16\n`;
  md += `**Tác phẩm:** ${novelTitle}\n`;
  md += `**Thư mục chứa ảnh:** \`public/characters/${novelSlug}/\`\n`;
  md += `**Quy tắc file:** Hệ thống tự động nhận diện **BẤT KỲ ĐUÔI ẢNH NÀO** (\`.png\`, \`.jpg\`, \`.jpeg\`, \`.webp\`, \`.avif\`). Bạn chỉ cần đặt tên file theo tên nhân vật (ví dụ: \`caelen.png\`, \`lilian.webp\`, \`evelyn.jpg\`) rồi chạy \`npm run sync:novel\` là website tự động cập nhật ngay lập tức!\n\n`;
  md += `---\n\n`;

  characters.forEach((char, idx) => {
    const slugName = char.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-");
    const avatarStatus = char.avatarUrl ? `✅ Đã có ảnh (\`${char.avatarUrl}\`)` : `⚠️ Chưa có ảnh (Hãy tạo ảnh và lưu vào \`public/characters/${novelSlug}/${slugName}.png\`)`;

    md += `## ${idx + 1}. ${char.name}\n`;
    md += `- **Vai trò:** ${char.role || "Chưa xác định"}\n`;
    md += `- **Biệt danh & Danh xưng:** ${char.aliases || "Không có"}\n`;
    md += `- **Trạng thái Avatar:** ${avatarStatus}\n\n`;
    
    md += `### 🎭 Phác thảo diện mạo chi tiết (Visual Dossier):\n`;
    md += `${char.description || "Chưa có mô tả chi tiết."}\n\n`;

    md += `### 🎨 AI Image Generation Prompt (Midjourney v6 / FLUX.1 / SDXL 9:16):\n`;
    md += `\`\`\`text\n`;
    md += `${char.visualPrompt || generateDefaultPrompt(char.name, char.role, char.description)}\n`;
    md += `\`\`\`\n\n`;
    md += `> **💡 Hướng dẫn lưu file:** Sau khi sinh ảnh xong, lưu file vào: \`public/characters/${novelSlug}/${slugName}.png\` (hoặc \`.jpg\`, \`.webp\`).\n\n`;
    md += `---\n\n`;
  });

  fs.writeFileSync(charactersMdPath, md, "utf-8");
  console.log(`Saved Character Prompts Dossier -> ${charactersMdPath}`);
}

function generateDefaultPrompt(name: string, role: string | null, description: string | null): string {
  const isFemale = (role && (role.includes("tiểu thư") || role.includes("Công Chúa") || role.includes("Hầu nữ") || role.includes("Nữ"))) ||
                   (description && (description.includes("nàng") || description.includes("Nữ") || description.includes("xinh đẹp")));
  
  const genderTerm = isFemale ? "1girl, beautiful young noblewoman" : "1boy, handsome young nobleman";
  
  return `masterpiece, best quality, ultra high resolution 8k, manhwa webtoon artstyle, cinematic dramatic lighting, 9:16 portrait vertical composition, ${genderTerm}, noble aristocrat, detailed facial features, expressive eyes, intricate royal fantasy clothing, soft volumetric lighting, frost magic particles floating, blurred fantasy castle interior background, Unreal Engine 5 render, highly detailed anime illustration --ar 9:16 --v 6.0 --style raw`;
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

  // 1. Parse Story Info
  const titleMatch = codexContent.match(/# MASTER CODEX: (.*)/);
  const title = titleMatch ? titleMatch[1].trim() : novelSlug;
  const genre = "Fantasy Tây Phương";

  const story = await prisma.story.upsert({
    where: { slug: novelSlug },
    update: { title, genre },
    create: { title, slug: novelSlug, genre, coverUrl: `/covers/${novelSlug}.jpg` }
  });
  console.log(`Story ID: ${story.id} (${story.title})`);

  // 2. Defined Character Prompts & Dossiers (Pre-configured for maximum visual fidelity)
  const defaultCharacters = [
    {
      name: "Caelen Von Ravenwood",
      role: "Nhân vật chính / Đệ tam công tử Gia Tộc Ravenwood",
      aliases: "Đống rác Bắc Cảnh, Công tử phế vật, Caelen",
      description: `Chiến lược gia sinh tồn kiêm sát thủ thời hiện đại chuyển sinh vào thân xác Đệ tam công tử bị đầu độc suốt 5 năm. Thức tỉnh Ma Đồng Giải Cấu nhìn thấu ma lực và kích hoạt Huyết Mạch Băng Sương Cổ Ngữ. Điềm tĩnh tuyệt đối, thâm trầm, mưu sâu kế độc.`,
      visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1boy, 18 years old handsome young prince, silver-ash slightly disheveled hair, piercing glowing ice-blue eyes with ancient rune deciphering pupils (Ma Dong), calm calculating and cold expression, wearing a luxurious black and silver frost embroidered military coat with white fur collar, slender yet toned athletic physique, holding a discreet silver-carved dagger with frost runes, dim candle-lit aristocratic stone chamber, floating ancient frost glyphs, dramatic volumetric lighting, cinematic photography --ar 9:16 --v 6.0`
    },
    {
      name: "Lilian",
      role: "Hầu nữ thân cận / Gián điệp ngầm của Nhị Trưởng Lão",
      aliases: "Ả hầu gái, Lilian",
      description: `Nữ quan thân cận được cài cắm bên cạnh Caelen từ năm 14 tuổi. Bề ngoài ngây thơ ngoan ngoãn nhưng bên trong vô cùng sắc sảo. Sau khi quy phục Caelen ở Chương 1, trở thành tai mắt đắc lực của hắn.`,
      visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1girl, 19 years old stunning maid, long braided platinum-silver hair, sharp amber golden eyes with an intelligent observant gaze, innocent polite smile masking deep cunning, wearing an elegant high-collar black and white royal maid dress with fur trim, delicate hands holding a silver tea service tray, castle corridor interior, soft ambient lighting, highly detailed anime fantasy --ar 9:16 --v 6.0`
    },
    {
      name: "Evelyn Von Ravenwood",
      role: "Đại tiểu thư / Quân đoàn trưởng Thiết Kỵ / Kiếm Vương Bắc Cảnh",
      aliases: "Nữ Kiếm Vương, Evelyn, Tỷ tỷ Thiết Huyết",
      description: `Đại tiểu thư Gia tộc Ravenwood, Nữ Kiếm Vương phương Bắc chỉ huy Thiết Kỵ Băng Sương. Lạnh lùng, nghiêm nghị, sở hữu kiếm thuật Địa Giai Trung Kỳ và đại kiếm Băng Phách.`,
      visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1girl, 22 years old majestic warrior princess, long straight silver-white hair flowing in the blizzard, cold fierce cyan eyes, noble and unyielding expression, wearing gleaming engraved silver frost-steel plate armor and black fur cape, holding a massive 1.3m crystalline broadsword (Bang Phach) radiating freezing aura, snowy battlefield mountain pass background, blizzard particles, cinematic epic shot --ar 9:16 --v 6.0`
    },
    {
      name: "Valerie De Valois",
      role: "Tam Công Chúa Đế Quốc Solaria / Vị hôn thê đối địch",
      aliases: "Công Chúa Solaria, Phượng Hoàng Lửa Vàng, Valerie",
      description: `Tam Công Chúa kiêu ngạo, tàn nhẫn và đầy toan tính của Đế Quốc Solaria. Hỏa hệ Ma Pháp Sư Quang Minh đạt cảnh giới Cao Giai Đỉnh Phong mang theo Huyết Chiếu Hoàng Gia đến hủy hôn.`,
      visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1girl, 20 years old haughty imperial princess, long wavy golden blonde hair, sharp crimson-ruby eyes, arrogant and condescending smirk, wearing an ultra-luxurious emerald green and golden embroidered royal gown with golden jewelry and crown, golden flame magic aura swirling around her fingers, grand imperial throne hall background with stained glass windows --ar 9:16 --v 6.0`
    },
    {
      name: "Nhị Trưởng Lão Karlov",
      role: "Nhị Trưởng Lão Gia Tộc Ravenwood / Phản diện nội viện",
      aliases: "Karlov, Nhị Trưởng Lão, Nhị Trưởng lão, Nhị Trưởng lão Karlov, Lão già giảo hoạt",
      description: `Nhị Trưởng Lão thâm hiểm, giảo hoạt nắm giữ quyền quản sự hậu viện và tài chính phân nhánh. Kẻ chủ mưu sai khiến Lilian hạ độc Caelen suốt 5 năm nhằm chiếm đoạt quyền thừa kế.`,
      visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1man, 55 years old scheming noble elder, short greying slicked-back hair, neatly trimmed grey beard, deep sinister wrinkles, cold ruthless dark eyes with heavy eye bags, wearing a dark navy aristocratic fur-trimmed coat with silver raven crest, seated in a shadowy frost dungeon council room with stone arches, menacing atmosphere --ar 9:16 --v 6.0`
    },
    {
      name: "Hắc Y Sứ Giả Vane",
      role: "Sát thủ cấp cao / Sứ giả Hội Lưỡi Hái Hắc Ám",
      aliases: "Vane, Hắc Y Sứ Giả, Sứ giả Vane, Sát thủ Hắc Ám, Tử Thần Vực Thẳm",
      description: `Sát thủ Cao Giai Sơ Kỳ tàn nhẫn mang mặt nạ kim loại đen thuộc Hội Lưỡi Hái Hắc Ám. Sở hữu ma pháp Ám Hắc và Tử Linh, chủy thủ tẩm độc Thực Cốt Chu Sa.`,
      visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1man, mysterious hooded shadow assassin, black leather and cloth combat suit with dark purple engravings, sleek half-face dark metal mask, glowing purple eyes from darkness, holding twin curved daggers dripping with black necrotic poison smoke, dark void shadow realm background, ominous aura --ar 9:16 --v 6.0`
    },
    {
      name: "Boris Tai Đỏ",
      role: "Thủ lĩnh Thảo Khấu Biên Ải Frostfang",
      aliases: "Boris, Boris Tai Đỏ, Boris Red-Ear, Tướng cướp man di",
      description: `Gã khổng lồ man di hung bạo cao hơn hai mét, thủ lĩnh hơn 100 thảo khấu. Cảnh giới Trung Giai Sơ Kỳ Thổ hệ, sử dụng đại rìu chiến thép đen hai lưỡi.`,
      visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1man, 38 years old massive muscular barbarian warlord, 2.1m height, scarred rugged fierce face, wild shaggy brown hair and thick beard, deformed blood-red right ear, savage bloodthirsty grin, wearing crude iron plates over heavy beast pelts, resting a gigantic double-headed black steel battleaxe on broad shoulders, freezing rocky mountain gorge blizzard background --ar 9:16 --v 6.0`
    }
  ];

  // Auto-detect avatar image with ANY extension (.png, .jpg, .webp, .jpeg, .avif)
  const charactersToSync = defaultCharacters.map(char => {
    const detectedAvatar = findCharacterAvatar(novelSlug, char.name, char.aliases);
    return {
      ...char,
      avatarUrl: detectedAvatar || `/characters/${novelSlug}/${char.name.toLowerCase().split(" ")[0]}.jpg`
    };
  });

  // Re-sync Characters to DB
  await prisma.character.deleteMany({ where: { storyId: story.id } });
  for (const char of charactersToSync) {
    await prisma.character.create({
      data: {
        storyId: story.id,
        name: char.name,
        role: char.role,
        aliases: char.aliases,
        avatarUrl: char.avatarUrl,
        description: char.description
      }
    });
    console.log(`[Character Auto-Sync] ${char.name} -> Avatar: ${char.avatarUrl}`);
  }

  // Generate / Update characters.md dossier for the user
  generateCharactersMarkdown(novelSlug, story.title, charactersToSync);

  // 3. Sync Lores from master_codex.md
  const defaultLores = [
    {
      term: "Hắc Tử La Lan",
      category: "Độc Dược",
      aliases: "Tử La Lan, Độc hoa La Lan",
      definition: "Loại kịch độc ma thuật mạn tính chiết xuất từ hoa Tử La Lan của Vực Thẳm Hoang Vu. Khi ngấm vào máu sẽ làm đông đặc mạch chảy mana, ăn mòn ma hạch một cách êm ái khiến nạn nhân suy kiệt dần và biến thành phế nhân mà không ai hay biết."
    },
    {
      term: "Ma Đồng Giải Cấu",
      category: "Bí Thuật",
      aliases: "Thấu Thị Cổ Ngữ, Ma Đồng",
      definition: "Nhãn thuật cổ xưa thức tỉnh từ huyết mạch nguyên thủy Băng Sương. Cho phép người sở hữu nhìn thấu dòng chảy mana vi mô, cấu trúc cổ ngữ và phát hiện điểm yếu chí mạng trong mọi chiêu thức, ma pháp hoặc độc tố của đối phương."
    },
    {
      term: "Vực Thẳm Hoang Vu",
      category: "Địa Danh",
      aliases: "Hắc Vực, The Abyssal Rift",
      definition: "Vùng đất chết ngập tràn chướng khí và ma thú khát máu ở cực Bắc đại lục Erebia. Nơi đây là ranh giới giam giữ các sinh vật cổ xưa, do Gia tộc Công tước Ravenwood trấn thủ ngàn năm qua."
    },
    {
      term: "Gia Tộc Ravenwood",
      category: "Thế Lực",
      aliases: "Huyết Ưng Băng Sương, Công quốc Ravenwood",
      definition: "Một trong tứ đại gia tộc công tước cổ xưa nhất Đế quốc Solaria, mang huy hiệu Huyết Ưng Băng Sương. Sở hữu huyết mạch Băng Sương thượng cổ và chỉ huy Đội Quân Thiết Kỵ Băng Sương khét tiếng."
    },
    {
      term: "Huyết Chiếu Hoàng Gia",
      category: "Bảo Vật",
      aliases: "Huyết Chiếu Solaria, Huyết Chiếu",
      definition: "Sắc lệnh tối cao đóng dấu bằng giọt máu thần thánh của Hoàng đế Solaria, mang hiệu lực pháp lý và uy áp hoàng quyền tuyệt đối trên toàn cương thổ đế quốc."
    },
    {
      term: "Băng Sương Long Hồn Quyết",
      category: "Bí Thuật",
      aliases: "Long Hồn Quyết, Tâm Pháp Băng Long",
      definition: "Bí kíp công pháp thượng cổ phong ấn tại Tàng Thư Các Cổ của gia tộc Ravenwood. Cho phép người tu luyện dẫn dắt và dung hợp huyết mạch Thái Cổ Băng Long, gia tăng thể tích ma hạch và uy lực băng sương gấp nhiều lần."
    },
    {
      term: "Hàn Băng Thần Tủy",
      category: "Bảo Vật",
      aliases: "Giọt Máu Băng Long, Thần Tủy",
      definition: "Kết tinh từ giọt máu tim nguyên thủy của Thái Cổ Băng Long do Thủy Tổ Ravenwood phong ấn. Chứa đựng nguồn năng lượng hàn băng thuần khiết giúp Caelen thanh tẩy hoàn toàn độc tố và đột phá lên Trung Giai Sơ Kỳ."
    },
    {
      term: "Hội Lưỡi Hái Hắc Ám",
      category: "Thế Lực",
      aliases: "Dark Scythe, Tà Giáo Vực Thẳm",
      definition: "Tổ chức sát thủ kiêm tà giáo hắc ám hùng mạnh hoạt động ngầm tại ranh giới Vực Thẳm Hoang Vu, chuyên buôn bán ma hạch cấm kỵ và cấm thuật tử linh."
    },
    {
      term: "Hẻm Sói Băng",
      category: "Địa Danh",
      aliases: "Frostwolf Gorge, Hẻm Sói",
      definition: "Hẻm núi độc đạo hiểm trở nối liền trung tâm Pháo đài Băng Sương với các mỏ khoáng thạch Băng Lam nơi biên ải Frostfang, địa hình vách đá dựng đứng và bão tuyết quanh năm."
    }
  ];

  await prisma.lore.deleteMany({ where: { storyId: story.id } });
  for (const lore of defaultLores) {
    await prisma.lore.create({
      data: {
        storyId: story.id,
        ...lore
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
      let chapterTitle = `Chương ${chapterNo}`;
      if (firstLine) {
        chapterTitle = firstLine.replace(/^#\s*/, "").replace(/^Chương\s*\d+[:\s-]*/i, "").trim();
      }

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
          title: chapterTitle,
          content: cleanedBody,
          isVip: chapterNo > 10,
          price: chapterNo > 10 ? 10 : 0
        },
        create: {
          storyId: story.id,
          chapterNo: chapterNo,
          title: chapterTitle,
          content: cleanedBody,
          isVip: chapterNo > 10,
          price: chapterNo > 10 ? 10 : 0
        }
      });

      console.log(`[Chapter Auto-Sync] #${chapterNo}: ${chapterTitle} -> DB OK`);
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
