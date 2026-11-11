import React, { useEffect } from 'react';
import {
  CheckSquare,
  Zap,
  Swords,
  User,
  Sliders,
} from 'lucide-react';
import type { NavigationTab } from '../../types';

export type TabId = NavigationTab;

export interface TabConfig {
  id: TabId;
  label: string;
  subLabel: string;
  hotkey: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAVIGATION_TABS: TabConfig[] = [
  {
    id: 'execution',
    label: 'Daily Execution',
    subLabel: 'RULE OF 3',
    hotkey: '1',
    icon: CheckSquare,
  },
  {
    id: 'lockin',
    label: 'Lock-In Session',
    subLabel: 'DEEP WORK',
    hotkey: '2',
    icon: Zap,
  },
  {
    id: 'sparring',
    label: 'AI Sparring & Boss',
    subLabel: 'MCKINSEY DRILL',
    hotkey: '3',
    icon: Swords,
  },
  {
    id: 'character',
    label: 'Character Profile',
    subLabel: '4 ATTRIBUTES',
    hotkey: '4',
    icon: User,
  },
  {
    id: 'settings',
    label: 'System Settings',
    subLabel: 'DATA VAULT',
    hotkey: '5',
    icon: Sliders,
  },
];

export interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  // Bloomberg Terminal Hotkey listener: keys 1 to 5 switch tabs instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const match = NAVIGATION_TABS.find((tab) => tab.hotkey === e.key);
      if (match) {
        e.preventDefault();
        onTabChange(match.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTabChange]);

  return (
    <nav
      role="tablist"
      aria-label="Bloomberg Terminal Navigation"
      className="w-full bg-[#080d18] border-b border-slate-800/80 px-2 sm:px-4 flex items-center overflow-x-auto scrollbar-none gap-1 sm:gap-2 shadow-inner"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 w-full">
        {NAVIGATION_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 border-b-2 text-xs font-mono transition-all whitespace-nowrap outline-none ${
                isActive
                  ? 'border-amber-400 text-amber-300 bg-amber-400/10 shadow-[inset_0_-2px_0_0_#f59e0b] font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700 font-medium'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-colors ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <span className="tracking-wide uppercase">{tab.label}</span>
              <span
                className={`hidden md:inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border transition-colors ${
                  isActive
                    ? 'bg-amber-950/60 text-amber-400 border-amber-500/40 font-bold'
                    : 'bg-slate-900/80 text-slate-500 border-slate-800'
                }`}
              >
                {tab.subLabel}
              </span>
              <span
                className={`text-[10px] font-mono px-1 py-0.2 rounded border transition-colors ${
                  isActive
                    ? 'border-amber-500/50 text-amber-400 bg-amber-950/40'
                    : 'border-slate-800 text-slate-600 bg-slate-950'
                }`}
              >
                [{tab.hotkey}]
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
