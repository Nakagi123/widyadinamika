import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, CircleUserRound, LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth(); // ✅ Changed from isLoggedIn to isAuthenticated
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Widyadinamika Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900 font-poppins">Widyadinamika</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-base font-semibold items-center">
            <Link to="/" className="text-gray-700 hover:text-violet-500 transition-colors duration-200 py-2">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-violet-500 transition-colors duration-200 py-2">
              Store
            </Link>
            <Link to="/cart" className="flex items-center gap-1 text-gray-700 hover:text-violet-500 transition-colors duration-200 py-2">
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>

            {/* Auth section */}
            {isAuthenticated ? (  // ✅ Changed from isLoggedIn to isAuthenticated
              <div className="flex items-center gap-3">
                <Link 
                  className="flex items-center gap-1 text-gray-700 text-sm hover:text-violet-500"
                  to={user?.role === 'kasir' ? "/admin" : "/user"}  // ✅ Role-based dashboard link
                >
                  <CircleUserRound className="w-5 h-5 text-violet-500" />
                  {user?.username}  {/* ✅ Changed from user.name to user.username */}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1 text-gray-700 hover:text-violet-500 transition-colors duration-200 py-2"
              >
                <CircleUserRound className="w-5 h-5" />
                Masuk
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col space-y-3 py-4 border-t border-gray-200">
            <Link to="/" className="text-gray-700 hover:text-violet-500 font-semibold transition-colors duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-violet-500 font-semibold transition-colors duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
              Store
            </Link>
            <Link to="/cart" className="flex items-center gap-1 text-gray-700 hover:text-violet-500 font-semibold transition-colors duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>
            
            {isAuthenticated ? (  // ✅ Changed from isLoggedIn to isAuthenticated
              <>
                <Link 
                  to={user?.role === 'kasir' ? "/admin" : "/user"}  // ✅ Role-based dashboard link
                  className="flex items-center gap-1 text-gray-700 hover:text-violet-500 font-semibold transition-colors duration-200 py-2" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CircleUserRound className="w-5 h-5 text-violet-500" />
                  {user?.username}  {/* ✅ Changed from user.name to user.username */}
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-1 text-red-400 hover:text-red-500 font-semibold transition-colors duration-200 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </>
            ) : (
              <Link to="/auth" className="flex items-center gap-1 text-gray-700 hover:text-violet-500 font-semibold transition-colors duration-200 py-2" onClick={() => setIsMenuOpen(false)}>
                <CircleUserRound className="w-5 h-5" />
                Masuk
              </Link>
            )}
          </nav>
        </div>

      </div>
    </header>
  );
}

export default Navbar;