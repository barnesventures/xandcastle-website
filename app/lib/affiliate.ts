import { prisma } from './prisma';
import crypto from 'crypto';

/**
 * Generate a unique affiliate code
 * Format: XXXX followed by 2-4 random alphanumeric characters
 */
export async function generateAffiliateCode(name: string): Promise<string> {
  const baseCode = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, 'X');
  
  let code = baseCode;
  let attempts = 0;
  
  // Keep trying until we find a unique code
  while (attempts < 100) {
    const suffix = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 2);
    code = `${baseCode}${suffix}`;
    
    const existing = await prisma.affiliate.findUnique({
      where: { code }
    });
    
    if (!existing) {
      return code;
    }
    
    attempts++;
  }
  
  // Fallback to a longer random code if we can't find a unique one
  return `${baseCode}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * Validate affiliate code format
 */
export function isValidAffiliateCode(code: string): boolean {
  return /^[A-Z0-9]{4,12}$/.test(code);
}

/**
 * Track affiliate click
 */
export async function trackAffiliateClick(
  affiliateCode: string,
  ipAddress?: string,
  userAgent?: string,
  referrerUrl?: string,
  landingPage?: string,
  country?: string
) {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { code: affiliateCode, status: 'APPROVED' }
    });
    
    if (!affiliate) {
      return null;
    }
    
    // Create click record
    await prisma.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        ipAddress: ipAddress ? hashIP(ipAddress) : null,
        userAgent,
        referrerUrl,
        landingPage,
        country
      }
    });
    
    // Update affiliate stats
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        clicks: { increment: 1 },
        lastClickAt: new Date()
      }
    });
    
    return affiliate;
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    return null;
  }
}

/**
 * Hash IP address for privacy
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

/**
 * Get affiliate by code
 */
export async function getAffiliateByCode(code: string) {
  if (!isValidAffiliateCode(code)) {
    return null;
  }
  
  return prisma.affiliate.findUnique({
    where: { code, status: 'APPROVED' }
  });
}

/**
 * Calculate commission for an order
 */
export function calculateCommission(orderTotal: number, commissionRate: number): number {
  return Math.round((orderTotal * commissionRate / 100) * 100) / 100;
}

/**
 * Update affiliate stats after successful order
 */
export async function recordAffiliateConversion(
  affiliateId: string,
  orderTotal: number,
  commission: number
) {
  try {
    await prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        conversions: { increment: 1 },
        totalSales: { increment: orderTotal },
        totalCommission: { increment: commission },
        lastConversionAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error recording affiliate conversion:', error);
  }
}

/**
 * Get affiliate stats for a date range
 */
export async function getAffiliateStats(
  affiliateId: string,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = { affiliateId };
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }
  
  const [clicks, orders] = await Promise.all([
    prisma.affiliateClick.count({ where }),
    prisma.order.findMany({
      where: {
        affiliateId,
        status: { in: ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'] },
        createdAt: where.createdAt
      },
      select: {
        total: true,
        affiliateCommission: true,
        createdAt: true
      }
    })
  ]);
  
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalCommission = orders.reduce((sum, order) => sum + Number(order.affiliateCommission || 0), 0);
  
  return {
    clicks,
    conversions: orders.length,
    totalSales,
    totalCommission,
    conversionRate: clicks > 0 ? (orders.length / clicks * 100).toFixed(2) : '0.00'
  };
}

/**
 * Store affiliate code in cookies/localStorage
 */
export const AFFILIATE_COOKIE_NAME = 'xc_ref';
export const AFFILIATE_COOKIE_DAYS = 30;

/**
 * Parse affiliate code from URL
 */
export function getAffiliateCodeFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('ref') || null;
  } catch {
    return null;
  }
}