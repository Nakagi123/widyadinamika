// AdminProducts.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { productService } from "../../lib/api";
import { 
  Plus, Edit2, Trash2, X, Search, 
  Package, Save, Upload, Image as ImageIcon, Loader
} from "lucide-react";

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img 
          src={product.image?.url || "https://via.placeholder.com/200x200?text=No+Image"} 
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {product.description || "Tidak ada deskripsi"}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-violet-600">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            product.stock > 10 ? "bg-green-100 text-green-700" :
            product.stock > 0 ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-600"
          }`}>
            Stok: {product.stock}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-semibold"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageUploader({ currentImage, onImageUpload, isUploading }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onImageUpload(previewUrl, file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      onImageUpload(previewUrl, file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Gambar Produk
      </label>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative group cursor-pointer"
      >
        {currentImage ? (
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-violet-400 transition-colors">
            <img 
              src={currentImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-semibold">Ganti Gambar</p>
                <p className="text-xs">Klik atau drag & drop</p>
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50 transition-all flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">Upload Gambar</p>
              <p className="text-xs text-gray-400 mt-1">Klik atau drag & drop</p>
              <p className="text-xs text-gray-400">PNG, JPG (Max 5MB)</p>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {currentImage && (
        <button
          type="button"
          onClick={() => onImageUpload(null, null)}
          className="text-xs text-red-500 hover:text-red-600 font-medium"
        >
          Hapus Gambar
        </button>
      )}
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    stock: product?.stock || "",
    description: product?.description || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(product?.image?.url || "");

  const handleImageUpload = (url, file) => {
    if (file) {
      setImageFile(file);
      setPreviewUrl(url);
    } else {
      setImageFile(null);
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Mohon isi semua field yang diperlukan");
      return;
    }
    
    setIsSubmitting(true);
    
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", Number(formData.price));
    submitData.append("stock", Number(formData.stock));
    submitData.append("description", formData.description);
    
    if (imageFile) {
      submitData.append("image", imageFile);
    }
    
    try {
      await onSave(submitData, product?._id);
      // Form will be closed by parent after successful save
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Image Upload */}
            <div>
              <ImageUploader 
                currentImage={previewUrl}
                onImageUpload={handleImageUpload}
                isUploading={false}
              />
            </div>
            
            {/* Right Column - Product Details */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                  placeholder="Contoh: Buku Tulis"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="0"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stok <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="0"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  placeholder="Deskripsi lengkap tentang produk..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {product ? "Simpan Perubahan" : "Tambah Produk"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminProducts() {
  const { isAuthenticated, isKasir } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from API
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isKasir) {
      navigate("/");
    } else {
      fetchProducts();
    }
  }, [isAuthenticated, isKasir, navigate]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await productService.deleteProduct(id);
        await fetchProducts(); // Refresh list
        alert("✅ Produk berhasil dihapus");
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert(err.response?.data?.message || "❌ Gagal menghapus produk");
      }
    }
  };

  const handleSaveProduct = async (formData, productId) => {
    try {
      if (productId) {
        // Update existing product
        await productService.updateProduct(productId, formData);
        alert("✅ Produk berhasil diupdate");
      } else {
        // Create new product
        await productService.createProduct(formData);
        alert("✅ Produk berhasil ditambahkan");
      }
      await fetchProducts(); // Refresh list
      setShowForm(false); // Close the form
      setEditingProduct(null); // Clear editing product
    } catch (err) {
      console.error("Failed to save product:", err);
      const errorMsg = err.response?.data?.message || "❌ Gagal menyimpan produk";
      alert(errorMsg);
      throw err; // Re-throw to let form know it failed
    }
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                       (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  if (!isAuthenticated || !isKasir) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link 
                to="/admin" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Kelola Produk</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="text-gray-400 mt-1 text-sm">Tambah, edit, atau hapus produk toko</p>
          </div>
          
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Package className="w-16 h-16 stroke-1" />
            <p className="font-semibold">Tidak ada produk ditemukan</p>
            <button
              onClick={handleAddProduct}
              className="mt-2 text-violet-600 hover:text-violet-700 font-medium"
            >
              Tambah produk sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AdminProducts;