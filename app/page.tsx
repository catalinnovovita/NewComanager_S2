'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Zap, Target, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleGetStarted = () => {
    if (status === 'loading') {
      return; // Nu face nimic dacă încă se încarcă sesiunea
    }
    
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Briefs',
      description: 'Generate comprehensive marketing briefs in seconds with GPT-4o intelligence',
    },
    {
      icon: BarChart3,
      title: 'Campaign Analytics',
      description: 'Real-time insights and performance analysis across all your campaigns',
    },
    {
      icon: Sparkles,
      title: 'Creative Content',
      description: 'Generate engaging content ideas optimized for every platform',
    },
    {
      icon: Target,
      title: 'Smart Targeting',
      description: 'AI-driven audience insights and targeting recommendations',
    },
    {
      icon: TrendingUp,
      title: 'ROI Optimization',
      description: 'Maximize returns with intelligent budget allocation and optimization',
    },
    {
      icon: Zap,
      title: 'Instant Insights',
      description: 'Get actionable recommendations powered by advanced AI analysis',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-16 h-16 text-purple-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            AI COMANAGER
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-4">
            Marketing AI Terminal
          </p>
          <p className="text-lg text-blue-300 mb-8 max-w-2xl mx-auto">
            Transform your marketing workflow with AI-powered brief generation, campaign analysis, and content creation
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all hover:shadow-xl h-full">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-200">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
