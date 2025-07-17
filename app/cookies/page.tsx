import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Xandcastle',
  description: 'Xandcastle cookie policy - Learn how we use cookies to improve your shopping experience for kids clothing and Windsor souvenirs. GDPR compliant cookie usage.',
  keywords: ['cookie policy', 'cookies', 'GDPR cookies', 'website cookies', 'privacy cookies'],
  openGraph: {
    title: 'Cookie Policy - Xandcastle',
    description: 'Learn how we use cookies to improve your shopping experience.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://xandcastle.com/cookies',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                We use cookies to make your Xandcastle experience even more awesome!
              </p>
              
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg mb-8">
                <p className="text-lg font-semibold text-xandcastle-pink mb-2">
                  🍪 What are cookies?
                </p>
                <p className="text-gray-700">
                  Small files that help us remember your preferences and make the site work better - 
                  like digital breadcrumbs in our castle!
                </p>
              </div>
              
              <p className="text-center text-gray-600 italic">
                Full cookie policy coming soon. For any questions about cookies, please contact us at{' '}
                <a href="mailto:privacy@xandcastle.com" className="text-xandcastle-purple hover:underline">
                  privacy@xandcastle.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}