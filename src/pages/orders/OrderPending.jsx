import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Clock, ShoppingBag, Home, QrCode, Building2 } from "lucide-react";

function OrderPending() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state;

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth");
    if (!order) navigate("/");
  }, [isLoggedIn, order, navigate]);

  if (!isLoggedIn || !order) return null;

  const isQris = order.paymentMethod === "qris";
  const isVA = order.paymentMethod === "virtual_account";

  const paymentInstructions = {
    qris: [
      "Buka aplikasi e-wallet kamu (GoPay, OVO, Dana, ShopeePay, dll)",
      "Pilih menu Scan QR atau Bayar",
      "Scan QR code yang diberikan kasir",
      "Masukkan nominal Rp " + order.total?.toLocaleString("id-ID"),
      "Konfirmasi pembayaran",
    ],
    virtual_account: [
      "Buka aplikasi mobile banking kamu",
      "Pilih menu Transfer → Virtual Account",
      "Masukkan nomor Virtual Account yang diberikan",
      "Masukkan nominal Rp " + order.total?.toLocaleString("id-ID"),
      "Konfirmasi pembayaran",
    ],
  };

  const instructions = isQris
    ? paymentInstructions.qris
    : isVA
    ? paymentInstructions.virtual_account
    : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Pending Icon */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Menunggu Pembayaran</h1>
          <p className="text-sm text-gray-400 text-center">
            Pesananmu sudah dibuat. Selesaikan pembayaran sebelum pesanan dibatalkan.
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-sm font-bold text-gray-900">{order.orderId}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Metode Pembayaran</p>
            <p className="text-sm font-semibold text-gray-700">
              {isQris && "QRIS"}
              {isVA && "Transfer Bank"}
            </p>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-sm font-bold text-violet-600">
              Rp {order.total?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {isQris
              ? <QrCode className="w-5 h-5 text-violet-500" />
              : <Building2 className="w-5 h-5 text-violet-500" />
            }
            <h2 className="text-base font-bold text-gray-900">Cara Pembayaran</h2>
          </div>

          <ol className="flex flex-col gap-3">
            {instructions.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-600">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Items Ordered */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-gray-900">Item Dipesan</h2>
          </div>

          <div className="flex flex-col gap-3">
            {order.items?.map((item) => (
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

export default OrderPending;