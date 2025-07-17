import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';

// Validation schema
const restockNotificationSchema = z.object({
  email: z.string().email('Invalid email address'),
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.number().int().positive('Invalid variant ID'),
  variantTitle: z.string().min(1, 'Variant title is required')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = restockNotificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { email, productId, variantId, variantTitle } = validationResult.data;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create or update restock notification
    const notification = await prisma.restockNotification.upsert({
      where: {
        email_productId_variantId: {
          email,
          productId,
          variantId
        }
      },
      update: {
        variantTitle,
        notified: false, // Reset notification status
        updatedAt: new Date()
      },
      create: {
        email,
        productId,
        variantId,
        variantTitle
      }
    });

    return NextResponse.json({
      success: true,
      message: 'You will be notified when this item is back in stock',
      data: {
        id: notification.id
      }
    });

  } catch (error) {
    console.error('Failed to create restock notification:', error);
    return NextResponse.json(
      { error: 'Failed to register for restock notification' },
      { status: 500 }
    );
  }
}

// Delete a restock notification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');

    if (!email || !productId || !variantId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const deleted = await prisma.restockNotification.deleteMany({
      where: {
        email,
        productId,
        variantId: parseInt(variantId)
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restock notification removed'
    });

  } catch (error) {
    console.error('Failed to delete restock notification:', error);
    return NextResponse.json(
      { error: 'Failed to remove restock notification' },
      { status: 500 }
    );
  }
}