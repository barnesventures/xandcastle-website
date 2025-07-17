import Link from 'next/link';
import { locales } from '@/i18n';

export default function TestI18nPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">I18n Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Locales:</h2>
        <ul className="list-disc pl-5">
          {locales.map(locale => (
            <li key={locale}>
              <Link href={`/${locale}`} className="text-blue-600 hover:underline">
                {locale}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Links:</h2>
        <ul className="list-disc pl-5">
          <li><Link href="/en" className="text-blue-600 hover:underline">English (default)</Link></li>
          <li><Link href="/es" className="text-blue-600 hover:underline">Spanish</Link></li>
          <li><Link href="/fr" className="text-blue-600 hover:underline">French</Link></li>
          <li><Link href="/de" className="text-blue-600 hover:underline">German</Link></li>
        </ul>
      </div>
    </div>
  );
}