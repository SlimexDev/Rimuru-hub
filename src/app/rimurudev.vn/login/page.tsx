'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/rimurudev.vn';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      toast.success('Welcome back, Master Admin!', {
        description: 'Redirecting to Rimuru Admin Dashboard...',
      });

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-6 sm:p-8 border-sky-500/20 shadow-2xl space-y-6">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Username</label>
          <GlassInput
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            leftIcon={<User className="w-4 h-4 text-white/50" />}
            required
            autoComplete="username"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80">Password</label>
          <GlassInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            leftIcon={<Lock className="w-4 h-4 text-white/50" />}
            required
            autoComplete="current-password"
          />
        </div>

        <GlassButton
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full justify-center mt-3"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Authenticate Session
        </GlassButton>
      </form>

      <div className="pt-4 border-t border-sky-500/15 text-center">
        <Link
          href="/"
          className="text-xs text-white/50 hover:text-sky-400 transition-colors"
        >
          ← Return to Public Website
        </Link>
      </div>
    </GlassCard>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.06] border border-sky-500/20 p-1 shadow-lg shadow-sky-500/20">
              <Image
                src="/logo.png"
                alt="Rimuru Script Logo"
                width={44}
                height={44}
                className="object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">
              Rimuru<span className="text-sky-400">Script</span>
            </span>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Sign in to manage scripts, unlock gates, guides and analytics.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="p-8 text-center glass-card rounded-3xl">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-400" />
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
