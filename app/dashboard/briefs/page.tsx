'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Brief {
  id: string;
  title: string;
  objective: string;
  targetAudience: string;
  budget: number;
  deadline: string;
  strategy: string;
  channels: string[];
  timeline: string;
  kpis: string;
  status: string;
  createdAt: string;
}

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    objective: '',
    targetAudience: '',
    budget: '',
    deadline: '',
  });

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    try {
      const res = await fetch('/api/marketing/brief');
      if (res?.ok) {
        const data = await res.json();
        setBriefs(data?.briefs ?? []);
      }
    } catch (error) {
      console.error('Failed to fetch briefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch('/api/marketing/brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response?.ok) {
        throw new Error('Failed to generate brief');
      }

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
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
            try {
              const parsed = JSON.parse(data);
              if (parsed?.status === 'completed') {
                toast({
                  title: 'Success!',
                  description: 'Marketing brief generated successfully',
                });
                setShowForm(false);
                setFormData({ objective: '', targetAudience: '', budget: '', deadline: '' });
                fetchBriefs();
                return;
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
        description: 'Failed to generate brief',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Marketing Briefs</h1>
          <p className="text-blue-200 mt-1">AI-powered brief generation</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New Brief
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Generate Marketing Brief</CardTitle>
              <CardDescription className="text-blue-200">
                Let AI create a comprehensive brief for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objective" className="text-white">Campaign Objective</Label>
                  <Textarea
                    id="objective"
                    placeholder="e.g., Launch new product and increase awareness by 50%"
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-blue-300/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="e.g., Tech-savvy millennials aged 25-35"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-blue-300/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-white">Budget (USD)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="10000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-300/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-white">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={generating}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {briefs.map((brief, index) => (
          <motion.div
            key={brief.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {brief.title}
                    </CardTitle>
                    <CardDescription className="text-blue-200 mt-2">
                      {brief.objective}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={brief.status === 'active' ? 'default' : 'secondary'}
                    className="bg-purple-600"
                  >
                    {brief.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">Target Audience</h4>
                  <p className="text-white text-sm">{brief.targetAudience}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">Budget</h4>
                  <p className="text-white text-sm">${brief.budget.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-300 mb-2">Channels</h4>
                  <div className="flex gap-2">
                    {brief.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="border-white/20 text-white">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                {brief.strategy && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">Strategy</h4>
                    <p className="text-white text-sm">{brief.strategy}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {briefs.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium">No briefs yet</p>
            <p className="text-blue-200 text-sm mt-2">Generate your first AI-powered marketing brief</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
