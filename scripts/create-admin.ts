#!/usr/bin/env node

/**
 * Script to create or update an admin user
 * Usage: npx tsx scripts/create-admin.ts <email>
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address');
    console.error('Usage: npx tsx scripts/create-admin.ts <email>');
    process.exit(1);
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Update existing user to admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { isAdmin: true }
      });
      console.log(`✅ Updated user ${email} to admin role`);
    } else {
      // Create new admin user with temporary password
      const tempPassword = 'changeme123';
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          isAdmin: true,
          name: 'Admin User'
        }
      });
      
      console.log(`✅ Created new admin user: ${email}`);
      console.log(`🔑 Temporary password: ${tempPassword}`);
      console.log('⚠️  Please change the password after first login!');
    }
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();