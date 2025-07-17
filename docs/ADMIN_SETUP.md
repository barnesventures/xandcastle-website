# Admin Setup Guide

## Overview

The Xandcastle admin interface provides a secure dashboard for managing:
- Blog posts and content
- Customer orders
- Product synchronization with Printify
- Overall store statistics

## Setting Up Admin Access

### 1. Update Database Schema

First, ensure your database has the latest schema with admin support:

```bash
npx prisma db push
```

### 2. Create an Admin User

Use the provided script to create or upgrade a user to admin:

```bash
npx tsx scripts/create-admin.ts your-email@example.com
```

For existing users, this will simply add admin privileges. For new users, it will create an account with a temporary password that must be changed on first login.

### 3. Access the Admin Dashboard

1. Sign in with your admin credentials at `/auth/signin`
2. Once logged in, you'll see "Admin Dashboard" in the user dropdown menu
3. Click on it to access the admin interface at `/admin`

## Admin Features

### Dashboard (`/admin`)
- Overview of key metrics
- Recent orders list
- Quick action buttons
- Total orders, users, and revenue statistics

### Blog Management (`/admin/blog`)
- Create, edit, and publish blog posts
- Manage SEO metadata
- Control publication status

### Orders Management (`/admin/orders`)
- View all customer orders
- Track order status
- Access shipping information
- Handle customer inquiries

### Products Sync (`/admin/products`)
- Sync products from Printify catalog
- Manage product visibility
- Update Windsor collection flags

## Security

- Admin routes are protected by middleware
- Only users with `isAdmin: true` can access admin pages
- Non-admin users are redirected to the home page
- Sessions are managed securely with NextAuth.js

## Development Notes

### Adding New Admin Pages

1. Create your page in the `/app/admin/` directory
2. The admin layout will automatically apply
3. Use the existing navigation structure in `layout.tsx`

### Admin API Routes

Admin-only API routes should check for admin status:

```typescript
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Admin-only logic here
}
```

## Troubleshooting

### Can't Access Admin Pages

1. Ensure you've run the latest database migrations
2. Verify your user has `isAdmin: true` in the database
3. Clear your browser cookies and sign in again
4. Check the browser console for any errors

### Admin Link Not Showing

The admin link only appears for users with admin privileges. Check:
- Your session includes the `isAdmin` field
- The middleware is properly configured
- You're using the latest auth configuration