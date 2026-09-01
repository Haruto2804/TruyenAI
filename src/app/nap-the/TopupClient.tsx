"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, Sparkles, Gem, ShieldCheck, QrCode } from "lucide-react";

// Tỷ giá: 10,000 VNĐ = 1,000 Linh Thạch
const PACKAGES = [
  { price: 10000, linhThach: 1000, bonus: 0 },
  { price: 20000, linhThach: 2000, bonus: 100 },
  { price: 50000, linhThach: 5000, bonus: 500 },
  { price: 100000, linhThach: 10000, bonus: 1500 },
];

const BANK_BIN = "970436"; // Mã BIN ngân hàng Vietcombank/Vietin/MB...
const BANK_NAME = "MBBank (Ngân Hàng Quân Đội)";
const BANK_ACCOUNT = "1041230020";
const ACCOUNT_NAME = "NGO LUU GIA BAO";

export default function TopupClient({ userId, linhThach }: { userId: string, linhThach: number }) {
  const [selectedAmount, setSelectedAmount] = useState(50000);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Cú pháp chuyển khoản tự động
  const transferSyntax = `NAP ${userId.substring(0, 8).toUpperCase()}`;

  // Mã VietQR tự động cập nhật theo số tiền đã chọn
  const qrUrl = `https://img.vietqr.io/image/${BANK_BIN}-${BANK_ACCOUNT}-compact2.png?amount=${selectedAmount}&addInfo=${transferSyntax}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-hidden">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/30 p-4 sm:p-8 text-center border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Tụ Linh Trận Tự Động 24/7
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 mb-2">
            Nạp Linh Thạch Thần Tốc
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Nạp linh thạch tự động qua quét mã VietQR để mở khóa chương VIP và nhận danh hiệu đặc quyền.
          </p>

          <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 bg-black/40 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-slate-400 text-xs sm:text-sm">Số dư hiện tại:</span>
            <span className="text-base sm:text-xl font-extrabold text-amber-400 flex items-center gap-1">
              {linhThach.toLocaleString()} <Gem className="w-4 h-4 text-cyan-400" />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 p-3.5 xs:p-5 sm:p-8">
          {/* Cột 1: Bảng giá */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center text-xs font-bold border border-[#d4af37]/30">
                1
              </span>
              <span>Chọn Gói Linh Thạch</span>
            </h2>

            <div className="space-y-3">
              {PACKAGES.map((pkg, idx) => {
                const isSelected = selectedAmount === pkg.price;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedAmount(pkg.price)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none min-h-[54px] ${
                      isSelected 
                        ? "border-[#d4af37] bg-[#d4af37]/15 shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                        : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-amber-300 text-base sm:text-lg flex items-center gap-1.5">
                        {pkg.linhThach.toLocaleString()} <span className="text-xs text-amber-400/80">Linh Thạch</span>
                      </div>
                      {pkg.bonus > 0 && (
                        <div className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full mt-1 border border-emerald-400/20">
                          + {pkg.bonus.toLocaleString()} Thưởng Thêm
                        </div>
                      )}
                    </div>

                    <div className={`font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-[#d4af37] to-amber-400 text-slate-950 shadow-md"
                        : "text-slate-200 bg-white/10"
                    }`}>
                      {pkg.price.toLocaleString()} đ
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-1 text-xs text-cyan-200/90 leading-relaxed">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Tỷ giá quy đổi: 10.000 VNĐ = 1.000 Linh Thạch
              </div>
              <p className="text-slate-400 text-[11px]">
                Hệ thống ngân hàng SePay quét giao dịch liên tục và tự động kích hoạt tài khoản trong 3-5 giây.
              </p>
            </div>
          </div>

          {/* Cột 2: Quét mã QR */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
                2
              </span>
              <span>Quét Mã Thanh Toán VietQR</span>
            </h2>

            <div className="bg-black/50 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center relative overflow-hidden space-y-5">
              {/* QR Image Container */}
              <div className="bg-white p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative group">
                <Image
                  src={qrUrl}
                  alt="VietQR Topup"
                  width={210}
                  height={210}
                  className="rounded-xl"
                  unoptimized
                />
              </div>

              {/* Transfer Details Card with One-Tap Copy */}
              <div className="w-full space-y-3">
                {/* Syntax Row */}
                <div className="bg-slate-950 border border-white/10 p-3.5 rounded-xl space-y-1.5">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Nội Dung Chuyển Khoản:</span>
                    <span className="text-amber-400 font-bold">{selectedAmount.toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-black/60 p-2 rounded-lg border border-white/5">
                    <span className="font-mono text-base sm:text-lg font-extrabold text-emerald-400 tracking-wider truncate">
                      {transferSyntax}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(transferSyntax, "syntax")}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      {copiedField === "syntax" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Number Row */}
                <div className="bg-slate-950 border border-white/10 p-3.5 rounded-xl space-y-1.5">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Số Tài Khoản:</span>
                    <span className="text-slate-300 font-medium">{BANK_NAME}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-black/60 p-2 rounded-lg border border-white/5">
                    <span className="font-mono text-base font-bold text-slate-100 tracking-wider">
                      {BANK_ACCOUNT}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_ACCOUNT, "account")}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                    >
                      {copiedField === "account" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-400">
                    Chủ tài khoản: <strong className="text-slate-200">{ACCOUNT_NAME}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
