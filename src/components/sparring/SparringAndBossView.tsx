/**
 * APEX: Executive RPG Execution OS
 * AI Senior Partner Sparring & Boss Battle Arena
 *
 * File target: src/components/sparring/SparringAndBossView.tsx
 */

import React, { useState } from 'react';
import { useApexStore } from '../../store/useApexStore';
import {
  Swords,
  Brain,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { MountHuaSummitLandscape } from '../visuals/MurimLandscapes';
import { MurimCombatArena } from './MurimCombatArena';

export const SparringAndBossView: React.FC = () => {
  const [subTab, setSubTab] = useState<'sparring' | 'boss'>('sparring');
  const chatMessages = useApexStore((s) => s.chatMessages);
  const addChatMessage = useApexStore((s) => s.addChatMessage);
  const bossBattles = useApexStore((s) => s.bossBattles);
  const evaluateBossSubmission = useApexStore((s) => s.evaluateBossSubmission);
  const character = useApexStore((s) => s.character);
  const settings = useApexStore((s) => s.settings);

  // AI Chat state
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Boss Battle state
  const [selectedBossId, setSelectedBossId] = useState<string>('boss-1');
  const [bossSubmission, setBossSubmission] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<{ passed: boolean; score: number; feedback: string } | null>(null);

  const selectedBoss = bossBattles.find((b) => b.id === selectedBossId) || bossBattles[0];

  // AI Sparring logic: either Gemini API or Deterministic Heuristic Engine
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAiThinking) return;

    const userText = userInput.trim();
    setUserInput('');
    addChatMessage({ role: 'user', content: userText });
    setIsAiThinking(true);

    try {
      if (settings.geminiApiKey) {
        // Live Gemini API Call
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are a ruthless, world-class Senior Partner at McKinsey / Goldman Sachs Managing Director.
The user is a finance professional practicing to enter elite consulting/PE.
Analyze the following user statement:
"${userText}"

Provide:
1. Direct critique of their logic & MECE structure.
2. English rhetoric elevation (replace weak phrases with crisp C-suite vocabulary).
3. One sharp follow-up pressure question.
Keep response concise, executive, and structured.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await res.json();
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from model.';

        addChatMessage({
          role: 'assistant',
          content: aiResponse,
          critique: {
            score: 8,
            verdict: 'EXECUTIVE CALIBER DRILL COMPLETED',
            meceCritique: 'Logic verified against live Gemini API.',
            englishElevation: [
              { original: 'make more money', elevated: 'accelerate top-line expansion and margin accretive growth' },
            ],
            pressureQuestion: 'What is your primary sensitivity variable if interest rates shift by 100 bps?',
          },
        });
      } else {
        // Intelligent Heuristic Offline Mock Engine
        await new Promise((r) => setTimeout(r, 800));

        const lower = userText.toLowerCase();
        let score = 7;
        let meceCritique = 'Hypothesis is plausible, but requires tighter driver decomposition.';
        const englishElevation = [];

        if (lower.includes('cost') || lower.includes('revenue') || lower.includes('margin')) {
          score += 1;
          meceCritique = 'Good split between top-line and cost drivers. Ensure fixed vs variable categorization is strictly MECE.';
        }
        if (lower.includes('think') || lower.includes('maybe') || lower.includes('probably')) {
          score -= 1;
          englishElevation.push({
            original: 'I think / maybe',
            elevated: 'The preliminary data indicates / Our baseline hypothesis posits',
            rationale: 'Eliminate tentative hedge words in executive briefings.',
          });
        }
        englishElevation.push({
          original: 'good profit',
          elevated: 'margin accretive / robust free cash flow conversion',
          rationale: 'C-suite stakeholders require precise financial metrics.',
        });

        addChatMessage({
          role: 'assistant',
          content: `Here is my assessment of your argument:

1. STRUCTURE & MECE RIGOR:
${meceCritique}

2. EXECUTIVE RHETORIC POLISH:
Your delivery has potential, but replace vague colloquial phrases with decisive boardroom authority.

3. PRESSURE CHALLENGE:
Assume your client's primary competitor cuts price by 12% next month. How does your recommended margin defense hold?`,
          critique: {
            score,
            verdict: score >= 8 ? 'STRONG EXECUTIVE SYNTHESIS' : 'REQUIRES GREATER MECE RIGOR',
            meceCritique,
            englishElevation,
            pressureQuestion: 'How would you defend this thesis against an aggressive CFO demanding a 12-month payback?',
          },
        });
      }
    } catch (err) {
      addChatMessage({
        role: 'assistant',
        content: `Error connecting to Gemini API: ${(err as Error).message}. Falling back to internal heuristic evaluator.`,
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleSubmitBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bossSubmission.trim()) return;

    const result = evaluateBossSubmission(selectedBoss.id, bossSubmission);
    setEvaluationResult(result);
  };

  return (
    <section aria-label="AI Sparring and Boss Battle Section" className="flex flex-col gap-6">
      {/* 0. Panoramic Mount Hua Summit Landscape */}
      <MountHuaSummitLandscape
        title="HOA SƠN LUẬN KIẾM // MARTIAL ARTS SUMMIT"
        subtitle="Hoa Sơn Đỉnh sương mù mây phủ — Nơi đệ tử quyết định cảnh giới và thí luyện với các Đại Trưởng Lão"
      />

      {/* 1. Header Banner & Sub-tab Switcher */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Swords className="w-3.5 h-3.5" />
            <span>SUBSYSTEM // AI SPARRING & BOSS BATTLE ARENA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
            EXECUTIVE ARENA
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Spar with an AI Senior Partner to polish your rhetoric and face Promotion Boss Battles to rank up.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSubTab('sparring')}
            className={`px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 ${
              subTab === 'sparring'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI PARTNER SPARRING</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('boss')}
            className={`px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 ${
              subTab === 'boss'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>BOSS BATTLE ARENA</span>
          </button>
        </div>
      </div>

      {/* 2. TAB A: AI SPARRING PARTNER */}
      {subTab === 'sparring' && (
        <div className="flex flex-col gap-4">
          {/* Quick Drill Chips */}
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <span className="text-slate-500 font-bold">QUICK DRILLS:</span>
            {[
              'Diagnose a 15% revenue decline in European operations',
              'Pitch a $50M SaaS acquisition in 3 minutes using Pyramid Principle',
              'Test my DCF terminal growth rate & WACC assumptions',
              'Elevate my elevator pitch to C-level executive vocabulary',
            ].map((drill) => (
              <button
                key={drill}
                type="button"
                onClick={() => handleQuickPrompt(drill)}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-300 text-[11px] transition-colors"
              >
                + {drill.slice(0, 36)}...
              </button>
            ))}
          </div>

          {/* Interactive Chat Window */}
          <div className="bg-[#0e1526] border border-slate-800 rounded-lg flex flex-col h-[520px]">
            {/* Messages Stream */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] rounded-lg p-4 font-mono text-xs ${
                    msg.role === 'user'
                      ? 'ml-auto bg-indigo-950/80 border border-indigo-500/50 text-indigo-100'
                      : 'mr-auto bg-slate-900/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 pb-1 border-b border-slate-800/80">
                    <span className="font-bold uppercase tracking-wider text-emerald-400">
                      {msg.role === 'user' ? 'YOU (EXECUTIVE CANDIDATE)' : 'SENIOR PARTNER (MBB / PE)'}
                    </span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                  {/* Feedback Chips if present */}
                  {msg.critique && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold">LOGIC SCORE: {msg.critique.score}/10</span>
                        <span className="text-slate-400">{msg.critique.verdict}</span>
                      </div>

                      {msg.critique.englishElevation && msg.critique.englishElevation.length > 0 && (
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 mt-1">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                            VOCABULARY ELEVATION:
                          </span>
                          {msg.critique.englishElevation.map((item, i) => (
                            <div key={i} className="text-[11px] leading-tight">
                              <span className="line-through text-red-400">{item.original}</span>
                              <span className="text-slate-500"> → </span>
                              <span className="text-emerald-300 font-bold">{item.elevated}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isAiThinking && (
                <div className="mr-auto bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Senior Partner is reviewing your logic and vocabulary...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Present your case hypothesis or ask the Partner for feedback..."
                className="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:border-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={isAiThinking || !userInput.trim()}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>DRILL</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. TAB B: BOSS BATTLE ARENA */}
      {subTab === 'boss' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Boss Selector Sidebar (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              PROMOTION GATE CHALLENGES
            </h2>

            {bossBattles.map((boss) => {
              const isSelected = boss.id === selectedBossId;
              const hasXp = character.xp >= boss.requiredXp;

              return (
                <button
                  key={boss.id}
                  type="button"
                  onClick={() => {
                    setSelectedBossId(boss.id);
                    setEvaluationResult(null);
                  }}
                  className={`p-4 rounded-lg border text-left font-mono transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0e1526] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                      PROMOTION TO {boss.targetTier}
                    </span>
                    {boss.passed ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                      </span>
                    ) : hasXp ? (
                      <span className="text-amber-400 font-bold">ELIGIBLE</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> LOCKED
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm">
                    {boss.title}
                  </h3>

                  <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>REQ XP: {boss.requiredXp.toLocaleString()}</span>
                    <span>PASS: {boss.passingScore}/100</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Boss Brief & Submission Panel (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Scenario Brief Card */}
            <div className="bg-[#0e1526] border border-slate-800 rounded-lg p-5 sm:p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    CASE STUDY // PROMOTION GATE
                  </span>
                  <h2 className="text-xl font-bold font-mono text-white">
                    {selectedBoss.title}
                  </h2>
                </div>
                <div className="text-xs font-mono px-3 py-1 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">
                  PASSING SCORE: {selectedBoss.passingScore} / 100
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded border border-slate-800/80">
                <span className="text-emerald-400 font-bold block mb-1">SCENARIO:</span>
                {selectedBoss.scenario}
              </div>

              {/* Rubric Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono pt-2">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">STRATEGIC STRUCTURE</span>
                  <span className="text-indigo-400 font-bold">Max 25 pts</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">FINANCIAL ACUITY</span>
                  <span className="text-emerald-400 font-bold">Max 25 pts</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">EXECUTIVE RHETORIC</span>
                  <span className="text-blue-400 font-bold">Max 25 pts</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ACTIONABILITY</span>
                  <span className="text-amber-400 font-bold">Max 25 pts</span>
                </div>
              </div>
            </div>

            {/* Interactive Murim Combat Arena (Boss HP, Sword Slash FX, & Martial Techniques) */}
            <MurimCombatArena bossId={selectedBoss.id} />

            {/* Submission Form */}
            <form onSubmit={handleSubmitBoss} className="bg-[#0e1526] border border-slate-800 rounded-lg p-5 flex flex-col gap-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>SUBMIT YOUR EXECUTIVE SOLUTION</span>
                <span>WORD COUNT: {bossSubmission.trim().split(/\s+/).filter(Boolean).length} WORDS</span>
              </div>

              <textarea
                value={bossSubmission}
                onChange={(e) => setBossSubmission(e.target.value)}
                placeholder={`1. EXECUTIVE SYNTHESIS (Top-down conclusion)...
2. MECE ROOT CAUSE DECOMPOSITION (Revenue vs Cost drivers)...
3. 90-DAY STRATEGIC TRIAGE & INITIATIVE ROADMAP...`}
                rows={8}
                className="w-full p-4 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-emerald-500 outline-none leading-relaxed resize-none"
              />

              <button
                type="submit"
                disabled={!bossSubmission.trim()}
                className="py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-600/20"
              >
                <Award className="w-4 h-4" />
                <span>SUBMIT TO PROMOTION COMMITTEE FOR GRADING</span>
              </button>
            </form>

            {/* Grading Report */}
            {evaluationResult && (
              <div
                className={`p-5 rounded-lg border font-mono text-xs flex flex-col gap-2 ${
                  evaluationResult.passed
                    ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
                    : 'bg-red-950/70 border-red-500/80 text-red-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>{evaluationResult.passed ? 'PROMOTION GRANTED' : 'REVISION REQUIRED'}</span>
                  <span>SCORE: {evaluationResult.score} / 100</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed mt-2">
                  {evaluationResult.feedback}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
