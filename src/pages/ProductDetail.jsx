// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, CheckCircle } from "lucide-react";
import { productService, cartService } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Produk tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const isOutOfStock = product?.stock === 0;

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (isOutOfStock) return;

    try {
      setAddingToCart(true);
      await cartService.addToCart(product._id, quantity);
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(err.response?.data?.message || "Gagal menambahkan ke keranjang");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="w-full h-80 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex flex-col gap-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-10 bg-gray-200 rounded-full animate-pulse w-1/2 mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-violet-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Kembali</span>
          </button>
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <p className="text-5xl">🔍</p>
            <p className="text-lg font-semibold">{error || "Produk tidak ditemukan"}</p>
            <button
              onClick={() => navigate("/products")}
              className="text-sm text-violet-500 font-semibold hover:underline"
            >
              Kembali ke toko
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-violet-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Kembali</span>
        </button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
            <img
              src={product.image?.url || "https://placehold.co/600x400?text=No+Image"}
              alt={product.name}
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full">
                  Stok Habis
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">

            {/* Category Badge */}
            {product.category && (
              <span className="self-start px-3 py-1 text-xs font-semibold bg-violet-100 text-violet-600 rounded-full">
                {product.category}
              </span>
            )}

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed">
              {product.description || "Tidak ada deskripsi untuk produk ini."}
            </p>

            {/* Price */}
            <p className="text-2xl font-bold text-violet-600">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            {/* Stock */}
            <p className={`text-sm font-medium ${isOutOfStock ? "text-red-400" : "text-green-500"}`}>
              {isOutOfStock ? "Stok habis" : `Stok tersedia: ${product.stock}`}
            </p>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">Jumlah:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecrease}
                    className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-500 transition-colors flex items-center justify-center font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-500 transition-colors flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Subtotal */}
            {!isOutOfStock && (
              <p className="text-sm text-gray-400">
                Subtotal:{" "}
                <span className="font-semibold text-gray-700">
                  Rp {(product.price * quantity).toLocaleString("id-ID")}
                </span>
              </p>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-md
                ${isOutOfStock || addingToCart
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              {addingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menambahkan...
                </>
              ) : addSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Ditambahkan!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;