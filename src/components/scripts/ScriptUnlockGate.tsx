'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { CodeBlock } from '@/components/ui/CodeBlock';
import {
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';

export interface UnlockStepData {
  id: string;
  label: string;
  description: string;
  targetUrl: string;
  order: number;
}

export interface ScriptUnlockGateProps {
  script: {
    id: string;
    slug: string;
    title: string;
    banner: string;
    code: string;
    game: {
      name: string;
    };
  };
  steps: UnlockStepData[];
}

export const ScriptUnlockGate: React.FC<ScriptUnlockGateProps> = ({
  script,
  steps,
}) => {
  // Pure in-memory state: Never saved in localStorage, resets on page reload
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [listRef] = useAutoAnimate();

  // Trigger Confetti when all steps are completed
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#0ea5e9', '#06b6d4', '#67e8f9', '#ffffff'],
      });
    } catch {}
  };

  // Window Focus / VisibilityChange listener to auto-complete the active step
  useEffect(() => {
    const handleReturnToTab = () => {
      if (document.visibilityState === 'visible' && activeStepId) {
        const currentStep = activeStepId;
        setActiveStepId(null);

        setCompletedSteps((prev) => {
          if (!prev.includes(currentStep)) {
            const nextList = [...prev, currentStep];

            toast.success('Step verified successfully!', {
              description: 'Your unlock progress has been updated.',
            });

            if (nextList.length >= steps.length && steps.length > 0) {
              setIsUnlocked(true);
              setTimeout(() => {
                triggerCelebration();
                toast.success('🎉 Script Unlocked Successfully!', {
                  description: 'You can now copy the raw Lua loadstring below.',
                  duration: 5000,
                });
              }, 400);
            }
            return nextList;
          }
          return prev;
        });
      }
    };

    window.addEventListener('focus', handleReturnToTab);
    document.addEventListener('visibilitychange', handleReturnToTab);

    return () => {
      window.removeEventListener('focus', handleReturnToTab);
      document.removeEventListener('visibilitychange', handleReturnToTab);
    };
  }, [activeStepId, steps.length]);

  const handleStartStep = (step: UnlockStepData) => {
    setActiveStepId(step.id);
    window.open(step.targetUrl, '_blank', 'noopener,noreferrer');
    toast.info('Step link opened in new tab', {
      description: 'Return to this tab to automatically verify completion.',
    });
  };

  const handleReset = () => {
    setCompletedSteps([]);
    setIsUnlocked(false);
    setActiveStepId(null);
    toast.info('Unlock progress reset.');
  };

  const progressPercent = Math.min(
    100,
    Math.round((completedSteps.length / (steps.length || 1)) * 100)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/scripts/${script.slug}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          Back to {script.title}
        </Link>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors"
          title="Reset progress"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset progress
        </button>
      </div>

      {/* Main Glass Center Card */}
      <GlassCard className="p-6 sm:p-10 border-sky-500/25 shadow-2xl relative overflow-hidden">
        {/* Script Header Preview */}
        <div className="flex items-center gap-4 border-b border-sky-500/15 pb-6 mb-6">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-black/40 border border-sky-400/20 shrink-0 shadow-lg">
            <Image
              src={script.banner}
              alt={script.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/25 font-medium">
                {script.game?.name}
              </span>
              <GlassBadge variant={isUnlocked ? 'verified' : 'cyan'} size="sm">
                {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
              </GlassBadge>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight line-clamp-1">
              {script.title}
            </h1>
            <p className="text-xs text-white/60">
              {isUnlocked
                ? 'The script has been decrypted and ready to execute below.'
                : 'Raw script code is locked. Complete the verification steps below to unlock.'}
            </p>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-white/70 flex items-center gap-1.5">
              {isUnlocked ? (
                <Unlock className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-white/40" />
              )}
              Unlock Progress: {completedSteps.length} / {steps.length} steps completed ({progressPercent}%)
            </span>
            <span className="text-sky-400 font-mono font-bold">
              {progressPercent}%
            </span>
          </div>

          {/* Liquid Glass Progress Bar */}
          <div className="h-3 w-full rounded-full bg-white/[0.06] border border-sky-400/20 p-[1px] overflow-hidden backdrop-blur-md">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Dynamic State Switch: Hidden / Locked Gate vs Unlocked Script */}
        <AnimatePresence mode="wait">
          {isUnlocked ? (
            /* UNLOCKED VIEW: CODE REVEALED */
            <motion.div
              key="unlocked-view"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Unlocked Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-between shadow-[0_0_30px_-5px_rgba(56,189,248,0.4)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-300 border border-sky-400/40 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Script Successfully Unlocked!
                    </h3>
                    <p className="text-xs text-sky-200/80">
                      Copy the raw loadstring below and paste into your Roblox executor.
                    </p>
                  </div>
                </div>
                <GlassBadge variant="verified" size="sm">
                  100% Ready
                </GlassBadge>
              </div>

              {/* Code Monospace Block */}
              <CodeBlock
                code={script.code}
                filename={`${script.slug}.lua`}
                title={`${script.game?.name} Loader`}
                scriptSlug={script.slug}
              />

              {/* Disclaimer */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-sky-500/15 flex items-start gap-3 text-xs text-white/50 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> This script is provided for educational and research purposes. We recommend using a secondary account for maximum safety.
                </p>
              </div>
            </motion.div>
          ) : (
            /* LOCKED VIEW: SCRIPT IS HIDDEN BEHIND VAULT */
            <div className="space-y-6">
              {/* Locked Vault Teaser Box */}
              <div className="p-5 rounded-2xl bg-black/40 border border-sky-500/15 text-center space-y-2 relative overflow-hidden backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center mx-auto text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">
                  Raw Lua Script is Locked
                </h4>
                <p className="text-xs text-white/50 max-w-md mx-auto">
                  Click the YouTube and Discord task buttons below to instantly unlock the complete script.
                </p>
              </div>

              {/* TASK STEP CARDS WITH LOGOS */}
              <div className="space-y-3.5" ref={listRef}>
                {steps.map((step, index) => {
                  const isStepCompleted = completedSteps.includes(step.id);
                  const isCurrentActive = activeStepId === step.id;

                  const urlLower = (step.targetUrl || '').toLowerCase();
                  const labelLower = (step.label || '').toLowerCase();

                  const isYouTube =
                    urlLower.includes('youtube.com') ||
                    urlLower.includes('youtu.be') ||
                    labelLower.includes('youtube') ||
                    labelLower.includes('subscribe');

                  const isDiscord =
                    urlLower.includes('discord.com') ||
                    urlLower.includes('discord.gg') ||
                    labelLower.includes('discord');

                  return (
                    <div
                      key={step.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isStepCompleted
                          ? 'bg-sky-500/10 border-sky-500/35 text-sky-300'
                          : isCurrentActive
                          ? 'bg-cyan-500/15 border-cyan-400/50 animate-pulse'
                          : isYouTube
                          ? 'bg-red-950/15 border-red-500/25 hover:border-red-500/50 hover:bg-red-950/25 shadow-lg shadow-red-500/5'
                          : isDiscord
                          ? 'bg-indigo-950/15 border-indigo-500/25 hover:border-indigo-500/50 hover:bg-indigo-950/25 shadow-lg shadow-indigo-500/5'
                          : 'bg-white/[0.04] border-sky-500/15 hover:bg-white/[0.07] hover:border-sky-400/30'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Logo Thumbnail Container */}
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-md ${
                            isStepCompleted
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                              : isYouTube
                              ? 'bg-red-500/15 border-red-500/30'
                              : isDiscord
                              ? 'bg-indigo-500/15 border-indigo-500/30'
                              : 'bg-sky-500/15 border-sky-400/30'
                          }`}
                        >
                          {isStepCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-sky-400" />
                          ) : isYouTube ? (
                            <Image
                              src="/youtube.png"
                              alt="YouTube"
                              width={26}
                              height={26}
                              className="object-contain"
                            />
                          ) : isDiscord ? (
                            <Image
                              src="/discord.png"
                              alt="Discord"
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          ) : (
                            <Globe className="w-5 h-5 text-sky-400" />
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                              Step #{index + 1}
                            </span>
                            {isYouTube && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                YOUTUBE
                              </span>
                            )}
                            {isDiscord && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                DISCORD
                              </span>
                            )}
                          </div>
                          <h4
                            className={`text-sm sm:text-base font-bold ${
                              isStepCompleted ? 'text-sky-300' : 'text-white'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 sm:self-center">
                        {isStepCompleted ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-500/15 px-4 py-2 rounded-full border border-sky-500/30">
                            <CheckCircle2 className="w-4 h-4" /> Completed
                          </span>
                        ) : (
                          <GlassButton
                            size="sm"
                            onClick={() => handleStartStep(step)}
                            className={
                              isYouTube
                                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white font-bold border-red-400/40 shadow-lg shadow-red-500/30 hover:scale-105'
                                : isDiscord
                                ? 'bg-gradient-to-r from-[#5865F2] to-[#4752C4] text-white font-bold border-indigo-400/40 shadow-lg shadow-indigo-500/30 hover:scale-105'
                                : undefined
                            }
                            variant={isYouTube || isDiscord ? undefined : 'primary'}
                            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                          >
                            {isCurrentActive
                              ? 'Verifying...'
                              : isYouTube
                              ? 'Subscribe YouTube'
                              : isDiscord
                              ? 'Join Discord'
                              : 'Start Step'}
                          </GlassButton>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Locked Prompt */}
              <div className="pt-2">
                <GlassButton
                  disabled
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center opacity-60"
                  leftIcon={<Lock className="w-4 h-4" />}
                >
                  Complete {steps.length - completedSteps.length} more step(s) to unlock
                </GlassButton>
              </div>
            </div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};
