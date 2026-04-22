// AdminProducts.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Plus, Edit2, Trash2, X, Check, Search, 
  Package, ChevronLeft, ChevronRight, Save, 
  Upload, Image as ImageIcon, Loader
} from "lucide-react";

// Initial products data
const initialProducts = [
  {
    id: 1,
    name: "Seragam Putih",
    price: 85000,
    stock: 2,
    category: "Seragam",
    image: "https://via.placeholder.com/200x200?text=Seragam+Putih",
    description: "Seragam putih untuk upacara dan kegiatan formal sekolah. Bahan katun nyaman dan adem."
  },
  {
    id: 2,
    name: "Buku Tulis",
    price: 8000,
    stock: 3,
    category: "Alat Tulis",
    image: "https://via.placeholder.com/200x200?text=Buku+Tulis",
    description: "Buku tulis 38 lembar, kertas berkualitas tidak mudah sobek."
  },
  {
    id: 3,
    name: "Pensil 2B",
    price: 3000,
    stock: 4,
    category: "Alat Tulis",
    image: "https://via.placeholder.com/200x200?text=Pensil+2B",
    description: "Pensil 2B untuk ujian dan menggambar, ujung tidak mudah patah."
  },
  {
    id: 4,
    name: "Nasi Goreng",
    price: 10000,
    stock: 50,
    category: "Makanan",
    image: "https://via.placeholder.com/200x200?text=Nasi+Goreng",
    description: "Nasi goreng spesial dengan telur dan kerupuk."
  },
  {
    id: 5,
    name: "Mie Goreng",
    price: 12000,
    stock: 45,
    category: "Makanan",
    image: "https://via.placeholder.com/200x200?text=Mie+Goreng",
    description: "Mie goreng dengan sayuran dan telur."
  },
  {
    id: 6,
    name: "Es Teh Manis",
    price: 5000,
    stock: 100,
    category: "Minuman",
    image: "https://via.placeholder.com/200x200?text=Es+Teh+Manis",
    description: "Es teh manis segar dengan gula asli."
  },
  {
    id: 7,
    name: "Air Mineral",
    price: 4000,
    stock: 80,
    category: "Minuman",
    image: "https://via.placeholder.com/200x200?text=Air+Mineral",
    description: "Air mineral kemasan 600ml."
  },
];

const categories = ["Semua Kategori", "Seragam", "Alat Tulis", "Makanan", "Minuman"];

function ProductCard({ product, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img 
          src={product.image} 
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
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
            {product.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {product.description}
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
            onClick={() => onDelete(product.id)}
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
              <p className="text-xs text-gray-400">PNG, JPG, GIF (Max 5MB)</p>
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
      
      <p className="text-xs text-gray-400">
        Catatan: Untuk sementara menggunakan preview lokal. Integrasi Cloudinary akan segera tersedia.
      </p>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || categories[1],
    image: product?.image || "",
    description: product?.description || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (previewUrl, file) => {
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, image: previewUrl });
      
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    } else {
      setImageFile(null);
      setFormData({ ...formData, image: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Mohon isi semua field yang diperlukan");
      return;
    }
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      id: product?.id,
    };
    
    if (!productData.image) {
      productData.image = "https://via.placeholder.com/200x200?text=No+Image";
    }
    
    onSave(productData);
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
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Image Upload */}
            <div>
              <ImageUploader 
                currentImage={formData.image}
                onImageUpload={handleImageUpload}
                isUploading={isUploading}
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
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                >
                  {categories.filter(c => c !== "Semua Kategori").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              disabled={isUploading}
            >
              <Save className="w-4 h-4" />
              {product ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
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
  const { isAuthenticated, isKasir } = useAuth(); // CHANGED: isLoggedIn → isAuthenticated, isAdmin → isKasir
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // CHANGED: Check if not authenticated or not kasir
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isKasir) {
      navigate("/");
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

  const handleDeleteProduct = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (productData) => {
    if (productData.id) {
      setProducts(products.map(p => 
        p.id === productData.id ? { ...productData } : p
      ));
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, { ...productData, id: newId }]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                       product.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "Semua Kategori" || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // CHANGED: Check if not authenticated or not kasir
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

        {/* Search and Filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk berdasarkan nama atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
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
                key={product.id}
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