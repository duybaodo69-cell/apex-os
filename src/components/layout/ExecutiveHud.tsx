import React, { useEffect, useState } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Shield,
  Brain,
  MessageSquare,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { CharacterState, CareerTier } from '../../types';
import { HunterAvatar } from '../visuals/HunterAvatar';

export interface LevelProgressMetrics {
  level: number;
  safeXp: number;
  currentLevelBaseXp: number;
  nextLevelBaseXp: number;
  xpNeededForLevel: number;
  xpCurrentInLevel: number;
  progressPercent: number;
}

/**
 * Calculates continuous level progress based on APEX formula:
 * Level = floor(sqrt(XP / 25)) + 1
 */
export function calculateLevelMetrics(xp: number = 0): LevelProgressMetrics {
  const safeXp = Math.max(0, Math.floor(xp || 0));
  const level = Math.floor(Math.sqrt(safeXp / 25)) + 1;
  const currentLevelBaseXp = Math.pow(level - 1, 2) * 25;
  const nextLevelBaseXp = Math.pow(level, 2) * 25;
  const xpNeededForLevel = nextLevelBaseXp - currentLevelBaseXp;
  const xpCurrentInLevel = safeXp - currentLevelBaseXp;
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round((xpCurrentInLevel / (xpNeededForLevel || 1)) * 100)
    )
  );

  return {
    level,
    safeXp,
    currentLevelBaseXp,
    nextLevelBaseXp,
    xpNeededForLevel,
    xpCurrentInLevel,
    progressPercent,
  };
}

/**
 * Returns Bloomberg-style executive badge styling for each career tier.
 */
export function getTierBadgeConfig(tier: CareerTier = 'Junior Analyst') {
  switch (tier) {
    case 'Partner / MD':
      return {
        label: 'PARTNER / MD',
        badgeClasses:
          'bg-purple-950/70 text-purple-300 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.25)]',
        accentColor: 'text-purple-400',
      };
    case 'VP / Manager':
      return {
        label: 'VP / MANAGER',
        badgeClasses:
          'bg-amber-950/70 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
        accentColor: 'text-amber-400',
      };
    case 'Associate':
      return {
        label: 'ASSOCIATE',
        badgeClasses:
          'bg-blue-950/70 text-blue-300 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
        accentColor: 'text-blue-400',
      };
    case 'Junior Analyst':
    default:
      return {
        label: 'JUNIOR ANALYST',
        badgeClasses:
          'bg-emerald-950/70 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        accentColor: 'text-emerald-400',
      };
  }
}

export interface ExecutiveHudProps {
  character?: CharacterState;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onOpenSettings?: () => void;
}

const DEFAULT_CHARACTER: CharacterState = {
  name: 'Executive Analyst',
  title: 'Strategic Finance Associate',
  tier: 'Junior Analyst',
  level: 1,
  xp: 0,
  attributes: {
    strategicMind: 10,
    englishRhetoric: 10,
    financeIQ: 10,
    gritStamina: 10,
  },
  streak: {
    current: 1,
    best: 1,
    lastActiveDate: null,
  },
};

export const ExecutiveHud: React.FC<ExecutiveHudProps> = ({
  character = DEFAULT_CHARACTER,
  soundEnabled = true,
  onToggleSound,
}) => {
  const [clock, setClock] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const {
    level,
    safeXp,
    xpNeededForLevel,
    xpCurrentInLevel,
    progressPercent,
  } = calculateLevelMetrics(character.xp);

  const tierConfig = getTierBadgeConfig(character.tier);
  const streak = character.streak || { current: 1, best: 1, lastActiveDate: null };
  const attributes = character.attributes || {
    strategicMind: 10,
    englishRhetoric: 10,
    financeIQ: 10,
    gritStamina: 10,
  };

  return (
    <header className="w-full bg-[#0b0f19] border-b border-slate-800/80 px-3 py-2 sm:px-4 sm:py-2.5 text-slate-100 select-none shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left Section: System Telemetry & Career Rank */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <HunterAvatar tier={character.tier} level={level} size={32} />

          {/* Status Indicator & System Clock */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wider text-emerald-400">
              APEX OS v1.0
            </span>
            <span className="text-slate-600">//</span>
            <span className="text-slate-400 min-w-[55px]">
              {clock || 'ONLINE'}
            </span>
          </div>

          {/* Career Tier Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-bold tracking-wider ${tierConfig.badgeClasses}`}
            title={`Current Rank: ${character.tier}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>[{tierConfig.label}]</span>
          </div>
        </div>

        {/* Center Section: Level & XP Telemetry Bar + Streak Counter */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Level Badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400">
            <span>LVL</span>
            <span className="text-white text-sm">{level}</span>
          </div>

          {/* XP Progress Gauge */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 gap-3">
              <span>{xpCurrentInLevel} / {xpNeededForLevel} XP</span>
              <span className="text-emerald-400 font-semibold">
                {progressPercent}%
              </span>
            </div>
            <div
              className="w-32 sm:w-44 md:w-52 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative"
              title={`Total XP: ${safeXp}`}
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300"
            title={`Best streak: ${streak.best} days`}
          >
            <Flame
              className={`w-4 h-4 ${
                streak.current > 0
                  ? 'text-amber-400 fill-amber-400 animate-pulse'
                  : 'text-slate-600'
              }`}
            />
            <span className="font-bold text-amber-300">
              {streak.current} {streak.current === 1 ? 'DAY' : 'DAYS'}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              STREAK
            </span>
          </div>
        </div>

        {/* Right Section: Core 4 Attributes & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Core Attributes Mini Badges */}
          <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[11px]">
            {/* Strategic Mind (STR) */}
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-slate-300"
              title="Strategic Mind (STR): MECE, Issue Trees, 80/20"
            >
              <Brain className="w-3 h-3 text-indigo-400" />
              <span className="text-slate-500">STR</span>
              <span className="font-bold text-white">{attributes.strategicMind}</span>
            </div>

            {/* English Rhetoric (ENG) */}
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-slate-300"
              title="English Rhetoric (ENG): C-Suite articulation, Executive Presence"
            >
              <MessageSquare className="w-3 h-3 text-sky-400" />
              <span className="text-slate-500">ENG</span>
              <span className="font-bold text-white">{attributes.englishRhetoric}</span>
            </div>

            {/* Finance IQ (FIN) */}
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-slate-300"
              title="Finance IQ (FIN): 3-Statement Modeling, DCF Valuation"
            >
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-500">FIN</span>
              <span className="font-bold text-white">{attributes.financeIQ}</span>
            </div>

            {/* Grit & Stamina (STA) */}
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/80 text-slate-300"
              title="Grit & Stamina (STA): Deep Work Hours, Physical & Mental Fortitude"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-slate-500">STA</span>
              <span className="font-bold text-white">{attributes.gritStamina}</span>
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            title={soundEnabled ? 'Sound FX: ON (Click to mute)' : 'Sound FX: OFF (Click to unmute)'}
            className={`p-1.5 rounded border text-xs transition-all ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700/80 text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-800'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
