"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, Check } from "lucide-react";

interface ImageUploadProps {
  initialValue?: string;
  name?: string;
  onChange?: (url: string) => void;
}

export function ImageUpload({ initialValue = "", name = "coverUrl", onChange }: ImageUploadProps) {
  const [url, setUrl] = useState<string>(initialValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [directUrl, setDirectUrl] = useState<string>(initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file hình ảnh (JPG, PNG, WEBP, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Dung lượng ảnh tối đa là 10MB.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setUrl(data.url);
        setDirectUrl(data.url);
        if (onChange) onChange(data.url);
      } else {
        setError(data.error || "Tải ảnh thất bại.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra trong quá trình tải ảnh.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDirectUrlApply = () => {
    if (!directUrl.trim()) return;
    setUrl(directUrl.trim());
    if (onChange) onChange(directUrl.trim());
  };

  const handleRemove = () => {
    setUrl("");
    setDirectUrl("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange("");
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to pass value into Server Actions Form */}
      <input type="hidden" name={name} value={url} />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("file")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === "file"
              ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Tải File Lên
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === "url"
              ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Nhập URL Trực Tiếp
        </button>
      </div>

      {/* Tab 1: Upload via Cloudinary */}
      {activeTab === "file" && !url && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-[#d4af37] bg-[#d4af37]/10"
              : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            {loading ? (
              <div className="flex flex-col items-center space-y-2 py-4">
                <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
                <p className="text-sm font-medium text-amber-200">Đang tải ảnh lên Cloudinary...</p>
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#d4af37]">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">
                    Nhấp để tải ảnh lên hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ JPG, PNG, WEBP, GIF (Tối đa 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Direct URL Input */}
      {activeTab === "url" && !url && (
        <div className="flex gap-2">
          <input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/... hoặc link ảnh bất kỳ"
            className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60"
          />
          <button
            type="button"
            onClick={handleDirectUrlApply}
            className="bg-[#d4af37] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center gap-1 shrink-0"
          >
            <Check className="w-4 h-4" /> Áp Dụng
          </button>
        </div>
      )}

      {/* Preview Card */}
      {url && (
        <div className="relative flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
            <img src={url} alt="Cover Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <Check className="w-3 h-3" /> Đã tải lên thành công
            </div>
            <p className="text-xs text-slate-400 truncate font-mono">{url}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
            title="Xóa ảnh này"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs font-medium text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          {error}
        </p>
      )}
    </div>
  );
}
