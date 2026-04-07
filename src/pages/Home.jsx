import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"
import heroIllustration from "../assets/hero-image.png";

const HeroImage = () => (
  <div className="relative w-full max-w-lg mx-auto">
    <img
      src={heroIllustration}
      alt="Hero illustration"
      className="w-full h-auto object-contain"
    />
  </div>
);

const tags = ["Terpercaya", "Harga Bersahabat", "Produk Lengkap", "Mudah Dijangkau", "Produk Berkualitas"];

function Home() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />

      {/* Hero Section */}
      <main className="px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-72px)]">

          {/* Text content */}
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Welcome to <br />
                <span className="text-violet-500">Widyadinamika</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed italic">
                Bersama Koperasi, Kebutuhan Sekolah Terpenuhi
              </p>
            </div>

            <div>
              <Link
                to="/products"
                className="inline-block px-6 py-3 text-sm font-semibold text-white bg-violet-600 rounded-full hover:bg-violet-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Cek Produk →
              </Link>
            </div>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="order-1 md:order-2 animate-fade-in">
            <HeroImage />
          </div>

        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }
      `}</style>
    <Footer />
    </div>
  );
}

export default Home;