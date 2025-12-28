import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

import { getProducts } from '@/lib/shopify/service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '20');
    // We ignore topSelling flag for now as we don't have sales data easily from simple query
    // User requested sorting by inventory

    const products = await getProducts(limit);

    // Sort by inventory descending (as per user request "ordonate dupa stoc")
    // Note: getProducts returns an array, so we sort in memory
    const sortedProducts = products.sort((a: any, b: any) => b.inventory - a.inventory);

    // Map to frontend expected shape if needed (service now returns most fields)
    const formattedProducts = sortedProducts.map((p: any) => ({
      ...p,
      salesCount: 0 // Placeholder as we don't have this yet
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
