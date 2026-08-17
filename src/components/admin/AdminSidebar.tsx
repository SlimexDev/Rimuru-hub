'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  KeyRound,
  Settings,
  LogOut,
  ExternalLink,
  Gamepad2,
} from 'lucide-react';
import { toast } from 'sonner';
import { DeployStatusIndicator } from './DeployStatusIndicator';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/rimurudev.vn', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Scripts Hub', href: '/rimurudev.vn/scripts', icon: <Code2 className="w-4 h-4" /> },
    { name: 'Games Category', href: '/rimurudev.vn/games', icon: <Gamepad2 className="w-4 h-4 text-sky-400" /> },
    { name: 'Unlock Steps', href: '/rimurudev.vn/unlock-steps', icon: <KeyRound className="w-4 h-4" /> },
    { name: 'Guides & Articles', href: '/rimurudev.vn/guides', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Site Settings', href: '/rimurudev.vn/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/rimurudev.vn/login');
      router.refresh();
    } catch {
      toast.error('Logout error');
    }
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between p-5 glass-panel border-r border-sky-500/15 h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="space-y-6">
        <Link href="/rimurudev.vn" className="flex items-center gap-3 px-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white/[0.06] border border-sky-500/20 p-1 shadow-md shadow-sky-500/20">
            <Image
              src="/logo.png"
              alt="Rimuru Script Admin"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-base text-white">
              Rimuru<span className="text-sky-400">Admin</span>
            </span>
            <span className="block text-[10px] text-sky-300 font-mono">
              Slime Control Center
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/rimurudev.vn' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-white bg-sky-500/20 border border-sky-400/30 shadow-glass'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-4 border-t border-sky-500/15">
        <DeployStatusIndicator />

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-sky-500/15 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            View Public Site
          </span>
          <span className="text-[10px] text-white/40">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
