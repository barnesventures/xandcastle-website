import { NextRequest, NextResponse } from 'next/server';
import { trackAffiliateClick, getAffiliateCodeFromUrl, AFFILIATE_COOKIE_NAME, AFFILIATE_COOKIE_DAYS } from '@/app/lib/affiliate';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('ref');
    const landingPage = searchParams.get('page') || '/';
    
    if (!affiliateCode) {
      return NextResponse.json({ error: 'No affiliate code provided' }, { status: 400 });
    }
    
    // Get request metadata
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                     headersList.get('x-real-ip') || 
                     'unknown';
    const userAgent = headersList.get('user-agent') || undefined;
    const referrer = headersList.get('referer') || undefined;
    
    // Track the click
    const affiliate = await trackAffiliateClick(
      affiliateCode,
      ipAddress,
      userAgent,
      referrer,
      landingPage
    );
    
    if (!affiliate) {
      return NextResponse.json({ error: 'Invalid affiliate code' }, { status: 404 });
    }
    
    // Set cookie for tracking
    const response = NextResponse.json({ 
      success: true, 
      affiliateCode: affiliate.code 
    });
    
    response.cookies.set(AFFILIATE_COOKIE_NAME, affiliate.code, {
      httpOnly: false, // Allow JavaScript access for checkout
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * AFFILIATE_COOKIE_DAYS
    });
    
    return response;
  } catch (error) {
    console.error('Error tracking affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to track affiliate' },
      { status: 500 }
    );
  }
}