import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ExecutiveHud, calculateLevelMetrics, getTierBadgeConfig } from '../components/layout/ExecutiveHud';
import { NavigationTabs } from '../components/layout/NavigationTabs';
import { App } from '../App';
import type { CharacterState } from '../types';

describe('Sanity & Infrastructure Harness', () => {
  it('verifies Vitest assertion environment and basic arithmetic', () => {
    expect(1 + 1).toBe(2);
    expect(Math.floor(Math.sqrt(100 / 25)) + 1).toBe(3);
  });

  it('verifies Web Audio API mock in jsdom', () => {
    expect(window.AudioContext).toBeDefined();
    const ctx = new window.AudioContext();
    expect(ctx.state).toBe('running');

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    expect(osc.frequency.setValueAtTime).toBeDefined();
    expect(gain.gain.exponentialRampToValueAtTime).toBeDefined();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(0);
    osc.stop(1);

    expect(osc.start).toHaveBeenCalledWith(0);
    expect(osc.stop).toHaveBeenCalledWith(1);
  });

  it('verifies window.matchMedia mock returns valid query list', () => {
    expect(window.matchMedia).toBeDefined();
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    expect(mql.matches).toBe(false);
    expect(typeof mql.addEventListener).toBe('function');
  });

  describe('Level & XP Math Formula Verification', () => {
    it('computes Level 1 at 0 XP with 0% progress', () => {
      const metrics = calculateLevelMetrics(0);
      expect(metrics.level).toBe(1);
      expect(metrics.xpCurrentInLevel).toBe(0);
      expect(metrics.xpNeededForLevel).toBe(25);
      expect(metrics.progressPercent).toBe(0);
    });

    it('computes Level 1 at 10 XP with 40% progress', () => {
      const metrics = calculateLevelMetrics(10);
      expect(metrics.level).toBe(1);
      expect(metrics.xpCurrentInLevel).toBe(10);
      expect(metrics.progressPercent).toBe(40);
    });

    it('computes Level 2 at 25 XP with 0% progress', () => {
      const metrics = calculateLevelMetrics(25);
      expect(metrics.level).toBe(2);
      expect(metrics.xpCurrentInLevel).toBe(0);
      expect(metrics.xpNeededForLevel).toBe(75); // 100 - 25
      expect(metrics.progressPercent).toBe(0);
    });

    it('computes Level 2 at 62 XP with 49% progress', () => {
      const metrics = calculateLevelMetrics(62);
      expect(metrics.level).toBe(2);
      expect(metrics.xpCurrentInLevel).toBe(37);
      expect(metrics.progressPercent).toBe(49);
    });

    it('returns appropriate tier badge configs', () => {
      expect(getTierBadgeConfig('Junior Analyst').label).toBe('JUNIOR ANALYST');
      expect(getTierBadgeConfig('Associate').label).toBe('ASSOCIATE');
      expect(getTierBadgeConfig('VP / Manager').label).toBe('VP / MANAGER');
      expect(getTierBadgeConfig('Partner / MD').label).toBe('PARTNER / MD');
    });
  });

  describe('ExecutiveHud Component', () => {
    const mockCharacter: CharacterState = {
      name: 'Sarah Connor',
      title: 'Senior Associate',
      tier: 'Associate',
      level: 12,
      xp: 3200,
      attributes: {
        strategicMind: 24,
        englishRhetoric: 28,
        financeIQ: 32,
        gritStamina: 30,
      },
      streak: {
        current: 9,
        best: 14,
        lastActiveDate: '2026-11-10',
      },
    };

    it('renders with default props and fallback data without crashing', () => {
      render(React.createElement(ExecutiveHud));
      expect(screen.getByText(/APEX OS v1.0/i)).toBeInTheDocument();
      expect(screen.getByText(/\[JUNIOR ANALYST\]/i)).toBeInTheDocument();
      expect(screen.getByText(/LVL/i)).toBeInTheDocument();
    });

    it('displays custom character data, attributes, and streak', () => {
      render(
        React.createElement(ExecutiveHud, {
          character: mockCharacter,
          soundEnabled: true,
        })
      );

      // Verify rank badge
      expect(screen.getByText(/\[ASSOCIATE\]/i)).toBeInTheDocument();

      // Verify streak counter
      expect(screen.getByText(/9 DAYS/i)).toBeInTheDocument();

      // Verify core attributes
      expect(screen.getByText('STR')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('ENG')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
      expect(screen.getByText('FIN')).toBeInTheDocument();
      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.getByText('STA')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });

    it('triggers sound toggle callback when mute button is clicked', () => {
      const toggleSoundMock = vi.fn();
      render(
        React.createElement(ExecutiveHud, {
          character: mockCharacter,
          soundEnabled: true,
          onToggleSound: toggleSoundMock,
        })
      );

      const muteButton = screen.getByRole('button', { name: /mute sound/i });
      fireEvent.click(muteButton);
      expect(toggleSoundMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('NavigationTabs Component', () => {
    it('renders all 5 Bloomberg navigation tabs', () => {
      const onTabChange = vi.fn();
      render(
        React.createElement(NavigationTabs, {
          activeTab: 'execution',
          onTabChange: onTabChange,
        })
      );

      expect(screen.getByRole('tab', { name: /daily execution/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /lock-in session/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /ai sparring/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /character profile/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /system settings/i })).toBeInTheDocument();
    });

    it('invokes onTabChange with correct tab ID when clicked', () => {
      const onTabChange = vi.fn();
      render(
        React.createElement(NavigationTabs, {
          activeTab: 'execution',
          onTabChange: onTabChange,
        })
      );

      const lockInTab = screen.getByRole('tab', { name: /lock-in session/i });
      fireEvent.click(lockInTab);
      expect(onTabChange).toHaveBeenCalledWith('lockin');
    });
  });

  describe('App Root Shell', () => {
    it('renders top HUD, navigation rail, and default daily execution view', () => {
      render(React.createElement(App));

      // Telemetry HUD present
      expect(screen.getByText(/APEX OS v1.0/i)).toBeInTheDocument();

      // Rule of 3 Banner present
      expect(screen.getByText(/THE RULE OF 3/i)).toBeInTheDocument();
      expect(screen.getByText(/LOW-ENERGY GRACE MODE/i)).toBeInTheDocument();
    });

    it('switches views dynamically when clicking navigation tabs', () => {
      render(React.createElement(App));

      // Switch to Lock-In tab
      const lockInTab = screen.getByRole('tab', { name: /lock-in session/i });
      fireEvent.click(lockInTab);
      expect(screen.getByText(/LOCK-IN DEEP WORK SESSION/i)).toBeInTheDocument();

      // Switch to AI Sparring & Boss Arena tab
      const sparringTab = screen.getByRole('tab', { name: /ai sparring/i });
      fireEvent.click(sparringTab);
      expect(screen.getByText(/AI SPARRING & BOSS BATTLE ARENA/i)).toBeInTheDocument();

      // Switch to Character Profile tab
      const profileTab = screen.getByRole('tab', { name: /character profile/i });
      fireEvent.click(profileTab);
      expect(screen.getByText(/EXECUTIVE DOSSIER/i)).toBeInTheDocument();

      // Switch to Settings tab
      const settingsTab = screen.getByRole('tab', { name: /system settings/i });
      fireEvent.click(settingsTab);
      expect(screen.getByText(/SYSTEM SETTINGS & PERSISTENCE/i)).toBeInTheDocument();
    });

    it('toggles sound on and off when clicking sound icon', () => {
      render(React.createElement(App));
      const soundBtn = screen.getByRole('button', { name: /mute sound/i });
      expect(soundBtn).toBeInTheDocument();

      fireEvent.click(soundBtn);
      expect(screen.getByRole('button', { name: /unmute sound/i })).toBeInTheDocument();
    });
  });
});
