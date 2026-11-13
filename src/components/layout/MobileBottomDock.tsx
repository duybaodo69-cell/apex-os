import React from 'react';
import { BriefcaseBusiness, CheckSquare, Flame, Sliders, Swords, Timer } from 'lucide-react';
import type { NavigationTab } from '../../types';
import { playClick } from '../../utils/audio';

interface MobileBottomDockProps { activeTab: NavigationTab; onTabChange: (tab: NavigationTab) => void; activeQuestCount: number }
export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({ activeTab, onTabChange, activeQuestCount }) => {
  const tabs: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }> = [
    { id: 'stage', label: 'Stage', icon: Flame },
    { id: 'execution', label: 'Quests', icon: CheckSquare, badge: `${activeQuestCount}/3` },
    { id: 'lockin', label: 'Focus', icon: Timer },
    { id: 'sparring', label: 'Interview', icon: Swords },
    { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
    { id: 'character', label: 'Profile', icon: Flame },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];
  const handleSelect = (tab: NavigationTab) => { onTabChange(tab); playClick().catch(() => {}); };
  return <nav aria-label="Mobile bottom navigation" className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-cyan-500/30 bg-[#070c18]/95 px-1 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md sm:hidden" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
    {tabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.id; return <button key={tab.id} type="button" onClick={() => handleSelect(tab.id)} aria-current={isActive ? 'page' : undefined} className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-0.5 py-1 transition ${isActive ? 'font-bold text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>
      {isActive && <span className="absolute -top-1.5 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />}
      <span className="relative"><Icon className={`h-5 w-5 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />{tab.badge && <span className="absolute -right-3.5 -top-1.5 rounded-full border border-cyan-500/50 bg-cyan-950 px-1 text-[8px] font-mono leading-tight text-cyan-300">{tab.badge}</span>}</span>
      <span className="mt-1 max-w-full truncate text-[9px] font-mono tracking-tight">{tab.label}</span>
    </button>; })}
  </nav>;
};
