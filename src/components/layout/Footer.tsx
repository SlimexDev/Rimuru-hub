import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { GlassBadge } from '../ui/GlassBadge';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 border-t border-sky-500/15 bg-black/40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white/[0.06] border border-sky-500/20 p-1 shadow-md shadow-sky-500/20">
                <Image
                  src="/logo.png"
                  alt="Rimuru Script"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-lg text-white">
                Rimuru<span className="text-sky-400">Script</span>
              </span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed">
              The premier Roblox Script Hub crafted with Apple Liquid Glass aesthetic. All scripts are sandbox tested and verified keyless for maximum security.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <GlassBadge variant="cyan" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                100% Sandbox Tested
              </GlassBadge>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <Link href="/scripts" className="hover:text-sky-400 transition-colors">
                  All Roblox Scripts
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-sky-400 transition-colors">
                  Execution & Bypass Guides
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-sky-400 transition-colors">
                  Safety & Audit Protocol
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors">
                  Contact Support & Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Executors */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Compatible Executors
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Solara Executor (PC)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Delta Executor (Android & iOS)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Wave & Synapse Z (PC)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" /> Codex & Hydrogen (Mobile)
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <Link href="/terms" className="hover:text-sky-400 transition-colors">
                  Terms of Service & Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/terms#privacy" className="hover:text-sky-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors">
                  DMCA Takedown & Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-10 pt-6 border-t border-sky-500/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p className="text-center md:text-left max-w-2xl">
            Disclaimer: Rimuru Script Hub is not affiliated, endorsed, or partnered with Roblox Corporation. All scripts and trademarks belong to their respective creators and are shared for educational and testing purposes.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <span>© {new Date().getFullYear()} Rimuru Script Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
