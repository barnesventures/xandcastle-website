import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Xandcastle',
  description: 'Xandcastle privacy policy - Learn how we protect your data and respect your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                At Xandcastle, we take your privacy seriously. This policy explains how we collect, 
                use, and protect your personal information.
              </p>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
                <p className="text-lg font-semibold text-xandcastle-purple mb-2">
                  🔒 Your Privacy Matters
                </p>
                <p className="text-gray-700">
                  We're committed to protecting your data and being transparent about how we use it.
                </p>
              </div>
              
              <p className="text-center text-gray-600 italic">
                Full privacy policy coming soon. For any privacy concerns, please contact us at{' '}
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