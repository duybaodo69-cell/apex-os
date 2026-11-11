/**
 * APEX: Executive RPG Execution OS
 * Turn-Based Murim Martial Arts Duel & Boss Combat Arena
 *
 * File target: src/components/sparring/MurimCombatArena.tsx
 */

import React, { useState } from 'react';
import { useApexStore, MartialStrikeResult } from '../../store/useApexStore';
import {
  Swords,
  Flame,
  Skull,
} from 'lucide-react';
import { playLevelUp, playClick } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface MurimCombatArenaProps {
  bossId: string;
}

export const MurimCombatArena: React.FC<MurimCombatArenaProps> = ({ bossId }) => {
  const bossBattles = useApexStore((s) => s.bossBattles);
  const bossHp = useApexStore((s) => s.bossHp);
  const executeMartialStrike = useApexStore((s) => s.executeMartialStrike);
  const settings = useApexStore((s) => s.settings);

  const [activeTechnique, setActiveTechnique] = useState<string>('MECE Trảm (Issue Tree Slash)');
  const [argumentInput, setArgumentInput] = useState<string>('');
  const [isStriking, setIsStriking] = useState<boolean>(false);
  const [lastStrikeResult, setLastStrikeResult] = useState<MartialStrikeResult | null>(null);
  const [combatLog, setCombatLog] = useState<Array<{ role: 'player' | 'boss'; text: string }>>([
    {
      role: 'boss',
      text: 'Đại Trưởng Lão đứng trên đỉnh Hoa Sơn, kiếm khí lượn lờ: "Muốn thăng cảnh giới, trước tiên hãy xuất chiêu chứng minh tư duy phản biện của ngươi!"',
    },
  ]);

  const boss = bossBattles.find((b) => b.id === bossId) || bossBattles[0];
  const currentHp = bossHp[boss.id] ?? 1000;
  const maxHp = 1000;
  const hpPercent = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));

  const techniques = [
    {
      name: 'MECE Trảm (Issue Tree Slash)',
      desc: 'Chém đứt gốc rễ vấn đề, bóc tách doanh thu vs biến phí',
      bonus: '+120 Dmg (Bạo Kích)',
      color: 'border-cyan-500 text-cyan-300 bg-cyan-950/60',
    },
    {
      name: 'Báo Cáo Kim Thân (3-Statement Defense)',
      desc: 'Hộ thể bằng bảng cân đối kế toán & dòng tiền tự do',
      bonus: '+100 Dmg (Vững Chắc)',
      color: 'border-emerald-500 text-emerald-300 bg-emerald-950/60',
    },
    {
      name: 'Khẩu Khí Lôi Đình (Pyramid Principle Roar)',
      desc: 'Sư tử hống C-Suite, kết luận trước - giải trình sau',
      bonus: '+80 Dmg (Áp Chế)',
      color: 'border-purple-500 text-purple-300 bg-purple-950/60',
    },
    {
      name: 'Vạn Kiếm Quy Tông (Ultimate DCF Valuation)',
      desc: 'Tuyệt kỹ định giá nhạy cảm, dồn toàn lực hạ gục Boss',
      bonus: '+200 Dmg (Chung Cực)',
      color: 'border-amber-500 text-amber-300 bg-amber-950/60',
    },
  ];

  const handleStrike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentInput.trim() || isStriking) return;

    setIsStriking(true);
    playClick().catch(() => {});

    // Trigger visual slash & combat calculation
    const result = executeMartialStrike(boss.id, activeTechnique, argumentInput);
    setLastStrikeResult(result);

    // Add to combat log
    const userLog = `Thiếu hiệp xuất chiêu [${activeTechnique}]: "${argumentInput.slice(0, 120)}..." gây ${result.damage} sát thương ${result.isCrit ? '(BẠO KÍCH MECE!)' : ''}`;
    setCombatLog((prev) => [
      { role: 'player', text: userLog },
      { role: 'boss', text: result.counterChallenge },
      ...prev,
    ]);

    // Live AI verification call if key exists
    if (settings.geminiApiKey) {
      try {
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
                      text: `Bạn là Đại Trưởng Lão Hoa Sơn (McKinsey Partner võ lâm).
Đối thủ vừa xuất kiếm chiêu: "${activeTechnique}" với khẩu quyết:
"${argumentInput}"

Hãy đáp lời bằng văn phong kiếm hiệp Murim manhwa sắc sảo (3-4 câu ngắn):
1. Nhận xét kiếm chiêu MECE/Tài chính của đối thủ có chuẩn không.
2. Tung 1 đòn phản biện gắt gao thử thách tiếp theo.`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await res.json();
        const aiDuelResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiDuelResponse) {
          setCombatLog((prev) => [
            { role: 'boss', text: `Đại Trưởng Lão: ${aiDuelResponse}` },
            ...prev,
          ]);
        }
      } catch {
        // Fallback already logged
      }
    }

    if (result.bossRemainingHp === 0) {
      playLevelUp().catch(() => {});
      try {
        confetti({
          particleCount: 220,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#00f0ff', '#8b5cf6', '#ffd700', '#ef4444'],
        });
      } catch {}
    }

    setTimeout(() => {
      setIsStriking(false);
      setArgumentInput('');
    }, 600);
  };

  return (
    <div className={`relative flex flex-col gap-5 ${isStriking ? 'animate-screen-shake' : ''}`}>
      {/* 1. Visual Slash FX Overlay */}
      {isStriking && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_40px_#00f0ff] animate-sword-slash" />
        </div>
      )}

      {/* Floating Damage Number */}
      {lastStrikeResult && isStriking && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center font-mono font-black animate-float-damage">
          <div className="text-4xl text-amber-300 drop-shadow-[0_0_15px_#f59e0b]">
            -{lastStrikeResult.damage} HP
          </div>
          {lastStrikeResult.isCrit && (
            <div className="text-xs text-cyan-300 tracking-widest uppercase">
              ★ BẠO KÍCH MECE TRẢM ★
            </div>
          )}
        </div>
      )}

      {/* 2. Boss Combat Telemetry Card */}
      <div className="bg-[#0b1021]/90 backdrop-blur-md border-2 border-purple-500/50 rounded-xl p-5 shadow-[0_0_30px_rgba(139,92,246,0.2)] relative overflow-hidden">
        {/* Boss Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-950 border border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Skull className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 uppercase">
                  VÕ LÂM MA TRÙM // BOSS GATE
                </span>
                <span className="text-xs font-mono text-slate-500">// {boss.targetTier}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold font-mono text-white">
                {boss.title}
              </h2>
            </div>
          </div>

          <div className="text-xs font-mono text-right">
            <span className="text-slate-400 block text-[10px]">ĐIỀU KIỆN ĐỘT PHÁ</span>
            <span className="text-amber-400 font-bold">VƯỢT {boss.passingScore}/100 ĐIỂM</span>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="mt-4 flex flex-col gap-1.5 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>KHÍ HUYẾT ĐỐI THỦ (BOSS HP)</span>
            </span>
            <span className="text-white font-extrabold">
              {currentHp} / {maxHp} HP ({hpPercent}%)
            </span>
          </div>

          <div className="w-full h-4 bg-slate-950 rounded-full border border-purple-500/40 p-0.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Martial Techniques Selector Bar */}
      <div>
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
          CHỌN CHIÊU THỨC XUẤT KIẾM:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {techniques.map((tech) => (
            <button
              key={tech.name}
              type="button"
              onClick={() => setActiveTechnique(tech.name)}
              className={`p-3 rounded-lg border font-mono text-left transition-all ${
                activeTechnique === tech.name
                  ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_15px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-[#090e1d] hover:border-slate-700 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                <span>{tech.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{tech.desc}</p>
              <span className="text-[9px] font-bold text-amber-400 block mt-1">{tech.bonus}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Attack Input & Execution */}
      <form onSubmit={handleStrike} className="bg-[#0b1021] border border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col gap-3 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-cyan-300 font-bold flex items-center gap-1.5">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>KHẨU QUYẾT PHẢN BIỆN (EXECUTIVE SYNTHESIS & MECE ARGUMENT):</span>
          </span>
          <span>{argumentInput.trim().split(/\s+/).filter(Boolean).length} TỪ</span>
        </div>

        <textarea
          value={argumentInput}
          onChange={(e) => setArgumentInput(e.target.value)}
          placeholder={`Nhập luận điểm hoặc câu trả lời bằng tiếng Anh / MECE để vung kiếm chém Boss:
Ví dụ: "We hypothesize that profit contracted due to a 18% surge in overtime labor cost combined with product mix shifts toward low-margin cold brews. Immediate 30-day action: rollback scheduling software and renegotiate dairy hedging..."`}
          rows={4}
          className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:border-cyan-400 outline-none resize-none leading-relaxed"
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!argumentInput.trim() || isStriking}
            className="flex-1 min-h-[46px] py-3 rounded-lg bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            <Swords className="w-4 h-4 fill-slate-950" />
            <span>XUẤT CHIÊU KIẾM KHÍ CHÉM BOSS</span>
          </button>
        </div>
      </form>

      {/* 5. Live Combat Scroll Log */}
      <div className="bg-[#070b16] border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col gap-2.5 max-h-48 overflow-y-auto">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          DIỄN BIẾN CHIẾN TRƯỜNG // COMBAT SCROLL:
        </span>
        {combatLog.map((log, i) => (
          <div
            key={i}
            className={`p-2.5 rounded text-[11px] leading-relaxed border ${
              log.role === 'player'
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                : 'bg-purple-950/40 border-purple-500/30 text-purple-200'
            }`}
          >
            {log.text}
          </div>
        ))}
      </div>
    </div>
  );
};
