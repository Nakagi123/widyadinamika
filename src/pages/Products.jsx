// src/pages/Products.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = ["All", "Makanan", "Minuman", "Alat Tulis", "Seragam", "Lainnya"];

const products = [
  { id: 1, name: "Nasi Goreng", price: 10000, stock: 15, category: "Makanan", image: "https://placehold.co/300x200?text=Nasi+Goreng" },
  { id: 2, name: "Es Teh Manis", price: 5000, stock: 30, category: "Minuman", image: "https://placehold.co/300x200?text=Es+Teh" },
  { id: 3, name: "Pensil 2B", price: 3000, stock: 50, category: "Alat Tulis", image: "https://placehold.co/300x200?text=Pensil" },
  { id: 4, name: "Buku Tulis", price: 8000, stock: 0, category: "Alat Tulis", image: "https://placehold.co/300x200?text=Buku+Tulis" },
  { id: 5, name: "Mie Goreng", price: 12000, stock: 10, category: "Makanan", image: "https://placehold.co/300x200?text=Mie+Goreng" },
  { id: 6, name: "Air Mineral", price: 4000, stock: 25, category: "Minuman", image: "https://placehold.co/300x200?text=Air+Mineral" },
  { id: 7, name: "Penggaris 30cm", price: 5000, stock: 20, category: "Alat Tulis", image: "https://placehold.co/300x200?text=Penggaris" },
  { id: 8, name: "Seragam Putih", price: 85000, stock: 5, category: "Seragam", image: "https://placehold.co/300x200?text=Seragam" },
];

function ProductCard({ product }) {
  const navigate = useNavigate(); // ✅ inside the component
  const isOutOfStock = product.stock === 0;

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className={`cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-md ${isOutOfStock ? "opacity-60" : ""}`} // ✅ no literal "..."
    >
      {/* Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-base">{product.name}</h3>
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
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Produk Kami</h1>
          <p className="text-gray-500 mt-1">Temukan kebutuhan sekolahmu di sini</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                ${activeCategory === cat
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-violet-400 hover:text-violet-500"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Tidak ada produk di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Products;