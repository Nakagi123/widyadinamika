import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Package, ShoppingBag, BadgeDollarSign, AlertTriangle, ChevronRight, BarChart2 } from "lucide-react";

const stats = {
  totalProducts: 24,
  totalOrders: 138,
  totalRevenue: 2750000,
  lowStock: [
    { id: 1, name: "Seragam Putih", stock: 2 },
    { id: 2, name: "Buku Tulis", stock: 3 },
    { id: 3, name: "Pensil 2B", stock: 4 },
  ],
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
    }
  }, [isLoggedIn, isAdmin, navigate]);

  if (!isLoggedIn || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Selamat datang, kelola toko kamu di sini</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Package className="w-6 h-6 text-violet-600" />}
            label="Total Produk"
            value={stats.totalProducts}
            color="bg-violet-100"
          />
          <StatCard
            icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
            label="Total Pesanan"
            value={stats.totalOrders}
            color="bg-blue-100"
          />
          <StatCard
            icon={<BadgeDollarSign className="w-6 h-6 text-green-600" />}
            label="Total Pendapatan"
            value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
            color="bg-green-100"
          />
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">Stok Menipis</h2>
          </div>

          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">Semua stok aman.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-xl"
                >
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    Sisa {item.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Kelola Produk</p>
                <p className="text-xs text-gray-400">Tambah, edit, hapus produk</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </Link>

          <Link
            to="/admin/statistics"
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Statistik</p>
                <p className="text-xs text-gray-400">Lihat riwayat dan laporan</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;