import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paymentService, productService } from "../../lib/api";
import * as XLSX from 'xlsx';
import { 
  TrendingUp, TrendingDown, Package, ShoppingBag, 
  BadgeDollarSign, Calendar, ArrowUp, ArrowDown,
  BarChart2, PieChart, RefreshCcw, Loader, FileSpreadsheet
} from "lucide-react";

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
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
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

function TopProducts({ products }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Produk Terlaris</h3>
      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Belum ada data produk</p>
        ) : (
          products.slice(0, 5).map((product, index) => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-400">Terjual {product.sold || 0} pcs</p>
                </div>
              </div>
              <p className="font-bold text-violet-600">
                Rp {(product.revenue || 0).toLocaleString("id-ID")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RecentOrdersTable({ orders }) {
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

  const getPaymentLabel = (method) => {
    switch(method) {
      case 'cash': return 'Cash';
      case 'qris': return 'QRIS';
      case 'transfer': return 'Transfer Bank';
      default: return method;
    }
  };

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
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  Belum ada pesanan
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 text-sm font-medium text-gray-900">
                    {order._id?.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-2 text-sm font-semibold text-violet-600">
                    Rp {order.totalPrice?.toLocaleString("id-ID") || 0}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">
                    {getPaymentLabel(order.paymentMethod)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminStatistics() {
  const { isAuthenticated, isKasir } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isKasir) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [isAuthenticated, isKasir, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        paymentService.getKasirOrders(),
        productService.getAllProducts()
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch statistics data:", err);
      setError(err.message || "Gagal memuat data statistik");
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    // Prepare orders data for export
    const exportData = orders.map(order => ({
      'ID Pesanan': order._id?.slice(-8).toUpperCase(),
      'Tanggal': new Date(order.createdAt).toLocaleDateString('id-ID'),
      'Waktu': new Date(order.createdAt).toLocaleTimeString('id-ID'),
      'Pelanggan': order.user?.username || 'Unknown',
      'Total': order.totalPrice || 0,
      'Status': order.status === 'paid' ? 'Dikonfirmasi' : 
                order.status === 'pending' ? 'Menunggu' : 'Dibatalkan',
      'Metode Pembayaran': order.paymentMethod === 'cash' ? 'Cash' :
                           order.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank',
      'Jumlah Item': order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
    }));

    // Calculate summary data
    const paidOrders = orders.filter(o => o.status === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    
    const summaryData = [
      { 'Ringkasan': 'Total Pendapatan', 'Nilai': `Rp ${totalRevenue.toLocaleString('id-ID')}` },
      { 'Ringkasan': 'Total Pesanan Selesai', 'Nilai': paidOrders.length },
      { 'Ringkasan': 'Total Produk Terjual', 'Nilai': paidOrders.reduce((sum, o) => {
        return sum + (o.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0);
      }, 0) },
      { 'Ringkasan': 'Tanggal Export', 'Nilai': new Date().toLocaleString('id-ID') }
    ];

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: Orders
    const wsOrders = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, wsOrders, 'Pesanan');
    
    // Sheet 2: Summary
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');
    
    // Auto-size columns for orders sheet
    const maxWidths = [];
    exportData.forEach(row => {
      Object.keys(row).forEach((key, idx) => {
        const value = String(row[key] || '');
        maxWidths[idx] = Math.max(maxWidths[idx] || 0, value.length, key.length);
      });
    });
    wsOrders['!cols'] = maxWidths.map(w => ({ wch: Math.min(w + 2, 30) }));
    
    // Download file
    XLSX.writeFile(wb, `statistik_penjualan_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Calculate statistics from real data
  const paidOrders = orders.filter(o => o.status === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalOrders = paidOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalProductsSold = paidOrders.reduce((sum, o) => {
    const itemsCount = o.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0;
    return sum + itemsCount;
  }, 0);

  // Calculate daily sales for last 7 days
  const getDailySales = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dailyData = days.map(day => ({ label: day, value: 0 }));
    
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    paidOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= last7Days) {
        const dayName = days[orderDate.getDay()];
        const dayIndex = dailyData.findIndex(d => d.label === dayName);
        if (dayIndex !== -1) {
          dailyData[dayIndex].value += order.totalPrice || 0;
        }
      }
    });
    
    return dailyData;
  };

  // Calculate top selling products
  const getTopProducts = () => {
    const productSales = {};
    
    paidOrders.forEach(order => {
      order.items?.forEach(item => {
        const productId = item.product?._id || item.product;
        const productName = item.product?.name || "Unknown";
        const quantity = item.quantity;
        const revenue = (item.price || 0) * quantity;
        
        if (!productSales[productId]) {
          productSales[productId] = {
            _id: productId,
            name: productName,
            sold: 0,
            revenue: 0
          };
        }
        productSales[productId].sold += quantity;
        productSales[productId].revenue += revenue;
      });
    });
    
    return Object.values(productSales).sort((a, b) => b.revenue - a.revenue);
  };

  // Calculate payment method distribution
  const getPaymentDistribution = () => {
    const distribution = { cash: 0, qris: 0, transfer: 0 };
    paidOrders.forEach(order => {
      if (distribution[order.paymentMethod] !== undefined) {
        distribution[order.paymentMethod] += order.totalPrice || 0;
      }
    });
    return distribution;
  };

  const dailySales = getDailySales();
  const topProducts = getTopProducts();
  const paymentDistribution = getPaymentDistribution();
  const totalPaymentRevenue = Object.values(paymentDistribution).reduce((a, b) => a + b, 0);

  // Mock growth percentages (can be calculated from previous period if needed)
  const revenueGrowth = 23.5;
  const ordersGrowth = 15.2;

  if (!isAuthenticated || !isKasir) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

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
          
          <div className="flex gap-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export ke Excel
            </button>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
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
            title="Total Pesanan Selesai"
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
            value={totalProductsSold}
            icon={<Package className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart data={dailySales} />
          <TopProducts products={topProducts} />
        </div>
        
        {/* Payment Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Cash (Manual Konfirmasi)</span>
                <span className="font-semibold text-gray-900">
                  Rp {paymentDistribution.cash.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${totalPaymentRevenue ? (paymentDistribution.cash / totalPaymentRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">QRIS (Xendit)</span>
                <span className="font-semibold text-gray-900">
                  Rp {paymentDistribution.qris.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-violet-500 h-2 rounded-full" 
                  style={{ width: `${totalPaymentRevenue ? (paymentDistribution.qris / totalPaymentRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Transfer Bank (Xendit)</span>
                <span className="font-semibold text-gray-900">
                  Rp {paymentDistribution.transfer.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${totalPaymentRevenue ? (paymentDistribution.transfer / totalPaymentRevenue) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Orders Table */}
        <RecentOrdersTable orders={orders} />
        
        {/* Additional Stats */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Ingin laporan lebih detail?</h3>
              <p className="text-violet-100">Data statistik diperbarui secara real-time</p>
            </div>
            <button 
              onClick={exportToExcel}
              className="px-6 py-3 bg-white text-violet-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Laporan Lengkap
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AdminStatistics;