'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface FormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  twitter: string;
  other: string;
  message: string;
}

export default function AffiliateApplicationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    website: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    facebook: '',
    twitter: '',
    other: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const socialMedia: any = {};
      if (formData.instagram) socialMedia.instagram = formData.instagram;
      if (formData.tiktok) socialMedia.tiktok = formData.tiktok;
      if (formData.youtube) socialMedia.youtube = formData.youtube;
      if (formData.facebook) socialMedia.facebook = formData.facebook;
      if (formData.twitter) socialMedia.twitter = formData.twitter;
      if (formData.other) socialMedia.other = formData.other;

      const response = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          website: formData.website || undefined,
          socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
          message: formData.message || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      // Success - redirect to success page
      router.push('/affiliates/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            id="website"
            name="website"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Profiles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Handle
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              placeholder="@username"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-2">
              TikTok Handle
            </label>
            <input
              type="text"
              id="tiktok"
              name="tiktok"
              placeholder="@username"
              value={formData.tiktok}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Channel
            </label>
            <input
              type="text"
              id="youtube"
              name="youtube"
              placeholder="Channel name or URL"
              value={formData.youtube}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
              Facebook Page
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              placeholder="Page name or URL"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
              Twitter/X Handle
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              placeholder="@username"
              value={formData.twitter}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="other" className="block text-sm font-medium text-gray-700 mb-2">
              Other Platform
            </label>
            <input
              type="text"
              id="other"
              name="other"
              placeholder="Platform name and handle"
              value={formData.other}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Tell us about your audience and how you plan to promote Xandcastle
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Describe your audience demographics, content style, and promotion strategy..."
        />
      </div>

      <div className="text-sm text-gray-600">
        <p>* Required fields</p>
        <p className="mt-2">
          By submitting this application, you agree to our affiliate program terms and conditions.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-3 px-6 rounded-md font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <LoadingSpinner /> : 'Submit Application'}
      </button>
    </form>
  );
}