'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentIdea {
  title: string;
  concept: string;
  cta: string;
  variations?: string[];
}

export default function ContentPage() {
  const [generating, setGenerating] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contentType: 'ad',
    platform: 'meta',
    objective: '',
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setIdeas([]);

    try {
      const response = await fetch('/api/marketing/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response?.ok) {
        throw new Error('Failed to generate content');
      }

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
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
                setIdeas(parsed?.result?.ideas ?? []);
                toast({
                  title: 'Success!',
                  description: 'Content ideas generated successfully',
                });
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
        description: 'Failed to generate content ideas',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Ideas</h1>
        <p className="text-blue-200 mt-1">Generate creative content with AI</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Generate Content Ideas</CardTitle>
          <CardDescription className="text-blue-200">
            Get AI-powered creative suggestions for your marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentType" className="text-white">Content Type</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => setFormData({ ...formData, contentType: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ad">Ad</SelectItem>
                    <SelectItem value="post">Social Post</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="video">Video Script</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-white">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meta">Meta (Facebook/Instagram)</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="objective" className="text-white">Campaign Objective</Label>
              <Textarea
                id="objective"
                placeholder="Describe what you want to achieve with this content..."
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-blue-300/50"
              />
            </div>
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
                  Generate Ideas
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {ideas.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {ideas.map((idea, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    {idea.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">Concept</h4>
                    <p className="text-white text-sm">{idea.concept}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">Call to Action</h4>
                    <p className="text-white text-sm font-medium">{idea.cta}</p>
                  </div>
                  {idea?.variations && idea.variations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">Variations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {idea.variations.map((variation, i) => (
                          <li key={i} className="text-white text-sm">
                            {variation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
