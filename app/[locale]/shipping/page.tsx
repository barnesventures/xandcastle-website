import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information - Xandcastle',
  description: 'Learn about Xandcastle shipping options, delivery times, and international shipping for kids clothing and Windsor souvenirs. Fast UK delivery and worldwide shipping available.',
  keywords: ['shipping information', 'delivery times', 'international shipping', 'UK delivery', 'Windsor souvenirs shipping'],
  openGraph: {
    title: 'Shipping Information - Xandcastle',
    description: 'Fast UK delivery and worldwide shipping for kids clothing and Windsor souvenirs.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://xandcastle.com/shipping',
  },
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
          Shipping Information
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-purple">
                  🚀 Delivery Times
                </h2>
                <p className="text-gray-700 mb-4">
                  All our products are made-to-order with love! Here&apos;s when you can expect your awesome gear:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">🇬🇧</span>
                    <span><strong>UK:</strong> 5-7 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🇪🇺</span>
                    <span><strong>Europe:</strong> 7-10 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🌍</span>
                    <span><strong>Rest of World:</strong> 10-15 business days</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-pink">
                  📦 Shipping Costs
                </h2>
                <p className="text-gray-700 mb-4">
                  Shipping costs are calculated at checkout based on your location and order size.
                </p>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                  <p className="font-semibold text-xandcastle-purple mb-2">
                    🎉 Free Shipping Offers
                  </p>
                  <p className="text-gray-700">
                    Keep an eye out for special promotions and free shipping events throughout the year!
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-blue">
                  🌐 International Shipping
                </h2>
                <p className="text-gray-700 mb-4">
                  We ship to castle crews all around the world! International orders may be subject to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Local customs fees or import duties</li>
                  <li>• Additional processing time at customs</li>
                  <li>• Local VAT or taxes (not included in price)</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-purple">
                  📍 Order Tracking
                </h2>
                <p className="text-gray-700">
                  Once your order ships, you&apos;ll receive a confirmation email with tracking information. 
                  You can also track your order anytime by logging into your account or using our 
                  order tracking page.
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  Need Help?
                </p>
                <p className="text-gray-700">
                  If you have any questions about shipping or your order, email us at{' '}
                  <a href="mailto:hello@xandcastle.com" className="text-xandcastle-purple hover:underline">
                    hello@xandcastle.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}