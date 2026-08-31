"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Sparkles, User, X, ZoomIn, Shield, Scroll, Tag, 
  ChevronRight, ChevronLeft, Maximize2, FileText,
  Eye, GitFork, HeartHandshake, Swords, Users, UserCheck
} from "lucide-react";

export interface CharacterItem {
  id: string;
  name: string;
  aliases: string | null;
  role: string | null;
  avatarUrl: string | null;
  description: string | null;
}

interface CharacterGalleryProps {
  characters: CharacterItem[];
}

export interface CharacterRelation {
  targetName: string;
  relationType: "ALLY" | "ENEMY" | "KINSHIP" | "PUPPET" | "COMPLEX";
  label: string;
  description: string;
}

const RELATION_BADGES: Record<string, { label: string, color: string, border: string, bg: string, icon: any }> = {
  ALLY: {
    label: "Đồng Minh",
    color: "text-emerald-300",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/15",
    icon: HeartHandshake
  },
  ENEMY: {
    label: "Đối Địch / Kẻ Thù",
    color: "text-rose-300",
    border: "border-rose-500/40",
    bg: "bg-rose-500/15",
    icon: Swords
  },
  KINSHIP: {
    label: "Huyết Thống / Tỷ Đệ",
    color: "text-amber-300",
    border: "border-amber-500/40",
    bg: "bg-amber-500/15",
    icon: Users
  },
  PUPPET: {
    label: "Thao Túng / Nội Gián",
    color: "text-cyan-300",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/15",
    icon: UserCheck
  },
  COMPLEX: {
    label: "Ân Oán Phức Tạp",
    color: "text-purple-300",
    border: "border-purple-500/40",
    bg: "bg-purple-500/15",
    icon: GitFork
  }
};

const CHARACTER_RELATIONS: Record<string, CharacterRelation[]> = {
  "Caelen Von Ravenwood": [
    {
      targetName: "Lilian",
      relationType: "PUPPET",
      label: "Chủ Nhân & Gián Điệp Ngầm",
      description: "Sau khi bị Caelen bẻ khớp tay và phát giác độc Hắc Tử La Lan, Lilian đã thần phục và trở thành tai mắt nội gián ngầm theo dõi Nhị Trưởng Lão Karlov."
    },
    {
      targetName: "Evelyn Von Ravenwood",
      relationType: "KINSHIP",
      label: "Tỷ Đệ Ruột Thịt",
      description: "Tỷ tỷ ruột của Caelen, Kiếm Vương Bắc Cảnh. Bề ngoài nghiêm khắc lạnh lùng trước sự sa đọa giả tạo của em trai, nhưng nội tâm luôn bảo bọc dòng máu Ravenwood."
    },
    {
      targetName: "Valerie De Valois",
      relationType: "ENEMY",
      label: "Vị Hôn Thê Đối Địch / Tử Địch Chính Trị",
      description: "Tam Công Chúa Solaria mang theo Huyết Chiếu Hoàng Gia đến Bắc Cảnh để công khai phế hôn và lập mưu đày Caelen ra Tiền Tuyến làm vật tế thần."
    }
  ],
  "Lilian": [
    {
      targetName: "Caelen Von Ravenwood",
      relationType: "PUPPET",
      label: "Chủ Nhân Bí Mật",
      description: "Từng là nội gián hạ độc của Nhị Trưởng Lão, nay hoàn toàn quy phục và nằm dưới quyền sinh sát bí mật của Caelen."
    },
    {
      targetName: "Valerie De Valois",
      relationType: "ENEMY",
      label: "Áp Lực Quyền Uy",
      description: "Công chúa Valerie và Nhị Trưởng Lão gián tiếp gây sức ép đày ải hạ nhân Bắc Cảnh để phục vụ mưu đồ chính trị."
    }
  ],
  "Evelyn Von Ravenwood": [
    {
      targetName: "Caelen Von Ravenwood",
      relationType: "KINSHIP",
      label: "Đệ Đệ Cần Khảo Nghiệm",
      description: "Chỉ huy Đội Quân Thiết Kỵ Băng Sương. Sẽ lập tức đứng ra bảo vệ Caelen nếu hắn chứng minh được năng lực phục hưng gia tộc."
    },
    {
      targetName: "Valerie De Valois",
      relationType: "ENEMY",
      label: "Xung Đột Vương Quyền",
      description: "Tuyệt đối không dung thứ cho sự sỉ nhục từ Hoàng gia Solaria đối với tôn nghiêm của Đại Gia Tộc Bắc Cảnh."
    }
  ],
  "Valerie De Valois": [
    {
      targetName: "Caelen Von Ravenwood",
      relationType: "ENEMY",
      label: "Vật Tế Thần Chính Trị",
      description: "Muốn biến Caelen thành cái cớ để hủy hôn ước và mở đường cho Thần Điện Quang Minh can thiệp sâu vào Bắc Cảnh."
    },
    {
      targetName: "Evelyn Von Ravenwood",
      relationType: "ENEMY",
      label: "Chướng Ngại Vật Quân Sự",
      description: "Coi Nữ Kiếm Vương Evelyn là đối thủ quân sự lớn nhất tại phương Bắc cần bị cô lập."
    }
  ]
};

