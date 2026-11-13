import React, { useEffect } from 'react';
import { BriefcaseBusiness, CheckSquare, Flame, Sliders, Swords, User, Zap } from 'lucide-react';
import type { NavigationTab } from '../../types';

export type TabId = NavigationTab;
export interface TabConfig { id: TabId; label: string; subLabel: string; hotkey: string; icon: React.ComponentType<{ className?: string }> }

export const NAVIGATION_TABS: TabConfig[] = [
  { id: 'stage', label: 'Stage', subLabel: 'FOCUS', hotkey: '`', icon: Flame },
  { id: 'execution', label: 'Daily Execution', subLabel: 'RULE OF 3', hotkey: '1', icon: CheckSquare },
  { id: 'lockin', label: 'Lock-In', subLabel: '50M FOCUS', hotkey: '2', icon: Zap },
  { id: 'sparring', label: 'MBB Interview', subLabel: 'FIT · CASE · QUANT', hotkey: '3', icon: Swords },
  { id: 'jobs', label: 'Job Search', subLabel: 'HCMC · REMOTE', hotkey: '4', icon: BriefcaseBusiness },
  { id: 'character', label: 'Profile', subLabel: 'DOSSIER', hotkey: '5', icon: User },
  { id: 'settings', label: 'Settings', subLabel: 'DATA VAULT', hotkey: '6', icon: Sliders },
];

export interface NavigationTabsProps { activeTab: TabId; onTabChange: (tab: TabId) => void }
export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.tagName === 'SELECT')) return;
      const match = NAVIGATION_TABS.find((tab) => tab.hotkey === event.key);
      if (match) { event.preventDefault(); onTabChange(match.id); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange]);

  return <aside className="hidden w-60 shrink-0 border-r border-slate-800/80 bg-[#080d18]/95 sm:block">
    <nav role="tablist" aria-label="APEX sections" aria-orientation="vertical" className="sticky top-0 flex max-h-screen flex-col gap-1 overflow-y-auto p-3">
      <div className="mb-3 px-3 pt-2"><div className="font-mono text-sm font-bold tracking-[0.2em] text-cyan-300">APEX OS</div><div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">Career workspace</div></div>
      {NAVIGATION_TABS.map((tab) => { const isActive = activeTab === tab.id; const Icon = tab.icon; return <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => onTabChange(tab.id)} className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-all outline-none ${isActive ? 'border-cyan-500/30 bg-cyan-950/50 text-cyan-100 shadow-[inset_2px_0_0_0_#22d3ee]' : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-slate-100'}`}>
        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
        <span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{tab.label}</span><span className="mt-1 block text-[9px] font-mono tracking-wider text-slate-500">{tab.subLabel}</span></span>
        <span className="rounded border border-slate-800 bg-slate-950/70 px-1.5 py-0.5 text-[9px] font-mono text-slate-600">{tab.hotkey}</span>
      </button>; })}
      <div className="mt-auto border-t border-slate-800/80 px-3 pt-4 text-[10px] font-mono leading-relaxed text-slate-600">HCMC + REMOTE<br />CONSULTING CAREER TRACK</div>
    </nav>
  </aside>;
};
