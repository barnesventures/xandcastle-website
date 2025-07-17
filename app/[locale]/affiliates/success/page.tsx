import { Metadata } from 'next';
import LocalizedLink from '@/app/components/LocalizedLink';

export const metadata: Metadata = {
  title: 'Application Submitted | Xandcastle Affiliate Program',
  description: 'Thank you for applying to the Xandcastle affiliate program',
};

export default function AffiliateSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
      <div className="bg-green-50 rounded-lg p-8 mb-8">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
        
        <p className="text-lg text-gray-700 mb-6">
          Thank you for applying to the Xandcastle Affiliate Program. We've received your application
          and will review it within 2-3 business days.
        </p>
        
        <div className="bg-white rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold mb-3">What happens next?</h2>
          <ol className="space-y-2 text-gray-600">
            <li>1. Our team will review your application</li>
            <li>2. You'll receive an email with our decision</li>
            <li>3. If approved, you'll get your unique affiliate code and dashboard access</li>
            <li>4. Start earning commission on successful referrals!</li>
          </ol>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          In the meantime, feel free to browse our collection and get familiar with our products.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LocalizedLink
            href="/shop"
            className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition"
          >
            Browse Collection
          </LocalizedLink>
          
          <LocalizedLink
            href="/"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition"
          >
            Return to Home
          </LocalizedLink>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p>
          Questions? Contact us at{' '}
          <a href="mailto:affiliates@xandcastle.com" className="text-purple-600 hover:underline">
            affiliates@xandcastle.com
          </a>
        </p>
      </div>
    </div>
  );
}