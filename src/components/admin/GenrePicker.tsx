"use client";

import { useState } from "react";
import { Check, Plus, Tag } from "lucide-react";

interface GenreOption {
  id: string;
  name: string;
  slug: string;
}

interface GenrePickerProps {
  availableGenres: GenreOption[];
  initialValue?: string | null;
  name?: string;
}

export function GenrePicker({
  availableGenres,
  initialValue = "",
  name = "genre",
}: GenrePickerProps) {
  // Parse initialValue into set of names
  const initialSet = new Set(
    (initialValue || "")
      .split(/[,/|]+/)
      .map((g) => g.trim())
      .filter(Boolean)
  );

  const [selected, setSelected] = useState<string[]>(Array.from(initialSet));

  const toggleGenre = (genreName: string) => {
    setSelected((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    );
  };

  const hiddenValue = selected.join(", ");

  return (
    <div className="space-y-3">
      {/* Hidden input to pass data through form submission */}
      <input type="hidden" name={name} value={hiddenValue} />

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Chọn thể loại (Đã chọn: <strong className="text-amber-300 font-bold">{selected.length}</strong>)</span>
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected([])}
            className="text-[11px] text-slate-400 hover:text-rose-300 underline cursor-pointer"
          >
            Bỏ chọn tất cả
          </button>
        )}
      </div>

      {/* Selectable Genre Pills */}
      <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[50px]">
        {availableGenres.map((g) => {
          const isSelected = selected.includes(g.name);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => toggleGenre(g.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 shadow-md shadow-[#d4af37]/25 border border-[#d4af37]"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              {isSelected ? (
                <Check className="w-3 h-3 stroke-[3]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              )}
              <span>{g.name}</span>
            </button>
          );
        })}
      </div>

      {/* Preview selected tag list */}
      {selected.length > 0 && (
        <div className="text-[11px] text-slate-400">
          <span>Chuỗi thể loại: </span>
          <span className="text-amber-200/90 font-mono font-medium">{hiddenValue}</span>
        </div>
      )}
    </div>
  );
}
