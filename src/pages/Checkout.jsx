// src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, MapPin, CreditCard, ChevronRight } from "lucide-react";

// Dummy cart items — replace with real cart data later
const dummyCartItems = [
  { id: 1, name: "Nasi Goreng", price: 10000, quantity: 2, image: "https://placehold.co/100x100?text=Nasi+Goreng" },
  { id: 2, name: "Es Teh Manis", price: 5000, quantity: 1, image: "https://placehold.co/100x100?text=Es+Teh" },
  { id: 3, name: "Pensil 2B", price: 3000, quantity: 3, image: "https://placehold.co/100x100?text=Pensil" },
];

const paymentMethods = [
  { id: "qris", label: "QRIS", description: "GoPay, OVO, Dana, ShopeePay, dll" },
  { id: "bank_transfer", label: "Transfer Bank", description: "BCA, BNI, BRI, Mandiri" },
  { id: "gopay", label: "GoPay", description: "Bayar langsung dengan GoPay" },
];

const pickupLocations = [
  { id: "koperasi", label: "Koperasi Sekolah", description: "Gedung A, Lantai 1" },
  { id: "kantin", label: "Kantin", description: "Gedung B, Lantai 1" },
];

function Checkout() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [cartItems] = useState(dummyCartItems);
  const [selectedPayment, setSelectedPayment] = useState("qris");
  const [selectedPickup, setSelectedPickup] = useState("koperasi");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsProcessing(true);

    // TODO: replace with real backend call + Midtrans Snap
    // const res = await fetch("/api/orders/create", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ cartItems, paymentMethod: selectedPayment, pickup: selectedPickup })
    // });
    // const { token } = await res.json();
    // window.snap.pay(token, {
    //   onSuccess: () => navigate("/orders/success"),
    //   onPending: () => navigate("/orders/pending"),
    //   onError: () => setIsProcessing(false),
    //   onClose: () => setIsProcessing(false),
    // });

    // Simulate for now
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-400 mt-1">Periksa pesananmu sebelum membayar</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-500" />
            <h2 className="text-lg font-bold text-gray-900">Ringkasan Pesanan</h2>
          </div>

          <div className="flex flex-col gap-3">
            {cartItems.map((item) => (
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
        </div>

        {/* Pay Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-md
            ${isProcessing
              ? "bg-violet-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            }`}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Memproses...
            </>
          ) : (
            <>
              Bayar Sekarang — Rp {total.toLocaleString("id-ID")}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

      </div>
    </div>
  );
}

export default Checkout;