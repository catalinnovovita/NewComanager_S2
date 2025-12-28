'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Lightbulb,
  ShoppingBag,
  LogOut,
  Brain,
  Terminal,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Briefs', href: '/dashboard/briefs', icon: FileText },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: BarChart3 },
  { name: 'Content Ideas', href: '/dashboard/content', icon: Lightbulb },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
  { name: 'Technical AI', href: '/dashboard/technical', icon: Terminal },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-xl font-bold text-white">AI COMANAGER</h1>
            <p className="text-xs text-blue-300">Marketing AI Terminal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-blue-200 hover:bg-white/10'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-white">{session?.user?.name}</p>
          <p className="text-xs text-blue-300">{session?.user?.email}</p>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="outline"
          className="w-full justify-start gap-2 border-white/20 text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
