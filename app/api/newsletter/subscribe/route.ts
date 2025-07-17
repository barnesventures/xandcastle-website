import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '@/app/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('website'),
});

// Generate confirmation email HTML
function generateConfirmationEmailHTML(confirmationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Subscription - Xandcastle</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Welcome to the Castle Crew! 🏰</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin: 0 0 20px; font-size: 24px;">Just one more step!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Hey there, future Castle Crew member! We're super excited to have you join our kingdom of cool clothes and awesome adventures!
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Click the magical button below to confirm your email and unlock:
          </p>

          <ul style="color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 30px; padding-left: 20px;">
            <li>✨ Exclusive designs before anyone else</li>
            <li>🎁 Special offers and surprise discounts</li>
            <li>🎨 Sneak peeks at new collections</li>
            <li>🏰 Castle adventures and fun stories</li>
          </ul>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${confirmationUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
              Confirm My Subscription! 🎉
            </a>
          </div>

          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${confirmationUrl}" style="color: #8B5CF6; word-break: break-all;">${confirmationUrl}</a>
          </p>

          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>Why confirm?</strong> We want to make sure it's really you and keep your inbox safe from unwanted emails. It's all part of keeping the castle secure! 🛡️
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <p style="color: #cccccc; font-size: 14px; margin: 0 0 10px;">
            Didn't sign up for this? No worries! Just ignore this email and nothing will happen.
          </p>
          <p style="color: #cccccc; font-size: 14px; margin: 0;">
            © ${new Date().getFullYear()} Xandcastle. Made with 💜 for creative kids everywhere!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate confirmation email text
function generateConfirmationEmailText(confirmationUrl: string): string {
  return `
Welcome to the Castle Crew! 🏰

Just one more step!

Hey there, future Castle Crew member! We're super excited to have you join our kingdom of cool clothes and awesome adventures!

Click the link below to confirm your email and unlock:
✨ Exclusive designs before anyone else
🎁 Special offers and surprise discounts
🎨 Sneak peeks at new collections
🏰 Castle adventures and fun stories

Confirm your subscription:
${confirmationUrl}

Why confirm? We want to make sure it's really you and keep your inbox safe from unwanted emails. It's all part of keeping the castle secure! 🛡️

Didn't sign up for this? No worries! Just ignore this email and nothing will happen.

© ${new Date().getFullYear()} Xandcastle. Made with 💜 for creative kids everywhere!
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = subscribeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, source } = validationResult.data;

    // Get IP address and user agent for GDPR compliance
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // If already confirmed, return success without sending another email
      if (existingSubscriber.status === 'CONFIRMED') {
        return NextResponse.json({
          message: 'You are already subscribed to our newsletter!',
          status: 'already_subscribed',
        });
      }

      // If pending, resend confirmation email
      if (existingSubscriber.status === 'PENDING' && existingSubscriber.confirmationToken) {
        const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://xandcastle.com'}/api/newsletter/confirm?token=${existingSubscriber.confirmationToken}`;
        
        await resend.emails.send({
          from: 'Xandcastle <hello@xandcastle.com>',
          to: email,
          subject: 'Confirm Your Subscription to the Castle Crew! 🏰',
          html: generateConfirmationEmailHTML(confirmationUrl),
          text: generateConfirmationEmailText(confirmationUrl),
        });

        return NextResponse.json({
          message: 'Confirmation email resent. Please check your inbox!',
          status: 'confirmation_resent',
        });
      }

      // If unsubscribed, reactivate with new confirmation
      if (existingSubscriber.status === 'UNSUBSCRIBED') {
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        
        await prisma.newsletter.update({
          where: { email },
          data: {
            status: 'PENDING',
            confirmationToken,
            source,
            ipAddress,
            userAgent,
            unsubscribedAt: null,
          },
        });

        const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://xandcastle.com'}/api/newsletter/confirm?token=${confirmationToken}`;
        
        await resend.emails.send({
          from: 'Xandcastle <hello@xandcastle.com>',
          to: email,
          subject: 'Welcome Back! Confirm Your Subscription 🏰',
          html: generateConfirmationEmailHTML(confirmationUrl),
          text: generateConfirmationEmailText(confirmationUrl),
        });

        return NextResponse.json({
          message: 'Welcome back! Please check your email to confirm your subscription.',
          status: 'resubscribe_pending',
        });
      }
    }

    // Create new subscriber with pending status
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    await prisma.newsletter.create({
      data: {
        email,
        status: 'PENDING',
        confirmationToken,
        unsubscribeToken,
        source,
        ipAddress,
        userAgent,
      },
    });

    // Send confirmation email
    const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://xandcastle.com'}/api/newsletter/confirm?token=${confirmationToken}`;
    
    await resend.emails.send({
      from: 'Xandcastle <hello@xandcastle.com>',
      to: email,
      subject: 'Confirm Your Subscription to the Castle Crew! 🏰',
      html: generateConfirmationEmailHTML(confirmationUrl),
      text: generateConfirmationEmailText(confirmationUrl),
    });

    return NextResponse.json({
      message: 'Almost there! Check your email to confirm your subscription.',
      status: 'confirmation_sent',
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}