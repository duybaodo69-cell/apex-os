import React from 'react';
import { useApexStore } from './store/useApexStore';
import { ExecutiveHud } from './components/layout/ExecutiveHud';
import { NavigationTabs, type TabId } from './components/layout/NavigationTabs';
import { IdleStageViewport } from './components/stage/IdleStageViewport';
import { DailyExecutionView } from './components/execution/DailyExecutionView';
import { LockInView } from './components/lockin/LockInView';
import { CharacterView } from './components/character/CharacterView';
import { SettingsView } from './components/settings/SettingsView';
import { JobsView } from './components/jobs/JobsView';
import { MBBInterviewView } from './components/interview/MBBInterviewView';
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
  const handleTabChange = (tabId: TabId) => setActiveTab(tabId as NavigationTab);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#040711] font-sans text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img src="/landscapes/root_wuxia_bg.jpg" alt="" aria-hidden="true" className="h-full w-full scale-105 object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/90 via-[#070d1e]/80 to-[#030611]/95 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/15 via-purple-950/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:64px_64px] opacity-10 animate-pulse" />
      </div>
      <div className="relative z-50"><LevelUpModal /></div>
      <div className="relative z-20"><ExecutiveHud character={character} soundEnabled={settings.soundEnabled} onToggleSound={toggleSound} /></div>
      <div className="relative z-10 flex min-h-0 flex-1">
        <NavigationTabs activeTab={activeTab as TabId} onTabChange={handleTabChange} />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 pb-24 sm:p-6 sm:pb-8 lg:p-8">
            <div key={activeTab} className="animate-tab-portal w-full">
              {(activeTab === 'stage' || !activeTab) && <div className="flex flex-col gap-6" data-testid="view-stage"><IdleStageViewport /><DailyExecutionView /></div>}
              {activeTab === 'execution' && <DailyExecutionView />}
              {activeTab === 'lockin' && <LockInView />}
              {activeTab === 'sparring' && <MBBInterviewView />}
              {activeTab === 'jobs' && <JobsView />}
              {activeTab === 'character' && <CharacterView />}
              {activeTab === 'settings' && <SettingsView />}
            </div>
          </main>
          <footer className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 bg-[#080c14] px-4 py-2.5 text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-3"><span className="flex items-center gap-1.5 font-semibold text-emerald-400"><Activity className="h-3.5 w-3.5 animate-pulse" /><span>APEX OS // CAREER MODE</span></span><span className="text-slate-700">•</span><span>HCMC + REMOTE JOB RADAR</span><span className="text-slate-700">•</span><span className="text-emerald-500">MBB INTERVIEW PREP</span></div>
            <div className="flex items-center gap-3"><span className="flex items-center gap-1 text-slate-400"><ShieldCheck className="h-3 w-3 text-emerald-400" /><span>LOCAL-FIRST</span></span><span className="text-slate-700">•</span><span>MODE: ONLINE FEED</span><span className="text-slate-700">•</span><span className="text-slate-400">BUILD: PROD v1.2.0</span></div>
          </footer>
        </div>
      </div>
      <div className="relative z-30"><MobileBottomDock activeTab={activeTab} onTabChange={handleTabChange} activeQuestCount={activeQuestCount} /></div>
    </div>
  );
};

export default App;
