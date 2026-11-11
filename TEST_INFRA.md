# APEX OS — Master Test Infrastructure & Methodology Specification

**Project**: APEX: Executive RPG Execution OS  
**Milestone**: Milestone T1 — Test Harness & Infrastructure Setup (E2E Testing Track)  
**Author**: `worker_t1_1` (E2E Testing Track)  
**Last Updated**: 2026-11-11  
**Target Runner**: Vitest 3.0+ | Testing Library React 16.2+ | jsdom 26.0+ | Node.js 24+  
**Target Platform**: Windows 10 PowerShell (`npm.cmd` / `npx.cmd`)  

---

## 1. Overview & Test Philosophy

### 1.1 Mission & Vision
APEX OS is designed as an elite gamified executive execution system bridging the gap between startup finance and top-tier management consulting / private equity (McKinsey, BCG, Bain, Tier-1 PE/IB). The core mission demands zero cognitive friction, absolute mathematical rigor in leveling calculations, uncompromised Rule of 3 cognitive protection, and reliable local-first persistence.

To uphold this mission, the testing architecture operates under the following **core engineering tenets**:

1. **Opaque-Box E2E Testing**:
   Tests interact with APEX OS strictly from the user's vantage point. They locate DOM elements by accessible ARIA roles, test IDs (`data-testid`), and user-facing text; trigger user-event dispatches (`click`, `type`, `upload`); and verify external side effects (`localStorage`, Web Audio API synthesis, network mock requests). Internal implementation details (such as unexported Zustand slice state mechanics) are never directly tested where observable DOM and storage behaviors exist.
2. **Absolute Hermeticity & Determinism**:
   Zero flakiness is tolerated. External network requests to Google Gemini AI endpoints (`generativelanguage.googleapis.com`) are strictly intercepted and routed to deterministic response fixtures or simulated offline fallbacks. Hardware clocks and asynchronous intervals (`setInterval`, `setTimeout`, debounced saves) are driven deterministically via fake timers (`vi.useFakeTimers()`) wrapped inside React's `act()` renderer reconciliation loops.
3. **High-Fidelity Browser Polyfills in Headless jsdom**:
   Browser capabilities missing in jsdom—including Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`), `matchMedia`, Canvas 2D contexts, full-screen view transitions, and `URL.createObjectURL`—are provided by production-grade test mocks in `src/test/setup.ts`.
4. **Isolated Lifecycle Execution**:
   Each test file runs within an isolated worker fork. Storage state (`localStorage`, `sessionStorage`), mock invocations, and full-screen elements are cleared before and after each test case, preventing cross-test state leakage.

---

## 2. 4-Tier Testing Methodology

The APEX OS E2E Testing Suite is structured across four rigorous, non-overlapping testing tiers covering all 31 product features:

```
┌─────────────────────────────────────────────────────────────────┐
│                TIER 4: REAL-WORLD MBB SCENARIOS                 │
│      Full multi-day career journeys (Analyst -> Partner/MD)     │
├─────────────────────────────────────────────────────────────────┤
│               TIER 3: PAIRWISE COMBINATIONS                     │
│    Cross-feature multi-system interactions & race conditions    │
├─────────────────────────────────────────────────────────────────┤
│            TIER 2: BOUNDARY & CORNER CASES (>=5 per feature)    │
│    Limits, capacities, mathematical extremes, corrupted imports │
├─────────────────────────────────────────────────────────────────┤
│             TIER 1: FEATURE COVERAGE (>=5 per feature)          │
│       Positive path validation for every individual feature     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Tier 1: Feature Coverage (Positive Path)
- **Objective**: Verify that every individual feature (F1 through F31) renders, accepts input, and produces expected outputs under nominal operating conditions.
- **Minimum Requirement**: $\ge 5$ discrete positive path tests per feature ($31 \times 5 = 155$ tests minimum).
- **Scope**:
  - Theme styling, HUD metrics rendering, and tab routing.
  - Character creation, attribute display, XP calculation, level-up celebration, and streak increments.
  - Quest CRUD lifecycle management, default MBB templates, and Low-Energy Grace Mode activation.
  - Lock-In timer preset start/stop, MECE tree node additions, and scratchpad note editing.
  - AI Sparring Partner responses, BYOK key entry, offline mock fallback, Boss Battle selection, and rubric display.
  - LocalStorage state debouncing, 1-click JSON export, and valid backup package restore.

