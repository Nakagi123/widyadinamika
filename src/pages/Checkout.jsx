// src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cartService, paymentService } from "../lib/api";
import { ShoppingBag, CreditCard, ChevronRight, Wallet, Loader } from "lucide-react";

const paymentMethods = [
  { id: "cash", label: "Bayar di Tempat", description: "Bayar langsung dengan cash di koperasi sekolah" },
  { id: "qris", label: "QRIS", description: "GoPay, OVO, Dana, ShopeePay, dll" },
  { id: "transfer", label: "Transfer Bank", description: "BCA, BNI, BRI, Mandiri" },
];

function Checkout() {
  const { isAuthenticated, isKasir } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.data.items || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError(err.message || "Gagal memuat keranjang");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isKasir) {
      navigate("/admin");
      return;
    }
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    fetchCart();
  }, [isAuthenticated, isKasir, navigate]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Prepare items for API - product is the ID directly from cart
    const items = cartItems.map(item => ({
      productId: item.product,
      quantity: item.quantity
    }));

    console.log("Checkout items:", items);

    try {
      const response = await paymentService.checkout(items, selectedPayment);
      console.log("Checkout response:", response.data);
      
      if (selectedPayment === "cash") {
        // Cash payment - redirect to success page with order info
        navigate("/orders/success", {
          state: {
            orderId: response.data.orderId,
            total: response.data.totalPrice,
            items: cartItems,
            paymentMethod: "cash",
            message: response.data.message
          }
        });
      } else if (response.data.invoiceUrl) {
        // Online payment - redirect to Xendit payment page
        window.location.href = response.data.invoiceUrl;
      } else {
        setError("Terjadi kesalahan, silakan coba lagi");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      const errorMsg = err.response?.data?.message || err.message || "Gagal memproses pesanan";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isCash = selectedPayment === "cash";

  if (!isAuthenticated || isKasir) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-400 mt-1">Periksa pesananmu sebelum membayar</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-400 mb-4">Keranjang Anda kosong</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700"
            >
              Belanja Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-400 mt-1">Periksa pesananmu sebelum membayar</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-gray-900">Ringkasan Pesanan</h2>
          </div>

          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center gap-3">
                <img
                  src={item.productImage || "https://placehold.co/100x100?text=No+Image"}
                  alt={item.productName}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=No+Image";
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-400">{item.quantity}x Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <p className="text-sm font-bold text-violet-600">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal ({cartItems.length} item)</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Biaya layanan</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-1">
              <span>Total</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-gray-900">Metode Pembayaran</h2>
          </div>

          <div className="flex flex-col gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200
                  ${selectedPayment === method.id
                    ? "border-violet-400 bg-violet-50"
                    : "border-gray-200 hover:border-violet-200"
                  }`}
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                  <p className="text-xs text-gray-400">{method.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all
                  ${selectedPayment === method.id
                    ? "border-violet-500 bg-violet-500"
                    : "border-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Cash notice */}
          {isCash && (
            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
              <Wallet className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                Pesananmu akan dibuat dan menunggu konfirmasi pembayaran dari kasir. 
                Tunjukkan ID pesanan saat membayar di koperasi.
              </p>
            </div>
          )}
        </div>

        {/* Pay Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing || cartItems.length === 0}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md
            ${isProcessing || cartItems.length === 0
              ? "bg-violet-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            }`}
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              {isCash ? "Buat Pesanan" : "Bayar Sekarang"} — Rp {total.toLocaleString("id-ID")}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

      </div>
    </div>
  );
}

export default Checkout;