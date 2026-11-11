/**
 * APEX: Executive RPG Execution OS
 * Character Profile & Career Progression View
 *
 * File target: src/components/character/CharacterView.tsx
 */

import React from 'react';
import { useApexStore } from '../../store/useApexStore';
import {
  Brain,
  MessageSquare,
  TrendingUp,
  Zap,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Clock,
  History,
  Shield,
  Activity,
} from 'lucide-react';
import { CareerTier } from '../../types';
import { HunterAvatar } from '../visuals/HunterAvatar';
import { StatRadarCanvas } from '../visuals/StatRadarCanvas';
import { RankCrestBadge } from '../visuals/RankCrestBadge';

export const CharacterView: React.FC = () => {
  const character = useApexStore((s) => s.character);
  const lockInHistory = useApexStore((s) => s.lockInHistory);
  const bossBattles = useApexStore((s) => s.bossBattles);

  const tiers: Array<{
    tier: CareerTier;
    reqXp: number;
    bossTitle: string;
    description: string;
  }> = [
    {
      tier: 'Junior Analyst',
      reqXp: 0,
      bossTitle: 'Starting Rank',
      description: 'Foundational accounting, Excel speed, core structured logic.',
    },
    {
      tier: 'Associate',
      reqXp: 2500,
      bossTitle: 'The Coffee Chain Profit Drop',
      description: 'Autonomous MECE analysis, driver trees, 3-min executive presentation.',
    },
    {
      tier: 'VP / Manager',
      reqXp: 10000,
      bossTitle: 'Tech SaaS Acquisition Target',
      description: 'End-to-end 3-statement valuation, investment committee pitch, project leadership.',
    },
    {
      tier: 'Partner / MD',
      reqXp: 30000,
      bossTitle: 'Boardroom Turnaround Pitch',
      description: 'C-suite crisis management, board defense, enterprise transformation.',
    },
  ];

  const currentTierIndex = tiers.findIndex((t) => t.tier === character.tier);

  return (
    <section aria-label="Character Profile Section" className="flex flex-col gap-6">
      {/* 1. Solo Leveling System Window Header Banner */}
      <div className="bg-[#0b1021]/80 backdrop-blur-md border-2 border-cyan-500/40 rounded-xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5">
          <HunterAvatar tier={character.tier} level={character.level} size={84} />

          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <RankCrestBadge tier={character.tier} />
              <span className="text-xs font-mono text-cyan-400 font-semibold">// EXECUTIVE DOSSIER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight flex items-center gap-2">
              <span>{character.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                LVL {character.level}
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {character.title}
            </p>
          </div>
        </div>

        {/* Career Stats Pills */}
        <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
          <div className="bg-slate-950/80 border border-slate-800 rounded px-3 py-2 flex flex-col">
            <span className="text-[10px] text-slate-500">TOTAL EXPERIENCE</span>
            <span className="text-emerald-400 font-bold text-sm">{character.xp.toLocaleString()} XP</span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded px-3 py-2 flex flex-col">
            <span className="text-[10px] text-slate-500">CURRENT STREAK</span>
            <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {character.streak.current} DAYS
            </span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded px-3 py-2 flex flex-col">
            <span className="text-[10px] text-slate-500">ALL-TIME RECORD</span>
            <span className="text-blue-400 font-bold text-sm">{character.streak.best} DAYS</span>
          </div>
        </div>
      </div>

      {/* 2. Visual Radar Hexagon & System Vitals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 4-Axis Diamond Radar Canvas (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0e1526] border border-cyan-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative">
          <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-400 mb-2 border-b border-slate-800 pb-2">
            <span className="font-bold tracking-wider">HUNTER ATTRIBUTE POLYGON</span>
            <span className="text-[10px] text-slate-500">SCALE: 0-50</span>
          </div>
          <StatRadarCanvas attributes={character.attributes} size={230} />
          <p className="text-[11px] font-mono text-slate-400 mt-2">
            Balanced growth across all 4 quadrants unlocks higher Boss Victory probabilities.
          </p>
        </div>

        {/* Right: Hunter Vitals & HP / Mana Gauges (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0e1526] border border-slate-800 rounded-xl p-6 flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>HUNTER BIOMETRICS // COGNITIVE VITALS</span>
            </span>
            <span className="text-slate-500">COMBAT READINESS: 100%</span>
          </div>

          {/* HP / Discipline Gauge */}
          <div className="flex flex-col gap-1.5 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>DISCIPLINE HP (STREAK INTEGRITY)</span>
              </span>
              <span className="text-slate-300 font-bold">100 / 100</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 rounded-full w-full transition-all" />
            </div>
          </div>

          {/* Mana / Cognitive Deep Work Gauge */}
          <div className="flex flex-col gap-1.5 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>COGNITIVE MANA (DEEP WORK POOL)</span>
              </span>
              <span className="text-slate-300 font-bold">100 / 100</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400 rounded-full w-full transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-slate-800/80">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">CURRENT CLASS</span>
              <span className="text-cyan-300 font-bold text-sm">Strategic Analyst</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">PROMOTION GATE</span>
              <span className="text-amber-400 font-bold text-sm">Associate Exam</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core 4 Attributes Grid */}
      <div>
        <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>Core Executive Competencies (Attributes)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Strategic Mind */}
          <div className="bg-[#0e1526] border border-indigo-500/30 rounded-lg p-5 flex flex-col justify-between hover:border-indigo-500/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-xs">
                  <Brain className="w-4 h-4" />
                  <span>STRATEGIC MIND</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">[STR]</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-2">
                {character.attributes.strategicMind}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                MECE structuring, issue trees, 80/20 hypothesis-driven problem decomposition.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Standard: MBB Caliber</span>
              <span className="text-indigo-400 font-bold">LVL {Math.floor(character.attributes.strategicMind / 5)}</span>
            </div>
          </div>

          {/* English Rhetoric */}
          <div className="bg-[#0e1526] border border-blue-500/30 rounded-lg p-5 flex flex-col justify-between hover:border-blue-500/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-xs">
                  <MessageSquare className="w-4 h-4" />
                  <span>ENGLISH RHETORIC</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">[ENG]</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-2">
                {character.attributes.englishRhetoric}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                C-level vocabulary, top-down Pyramid Principle delivery, boardroom defense presence.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Standard: C-Suite Pitch</span>
              <span className="text-blue-400 font-bold">LVL {Math.floor(character.attributes.englishRhetoric / 5)}</span>
            </div>
          </div>

          {/* Finance IQ */}
          <div className="bg-[#0e1526] border border-emerald-500/30 rounded-lg p-5 flex flex-col justify-between hover:border-emerald-500/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                  <TrendingUp className="w-4 h-4" />
                  <span>FINANCE IQ</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">[FIN]</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-2">
                {character.attributes.financeIQ}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                3-Statement modeling, DCF valuation, EBITDA drivers, M&A thesis synthesis.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Standard: Wall Street IB</span>
              <span className="text-emerald-400 font-bold">LVL {Math.floor(character.attributes.financeIQ / 5)}</span>
            </div>
          </div>

          {/* Grit & Stamina */}
          <div className="bg-[#0e1526] border border-amber-500/30 rounded-lg p-5 flex flex-col justify-between hover:border-amber-500/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>GRIT & STAMINA</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">[STA]</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-2">
                {character.attributes.gritStamina}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unbroken deep-work endurance, mental toughness, physical workout discipline.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Standard: Lock-In Hours</span>
              <span className="text-amber-400 font-bold">LVL {Math.floor(character.attributes.gritStamina / 5)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Career Promotion Tier Roadmap */}
      <div>
        <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Executive Promotion Ladder (Career Tiers)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((t, idx) => {
            const isCurrent = t.tier === character.tier;
            const isUnlocked = idx <= currentTierIndex;
            const boss = bossBattles.find((b) => b.targetTier === t.tier);

            return (
              <div
                key={t.tier}
                className={`bg-[#0e1526] border rounded-lg p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isCurrent
                    ? 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-slate-900/80'
                    : isUnlocked
                    ? 'border-slate-700/80'
                    : 'border-slate-800/60 opacity-60'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                    CURRENT RANK
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      {t.tier}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 mb-3">
                    {t.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] font-mono flex flex-col gap-1">
                  <div className="flex justify-between text-slate-400">
                    <span>REQ XP:</span>
                    <span className="text-amber-400 font-bold">{t.reqXp.toLocaleString()}</span>
                  </div>
                  {t.tier !== 'Junior Analyst' && (
                    <div className="flex justify-between text-slate-400">
                      <span>BOSS GATE:</span>
                      <span className={boss?.passed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {boss?.passed ? 'PASSED' : 'LOCKED'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Lock-In Deep Work Session History */}
      <div>
        <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" />
          <span>Lock-In Deep Work Session History ({lockInHistory.length})</span>
        </h2>

        {lockInHistory.length === 0 ? (
          <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-6 text-center text-xs font-mono text-slate-500">
            No completed deep-work sessions logged yet. Activate a Lock-In sprint from the Lock-In tab to log your hours.
          </div>
        ) : (
          <div className="bg-[#0e1526] border border-slate-800 rounded-lg divide-y divide-slate-800">
            {lockInHistory.slice(0, 5).map((session) => (
              <div key={session.id} className="p-4 flex items-center justify-between gap-4 flex-wrap text-xs font-mono">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-white font-bold">{session.presetMinutes}m Deep Work Sprint</span>
                    <p className="text-[11px] text-slate-500">
                      Completed: {session.completedAt ? new Date(session.completedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {session.notes && (
                    <span className="text-slate-400 text-[11px] max-w-xs truncate hidden sm:inline">
                      "{session.notes}"
                    </span>
                  )}
                  <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                    +{session.xpEarned} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
