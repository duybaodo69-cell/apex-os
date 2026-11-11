# DESIGN.md — Google Stitch UI Design Specification: APEX Solo-Leveling Hunter OS

## 1. Visual Theme & Aesthetic Atmosphere
- **Archetype**: Solo Leveling "System Window" // Cyber-Hunter Executive Terminal.
- **Atmosphere**: Deep Obsidian Abyss (`#05070f`), Electric Hunter Cyan (`#00f0ff`), Shadow Monarch Purple (`#8b5cf6`), Gold Monarch Accent (`#f59e0b`), Bio-Emerald (`#10b981`), Crimson Dungeon Red (`#ef4444`).
- **Surface & Materiality**:
  - `Surface-0` (Canvas): `#05070f`
  - `Surface-1` (System Window Glass): `rgba(13, 19, 36, 0.85)` with `backdrop-filter: blur(16px)`
  - `Surface-2` (Interactive Tile): `rgba(19, 29, 56, 0.9)` with 1px border `rgba(0, 240, 255, 0.2)`
  - `Surface-Accent-Glow`: Box shadows with color stops: `0 0 20px rgba(0, 240, 255, 0.25)` and `0 0 40px rgba(139, 92, 246, 0.15)`

## 2. Typography & Hierarchy
- **Primary Display Font**: Space Mono / JetBrains Mono (Monospace for stats, ranks, timers, and HUD telemetry).
- **Body & Executive Text**: Inter / SF Pro Display (Clean, highly legible for mobile screens).
- **Hierarchy Scale**:
  - System Header / Level: `text-2xl` to `text-3xl`, `font-extrabold`, `tracking-tight`
  - Rank Pill & Crests: `text-xs`, `font-bold`, `tracking-widest`, `uppercase`
  - Body Content: `text-xs` to `text-sm`, `leading-relaxed`, `text-slate-300`
  - Micro Telemetry / Timestamps: `text-[10px]` to `text-[11px]`, `text-slate-500`

## 3. Hunter Progression Tiers & Visual Ranks
| Career Tier | Hunter System Rank | Border & Glow Style | Accent Color |
| :--- | :--- | :--- | :--- |
| **Junior Analyst** | **E-Rank / D-Rank Hunter** | `border-cyan-500/40 shadow-cyan-500/20` | `#00f0ff` (Cyan) |
| **Associate** | **C-Rank / B-Rank Hunter** | `border-blue-500/50 shadow-blue-500/25` | `#3b82f6` (Blue) |
| **VP / Manager** | **A-Rank Elite Hunter** | `border-purple-500/60 shadow-purple-500/30` | `#8b5cf6` (Purple) |
| **Partner / MD** | **S-Rank National Hunter** | `border-amber-500/80 shadow-amber-500/40` | `#f59e0b` (Gold) |

## 4. Mobile-First Layout Tokens (PWA Optimized)
- **Viewport**: 100vh with safe-area insets (`env(safe-area-inset-bottom)`).
- **Bottom Navigation Dock**: Fixed at bottom, height `64px`, glassmorphic with illuminated active icon pills.
- **Touch Target**: Minimum button height `44px` on mobile screens for thumb accessibility.
- **Card Spacing**: Padding `16px` (mobile) to `24px` (desktop), gap `12px` to `16px`.

## 5. Procedural Graphics & Components
1. **HunterAvatar**: Dynamic SVG silhouette with animated rank aura and level halo.
2. **StatRadarCanvas**: Interactive 4-axis diamond/radar canvas displaying STR, ENG, FIN, STA with glowing polygon fill.
3. **RankCrestBadge**: Tiered shield crest with metallic highlights and rank classification.
4. **DungeonGateCard**: Stylized boss gate with threat level and promotion requirements.
