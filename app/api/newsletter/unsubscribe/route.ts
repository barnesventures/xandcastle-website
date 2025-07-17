import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/app/lib/prisma';

// Validation schema for POST request
const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/newsletter/unsubscribe?error=Invalid unsubscribe link', request.url)
      );
    }

    // Find subscriber by unsubscribe token
    const subscriber = await prisma.newsletter.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(
        new URL('/newsletter/unsubscribe?error=Invalid or expired unsubscribe link', request.url)
      );
    }

    // Check if already unsubscribed
    if (subscriber.status === 'UNSUBSCRIBED') {
      return NextResponse.redirect(
        new URL('/newsletter/unsubscribe?already=true', request.url)
      );
    }

    // Update subscriber status to unsubscribed
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    });

    // Redirect to unsubscribe success page
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribe?success=true', request.url)
    );

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribe?error=Something went wrong. Please try again.', request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = unsubscribeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find subscriber by email
    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json({
        message: 'Email not found in our mailing list.',
        status: 'not_found',
      });
    }

    // Check if already unsubscribed
    if (subscriber.status === 'UNSUBSCRIBED') {
      return NextResponse.json({
        message: 'You are already unsubscribed.',
        status: 'already_unsubscribed',
      });
    }

    // Update subscriber status to unsubscribed
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'You have been successfully unsubscribed.',
      status: 'unsubscribed',
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request. Please try again.' },
      { status: 500 }
    );
  }
}