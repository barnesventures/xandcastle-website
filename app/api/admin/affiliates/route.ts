import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { isAdmin } from '@/app/lib/admin-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !await isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const [affiliates, total] = await Promise.all([
      prisma.affiliate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              orders: true,
              affiliateClicks: true
            }
          }
        }
      }),
      prisma.affiliate.count({ where })
    ]);
    
    return NextResponse.json({
      affiliates: affiliates.map(affiliate => ({
        id: affiliate.id,
        code: affiliate.code,
        name: affiliate.name,
        email: affiliate.email,
        status: affiliate.status,
        commissionRate: Number(affiliate.commissionRate),
        clicks: affiliate.clicks,
        conversions: affiliate.conversions,
        totalSales: Number(affiliate.totalSales),
        totalCommission: Number(affiliate.totalCommission),
        totalPaid: Number(affiliate.totalPaid),
        balance: Number(affiliate.totalCommission) - Number(affiliate.totalPaid),
        lastClickAt: affiliate.lastClickAt,
        lastConversionAt: affiliate.lastConversionAt,
        createdAt: affiliate.createdAt,
        _count: affiliate._count
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !await isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { action, affiliateId, ...data } = body;
    
    if (!action || !affiliateId) {
      return NextResponse.json(
        { error: 'Action and affiliateId required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'approve':
        const approved = await prisma.affiliate.update({
          where: { id: affiliateId },
          data: {
            status: 'APPROVED',
            approvedAt: new Date()
          }
        });
        
        // TODO: Send approval email with affiliate code
        
        return NextResponse.json({
          success: true,
          message: 'Affiliate approved',
          affiliate: approved
        });
        
      case 'reject':
        const rejected = await prisma.affiliate.update({
          where: { id: affiliateId },
          data: { status: 'REJECTED' }
        });
        
        // TODO: Send rejection email
        
        return NextResponse.json({
          success: true,
          message: 'Affiliate rejected',
          affiliate: rejected
        });
        
      case 'suspend':
        const suspended = await prisma.affiliate.update({
          where: { id: affiliateId },
          data: { status: 'SUSPENDED' }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Affiliate suspended',
          affiliate: suspended
        });
        
      case 'update':
        const updated = await prisma.affiliate.update({
          where: { id: affiliateId },
          data: {
            commissionRate: data.commissionRate,
            notes: data.notes,
            paymentMethod: data.paymentMethod,
            paymentDetails: data.paymentDetails
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Affiliate updated',
          affiliate: updated
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error managing affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to manage affiliate' },
      { status: 500 }
    );
  }
}