### 2.2 Tier 2: Boundary & Corner Cases
- **Objective**: Stress-test extreme edge conditions, input limits, mathematical boundaries, and unexpected failures.
- **Minimum Requirement**: $\ge 5$ discrete boundary/stress tests per feature ($31 \times 5 = 155$ tests minimum).
- **Key Boundary Scenarios**:
  - **Rule of 3 Invariant**: Attempting to add a 4th active quest while 3 quests are already pending/in-progress triggers the Cognitive Overload Shield and blocks creation.
  - **Mathematical Leveling**: Exact threshold XP values ($L = \lfloor\sqrt{\text{XP}/25}\rfloor + 1$ at 0, 24, 25, 99, 100, 2500, 10000, 30000 XP), negative XP clamping to 0, and multi-level lump sum gains.
  - **Streak Edge Transitions**: Same-day idempotency ($\Delta d = 0$ preserves streak without duplicate increments), consecutive day increments ($\Delta d = 1$), and lapsed inactivity ($\Delta d > 1$ resets streak to 1 while preserving all-time best).
  - **Boss Battle Rubric Thresholds**: Borderline scores (e.g. 69 vs 70/75), sub-30-word superficial submissions, and failed attempts allowing unlimited retries without ranking degradation.
  - **Corrupted Storage Recovery**: Restoring corrupt JSON, missing schema keys, negative attributes, or invalid types safely rejects the upload without wiping active user data.

### 2.3 Tier 3: Pairwise Combinations
- **Objective**: Validate the concurrent interaction of two or more independent subsystems.
- **Scenarios**:
  - *Lock-In Deep Work + RPG Progression*: Completing a 90-minute session simultaneously applies the 1.5x XP multiplier, awards Grit & Stamina (+STA), triggers a level-up event, sounds the completion chime, and syncs to LocalStorage.
  - *Grace Mode + Daily Streak + Rule of 3*: Activating 15-minute Grace Mode on an exhausting day with 3 pending quests replaces or prioritizes execution, completes in 15 minutes, marks the date active, increments the streak counter, and awards +50 XP and +2 STA.
  - *Boss Battle Clearance + XP Gate + Career Promotion*: Passing Boss 1 before reaching 2,500 XP marks `passed: true` while gating rank at `Junior Analyst`; once 2,500 XP is achieved, career rank immediately upgrades to `Associate`.
  - *AI Sparring Drill + Network Error + Offline Mock Fallback*: Initiating an AI drill while online simulates a network timeout (or invalid API key), triggering an automated fallback to the local heuristic NLP engine without UI crash.

### 2.4 Tier 4: Real-World MBB Scenarios
- **Objective**: Model the complete multi-week career trajectory of an aspiring finance/consulting professional from Day 1 Onboarding to Partner / Managing Director.
- **Scenarios**:
  1. *Junior Analyst Onboarding to Associate Promotion*: Complete starter quests, build 7-day streak, execute three 25-minute Lock-In sessions, pass Boss Battle 1 ("The Coffee Chain Profit Drop"), and reach 2,500 XP.
  2. *Associate to VP/Manager M&A Challenge*: Complete 50-minute valuation sprints, construct multi-scenario DCF model, submit Project Titan SaaS acquisition thesis to Investment Committee, and cross 10,000 XP threshold.
  3. *Partner/MD Boardroom Turnaround Defense*: Construct 13-week cash liquidity waterfall, manage activist shareholders, defend corporate turnaround pitch, and cross 30,000 XP threshold.
  4. *Exhausted Day Low-Energy Grace Recovery*: High-stress workday with zero bandwidth; user initiates 15-minute Grace Mode, completes micro-reflection, preserves 30-day streak, and exports JSON backup.

---

## 3. Master 31-Feature Inventory Mapping Table

