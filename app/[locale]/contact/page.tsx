import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Xandcastle',
  description: 'Get in touch with Xandcastle. We love hearing from our castle crew! Questions about orders, Windsor collection, or just want to say hi? Contact us today.',
  keywords: ['contact Xandcastle', 'customer service', 'kids clothing support', 'Windsor collection enquiries', 'email Xandcastle'],
  openGraph: {
    title: 'Contact Us - Xandcastle',
    description: 'Get in touch with Xandcastle. Questions about orders or just want to say hi? We love hearing from our castle crew!',
    type: 'website',
  },
  alternates: {
    canonical: 'https://xandcastle.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
          Contact Us
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-8">
              Got questions? Want to share your awesome Xandcastle pics? Or just want to say hi? 
              We&apos;d love to hear from you!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">📧</span>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a href="mailto:hello@xandcastle.com" className="text-xandcastle-purple hover:underline">
                    hello@xandcastle.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-3xl">📍</span>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-gray-600">Shipping worldwide from the UK!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-3xl">⏰</span>
                <div>
                  <h3 className="font-semibold">Response Time</h3>
                  <p className="text-gray-600">We usually respond within 24-48 hours</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <p className="text-gray-600 mb-4">
                Stay connected for the latest designs and castle adventures!
              </p>
              <div className="flex space-x-6">
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
  );
}