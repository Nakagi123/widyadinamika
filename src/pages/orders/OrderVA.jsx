import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Building2, Clock, Copy, CheckCheck, Home, RefreshCw } from "lucide-react";

function OrderVA() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;

  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown
  const [isExpired, setIsExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth");
    if (!order) navigate("/");
  }, [isLoggedIn, order, navigate]);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!order?.orderId) return;

    pollRef.current = setInterval(async () => {
    }, 3000);

    return () => clearInterval(pollRef.current);
  }, [order, navigate]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  if (!isLoggedIn || !order) return null;

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleCopy = () => {
    navigator.clipboard.writeText(order.vaNumber || "1234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bankColors = {
    BCA: "bg-blue-100 text-blue-700",
    BNI: "bg-orange-100 text-orange-700",
    BRI: "bg-blue-100 text-blue-800",
    Mandiri: "bg-yellow-100 text-yellow-700",
    Permata: "bg-red-100 text-red-700",
  };

  const steps = [
    `Buka aplikasi mobile banking ${order.bank || ""}`,
    "Pilih menu Transfer → Virtual Account",
    "Masukkan nomor Virtual Account di bawah",
    `Masukkan nominal Rp ${order.total?.toLocaleString("id-ID")}`,
    "Periksa detail transaksi dan konfirmasi pembayaran",
    "Simpan bukti pembayaran",
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Transfer Virtual Account</h1>
          <p className="text-sm text-gray-400 text-center">
            Transfer ke nomor Virtual Account di bawah untuk menyelesaikan pembayaran
          </p>
        </div>

        {/* VA Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">

          {isExpired ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-base font-bold text-gray-900">Virtual Account Kedaluwarsa</p>
              <p className="text-sm text-gray-400 text-center">
                Waktu pembayaran habis. Silakan buat pesanan baru.
              </p>
              <Link
                to="/products"
                className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                Kembali ke Toko
              </Link>
            </div>
          ) : (
            <>
              {/* Bank Badge */}
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-500" />
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${bankColors[order.bank] || "bg-gray-100 text-gray-600"}`}>
                  {order.bank || "Bank"}
                </span>
              </div>

              {/* VA Number */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400">Nomor Virtual Account</p>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <p className="text-xl font-bold text-gray-900 tracking-widest">
                    {order.vaNumber || "1234567890"}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    {copied
                      ? <><CheckCheck className="w-4 h-4 text-green-500" /> Disalin</>
                      : <><Copy className="w-4 h-4" /> Salin</>
                    }
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400">Jumlah Transfer</p>
                <div className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                  <p className="text-xl font-bold text-violet-600">
                    Rp {order.total?.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="text-xs text-red-400 mt-1">
                  ⚠️ Transfer sesuai nominal di atas. Lebih atau kurang akan otomatis ditolak.
                </p>
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-center gap-2 text-gray-500 border-t border-gray-100 pt-3">
                <Clock className="w-4 h-4" />
                <p className="text-sm">
                  Berlaku selama{" "}
                  <span className={`font-bold ${timeLeft <= 300 ? "text-red-500" : "text-violet-600"}`}>
                    {hours}:{minutes}:{seconds}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-sm font-bold text-gray-900">{order.orderId}</p>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-sm font-bold text-violet-600">
              Rp {order.total?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900">Cara Pembayaran</h2>
          <ol className="flex flex-col gap-3">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-600">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Menunggu pembayaran...</span>
        </div>

        {/* Back to home */}
        <Link
          to="/"
          className="w-full py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl text-center hover:border-violet-300 hover:text-violet-500 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

      </div>
    </div>
  );
}

export default OrderVA;