| # | Feature Key | Category | Component / Module | Source Req | Primary Test Suite |
|---|-------------|----------|--------------------|------------|-------------------|
| F1 | Vite 6 + React 19 + TS Scaffolding | Tooling | `package.json`, `vite.config.ts` | R1 / Acceptance | `tier1-features/f01-f05-theme-hud.test.tsx` |
| F2 | Bloomberg Obsidian Dark Theme | Design | `tailwind.config.js`, `index.css` | R1 | `tier1-features/f01-f05-theme-hud.test.tsx` |
| F3 | Executive HUD & Navigation Frame | Navigation | `ExecutiveHud.tsx`, `NavigationTabs.tsx` | R1 | `tier1-features/f01-f05-theme-hud.test.tsx` |
| F4 | Procedural Web Audio Synthesizer | Sound | `src/utils/audio.ts` | R4 | `tier1-features/f01-f05-theme-hud.test.tsx` |
| F5 | Vitest Headless Test Infrastructure | Testing | `src/test/setup.ts`, `harness/*` | R6 / Acceptance | `src/test/e2e/harness.test.ts` |
| F6 | 4 Core RPG Attributes (STR, ENG, FIN, STA) | Progression | `CharacterCard.tsx`, `AttributeBar.tsx` | R2 | `tier1-features/f06-f10-rpg-character.test.tsx` |
| F7 | Career Tier Progression Hierarchy | Progression | `useApexStore.ts`, `progression.ts` | R2 | `tier1-features/f06-f10-rpg-character.test.tsx` |
| F8 | Continuous Leveling Algorithm | Progression | `src/utils/progression.ts` | R2 | `tier1-features/f06-f10-rpg-character.test.tsx` |
| F9 | Level-Up Celebration Modal | Progression | `LevelUpModal.tsx`, `canvas-confetti` | R2 | `tier1-features/f06-f10-rpg-character.test.tsx` |
| F10 | Daily Streak Tracking Engine | Progression | `useApexStore.ts`, `ExecutiveHud.tsx` | R2 | `tier1-features/f06-f10-rpg-character.test.tsx` |
| F11 | The Rule of 3 Hard Invariant | Daily Engine | `RuleOfThreeQuests.tsx`, Store | R3 | `tier1-features/f11-f14-daily-execution.test.tsx` |
| F12 | Quest Lifecycle Management (CRUD) | Daily Engine | `QuestItem.tsx`, `RuleOfThreeQuests.tsx` | R3 | `tier1-features/f11-f14-daily-execution.test.tsx` |
| F13 | Daily Quest Templates (MBB/PE/IB) | Daily Engine | `src/data/defaultQuests.ts` | R3 | `tier1-features/f11-f14-daily-execution.test.tsx` |
| F14 | Low-Energy Grace Mode (15-min) | Daily Engine | `GraceModeCard.tsx` | R3 | `tier1-features/f11-f14-daily-execution.test.tsx` |
| F15 | Fullscreen Focus Immersion | Lock-In | `LockInTimer.tsx` | R4 | `tier1-features/f15-f19-lockin-deepwork.test.tsx` |
| F16 | Focus Countdown Timer Engine | Lock-In | `LockInTimer.tsx` | R4 | `tier1-features/f15-f19-lockin-deepwork.test.tsx` |
| F17 | MECE Issue Tree Scratchpad | Lock-In | `MeceTreeEditor.tsx` | R4 | `tier1-features/f15-f19-lockin-deepwork.test.tsx` |
| F18 | Executive Thought Scratchpad | Lock-In | `ExecutiveScratchpad.tsx` | R4 | `tier1-features/f15-f19-lockin-deepwork.test.tsx` |
| F19 | Lock-In 1.5x XP & Stamina Bonus | Lock-In | `useApexStore.ts`, `LockInTimer.tsx` | R4 | `tier1-features/f15-f19-lockin-deepwork.test.tsx` |
| F20 | McKinsey/BCG Senior Partner Persona | AI Sparring | `AiPartnerDrill.tsx` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F21 | BYOK Google Gemini REST Client | AI Sparring | `src/utils/gemini.ts` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F22 | Heuristic Offline Mock Engine | AI Sparring | `src/utils/mockAi.ts` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F23 | Boss Battle 1: Coffee Chain Profit Drop | Boss Arena | `BossBattleArena.tsx` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F24 | Boss Battle 2: Tech SaaS Acquisition | Boss Arena | `BossBattleArena.tsx` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F25 | Boss Battle 3: Boardroom Turnaround | Boss Arena | `BossBattleArena.tsx` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F26 | 100-Point Boss Rubric Engine | Boss Arena | `BossBattleArena.tsx` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F27 | Dual-Gate Promotion Logic | Progression | `useApexStore.ts`, `progression.ts` | R5 | `tier1-features/f20-f27-ai-sparring-bosses.test.tsx` |
| F28 | LocalStorage Debounced Auto-Sync | Persistence | `useApexStore.ts` | R6 | `tier1-features/f28-f31-persistence-backup.test.tsx` |
| F29 | 1-Click JSON Backup Export | Persistence | `BackupRestore.tsx` | R6 | `tier1-features/f28-f31-persistence-backup.test.tsx` |
| F30 | 1-Click JSON Backup Restore | Persistence | `BackupRestore.tsx` | R6 | `tier1-features/f28-f31-persistence-backup.test.tsx` |
| F31 | Factory Reset & Demo Seed Engine | Persistence | `SettingsModal.tsx`, `BackupRestore.tsx` | R6 | `tier1-features/f28-f31-persistence-backup.test.tsx` |

