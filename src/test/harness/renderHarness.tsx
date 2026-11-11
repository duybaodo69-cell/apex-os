/**
 * APEX: Executive RPG Execution OS
 * Opaque-Box Render Harness & Test Driver Helpers
 *
 * File target: src/test/harness/renderHarness.tsx
 */

import React, { useState } from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ApexStoreState,
  NavigationTab,
} from '@/types';
import { createDefaultStoreState } from './stateFactory';

export const STORAGE_KEY = 'APEX_OS_V1_STATE';

// ==========================================
// 1. Storage Isolation & Seeding Utilities
// ==========================================

export function seedLocalStorage(state: Partial<ApexStoreState>): void {
  const mergedState = createDefaultStoreState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
}

export function readStoredState(): ApexStoreState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ApexStoreState;
  } catch {
    return null;
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ==========================================
// 2. Default Test Shell (when App is mounting or standalone testing)
// ==========================================

export interface DefaultApexShellProps {
  initialState?: Partial<ApexStoreState>;
}

export const DefaultApexHarnessShell: React.FC<DefaultApexShellProps> = ({ initialState }) => {
  const initial = createDefaultStoreState(initialState);
  const [activeTab, setActiveTab] = useState<NavigationTab>(initial.activeTab);
  const [character] = useState(initial.character);
  const [soundEnabled, setSoundEnabled] = useState(initial.settings.soundEnabled);

  const tabs: Array<{ id: NavigationTab; label: string }> = [
    { id: 'execution', label: 'Daily Execution' },
    { id: 'lockin', label: 'Lock-In Session' },
    { id: 'sparring', label: 'AI Sparring & Boss Arena' },
    { id: 'character', label: 'Character Profile' },
    { id: 'settings', label: 'System Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans" data-testid="apex-root">
      {/* Top Executive HUD Bar */}
      <header
        className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4"
        data-testid="executive-hud"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">APEX OS // TELEMETRY</span>
          <span
            className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-emerald-950/70 text-emerald-300 border border-emerald-500/50"
            data-testid="hud-tier-badge"
          >
            {character.tier}
          </span>
          <span className="text-xs font-mono text-slate-300" data-testid="hud-level-text">
            LVL {character.level}
          </span>
          <span className="text-xs font-mono text-slate-400" data-testid="hud-xp-text">
            {character.xp} XP
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak indicator */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400" data-testid="hud-streak-badge">
            <span role="img" aria-label="streak flame">🔥</span>
            <span>{character.streak.current} DAY STREAK</span>
          </div>

          {/* Attributes */}
          <div className="flex items-center gap-2 text-xs font-mono" data-testid="hud-attributes-summary">
            <span className="text-emerald-400">STR: {character.attributes.strategicMind}</span>
            <span className="text-blue-400">ENG: {character.attributes.englishRhetoric}</span>
            <span className="text-amber-400">FIN: {character.attributes.financeIQ}</span>
            <span className="text-purple-400">STA: {character.attributes.gritStamina}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            data-testid="hud-sound-toggle"
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="px-2 py-1 text-xs font-mono rounded border border-slate-700 hover:border-slate-500"
          >
            {soundEnabled ? 'SFX: ON' : 'SFX: OFF'}
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <nav className="bg-slate-900/60 border-b border-slate-800 px-4 flex gap-2 overflow-x-auto" data-testid="navigation-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-testid={`nav-tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Viewport Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto" data-testid={`tab-content-${activeTab}`}>
        {activeTab === 'execution' && (
          <div data-testid="view-execution">
            <h2 className="text-lg font-mono font-bold text-emerald-400 mb-4">DAILY EXECUTION // RULE OF 3</h2>
            <div data-testid="active-quests-count">Active Quests: {initial.quests.filter((q) => q.status === 'pending' || q.status === 'in_progress').length} / 3</div>
          </div>
        )}

        {activeTab === 'lockin' && (
          <div data-testid="view-lockin">
            <h2 className="text-lg font-mono font-bold text-blue-400 mb-4">LOCK-IN DEEP WORK IMMERSION</h2>
            <div data-testid="lockin-status">Status: {initial.activeLockIn?.status ?? 'idle'}</div>
          </div>
        )}

        {activeTab === 'sparring' && (
          <div data-testid="view-sparring">
            <h2 className="text-lg font-mono font-bold text-amber-400 mb-4">AI SPARRING & BOSS BATTLE ARENA</h2>
            <div data-testid="boss-list">Available Battles: {initial.bossBattles.length}</div>
          </div>
        )}

        {activeTab === 'character' && (
          <div data-testid="view-character">
            <h2 className="text-lg font-mono font-bold text-purple-400 mb-4">EXECUTIVE PROFILE // ATTRIBUTES</h2>
            <div data-testid="char-name">{character.name}</div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div data-testid="view-settings">
            <h2 className="text-lg font-mono font-bold text-slate-300 mb-4">SYSTEM SETTINGS & DATA</h2>
            <input
              type="file"
              data-testid="backup-file-input"
              aria-label="Upload Backup File"
              className="text-xs font-mono"
            />
          </div>
        )}
      </main>
    </div>
  );
};

// ==========================================
// 3. Harness Test Driver Interface & Render Function
// ==========================================

export interface HarnessOptions {
  initialState?: Partial<ApexStoreState>;
  component?: React.ReactElement;
}

export interface HudMetrics {
  tier: string;
  level: number;
  xp: number;
  streak: number;
}

export interface TestDriver {
  result: RenderResult;
  user: ReturnType<typeof userEvent.setup>;
  navToTab: (tabName: NavigationTab) => Promise<void>;
  readStoredState: () => ApexStoreState | null;
  seedState: (state: Partial<ApexStoreState>) => void;
  getHudMetrics: () => HudMetrics;
  simulateBackupUpload: (fileContent: string, fileName?: string) => Promise<void>;
}

/**
 * Render APEX OS (or a specified component tree) with store and storage isolation.
 */
export async function renderApexApp(options: HarnessOptions = {}): Promise<TestDriver> {
  // 1. Storage reset and optional pre-seed
  localStorage.clear();
  if (options.initialState) {
    seedLocalStorage(options.initialState);
  }

  // 2. Setup userEvent
  const user = userEvent.setup();

  // 3. Mount component or default shell
  const elementToRender = options.component || <DefaultApexHarnessShell initialState={options.initialState} />;
  const result = render(elementToRender);

  // 4. Tab navigation helper
  const navToTab = async (tabName: NavigationTab) => {
    const tabButton =
      result.queryByTestId(`nav-tab-${tabName}`) ||
      result.getByRole('tab', { name: new RegExp(tabName, 'i') });
    await user.click(tabButton);
  };

  // 5. Read stored state helper
  const readState = (): ApexStoreState | null => {
    return readStoredState();
  };

  // 6. Seed state helper
  const seedState = (state: Partial<ApexStoreState>) => {
    seedLocalStorage(state);
  };

  // 7. Extract HUD metrics helper
  const getHudMetrics = (): HudMetrics => {
    const tierText = result.queryByTestId('hud-tier-badge')?.textContent || '';
    const levelText = result.queryByTestId('hud-level-text')?.textContent || '';
    const xpText = result.queryByTestId('hud-xp-text')?.textContent || '';
    const streakText = result.queryByTestId('hud-streak-badge')?.textContent || '';

    const levelMatch = levelText.match(/(\d+)/);
    const xpMatch = xpText.match(/(\d+)/);
    const streakMatch = streakText.match(/(\d+)/);

    return {
      tier: tierText.trim(),
      level: levelMatch ? parseInt(levelMatch[1], 10) : 1,
      xp: xpMatch ? parseInt(xpMatch[1], 10) : 0,
      streak: streakMatch ? parseInt(streakMatch[1], 10) : 0,
    };
  };

  // 8. File upload simulation helper
  const simulateBackupUpload = async (fileContent: string, fileName: string = 'backup.json') => {
    const file = new File([fileContent], fileName, { type: 'application/json' });
    const fileInput = result.getByTestId('backup-file-input') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
  };

  return {
    result,
    user,
    navToTab,
    readStoredState: readState,
    seedState,
    getHudMetrics,
    simulateBackupUpload,
  };
}
