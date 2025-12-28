import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brief = await prisma.marketingBrief.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
      include: {
        campaigns: true,
      },
    });

    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }

    return NextResponse.json({ brief });
  } catch (error) {
    console.error('Error fetching brief:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brief' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const brief = await prisma.marketingBrief.updateMany({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
      data: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating brief:', error);
    return NextResponse.json(
      { error: 'Failed to update brief' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.marketingBrief.deleteMany({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brief:', error);
    return NextResponse.json(
      { error: 'Failed to delete brief' },
      { status: 500 }
    );
  }
}
