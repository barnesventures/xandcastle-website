import { PrismaClient, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedTestData() {
  console.log('🌱 Seeding test data...');

  try {
    // Create test users
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@xandcastle.com' },
      update: {},
      create: {
        email: 'admin@xandcastle.com',
        name: 'Admin User',
        password: hashedPassword,
        emailVerified: new Date(),
        isAdmin: true,
      },
    });

    console.log('✅ Created test users');

    // Create test products
    const products = [
      {
        printifyId: 'test-product-1',
        title: 'Cool Castle T-Shirt',
        description: 'A cool t-shirt with a castle design perfect for kids',
        tags: ['kids', 'castle', 'cool'],
        options: [
          { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
          { name: 'Color', values: ['Black', 'White', 'Purple'] },
        ],
        variants: [
          { id: 1, title: 'Black / S', price: 1999, is_available: true },
          { id: 2, title: 'Black / M', price: 1999, is_available: true },
          { id: 3, title: 'Black / L', price: 1999, is_available: true },
          { id: 4, title: 'White / S', price: 1999, is_available: true },
          { id: 5, title: 'White / M', price: 1999, is_available: true },
          { id: 6, title: 'Purple / S', price: 2199, is_available: true },
        ],
        images: [
          { src: 'https://via.placeholder.com/500x500/9333EA/FFFFFF?text=Castle+Shirt', position: 'front' },
          { src: 'https://via.placeholder.com/500x500/EC4899/FFFFFF?text=Castle+Back', position: 'back' },
        ],
        isWindsorProduct: false,
      },
      {
        printifyId: 'test-product-2',
        title: 'Windsor Castle Souvenir Hoodie',
        description: 'Premium hoodie featuring Windsor Castle design',
        tags: ['windsor', 'tourist', 'hoodie', 'souvenir'],
        options: [
          { name: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'] },
          { name: 'Color', values: ['Navy', 'Grey', 'Black'] },
        ],
        variants: [
          { id: 7, title: 'Navy / S', price: 3999, is_available: true },
          { id: 8, title: 'Navy / M', price: 3999, is_available: true },
          { id: 9, title: 'Navy / L', price: 3999, is_available: true },
          { id: 10, title: 'Grey / M', price: 3999, is_available: true },
          { id: 11, title: 'Grey / L', price: 3999, is_available: true },
        ],
        images: [
          { src: 'https://via.placeholder.com/500x500/1F2937/FFFFFF?text=Windsor+Hoodie', position: 'front' },
        ],
        isWindsorProduct: true,
      },
      {
        printifyId: 'test-product-3',
        title: 'Teen Dragon Design Tee',
        description: 'Awesome dragon design for teens who love fantasy',
        tags: ['teens', 'dragon', 'fantasy', 'cool'],
        options: [
          { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
          { name: 'Color', values: ['Black', 'Red'] },
        ],
        variants: [
          { id: 12, title: 'Black / S', price: 2499, is_available: true },
          { id: 13, title: 'Black / M', price: 2499, is_available: true },
          { id: 14, title: 'Black / L', price: 2499, is_available: true },
          { id: 15, title: 'Red / M', price: 2499, is_available: true },
        ],
        images: [
          { src: 'https://via.placeholder.com/500x500/EF4444/FFFFFF?text=Dragon+Tee', position: 'front' },
        ],
        isWindsorProduct: false,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { printifyId: product.printifyId },
        update: {
          title: product.title,
          description: product.description,
          tags: product.tags,
          options: product.options,
          variants: product.variants,
          images: product.images,
          isWindsorProduct: product.isWindsorProduct,
          lastSyncedAt: new Date(),
        },
        create: {
          printifyId: product.printifyId,
          title: product.title,
          description: product.description,
          tags: product.tags,
          options: product.options,
          variants: product.variants,
          images: product.images,
          isWindsorProduct: product.isWindsorProduct,
        },
      });
    }

    console.log('✅ Created test products');

    // Create test orders
    const orders = [
      {
        orderNumber: `XC-TEST-001`,
        email: testUser.email,
        userId: testUser.id,
        status: OrderStatus.DELIVERED,
        stripePaymentId: 'pi_test_delivered',
        printifyOrderId: 'printify_test_001',
        subtotal: 39.98,
        shipping: 5.00,
        tax: 3.50,
        total: 48.48,
        currency: 'USD',
        customerName: 'Test User',
        customerPhone: '+1234567890',
        shippingAddress: {
          first_name: 'Test',
          last_name: 'User',
          address1: '123 Test Street',
          city: 'Test City',
          region: 'Test State',
          country: 'US',
          zip: '12345',
        },
        items: [
          {
            product_id: 'test-product-1',
            variant_id: 1,
            quantity: 2,
            title: 'Cool Castle T-Shirt',
            variant_label: 'Black / S',
            price: 1999,
          },
        ],
        trackingNumber: '1234567890',
        trackingCarrier: 'USPS',
        trackingUrl: 'https://tracking.example.com/1234567890',
        fulfillmentStatus: 'fulfilled',
        emailSent: true,
      },
      {
        orderNumber: `XC-TEST-002`,
        email: 'guest@example.com',
        userId: null,
        status: OrderStatus.PROCESSING,
        stripePaymentId: 'pi_test_processing',
        subtotal: 79.98,
        shipping: 10.00,
        tax: 7.20,
        total: 97.18,
        currency: 'GBP',
        customerName: 'Guest Customer',
        customerPhone: '+447123456789',
        shippingAddress: {
          first_name: 'Guest',
          last_name: 'Customer',
          address1: '456 Windsor Road',
          city: 'Windsor',
          region: 'Berkshire',
          country: 'GB',
          zip: 'SL4 1AB',
        },
        items: [
          {
            product_id: 'test-product-2',
            variant_id: 7,
            quantity: 2,
            title: 'Windsor Castle Souvenir Hoodie',
            variant_label: 'Navy / S',
            price: 3999,
          },
        ],
        emailSent: true,
      },
      {
        orderNumber: `XC-TEST-003`,
        email: testUser.email,
        userId: testUser.id,
        status: OrderStatus.PENDING,
        stripePaymentId: 'pi_test_pending',
        subtotal: 24.99,
        shipping: 5.00,
        tax: 2.40,
        total: 32.39,
        currency: 'EUR',
        customerName: 'Test User',
        shippingAddress: {
          first_name: 'Test',
          last_name: 'User',
          address1: '789 Euro Street',
          city: 'Berlin',
          country: 'DE',
          zip: '10115',
        },
        items: [
          {
            product_id: 'test-product-3',
            variant_id: 12,
            quantity: 1,
            title: 'Teen Dragon Design Tee',
            variant_label: 'Black / S',
            price: 2499,
          },
        ],
      },
    ];

    for (const order of orders) {
      await prisma.order.create({
        data: order,
      });
    }

    console.log('✅ Created test orders');

    // Create test blog posts
    const blogPosts = [
      {
        title: 'Welcome to Xandcastle - Our Story',
        slug: 'welcome-to-xandcastle',
        content: `# Welcome to Xandcastle!

We're thrilled to launch our new clothing brand for kids and teens. Xandcastle is all about creativity, imagination, and self-expression through unique designs.

## Our Mission

At Xandcastle, we believe every child deserves to wear clothing that reflects their personality and interests. From castle-themed designs to fantasy creatures, our collections are designed to inspire and delight.

## What Makes Us Different

- **Quality First**: We use only the best materials and printing techniques
- **Unique Designs**: Each design is carefully crafted to be special
- **Sustainable**: Print-on-demand means no waste
- **Kid-Approved**: Tested by real kids and teens!

Stay tuned for more exciting designs and collections!`,
        excerpt: 'Discover the story behind Xandcastle and our mission to create unique, creative clothing for kids and teens.',
        coverImage: 'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Welcome+to+Xandcastle',
        published: true,
        publishedAt: new Date('2024-01-01'),
        tags: ['announcement', 'about', 'welcome'],
        metaTitle: 'Welcome to Xandcastle - Our Story',
        metaDesc: 'Learn about Xandcastle, a new clothing brand creating unique designs for kids and teens.',
      },
      {
        title: 'Introducing the Windsor Tourist Collection',
        slug: 'windsor-tourist-collection-launch',
        content: `# New Windsor Tourist Collection!

We're excited to announce our special Windsor Tourist Collection, featuring exclusive designs inspired by the magnificent Windsor Castle.

## Collection Highlights

### Castle-Themed Designs
Our designers have created beautiful artwork that captures the essence of Windsor Castle, perfect for tourists and locals alike.

### Premium Quality
Each item in the Windsor collection is made with extra care and attention to detail.

### Perfect Souvenirs
Take home a piece of Windsor with our exclusive designs that you won't find anywhere else!

## Available Now

The Windsor Tourist Collection is now available in our shop. Each purchase supports local artists and sustainable fashion.`,
        excerpt: 'Explore our exclusive Windsor Tourist Collection featuring castle-themed designs perfect for souvenirs.',
        coverImage: 'https://via.placeholder.com/800x400/EC4899/FFFFFF?text=Windsor+Collection',
        published: true,
        publishedAt: new Date('2024-01-15'),
        tags: ['windsor', 'collection', 'tourist', 'new'],
        metaTitle: 'Windsor Tourist Collection - Exclusive Castle Designs',
        metaDesc: 'Shop our Windsor Tourist Collection featuring exclusive castle-themed clothing and souvenirs.',
      },
      {
        title: 'Spring Fashion Tips for Kids and Teens',
        slug: 'spring-fashion-tips-2024',
        content: `# Spring Fashion Tips for Kids and Teens

Spring is here, and it's time to refresh those wardrobes! Here are our top tips for keeping your kids stylish this season.

## 1. Layer Up!
Spring weather can be unpredictable. Teach your kids the art of layering with our lightweight hoodies and tees.

## 2. Bright Colors
Say goodbye to winter darks and hello to vibrant spring colors. Our new designs feature fresh, fun patterns.

## 3. Comfort is Key
Kids need to move! All our clothing is designed with active kids in mind.

## 4. Express Yourself
Let your kids choose designs that reflect their interests - from dragons to castles to abstract art.

Check out our spring collection for more inspiration!`,
        excerpt: 'Get ready for spring with our fashion tips for kids and teens. From layering to colors, we've got you covered.',
        published: true,
        publishedAt: new Date('2024-02-01'),
        tags: ['fashion', 'tips', 'spring', 'style'],
        metaTitle: 'Spring Fashion Tips for Kids & Teens 2024',
        metaDesc: 'Discover the best spring fashion tips for kids and teens. Layer up, embrace color, and express yourself!',
      },
    ];

    for (const post of blogPosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: post,
        create: post,
      });
    }

    console.log('✅ Created test blog posts');

    console.log('🎉 Test data seeding completed!');
    console.log('\nTest Accounts:');
    console.log('- User: test@example.com / testpassword123');
    console.log('- Admin: admin@xandcastle.com / testpassword123');
    
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedTestData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });