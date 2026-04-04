import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
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

function Home() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />

      {/* Hero Section */}
      <main className="px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 items-center min-h-[calc(100vh-72px)]">
          
          {/* Text content */}
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl lg:text-8xl font-bold text-gray-900 leading-tight tracking-tight">
                Welcome to <br />
                <span className="text-violet-500">Widyanamika</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                Bersama Koperasi, Kebutuhan Sekolah Terpenuhi
              </p>
            </div>

            <div>
              <Link
                to="/learn"
                className="inline-block px-6 py-3 text-sm font-semibold text-white bg-violet-900 rounded-full hover:bg-violet-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Learning →
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xl font-bold text-gray-900">12k+</p>
                <p className="text-xs text-gray-400 mt-0.5">Active learners</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-xl font-bold text-gray-900">200+</p>
                <p className="text-xs text-gray-400 mt-0.5">Courses</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-xl font-bold text-gray-900">4.9★</p>
                <p className="text-xs text-gray-400 mt-0.5">Rating</p>
              </div>
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
    </div>
  );
}

export default Home;