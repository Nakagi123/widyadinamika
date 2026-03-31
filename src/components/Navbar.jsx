import React, { useState } from "react";
import { Link } from "react-router-dom";


function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <img src={logo} alt="Logo" className="h-12 md:h-16 w-auto" />

          {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 text-lg font-semibold">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-sky-500 transition-colors duration-200 py-2"
              >
                Home
              </Link>
              <a 
                href="#about" 
                className="text-gray-700 hover:text-sky-500 transition-colors duration-200 py-2"
              >
                About
              </a>
              <Link 
                to="/emailform" 
                className="text-gray-700 hover:text-sky-500 transition-colors duration-200 py-2"
              >
                Contact
              </Link>
            </nav>


          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col space-y-1.5 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col space-y-3 py-4 border-t border-gray-200">
            <Link
              to="/" 
              className="text-gray-700 hover:text-sky-500 font-semibold transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <a 
              href="#about" 
              className="text-gray-700 hover:text-sky-500 font-semibold transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <Link 
              to="/emailform" 
              className="text-gray-700 hover:text-sky-500 font-semibold transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;