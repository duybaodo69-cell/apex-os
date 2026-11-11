/**
 * APEX: Executive RPG Execution OS
 * Level-Up Celebration Modal
 *
 * File target: src/components/character/LevelUpModal.tsx
 */

import React, { useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useApexStore } from '../../store/useApexStore';
import confetti from 'canvas-confetti';

export const LevelUpModal: React.FC = () => {
  const newLevelUpUnlocked = useApexStore((s) => s.newLevelUpUnlocked);
  const character = useApexStore((s) => s.character);
  const dismissLevelUpModal = useApexStore((s) => s.dismissLevelUpModal);

  useEffect(() => {
    if (newLevelUpUnlocked) {
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#a855f7'],
        });
      } catch {
        // Safe no-op in testing
      }
    }
  }, [newLevelUpUnlocked]);

  if (!newLevelUpUnlocked) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Level Up Celebration"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#0e1526] border-2 border-emerald-500/80 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase mb-1">
          EXECUTIVE LEVEL ASCENSION
        </span>

        <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight">
          LEVEL {newLevelUpUnlocked.level} ACHIEVED
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          Your cognitive stamina and deliberate practice have expanded your executive capacity.
        </p>

        {/* Level Progression Indicator */}
        <div className="flex items-center justify-center gap-4 my-6 w-full py-3 bg-slate-900/80 rounded-lg border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono text-slate-500">PREVIOUS</span>
            <span className="text-lg font-bold font-mono text-slate-400">LVL {newLevelUpUnlocked.oldLevel}</span>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400" />
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono text-emerald-400 font-bold">ASCENDED</span>
            <span className="text-2xl font-bold font-mono text-emerald-300">LVL {newLevelUpUnlocked.level}</span>
          </div>
        </div>

        {/* Current Attributes Snapshot */}
        <div className="grid grid-cols-2 gap-2 w-full text-left text-xs font-mono mb-6">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-400">STRATEGIC MIND:</span>
            <span className="float-right text-indigo-400 font-bold">{character.attributes.strategicMind}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-400">ENGLISH RHETORIC:</span>
            <span className="float-right text-blue-400 font-bold">{character.attributes.englishRhetoric}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-400">FINANCE IQ:</span>
            <span className="float-right text-emerald-400 font-bold">{character.attributes.financeIQ}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-400">GRIT & STAMINA:</span>
            <span className="float-right text-amber-400 font-bold">{character.attributes.gritStamina}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={dismissLevelUpModal}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-mono text-sm rounded-lg shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
        >
          <span>CLAIM STATUS & LOCK IN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
