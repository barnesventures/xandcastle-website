import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateStats } from '@/app/lib/affiliate';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const affiliateCode = searchParams.get('code');
    const email = searchParams.get('email');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!affiliateCode && !email) {
      return NextResponse.json(
        { error: 'Affiliate code or email required' },
        { status: 400 }
      );
    }
    
    // Find affiliate
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        OR: [
          affiliateCode ? { code: affiliateCode } : undefined,
          email ? { email } : undefined
        ].filter(Boolean),
        status: 'APPROVED'
      }
    });
    
    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found or not approved' },
        { status: 404 }
      );
    }
    
    // Get stats
    const stats = await getAffiliateStats(
      affiliate.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    
    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        affiliateId: affiliate.id,
        status: { in: ['PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED'] }
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        affiliateCommission: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    return NextResponse.json({
      affiliate: {
        code: affiliate.code,
        name: affiliate.name,
        commissionRate: Number(affiliate.commissionRate),
        totalEarned: Number(affiliate.totalCommission),
        totalPaid: Number(affiliate.totalPaid),
        balance: Number(affiliate.totalCommission) - Number(affiliate.totalPaid)
      },
      stats,
      recentOrders: recentOrders.map(order => ({
        orderNumber: order.orderNumber,
        total: Number(order.total),
        commission: Number(order.affiliateCommission || 0),
        status: order.status,
        date: order.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching affiliate stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}