---

## 4. Directory Layout & Test File Architecture

```
apex-os/
├── TEST_INFRA.md                          # Master Test Infrastructure Guide (this document)
├── package.json                           # Pinned dependencies & tier test scripts
├── vite.config.ts                         # Vitest runner configuration with jsdom environment
├── tsconfig.json                          # TypeScript configuration with @/* path mappings
└── src/
    ├── types/
    │   └── index.ts                       # Strongly typed interface contracts
    └── test/
        ├── setup.ts                       # Global headless jsdom browser mocks & lifecycle hooks
        │
        ├── harness/                       # Shared Test Harness Utilities & Drivers
        │   ├── index.ts                   # Barrel export for all test utilities
        │   ├── renderHarness.tsx          # Opaque-box mounting helper with tab nav & seed helpers
        │   ├── stateFactory.ts            # Strongly typed factories (Analyst, Associate, VP, Partner)
        │   ├── timerController.ts         # Fake timer controller wrapping vi.advanceTimersByTime & act()
        │   ├── mockFetch.ts               # Hermetic Google Gemini API & offline mode simulator
        │   └── mockData.ts                # MBB/Finance test fixtures, submissions, critiques, backups
        │
        └── e2e/                           # 4-Tier E2E Test Suite
            ├── harness.test.ts            # Harness capability & mock infrastructure verification
            │
            ├── tier1-features/            # Tier 1: Feature Coverage (>=5 tests per feature)
            │   ├── f01-f05-theme-hud.test.tsx
            │   ├── f06-f10-rpg-character.test.tsx
            │   ├── f11-f14-daily-execution.test.tsx
            │   ├── f15-f19-lockin-deepwork.test.tsx
            │   ├── f20-f27-ai-sparring-bosses.test.tsx
            │   └── f28-f31-persistence-backup.test.tsx
            │
            ├── tier2-boundaries/          # Tier 2: Boundary & Corner Cases (>=5 tests per feature)
            │   ├── rule-of-three-limits.test.tsx
            │   ├── xp-and-level-boundaries.test.tsx
            │   ├── timer-and-streak-edges.test.tsx
            │   ├── boss-rubric-thresholds.test.tsx
            │   └── corrupted-storage-recovery.test.tsx
            │
            ├── tier3-pairwise/            # Tier 3: Pairwise Combinations
            │   ├── lockin-progression-coupling.test.tsx
            │   ├── grace-mode-streak-rule3.test.tsx
            │   ├── boss-promotion-persistence.test.tsx
            │   └── ai-sparring-lockin-flow.test.tsx
            │
            └── tier4-scenarios/           # Tier 4: Real-World MBB Scenarios
                ├── analyst-to-associate-journey.test.tsx
                ├── associate-to-vp-dcf-challenge.test.tsx
                ├── partner-turnaround-defense.test.tsx
                └── exhausted-day-grace-recovery.test.tsx
```

---

## 5. Test Harness Capabilities & Usage Guide

