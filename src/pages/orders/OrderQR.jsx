import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import { Clock, RefreshCw, Home, CheckCircle } from "lucide-react";

function OrderQR() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;

  const [status, setStatus] = useState("pending"); // "pending" | "paid"
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isExpired, setIsExpired] = useState(false);
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

  // Poll backend for payment status
  useEffect(() => {
    if (!order?.orderId) return;

    pollRef.current = setInterval(async () => {
      // TODO: replace with real API call
      // const res = await fetch(`/api/orders/${order.orderId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await res.json();
      // if (data.status === "Selesai") {
      //   clearInterval(pollRef.current);
      //   navigate("/orders/success", { state: order });
      // }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(pollRef.current);
  }, [order, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  if (!isLoggedIn || !order) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Dummy QR string — replace with real qr_string from Xendit
  const qrString = order.qrString || "https://qris.example.com/dummy-qr";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
          <p className="text-sm text-gray-400 text-center">
            Scan QR code di bawah menggunakan e-wallet kamu
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">

          {isExpired ? (
            /* Expired state */
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-base font-bold text-gray-900">QR Code Kedaluwarsa</p>
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
              {/* QR Code */}
              <div className="p-4 border-2 border-violet-100 rounded-2xl">
                <QRCodeSVG
                  value={qrString}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="H"
                />
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <p className="text-sm">
                  Berlaku selama{" "}
                  <span className={`font-bold ${timeLeft <= 60 ? "text-red-500" : "text-violet-600"}`}>
                    {minutes}:{seconds}
                  </span>
                </p>
              </div>

              {/* Supported wallets */}
              <p className="text-xs text-gray-400 text-center">
                GoPay · OVO · Dana · ShopeePay · LinkAja · dan semua e-wallet lainnya
              </p>
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

export default OrderQR;