// AdminOrders.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentService } from "../../lib/api";
import { 
  Search, CheckCircle, XCircle, ChevronDown, ChevronUp, 
  Banknote, QrCode, Building2, Eye, ArrowLeft, Loader, Trash2
} from "lucide-react";

const STATUS_CONFIG = {
  pending:   { label: "Menunggu",   color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400" },
  paid:      { label: "Dikonfirmasi", color: "bg-green-100 text-green-700",  dot: "bg-green-400" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-600",       dot: "bg-red-400"   },
};

const PAYMENT_CONFIG = {
  cash:     { label: "Cash", icon: Banknote, color: "text-amber-600" },
  qris:     { label: "QRIS", icon: QrCode, color: "text-violet-600" },
  transfer: { label: "Transfer Bank", icon: Building2, color: "text-blue-600" },
};

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function OrderRow({ order, onConfirm, onCancel, onDelete, isUpdating }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const payment = PAYMENT_CONFIG[order.paymentMethod] || PAYMENT_CONFIG.cash;
  const PayIcon = payment.icon;
  const isCash = order.paymentMethod === "cash";
  const isPending = order.status === "pending";
  const isCancelled = order.status === "cancelled";
  const studentName = order.user?.username || "Unknown";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${expanded ? "border-violet-200" : "border-gray-100"}`}>
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{order._id?.slice(-8).toUpperCase()}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-sm text-gray-600">{studentName}</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</div>
        </div>

        <div className={`hidden sm:flex items-center gap-1.5 ${payment.color}`}>
          <PayIcon className="w-4 h-4" />
          <span className="text-xs font-semibold">{payment.label}</span>
        </div>

        {isCash && isPending && (
          <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            Perlu Konfirmasi Manual
          </span>
        )}

        <span className="text-sm font-bold text-violet-600 flex-shrink-0">
          Rp {order.totalPrice?.toLocaleString("id-ID") || 0}
        </span>

        <span className={`hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${status.color}`}>
          {status.label}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/orders/${order._id}`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Detail
        </button>

        <span className="text-gray-400 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item Pesanan</p>
            <div className="flex flex-col gap-1.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.product?.name || "Product"} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-800">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-1.5 mt-1 flex justify-between text-sm font-bold">
                <span className="text-gray-700">Total</span>
                <span className="text-violet-600">Rp {order.totalPrice?.toLocaleString("id-ID") || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <PayIcon className={`w-4 h-4 ${payment.color}`} />
            <span>
              Pembayaran via <span className="font-semibold text-gray-700">{payment.label}</span>
              {!isCash && order.status === "pending" && (
                <span className="ml-2 text-xs text-blue-500">(Menunggu konfirmasi dari Xendit)</span>
              )}
              {isCash && order.status === "pending" && (
                <span className="ml-2 text-xs text-amber-600">(Admin perlu konfirmasi setelah menerima uang tunai)</span>
              )}
            </span>
          </div>

          {isPending && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onConfirm(order._id)}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {isCash ? "Konfirmasi Pembayaran Tunai" : "Konfirmasi Pesanan"}
              </button>
              <button
                onClick={() => onCancel(order._id)}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4" />
                Batalkan Pesanan
              </button>
            </div>
          )}

          {isCancelled && (
            <button
              onClick={() => onDelete(order._id)}
              disabled={isUpdating}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Hapus Pesanan
            </button>
          )}

          {order.status === "paid" && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <CheckCircle className="w-4 h-4" />
              Pesanan telah dikonfirmasi
            </div>
          )}
          {isCancelled && (
            <div className="flex items-center gap-2 text-sm text-red-500 font-semibold">
              <XCircle className="w-4 h-4" />
              Pesanan dibatalkan
            </div>
          )}

          <div className="pt-2">
            <Link
              to={`/admin/orders/${order._id}`}
              className="inline-flex items-center gap-2 text-sm text-violet-600 font-semibold hover:text-violet-700"
            >
              <Eye className="w-4 h-4" />
              Lihat Halaman Detail Lengkap
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Order Detail Page Component
function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isKasir } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isKasir) {
      navigate("/");
    } else {
      fetchOrderDetail();
    }
  }, [isAuthenticated, isKasir, navigate, id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getKasirOrders();
      const foundOrder = response.data.find(o => o._id === id);
      setOrder(foundOrder || null);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      await paymentService.confirmCashPayment(order._id, "paid");
      await fetchOrderDetail();
    } catch (err) {
      console.error("Failed to confirm order:", err);
      alert(err.response?.data?.message || "Gagal mengkonfirmasi pesanan");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;
    setUpdating(true);
    try {
      await paymentService.confirmCashPayment(order._id, "cancelled");
      await fetchOrderDetail();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "Gagal membatalkan pesanan");
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated || !isKasir) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
          <Link to="/admin" className="text-violet-600 hover:text-violet-700">
            Kembali ke Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const payment = PAYMENT_CONFIG[order.paymentMethod] || PAYMENT_CONFIG.cash;
  const PayIcon = payment.icon;
  const isCash = order.paymentMethod === "cash";
  const isPending = order.status === "pending";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Pesanan
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order._id?.slice(-8).toUpperCase()}</h1>
                <p className="text-gray-500 mt-1">{order.user?.username}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm text-gray-500">Tanggal Pesanan</p>
              <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-3">Item Pesanan</p>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">
                      {item.product?.name || "Product"} <span className="text-gray-400">×{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-gray-800">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-violet-600">Rp {order.totalPrice?.toLocaleString("id-ID") || 0}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Metode Pembayaran</p>
              <div className={`flex items-center gap-2 p-3 bg-gray-50 rounded-xl ${payment.color}`}>
                <PayIcon className="w-5 h-5" />
                <span className="font-semibold">{payment.label}</span>
                {!isCash && order.status === "pending" && (
                  <span className="ml-2 text-xs text-blue-500">(Menunggu konfirmasi Xendit)</span>
                )}
                {isCash && order.status === "pending" && (
                  <span className="ml-2 text-xs text-amber-600">(Menunggu konfirmasi manual dari admin)</span>
                )}
              </div>
            </div>

            {isPending && isCash && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleConfirm}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updating ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Konfirmasi Pembayaran Tunai
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Batalkan Pesanan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Admin Orders Component
function AdminOrders() {
  const { isAuthenticated, isKasir } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isKasir) {
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, isKasir, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getKasirOrders(filterStatus === "all" ? null : filterStatus, filterPayment === "all" ? null : filterPayment);
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      alert(err.response?.data?.message || "Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isKasir) {
      fetchOrders();
    }
  }, [filterStatus, filterPayment]);

  const handleConfirm = async (id) => {
    setUpdatingId(id);
    try {
      await paymentService.confirmCashPayment(id, "paid");
      await fetchOrders();
    } catch (err) {
      console.error("Failed to confirm order:", err);
      alert(err.response?.data?.message || "Gagal mengkonfirmasi pesanan");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;
    setUpdatingId(id);
    try {
      await paymentService.confirmCashPayment(id, "cancelled");
      await fetchOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "Gagal membatalkan pesanan");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setUpdatingId(id);
    try {
      await paymentService.deleteOrder(id);
      await fetchOrders();
      alert("Pesanan berhasil dihapus");
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert(err.response?.data?.message || "Gagal menghapus pesanan");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o._id.toLowerCase().includes(search.toLowerCase()) ||
                       (o.user?.username || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchPayment = filterPayment === "all" || o.paymentMethod === filterPayment;
    return matchSearch && matchStatus && matchPayment;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const cashPending = orders.filter((o) => o.paymentMethod === "cash" && o.status === "pending").length;

  if (!isAuthenticated || !isKasir) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Kelola Pesanan</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Pesanan</h1>
            <p className="text-gray-400 mt-1 text-sm">Konfirmasi dan pantau semua pesanan masuk</p>
          </div>
          {cashPending > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <Banknote className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-700">{cashPending} pesanan cash menunggu konfirmasi</p>
                <p className="text-xs text-amber-600">Konfirmasi setelah menerima uang dari siswa</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
          {[
            { key: "all", label: "Semua", count: counts.all },
            { key: "pending", label: "Menunggu", count: counts.pending },
            { key: "paid", label: "Dikonfirmasi", count: counts.paid },
            { key: "cancelled", label: "Dibatalkan", count: counts.cancelled },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${filterStatus === key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari ID pesanan atau nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white"
            />
          </div>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          >
            <option value="all">Semua Pembayaran</option>
            <option value="cash">Cash (Konfirmasi Manual)</option>
            <option value="qris">QRIS (Xendit)</option>
            <option value="transfer">Transfer Bank</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <p className="text-4xl">📋</p>
            <p className="font-semibold">Tidak ada pesanan ditemukan</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onDelete={handleDelete}
                isUpdating={updatingId === order._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { AdminOrders, AdminOrderDetail };
export default AdminOrders;