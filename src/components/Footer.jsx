import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Widyadinamika Logo" className="h-8 w-auto" />
              <span className="text-lg font-bold text-gray-900 font-poppins">Widyadinamika</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Bersama Koperasi, Kebutuhan Sekolah Terpenuhi
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-900 mb-1">Menu</p>
              <Link to="/" className="text-sm text-gray-500 hover:text-violet-500 transition-colors">Home</Link>
              <Link to="/products" className="text-sm text-gray-500 hover:text-violet-500 transition-colors">Store</Link>
              <Link to="/cart" className="text-sm text-gray-500 hover:text-violet-500 transition-colors">Cart</Link>
              <Link to="/about" className="text-sm text-gray-500 hover:text-violet-500 transition-colors">About</Link>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-900 mb-1">Info</p>
              <span className="text-sm text-gray-500">SMK Negeri 7 Semarang</span>
              <span className="text-sm text-gray-500">Koperasi Sekolah</span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 mt-8 pt-4 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Widyadinamika. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;