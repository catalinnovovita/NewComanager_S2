'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  FileText,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AnalyticsData {
  overview: {
    totalSpent: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgRoi: number;
    activeCampaigns: number;
  };
  platformStats: Record<string, any>;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/overview');
      if (res?.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Spent',
      value: `$${analytics?.overview?.totalSpent?.toFixed(2) ?? 0}`,
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      title: 'Active Campaigns',
      value: analytics?.overview?.activeCampaigns ?? 0,
      icon: Target,
      color: 'text-blue-400',
    },
    {
      title: 'Total Impressions',
      value: analytics?.overview?.totalImpressions?.toLocaleString() ?? 0,
      icon: BarChart3,
      color: 'text-purple-400',
    },
    {
      title: 'Total Clicks',
      value: analytics?.overview?.totalClicks?.toLocaleString() ?? 0,
      icon: TrendingUp,
      color: 'text-orange-400',
    },
    {
      title: 'Conversions',
      value: analytics?.overview?.totalConversions?.toLocaleString() ?? 0,
      icon: Target,
      color: 'text-pink-400',
    },
    {
      title: 'Average ROI',
      value: `${analytics?.overview?.avgRoi ?? 0}x`,
      icon: TrendingUp,
      color: 'text-teal-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-blue-200 mt-1">Your marketing performance overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-blue-200">
            Get started with AI-powered marketing tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/briefs">
              <Button
                variant="outline"
                className="w-full h-24 flex-col gap-2 border-white/20 text-white hover:bg-purple-600/20"
              >
                <FileText className="w-8 h-8" />
                <span>Generate Brief</span>
              </Button>
            </Link>
            <Link href="/dashboard/campaigns">
              <Button
                variant="outline"
                className="w-full h-24 flex-col gap-2 border-white/20 text-white hover:bg-blue-600/20"
              >
                <BarChart3 className="w-8 h-8" />
                <span>Analyze Campaign</span>
              </Button>
            </Link>
            <Link href="/dashboard/content">
              <Button
                variant="outline"
                className="w-full h-24 flex-col gap-2 border-white/20 text-white hover:bg-pink-600/20"
              >
                <Sparkles className="w-8 h-8" />
                <span>Content Ideas</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
