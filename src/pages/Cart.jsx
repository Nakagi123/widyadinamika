import { useState, useEffect } from "react";
import { Trash2, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cartService } from "../lib/api";

function CartItem({ item, onIncrease, onDecrease, onRemove, isUpdating }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      
      {/* Image */}
      <img
        src={item.productImage || item.product?.image?.url || "https://placehold.co/100x100?text=No+Image"}
        alt={item.productName || item.product?.name}
        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
        onError={(e) => {
          e.target.src = "https://placehold.co/100x100?text=No+Image";
        }}
      />

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900">{item.productName || item.product?.name}</h3>
        <p className="text-violet-600 font-bold">
          Rp {(item.price || item.product?.price).toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-gray-400">
          Subtotal: Rp {((item.price || item.product?.price) * item.quantity).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrease(item.product?._id || item.productId)}
          disabled={isUpdating}
          className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-500 transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold text-gray-900">
          {item.quantity}
        </span>
        <button
          onClick={() => onIncrease(item.product?._id || item.productId)}
          disabled={isUpdating}
          className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-500 transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.product?._id || item.productId)}
        disabled={isUpdating}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-5 h-5" />
      </button>

    </div>
  );
}

function Cart() {
  const { isAuthenticated, isKasir } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      // The cart response has { items: [], totalPrice: 0 }
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
    // Redirect kasir users away from cart
    if (isKasir) {
      navigate("/admin");
      return;
    }
    // Redirect non-authenticated users to login
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    // Fetch cart
    fetchCart();
  }, [isAuthenticated, isKasir, navigate]);

  const handleIncrease = async (productId) => {
    if (!productId) return;
    
    const currentItem = cartItems.find(item => 
      (item.product?._id === productId || item.productId === productId)
    );
    const newQuantity = (currentItem?.quantity || 1) + 1;
    
    setUpdatingItemId(productId);
    try {
      await cartService.updateCartItem(productId, newQuantity);
      await fetchCart(); // Refresh cart
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert(err.response?.data?.message || "Gagal mengupdate jumlah");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDecrease = async (productId) => {
    if (!productId) return;
    
    const currentItem = cartItems.find(item => 
      (item.product?._id === productId || item.productId === productId)
    );
    
    if (!currentItem) return;
    
    if (currentItem.quantity === 1) {
      // If quantity is 1, remove the item
      await handleRemove(productId);
      return;
    }
    
    const newQuantity = currentItem.quantity - 1;
    
    setUpdatingItemId(productId);
    try {
      await cartService.updateCartItem(productId, newQuantity);
      await fetchCart(); // Refresh cart
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert(err.response?.data?.message || "Gagal mengupdate jumlah");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (productId) => {
    if (!productId) return;
    
    setUpdatingItemId(productId);
    try {
      await cartService.removeCartItem(productId);
      await fetchCart(); // Refresh cart
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert(err.response?.data?.message || "Gagal menghapus item");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) return;
    
    try {
      await cartService.clearCart();
      await fetchCart(); // Refresh cart
      alert("Keranjang berhasil dikosongkan");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      alert(err.response?.data?.message || "Gagal mengosongkan keranjang");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity,
    0
  );

  // Don't render anything while redirecting
  if (!isAuthenticated || isKasir) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchCart}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Keranjang</h1>
            <p className="text-gray-500 mt-1">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} di keranjangmu
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Kosongkan Keranjang
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <p className="text-5xl">🛒</p>
            <p className="text-lg font-semibold">Keranjangmu kosong</p>
            <p className="text-sm">Yuk belanja dulu!</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
            >
              Lihat Produk
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.product?._id || item.productId}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                  isUpdating={updatingItemId === (item.product?._id || item.productId)}
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

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all duration-200 mt-2"
            >
              Lanjut ke Pembayaran →
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Cart;