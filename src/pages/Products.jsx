// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../lib/api";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className={`cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-md ${isOutOfStock ? "opacity-60" : ""}`}
    >
      <div className="relative h-40 bg-gray-100">
        <img
          src={product.image?.url || "https://placehold.co/300x200?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/300x200?text=No+Image";
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full">
              Habis
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{product.name}</h3>
        <p className="text-violet-600 font-bold text-lg">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        <p className={`text-xs font-medium ${isOutOfStock ? "text-red-400" : "text-green-500"}`}>
          {isOutOfStock ? "Stok habis" : `Stok: ${product.stock}`}
        </p>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.message || "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
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
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
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
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Produk Kami</h1>
          <p className="text-gray-500 mt-1">Temukan kebutuhan sekolahmu di sini</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Belum ada produk tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;