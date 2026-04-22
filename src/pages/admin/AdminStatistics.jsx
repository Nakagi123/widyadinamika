// AdminStatistics.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  TrendingUp, TrendingDown, Package, ShoppingBag, 
  BadgeDollarSign, Users, Calendar, ArrowUp, ArrowDown,
  BarChart2, PieChart, Download, Filter, DollarSign
} from "lucide-react";

// Mock data for statistics
const mockOrders = [
  { id: "ORD-001", date: "2025-04-14", total: 25000, status: "confirmed", paymentMethod: "cash" },
  { id: "ORD-002", date: "2025-04-14", total: 12000, status: "confirmed", paymentMethod: "qris" },
  { id: "ORD-003", date: "2025-04-14", total: 93000, status: "confirmed", paymentMethod: "virtual_account" },
  { id: "ORD-004", date: "2025-04-13", total: 18000, status: "confirmed", paymentMethod: "cash" },
  { id: "ORD-005", date: "2025-04-13", total: 9000, status: "confirmed", paymentMethod: "qris" },
  { id: "ORD-006", date: "2025-04-12", total: 85000, status: "cancelled", paymentMethod: "virtual_account" },
  { id: "ORD-007", date: "2025-04-14", total: 22000, status: "pending", paymentMethod: "cash" },
  { id: "ORD-008", date: "2025-04-11", total: 45000, status: "confirmed", paymentMethod: "qris" },
  { id: "ORD-009", date: "2025-04-10", total: 67000, status: "confirmed", paymentMethod: "cash" },
  { id: "ORD-010", date: "2025-04-09", total: 33000, status: "confirmed", paymentMethod: "virtual_account" },
  { id: "ORD-011", date: "2025-04-08", total: 28000, status: "confirmed", paymentMethod: "cash" },
  { id: "ORD-012", date: "2025-04-07", total: 51000, status: "confirmed", paymentMethod: "qris" },
];

const mockProducts = [
  { id: 1, name: "Seragam Putih", price: 85000, sold: 45, revenue: 3825000, category: "Seragam" },
  { id: 2, name: "Buku Tulis", price: 8000, sold: 128, revenue: 1024000, category: "Alat Tulis" },
  { id: 3, name: "Pensil 2B", price: 3000, sold: 256, revenue: 768000, category: "Alat Tulis" },
  { id: 4, name: "Nasi Goreng", price: 10000, sold: 89, revenue: 890000, category: "Makanan" },
  { id: 5, name: "Mie Goreng", price: 12000, sold: 76, revenue: 912000, category: "Makanan" },
  { id: 6, name: "Es Teh Manis", price: 5000, sold: 234, revenue: 1170000, category: "Minuman" },
  { id: 7, name: "Air Mineral", price: 4000, sold: 198, revenue: 792000, category: "Minuman" },
];

