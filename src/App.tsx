/**
 * APEX: Executive RPG Execution OS
 * Master Root Application Shell
 *
 * File target: src/App.tsx
 */

import React from 'react';
import { useApexStore } from './store/useApexStore';
import { ExecutiveHud } from './components/layout/ExecutiveHud';
import { NavigationTabs, type TabId } from './components/layout/NavigationTabs';
import { DailyExecutionView } from './components/execution/DailyExecutionView';
import { LockInView } from './components/lockin/LockInView';
import { SparringAndBossView } from './components/sparring/SparringAndBossView';
import { CharacterView } from './components/character/CharacterView';
import { SettingsView } from './components/settings/SettingsView';
import { LevelUpModal } from './components/character/LevelUpModal';
import { MobileBottomDock } from './components/layout/MobileBottomDock';
import { Activity, ShieldCheck } from 'lucide-react';
import { NavigationTab } from './types';

export const App: React.FC = () => {
  const activeTab = useApexStore((s) => s.activeTab);
  const setActiveTab = useApexStore((s) => s.setActiveTab);
  const character = useApexStore((s) => s.character);
  const quests = useApexStore((s) => s.quests);
  const settings = useApexStore((s) => s.settings);
  const toggleSound = useApexStore((s) => s.toggleSound);

  const activeQuestCount = quests.filter((q) => q.status === 'pending' || q.status === 'in_progress').length;

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId as NavigationTab);
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Level-Up Celebration Modal */}
      <LevelUpModal />

      {/* 2. Top Executive HUD Telemetry Bar */}
      <ExecutiveHud
        character={character}
        soundEnabled={settings.soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* 3. Bloomberg Navigation Rail (Hidden on small mobile screens in favor of Bottom Dock) */}
      <div className="hidden sm:block">
        <NavigationTabs
          activeTab={activeTab as TabId}
          onTabChange={handleTabChange}
        />
      </div>

      {/* 4. Main Viewport Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 pb-24 sm:pb-8">
        {activeTab === 'execution' && <DailyExecutionView />}
        {activeTab === 'lockin' && <LockInView />}
        {activeTab === 'sparring' && <SparringAndBossView />}
        {activeTab === 'character' && <CharacterView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* 5. Mobile-First Bottom Dock (Phone Screens) */}
      <MobileBottomDock
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeQuestCount={activeQuestCount}
      />

      {/* 6. Bloomberg Terminal System Footer */}
      <footer className="w-full bg-[#080c14] border-t border-slate-800/80 px-4 py-2.5 text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>APEX OS // SYSTEM OPTIMAL</span>
          </span>
          <span className="text-slate-700">•</span>
          <span>LATENCY: 0MS</span>
          <span className="text-slate-700">•</span>
          <span className="text-emerald-500">RULE OF 3: ENFORCED</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>ENCRYPTED LOCAL-FIRST</span>
          </span>
          <span className="text-slate-700">•</span>
          <span>MODE: OFFLINE-READY</span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400">BUILD: PROD v1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
