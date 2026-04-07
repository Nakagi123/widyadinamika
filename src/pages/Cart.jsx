// src/pages/Cart.jsx
import { useState } from "react";
import { Trash2 } from "lucide-react";

// Placeholder cart items — will come from backend/context later
const initialCart = [
  { id: 1, name: "Nasi Goreng", price: 10000, quantity: 2, image: "https://placehold.co/100x100?text=Nasi+Goreng" },
  { id: 2, name: "Es Teh Manis", price: 5000, quantity: 1, image: "https://placehold.co/100x100?text=Es+Teh" },
  { id: 3, name: "Pensil 2B", price: 3000, quantity: 3, image: "https://placehold.co/100x100?text=Pensil" },
];

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
      />

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-violet-600 font-bold">
          Rp {item.price.toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-gray-400">
          Subtotal: Rp {(item.price * item.quantity).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrease(item.id)}
          className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-500 transition-colors flex items-center justify-center font-bold"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold text-gray-900">
          {item.quantity}
        </span>
        <button
          onClick={() => onIncrease(item.id)}
          className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-500 transition-colors flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>

    </div>
  );
}

function Cart() {
  const [cartItems, setCartItems] = useState(initialCart);

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Keranjang</h1>
          <p className="text-gray-500 mt-1">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} di keranjangmu
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <p className="text-5xl">🛒</p>
            <p className="text-lg font-semibold">Keranjangmu kosong</p>
            <p className="text-sm">Yuk belanja dulu!</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal ({cartItems.length} item)</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Biaya layanan</span>
                <span>Rp 0</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Cart;