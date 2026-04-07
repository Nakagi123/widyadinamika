// src/pages/ProductDetail.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";

// Placeholder — will be fetched from backend using the id param
const placeholderProduct = {
  id: null,
  name: "",
  price: 0,
  stock: 0,
  category: "",
  image: "https://placehold.co/600x400?text=Product+Image",
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product] = useState(placeholderProduct);
  const [quantity, setQuantity] = useState(1);
  const [loading] = useState(true); // will be false when backend is connected

  const isOutOfStock = product.stock === 0;

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  // When backend is ready, replace with:
  // useEffect(() => {
  //   fetch(`/api/products/${id}`)
  //     .then(res => res.json())
  //     .then(data => { setProduct(data); setLoading(false); });
  // }, [id]);

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

        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="w-full h-80 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex flex-col gap-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-10 bg-gray-200 rounded-full animate-pulse w-1/2 mt-4" />
            </div>
          </div>
        ) : (
          /* Product Detail */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 object-cover"
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
              <span className="self-start px-3 py-1 text-xs font-semibold bg-violet-100 text-violet-600 rounded-full">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

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
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 shadow-md
                  ${isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetail;