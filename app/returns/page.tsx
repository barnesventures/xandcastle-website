import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges - Xandcastle',
  description: 'Learn about our 30-day returns and exchanges policy for kids clothing and Windsor souvenirs. Easy returns process. We want you to love your Xandcastle gear!',
  keywords: ['returns policy', 'exchanges', '30 day returns', 'refund policy', 'kids clothing returns'],
  openGraph: {
    title: 'Returns & Exchanges - Xandcastle',
    description: '30-day returns policy for kids clothing and Windsor souvenirs. Easy returns process.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://xandcastle.com/returns',
  },
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
          Returns & Exchanges
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-8 text-center">
              We want you to absolutely love your Xandcastle gear! If something's not quite right, 
              we're here to help.
            </p>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-purple">
                  🔄 30-Day Return Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  You have 30 days from delivery to return items for a full refund. Items must be:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Unworn and unwashed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>In original condition with tags attached</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Returned in original packaging</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-pink">
                  🎁 Exchanges
                </h2>
                <p className="text-gray-700 mb-4">
                  Need a different size or color? No problem! We're happy to exchange items within 30 days.
                </p>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                  <p className="font-semibold mb-2">Quick Tip:</p>
                  <p className="text-gray-700">
                    Check our size guide before ordering to ensure the perfect fit!
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-blue">
                  📮 How to Return
                </h2>
                <ol className="space-y-3 text-gray-700">
                  <li>
                    <strong>1.</strong> Email us at{' '}
                    <a href="mailto:returns@xandcastle.com" className="text-xandcastle-purple hover:underline">
                      returns@xandcastle.com
                    </a>{' '}
                    with your order number
                  </li>
                  <li>
                    <strong>2.</strong> We'll send you a prepaid return label (UK only)
                  </li>
                  <li>
                    <strong>3.</strong> Pack your items securely
                  </li>
                  <li>
                    <strong>4.</strong> Drop off at your nearest post office
                  </li>
                  <li>
                    <strong>5.</strong> Refund processed within 5-7 business days of receipt
                  </li>
                </ol>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-purple">
                  ❌ Non-Returnable Items
                </h2>
                <p className="text-gray-700 mb-4">
                  For hygiene reasons, we cannot accept returns on:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Face masks</li>
                  <li>• Underwear</li>
                  <li>• Items marked as final sale</li>
                  <li>• Custom or personalized items</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-xandcastle-pink">
                  🌍 International Returns
                </h2>
                <p className="text-gray-700">
                  International customers are responsible for return shipping costs. We recommend using 
                  a tracked service. Customs fees or duties are non-refundable.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-lg font-semibold text-yellow-800 mb-2">
                  💡 Damaged or Incorrect Items?
                </p>
                <p className="text-gray-700">
                  If you received a damaged or incorrect item, please contact us immediately with photos. 
                  We'll make it right with a replacement or full refund - no return needed!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}