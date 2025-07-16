import Link from "next/link";
import FeaturedProducts from "./components/FeaturedProducts";
import WindsorCollection from "./components/WindsorCollection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-xandcastle-purple via-xandcastle-pink to-xandcastle-blue opacity-90"></div>
        <div className="relative z-10 text-white">
          <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to Xandcastle
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
              Unique clothing designs for kids and teens. Created by a young designer with big dreams!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-white text-xandcastle-purple px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/windsor"
                className="border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-xandcastle-purple transition transform hover:scale-105"
              >
                Windsor Collection
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16 sm:h-24">
            <path 
              fill="white" 
              d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,58.7C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
            Featured Products
          </h2>
          <FeaturedProducts />
        </div>
      </section>

      {/* Windsor Tourist Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-8 text-gray-900">
            Windsor Tourist Collection
          </h2>
          <p className="text-center text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto text-gray-700">
            Exclusive designs inspired by Windsor Castle and British heritage. Perfect souvenirs for your visit!
          </p>
          <WindsorCollection />
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">Our Story</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-gray-700 mb-4">
              Xandcastle is a creative clothing brand designed by a young artist who loves 
              fashion and self-expression. Every design tells a story and brings joy to 
              kids and teens who want to stand out and be themselves.
            </p>
            <p className="text-base sm:text-lg text-gray-700">
              From colorful everyday wear to special Windsor-inspired collections, 
              our clothes are made to inspire confidence and creativity in young people everywhere.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </main>
  );
}