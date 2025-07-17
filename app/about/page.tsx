import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Xandcastle - Cool Clothing for Creative Kids',
  description: 'Discover the story behind Xandcastle - where imagination meets fashion. Creating unique, fun clothing designs for kids and teens who dare to be different.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-xandcastle-purple to-xandcastle-pink text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
            Welcome to the Castle! 🏰
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto opacity-90">
            Where imagination meets awesome threads!
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
              Our Story
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                Once upon a time, in a world full of boring clothes, a creative soul decided enough was enough! 
                Armed with wild imagination and a love for all things cool, Xandcastle was born - a magical 
                kingdom where every t-shirt tells a story and every design sparks joy.
              </p>
              
              <p>
                We believe that clothes should be as unique and awesome as the kids who wear them. That's why 
                every Xandcastle design is crafted with love, sprinkled with creativity, and made to make you 
                smile. From castle-themed adventures to the coolest graphics this side of the playground, 
                we're here to help you express your amazing self!
              </p>
              
              <p>
                Whether you're exploring Windsor Castle, hanging with friends, or just being your awesome self, 
                Xandcastle has got your back (literally!). Our special Windsor Collection celebrates the magic 
                of one of the world's most famous castles with designs that are totally tourist-approved and 
                local-loved!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-xandcastle-blue to-xandcastle-purple bg-clip-text text-transparent">
              Our Mission
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                To create the coolest, most creative clothing that lets every kid and teen 
                shine bright like the stars they are! We're on a mission to banish boring 
                from wardrobes everywhere and replace it with designs that spark joy, 
                inspire confidence, and maybe even start a few conversations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-xandcastle-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Creativity First</h3>
                  <p className="text-gray-600">Every design is a work of art</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-xandcastle-pink rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Quality Matters</h3>
                  <p className="text-gray-600">Comfy, durable, and made to last</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-xandcastle-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Fun Always</h3>
                  <p className="text-gray-600">Because life's too short for boring clothes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Xandcastle */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-xandcastle-pink to-xandcastle-blue bg-clip-text text-transparent">
              Why Choose Xandcastle?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4 text-xandcastle-purple">
                  🎨 Unique Designs
                </h3>
                <p className="text-gray-700">
                  No cookie-cutter stuff here! Every design is original, creative, and made to 
                  help you stand out from the crowd. Be yourself, be awesome, be Xandcastle!
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4 text-xandcastle-blue">
                  🏰 Windsor Collection
                </h3>
                <p className="text-gray-700">
                  Our special Windsor-themed designs celebrate the magic of the famous castle. 
                  Perfect for tourists and locals who want to show their castle pride!
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4 text-xandcastle-pink">
                  🌈 Kid-Approved
                </h3>
                <p className="text-gray-700">
                  Designed with kids and teens in mind! Comfortable fits, fun graphics, and 
                  styles that you'll actually want to wear. Parents love them too!
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4 text-xandcastle-purple">
                  💝 Made with Love
                </h3>
                <p className="text-gray-700">
                  Every order is handled with care. We use quality materials and print-on-demand 
                  technology to ensure your Xandcastle gear is perfect every time!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
              Get in Touch!
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-lg text-gray-700 mb-8">
                Got questions? Want to share your awesome Xandcastle pics? Or just want to say hi? 
                We'd love to hear from you!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📧</span>
                  <a href="mailto:hello@xandcastle.com" className="text-xandcastle-purple hover:underline text-lg">
                    hello@xandcastle.com
                  </a>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📍</span>
                  <span className="text-lg text-gray-700">
                    Shipping worldwide from the UK!
                  </span>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-gray-600">
                    Follow us on social media for the latest designs, special offers, and castle adventures!
                  </p>
                  <div className="flex justify-center space-x-6 mt-6">
                    <a href="#" className="text-3xl hover:text-xandcastle-purple transition">
                      📷
                    </a>
                    <a href="#" className="text-3xl hover:text-xandcastle-pink transition">
                      🐦
                    </a>
                    <a href="#" className="text-3xl hover:text-xandcastle-blue transition">
                      📘
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Castle Crew?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing designs that'll make you smile!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-xandcastle-purple px-8 py-3 rounded-full font-semibold hover:shadow-lg transition inline-block"
            >
              Shop Now
            </Link>
            <Link
              href="/windsor"
              className="bg-white/20 backdrop-blur text-white border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition inline-block"
            >
              Explore Windsor Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}