### 5.1 Opaque-Box Application Rendering (`renderApexApp`)
```typescript
import { renderApexApp, createAssociateCharacter } from '@/test/harness';

it('renders Associate character telemetry and navigates tabs', async () => {
  const driver = await renderApexApp({
    initialState: {
      character: createAssociateCharacter({ name: 'Elena Rostova' }),
    },
  });

  // Verify HUD telemetry
  const metrics = driver.getHudMetrics();
  expect(metrics.tier).toBe('Associate');
  expect(metrics.level).toBe(11);

  // Navigate tabs via user click events
  await driver.navToTab('lockin');
  expect(driver.result.getByTestId('view-lockin')).toBeInTheDocument();
});
```

### 5.2 Deterministic Timer & Date Manipulation
```typescript
import { advanceSeconds, advanceMinutes, setSimulatedDate, advanceDays } from '@/test/harness';

it('completes 25-minute Lock-In session without clock drift', async () => {
  setSimulatedDate('2026-11-12T09:00:00.000Z');
  // Advance 25 minutes inside React act()
  await advanceMinutes(25);
  // Verify completion event and sound trigger
});
```

### 5.3 Hermetic AI Fetch Interception & Offline Simulation
```typescript
import { setMockFetchConfig, resetMockFetchConfig } from '@/test/harness';

it('falls back to offline heuristic mock engine when Gemini API is unavailable', async () => {
  // Simulate complete network disconnection
  setMockFetchConfig({ mode: 'offline' });

  // Or simulate HTTP 401 Unauthorized
  // setMockFetchConfig({ mode: 'http_error', errorCode: 401 });

  // Execute drill; verify fallback response generates successfully
  resetMockFetchConfig();
});
```

### 5.4 State Factories & Backup Package Generation
```typescript
import { createStoreStateForTier, createBackupPackage } from '@/test/harness';

it('restores valid backup package', async () => {
  const state = createStoreStateForTier('VP / Manager');
  const backupPkg = createBackupPackage(state);
  // Test backup file restoration
});
```

---

## 6. Execution Guide & Windows PowerShell Commands

All test execution commands on Windows 10 PowerShell strictly use `npm.cmd` or `npx.cmd`.

| Command | Purpose |
|---|---|
| `npm.cmd test` | Run entire test suite via Vitest |
| `npm.cmd run test:watch` | Run Vitest in interactive watch mode |
| `npm.cmd run test:e2e` | Run all E2E test suites under `src/test/e2e` |
| `npm.cmd run test:tier1` | Run Tier 1 Feature Coverage tests (`src/test/e2e/tier1-features`) |
| `npm.cmd run test:tier2` | Run Tier 2 Boundary & Corner Case tests (`src/test/e2e/tier2-boundaries`) |
| `npm.cmd run test:tier3` | Run Tier 3 Pairwise Combination tests (`src/test/e2e/tier3-pairwise`) |
| `npm.cmd run test:tier4` | Run Tier 4 Real-World MBB Scenario tests (`src/test/e2e/tier4-scenarios`) |
| `npx.cmd vitest run src/test/e2e/harness.test.ts` | Verify harness infrastructure and browser mocks |

---

## 7. Quality Gates & Coverage Thresholds

| Gate / Milestone | Pass Criteria | Validation Command |
|---|---|---|
| **T1: Harness & Infra** | 100% pass on `harness.test.ts`, all mocks operational, `TEST_INFRA.md` published | `npx.cmd vitest run src/test/e2e/harness.test.ts` |
| **T2: Tier 1 & Tier 2** | $\ge 155$ Tier 1 tests pass, $\ge 155$ Tier 2 tests pass, zero regressions | `npm.cmd run test:tier1 && npm.cmd run test:tier2` |
| **T3: Tier 3 & Tier 4** | 100% pass on pairwise & multi-day career journeys | `npm.cmd run test:tier3 && npm.cmd run test:tier4` |
| **T4: TEST_READY.md** | Complete suite $\ge 334$ tests passing with 0 failures, 0 skipped | `npm.cmd test` |
| **Final / M7** | Tier 5 Adversarial & forensic audit clean bill of health | Full audit suite pass |
