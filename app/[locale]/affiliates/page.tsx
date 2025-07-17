import { Metadata } from 'next';
import AffiliateApplicationForm from './AffiliateApplicationForm';

export const metadata: Metadata = {
  title: 'Become an Affiliate | Xandcastle',
  description: 'Join our affiliate program and earn commission by promoting Xandcastle products',
};

export default function AffiliatesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Join the Xandcastle Affiliate Program</h1>
        <p className="text-xl text-gray-600">
          Earn commission by sharing our unique kids and teens fashion with your audience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Why Partner with Us?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>Competitive commission rates starting at 10%</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>30-day cookie duration for tracking referrals</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>High-quality, unique designs that convert</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>Real-time tracking dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>Monthly payouts via your preferred method</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>Dedicated affiliate support</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
              <span>Apply to join our affiliate program</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
              <span>Get approved and receive your unique referral code</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
              <span>Share your referral link with your audience</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">4</span>
              <span>Track clicks, conversions, and earnings in real-time</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">5</span>
              <span>Get paid monthly for your successful referrals</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Apply to Become an Affiliate</h2>
        <AffiliateApplicationForm />
      </div>

      <div className="mt-12 text-center text-sm text-gray-600">
        <p>
          Have questions? Email us at{' '}
          <a href="mailto:affiliates@xandcastle.com" className="text-purple-600 hover:underline">
            affiliates@xandcastle.com
          </a>
        </p>
      </div>
    </div>
  );
}