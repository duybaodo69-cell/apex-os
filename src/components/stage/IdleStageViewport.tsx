/**
 * APEX: Executive Murim RPG Execution OS
 * Sword x Staff Inspired Idle Stage Viewport
 *
 * File target: src/components/stage/IdleStageViewport.tsx
 *
 * Features:
 * 1. Upper-middle visual stage with standing combat stance cultivator, animated mist,
 *    Bagua dais, rotating sword aura, and floating Qi motes.
 * 2. Idle auto-cultivation loop: accumulating +1 Qi/XP every 2 seconds with
 *    "Auto-Cultivating Qi / Đang Vận Khí Tự Động" live pulsing badge.
 * 3. Interactive clicker mechanic: Clicking on stage or character executes sword strike,
 *    slashes with sound, and spawns floating damage numbers (+5 Qi / Critical MECE Strike +25 Qi).
 * 4. Stage progression header: "Ải 1: Phong Vân Trúc Lâm (Stage 1-1)" and
 *    prominent "KHIÊU CHIẾN BOSS ĐẠI TRƯỞNG LÃO" button transitioning to Boss Arena.
 * 5. Combat Power (Chiến Lực / Đạo Hạnh) metric dynamically calculated from character attributes.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useApexStore } from '../../store/useApexStore';
import {
  Swords,
  Flame,
  Zap,
  Sparkles,
  ChevronRight,
  Crosshair,
} from 'lucide-react';
import { playClick } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { CharacterState } from '../../types';

// ==========================================
// Helper: Calculate Combat Power (Chiến Lực / Đạo Hạnh)
// ==========================================
export function calculateCombatPower(character: CharacterState): number {
  if (!character) return 1000;
  const { attributes, level, xp } = character;
  const str = (attributes?.strategicMind || 10) * 12;
  const eng = (attributes?.englishRhetoric || 10) * 10;
  const fin = (attributes?.financeIQ || 10) * 12;
  const sta = (attributes?.gritStamina || 10) * 8;
  const lvl = (level || 1) * 85;
  const qi = Math.floor((xp || 0) / 4);
  return str + eng + fin + sta + lvl + qi;
}

// Map level/tier to cultivation realm
export function getCultivationRealmTitle(level: number, tier?: string): string {
  if (tier === 'Partner / MD' || level >= 20) return 'Đại Thừa Cảnh // C-Suite Immortal';
  if (tier === 'VP / Manager' || level >= 15) return 'Nguyên Anh Kỳ // Senior Partner';
  if (tier === 'Associate' || level >= 10) return 'Kim Đan Kỳ // VP General';
  if (level >= 5) return 'Trúc Cơ Kỳ // Associate Senior';
  return 'Luyện Khí Kỳ // Analyst Disciple';
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  isCrit: boolean;
}

interface SwordSlash {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export const IdleStageViewport: React.FC = () => {
  const character = useApexStore((s) => s.character);
  const addXp = useApexStore((s) => s.addXp);
  const setActiveTab = useApexStore((s) => s.setActiveTab);

  // Auto-cultivation stats
  const [sessionCultivatedQi, setSessionCultivatedQi] = useState<number>(0);
  const [tickProgress, setTickProgress] = useState<number>(0);
  const [pulseTick, setPulseTick] = useState<boolean>(false);

  // Clicker visual FX
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [slashes, setSlashes] = useState<SwordSlash[]>([]);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [avatarHit, setAvatarHit] = useState<boolean>(false);
  const [isSlashing, setIsSlashing] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'chibi' | 'manhwa'>('chibi');
  const [totalClicks, setTotalClicks] = useState<number>(0);

  const stageRef = useRef<HTMLDivElement>(null);

  // Combat Power calculation
  const combatPower = useMemo(() => calculateCombatPower(character), [character]);
  const realmTitle = useMemo(
    () => getCultivationRealmTitle(character?.level || 1, character?.tier || 'Junior Analyst'),
    [character?.level, character?.tier]
  );

  // ==========================================
  // 1. Idle Auto-Cultivation Loop (+1 Qi / 2s)
  // ==========================================
  useEffect(() => {
    const INTERVAL_MS = 2000;
    const STEP_MS = 100;

    // Smooth ticker bar
    const progressTimer = setInterval(() => {
      setTickProgress((prev) => {
        const next = prev + (STEP_MS / INTERVAL_MS) * 100;
        return next >= 100 ? 0 : next;
      });
    }, STEP_MS);

    // Main +1 Qi accumulator every 2s
    const cultivationTimer = setInterval(() => {
      addXp(1);
      setSessionCultivatedQi((prev) => prev + 1);
      setPulseTick(true);
      setTimeout(() => setPulseTick(false), 450);
    }, INTERVAL_MS);

    return () => {
      clearInterval(progressTimer);
      clearInterval(cultivationTimer);
    };
  }, [addXp]);

  // ==========================================
  // 2. Interactive Clicker Sword Strike Mechanic
  // ==========================================
  const handleStageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Avoid triggering when clicking buttons directly
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        return;
      }

      const rect = stageRef.current?.getBoundingClientRect();
      const x = rect ? e.clientX - rect.left : e.nativeEvent.offsetX;
      const y = rect ? e.clientY - rect.top : e.nativeEvent.offsetY;

      // Random MECE Critical Strike (22% chance)
      const isCrit = Math.random() < 0.22;
      const qiGained = isCrit ? 25 : 5;
      const strikeText = isCrit ? 'BẠO KÍCH MECE! +25 Qi' : '+5 Qi';

      // Grant Qi / XP
      addXp(qiGained);
      setSessionCultivatedQi((prev) => prev + qiGained);
      setTotalClicks((prev) => prev + 1);

      // Play procedural click sound
      playClick().catch(() => {});

      // Confetti burst for Critical Hit
      if (isCrit) {
        try {
          confetti({
            particleCount: 30,
            spread: 60,
            origin: {
              x: e.clientX / window.innerWidth,
              y: e.clientY / window.innerHeight,
            },
            colors: ['#ffd700', '#f59e0b', '#ef4444', '#00f0ff'],
          });
        } catch {
          // Ignore in environments without canvas-confetti
        }
      }

      // Visual sword slash effect
      const newSlash: SwordSlash = {
        id: Date.now() + Math.random(),
        x,
        y,
        angle: (Math.random() - 0.5) * 60 - 45,
      };
      setSlashes((prev) => [...prev.slice(-6), newSlash]);
      setTimeout(() => {
        setSlashes((prev) => prev.filter((s) => s.id !== newSlash.id));
      }, 450);

      // Floating damage number
      const newFloat: FloatingText = {
        id: Date.now() + Math.random(),
        x,
        y,
        text: strikeText,
        isCrit,
      };
      setFloatingTexts((prev) => [...prev.slice(-8), newFloat]);
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((f) => f.id !== newFloat.id));
      }, 1100);

      // Character attack & hit vibration reaction
      setIsSlashing(true);
      setTimeout(() => setIsSlashing(false), 350);
      setAvatarHit(true);
      setTimeout(() => setAvatarHit(false), 220);

      if (isCrit) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      }
    },
    [addXp]
  );

  // Transition to Boss Battle
  const handleChallengeBoss = useCallback(() => {
    playClick().catch(() => {});
    setActiveTab('sparring');
  }, [setActiveTab]);

  return (
    <div
      className={`w-full flex flex-col gap-4 select-none ${
        isShaking ? 'animate-screen-shake' : ''
      }`}
    >
      {/* ==========================================
          TOP TELEMETRY: COMBAT POWER & AUTO-QI BADGE
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
        {/* 1. Combat Power (Chiến Lực / Đạo Hạnh) Card */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-950/90 border border-amber-500/40 rounded-xl p-3.5 flex items-center justify-between shadow-lg shadow-amber-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-300/40">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <span>CHIẾN LỰC // ĐẠO HẠNH</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight drop-shadow-sm">
                {combatPower.toLocaleString('en-US')}
              </div>
              <div className="text-[11px] font-mono text-amber-300/80 font-medium">
                {realmTitle}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-right text-[10px] font-mono text-slate-400 border-l border-amber-500/20 pl-3">
            <span className="text-amber-400">LVL {character?.level || 1}</span>
            <span>STR: {character?.attributes?.strategicMind || 10}</span>
            <span>STA: {character?.attributes?.gritStamina || 10}</span>
          </div>
        </div>

        {/* 2. Auto-Cultivation Qi Loop Badge */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950/90 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col justify-between shadow-lg shadow-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Auto-Cultivating Qi / Đang Vận Khí Tự Động
              </span>
            </div>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/50 text-emerald-300 font-bold transition-transform ${
                pulseTick ? 'scale-110 text-emerald-200 bg-emerald-900/80' : ''
              }`}
            >
              +1 Qi / 2.0s
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Tích lũy phiên:
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              +{sessionCultivatedQi.toLocaleString('en-US')} Qi
            </span>
          </div>

          {/* 2-Second Cultivation Pulse Progress Bar */}
          <div className="mt-2 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-emerald-500/30">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-100 ease-linear shadow-sm shadow-emerald-400"
              style={{ width: `${tickProgress}%` }}
            />
          </div>
        </div>

        {/* 3. Stage Progression & Boss Challenge Trigger */}
        <div className="bg-gradient-to-r from-red-950/40 via-slate-900/80 to-slate-950/90 border border-red-500/40 rounded-xl p-3.5 flex flex-col justify-between shadow-lg shadow-red-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wide">
                Ải 1: Phong Vân Trúc Lâm
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-300 font-semibold">
              STAGE 1-1
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Tiểu Quái Sơn Môn:</span>
            <span className="text-emerald-400 font-bold">10/10 [ĐÃ DỌN SẠCH]</span>
          </div>

          <button
            onClick={handleChallengeBoss}
            className="mt-2 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 border border-red-400/50 flex items-center justify-center gap-2 transition-all transform active:scale-95 group cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5 text-white animate-bounce group-hover:rotate-12 transition-transform" />
            <span>KHIÊU CHIẾN BOSS ĐẠI TRƯỞNG LÃO</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ==========================================
          UPPER-MIDDLE VISUAL MARTIAL STAGE CANVAS
          ========================================== */}
      <div
        ref={stageRef}
        onClick={handleStageClick}
        className="relative w-full h-[440px] sm:h-[500px] md:h-[540px] rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-[#050b12] shadow-2xl shadow-cyan-950/40 cursor-crosshair group select-none"
        style={{
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.08), inset 0 0 60px rgba(4, 18, 22, 0.8)',
        }}
      >
        {/* Background Digital Painting Layer */}
        <img
          src="/landscapes/bamboo_grove.jpg"
          alt="Phong Vân Trúc Lâm"
          className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040910] via-transparent to-[#040910]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040910]/70 via-transparent to-[#040910]/70 pointer-events-none" />

        {/* Animated Mist SVG Fog */}
        <svg
          viewBox="0 0 1200 400"
          className="absolute inset-x-0 bottom-0 w-full h-48 opacity-40 pointer-events-none animate-mist"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="stageMistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#040910" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M0 240 Q300 180 600 220 T1200 200 L1200 400 L0 400 Z"
            fill="url(#stageMistGrad)"
          />
        </svg>

        {/* Stage Header Overlay */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <Crosshair className="w-4 h-4 text-emerald-400 animate-spin" />
            <div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
                Ải 1: Phong Vân Trúc Lâm (Stage 1-1)
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                Kiếm Khí Trảm Trúc • Nhấp Chuột Để Trảm Kích
              </div>
            </div>
          </div>

          <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono text-cyan-300 font-bold">
              Trảm Kích: {totalClicks}
            </span>
          </div>
        </div>

        {/* Visual Mode Switcher Pill */}
        <div className="absolute top-16 right-4 z-30 flex items-center bg-slate-950/90 backdrop-blur-md rounded-lg p-1 border border-cyan-500/40 font-mono text-[11px] shadow-2xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode('chibi');
            }}
            className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
              displayMode === 'chibi'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🥋 CHIBI CHIẾN ĐẤU</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDisplayMode('manhwa');
            }}
            className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
              displayMode === 'manhwa'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🗡️ MANHWA NGUYÊN BẢN</span>
          </button>
        </div>

        {/* Floating Qi Motes (Shimmering Spiritual Energy Rising) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[
            { left: '15%', delay: '0s', dur: '4.2s', size: 6, color: '#34d399' },
            { left: '25%', delay: '1.2s', dur: '5.1s', size: 8, color: '#00f0ff' },
            { left: '38%', delay: '2.5s', dur: '4.7s', size: 5, color: '#fbbf24' },
            { left: '48%', delay: '0.8s', dur: '3.9s', size: 7, color: '#34d399' },
            { left: '60%', delay: '3.1s', dur: '5.5s', size: 9, color: '#a855f7' },
            { left: '72%', delay: '1.7s', dur: '4.4s', size: 6, color: '#00f0ff' },
            { left: '85%', delay: '2.2s', dur: '4.8s', size: 7, color: '#34d399' },
            { left: '92%', delay: '0.4s', dur: '5.0s', size: 5, color: '#fbbf24' },
          ].map((mote, i) => (
            <div
              key={`mote-${i}`}
              className="absolute rounded-full blur-[1px] animate-pulse"
              style={{
                left: mote.left,
                bottom: '-20px',
                width: mote.size,
                height: mote.size,
                background: mote.color,
                boxShadow: `0 0 10px ${mote.color}`,
                animation: `floatUp ${mote.dur} ease-in infinite`,
                animationDelay: mote.delay,
              }}
            />
          ))}
        </div>

        {/* ==========================================
            CENTER ARENA: DUAL MODE (CHIBI BATTLE VS FULL MANHWA)
            ========================================== */}
        {displayMode === 'chibi' ? (
          /* 1. CHIBI COMBAT ARENA: CULTIVATOR VS TRAINING DUMMY */
          <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none z-15 px-4 sm:px-12">
            <div className="w-full max-w-xl flex items-end justify-between sm:justify-around gap-2 sm:gap-6">
              {/* Left: Chibi Cultivator Swordsman */}
              <div
                className={`relative flex flex-col items-center transition-all ${
                  isSlashing ? 'animate-chibi-slash' : 'animate-chibi-idle'
                }`}
              >
                {/* Character Nameplate */}
                <div className="mb-2 px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300 shadow-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{character?.name || 'Alex Vance'} [LVL {character?.level || 1}]</span>
                </div>

                {/* Aura under Chibi */}
                <div className="absolute bottom-2 w-32 h-10 rounded-[50%] bg-cyan-500/25 blur-md pointer-events-none" />

                {/* Chibi Character Sprite Image */}
                <img
                  src="/assets/chibi_cultivator.jpg"
                  alt="Alex Vance Chibi Swordsman"
                  className="w-36 sm:w-44 md:w-52 h-36 sm:h-44 md:h-52 object-contain rounded-2xl drop-shadow-[0_0_20px_rgba(0,240,255,0.7)]"
                />

                {/* Combat Stance Status Tag */}
                <span className="mt-1 text-[10px] font-mono text-cyan-400/90 uppercase font-bold">
                  {isSlashing ? '⚡ VUNG KIẾM TRẢM!' : '⚔️ THỦ THẾ KIẾM KHÍ'}
                </span>
              </div>

              {/* Center Clash Sword Qi Spark */}
              <div className="flex flex-col items-center justify-center pb-12 opacity-85">
                <div className="w-12 h-12 rounded-full border border-dashed border-amber-400/60 bg-amber-950/40 flex items-center justify-center animate-spin">
                  <Swords className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-[9px] font-mono text-amber-300 font-extrabold mt-1 tracking-wider">
                  CHẠM ĐỂ TRẢM
                </span>
              </div>

              {/* Right: Murim Wooden Training Dummy Target */}
              <div
                className={`relative flex flex-col items-center transition-all ${
                  avatarHit ? 'animate-dummy-wobble' : ''
                }`}
              >
                {/* Target Nameplate */}
                <div className="mb-2 px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-500/50 text-[10px] font-mono font-bold text-red-300 shadow-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>BÙ NHÌN LUYỆN KIẾM</span>
                </div>

                {/* Shadow under dummy */}
                <div className="absolute bottom-2 w-28 h-8 rounded-[50%] bg-red-950/50 blur-md pointer-events-none" />

                {/* Training Dummy Sprite Image */}
                <img
                  src="/assets/training_dummy.jpg"
                  alt="Murim Training Dummy"
                  className="w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 object-contain rounded-2xl drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                />

                {/* Target Status */}
                <span className="mt-1 text-[10px] font-mono text-slate-300 font-bold">
                  {avatarHit ? '💥 BỊ TRÚNG TRẢM!' : '🎯 MỤC TIÊU HUẤN LUYỆN'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* 2. FULL MANHWA ORIGINAL MODE */
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none z-15">
            {/* Ground Martial Dais / Bagua Runes Circle */}
            <div className="relative w-72 sm:w-88 md:w-96 h-28 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-[50%] bg-emerald-500/15 blur-xl animate-pulse"
                style={{ transform: 'rotateX(65deg)' }}
              />
              <svg
                viewBox="0 0 400 140"
                className="w-full h-full opacity-80"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="200"
                  cy="70"
                  rx="180"
                  ry="55"
                  fill="#07131b"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <ellipse
                  cx="200"
                  cy="70"
                  rx="140"
                  ry="42"
                  fill="#0a1a24"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="200"
                  cy="70"
                  rx="90"
                  ry="26"
                  fill="#06222b"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
                <circle cx="200" cy="70" r="16" fill="#00f0ff" opacity="0.3" />
                <circle cx="193" cy="70" r="4" fill="#00f0ff" />
                <circle cx="207" cy="70" r="4" fill="#10b981" />
              </svg>
            </div>

            {/* Standing Combat Stance Martial Cultivator Figure */}
            <div
              className={`absolute bottom-14 flex flex-col items-center transition-transform duration-100 ${
                avatarHit ? 'scale-95 brightness-125' : 'hover:scale-[1.02]'
              }`}
            >
              <div className="absolute -inset-6 rounded-full bg-cyan-500/20 blur-2xl animate-qi-pulse pointer-events-none" />

              <div className="relative flex flex-col items-center">
                {/* Floating Ki Sword at character's side */}
                <div
                  className="absolute -right-8 top-10 w-4 h-36 origin-bottom transform rotate-12 transition-all duration-300 pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.8))',
                    animation: 'floatSword 2.8s ease-in-out infinite',
                  }}
                >
                  <div className="w-2.5 h-28 mx-auto bg-gradient-to-t from-cyan-400 via-sky-200 to-white rounded-t-sm border border-cyan-200 shadow-md" />
                  <div className="w-8 h-2 mx-auto bg-amber-500 rounded-sm shadow-sm" />
                  <div className="w-2 h-7 mx-auto bg-slate-800 border-x border-amber-400" />
                  <div className="w-3.5 h-3.5 mx-auto rounded-full bg-amber-400 shadow-sm" />
                </div>

                {/* Cultivator Body / Portrait Stance Container */}
                <div className="relative w-40 sm:w-48 md:w-56 h-64 sm:h-72 md:h-84 flex flex-col items-center">
                  <img
                    src="/assets/cultivator_idle.png"
                    alt="Murim Cultivator"
                    className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-2xl pointer-events-none"
                  />

                  {/* Character Name & Realm Pill */}
                  <div className="absolute -bottom-4 bg-slate-950/90 border border-amber-500/40 rounded-full px-3 py-0.5 shadow-md flex items-center gap-1.5 backdrop-blur-sm z-20">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-mono font-extrabold text-amber-300">
                      {character?.name || 'Alex Vance'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      [Tầng {character?.level || 1}]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            DYNAMIC CLICK EFFECTS: SLASHES & FLOATING NUMBERS
            ========================================== */}
        {/* Sword Slashes */}
        {slashes.map((slash) => (
          <div
            key={slash.id}
            className="absolute pointer-events-none z-30 animate-sword-slash"
            style={{
              left: slash.x - 70,
              top: slash.y - 12,
              width: '140px',
              height: '24px',
              transform: `rotate(${slash.angle}deg)`,
            }}
          >
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-lg shadow-cyan-400" />
            <div className="w-3/4 h-2 mx-auto bg-gradient-to-r from-transparent via-white to-transparent blur-[1px]" />
          </div>
        ))}

        {/* Floating Numbers (+5 Qi or BẠO KÍCH MECE! +25 Qi) */}
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            className={`absolute pointer-events-none z-40 font-mono font-black animate-float-damage ${
              f.isCrit
                ? 'text-lg sm:text-xl text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]'
                : 'text-sm sm:text-base text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]'
            }`}
            style={{
              left: `${f.x}px`,
              top: `${f.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="flex items-center gap-1">
              {f.isCrit && <Flame className="w-5 h-5 text-red-500 fill-red-500 animate-bounce" />}
              <span>{f.text}</span>
            </div>
          </div>
        ))}

        {/* Stage Bottom Instruction Bar */}
        <div className="absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none z-20">
          <span className="text-[11px] font-mono text-slate-400/90 bg-slate-950/80 px-4 py-1 rounded-full border border-slate-800 backdrop-blur-sm">
            ⚔️ Nhấp vào màn hình để xuất kiếm trảm ma • Tự động vận khí +1 Qi/2s
          </span>
        </div>
      </div>

      {/* ==========================================
          BOTTOM ATTRIBUTE BREAKDOWN & COMBAT POWER METRICS
          ========================================== */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-cyan-400" />
            Chiến Lược (STR):
          </span>
          <span className="text-cyan-300 font-bold">
            +{((character?.attributes?.strategicMind || 10) * 12).toLocaleString()} ĐH
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-blue-400" />
            Hùng Biện (ENG):
          </span>
          <span className="text-blue-300 font-bold">
            +{((character?.attributes?.englishRhetoric || 10) * 10).toLocaleString()} ĐH
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-amber-400" />
            Tài Chính (FIN):
          </span>
          <span className="text-amber-300 font-bold">
            +{((character?.attributes?.financeIQ || 10) * 12).toLocaleString()} ĐH
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-emerald-400" />
            Nghị Lực (STA):
          </span>
          <span className="text-emerald-300 font-bold">
            +{((character?.attributes?.gritStamina || 10) * 8).toLocaleString()} ĐH
          </span>
        </div>
      </div>

      {/* Floating Animations CSS */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-460px) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes floatSword {
          0%, 100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-8px) rotate(15deg);
          }
        }
      `}</style>
    </div>
  );
};

export default IdleStageViewport;
