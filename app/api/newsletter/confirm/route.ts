import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate welcome email HTML
function generateWelcomeEmailHTML(unsubscribeUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Castle Crew! - Xandcastle</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with confetti background -->
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 60px 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1;">
            <span style="font-size: 60px;">🎉</span>
            <span style="font-size: 40px;">✨</span>
            <span style="font-size: 50px;">🎊</span>
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold; position: relative;">
            You're In! 🎉
          </h1>
          <p style="color: #ffffff; margin: 10px 0 0; font-size: 18px; opacity: 0.9; position: relative;">
            Welcome to the Castle Crew!
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin: 0 0 20px; font-size: 24px;">
            Hey Castle Crew Member! 👋
          </h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            You did it! You're officially part of the coolest crew in the kingdom. Get ready for an awesome journey filled with:
          </p>

          <div style="background-color: #F9FAFB; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <div style="margin-bottom: 15px;">
              <span style="font-size: 24px; margin-right: 10px;">🎁</span>
              <strong style="color: #333; font-size: 16px;">Exclusive Offers</strong>
              <p style="color: #666; margin: 5px 0 0 34px; font-size: 14px;">
                Special discounts just for Castle Crew members!
              </p>
            </div>
            <div style="margin-bottom: 15px;">
              <span style="font-size: 24px; margin-right: 10px;">👕</span>
              <strong style="color: #333; font-size: 16px;">Early Access</strong>
              <p style="color: #666; margin: 5px 0 0 34px; font-size: 14px;">
                Be the first to see and shop new designs!
              </p>
            </div>
            <div style="margin-bottom: 15px;">
              <span style="font-size: 24px; margin-right: 10px;">🎨</span>
              <strong style="color: #333; font-size: 16px;">Behind the Scenes</strong>
              <p style="color: #666; margin: 5px 0 0 34px; font-size: 14px;">
                Sneak peeks at upcoming collections and design stories!
              </p>
            </div>
            <div>
              <span style="font-size: 24px; margin-right: 10px;">🏰</span>
              <strong style="color: #333; font-size: 16px;">Castle Adventures</strong>
              <p style="color: #666; margin: 5px 0 0 34px; font-size: 14px;">
                Fun stories and updates from the Xandcastle kingdom!
              </p>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
            <p style="color: #7C3AED; font-size: 18px; margin: 0; font-weight: 600;">
              🎁 Here's a special welcome gift:
            </p>
            <p style="color: #EC4899; font-size: 24px; margin: 10px 0; font-weight: bold;">
              10% OFF YOUR FIRST ORDER!
            </p>
            <p style="color: #7C3AED; font-size: 16px; margin: 0;">
              Use code: <span style="background: #ffffff; padding: 4px 12px; border-radius: 4px; font-family: monospace;">CASTLE10</span>
            </p>
          </div>

          <!-- Shop Now Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://xandcastle.com/shop" 
               style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
              Start Shopping! 🛍️
            </a>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #999; font-size: 14px;">
              Follow us for daily dose of awesome:
            </p>
            <div style="margin-top: 15px;">
              <a href="#" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <span style="font-size: 24px;">📷</span>
              </a>
              <a href="#" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <span style="font-size: 24px;">🐦</span>
              </a>
              <a href="#" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                <span style="font-size: 24px;">📘</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <p style="color: #cccccc; font-size: 12px; margin: 0 0 10px;">
            You're receiving this because you joined the Castle Crew at xandcastle.com
          </p>
          <p style="color: #cccccc; font-size: 12px; margin: 0 0 10px;">
            <a href="${unsubscribeUrl}" style="color: #8B5CF6; text-decoration: none;">Unsubscribe</a> | 
            <a href="https://xandcastle.com/contact" style="color: #8B5CF6; text-decoration: none;">Contact Us</a>
          </p>
          <p style="color: #cccccc; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Xandcastle. Made with 💜 for creative kids everywhere!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate welcome email text
function generateWelcomeEmailText(unsubscribeUrl: string): string {
  return `
You're In! 🎉
Welcome to the Castle Crew!

Hey Castle Crew Member! 👋

You did it! You're officially part of the coolest crew in the kingdom. Get ready for an awesome journey filled with:

🎁 Exclusive Offers - Special discounts just for Castle Crew members!
👕 Early Access - Be the first to see and shop new designs!
🎨 Behind the Scenes - Sneak peeks at upcoming collections and design stories!
🏰 Castle Adventures - Fun stories and updates from the Xandcastle kingdom!

🎁 Here's a special welcome gift:
10% OFF YOUR FIRST ORDER!
Use code: CASTLE10

Start Shopping: https://xandcastle.com/shop

Follow us for daily dose of awesome:
Instagram | Twitter | Facebook

You're receiving this because you joined the Castle Crew at xandcastle.com
Unsubscribe: ${unsubscribeUrl}
Contact Us: https://xandcastle.com/contact

© ${new Date().getFullYear()} Xandcastle. Made with 💜 for creative kids everywhere!
  `.trim();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/newsletter/error?message=Invalid confirmation link', request.url)
      );
    }

    // Find subscriber by confirmation token
    const subscriber = await prisma.newsletter.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(
        new URL('/newsletter/error?message=Invalid or expired confirmation link', request.url)
      );
    }

    // Check if already confirmed
    if (subscriber.status === 'CONFIRMED') {
      return NextResponse.redirect(
        new URL('/newsletter/success?message=You are already subscribed!', request.url)
      );
    }

    // Update subscriber status to confirmed
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        status: 'CONFIRMED',
        subscribedAt: new Date(),
        confirmationToken: null, // Clear the token after use
      },
    });

    // Send welcome email
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://xandcastle.com'}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
    
    await resend.emails.send({
      from: 'Xandcastle <hello@xandcastle.com>',
      to: subscriber.email,
      subject: 'Welcome to the Castle Crew! Here\'s Your Special Gift 🎁',
      html: generateWelcomeEmailHTML(unsubscribeUrl),
      text: generateWelcomeEmailText(unsubscribeUrl),
    });

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/newsletter/success?welcome=true', request.url)
    );

  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    return NextResponse.redirect(
      new URL('/newsletter/error?message=Something went wrong. Please try again.', request.url)
    );
  }
}