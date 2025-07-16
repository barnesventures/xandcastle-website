import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-xandcastle-purple via-xandcastle-pink to-xandcastle-blue text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to Xandcastle
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Unique clothing designs for kids and teens. Created by a young designer with big dreams!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/windsor"
              className="border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition"
            >
              Windsor Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product cards will be populated from Printify API */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-600">Products loading...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Windsor Tourist Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Windsor Tourist Collection
          </h2>
          <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
            Exclusive designs inspired by Windsor Castle and British heritage. Perfect souvenirs!
          </p>
          <div className="text-center">
            <Link
              href="/windsor"
              className="bg-xandcastle-blue text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition inline-block"
            >
              View Windsor Collection
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Xandcastle is a creative clothing brand designed by a young artist who loves 
            fashion and self-expression. Every design tells a story and brings joy to 
            kids and teens who want to stand out and be themselves.
          </p>
        </div>
      </section>
    </main>
  );
}