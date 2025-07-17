import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { inventorySyncService } from '@/app/lib/inventory-sync';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if a sync is already running (basic lock mechanism)
    const recentSync = await prisma.product.findFirst({
      where: {
        lastInventorySync: {
          gte: new Date(Date.now() - 60000) // Within last minute
        }
      }
    });

    if (recentSync) {
      return NextResponse.json(
        { error: 'Inventory sync is already in progress' },
        { status: 409 }
      );
    }

    // Run inventory sync
    console.log('Starting manual inventory sync...');
    const result = await inventorySyncService.syncAllProducts();

    return NextResponse.json({
      success: result.success,
      data: {
        productsUpdated: result.productsUpdated,
        variantsChecked: result.variantsChecked,
        restockDetected: result.restockDetected.length,
        errors: result.errors
      }
    });

  } catch (error) {
    console.error('Inventory sync failed:', error);
    return NextResponse.json(
      { error: 'Failed to sync inventory' },
      { status: 500 }
    );
  }
}

// Get inventory summary
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get inventory summary
    const summary = await inventorySyncService.getInventorySummary();

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Failed to get inventory summary:', error);
    return NextResponse.json(
      { error: 'Failed to get inventory summary' },
      { status: 500 }
    );
  }
}