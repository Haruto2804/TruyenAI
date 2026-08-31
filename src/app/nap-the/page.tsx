import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

// Tỷ giá: 10,000 VNĐ = 1,000 Linh Thạch
const PACKAGES = [
  { price: 10000, linhThach: 1000, bonus: 0 },
  { price: 20000, linhThach: 2000, bonus: 100 },
  { price: 50000, linhThach: 5000, bonus: 500 },
  { price: 100000, linhThach: 10000, bonus: 1500 },
];

// THAY ĐỔI CÁC THÔNG TIN NÀY BẰNG TÀI KHOẢN NGÂN HÀNG CỦA BẠN
const BANK_BIN = "970436"; // Mã BIN ngân hàng (vd Vietcombank là 970436)
const BANK_ACCOUNT = "0123456789";
const ACCOUNT_NAME = "NGUYEN VAN A";

export default async function TopupPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/");
  }

  const userId = session.user.id || "USER";
  const linhThach = (session.user as any).linhThach || 0;

  // Cú pháp chuyển khoản tự động
  const transferSyntax = `NAP ${userId.substring(0, 8).toUpperCase()}`;

  // Mã VietQR cho gói nạp tuỳ ý (hoặc mặc định 50k)
  const qrUrl = `https://img.vietqr.io/image/${BANK_BIN}-${BANK_ACCOUNT}-compact2.png?amount=50000&addInfo=${transferSyntax}&accountName=${ACCOUNT_NAME}`;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-28 sm:pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-slate-900 p-8 text-center border-b border-slate-800">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 mb-2">
            Tụ Linh Trận (Nạp Linh Thạch)
          </h1>
          <p className="text-slate-400 text-sm">
            Nạp linh thạch để ủng hộ tác giả, mua chương VIP và đổi khung Avatar.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
            <span className="text-slate-300 text-sm">Số dư hiện tại:</span>
            <span className="text-xl font-bold text-amber-400">{linhThach} 💎</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Cột 1: Bảng giá */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">1</span>
              Chọn mệnh giá
            </h2>
            <div className="space-y-3">
              {PACKAGES.map((pkg, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-700 bg-slate-800/30 hover:border-amber-500/50 hover:bg-slate-800/80 transition-colors cursor-pointer group"
                >
                  <div>
                    <div className="font-bold text-amber-400 text-lg">
                      {pkg.linhThach.toLocaleString()} <span className="text-sm">💎</span>
                    </div>
                    {pkg.bonus > 0 && (
                      <div className="text-xs font-medium text-emerald-400 bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full mt-1">
                        + {pkg.bonus} thưởng
                      </div>
                    )}
                  </div>
                  <div className="text-slate-200 font-semibold bg-slate-700/50 group-hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors">
                    {pkg.price.toLocaleString()} VNĐ
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-blue-900/20 border border-blue-900/50">
              <p className="text-sm text-blue-200 leading-relaxed">
                <strong className="text-blue-400">Tỷ giá cơ bản:</strong> 10.000đ = 1.000 Linh Thạch.<br/>
                Bạn có thể nạp số tiền bất kỳ, hệ thống sẽ tự động quy đổi và cộng thêm phần thưởng (nếu có).
              </p>
            </div>
          </div>

          {/* Cột 2: Quét mã QR */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">2</span>
              Quét mã thanh toán
            </h2>
            
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                {/* Decorative element */}
                <div className="w-24 h-24 border-[4px] border-amber-400 rounded-full" />
              </div>

              <div className="bg-white p-3 rounded-xl shadow-lg mb-6 z-10 relative">
                <Image 
                  src={qrUrl} 
                  alt="VietQR Topup" 
                  width={220} 
                  height={220}
                  className="rounded-lg"
                  unoptimized // API trả về ảnh động nên không dùng optimize của Next
                />
              </div>

              <div className="w-full space-y-4 z-10 relative">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Nội dung chuyển khoản (Bắt buộc ghi đúng):</div>
                  <div className="font-mono text-xl font-bold text-emerald-400 text-center tracking-widest bg-slate-950 py-2 rounded border border-slate-800">
                    {transferSyntax}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-slate-400 mt-2">
                    Linh thạch sẽ tự động được cộng vào tài khoản trong vòng <strong className="text-amber-400">5-10 giây</strong> sau khi chuyển khoản thành công.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