function renderFormattedDescription(desc: string | null) {
  if (!desc) return <p className="text-xs text-slate-500 italic py-4">Chưa có tóm tắt cho nhân vật này.</p>;

  // Split by double newline for paragraphs
  const paragraphs = desc.split(/\n\s*\n/);

  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-inner">
      {paragraphs.map((p, pIdx) => {
        const parts = p.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return (
          <p key={pIdx} className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
            {parts.map((part, idx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={idx} className="font-bold text-[#d4af37]">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*")) {
                return (
                  <em key={idx} className="italic text-amber-200/90">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export function CharacterGallery({ characters }: CharacterGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"bio" | "relations">("bio");
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedChar = selectedIndex !== null ? characters[selectedIndex] : null;

  // Find relationships for selected character
  const currentRelations: CharacterRelation[] = selectedChar
    ? CHARACTER_RELATIONS[selectedChar.name] || []
    : [];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null || isFullscreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, isFullscreenImage]);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreenImage) {
          setIsFullscreenImage(false);
        } else {
          setSelectedIndex(null);
        }
      } else if (selectedIndex !== null && !isFullscreenImage) {
        if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : characters.length - 1));
        } else if (e.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev !== null && prev < characters.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isFullscreenImage, characters.length]);

  const handleOpenChar = (index: number) => {
    setSelectedIndex(index);
    setActiveTab("bio");
    setIsFullscreenImage(false);
  };

  const handleSwitchToCharacterName = (targetName: string) => {
    const foundIdx = characters.findIndex((c) => c.name.toLowerCase().includes(targetName.toLowerCase().split(" ")[0]));
    if (foundIdx !== -1) {
      setSelectedIndex(foundIdx);
      setActiveTab("bio");
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : characters.length - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex < characters.length - 1 ? selectedIndex + 1 : 0);
    }
  };

  if (!characters || characters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 sm:pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 bg-[#d4af37]/15 rounded-xl text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span>Hồ Sơ Nhân Vật</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Chân dung 9:16 • Sơ đồ mối quan hệ ân oán & Tiểu sử tương tác.
          </p>
        </div>
        <span className="text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-[#d4af37]/10 text-amber-300 border border-[#d4af37]/20 shrink-0">
          {characters.length} nhân vật
        </span>
      </div>

      {/* Responsive Cards: Horizontal Swipe Carousel on Mobile, Grid on Tablet/Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
        {characters.map((char, idx) => (
          <div
            key={char.id}
            onClick={() => handleOpenChar(idx)}
            className="w-[170px] xs:w-[190px] sm:w-auto shrink-0 snap-start group relative flex flex-col bg-slate-950/90 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[#d4af37]/70 hover:shadow-[0_15px_45px_rgba(212,175,55,0.25)] transition-all duration-300 cursor-pointer select-none"
          >
            {/* 9:16 Portrait Canvas */}
            <div className="relative w-full aspect-[9/16] overflow-hidden bg-gradient-to-b from-slate-900 to-black">
              {char.avatarUrl ? (
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 p-4 text-center">
                  <User className="w-12 h-12 text-[#d4af37]/40 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Chưa có ảnh</span>
                </div>
              )}

              {/* Multi-layered cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-95 group-hover:opacity-85 transition-opacity pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Role Badge */}
              {char.role && (
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 max-w-[90%]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-[#d4af37]/40 shadow-xl truncate">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#d4af37] shrink-0" />
                    <span className="truncate">{char.role}</span>
                  </span>
                </div>
              )}

              {/* Zoom Action Pill */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="p-1.5 rounded-lg bg-black/80 backdrop-blur-md text-[#d4af37] border border-white/20 flex items-center justify-center">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-1 sm:space-y-1.5 z-10">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#d4af37] transition-colors leading-snug truncate drop-shadow-md">
                    {char.name}
                  </h3>

                  {char.aliases && (
                    <p className="text-[10px] sm:text-[11px] text-amber-200/80 truncate font-medium">
                      {char.aliases}
                    </p>
                  )}
                </div>

                {char.description && (
                  <p className="text-[10px] sm:text-xs text-slate-300/85 line-clamp-2 leading-relaxed font-light drop-shadow">
                    {char.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] font-bold text-[#d4af37] group-hover:text-amber-300 transition-colors">
                  <span>Xem hồ sơ & quan hệ</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* ADAPTIVE DOSSIER MODAL WITH RELATIONSHIP WEB INTERACTION (PORTALED TO BODY) */}
      {/* ========================================================================= */}
      {mounted && selectedChar && !isFullscreenImage && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* ========================================================================= */}
          {/* DESKTOP SPLIT-SCREEN VIEW (>= md screens) */}
          {/* ========================================================================= */}
          <div
            className="hidden md:flex relative w-full md:max-w-5xl lg:max-w-6xl h-[84vh] bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-[#d4af37]/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Desktop */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-2xl bg-black/60 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 backdrop-blur-md transition-colors shadow-xl"
              title="Đóng (Esc)"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cột 1 (Desktop Trái): Chân dung 9:16 */}
            <div className="w-5/12 lg:w-9/20 h-full bg-black/60 border-r border-white/10 p-5 flex flex-col items-center justify-between relative shrink-0 group overflow-hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center cursor-pointer"
                title="Nhân vật trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-2xl bg-black/80 hover:bg-[#d4af37] text-white hover:text-slate-950 border border-white/20 transition-all shadow-xl items-center justify-center cursor-pointer"
                title="Nhân vật tiếp theo (Mũi tên phải)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div 
                onClick={() => setIsFullscreenImage(true)}
                className="relative flex-1 w-full max-h-[62vh] flex items-center justify-center cursor-pointer my-auto"
              >
                {selectedChar.avatarUrl ? (
                  <div className="relative h-full aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-[#d4af37]/40 group-hover:border-[#d4af37] transition-all">
                    <img
                      src={selectedChar.avatarUrl}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#d4af37] text-slate-950 text-xs font-extrabold shadow-xl">
                        <Maximize2 className="w-3.5 h-3.5" /> Phóng to HD
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full aspect-[9/16] rounded-2xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <User className="w-16 h-16 text-[#d4af37]/40 mb-2" />
                    <span className="text-xs text-slate-400">Chưa có ảnh chân dung</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400 shrink-0">
                <span>{selectedIndex! + 1} / {characters.length} nhân vật</span>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setIsFullscreenImage(true)}
                  className="text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" /> Xem ảnh gốc
                </button>
              </div>
            </div>

            {/* Cột 2 (Desktop Phải): Hồ sơ chi tiết & Sơ đồ quan hệ */}
            <div className="flex-1 p-7 md:p-8 flex flex-col justify-between overflow-y-auto space-y-5">
              <div className="space-y-4">
                {/* Header Profile Title */}
                <div>
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-extrabold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 shadow-sm mb-2.5">
                      <Shield className="w-3.5 h-3.5" />
                      {selectedChar.role}
                    </span>
                  )}
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedChar.name}
                  </h3>
                </div>

                {/* Tab Switcher: [ Tiểu Sử ] vs [ Sơ Đồ Mối Quan Hệ ] */}
                <div className="flex bg-black/50 border border-white/10 rounded-2xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("bio")}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "bio"
                        ? "bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Tiểu Sử & Tính Cách</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("relations")}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "relations"
                        ? "bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <GitFork className="w-4 h-4" />
                    <span>Mối Quan Hệ & Ân Oán ({currentRelations.length})</span>
                  </button>
                </div>

                {/* Tab 1: Biography */}
                {activeTab === "bio" && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {selectedChar.aliases && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                        <div className="text-[11px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#d4af37]" /> Biệt danh & Danh xưng
                        </div>
                        <p className="text-base text-slate-100 font-medium">
                          {selectedChar.aliases}
                        </p>
                      </div>
                    )}

                    <div className="max-h-60 overflow-y-auto pr-1">
                      {renderFormattedDescription(selectedChar.description)}
                    </div>
                  </div>
                )}

                {/* Tab 2: Relationship Web */}
                {activeTab === "relations" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {currentRelations.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-sm bg-black/20 rounded-2xl border border-white/5">
                        Chưa có thông tin mạng lưới quan hệ cho nhân vật này.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
                        {currentRelations.map((rel, rIdx) => {
                          const badge = RELATION_BADGES[rel.relationType] || RELATION_BADGES.COMPLEX;
                          const BadgeIcon = badge.icon;
                          const targetChar = characters.find(c => c.name.toLowerCase().includes(rel.targetName.toLowerCase().split(" ")[0]));

                          return (
                            <div
                              key={rIdx}
                              onClick={() => handleSwitchToCharacterName(rel.targetName)}
                              className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-[#d4af37]/60 hover:shadow-[0_4px_25px_rgba(212,175,55,0.15)] transition-all cursor-pointer group flex items-start gap-4"
                            >
                              {/* Target Avatar Mini */}
                              <div className="w-12 aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-white/15 shrink-0 relative shadow-md">
                                {targetChar?.avatarUrl ? (
                                  <img src={targetChar.avatarUrl} alt={rel.targetName} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                                    <User className="w-4 h-4" />
                                  </div>
                                )}
                              </div>

                              {/* Relation Details */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <h4 className="font-extrabold text-sm text-white group-hover:text-[#d4af37] transition-colors flex items-center gap-1.5 truncate">
                                    <span>{rel.targetName}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4af37] group-hover:translate-x-0.5 transition-all shrink-0" />
                                  </h4>

                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${badge.bg} ${badge.color} border ${badge.border} shrink-0`}>
                                    <BadgeIcon className="w-3 h-3" />
                                    <span>{rel.label}</span>
                                  </span>
                                </div>

                                <p className="text-xs text-slate-300/85 leading-relaxed font-light">
                                  {rel.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Character Switcher */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  {characters.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedIndex(i); setActiveTab("bio"); }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        i === selectedIndex
                          ? "bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-extrabold"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      {c.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-semibold transition-colors border border-white/10 shrink-0 cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COMPACT & ERGONOMIC MOBILE BOTTOM-SHEET (< md screens) */}
          {/* ========================================================================= */}
          <div
            className="md:hidden relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t border-[#d4af37]/40 rounded-t-3xl p-4 sm:p-5 shadow-[0_-15px_50px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto flex flex-col space-y-3.5 animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-1 shrink-0" />

            {/* Mobile Hero Bar: Side-by-Side (Avatar + Name/Role) */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* 9:16 Mini Avatar with Tap-to-Zoom */}
                <div
                  onClick={() => setIsFullscreenImage(true)}
                  className="group relative w-16 aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border-2 border-[#d4af37]/60 shrink-0 shadow-lg cursor-pointer active:scale-95 transition-all"
                  title="Chạm để xem ảnh toàn màn hình"
                >
                  {selectedChar.avatarUrl ? (
                    <img
                      src={selectedChar.avatarUrl}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                      <User className="w-6 h-6 text-[#d4af37]/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Name, Role & Quick Expand */}
                <div className="space-y-1 min-w-0">
                  {selectedChar.role && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#d4af37]/15 text-amber-300 border border-[#d4af37]/30 truncate max-w-full">
                      <Shield className="w-2.5 h-2.5 shrink-0 text-[#d4af37]" />
                      <span className="truncate">{selectedChar.role}</span>
                    </span>
                  )}
                  <h3 className="text-base font-extrabold text-white tracking-tight truncate leading-tight">
                    {selectedChar.name}
                  </h3>
                  {selectedChar.aliases && (
                    <p className="text-[11px] text-amber-200/80 truncate font-medium">
                      {selectedChar.aliases}
                    </p>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setIsFullscreenImage(true)}
                    className="text-[11px] font-bold text-[#d4af37] hover:text-amber-300 flex items-center gap-1 pt-0.5 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" /> Xem ảnh 9:16 HD
                  </button>
                </div>
              </div>

              {/* Close Button Mobile */}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex bg-black/50 border border-white/10 rounded-xl p-1 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("bio")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "bio"
                    ? "bg-[#d4af37] text-slate-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Tiểu Sử</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("relations")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "relations"
                    ? "bg-[#d4af37] text-slate-950 font-extrabold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Quan Hệ ({currentRelations.length})</span>
              </button>
            </div>

            {/* Mobile Tab Content */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[42vh] pr-0.5">
              {activeTab === "bio" ? (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  {selectedChar.aliases && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-0.5">
                      <div className="text-[10px] font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#d4af37]" /> Danh Xưng & Biệt Hiệu
                      </div>
                      <p className="text-xs text-slate-100 font-medium">
                        {selectedChar.aliases}
                      </p>
                    </div>
                  )}

                  {renderFormattedDescription(selectedChar.description)}
                </div>
              ) : (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  {currentRelations.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      Chưa có dữ liệu mối quan hệ cho nhân vật này.
                    </p>
                  ) : (
                    currentRelations.map((rel, rIdx) => {
                      const badge = RELATION_BADGES[rel.relationType] || RELATION_BADGES.COMPLEX;
                      const BadgeIcon = badge.icon;
                      const targetChar = characters.find(c => c.name.toLowerCase().includes(rel.targetName.toLowerCase().split(" ")[0]));

                      return (
                        <div
                          key={rIdx}
                          onClick={() => handleSwitchToCharacterName(rel.targetName)}
                          className="p-3 rounded-xl bg-black/50 border border-white/10 hover:border-[#d4af37]/60 active:scale-98 transition-all cursor-pointer flex items-start gap-3"
                        >
                          <div className="w-10 aspect-[9/16] rounded-lg overflow-hidden bg-slate-900 border border-white/15 shrink-0 relative shadow-sm">
                            {targetChar?.avatarUrl ? (
                              <img src={targetChar.avatarUrl} alt={rel.targetName} className="w-full h-full object-cover object-center" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <User className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <h4 className="font-extrabold text-xs text-white flex items-center gap-1 truncate">
                                <span>{rel.targetName}</span>
                                <ChevronRight className="w-3 h-3 text-[#d4af37]" />
                              </h4>

                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-extrabold ${badge.bg} ${badge.color} border ${badge.border} shrink-0`}>
                                <BadgeIcon className="w-2.5 h-2.5" />
                                <span>{badge.label}</span>
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                              {rel.description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Mobile Thumb Navigation (Switch Between Characters) */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {characters.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setSelectedIndex(i); setActiveTab("bio"); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      i === selectedIndex
                        ? "bg-[#d4af37] text-slate-950 shadow-md font-extrabold"
                        : "bg-white/5 text-slate-300 border border-white/5"
                    }`}
                  >
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold shrink-0"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* FULLSCREEN IMMERSIVE LIGHTBOX (PORTALED TO BODY) */}
      {mounted && selectedChar && isFullscreenImage && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsFullscreenImage(false)}
        >
          {/* Top Bar inside Fullscreen Lightbox */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none max-w-5xl mx-auto">
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 pointer-events-auto shadow-xl">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                {selectedChar.name}
                {selectedChar.role && (
                  <span className="text-xs text-amber-300 font-normal ml-1">
                    ({selectedChar.role})
                  </span>
                )}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreenImage(false)}
              className="p-3 rounded-2xl bg-black/80 hover:bg-white/20 text-white border border-white/20 transition-colors pointer-events-auto shadow-2xl"
              title="Quay lại hồ sơ (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fully Responsive 9:16 Canvas without any vertical overflow */}
          <div
            className="relative h-full max-h-[85vh] aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.35)] border-2 border-[#d4af37]/60 flex items-center justify-center bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedChar.avatarUrl ? (
              <img
                src={selectedChar.avatarUrl}
                alt={selectedChar.name}
                className="w-full h-full object-cover object-center select-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
                <User className="w-16 h-16 text-[#d4af37]/40" />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
