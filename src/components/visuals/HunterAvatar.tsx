/**
 * APEX: Executive RPG Execution OS
 * Solo Leveling Procedural Hunter Avatar (Vector SVG)
 *
 * File target: src/components/visuals/HunterAvatar.tsx
 */

import React from 'react';
import { CareerTier } from '../../types';

interface HunterAvatarProps {
  tier: CareerTier;
  level: number;
  className?: string;
  size?: number;
}

export const HunterAvatar: React.FC<HunterAvatarProps> = ({
  tier,
  level,
  className = '',
  size = 96,
}) => {
  const getTierAura = () => {
    switch (tier) {
      case 'Partner / MD':
        return {
          glow: 'rgba(245, 158, 11, 0.6)',
          gradient: ['#ffd700', '#f59e0b', '#7c2d12'],
          rank: 'S',
          rankColor: '#fbbf24',
          rankTitle: 'NATIONAL RANK',
        };
      case 'VP / Manager':
        return {
          glow: 'rgba(168, 85, 247, 0.55)',
          gradient: ['#c084fc', '#9333ea', '#3b0764'],
          rank: 'A',
          rankColor: '#c084fc',
          rankTitle: 'ELITE RANK',
        };
      case 'Associate':
        return {
          glow: 'rgba(59, 130, 246, 0.5)',
          gradient: ['#60a5fa', '#2563eb', '#1e3a8a'],
          rank: 'B',
          rankColor: '#60a5fa',
          rankTitle: 'SENIOR RANK',
        };
      case 'Junior Analyst':
      default:
        return {
          glow: 'rgba(0, 240, 255, 0.5)',
          gradient: ['#67e8f9', '#06b6d4', '#164e63'],
          rank: 'D',
          rankColor: '#22d3ee',
          rankTitle: 'APPRENTICE',
        };
    }
  };

  const aura = getTierAura();

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title={`Hunter Tier: ${tier} (Rank ${aura.rank})`}
    >
      {/* Outer Pulse Glow Halo */}
      <div
        className="absolute inset-0 rounded-full animate-pulse blur-md"
        style={{ background: aura.glow }}
      />

      {/* SVG Avatar Graphic */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`avatar-grad-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={aura.gradient[0]} />
            <stop offset="50%" stopColor={aura.gradient[1]} />
            <stop offset="100%" stopColor={aura.gradient[2]} />
          </linearGradient>

          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cyber Outer Ring with Tech Notches */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={`url(#avatar-grad-${tier})`}
          strokeWidth="2.5"
          strokeDasharray="6 3 12 3"
          className="opacity-90 animate-[spin_20s_linear_infinite]"
        />

        {/* Inner Glass Background */}
        <circle cx="50" cy="50" r="41" fill="#0b0f19" fillOpacity="0.95" />

        {/* Dynamic Shoulders & Trenchcoat Collar */}
        <path
          d="M20 86 C24 68, 38 62, 50 62 C62 62, 76 68, 80 86 Z"
          fill="#0e172a"
          stroke={`url(#avatar-grad-${tier})`}
          strokeWidth="1.5"
        />

        {/* Shadow Collar Tie / Executive Pin */}
        <path d="M48 64 L52 64 L50 78 Z" fill={aura.rankColor} />

        {/* Hunter Head / Mask Silhouette */}
        <path
          d="M34 44 C34 30, 42 22, 50 22 C58 22, 66 30, 66 44 C66 54, 58 60, 50 60 C42 60, 34 54, 34 44 Z"
          fill="#0f172a"
          stroke={`url(#avatar-grad-${tier})`}
          strokeWidth="1.5"
        />

        {/* Solo Leveling Glowing Hunter Eyes */}
        <ellipse
          cx="43"
          cy="42"
          rx="3.5"
          ry="1.8"
          fill={aura.rankColor}
          filter="url(#neon-glow)"
          className="animate-pulse"
        />
        <ellipse
          cx="57"
          cy="42"
          rx="3.5"
          ry="1.8"
          fill={aura.rankColor}
          filter="url(#neon-glow)"
          className="animate-pulse"
        />

        {/* Cybernetic Brow Highlight */}
        <path
          d="M39 37 L46 39 M54 39 L61 37"
          stroke={aura.rankColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Rank Badge Pill at bottom right */}
      <div
        className="absolute -bottom-1 -right-1 z-20 px-2 py-0.5 rounded-full text-[10px] font-mono font-black border flex items-center justify-center shadow-lg"
        style={{
          background: '#05070f',
          borderColor: aura.rankColor,
          color: aura.rankColor,
          boxShadow: `0 0 10px ${aura.glow}`,
        }}
      >
        <span>{aura.rank}</span>
      </div>

      {/* Level Tag at top left */}
      <div
        className="absolute -top-1 -left-1 z-20 px-1.5 py-0.2 rounded bg-slate-950 border border-slate-700 text-[9px] font-mono font-bold text-white shadow"
      >
        L{level}
      </div>
    </div>
  );
};
