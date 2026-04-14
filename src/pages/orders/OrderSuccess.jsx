import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

const dummyOrder = {
  id: "ORD-1744567890",
  total: 25000,
  items: [
    { id: 1, name: "Nasi Goreng", quantity: 2, price: 10000, image: "https://placehold.co/100x100?text=Nasi+Goreng" },
    { id: 2, name: "Es Teh Manis", quantity: 1, price: 5000, image: "https://placehold.co/100x100?text=Es+Teh" },
    { id: 3, name: "Pensil 2B", quantity: 3, price: 3000, image: "https://placehold.co/100x100?text=Pensil" },
  ],
};

function OrderSuccess() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth");
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Success Icon */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran Berhasil!</h1>
          <p className="text-sm text-gray-400 text-center">
            Pesananmu sudah dikonfirmasi. Silakan ambil pesananmu di koperasi sekolah.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-sm font-bold text-gray-900">{dummyOrder.id}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Total Dibayar</p>
            <p className="text-sm font-bold text-violet-600">
              Rp {dummyOrder.total.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Items Ordered */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-gray-900">Item Dipesan</h2>
          </div>

          <div className="flex flex-col gap-3">
            {dummyOrder.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.quantity}x Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/user"
            className="w-full py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-violet-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
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