function StatCard({ title, value, change, icon, color }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SalesChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Penjualan Harian</h3>
          <p className="text-sm text-gray-400 mt-1">7 hari terakhir</p>
        </div>
        <BarChart2 className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex items-end gap-3 h-64">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-violet-100 rounded-lg hover:bg-violet-200 transition-all duration-200 relative group"
              style={{ height: `${(item.value / maxValue) * 200}px` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Rp {item.value.toLocaleString("id-ID")}
              </div>
            </div>
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryPieChart({ categories }) {
  const total = categories.reduce((sum, cat) => sum + cat.value, 0);
  const colors = ['bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Penjualan per Kategori</h3>
          <p className="text-sm text-gray-400 mt-1">Distribusi berdasarkan kategori</p>
        </div>
        <PieChart className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {categories.map((category, index) => {
          const percentage = (category.value / total) * 100;
          return (
            <div key={category.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{category.name}</span>
                <span className="font-semibold text-gray-900">
                  Rp {category.value.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{percentage.toFixed(1)}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopProducts({ products }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Produk Terlaris</h3>
      <div className="space-y-3">
        {products.slice(0, 5).map((product, index) => (
          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-400">Terjual {product.sold} pcs</p>
              </div>
            </div>
            <p className="font-bold text-violet-600">
              Rp {product.revenue.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentOrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Pesanan Terbaru</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">ID Pesanan</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Tanggal</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Total</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Status</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-500">Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="py-3 px-2 text-sm text-gray-600">{order.date}</td>
                <td className="py-3 px-2 text-sm font-semibold text-violet-600">
                  Rp {order.total.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {order.status === 'confirmed' ? 'Dikonfirmasi' :
                     order.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-gray-600">{order.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DateRangeFilter({ dateRange, setDateRange }) {
  const [showCustom, setShowCustom] = useState(false);
  
  const presets = [
    { label: "7 Hari Terakhir", days: 7 },
    { label: "30 Hari Terakhir", days: 30 },
    { label: "Bulan Ini", days: 'month' },
    { label: "Tahun Ini", days: 'year' },
  ];
  
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setShowCustom(!showCustom)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        {dateRange.label}
      </button>
      
      {showCustom && (
        <div className="absolute mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
          {presets.map(preset => (
            <button
              key={preset.label}
              onClick={() => {
                setDateRange({ ...dateRange, label: preset.label });
                setShowCustom(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        <Download className="w-4 h-4" />
        Export
      </button>
    </div>
  );
}

function AdminStatistics() {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({ label: "7 Hari Terakhir", days: 7 });
  
  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
    }
  }, [isLoggedIn, isAdmin, navigate]);
  
  // Calculate statistics
  const confirmedOrders = mockOrders.filter(o => o.status === "confirmed");
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = confirmedOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculate daily sales for chart
  const dailySales = [
    { label: "Senin", value: 245000 },
    { label: "Selasa", value: 189000 },
    { label: "Rabu", value: 312000 },
    { label: "Kamis", value: 278000 },
    { label: "Jumat", value: 423000 },
    { label: "Sabtu", value: 356000 },
    { label: "Minggu", value: 198000 },
  ];
  
  // Calculate category sales
  const categorySales = [
    { name: "Seragam", value: 3825000 },
    { name: "Alat Tulis", value: 1792000 },
    { name: "Makanan", value: 1802000 },
    { name: "Minuman", value: 1962000 },
  ];
  
  // Calculate growth (mock data)
  const revenueGrowth = 23.5;
  const ordersGrowth = 15.2;
  
  if (!isLoggedIn || !isAdmin) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link 
                to="/admin" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Statistik</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Statistik Penjualan</h1>
            <p className="text-gray-400 mt-1 text-sm">Lihat laporan dan analisis penjualan</p>
          </div>
          
          <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pendapatan"
            value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
            change={revenueGrowth}
            icon={<BadgeDollarSign className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Total Pesanan"
            value={totalOrders}
            change={ordersGrowth}
            icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Rata-rata Pesanan"
            value={`Rp ${averageOrderValue.toLocaleString("id-ID")}`}
            icon={<TrendingUp className="w-6 h-6 text-violet-600" />}
            color="bg-violet-100"
          />
          <StatCard
            title="Total Produk Terjual"
            value={mockProducts.reduce((sum, p) => sum + p.sold, 0)}
            icon={<Package className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart data={dailySales} />
          <CategoryPieChart categories={categorySales} />
        </div>
        
        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts products={mockProducts} />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Cash (Manual Konfirmasi)</span>
                  <span className="font-semibold text-gray-900">
                    Rp {(totalRevenue * 0.35).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">QRIS (Xendit)</span>
                  <span className="font-semibold text-gray-900">
                    Rp {(totalRevenue * 0.40).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-violet-500 h-2 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Virtual Account (Xendit)</span>
                  <span className="font-semibold text-gray-900">
                    Rp {(totalRevenue * 0.25).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "25%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Orders Table */}
        <RecentOrdersTable orders={mockOrders} />
        
        {/* Additional Stats */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Ingin laporan lebih detail?</h3>
              <p className="text-violet-100">Export data penjualan untuk analisis lebih lanjut</p>
            </div>
            <button className="px-6 py-3 bg-white text-violet-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Export Laporan Lengkap
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AdminStatistics;