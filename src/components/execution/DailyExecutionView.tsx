/**
 * APEX: Executive RPG Execution OS
 * Daily Execution Engine & The Rule of 3
 *
 * File target: src/components/execution/DailyExecutionView.tsx
 */

import React, { useState } from 'react';
import { useApexStore } from '../../store/useApexStore';
import {
  Terminal,
  Plus,
  CheckCircle,
  Flame,
  Brain,
  MessageSquare,
  TrendingUp,
  Zap,
  Timer,
  AlertTriangle,
} from 'lucide-react';
import { CharacterAttributes, QuestCategory } from '../../types';

export const DailyExecutionView: React.FC = () => {
  const quests = useApexStore((s) => s.quests);
  const completeQuest = useApexStore((s) => s.completeQuest);
  const abandonQuest = useApexStore((s) => s.abandonQuest);
  const createCustomQuest = useApexStore((s) => s.createCustomQuest);
  const triggerGraceQuest = useApexStore((s) => s.triggerGraceQuest);
  const initLockInSession = useApexStore((s) => s.initLockInSession);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('STR');
  const [xpReward, setXpReward] = useState(150);
  const [errorMessage, setErrorMessage] = useState('');

  const activeQuests = quests.filter(
    (q) => q.status === 'pending' || q.status === 'in_progress'
  );
  const completedQuests = quests.filter((q) => q.status === 'completed');

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Quest title cannot be blank.');
      return;
    }

    const attrMap: Record<QuestCategory, keyof CharacterAttributes> = {
      STR: 'strategicMind',
      ENG: 'englishRhetoric',
      FIN: 'financeIQ',
      STA: 'gritStamina',
    };

    const success = createCustomQuest({
      title: title.trim(),
      description: description.trim() || 'Execute deliberate practice with focused rigor.',
      category,
      xpReward: Number(xpReward) || 100,
      attributeReward: {
        attribute: attrMap[category],
        amount: Math.max(3, Math.round(Number(xpReward) / 30)),
      },
    });

    if (!success) {
      setErrorMessage('RULE OF 3 ENFORCED: Maximum 3 active quests permitted. Complete or abandon an active quest first.');
    } else {
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setErrorMessage('');
    }
  };

  const getCategoryColor = (cat: QuestCategory) => {
    switch (cat) {
      case 'STR':
        return 'bg-indigo-950 text-indigo-400 border-indigo-500/30';
      case 'ENG':
        return 'bg-blue-950 text-blue-400 border-blue-500/30';
      case 'FIN':
        return 'bg-emerald-950 text-emerald-400 border-emerald-500/30';
      case 'STA':
        return 'bg-amber-950 text-amber-400 border-amber-500/30';
    }
  };

  const getCategoryIcon = (cat: QuestCategory) => {
    switch (cat) {
      case 'STR':
        return <Brain className="w-3.5 h-3.5" />;
      case 'ENG':
        return <MessageSquare className="w-3.5 h-3.5" />;
      case 'FIN':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'STA':
        return <Zap className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section aria-label="Daily Execution Section" className="flex flex-col gap-6">
      {/* 1. Subsystem Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>SUBSYSTEM // DAILY EXECUTION ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
            THE RULE OF 3 // COGNITIVE SHIELD
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Hard cap of at most 3 active daily quests. Shield your cognitive bandwidth from overload and execute with 80/20 leverage.
          </p>
        </div>

        {/* Quota Counter & Actions */}
        <div className="flex items-center gap-3 flex-wrap font-mono">
          <div
            className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-2 ${
              activeQuests.length >= 3
                ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}
          >
            <span>ACTIVE LOAD:</span>
            <span className={activeQuests.length >= 3 ? 'text-amber-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
              {activeQuests.length} / 3
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setIsModalOpen(true);
            }}
            disabled={activeQuests.length >= 3}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeQuests.length >= 3
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 border border-emerald-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD QUEST</span>
          </button>
        </div>
      </div>

      {/* 2. Low-Energy Grace Mode Banner */}
      <div className="bg-[#121829] border border-amber-500/40 rounded-lg p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-white text-sm">
                ANTI-BURNOUT // LOW-ENERGY GRACE MODE
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
                15 MIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Exhausted from day-job pressure? Activate a 15-minute reflection session to preserve your daily streak without guilt or burnout.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={triggerGraceQuest}
          className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-amber-500/20"
        >
          <Flame className="w-3.5 h-3.5 fill-slate-950" />
          <span>ACTIVATE GRACE SPRINT</span>
        </button>
      </div>

      {/* 3. The Rule of 3 Active Quests Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Active Priority Quests ({activeQuests.length}/3)</span>
          </h2>
          {activeQuests.length === 3 && (
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>COGNITIVE SHIELD ENGAGED</span>
            </span>
          )}
        </div>

        {activeQuests.length === 0 ? (
          <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-8 text-center flex flex-col items-center gap-3">
            <p className="text-xs font-mono text-slate-400">
              No active quests currently assigned. Add a high-leverage Finance or Consulting task above to lock in.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-bold transition-colors"
            >
              CREATE TODAY'S FIRST QUEST
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-[#0b1021]/90 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400/80 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] relative overflow-hidden"
              >
                {/* Top Corner Neon Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 text-cyan-400 border border-cyan-500/40">
                        {quest.xpReward >= 200 ? 'B-RANK' : quest.xpReward >= 150 ? 'C-RANK' : 'D-RANK'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${getCategoryColor(
                          quest.category
                        )}`}
                      >
                        {getCategoryIcon(quest.category)}
                        <span>{quest.category}</span>
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                      <span>+{quest.xpReward} XP</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-white font-mono text-base group-hover:text-cyan-300 transition-colors leading-snug">
                    {quest.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>STAT REWARD:</span>
                    <span className="text-emerald-400 font-bold">
                      +{quest.attributeReward?.amount || 5} {quest.attributeReward?.attribute}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => initLockInSession(50, quest.id)}
                      className="flex-1 min-h-[40px] py-2 px-3 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Timer className="w-4 h-4 text-cyan-400" />
                      <span>LOCK IN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => completeQuest(quest.id)}
                      className="flex-1 min-h-[40px] py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>CLAIM BOUNTY</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => abandonQuest(quest.id)}
                    className="w-full py-1 text-[11px] font-mono text-slate-500 hover:text-red-400 transition-colors text-center"
                  >
                    Abandon Quest (Free Slot)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Completed Quests Ledger */}
      {completedQuests.length > 0 && (
        <div>
          <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
            Completed Execution Ledger ({completedQuests.length})
          </h2>
          <div className="bg-[#0e1526] border border-slate-800 rounded-lg divide-y divide-slate-800">
            {completedQuests.slice(0, 5).map((q) => (
              <div key={q.id} className="p-3.5 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">{q.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px]">
                    {q.completedAt ? new Date(q.completedAt).toLocaleDateString() : 'Done'}
                  </span>
                  <span className="text-emerald-400 font-bold">+{q.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Create Custom Quest Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#0e1526] border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-mono font-bold text-white text-base">
                CREATE HIGH-LEVERAGE QUEST
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuest} className="flex flex-col gap-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">QUEST TITLE *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build LBO Debt Schedule without mouse"
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">STRATEGIC CONTEXT / BRIEF</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Define the scope, deliverables, and deliberate practice standard."
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">CORE ATTRIBUTE</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as QuestCategory)}
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="STR">Strategic Mind (STR)</option>
                    <option value="ENG">English Rhetoric (ENG)</option>
                    <option value="FIN">Finance IQ (FIN)</option>
                    <option value="STA">Grit & Stamina (STA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">XP BOUNTY</label>
                  <select
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value={100}>100 XP (Tactical Drill)</option>
                    <option value={150}>150 XP (Standard Session)</option>
                    <option value={200}>200 XP (Complex Model/Case)</option>
                    <option value={300}>300 XP (Deep Work Marathon)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-colors shadow-md shadow-emerald-500/20"
                >
                  CONFIRM ASSIGNMENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
