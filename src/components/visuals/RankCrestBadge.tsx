/**
 * APEX: Executive RPG Execution OS
 * Solo Leveling Hunter Rank Crest Badge (Vector Shield)
 *
 * File target: src/components/visuals/RankCrestBadge.tsx
 */

import React from 'react';
import { CareerTier } from '../../types';

interface RankCrestBadgeProps {
  tier: CareerTier;
  className?: string;
}

export const RankCrestBadge: React.FC<RankCrestBadgeProps> = ({ tier, className = '' }) => {
  const getConfig = () => {
    switch (tier) {
      case 'Partner / MD':
        return {
          rankLetter: 'S',
          title: 'NATIONAL RANK',
          gradient: 'from-amber-500 via-yellow-300 to-amber-600',
          border: 'border-amber-400',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
          textColor: 'text-amber-300',
        };
      case 'VP / Manager':
        return {
          rankLetter: 'A',
          title: 'ELITE RANK',
          gradient: 'from-purple-500 via-fuchsia-300 to-purple-700',
          border: 'border-purple-400',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.35)]',
          textColor: 'text-purple-300',
        };
      case 'Associate':
        return {
          rankLetter: 'B',
          title: 'SENIOR RANK',
          gradient: 'from-blue-500 via-cyan-300 to-blue-700',
          border: 'border-blue-400',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
          textColor: 'text-blue-300',
        };
      case 'Junior Analyst':
      default:
        return {
          rankLetter: 'D',
          title: 'APPRENTICE',
          gradient: 'from-cyan-500 via-teal-300 to-cyan-700',
          border: 'border-cyan-400',
          glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
          textColor: 'text-cyan-300',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#070c18] border ${config.border} ${config.glow} font-mono select-none ${className}`}
    >
      <div
        className={`w-5 h-5 rounded-sm bg-gradient-to-br ${config.gradient} flex items-center justify-center font-black text-slate-950 text-xs shadow`}
      >
        {config.rankLetter}
      </div>

      <div className="flex flex-col text-left leading-none">
        <span className={`text-[10px] font-bold ${config.textColor}`}>
          [{tier.toUpperCase()}]
        </span>
        <span className="text-[8px] text-slate-400 tracking-wider">
          {config.title}
        </span>
      </div>
    </div>
  );
};
