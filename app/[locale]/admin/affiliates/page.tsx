import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/app/lib/admin-auth';
import AffiliatesClient from './AffiliatesClient';

export const metadata: Metadata = {
  title: 'Affiliate Management | Xandcastle Admin',
  description: 'Manage affiliate partners and track their performance',
};

export default async function AffiliatesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }
  
  const isUserAdmin = await isAdmin(session.user.email);
  
  if (!isUserAdmin) {
    redirect('/');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Management</h1>
        <p className="text-gray-600">
          Manage affiliate partners, track their performance, and process applications.
        </p>
      </div>
      
      <AffiliatesClient />
    </div>
  );
}