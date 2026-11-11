/**
 * APEX: Executive RPG Execution OS
 * Dynamic Murim Manhwa Landscapes (Vector Panoramas)
 *
 * File target: src/components/visuals/MurimLandscapes.tsx
 */

import React from 'react';

interface LandscapeProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * 1. Bamboo Forest Bounty Landscape (Tab: Quests / Phong Vân Lệnh)
 * Silhouetted bamboo groves at twilight with floating Qi motes & glowing crimson lanterns
 */
export const BambooForestLandscape: React.FC<LandscapeProps> = ({ className = '', children, title, subtitle }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#060e14] min-h-[220px] ${className}`}>
      {/* High-Fidelity Illustrated Digital Painting */}
      <img
        src="/landscapes/bamboo_grove.jpg"
        alt="Bamboo Grove of Execution"
        className="absolute inset-0 w-full h-full object-cover opacity-65 pointer-events-none"
      />
      {/* Background SVG Canvas */}
      <svg
        viewBox="0 0 1200 360"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#081820" />
            <stop offset="60%" stopColor="#0c2b29" />
            <stop offset="100%" stopColor="#051214" />
          </linearGradient>

          <linearGradient id="mistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#060e14" stopOpacity="0.85" />
          </linearGradient>

          <filter id="lanternGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sky Base */}
        <rect width="1200" height="360" fill="url(#twilightSky)" />

        {/* Distant Mountain Ridges */}
        <path d="M0 260 Q300 180 600 240 T1200 200 L1200 360 L0 360 Z" fill="#071b1e" opacity="0.7" />
        <path d="M0 290 Q400 220 800 280 T1200 250 L1200 360 L0 360 Z" fill="#092425" opacity="0.9" />

        {/* Layer 1: Distant Silhouetted Bamboo Stalks */}
        {[80, 160, 240, 340, 480, 560, 680, 780, 890, 990, 1080, 1150].map((x, i) => (
          <g key={`bamboo-bg-${i}`} opacity="0.35">
            <line x1={x} y1="0" x2={x} y2="360" stroke="#04322d" strokeWidth="4" />
            <line x1={x - 2} y1="70" x2={x + 2} y2="70" stroke="#065f46" strokeWidth="2" />
            <line x1={x - 2} y1="140" x2={x + 2} y2="140" stroke="#065f46" strokeWidth="2" />
            <line x1={x - 2} y1="210" x2={x + 2} y2="210" stroke="#065f46" strokeWidth="2" />
            {/* Bamboo Leaves */}
            <path d={`M${x} 60 Q${x + 25} 70 ${x + 40} 60 Q${x + 20} 55 ${x} 60`} fill="#047857" />
            <path d={`M${x} 130 Q${x - 25} 140 ${x - 40} 130 Q${x - 20} 125 ${x} 130`} fill="#047857" />
          </g>
        ))}

        {/* Ambient Mist Layer */}
        <rect y="180" width="1200" height="180" fill="url(#mistGrad)" className="animate-mist" />

        {/* Layer 2: Foreground Bamboo & Torii / Mountain Pavilion Gate */}
        {[40, 190, 310, 520, 710, 850, 1020, 1140].map((x, i) => (
          <g key={`bamboo-fg-${i}`} opacity="0.85">
            <line x1={x} y1="0" x2={x + (i % 2 === 0 ? 8 : -8)} y2="360" stroke="#02211c" strokeWidth="8" />
            <line x1={x - 4} y1="90" x2={x + 4} y2="90" stroke="#047857" strokeWidth="3" />
            <line x1={x - 4} y1="180" x2={x + 4} y2="180" stroke="#047857" strokeWidth="3" />
            <line x1={x - 4} y1="270" x2={x + 4} y2="270" stroke="#047857" strokeWidth="3" />
            {/* Hanging Crimson Sect Lanterns */}
            {i % 3 === 0 && (
              <g filter="url(#lanternGlow)">
                <line x1={x} y1="110" x2={x} y2="130" stroke="#78350f" strokeWidth="1.5" />
                <ellipse cx={x} cy="142" rx="7" ry="10" fill="#ef4444" />
                <ellipse cx={x} cy="142" rx="4" ry="7" fill="#fef08a" />
              </g>
            )}
          </g>
        ))}

        {/* Floating Green Qi Particles */}
        <circle cx="220" cy="180" r="2.5" fill="#34d399" opacity="0.8" className="animate-pulse" />
        <circle cx="580" cy="140" r="3" fill="#34d399" opacity="0.6" className="animate-ping" />
        <circle cx="890" cy="190" r="2" fill="#34d399" opacity="0.7" className="animate-pulse" />
      </svg>

      {/* Content Container */}
      <div className="relative z-10 p-5 sm:p-6">
        {title && (
          <div className="mb-2">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              MURIM LANDSCAPE // VÕ LÂM KỲ CẢNH
            </span>
            <h2 className="text-lg sm:text-xl font-mono font-extrabold text-white mt-1.5 flex items-center gap-2">
              <span>{title}</span>
            </h2>
            {subtitle && <p className="text-xs text-slate-300 font-mono mt-0.5">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * 2. Sacred Meditation Cave Landscape (Tab: Lock-In / Bế Quan Tu Luyện)
 * Cavern arches, stalactites, glowing Taiji / Qi Condensation Vortex, burning incense burner
 */
export const MeditationCaveLandscape: React.FC<LandscapeProps> = ({ className = '', children, title, subtitle }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#040813] min-h-[220px] ${className}`}>
      {/* High-Fidelity Illustrated Digital Painting */}
      <img
        src="/landscapes/meditation_cave.jpg"
        alt="Meditation Cave of Qi"
        className="absolute inset-0 w-full h-full object-cover opacity-65 pointer-events-none"
      />
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-55 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="qiCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#040813" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dark Cavern Background */}
        <rect width="1200" height="400" fill="#040813" />

        {/* Center Qi Condensation Nebula */}
        <circle cx="600" cy="200" r="260" fill="url(#qiCoreGlow)" className="animate-pulse" />

        {/* Stalactites Hanging from Top */}
        <polygon points="40,0 70,0 55,90" fill="#081026" />
        <polygon points="120,0 160,0 140,140" fill="#0b1736" />
        <polygon points="260,0 300,0 280,110" fill="#081026" />
        <polygon points="460,0 490,0 475,80" fill="#0b1736" />
        <polygon points="720,0 760,0 740,95" fill="#081026" />
        <polygon points="910,0 950,0 930,130" fill="#0b1736" />
        <polygon points="1060,0 1100,0 1080,85" fill="#081026" />
        <polygon points="1140,0 1180,0 1160,120" fill="#081026" />

        {/* Cavern Bottom Formations & Meditation Dais */}
        <path d="M0 340 Q300 300 600 320 T1200 330 L1200 400 L0 400 Z" fill="#070e22" />
        <ellipse cx="600" cy="335" rx="140" ry="25" fill="#0b1638" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.4" />

        {/* Burning Incense Burner Silhouette */}
        <g transform="translate(600, 315)">
          <rect x="-10" y="-12" width="20" height="12" fill="#1e293b" rx="2" />
          <line x1="0" y1="-12" x2="0" y2="-28" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="0" cy="-28" r="2" fill="#ef4444" className="animate-ping" />
          {/* Spiraling Smoke */}
          <path d="M0 -28 Q-8 -40 2 -52 T-4 -70 T2 -90" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.4" />
        </g>
      </svg>

      <div className="relative z-10 p-5 sm:p-6">
        {title && (
          <div className="mb-2">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              MURIM LANDSCAPE // VÕ LÂM KỲ CẢNH
            </span>
            <h2 className="text-lg sm:text-xl font-mono font-extrabold text-white mt-1.5 flex items-center gap-2">
              <span>{title}</span>
            </h2>
            {subtitle && <p className="text-xs text-slate-300 font-mono mt-0.5">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * 3. Mount Hua Summit Duel Landscape (Tab: Sparring & Boss Arena / Hoa Sơn Luận Kiếm)
 * Jagged mountain summits, swirling storm clouds, lightning strikes, martial dueling ring
 */
export const MountHuaSummitLandscape: React.FC<LandscapeProps> = ({ className = '', children, title, subtitle }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-purple-500/40 bg-[#070714] min-h-[220px] ${className}`}>
      {/* High-Fidelity Illustrated Digital Painting */}
      <img
        src="/landscapes/mount_hua.jpg"
        alt="Mount Hua Summit Duel"
        className="absolute inset-0 w-full h-full object-cover opacity-65 pointer-events-none"
      />
      <svg
        viewBox="0 0 1200 380"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-65 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stormSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#140d2b" />
            <stop offset="50%" stopColor="#241147" />
            <stop offset="100%" stopColor="#070714" />
          </linearGradient>

          <linearGradient id="lightningGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Storm Sky */}
        <rect width="1200" height="380" fill="url(#stormSky)" />

        {/* Lightning Bolt */}
        <path
          d="M740 0 L710 80 L735 90 L690 180"
          stroke="url(#lightningGlow)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.75"
          className="animate-pulse"
        />

        {/* Distant Sea of Clouds */}
        <ellipse cx="600" cy="220" rx="650" ry="70" fill="#1b1238" opacity="0.6" className="animate-mist" />

        {/* Jagged Mountain Peaks of Mount Hua */}
        <polygon points="120,380 240,110 360,380" fill="#0d081f" />
        <polygon points="300,380 440,70 580,380" fill="#130c2c" />
        <polygon points="760,380 920,90 1080,380" fill="#0f0924" />
        <polygon points="980,380 1090,140 1200,380" fill="#0a0518" />

        {/* Central Dueling Pagoda / Platform Peak */}
        <polygon points="460,380 600,160 740,380" fill="#170f36" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4" />
        {/* Pagoda Eaves Silhouette on Summit */}
        <path d="M575 160 L625 160 L635 152 L600 138 L565 152 Z" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
      </svg>

      <div className="relative z-10 p-5 sm:p-6">
        {title && (
          <div className="mb-2">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              MURIM LANDSCAPE // VÕ LÂM KỲ CẢNH
            </span>
            <h2 className="text-lg sm:text-xl font-mono font-extrabold text-white mt-1.5 flex items-center gap-2">
              <span>{title}</span>
            </h2>
            {subtitle && <p className="text-xs text-slate-300 font-mono mt-0.5">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * 4. Sacred Waterfall & Sword Tomb Landscape (Tab: Character Profile / Kiếm Trủng & Đan Điền)
 * Cascading mystical waterfall, ancient stone stele, mystical swords driven into rock with glowing runes
 */
export const WaterfallSwordTombLandscape: React.FC<LandscapeProps> = ({ className = '', children, title, subtitle }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-amber-500/40 bg-[#080a14] min-h-[220px] ${className}`}>
      {/* High-Fidelity Illustrated Digital Painting */}
      <img
        src="/landscapes/sword_tomb.jpg"
        alt="Waterfall Sword Tomb"
        className="absolute inset-0 w-full h-full object-cover opacity-65 pointer-events-none"
      />
      <svg
        viewBox="0 0 1200 380"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-55 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <rect width="1200" height="380" fill="#080a14" />

        {/* Cliff Wall Silhouette */}
        <path d="M0 0 L400 0 L360 380 L0 380 Z" fill="#0d1124" />
        <path d="M800 0 L1200 0 L1200 380 L840 380 Z" fill="#0d1124" />

        {/* Central Cascading Waterfall */}
        <rect x="560" y="0" width="80" height="340" fill="url(#waterfallGrad)" opacity="0.6" />
        <ellipse cx="600" cy="340" rx="90" ry="25" fill="#38bdf8" opacity="0.4" className="animate-pulse" />

        {/* Ancient Swords Embedded in Rocks (Sword Tomb) */}
        {[
          { x: 280, y: 310, rot: -15, h: 48, c: '#00f0ff' },
          { x: 330, y: 325, rot: 10, h: 54, c: '#fbbf24' },
          { x: 860, y: 315, rot: -8, h: 50, c: '#c084fc' },
          { x: 920, y: 330, rot: 22, h: 44, c: '#34d399' },
        ].map((sword, i) => (
          <g key={`sword-tomb-${i}`} transform={`translate(${sword.x}, ${sword.y}) rotate(${sword.rot})`}>
            {/* Sword Blade */}
            <line x1="0" y1="0" x2="0" y2={-sword.h} stroke="#e2e8f0" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="0" y2={-sword.h} stroke={sword.c} strokeWidth="1.2" opacity="0.8" />
            {/* Crossguard & Hilt */}
            <line x1="-7" y1={-sword.h} x2="7" y2={-sword.h} stroke="#d97706" strokeWidth="2" />
            <line x1="0" y1={-sword.h} x2="0" y2={-sword.h - 12} stroke="#78350f" strokeWidth="2" />
            <circle cx="0" cy={-sword.h - 13} r="2" fill="#fbbf24" />
          </g>
        ))}
      </svg>

      <div className="relative z-10 p-5 sm:p-6">
        {title && (
          <div className="mb-2">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              MURIM LANDSCAPE // VÕ LÂM KỲ CẢNH
            </span>
            <h2 className="text-lg sm:text-xl font-mono font-extrabold text-white mt-1.5 flex items-center gap-2">
              <span>{title}</span>
            </h2>
            {subtitle && <p className="text-xs text-slate-300 font-mono mt-0.5">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
