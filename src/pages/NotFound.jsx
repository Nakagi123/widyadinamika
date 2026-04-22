// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Home, ShoppingBag, AlertCircle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-16 h-16 text-violet-500" />
          </div>
          <h1 className="text-8xl font-bold text-violet-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-8">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-violet-300 hover:text-violet-500 transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Lihat Produk
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-3">Atau coba salah satu link ini:</p>
          <div className="flex gap-4 justify-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-violet-600">Home</Link>
            <Link to="/products" className="text-gray-500 hover:text-violet-600">Products</Link>
            <Link to="/user" className="text-gray-500 hover:text-violet-600">Dashboard</Link>
            <Link to="/auth" className="text-gray-500 hover:text-violet-600">Login</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotFound;