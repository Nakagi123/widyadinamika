// src/pages/orders/OrderDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentService } from "../../lib/api";
import { ArrowLeft, Package, CreditCard, Calendar, Loader } from "lucide-react";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-600",
  paid: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
};

const statusLabel = {
  pending: "Menunggu Pembayaran",
  paid: "Selesai",
  cancelled: "Dibatalkan",
};

const paymentMethodLabel = {
  cash: "Bayar di Tempat",
  qris: "QRIS",
  transfer: "Transfer Bank",
};

function OrderDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    fetchOrderDetail();
  }, [isAuthenticated, navigate, id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getMyOrders();
      const foundOrder = response.data.find(o => o._id === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
        setError(null);
      } else {
        setError("Pesanan tidak ditemukan");
      }
    } catch (err) {
      console.error("Failed to fetch order detail:", err);
      setError(err.message || "Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-violet-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error || "Pesanan tidak ditemukan"}</p>
            <Link
              to="/user"
              className="text-violet-600 hover:underline"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-violet-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Kembali</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[order.status]}`}>
              {statusLabel[order.status]}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-gray-900">Item Pesanan</h2>
          </div>
          
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {item.product?.name || "Produk"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {item.quantity} x Rp {item.price?.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="font-bold text-violet-600">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-violet-600">
                Rp {order.totalPrice?.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-gray-900">Informasi Pembayaran</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Metode Pembayaran</span>
              <span className="font-semibold text-gray-900">
                {paymentMethodLabel[order.paymentMethod]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`font-semibold ${statusColor[order.status]}`}>
                {statusLabel[order.status]}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {order.status === "pending" && order.paymentMethod !== "cash" && order.invoiceUrl && (
          <button
            onClick={() => window.location.href = order.invoiceUrl}
            className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
          >
            Lanjutkan Pembayaran
          </button>
        )}

        {order.status === "pending" && order.paymentMethod === "cash" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-sm text-yellow-700">
              Pesanan ini belum dibayar. Silakan tunjukkan ID pesanan ke kasir untuk melakukan pembayaran.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderDetail;