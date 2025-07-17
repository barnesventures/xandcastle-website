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
              <a href={`/${locale}`} className="text-blue-600 hover:underline">
                {locale}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Links:</h2>
        <ul className="list-disc pl-5">
          <li><a href="/en" className="text-blue-600 hover:underline">English (default)</a></li>
          <li><a href="/es" className="text-blue-600 hover:underline">Spanish</a></li>
          <li><a href="/fr" className="text-blue-600 hover:underline">French</a></li>
          <li><a href="/de" className="text-blue-600 hover:underline">German</a></li>
        </ul>
      </div>
    </div>
  );
}