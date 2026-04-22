// src/pages/orders/OrderPending.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentService } from "../../lib/api";
import { Clock, ShoppingBag, Home, RefreshCw, CreditCard } from "lucide-react";

function OrderPending() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [isExpired, setIsExpired] = useState(false);
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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Poll for payment status
  useEffect(() => {
    if (!order?.orderId || isExpired) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await paymentService.getMyOrders();
        const foundOrder = response.data.find(o => o._id === order.orderId || o.xenditExternalId === order.orderId);
        
        if (foundOrder && foundOrder.status === "paid") {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          navigate("/orders/success", { state: { ...order, status: "paid" } });
        }
      } catch (err) {
        console.error("Failed to check payment status:", err);
      }
    };

    pollRef.current = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(pollRef.current);
  }, [order, navigate, isExpired]);

  useEffect(() => {
    return () => {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  if (!isAuthenticated || !order) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const isQris = order.paymentMethod === "qris";
  const isVA = order.paymentMethod === "transfer";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Pending Icon */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Menunggu Pembayaran</h1>
          <p className="text-sm text-gray-400 text-center">
            Silakan selesaikan pembayaran sebelum waktu habis.
          </p>
        </div>

        {/* Countdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-sm text-gray-400 mb-2">Sisa Waktu Pembayaran</p>
          <p className={`text-3xl font-bold ${timeLeft <= 300 ? "text-red-500" : "text-violet-600"}`}>
            {minutes}:{seconds}
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-sm font-bold text-gray-900">{order.orderId}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Metode Pembayaran</p>
            <p className="text-sm font-semibold text-gray-700">
              {isQris && "QRIS"}
              {isVA && "Transfer Bank"}
            </p>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-sm font-bold text-violet-600">
              Rp {order.total?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Payment Action Button */}
        <button
          onClick={() => {
            if (order.invoiceUrl) {
              window.location.href = order.invoiceUrl;
            }
          }}
          className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Lanjutkan Pembayaran
        </button>

        {/* Items Ordered */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-gray-900">Item Dipesan</h2>
          </div>

          <div className="flex flex-col gap-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  src={item.productImage || "https://placehold.co/100x100?text=No+Image"}
                  alt={item.productName || item.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=No+Image";
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.productName || item.name}</p>
                  <p className="text-xs text-gray-400">{item.quantity}x Rp {(item.price || item.productPrice).toLocaleString("id-ID")}</p>
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Rp {((item.price || item.productPrice) * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Menunggu konfirmasi pembayaran...</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl text-center hover:border-violet-300 hover:text-violet-500 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}

export default OrderPending;