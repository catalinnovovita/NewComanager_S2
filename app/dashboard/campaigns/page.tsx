'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Loader2, TrendingUp, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  status: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [analysis, setAnalysis] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/marketing/campaign');
      if (res?.ok) {
        const data = await res.json();
        setCampaigns(data?.campaigns ?? []);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeCampaign = async (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setAnalysis('');
    setAnalyzing(true);

    try {
      const response = await fetch('/api/marketing/campaign/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.id }),
      });

      if (!response?.ok) {
        throw new Error('Failed to analyze campaign');
      }

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let partialRead = '';

      while (true) {
        const { done, value } = await (reader?.read() ?? { done: true, value: undefined });
        if (done) break;

        partialRead += decoder.decode(value, { stream: true });
        let lines = partialRead.split('\n');
        partialRead = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setAnalyzing(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content ?? '';
              if (content) {
                accumulatedText += content;
                setAnalysis(accumulatedText);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze campaign',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaigns</h1>
          <p className="text-blue-200 mt-1">Analyze campaign performance with AI</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((campaign, index) => {
            const ctr = ((campaign.clicks / (campaign.impressions || 1)) * 100).toFixed(2);
            const conversionRate = ((campaign.conversions / (campaign.clicks || 1)) * 100).toFixed(2);

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          {campaign.name}
                        </CardTitle>
                        <CardDescription className="text-blue-200 mt-1">
                          Platform: {campaign.platform}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={campaign.status === 'active' ? 'default' : 'secondary'}
                        className="bg-green-600"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-blue-300">Budget / Spent</p>
                        <p className="text-lg font-semibold text-white">
                          ${campaign.spent.toFixed(0)} / ${campaign.budget.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-300">ROI</p>
                        <p className="text-lg font-semibold text-green-400">
                          {campaign.roi}x
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-300">CTR</p>
                        <p className="text-lg font-semibold text-white">{ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-300">Conversion Rate</p>
                        <p className="text-lg font-semibold text-white">{conversionRate}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-blue-300">Impressions</p>
                        <p className="text-sm font-medium text-white">
                          {campaign.impressions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-300">Clicks</p>
                        <p className="text-sm font-medium text-white">
                          {campaign.clicks.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-300">Conversions</p>
                        <p className="text-sm font-medium text-white">
                          {campaign.conversions.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => analyzeCampaign(campaign)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {campaigns.length === 0 && (
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-white text-lg font-medium">No campaigns found</p>
              <p className="text-blue-200 text-sm mt-2">Mock data should be available</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-3xl bg-slate-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              Campaign Analysis: {selectedCampaign?.name}
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              AI-powered insights and recommendations
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {analyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="ml-3 text-white">Analyzing campaign...</span>
              </div>
            ) : (
              <Textarea
                value={analysis}
                readOnly
                className="min-h-[400px] bg-white/5 border-white/10 text-white font-mono text-sm"
                placeholder="Analysis will appear here..."
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
