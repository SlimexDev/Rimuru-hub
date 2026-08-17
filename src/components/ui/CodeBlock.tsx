'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Sparkles } from 'lucide-react';
import { GlassButton } from './GlassButton';
import { GlassBadge } from './GlassBadge';
import { toast } from 'sonner';

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
  scriptSlug?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'lua',
  title = 'Raw Script Code',
  filename = 'script.lua',
  scriptSlug,
}) => {
  const [copied, setCopied] = useState(false);

  // Track download/copy action to increment real statistics
  const trackDownload = () => {
    if (scriptSlug) {
      fetch(`/api/scripts/${scriptSlug}/download`, { method: 'POST' }).catch(
        () => {}
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      trackDownload();
      toast.success('Lua script copied to clipboard!', {
        description: 'You can now paste and execute directly in your Roblox executor.',
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy. Please manually copy the code.');
    }
  };

  const handleDownload = () => {
    try {
      trackDownload();
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`, {
        description: 'Saved to your device.',
      });
    } catch {
      toast.error('Download failed.');
    }
  };

  const lines = code.split('\n');

  return (
    <div className="glass-card rounded-3xl border border-sky-500/30 overflow-hidden shadow-2xl relative">
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white/[0.04] border-b border-sky-500/15 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60 border border-red-400/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60 border border-yellow-400/40" />
            <div className="w-3 h-3 rounded-full bg-sky-500/60 border border-sky-400/40" />
          </div>
          <div className="h-4 w-[1px] bg-white/15 mx-1" />
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono text-white/80 font-medium">{title}</span>
          </div>
          <GlassBadge variant="cyan" size="sm">
            {language.toUpperCase()}
          </GlassBadge>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            size="sm"
            variant="secondary"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5 text-white/70" />}
          >
            Download .lua
          </GlassButton>
          <GlassButton
            size="sm"
            variant={copied ? 'secondary' : 'primary'}
            onClick={handleCopy}
            leftIcon={
              copied ? (
                <Check className="w-3.5 h-3.5 text-sky-300 animate-bounce" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )
            }
          >
            {copied ? 'Copied!' : 'Copy Script'}
          </GlassButton>
        </div>
      </div>

      {/* Code Content Monospace Container */}
      <div className="relative p-4 md:p-6 overflow-x-auto bg-black/50 text-xs md:text-sm font-mono leading-relaxed text-sky-300/90 selection:bg-sky-500/30 selection:text-white">
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          <div className="select-none text-white/25 text-right font-mono pr-2 border-r border-sky-500/15">
            {lines.map((_, idx) => (
              <div key={idx}>{idx + 1}</div>
            ))}
          </div>
          <div className="whitespace-pre overflow-x-auto">
            {lines.map((line, idx) => (
              <div key={idx} className="hover:bg-white/[0.03] px-1 rounded">
                {line.startsWith('--') || line.startsWith('//') ? (
                  <span className="text-white/40 italic">{line}</span>
                ) : line.includes('loadstring') || line.includes('HttpGet') ? (
                  <span>
                    <span className="text-cyan-400 font-semibold">{line.slice(0, line.indexOf('('))}</span>
                    <span className="text-white/80">{line.slice(line.indexOf('('))}</span>
                  </span>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 bg-sky-950/20 border-t border-sky-500/15 flex items-center justify-between text-xs text-sky-400/80">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Clean Loadstring • Pre-scanned & Verified Anti-Malware
        </span>
        <span className="text-white/40 hidden sm:inline">Ctrl + C or Click Copy</span>
      </div>
    </div>
  );
};
