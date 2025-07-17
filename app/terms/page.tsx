import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Xandcastle',
  description: 'Xandcastle terms of service - Our agreement with you.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Welcome to Xandcastle! These terms govern your use of our website and services.
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
                <p className="text-lg font-semibold text-xandcastle-blue mb-2">
                  📜 Simple Terms
                </p>
                <p className="text-gray-700">
                  We keep things fair and straightforward - just how we like our castle rules!
                </p>
              </div>
              
              <p className="text-center text-gray-600 italic">
                Full terms of service coming soon. For any questions, please contact us at{' '}
                <a href="mailto:hello@xandcastle.com" className="text-xandcastle-purple hover:underline">
                  hello@xandcastle.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}