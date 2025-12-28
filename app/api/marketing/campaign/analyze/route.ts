import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { PrismaClient } from '@prisma/client';
import { streamGPT4Response, CAMPAIGN_ANALYSIS_PROMPT } from '@/lib/openai';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { campaignId } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID required' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        userId: (session.user as any).id,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const ctr = campaign.clicks / (campaign.impressions || 1) * 100;
    const conversionRate = campaign.conversions / (campaign.clicks || 1) * 100;
    const cpc = campaign.spent / (campaign.clicks || 1);
    const cpa = campaign.spent / (campaign.conversions || 1);

    const userPrompt = `Analyze this marketing campaign:

Campaign: ${campaign.name}
Platform: ${campaign.platform}
Budget: $${campaign.budget}
Spent: $${campaign.spent}
Impressions: ${campaign.impressions}
Clicks: ${campaign.clicks}
Conversions: ${campaign.conversions}
ROI: ${campaign.roi}x
CTR: ${ctr.toFixed(2)}%
Conversion Rate: ${conversionRate.toFixed(2)}%
CPC: $${cpc.toFixed(2)}
CPA: $${cpa.toFixed(2)}
Status: ${campaign.status}

Provide detailed analysis with performance summary, key insights, and 3-5 actionable recommendations for improvement.`;

    const response = await streamGPT4Response(
      [{ role: 'user' as const, content: userPrompt }],
      CAMPAIGN_ANALYSIS_PROMPT
    );

    return response;
  } catch (error: any) {
    console.error('Campaign analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze campaign' },
      { status: 500 }
    );
  }
}
