// src/pages/orders/OrderQR.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentService } from "../../lib/api";
import { QRCodeSVG } from "qrcode.react";
import { Clock, RefreshCw, Home } from "lucide-react";

function OrderQR() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown
  const [isExpired, setIsExpired] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    if (!order) navigate("/");
  }, [isAuthenticated, order, navigate]);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsExpired(true);
          setIsPolling(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Poll payment status
  useEffect(() => {
    if (!order?.orderId || isExpired) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await paymentService.checkPaymentStatus(order.orderId);
        console.log("Payment status:", response.data.status);
        
        if (response.data.status === "paid") {
          // Payment confirmed!
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setIsPolling(false);
          navigate("/orders/success", { state: { ...order, status: "paid" } });
        }
      } catch (err) {
        console.error("Failed to check payment status:", err);
      }
    };

    // Check immediately, then every 3 seconds
    checkPaymentStatus();
    pollRef.current = setInterval(checkPaymentStatus, 3000);

    return () => clearInterval(pollRef.current);
  }, [order, navigate, isExpired]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  if (!isAuthenticated || !order) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // For QRIS, we need to display the QR code from Xendit
  // The invoiceUrl from Xendit is the checkout page, not the QR code directly
  // For now, we'll show a message to click the link
  const isQRIS = order.paymentMethod === "qris";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {isQRIS ? "Scan QR Code" : "Virtual Account"}
          </h1>
          <p className="text-sm text-gray-400 text-center">
            {isQRIS 
              ? "Scan QR code di bawah menggunakan e-wallet kamu"
              : "Transfer ke nomor Virtual Account di bawah"
            }
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">

          {isExpired ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-base font-bold text-gray-900">Pembayaran Kedaluwarsa</p>
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
              {/* For QRIS - Show the payment link since we don't have direct QR code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Klik tombol di bawah untuk melanjutkan ke halaman pembayaran
                </p>
                <a
                  href={order.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                >
                  Lanjutkan ke Pembayaran
                </a>
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-2 text-gray-500 mt-4">
                <Clock className="w-4 h-4" />
                <p className="text-sm">
                  Selesaikan pembayaran dalam{" "}
                  <span className={`font-bold ${timeLeft <= 60 ? "text-red-500" : "text-violet-600"}`}>
                    {minutes}:{seconds}
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
            <p className="text-sm font-bold text-gray-900">{order.orderId?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex justify-between items-center">
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