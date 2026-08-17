'use client';

import React, { useState, useEffect } from 'react';
import { GitCommit, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface DeployStatus {
  status: 'idle' | 'publishing' | 'building' | 'deployed' | 'error' | 'local';
  message: string;
  lastCommit?: string;
  url?: string;
  updatedAt: string;
}

export const DeployStatusIndicator: React.FC = () => {
  const [statusData, setStatusData] = useState<DeployStatus>({
    status: 'idle',
    message: 'Checking sync status...',
    updatedAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/deploy-status');
      if (res.ok) {
        const data = await res.json();
        setStatusData(data);
      }
    } catch {
      // Ignore background network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll every 15s to check Vercel build progress
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeStyle = () => {
    switch (statusData.status) {
      case 'building':
      case 'publishing':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'deployed':
      case 'local':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'error':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      default:
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    }
  };

  const getStatusIcon = () => {
    if (loading || statusData.status === 'building' || statusData.status === 'publishing') {
      return <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />;
    }
    if (statusData.status === 'error') {
      return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
    }
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="px-2 py-3 rounded-2xl bg-white/[0.04] border border-sky-500/15 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium text-white/90">
          <GitCommit className="w-3.5 h-3.5 text-sky-400" />
          <span>GitHub & Vercel Sync</span>
        </div>
        <button
          onClick={fetchStatus}
          className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          title="Refresh Status"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-[11px] text-white/70 truncate flex-1 font-mono">
          {statusData.message}
        </span>
      </div>

      {statusData.lastCommit && statusData.url && (
        <a
          href={statusData.url}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-sky-400 hover:underline block truncate font-mono"
        >
          Commit: {statusData.lastCommit} →
        </a>
      )}
    </div>
  );
};
