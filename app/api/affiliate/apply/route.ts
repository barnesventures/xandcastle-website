import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { generateAffiliateCode } from '@/app/lib/affiliate';
import { z } from 'zod';

const applicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  socialMedia: z.object({
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    other: z.string().optional()
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = applicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid application data', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Check if email already exists
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { email: data.email }
    });
    
    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      );
    }
    
    // Generate unique affiliate code
    const code = await generateAffiliateCode(data.name);
    
    // Create affiliate application
    const affiliate = await prisma.affiliate.create({
      data: {
        code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        socialMedia: data.socialMedia || {},
        notes: data.message,
        status: 'PENDING'
      },
      select: {
        id: true,
        code: true,
        name: true,
        email: true,
        status: true,
        createdAt: true
      }
    });
    
    // TODO: Send confirmation email to applicant
    // TODO: Send notification email to admin
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      affiliate: {
        code: affiliate.code,
        status: affiliate.status
      }
    });
  } catch (error) {
    console.error('Error creating affiliate application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}