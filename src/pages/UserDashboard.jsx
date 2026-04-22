// src/pages/UserDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { paymentService } from "../lib/api";
import { LogOut, ShieldCheck, Package, User, Loader, Eye } from "lucide-react";

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

function UserDashboard() {
  const { user, isAuthenticated, isKasir, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getMyOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.message || "Gagal memuat riwayat pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "cash": return "Bayar di Tempat";
      case "qris": return "QRIS";
      case "transfer": return "Transfer Bank";
      default: return method;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-violet-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
            <p className="text-sm text-gray-400">{user?.username}@widyadinamika.sch.id</p>
            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isKasir ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-500"}`}>
              {isKasir ? "Kasir" : "Student"}
            </span>
          </div>
        </div>
        
        {/* Admin Button - visible for kasir only */}
        {isKasir && (
          <Link
            to="/admin"
            className="flex items-center gap-3 bg-violet-600 text-white rounded-2xl p-5 hover:bg-violet-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-6 h-6" />
            <div>
              <p className="font-semibold">Admin Dashboard</p>
              <p className="text-xs text-violet-200">Kelola produk, stok, dan pesanan</p>
            </div>
          </Link>
        )}

        {/* Order History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-violet-500" />
            <h3 className="text-lg font-bold text-gray-900">Riwayat Pesanan</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-2 text-violet-600 text-sm hover:underline"
              >
                Coba Lagi
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📦</p>
              <p className="text-sm text-gray-400">Belum ada pesanan.</p>
              <Link
                to="/products"
                className="mt-3 inline-block text-sm text-violet-600 hover:underline"
              >
                Mulai Belanja →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900">
                        {order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-xs text-gray-400">
                        {order.items?.length || 0} item
                      </p>
                      <p className="text-xs text-gray-400">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-violet-600">
                        Rp {order.totalPrice?.toLocaleString("id-ID") || 0}
                      </p>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <Link
                    to={`/orders/${order._id}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-violet-500 hover:text-violet-600"
                  >
                    <Eye className="w-3 h-3" />
                    Lihat Detail
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>

      </div>
    </div>
  );
}

export default UserDashboard;