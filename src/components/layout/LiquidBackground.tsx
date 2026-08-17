'use client';

import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#030712]">
      {/* Deep Navy/Ocean Base Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#041220] to-[#020b14] opacity-95" 
      />

      {/* Floating Liquid Blob 1 - Rimuru Vibrant Sky Cyan */}
      <div 
        className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full bg-sky-500/18 blur-[120px] animate-blob-float"
        style={{ animationDuration: '24s', animationDelay: '0s' }}
      />

      {/* Floating Liquid Blob 2 - Ocean Aqua Teal */}
      <div 
        className="absolute top-1/3 -right-20 w-[620px] h-[620px] rounded-full bg-cyan-500/18 blur-[140px] animate-blob-float"
        style={{ animationDuration: '30s', animationDelay: '-6s' }}
      />

      {/* Floating Liquid Blob 3 - Deep Crystal Water Blue */}
      <div 
        className="absolute bottom-10 left-10 w-[550px] h-[550px] rounded-full bg-blue-600/14 blur-[130px] animate-blob-float"
        style={{ animationDuration: '28s', animationDelay: '-12s' }}
      />

      {/* Floating Liquid Blob 4 - Slime Aqua Soft Accent */}
      <div 
        className="absolute top-2/3 right-1/3 w-[450px] h-[450px] rounded-full bg-sky-400/14 blur-[110px] animate-blob-float"
        style={{ animationDuration: '22s', animationDelay: '-18s' }}
      />

      {/* Subtle Noise / Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.75)_100%)] pointer-events-none" />
    </div>
  );
};
