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

  return <nav role="tablist" aria-label="APEX navigation" className="w-full overflow-x-auto border-b border-slate-800/80 bg-[#080d18] px-2 shadow-inner scrollbar-none sm:px-4"><div className="mx-auto flex w-full max-w-7xl items-center gap-1 sm:gap-2">
    {NAVIGATION_TABS.map((tab) => { const isActive = activeTab === tab.id; const Icon = tab.icon; return <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => onTabChange(tab.id)} className={`group flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-mono transition-all outline-none sm:px-4 sm:py-3 ${isActive ? 'border-cyan-400 bg-cyan-400/10 font-bold text-cyan-200' : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/40 hover:text-slate-200'}`}><Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} /><span className="uppercase tracking-wide">{tab.label}</span><span className={`hidden rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-wider md:inline-block ${isActive ? 'border-cyan-500/40 bg-cyan-950/60 font-bold text-cyan-300' : 'border-slate-800 bg-slate-900/80 text-slate-500'}`}>{tab.subLabel}</span><span className="rounded border border-slate-800 bg-slate-950 px-1 text-[10px] text-slate-500">[{tab.hotkey}]</span></button>; })}
  </div></nav>;
};
