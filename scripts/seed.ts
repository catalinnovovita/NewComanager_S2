// AI COMANAGER - Database Seed Script
// Generates realistic mock data for FAZA 1 testing

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.contextMemory.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.marketingBrief.deleteMany();
  await prisma.shopifyProduct.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create test user (john@doe.com / johndoe123)
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Created test user:', testUser.email);

  // Create Marketing Briefs
  const briefs = [
    {
      title: 'Q1 Product Launch Campaign',
      objective: 'Launch new AI-powered analytics dashboard to tech-savvy SMBs and increase sign-ups by 200%',
      targetAudience: 'Tech startup founders, CTOs, and marketing managers aged 28-45, primarily in US and EU',
      budget: 15000,
      deadline: new Date('2025-03-31'),
      strategy: 'Multi-channel approach focusing on thought leadership, product demos, and conversion-optimized landing pages',
      channels: ['meta', 'google', 'email'],
      timeline: 'Week 1-2: Awareness building, Week 3-4: Conversion focus, Week 5-6: Retention campaigns',
      kpis: 'Sign-ups: 500+, CAC: <$50, Conversion rate: >3%, Email open rate: >25%',
      status: 'active',
    },
    {
      title: 'Summer Sale Promotion',
      objective: 'Drive revenue during summer months with aggressive discounting on premium tiers',
      targetAudience: 'Existing free-tier users and warm leads from past campaigns',
      budget: 8000,
      deadline: new Date('2025-06-30'),
      strategy: 'Urgency-driven messaging with limited-time offers and social proof',
      channels: ['email', 'meta'],
      timeline: 'Week 1: Teaser campaign, Week 2-3: Main sale, Week 4: Last chance',
      kpis: 'Revenue: $100K+, Upgrade rate: >15%, ROI: >400%',
      status: 'draft',
    },
    {
      title: 'Content Marketing Initiative',
      objective: 'Build thought leadership and organic traffic through high-quality content',
      targetAudience: 'Marketing professionals, entrepreneurs, and business owners seeking AI solutions',
      budget: 5000,
      deadline: new Date('2025-12-31'),
      strategy: 'SEO-optimized blog posts, case studies, whitepapers, and webinars',
      channels: ['google', 'email'],
      timeline: 'Ongoing monthly content calendar with weekly publications',
      kpis: 'Organic traffic: +50%, Content downloads: 200+/month, Webinar attendees: 100+',
      status: 'active',
    },
  ];

  const createdBriefs = [];
  for (const brief of briefs) {
    const created = await prisma.marketingBrief.create({
      data: {
        ...brief,
        userId: testUser.id,
      },
    });
    createdBriefs.push(created);
  }
  console.log(`✅ Created ${createdBriefs.length} marketing briefs`);

  // Create Campaigns with realistic metrics
  const now = new Date();
  const campaigns = [
    // Meta Ads Campaigns
    {
      name: 'AI Dashboard - Lead Gen',
      platform: 'meta',
      budget: 5000,
      spent: 4237.50,
      impressions: 287500,
      clicks: 8625,
      conversions: 287,
      roi: 3.2,
      status: 'active',
      startDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      briefId: createdBriefs[0]?.id,
    },
    {
      name: 'Retargeting - Free Users',
      platform: 'meta',
      budget: 2500,
      spent: 2499.80,
      impressions: 145000,
      clicks: 4350,
      conversions: 152,
      roi: 2.8,
      status: 'completed',
      startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      briefId: createdBriefs[0]?.id,
    },
    {
      name: 'Summer Sale Teaser',
      platform: 'meta',
      budget: 1500,
      spent: 850.25,
      impressions: 98000,
      clicks: 2450,
      conversions: 89,
      roi: 1.9,
      status: 'active',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      briefId: createdBriefs[1]?.id,
    },
    // Google Ads Campaigns
    {
      name: 'SEM - AI Analytics Keywords',
      platform: 'google',
      budget: 6000,
      spent: 5823.40,
      impressions: 456000,
      clicks: 12768,
      conversions: 421,
      roi: 3.7,
      status: 'active',
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: null,
      briefId: createdBriefs[0]?.id,
    },
    {
      name: 'Display Network - Awareness',
      platform: 'google',
      budget: 3500,
      spent: 3498.90,
      impressions: 1200000,
      clicks: 6000,
      conversions: 156,
      roi: 2.1,
      status: 'completed',
      startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      briefId: createdBriefs[2]?.id,
    },
    {
      name: 'YouTube Pre-roll Ads',
      platform: 'google',
      budget: 2000,
      spent: 1245.00,
      impressions: 178000,
      clicks: 3560,
      conversions: 98,
      roi: 2.5,
      status: 'active',
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
      briefId: createdBriefs[0]?.id,
    },
    // Email Campaigns
    {
      name: 'Welcome Series - New Users',
      platform: 'email',
      budget: 500,
      spent: 478.20,
      impressions: 15000,
      clicks: 3750,
      conversions: 675,
      roi: 8.5,
      status: 'active',
      startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      endDate: null,
      briefId: createdBriefs[0]?.id,
    },
    {
      name: 'Monthly Newsletter - May',
      platform: 'email',
      budget: 300,
      spent: 299.50,
      impressions: 25000,
      clicks: 4500,
      conversions: 189,
      roi: 4.2,
      status: 'completed',
      startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      briefId: createdBriefs[2]?.id,
    },
    {
      name: 'Cart Abandonment Recovery',
      platform: 'email',
      budget: 800,
      spent: 756.00,
      impressions: 8500,
      clicks: 2380,
      conversions: 412,
      roi: 6.8,
      status: 'active',
      startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      endDate: null,
      briefId: createdBriefs[1]?.id,
    },
    // Additional campaigns
    {
      name: 'LinkedIn Sponsored Content',
      platform: 'meta',
      budget: 4000,
      spent: 3890.00,
      impressions: 125000,
      clicks: 5000,
      conversions: 234,
      roi: 3.1,
      status: 'completed',
      startDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Influencer Partnership Campaign',
      platform: 'meta',
      budget: 3000,
      spent: 1200.00,
      impressions: 89000,
      clicks: 3120,
      conversions: 145,
      roi: 2.4,
      status: 'active',
      startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Google Shopping - Product Feed',
      platform: 'google',
      budget: 5500,
      spent: 5234.70,
      impressions: 567000,
      clicks: 15678,
      conversions: 512,
      roi: 4.1,
      status: 'active',
      startDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      endDate: null,
    },
    {
      name: 'Re-engagement Email Blast',
      platform: 'email',
      budget: 400,
      spent: 398.00,
      impressions: 12000,
      clicks: 1920,
      conversions: 267,
      roi: 5.3,
      status: 'completed',
      startDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const campaign of campaigns) {
    await prisma.campaign.create({
      data: {
        ...campaign,
        userId: testUser.id,
      },
    });
  }
  console.log(`✅ Created ${campaigns.length} campaigns`);

  // Create Shopify Products (Mock)
  const products = [
    // Electronics
    { title: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 249.99, inventory: 145, salesCount: 287, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { title: 'Smart Watch Pro Series', category: 'Electronics', price: 399.99, inventory: 89, salesCount: 421, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { title: 'Portable Bluetooth Speaker', category: 'Electronics', price: 79.99, inventory: 234, salesCount: 512, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
    { title: '4K Action Camera', category: 'Electronics', price: 299.99, inventory: 67, salesCount: 189, imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400' },
    { title: 'Wireless Charging Pad', category: 'Electronics', price: 34.99, inventory: 456, salesCount: 678, imageUrl: 'https://staycourant.com/cdn/shop/products/CT_VM_Catch_3_Ash_Gray_Background_Product_01_Web.jpg?v=1764881195&width=800' },
    { title: 'USB-C Hub Adapter', category: 'Electronics', price: 49.99, inventory: 321, salesCount: 445, imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400' },
    
    // Fashion
    { title: 'Premium Leather Backpack', category: 'Fashion', price: 129.99, inventory: 112, salesCount: 334, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    { title: 'Designer Sunglasses Collection', category: 'Fashion', price: 159.99, inventory: 78, salesCount: 256, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400' },
    { title: 'Minimalist Wallet', category: 'Fashion', price: 39.99, inventory: 289, salesCount: 598, imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400' },
    { title: 'Athletic Running Shoes', category: 'Fashion', price: 119.99, inventory: 156, salesCount: 412, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { title: 'Cashmere Sweater', category: 'Fashion', price: 189.99, inventory: 67, salesCount: 178, imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
    
    // Home & Living
    { title: 'Smart LED Light Bulbs (4-Pack)', category: 'Home', price: 44.99, inventory: 412, salesCount: 723, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { title: 'Stainless Steel Water Bottle', category: 'Home', price: 27.99, inventory: 567, salesCount: 891, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' },
    { title: 'Aromatherapy Diffuser', category: 'Home', price: 34.99, inventory: 234, salesCount: 456, imageUrl: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=400' },
    { title: 'Bamboo Cutting Board Set', category: 'Home', price: 42.99, inventory: 189, salesCount: 312, imageUrl: 'https://images.unsplash.com/photo-1594535182308-8ffefbb661e1?w=400' },
    { title: 'Memory Foam Pillow', category: 'Home', price: 49.99, inventory: 278, salesCount: 534, imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
    
    // Fitness & Health
    { title: 'Yoga Mat with Carrying Strap', category: 'Fitness', price: 29.99, inventory: 345, salesCount: 612, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
    { title: 'Resistance Bands Set', category: 'Fitness', price: 24.99, inventory: 456, salesCount: 789, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400' },
    { title: 'Smart Body Scale', category: 'Fitness', price: 49.99, inventory: 198, salesCount: 367, imageUrl: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400' },
    { title: 'Protein Shaker Bottle', category: 'Fitness', price: 14.99, inventory: 678, salesCount: 923, imageUrl: 'https://thumbs.dreamstime.com/b/protein-shaker-isolated-white-background-fitness-drinks-clear-protein-shaker-black-lid-centered-against-plain-398088178.jpg' },
    { title: 'Foam Roller for Recovery', category: 'Fitness', price: 32.99, inventory: 234, salesCount: 445, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400' },
    
    // Beauty & Personal Care
    { title: 'Organic Face Serum', category: 'Beauty', price: 54.99, inventory: 156, salesCount: 289, imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400' },
    { title: 'LED Face Mask Light Therapy', category: 'Beauty', price: 149.99, inventory: 45, salesCount: 112, imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400' },
    { title: 'Electric Toothbrush', category: 'Beauty', price: 89.99, inventory: 234, salesCount: 456, imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400' },
    { title: 'Natural Bath Bomb Set', category: 'Beauty', price: 24.99, inventory: 412, salesCount: 678, imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400' },
    
    // Office & Productivity
    { title: 'Ergonomic Office Chair', category: 'Office', price: 299.99, inventory: 67, salesCount: 156, imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
    { title: 'Standing Desk Converter', category: 'Office', price: 179.99, inventory: 89, salesCount: 203, imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400' },
    { title: 'Desk Organizer Set', category: 'Office', price: 34.99, inventory: 278, salesCount: 512, imageUrl: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400' },
    { title: 'Mechanical Keyboard RGB', category: 'Office', price: 129.99, inventory: 145, salesCount: 378, imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400' },
    { title: 'Wireless Mouse Ergonomic', category: 'Office', price: 39.99, inventory: 345, salesCount: 567, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
  ];

  for (const product of products) {
    await prisma.shopifyProduct.create({
      data: {
        ...product,
        description: `Premium quality ${product.title.toLowerCase()} with excellent reviews and fast shipping.`,
      },
    });
  }
  console.log(`✅ Created ${products.length} Shopify products`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 1 (john@doe.com / johndoe123)`);
  console.log(`   - Marketing Briefs: ${createdBriefs.length}`);
  console.log(`   - Campaigns: ${campaigns.length}`);
  console.log(`   - Products: ${products.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
