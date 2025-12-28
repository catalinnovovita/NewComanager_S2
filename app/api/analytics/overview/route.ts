import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { PrismaClient, Campaign } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        userId: (session.user as any).id,
      },
    });

    const totalSpent = campaigns.reduce((sum: number, c: Campaign) => sum + c.spent, 0);
    const totalImpressions = campaigns.reduce((sum: number, c: Campaign) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum: number, c: Campaign) => sum + c.clicks, 0);
    const totalConversions = campaigns.reduce((sum: number, c: Campaign) => sum + c.conversions, 0);
    const avgRoi = campaigns.length > 0
      ? campaigns.reduce((sum: number, c: Campaign) => sum + c.roi, 0) / campaigns.length
      : 0;

    const activeCampaigns = campaigns.filter((c: Campaign) => c.status === 'active').length;

    const platformStats = campaigns.reduce((acc, c: Campaign) => {
      if (!acc[c.platform]) {
        acc[c.platform] = {
          spent: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
        };
      }
      acc[c.platform].spent += c.spent;
      acc[c.platform].impressions += c.impressions;
      acc[c.platform].clicks += c.clicks;
      acc[c.platform].conversions += c.conversions;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      overview: {
        totalSpent,
        totalImpressions,
        totalClicks,
        totalConversions,
        avgRoi: parseFloat(avgRoi.toFixed(2)),
        activeCampaigns,
      },
      platformStats,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
