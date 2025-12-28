'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function MarketingTerminalPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/marketing/chat',
    });

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                    Marketing AI Terminal
                </h1>
                <p className="text-blue-200 mt-1">
                    Your AI-powered marketing strategist with real-time store insights
                </p>
            </div>

            <Card className="flex-1 bg-white/5 backdrop-blur-lg border-white/10 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-white">Chat with Marketing AI</CardTitle>
                    <CardDescription className="text-blue-200">
                        Ask about products, campaigns, content ideas, or marketing strategy
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 px-6">
                        <div className="space-y-4 py-4">
                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                    <p className="text-white text-lg font-medium">Ready to create amazing marketing!</p>
                                    <p className="text-blue-200 text-sm mt-2">
                                        Try asking: "What products should we promote this week?" or "Write an email for our best seller"
                                    </p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white/10 text-white border border-white/10'
                                            }`}
                                    >
                                        {message.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        table: ({ node, ...props }) => (
                                                            <div className="overflow-x-auto my-4">
                                                                <table className="min-w-full border-collapse" {...props} />
                                                            </div>
                                                        ),
                                                        th: ({ node, ...props }) => (
                                                            <th className="border border-white/20 px-4 py-2 bg-white/5 text-left" {...props} />
                                                        ),
                                                        td: ({ node, ...props }) => (
                                                            <td className="border border-white/20 px-4 py-2" {...props} />
                                                        ),
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/10 text-white border border-white/10 rounded-lg p-4">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="border-t border-white/10 p-6">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Textarea
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask about marketing strategy, content ideas, or store insights..."
                                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-blue-300/50 resize-none"
                                rows={3}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e as any);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-purple-600 hover:bg-purple-700 self-end"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </form>
                        <p className="text-xs text-blue-300/50 mt-2">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
