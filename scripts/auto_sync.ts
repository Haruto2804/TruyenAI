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

  // Distinct core name tokens
  const stopWords = ["nhi", "truong", "lao", "hac", "su", "gia", "von", "de", "valois", "ravenwood", "thieu", "chu", "tong", "quan"];
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

  // 2. Try distinct core tokens
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
  md += `**Quy tắc file:** Hệ thống tự động nhận diện **BẤT KỲ ĐUÔI ẢNH NÀO** (\`.png\`, \`.jpg\`, \`.jpeg\`, \`.webp\`, \`.avif\`). Bạn chỉ cần đặt tên file theo tên nhân vật (ví dụ: \`co-truong-khanh.png\`, \`tham-lac-cam.webp\`) rồi chạy \`npm run sync:novel\` là website tự động cập nhật ngay lập tức!\n\n`;
  md += `---\n\n`;

  characters.forEach((char, idx) => {
    const slugName = char.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-");
    const avatarStatus = char.avatarUrl && fs.existsSync(path.join(process.cwd(), "public", char.avatarUrl))
      ? `✅ Đã có ảnh (\`${char.avatarUrl}\`)`
      : `⚠️ Chưa có ảnh (Hãy tạo ảnh và lưu vào \`public/characters/${novelSlug}/${slugName}.png\`)`;

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
  const isFemale = (role && (role.includes("tiểu thư") || role.includes("Công Chúa") || role.includes("Hầu nữ") || role.includes("Nữ") || role.includes("Hồ Ly"))) ||
                   (description && (description.includes("nàng") || description.includes("Nữ") || description.includes("xinh đẹp")));
  
  const genderTerm = isFemale ? "1girl, breathtaking beautiful young noblewoman" : "1boy, handsome young nobleman";
  
  return `masterpiece, best quality, ultra high resolution 8k, manhwa webtoon artstyle, cinematic dramatic lighting, 9:16 portrait vertical composition, ${genderTerm}, noble aristocrat, detailed facial features, expressive eyes, intricate fantasy clothing, soft volumetric lighting, floating magical particles, high contrast, 8k resolution, Unreal Engine 5 render, highly detailed anime illustration --ar 9:16 --v 6.0`;
}

// Dynamic parser for Lores markdown table in master_codex.md
function parseDynamicLores(codexContent: string): any[] {
  const lores: any[] = [];
  const lines = codexContent.split("\n");
  let inLoreTable = false;

  for (const line of lines) {
    if (line.includes("DANH MỤC CHÚ GIẢI THUẬT NGỮ") || line.includes("DANH MỤC THUẬT NGỮ")) {
      inLoreTable = true;
      continue;
    }
    if (inLoreTable && line.startsWith("## ")) {
      inLoreTable = false;
      break;
    }
    if (inLoreTable && line.startsWith("|") && !line.includes("---") && !line.includes("Danh Mục")) {
      const parts = line.split("|").map(p => p.trim()).filter(Boolean);
      if (parts.length >= 3) {
        const category = parts[0].replace(/[`🔮🧪💎🏰🛡️⚡📜🌿✨🗡️]/g, "").trim();
        const term = parts[1].replace(/\*\*/g, "").trim();
        const definition = parts[2].trim();
        if (term && definition) {
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

// Helper: Find story cover with ANY image extension in public/covers folder
function findStoryCover(novelSlug: string): string {
  const coversDir = path.join(process.cwd(), "public", "covers");
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif"];
  for (const ext of imageExtensions) {
    if (fs.existsSync(path.join(coversDir, `${novelSlug}${ext}`))) {
      return `/covers/${novelSlug}${ext}`;
    }
  }
  return `/covers/${novelSlug}.jpg`;
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
                     codexContent.match(/#\s*(?:HỒ SƠ TỔNG QUAN.*?:\s*|MASTER CODEX:\s*)(.*)/i) ||
                     codexContent.match(/^#\s*(.*)/m);
  let title = titleMatch ? titleMatch[1].trim() : novelSlug;
  if (title.includes("(") && title.includes(")")) {
    title = title.replace(/\s*\([^)]*\)/g, "").trim();
  }

  const genreMatch = codexContent.match(/>\s*\*\*Thể loại:\*\*\s*(.*)/i) ||
                     codexContent.match(/\*\*Thể loại:\*\*\s*(.*)/i);
  const genre = genreMatch ? genreMatch[1].trim() : (novelSlug === "ta-sinh-ra-la-phan-dien" ? "Tiên Hiệp Game RPG, Hệ Thống Phản Diện" : "Huyền Huyễn, Tiên Hiệp");

  const summaryMatch = codexContent.match(/>\s*\*\*Mô tả ngắn:\*\*\s*(.*)/i) ||
                       codexContent.match(/\*\*Mô tả:\*\*\s*(.*)/i);
  let summary = summaryMatch ? summaryMatch[1].trim() : "";
  if (!summary) {
    if (novelSlug === "ta-sinh-ra-la-phan-dien") {
      summary = `Bối cảnh diễn ra trong thế giới của tựa game RPG độ khó ác mộng mang tên 《Cửu Giới Tru Tiên Lục》.\n\nNinh Huyền Dạ – đích tử của Cổ Tộc Vô Cực tại Thượng Giới, đồng thời là Chân Truyền của Thái Sơ Tiên Tông, thức tỉnh trong thân xác Boss Phản Diện Màn Đầu mang số mệnh làm đá lót đường cho Khí Vận Chi Tử.\n\nKích hoạt Hệ Thống Nghịch Thiên Cải Mệnh Phản Diện, nhìn thấu điểm Khí Vận và kịch bản cuộc đời của mọi NPC. Đối diện với Khí Vận Chi Tử mang theo tàn hồn lão tổ tới cửa chất vấn, Ninh Huyền Dạ bắt đầu giăng bẫy tước đoạt cơ duyên, biến toàn bộ thiên kiêu thành quân cờ trên bàn cờ của mình...`;
    } else if (novelSlug === "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong") {
      summary = `Đại Lục Erebia – một thế giới ma pháp cổ điển đang bước vào thời kỳ suy tàn của các đại gia tộc huyết thống trước sự trỗi dậy của Thần Điện Quang Minh.\n\nCaelen Von Ravenwood – Đệ tam công tử của gia tộc Công tước Băng Sương khét tiếng phương Bắc, kẻ bị cả kinh đô khinh miệt là "Đống rác của Bắc Cảnh", một kẻ nghiện rượu, đồi bại và bất tài. Không ai biết rằng, hắn thực chất đã bị đầu độc bằng kịch độc "Hắc Tử La Lan" làm nghẽn kinh mạch suốt năm năm qua.\n\nKhi một linh hồn chiến thuật gia kiêm sát thủ thời hiện đại nhập xác, Ma Đồng Giải Cấu thức tỉnh, nhìn thấu mọi mạch chảy mana và điểm yếu ma pháp. Đối diện với vị hôn thê Công chúa kiêu ngạo mang Huyết Chiếu đến phế hôn và âm mưu đày hắn làm vật tế thần nơi Vực Thẳm Hoang Vu, "tên phế vật" bắt đầu mỉm cười...`;
    } else {
      summary = `Bị đối thủ hãm hại phá sản, mang trên lưng món nợ khổng lồ 10 vạn Linh Thạch và đan điền bị phong ấn. Cố Trường Khanh thức tỉnh "Thiên Cơ Định Giá Nhãn" nhìn thấu giá trị thực và xu hướng thị trường của vạn vật.\n\nKết hợp cùng Thẩm Lạc Cẩm — tuyệt sắc đệ nhất tài nữ lưu vong mang độc Cửu U nhưng nắm giữ mạng lưới thương lộ 10 vạn dặm, cả hai bắt đầu từ một quán cầm đồ rách nát, từng bước nuốt chửng các đại thương hội, phát hành tiền tệ tín dụng và xây dựng đế chế tài phiệt thống trị Vạn Giới!`;
    }
  }

  const coverUrl = findStoryCover(novelSlug);

  const story = await prisma.story.upsert({
    where: { slug: novelSlug },
    update: { title, genre, summary, coverUrl },
    create: { title, slug: novelSlug, genre, summary, coverUrl }
  });
  console.log(`Story ID: ${story.id} (${story.title}) -> Cover: ${coverUrl}`);

  // 2. Defined Character Prompts & Dossiers
  const NOVEL_CHARACTERS: Record<string, any[]> = {
    "van-co-de-nhat-thuong-minh": [
      {
        name: "Cố Trường Khanh",
        role: "Nhân vật chính / Thiếu chủ Cố Gia / Chủ nhân Thiên Cơ Lâu",
        aliases: "Cố thiếu gia, Chủ nhân Thiên Cơ Lâu, Cố công tử, Trường Khanh",
        description: `20 tuổi, vóc người cao gầy đĩnh đạc, gương mặt góc cạnh tuấn tú lạnh lùng. Mái tóc đen tuyền buộc lỏng phía sau, đôi mắt đen nhánh như đá hắc diệu thạch, ẩn sâu bên trong đồng tử là những ký tự số hoàng kim lấp lánh khi kích hoạt Thiên Cơ Nhãn. Thường mặc trường bào xám tro sờn cũ nhưng phẳng phiu sạch sẽ. Điềm tĩnh tuyệt đối, ẩn nhẫn, quyết đoán khi ra tay.`,
        visualPrompt: `masterpiece, best quality, manhwa art style, 1boy, Gu Changqing, 20 years old, handsome sharp face, deep obsidian black eyes with glowing golden runic numerals inside iris, long jet-black hair tied in low ponytail, elegant charcoal-grey silk robe with subtle faded golden embroidery, holding a glowing ancient brass coin between slender fingers, calm enigmatic smirk, confident calculating aura, atmospheric snow particles, dark tavern background, high contrast, cinematic lighting, 8k resolution, vertical 9:16 portrait`
      },
      {
        name: "Thẩm Lạc Cẩm",
        role: "Nữ chính / Bạch Ngọc Hồ Ly / Nguyên Đích Nữ Tài Phiệt Trung Châu",
        aliases: "Bạch Ngọc Hồ Ly, Lạc Cẩm cô nương, Thẩm tiểu thư, Lạc Cẩm",
        description: `19 tuổi, dung mạo khuynh quốc khuynh thành mang vẻ đẹp ma mị và thông tuệ. Làn da trắng như tuyết, đôi mắt hồ ly màu xanh ngọc bích viền kim tuyến liếc nhìn thấu tâm can. Bờ môi đỏ mọng phảng phất hàn khí tím nhạt do trúng Cửu U Băng Phách Độc. Mặc y phục gấm đỏ thẫm thêu hạc bạc, tay cầm bàn tính bằng bạch ngọc tinh xảo. Kiêu sa, quyến rũ và mưu trí sâu như biển.`,
        visualPrompt: `masterpiece, best quality, manhwa art style, 1girl, Shen Luojin, 19 years old, breathtaking fox-like beauty, pale porcelain skin, captivating emerald-green eyes with subtle gold flecks, delicate crimson hanfu dress with embroidered silver cranes and fur trim, holding an ornate glowing white jade abacus, icy violet mist swirling around her fingertips, dangerously intelligent seductive smile, falling snowflakes, luxury fantasy interior, highly detailed, dramatic lighting, 8k resolution, vertical 9:16 portrait`
      },
      {
        name: "Vương Đằng",
        role: "Nhị thiếu gia Vạn Kim Thương Hội / Phản diện giai đoạn 1",
        aliases: "Vương nhị thiếu, Vương thiếu gia, Vương Đằng",
        description: `22 tuổi, dáng người hơi đẫy đà, mặc áo gấm dát vàng phô trương, trên mười ngón tay đeo đầy nhẫn ngọc linh thạch phát sáng. Gương mặt mang nét ngạo mạn, mắt hẹp dài đầy vẻ khinh khỉnh và thâm độc.`,
        visualPrompt: `masterpiece, manhwa art style, 1boy, Wang Deng, 22 years old, arrogant wealthy merchant young master, wearing opulent gold-trimmed green silk robes with jade pendants, fingers adorned with glowing magic gemstone rings, haughty sneering expression, holding a golden folding fan, lavish black market auction background, volumetric lighting, 8k resolution, vertical 9:16 portrait`
      },
      {
        name: "Vương Chấn Thiên",
        role: "Phân Hội Trưởng Vạn Kim Thương Hội tại Hắc Nham Thành / Cự đầu Kim Đan Kỳ",
        aliases: "Vương hội trưởng, Lão tặc họ Vương, Vương Chấn Thiên",
        description: `Lão giả mặc hoàng kim mãng bào, râu tóc dựng ngược, trên người tỏa ra uy áp Kim Đan Kỳ sơ kỳ cuồn cuộn như biển lửa. Tàn nhẫn, độc đoán, sẵn sàng tàn sát đối thủ để độc chiếm thương lộ.`,
        visualPrompt: `masterpiece, manhwa art style, 1man, 58 years old ruthless tycoon grandmaster, golden dragon-embroidered robes, flaming golden aura, fierce glowing eyes, towering powerful presence, mountain palace background, dramatic cinematic lighting, 8k resolution, vertical 9:16 portrait`
      }
    ],
    "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong": [
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
    ],
    "ta-sinh-ra-la-phan-dien": [
      {
        name: "Ninh Huyền Dạ",
        role: "Nhân vật chính / Thiếu Chủ Cổ Tộc Vô Cực / Boss Phản Diện Số Mệnh",
        aliases: "Ninh Dạ, Vô Cực Thiếu Chủ, Tiên Tông Thần Tử, Ninh sư huynh",
        description: `Thiếu chủ thần tộc cổ xưa mang phong thái trích tiên tuyệt mỹ, bạch y thêu chỉ vàng mây bay lộng lẫy, mái tóc đen mượt mà xõa ngang vai, đôi mắt thâm sâu như trời đêm huyền bí chứa đựng nụ cười mỉm ôn hòa nhưng lạnh lùng thấu xương. Thân mang bội ngọc cổ khắc phù văn Thái Sơ, tay cầm quạt ngọc hoặc linh kiếm bạch kim.`,
        visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1boy, 20 years old handsome immortal young master villain, breathtaking ethereal facial features, long silky black hair flowing with gentle breeze, piercing dark obsidian eyes with subtle glowing golden rune reflection, polite charismatic yet cold calculating smirk, wearing ultra-luxurious white and gold embroidered silk hanfu robes with high collar, standing on a floating celestial jade pagoda balcony overlooking mist-shrouded mountain peaks, floating ancient golden glyphs, dramatic volumetric lighting, cinematic photography --ar 9:16 --v 6.0`
      },
      {
        name: "Cố Thanh Tuyết",
        role: "Đại sư tỷ Thái Sơ Tiên Tông / Thần Nữ Băng Tâm",
        aliases: "Băng Tâm Kiếm Tiên, Thanh Tuyết sư tỷ, Nữ Thần Tuyết Sơn",
        description: `Đại sư tỷ thanh lãnh vô song của Tiên Tông, thân mang sương tuyết hà y màu lam nhạt, làn da trắng như tuyết đầu mùa, đôi mắt trong veo như ngọc bích tỏa ra hàn khí Băng Tâm. Cầm thanh trường kiếm cổ sương lam sắc bén, khí chất tiên tử thanh khiết bất khả xâm phạm.`,
        visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1girl, 20 years old peerless ice sword goddess, long jet-black hair tied with silver hairpin, crystal clear icy-blue eyes, stoic graceful cold expression, wearing delicate pastel blue and silver silk cultivation robes with snowflake embroidery, holding a glowing translucent ice broadsword radiating frost mist, snowy mountain peak sanctuary background, gentle falling snowflakes, elegant anime fantasy --ar 9:16 --v 6.0`
      },
      {
        name: "Lâm Phàm",
        role: "Khí Vận Chi Tử / Thiếu niên quật khởi từ bụi rậm",
        aliases: "Lâm Phàm, Khí Vận Chi Tử, Kẻ Được Chọn",
        description: `Thiếu niên kiên nghị, áo vải thô màu đen, ánh mắt bướng bỉnh bất khuất mang theo chấp niệm sâu sắc. Trên ngón tay trỏ đeo một chiếc nhẫn sắt cổ rỉ sét chứa tàn hồn của Lạc Lão.`,
        visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1boy, 17 years old determined protagonist youth, spiky messy black hair, fierce glowing golden eyes full of defiance, wearing ragged black and dark red linen warrior clothes with cloth bandages on forearms, worn rusty iron ring on right pointer finger, clenching fist with blazing red flame aura, rocky wasteland duel arena background, gritty anime fantasy --ar 9:16 --v 6.0`
      },
      {
        name: "Dạ U",
        role: "Thủ lĩnh Vô Cực Hắc Ám Ám Vệ / Ảnh Vệ trung thành",
        aliases: "Dạ U, Ám Vệ Đội Trưởng, Bóng Ma Thần Tộc",
        description: `Ảnh vệ tuyệt đối trung thành giấu mặt sau chiếc mặt nạ bạc điêu khắc hoa văn rồng đen, mặc hắc y bó sát thêu phù văn ẩn thân. Luôn ẩn mình trong bóng tối sau lưng Ninh Huyền Dạ.`,
        visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1man, shadowy assassin shadow guard, silver dragon half-mask covering upper face, glowing cold dark eyes, sleek black stealth shinobi attire with dark silver plates, holding a curved jet-black shadow blade, merging into the dark misty shadows behind a palace pillar --ar 9:16 --v 6.0`
      },
      {
        name: "Lạc Lão",
        role: "Tàn hồn Luyện Đan Tông Sư Viễn Cổ / Lão tổ trong nhẫn",
        aliases: "Lạc Thiên Thu, Lão tổ Lạc Lão, Lão quỷ trong nhẫn",
        description: `Linh hồn thể trong suốt mờ ảo của danh sư luyện đan thời Thượng Cổ, râu tóc bạc phơ, ánh mắt tràn ngập vẻ thông thái nhưng thận trọng thực dụng. Từng là danh sư vạn người kính ngưỡng bị kẻ thù ám toán phải ký thác vào Hắc Diễm Cổ Giới.`,
        visualPrompt: `masterpiece, ultra-detailed 8k, manhwa webtoon artstyle, 1old man, translucent spiritual ethereal apparition of an ancient grandmaster sage, long flowing white beard and hair, glowing celestial cyan eyes filled with ancient wisdom and caution, translucent glowing robes fading into mist, floating in the air above an ancient ring, alchemy furnace spiritual aura background --ar 9:16 --v 6.0`
      }
    ]
  };

  const defaultCharacters = NOVEL_CHARACTERS[novelSlug] || [];

  // Auto-detect avatar image with ANY extension (.png, .jpg, .webp, .jpeg, .avif)
  const charactersToSync = defaultCharacters.map(char => {
    const detectedAvatar = findCharacterAvatar(novelSlug, char.name, char.aliases);
    const slugName = char.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-");
    return {
      ...char,
      avatarUrl: detectedAvatar || `/characters/${novelSlug}/${slugName}.jpg`
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

  // 3. Sync Lores from master_codex.md (both dynamic table and predefined)
  const NOVEL_LORES: Record<string, any[]> = {
    "van-co-de-nhat-thuong-minh": [
      {
        term: "Thiên Cơ Định Giá Nhãn",
        category: "Bí Thuật",
        aliases: "Định Giá Nhãn, Thiên Cơ Thần Nhãn",
        definition: "Thần nhãn cổ đại cho phép người sở hữu nhìn thấu bản chất, giá trị thực, khiếm khuyết và xu hướng biến động giá của mọi vật phẩm trong trời đất."
      },
      {
        term: "Cửu U Băng Phách Độc",
        category: "Độc Dược",
        aliases: "Cửu U Hàn Độc, Băng Phách Độc",
        definition: "Loại hàn độc âm tà bậc nhất Trung Châu, thấm sâu vào tủy xương làm đông cứng linh lực, mỗi đêm trăng tròn đau đớn như bị ngàn lưỡi băng nghiền nát."
      },
      {
        term: "Tàn Kiếm Xích Tiêu",
        category: "Bảo Vật",
        aliases: "Xích Tiêu Kiếm, Xích Tiêu Long Kiếm",
        definition: "Thanh kiếm cổ gỉ sét mang hình dạng phế phẩm nhưng bên trong phong ấn một sợi Long Hồn Thượng Cổ chí dương của Hỏa Long Tông thất truyền ba ngàn năm trước."
      },
      {
        term: "Bàn Tính Bạch Ngọc Cửu Cung",
        category: "Bảo Vật",
        aliases: "Bạch Ngọc Bàn Tính, Bàn tính Thẩm gia",
        definition: "Bảo vật gia truyền của Thẩm gia, có khả năng diễn toán biến động ngân lượng và dò tìm huyết mạch kinh tế của tông môn."
      },
      {
        term: "Vạn Kim Thương Hội",
        category: "Thế Lực",
        aliases: "Vạn Kim Hội, Vạn Kim",
        definition: "Tập đoàn tài phiệt khổng lồ phủ sóng khắp Đông Hoang, nổi tiếng với phong cách kinh doanh tàn nhẫn, thôn tính đối thủ bằng cho vay nặng lãi và ám sát."
      },
      {
        term: "Hắc Nham Hắc Thị",
        category: "Địa Danh",
        aliases: "Hắc Thị, Chợ đen ngầm",
        definition: "Khu chợ đen ngầm nằm sâu dưới lòng Hắc Nham Thành, nơi diễn ra các giao dịch phi pháp, đồ trộm cướp và tàn tích thượng cổ không rõ nguồn gốc."
      },
      {
        term: "Cửu Dương Huyết Linh Chi",
        category: "Dược Liệu",
        aliases: "Huyết Linh Chi, Cửu Dương Linh Chi",
        definition: "Linh chi sinh trưởng tại miệng núi lửa ngàn năm, mang hỏa tính cực hạn, là dược liệu chủ chốt áp chế Cửu U Hàn Độc và khai thông kinh mạch."
      },
      {
        term: "Thiên Cơ Linh Phiếu",
        category: "Khái Niệm",
        aliases: "Linh Phiếu, Tín Phiếu Thiên Cơ",
        definition: "Tín phiếu nợ do Cố gia phát hành, mở đầu cho kỷ nguyên tiền tệ bảo chứng linh thạch đầu tiên tại Đông Hoang."
      }
    ],
    "tam-cong-tu-rac-ruoi-cua-gia-toc-bang-suong": [
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
    ],
    "ta-sinh-ra-la-phan-dien": [
      {
        term: "Khí Vận Chi Tử",
        category: "Khái Niệm",
        aliases: "Nhân vật chính, Thiên Mệnh Chi Tử, Đứa con của trời",
        definition: "Kẻ được Thiên Đạo thiên vị tuyệt đối trong trò chơi, sở hữu may mắn phi logic, nhảy vực nhặt bí kíp, gặp nguy hóa an, mỹ nhân chủ động yêu thương."
      },
      {
        term: "Cổ Tộc Vô Cực",
        category: "Thế Lực",
        aliases: "Vô Cực Cổ Gia, Vô Cực Thần Tộc",
        definition: "Thế gia Thượng Cổ thần bí hùng mạnh nhất Cửu Thiên Vực, sở hữu huyết mạch Thái Sơ Đạo Cốt và nắm giữ cấm kỵ pháp tắc vạn giới."
      },
      {
        term: "Thái Sơ Tiên Tông",
        category: "Thế Lực",
        aliases: "Thái Sơ Tông, Nam Minh Đệ Nhất Môn",
        definition: "Đệ nhất Tiên môn danh môn chính phái cai quản toàn bộ Nam Minh Cảnh Giới ở hạ giới với vạn năm truyền thừa."
      },
      {
        term: "Hắc Diễm Cổ Giới",
        category: "Bảo Vật",
        aliases: "Nhẫn đen, Nhẫn sắt Lão tổ",
        definition: "Chiếc nhẫn sắt đen cổ kính chứa tàn hồn luyện đan đại tông sư Hóa Thần Cảnh Lạc Thiên Thu – kim thủ chỉ khởi đầu của Lâm Phàm."
      },
      {
        term: "Cửu Giới Tru Tiên Lục",
        category: "Khái Niệm",
        aliases: "Tru Tiên Lục, Trò chơi Cửu Giới",
        definition: "Tựa game nhập vai tu tiên độ khó siêu ác mộng mà Ninh Huyền Dạ từng phá đảo 100% trước khi xuyên không vào thân xác Boss phản diện."
      },
      {
        term: "Thôn Thiên Ma Điển",
        category: "Bí Thuật",
        aliases: "Thôn Thiên Quyết, Cấm Thuật Thôn Phệ",
        definition: "Môn cấm thuật viễn cổ tuyệt mật có khả năng cắn nuốt căn cốt, dị hỏa và khí vận của thiên tài khác để bồi dưỡng bản thân."
      },
      {
        term: "Băng Tâm Kiếm Thể",
        category: "Căn Cốt",
        aliases: "Băng Tâm Thể, Băng Tâm Kiếm Khí",
        definition: "Thể chất thần thánh ngàn năm khó gặp của Cố Thanh Tuyết, giúp tu luyện kiếm đạo ngưng băng vạn dặm nhưng dễ bị tẩu hỏa nhập ma nếu tâm cảnh bất an."
      },
      {
        term: "Cổ Thần Bí Cảnh",
        category: "Địa Danh",
        aliases: "Bí Cảnh Ma Tôn, Mộ Cổ Ma Tôn",
        definition: "Tiểu thế giới cổ xưa hình thành từ thi hài của Ma Tôn Viễn Cổ rơi xuống hạ giới, nơi chứa nhiều thảo dược ngàn năm và ma thú nguy hiểm."
      }
    ]
  };

  const dynamicLores = parseDynamicLores(codexContent);
  const presetLores = NOVEL_LORES[novelSlug] || [];
  
  // Merge and deduplicate by term
  const loresMap = new Map<string, any>();
  presetLores.forEach(l => loresMap.set(l.term.toLowerCase(), l));
  dynamicLores.forEach(l => {
    if (!loresMap.has(l.term.toLowerCase())) {
      loresMap.set(l.term.toLowerCase(), l);
    }
  });

  const finalLores = Array.from(loresMap.values());

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
