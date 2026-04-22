// AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentService, productService } from "../../lib/api";
import { Package, ShoppingBag, BadgeDollarSign, AlertTriangle, ChevronRight, BarChart2, ClipboardList, Home, Loader } from "lucide-react";

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
  const { isAuthenticated, isKasir, user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isKasir) {
      navigate("/");
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, isKasir, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products and orders in parallel
      const [productsRes, ordersRes] = await Promise.all([
        productService.getAllProducts(),
        paymentService.getKasirOrders()
      ]);
      
      const products = productsRes.data;
      const orders = ordersRes.data;
      
      // Calculate total products
      const totalProducts = products.length;
      
      // Calculate total orders and revenue from paid orders
      const paidOrders = orders.filter(o => o.status === "paid");
      const totalOrders = paidOrders.length;
      const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      
      // Find low stock products (stock < 10)
      const lowStock = products
        .filter(p => p.stock < 10 && p.stock > 0)
        .map(p => ({ id: p._id, name: p.name, stock: p.stock }))
        .slice(0, 5);
      
      // Get recent orders (last 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(o => ({
          id: o._id,
          orderId: o._id?.slice(-8).toUpperCase(),
          customerName: o.user?.username || "Unknown",
          total: o.totalPrice || 0,
          status: o.status,
          paymentMethod: o.paymentMethod
        }));
      
      setDashboardData({
        totalProducts,
        totalOrders,
        totalRevenue,
        lowStock,
        recentOrders
      });
      
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'paid': return 'Dikonfirmasi';
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Header with Back to Home Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Selamat datang, {user?.username} | Role: Kasir</p>
          </div>
          
          {/* Back to Home Button */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-violet-200 hover:text-violet-600 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<Package className="w-6 h-6 text-violet-600" />}
            label="Total Produk"
            value={dashboardData.totalProducts}
            color="bg-violet-100"
          />
          <StatCard
            icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
            label="Total Pesanan Selesai"
            value={dashboardData.totalOrders}
            color="bg-blue-100"
          />
          <StatCard
            icon={<BadgeDollarSign className="w-6 h-6 text-green-600" />}
            label="Total Pendapatan"
            value={`Rp ${dashboardData.totalRevenue.toLocaleString("id-ID")}`}
            color="bg-green-100"
          />
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">Stok Menipis</h2>
          </div>

          {dashboardData.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">✅ Semua stok aman.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {dashboardData.lowStock.map((item) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          {/* Orders Management Button */}
          <Link
            to="/admin/orders"
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Kelola Pesanan</p>
                <p className="text-xs text-gray-400">Konfirmasi dan batalkan pesanan</p>
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

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Pesanan Terbaru</h2>
            <Link 
              to="/admin/orders" 
              className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {dashboardData.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada pesanan</p>
          ) : (
            <div className="space-y-3">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderId}</p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-violet-600">
                      Rp {order.total.toLocaleString("id-ID")}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <Link 
                      to={`/admin/orders/${order.id}`}
                      className="text-violet-600 hover:text-violet-700 text-sm"
                    >
                      Detail →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;