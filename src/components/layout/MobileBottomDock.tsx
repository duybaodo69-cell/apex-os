/**
 * APEX: Executive RPG Execution OS
 * Mobile-First Bottom Navigation Dock
 *
 * File target: src/components/layout/MobileBottomDock.tsx
 */

import React from 'react';
import {
  CheckSquare,
  Timer,
  Swords,
  User,
  Sliders,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { playClick } from '../../utils/audio';

interface MobileBottomDockProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  activeQuestCount: number;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  activeTab,
  onTabChange,
  activeQuestCount,
}) => {
  const tabs: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }> = [
    { id: 'execution', label: 'Quests', icon: CheckSquare, badge: `${activeQuestCount}/3` },
    { id: 'lockin', label: 'Lock-In', icon: Timer },
    { id: 'sparring', label: 'Arena', icon: Swords },
    { id: 'character', label: 'Profile', icon: User },
    { id: 'settings', label: 'Vault', icon: Sliders },
  ];

  const handleSelect = (tab: NavigationTab) => {
    onTabChange(tab);
    playClick().catch(() => {});
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation Dock"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#070c18]/90 backdrop-blur-md border-t border-cyan-500/30 px-2 py-1.5 flex items-center justify-around sm:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.8)]"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-lg transition-all relative ${
              isActive
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Indicator Top Glow Line */}
            {isActive && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            )}

            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : ''
                }`}
              />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-3.5 px-1 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-[9px] font-mono font-bold leading-none">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono tracking-tight mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
