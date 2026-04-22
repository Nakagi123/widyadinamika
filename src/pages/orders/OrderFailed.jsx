// src/pages/orders/OrderFailed.jsx
import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { XCircle, ShoppingBag, Home, RefreshCw } from "lucide-react";

function OrderFailed() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Failed Icon */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran Gagal!</h1>
          <p className="text-sm text-gray-400 text-center">
            Pembayaran Anda gagal diproses atau telah kedaluwarsa.
          </p>
        </div>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-600 text-center">
            {order?.message || "Silakan coba lagi atau hubungi kasir jika masalah berlanjut."}
          </p>
        </div>

        {/* Order Info (if exists) */}
        {order && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="text-sm font-bold text-gray-900">{order.orderId}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">Metode Pembayaran</p>
              <p className="text-sm font-semibold text-gray-700">
                {order.paymentMethod === "qris" && "QRIS"}
                {order.paymentMethod === "transfer" && "Transfer Bank"}
                {order.paymentMethod === "cash" && "Bayar di Tempat"}
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-sm font-bold text-violet-600">
                Rp {order.total?.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}

        {/* Items Ordered (if exists) */}
        {order?.items && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-violet-500" />
              <h2 className="text-base font-bold text-gray-900">Item Dipesan</h2>
            </div>

            <div className="flex flex-col gap-3">
              {order.items.map((item, index) => (
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
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/cart"
            className="w-full py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-violet-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </Link>
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

export default OrderFailed;