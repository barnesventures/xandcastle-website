import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - Xandcastle',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-xandcastle-purple opacity-80">404</h1>
          <div className="relative -mt-16">
            <svg
              className="w-64 h-32 mx-auto"
              viewBox="0 0 256 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Castle towers */}
              <path
                d="M32 64v48h32V80h16v32h32V80h16v32h32V80h16v32h32V64"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-300"
              />
              {/* Castle tops */}
              <path
                d="M32 64l16-16 16 16M80 64l16-16 16 16M128 64l16-16 16 16M176 64l16-16 16 16"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-300"
              />
              {/* Flag */}
              <path
                d="M128 48v-32M128 16h24l-4 8 4 8h-24"
                stroke="currentColor"
                strokeWidth="3"
                className="text-xandcastle-purple"
                fill="currentColor"
                fillOpacity="0.2"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like this castle room is empty. The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-xandcastle-purple hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Browse Shop
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          Need help? <Link href="/contact" className="text-xandcastle-purple hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}