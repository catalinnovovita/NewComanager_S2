'use client';

import { useChat } from 'ai/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Send, Cpu, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function TechnicalTerminalPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/technical/chat',
    });

    return (
        <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-green-500 font-mono tracking-tight flex items-center gap-2">
                        <Terminal className="w-8 h-8" />
                        TERMINAL_02
                    </h1>
                    <p className="text-green-400/60 font-mono text-sm mt-1">
                        Technical Operations & Architecture Agent
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded text-xs font-mono text-green-400 flex items-center gap-2">
                        <Cpu className="w-3 h-3" />
                        SYSTEM_ONLINE
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Chat Area */}
                <Card className="lg:col-span-3 bg-black/40 border-green-500/30 backdrop-blur-sm flex flex-col min-h-0 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-green-500/40 p-12 text-center font-mono">
                                    <Code2 className="w-12 h-12 mb-4 opacity-50" />
                                    <p>Ready for instructions...</p>
                                    <p className="text-sm">Ask me to generate code, debug issues, or plan architecture.</p>
                                </div>
                            )}
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-lg p-4 font-mono text-sm ${m.role === 'user'
                                                ? 'bg-green-500/20 text-green-100 border border-green-500/30'
                                                : 'bg-black/60 text-green-300 border border-white/5'
                                            }`}
                                    >
                                        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/80 prose-pre:border prose-pre:border-white/10 max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    code({ node, inline, className, children, ...props }: any) {
                                                        return (
                                                            <code
                                                                className={`${className} ${inline
                                                                        ? 'bg-white/10 rounded px-1 py-0.5'
                                                                        : 'block p-2 rounded-md bg-black/90'
                                                                    }`}
                                                                {...props}
                                                            >
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                }}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-black/60 text-green-500/60 p-2 rounded font-mono text-sm animate-pulse border border-green-500/20">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-green-500/20 bg-black/40">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Initialize sequence..."
                                className="bg-black/50 border-green-500/30 text-green-100 font-mono placeholder:text-green-500/30 focus-visible:ring-green-500/50"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-black font-bold font-mono"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>

                {/* Sidebar Context */}
                <div className="space-y-4 flex flex-col min-h-0">
                    <Card className="flex-1 bg-black/40 border-green-500/30 p-4 overflow-auto">
                        <h3 className="text-green-500 font-mono font-bold mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            ACTIVE_CONTEXT
                        </h3>

                        <div className="space-y-4 text-xs font-mono text-green-400/80">
                            <div>
                                <span className="block text-green-500/50 mb-1">// STACK</span>
                                <ul className="list-disc list-inside space-y-1 pl-1">
                                    <li>Next.js 14 (App Router)</li>
                                    <li>TypeScript</li>
                                    <li>Tailwind CSS</li>
                                    <li>Prisma (PostgreSQL)</li>
                                </ul>
                            </div>

                            <div className="h-px bg-green-500/20" />

                            <div>
                                <span className="block text-green-500/50 mb-1">// CAPABILITIES</span>
                                <ul className="list-disc list-inside space-y-1 pl-1">
                                    <li>Code Generation</li>
                                    <li>System Architecture</li>
                                    <li>Debug Analysis</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
