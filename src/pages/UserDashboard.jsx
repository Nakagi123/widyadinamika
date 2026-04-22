// src/pages/UserDashboard.jsx
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, ShieldCheck, Package, User } from "lucide-react";

const placeholderOrders = [
  { id: "ORD001", date: "2025-04-01", total: 25000, status: "Selesai" },
  { id: "ORD002", date: "2025-04-05", total: 12000, status: "Diproses" },
  { id: "ORD003", date: "2025-04-10", total: 8000, status: "Menunggu Pembayaran" },
];

const statusColor = {
  "Selesai": "bg-green-100 text-green-600",
  "Diproses": "bg-blue-100 text-blue-600",
  "Menunggu Pembayaran": "bg-yellow-100 text-yellow-600",
};

function UserDashboard() {
  const { user, isAuthenticated, isKasir, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
    // REMOVED the redirect for kasir - now kasir can also see this page
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

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
            onClick={() => console.log("Admin button clicked, navigating to /admin")}
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

          {placeholderOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada pesanan.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {placeholderOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-violet-600">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
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