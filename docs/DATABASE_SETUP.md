# Database Setup Guide

This guide explains how to set up the database for the Xandcastle website using Prisma ORM with Neon PostgreSQL.

## Prerequisites

- Node.js installed
- Neon PostgreSQL database (via Vercel integration or direct setup)
- Environment variables configured

## Setup Steps

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your database URL:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Neon PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

Generate the TypeScript client from the schema:

```bash
npm run db:generate
```

### 4. Create Database Tables

Run the initial migration to create all tables:

```bash
npm run db:migrate
```

For production, use:

```bash
npm run db:push
```

### 5. Seed Initial Data (Optional)

To add initial blog post data:

```bash
npm run db:seed
```

### 6. Explore Database (Development)

To open Prisma Studio and view/edit data:

```bash
npm run db:studio
```

## Database Schema Overview

### Models

1. **User** - Customer accounts with authentication
   - Supports both email/password and OAuth via NextAuth.js
   - Links to orders for registered users

2. **Order** - E-commerce orders
   - Supports both guest and registered checkouts
   - Stores Printify and Stripe references
   - Tracks order status and shipping info

3. **BlogPost** - CMS content
   - Markdown-based content
   - SEO metadata support
   - Publishing workflow

4. **Product** - Cached Printify products
   - Stores product variants and options
   - Supports Windsor tourist collection flag
   - Periodic sync with Printify API

### Key Features

- **Guest Checkout**: Orders can be placed without user registration
- **Multi-currency**: Orders store currency information
- **JSON Fields**: Flexible storage for variants, addresses, and order items
- **SEO Support**: Blog posts include meta fields for optimization
- **Audit Fields**: All models include createdAt/updatedAt timestamps

## Common Commands

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Create a new migration
npm run db:migrate

# Push schema changes without migration (development)
npm run db:push

# Open Prisma Studio
npm run db:studio

# Run seed script
npm run db:seed
```

## Troubleshooting

### Connection Issues

- Ensure your DATABASE_URL includes `?sslmode=require` for Neon
- Check that your database is active in the Neon dashboard
- Verify firewall rules allow connections

### Migration Errors

- Run `npx prisma migrate reset` to reset the database (development only)
- Check for pending migrations with `npx prisma migrate status`
- Ensure schema.prisma syntax is valid with `npx prisma validate`

### Type Errors

- Regenerate client after schema changes: `npm run db:generate`
- Restart TypeScript server in your IDE
- Check imports are from `@prisma/client`