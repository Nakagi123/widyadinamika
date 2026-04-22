// src/pages/orders/OrderSuccess.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentService } from "../../lib/api";
import { CheckCircle, ShoppingBag, Home, Wallet, Loader } from "lucide-react";

function OrderSuccess() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    // Check if we have order data from state (cash payment)
    if (location.state?.orderId) {
      setOrder(location.state);
      setLoading(false);
      return;
    }
    
    // Otherwise, try to get the latest order from API
    fetchLatestOrder();
  }, [isAuthenticated, navigate, location.state]);
  
    const fetchLatestOrder = async () => {
      try {
        const response = await paymentService.getMyOrders();
        const latestOrder = response.data[0]; // Most recent order
        
        // Show the latest order even if it's pending (for QRIS/Transfer)
        if (latestOrder) {
          setOrder({
            orderId: latestOrder._id,
            total: latestOrder.totalPrice,
            items: latestOrder.items,
            paymentMethod: latestOrder.paymentMethod,
            status: latestOrder.status,
          });
        } else {
          // No order found
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-lg mx-auto px-6 py-10 text-center">
          <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
          <Link to="/" className="text-violet-600 hover:text-violet-700">
            Kembali ke Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  const isCash = order.paymentMethod === "cash";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 py-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isCash ? "bg-yellow-100" : "bg-green-100"}`}>
            {isCash ? <Wallet className="w-10 h-10 text-yellow-500" /> : <CheckCircle className="w-10 h-10 text-green-500" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isCash ? "Pesanan Dibuat!" : "Pembayaran Berhasil!"}
          </h1>
          <p className="text-sm text-gray-400 text-center">
            {isCash
              ? "Tunjukkan ID pesanan di bawah kepada kasir saat membayar di koperasi sekolah."
              : "Pesananmu sudah dikonfirmasi. Silakan ambil pesananmu di koperasi sekolah."
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-sm font-bold text-gray-900">{order.orderId?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Metode Pembayaran</p>
            <p className="text-sm font-semibold text-gray-700">
              {order.paymentMethod === "cash" && "Bayar di Tempat"}
              {order.paymentMethod === "qris" && "QRIS"}
              {order.paymentMethod === "transfer" && "Transfer Bank"}
            </p>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-sm font-bold text-violet-600">
              Rp {order.total?.toLocaleString("id-ID") || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-gray-900">Item Dipesan</h2>
          </div>
          <div className="flex flex-col gap-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.product?.name || "Product"}</p>
                  <p className="text-xs text-gray-400">{item.quantity}x Rp {(item.price || item.product?.price).toLocaleString("id-ID")}</p>
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Rp {((item.price || item.product?.price) * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/user"
            className="w-full py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-violet-700 transition-all duration-200"
          >
            Lihat Riwayat Pesanan
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

export default OrderSuccess;