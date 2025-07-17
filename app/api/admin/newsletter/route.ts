import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { NewsletterStatus } from '@prisma/client';

// Check if user is admin
async function isAdmin(request: NextRequest) {
  const session = await auth();
  
  if (!session || !session.user?.email) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isAdmin: true },
  });

  return user?.isAdmin || false;
}

// GET /api/admin/newsletter - Get all newsletter subscribers
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as NewsletterStatus | null;
    const export_format = searchParams.get('export');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build query conditions
    const where = status ? { status } : {};

    // Get total count
    const total = await prisma.newsletter.count({ where });

    // Get subscribers
    const subscribers = await prisma.newsletter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: export_format ? 0 : skip,
      take: export_format ? undefined : limit,
      select: {
        id: true,
        email: true,
        status: true,
        source: true,
        subscribedAt: true,
        unsubscribedAt: true,
        createdAt: true,
        ipAddress: true,
      },
    });

    // Handle export formats
    if (export_format === 'csv') {
      const csv = [
        'Email,Status,Source,Subscribed At,Unsubscribed At,Created At',
        ...subscribers.map(sub => 
          `"${sub.email}","${sub.status}","${sub.source}","${sub.subscribedAt || ''}","${sub.unsubscribedAt || ''}","${sub.createdAt}"`
        ),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (export_format === 'json') {
      return new NextResponse(JSON.stringify(subscribers, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    // Return paginated response
    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: await prisma.newsletter.count(),
        confirmed: await prisma.newsletter.count({ where: { status: 'CONFIRMED' } }),
        pending: await prisma.newsletter.count({ where: { status: 'PENDING' } }),
        unsubscribed: await prisma.newsletter.count({ where: { status: 'UNSUBSCRIBED' } }),
      },
    });

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/newsletter - Delete a subscriber
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authorization
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    await prisma.newsletter.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Subscriber deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}