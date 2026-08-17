'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  BookOpen,
  ShieldCheck,
  Mail,
  FileText,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { GlassButton } from '../ui/GlassButton';
import { GlassBadge } from '../ui/GlassBadge';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Scripts', href: '/scripts', icon: <Code2 className="w-4 h-4" /> },
    { name: 'Guides', href: '/guides', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Trust & Safety', href: '/trust', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
    { name: 'Terms', href: '/terms', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-2.5 bg-black/50 backdrop-blur-2xl border-b border-sky-500/15 shadow-2xl'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.06] border border-sky-500/20 p-1 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 group-hover:scale-105 transition-all">
              <Image
                src="/logo.png"
                alt="Rimuru Script Logo"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  Rimuru<span className="text-sky-400">Script</span>
                </span>
                <GlassBadge variant="cyan" size="sm" className="hidden sm:inline-flex">
                  Slime Hub
                </GlassBadge>
              </div>
              <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase -mt-0.5 hidden sm:block">
                Roblox Script Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-sky-500/15 backdrop-blur-xl shadow-glass">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-2 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-sky-500/25 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Button (Search Only, Admin button hidden from public) */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/scripts">
              <GlassButton
                size="sm"
                variant="secondary"
                leftIcon={<Search className="w-3.5 h-3.5 text-sky-400" />}
              >
                Search Scripts
              </GlassButton>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/scripts">
              <GlassButton size="icon" variant="secondary" aria-label="Search">
                <Search className="w-4 h-4 text-sky-400" />
              </GlassButton>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b border-sky-500/15 bg-black/85 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-5 py-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
