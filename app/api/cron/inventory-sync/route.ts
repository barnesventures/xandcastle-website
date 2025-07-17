import { NextRequest, NextResponse } from 'next/server';
import { inventorySyncService } from '@/app/lib/inventory-sync';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting scheduled inventory sync...');
    
    // Run inventory sync
    const result = await inventorySyncService.syncAllProducts();

    // Process restock notifications if any
    if (result.restockDetected.length > 0) {
      console.log(`Processing ${result.restockDetected.length} restock notifications...`);
      
      // Mark notifications as queued for sending
      // In a production app, this would queue emails to be sent
      for (const restock of result.restockDetected) {
        const notifications = await prisma.restockNotification.findMany({
          where: {
            productId: restock.productId,
            variantId: restock.variantId,
            notified: false
          }
        });

        console.log(`Found ${notifications.length} notifications for ${restock.variantTitle}`);
        
        // Here you would typically queue emails to be sent
        // For now, we'll just log them
        for (const notification of notifications) {
          console.log(`TODO: Send restock email to ${notification.email}`);
          
          // Mark as notified to prevent duplicate emails
          await prisma.restockNotification.update({
            where: { id: notification.id },
            data: { 
              notified: true,
              notifiedAt: new Date()
            }
          });
        }
      }
    }

    // Log sync results
    console.log(`Inventory sync completed:
      - Products updated: ${result.productsUpdated}
      - Variants checked: ${result.variantsChecked}
      - Restock notifications sent: ${result.restockDetected.length}
      - Errors: ${result.errors?.length || 0}`);

    return NextResponse.json({
      success: true,
      message: 'Inventory sync completed',
      results: {
        productsUpdated: result.productsUpdated,
        variantsChecked: result.variantsChecked,
        restockNotificationsSent: result.restockDetected.length,
        errors: result.errors?.length || 0
      }
    });

  } catch (error) {
    console.error('Cron job error:', error);
    
    // Log error for monitoring
    return NextResponse.json(
      { 
        error: 'Inventory sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering in development
export async function POST(request: NextRequest) {
  // In development, allow manual triggering without auth
  if (process.env.NODE_ENV === 'development') {
    return GET(request);
  }

  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}