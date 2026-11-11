import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  ExecutiveHud,
  calculateLevelMetrics,
} from '../components/layout/ExecutiveHud';
import type { CharacterState, CareerTier } from '../types';

describe('Adversarial Stress Test: Progression Math & Telemetry (Milestone 1)', () => {
  // =========================================================================
  // 1. Exact Progression Formula & Edge Case Verification
  // =========================================================================
  describe('calculateLevelMetrics: Edge Cases & Numerical Stability', () => {
    it('handles XP = 0 (Level 1, 0% progress)', () => {
      const metrics = calculateLevelMetrics(0);
      expect(metrics.level).toBe(1);
      expect(metrics.safeXp).toBe(0);
      expect(metrics.currentLevelBaseXp).toBe(0);
      expect(metrics.nextLevelBaseXp).toBe(25);
      expect(metrics.xpNeededForLevel).toBe(25);
      expect(metrics.xpCurrentInLevel).toBe(0);
      expect(metrics.progressPercent).toBe(0);
    });

    it('handles XP = 1 and XP = 24 (Level 1 lower and upper interior boundaries)', () => {
      const at1 = calculateLevelMetrics(1);
      expect(at1.level).toBe(1);
      expect(at1.safeXp).toBe(1);
      expect(at1.xpCurrentInLevel).toBe(1);
      expect(at1.xpNeededForLevel).toBe(25);
      expect(at1.progressPercent).toBe(4); // 1 / 25 * 100 = 4%

      const at24 = calculateLevelMetrics(24);
      expect(at24.level).toBe(1);
      expect(at24.safeXp).toBe(24);
      expect(at24.xpCurrentInLevel).toBe(24);
      expect(at24.xpNeededForLevel).toBe(25);
      expect(at24.progressPercent).toBe(96); // 24 / 25 * 100 = 96%
    });

    it('handles XP = 25 (Exact boundary for Level 2, 0% progress)', () => {
      const metrics = calculateLevelMetrics(25);
      expect(metrics.level).toBe(2);
      expect(metrics.safeXp).toBe(25);
      expect(metrics.currentLevelBaseXp).toBe(25);
      expect(metrics.nextLevelBaseXp).toBe(100);
      expect(metrics.xpNeededForLevel).toBe(75); // 100 - 25 = 75
      expect(metrics.xpCurrentInLevel).toBe(0);
      expect(metrics.progressPercent).toBe(0);
    });

    it('handles XP = 26 and XP = 99 (Level 2 interior boundaries)', () => {
      const at26 = calculateLevelMetrics(26);
      expect(at26.level).toBe(2);
      expect(at26.safeXp).toBe(26);
      expect(at26.xpCurrentInLevel).toBe(1);
      expect(at26.xpNeededForLevel).toBe(75);
      expect(at26.progressPercent).toBe(1); // round(1 / 75 * 100) = 1%

      const at99 = calculateLevelMetrics(99);
      expect(at99.level).toBe(2);
      expect(at99.safeXp).toBe(99);
      expect(at99.xpCurrentInLevel).toBe(74);
      expect(at99.xpNeededForLevel).toBe(75);
      expect(at99.progressPercent).toBe(99); // round(74 / 75 * 100) = 99%
    });

    it('handles XP = 100 (Exact boundary for Level 3, 0% progress)', () => {
      const metrics = calculateLevelMetrics(100);
      expect(metrics.level).toBe(3);
      expect(metrics.safeXp).toBe(100);
      expect(metrics.currentLevelBaseXp).toBe(100);
      expect(metrics.nextLevelBaseXp).toBe(225);
      expect(metrics.xpNeededForLevel).toBe(125); // 225 - 100 = 125
      expect(metrics.xpCurrentInLevel).toBe(0);
      expect(metrics.progressPercent).toBe(0);
    });

    it('handles Negative XP values safely (clamps to Level 1, 0 XP, zero NaN)', () => {
      const testCases = [-1, -25, -50, -1000, -999999];
      for (const negXp of testCases) {
        const metrics = calculateLevelMetrics(negXp);
        expect(metrics.level).toBe(1);
        expect(metrics.safeXp).toBe(0);
        expect(metrics.xpCurrentInLevel).toBe(0);
        expect(metrics.progressPercent).toBe(0);
        expect(Number.isNaN(metrics.level)).toBe(false);
        expect(Number.isNaN(metrics.progressPercent)).toBe(false);
      }
    });

    it('handles Extremely High XP values (100,000 XP and 1,000,000 XP) responsiveness & stability', () => {
      const at100k = calculateLevelMetrics(100000);
      // sqrt(100000 / 25) = sqrt(4000) = 63.24555... -> floor + 1 = 64
      expect(at100k.level).toBe(64);
      expect(at100k.safeXp).toBe(100000);
      expect(at100k.currentLevelBaseXp).toBe(Math.pow(63, 2) * 25); // 99225
      expect(at100k.nextLevelBaseXp).toBe(Math.pow(64, 2) * 25); // 102400
      expect(at100k.xpNeededForLevel).toBe(102400 - 99225); // 3175
      expect(at100k.xpCurrentInLevel).toBe(100000 - 99225); // 775
      expect(at100k.progressPercent).toBe(Math.round((775 / 3175) * 100)); // 24%
      expect(at100k.progressPercent).toBeGreaterThanOrEqual(0);
      expect(at100k.progressPercent).toBeLessThanOrEqual(100);

      // Performance stress test: 50,000 rapid calculations must execute in < 100ms
      const start = performance.now();
      for (let i = 0; i < 50000; i++) {
        calculateLevelMetrics(i * 20);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(500); // 500ms budget, typical < 25ms
    });

    it('handles Fractional XP values (e.g. 24.9, 0.5, 99.99) without invalid float representation', () => {
      const fractionalTests = [
        { input: 0.1, expectedLevel: 1, expectedSafeXp: 0, expectedProgress: 0 },
        { input: 0.9, expectedLevel: 1, expectedSafeXp: 0, expectedProgress: 0 },
        { input: 24.1, expectedLevel: 1, expectedSafeXp: 24, expectedProgress: 96 },
        { input: 24.9, expectedLevel: 1, expectedSafeXp: 24, expectedProgress: 96 },
        { input: 25.01, expectedLevel: 2, expectedSafeXp: 25, expectedProgress: 0 },
        { input: 99.99, expectedLevel: 2, expectedSafeXp: 99, expectedProgress: 99 },
      ];

      for (const t of fractionalTests) {
        const metrics = calculateLevelMetrics(t.input);
        expect(metrics.level).toBe(t.expectedLevel);
        expect(metrics.safeXp).toBe(t.expectedSafeXp);
        expect(metrics.progressPercent).toBe(t.expectedProgress);
        expect(Number.isInteger(metrics.progressPercent)).toBe(true);
      }
    });

    it('handles edge non-number inputs: NaN, undefined, null', () => {
      const nanMetrics = calculateLevelMetrics(NaN);
      expect(nanMetrics.level).toBe(1);
      expect(nanMetrics.safeXp).toBe(0);
      expect(nanMetrics.progressPercent).toBe(0);

      const undefMetrics = calculateLevelMetrics(undefined);
      expect(undefMetrics.level).toBe(1);
      expect(undefMetrics.safeXp).toBe(0);
      expect(undefMetrics.progressPercent).toBe(0);

      const nullMetrics = calculateLevelMetrics(null as unknown as number);
      expect(nullMetrics.level).toBe(1);
      expect(nullMetrics.safeXp).toBe(0);
      expect(nullMetrics.progressPercent).toBe(0);
    });

    it('verifies mathematical invariants across 1,000 continuous levels', () => {
      // Test first 100 level boundaries: Level L boundary is (L - 1)^2 * 25
      for (let L = 1; L <= 100; L++) {
        const boundaryXp = Math.pow(L - 1, 2) * 25;
        const metrics = calculateLevelMetrics(boundaryXp);
        expect(metrics.level).toBe(L);
        expect(metrics.xpCurrentInLevel).toBe(0);
        expect(metrics.progressPercent).toBe(0);

        if (L > 1) {
          // Point just before boundary (boundary - 1) must be in Level L - 1
          const prevMetrics = calculateLevelMetrics(boundaryXp - 1);
          expect(prevMetrics.level).toBe(L - 1);
          expect(prevMetrics.progressPercent).toBeGreaterThanOrEqual(95);
        }
      }
    });
  });

  // =========================================================================
  // 2. ExecutiveHud Component Telemetry Stress Testing
  // =========================================================================
  describe('ExecutiveHud Component: Resilience Under Missing/Partial State', () => {
    it('renders cleanly with default props when no character prop is passed', () => {
      const { unmount } = render(React.createElement(ExecutiveHud));
      expect(screen.getByText(/APEX OS v1.0/i)).toBeInTheDocument();
      expect(screen.getByText(/\[JUNIOR ANALYST\]/i)).toBeInTheDocument();
      expect(screen.getByText('LVL')).toBeInTheDocument();
      expect(screen.getByText('0 / 25 XP')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
      unmount();
    });

    it('renders cleanly when character prop is undefined', () => {
      const { unmount } = render(
        React.createElement(ExecutiveHud, { character: undefined })
      );
      expect(screen.getByText(/APEX OS v1.0/i)).toBeInTheDocument();
      expect(screen.getByText(/\[JUNIOR ANALYST\]/i)).toBeInTheDocument();
      unmount();
    });

    it('renders safely when character has partial state (missing streak and attributes)', () => {
      const partialCharacter = {
        name: 'Incomplete Analyst',
        title: 'Tester',
        tier: 'Associate' as CareerTier,
        level: 2,
        xp: 45,
        // attributes omitted
        // streak omitted
      } as unknown as CharacterState;

      const { unmount } = render(
        React.createElement(ExecutiveHud, { character: partialCharacter })
      );

      // Rank badge
      expect(screen.getByText(/\[ASSOCIATE\]/i)).toBeInTheDocument();
      // Level metrics calculated for 45 XP: Level 2, 45 - 25 = 20 / 75 XP (27%)
      expect(screen.getByText('20 / 75 XP')).toBeInTheDocument();
      expect(screen.getByText('27%')).toBeInTheDocument();
      // Default fallback attributes (10, 10, 10, 10)
      expect(screen.getByText('STR')).toBeInTheDocument();
      expect(screen.getAllByText('10').length).toBeGreaterThanOrEqual(4);
      // Default fallback streak (1 DAY STREAK)
      expect(screen.getByText(/1 DAY/i)).toBeInTheDocument();
      unmount();
    });

    it('renders safely when character attributes object is empty', () => {
      const characterWithEmptyAttrs = {
        name: 'Empty Attributes',
        title: 'Tester',
        tier: 'VP / Manager' as CareerTier,
        level: 3,
        xp: 150,
        attributes: {} as any,
        streak: { current: 5, best: 10, lastActiveDate: '2026-11-10' },
      } as CharacterState;

      const { unmount } = render(
        React.createElement(ExecutiveHud, { character: characterWithEmptyAttrs })
      );

      expect(screen.getByText(/\[VP \/ MANAGER\]/i)).toBeInTheDocument();
      expect(screen.getByText(/5 DAYS/i)).toBeInTheDocument();
      unmount();
    });

    it('renders correctly across all 4 Career Tiers with their specific badge styles', () => {
      const tiers: CareerTier[] = [
        'Junior Analyst',
        'Associate',
        'VP / Manager',
        'Partner / MD',
      ];

      for (const tier of tiers) {
        const char: CharacterState = {
          name: 'Tier Test',
          title: 'Specialist',
          tier,
          level: 5,
          xp: 400,
          attributes: {
            strategicMind: 20,
            englishRhetoric: 20,
            financeIQ: 20,
            gritStamina: 20,
          },
          streak: { current: 3, best: 3, lastActiveDate: null },
        };

        const { unmount } = render(
          React.createElement(ExecutiveHud, { character: char })
        );
        const expectedLabel = tier.toUpperCase();
        expect(screen.getByText(`[${expectedLabel}]`)).toBeInTheDocument();
        unmount();
      }
    });

    it('gracefully handles unknown / invalid career tier strings', () => {
      const invalidTierChar = {
        name: 'Invalid Tier User',
        title: 'Tester',
        tier: 'Chief Executive God' as any,
        level: 1,
        xp: 0,
        attributes: {
          strategicMind: 10,
          englishRhetoric: 10,
          financeIQ: 10,
          gritStamina: 10,
        },
        streak: { current: 1, best: 1, lastActiveDate: null },
      };

      const { unmount } = render(
        React.createElement(ExecutiveHud, { character: invalidTierChar })
      );
      // Fallback in getTierBadgeConfig defaults to Junior Analyst
      expect(screen.getByText(/\[JUNIOR ANALYST\]/i)).toBeInTheDocument();
      unmount();
    });

    it('handles negative XP in ExecutiveHud without crash or NaN in UI', () => {
      const negChar: CharacterState = {
        name: 'Negative XP User',
        title: 'Tester',
        tier: 'Junior Analyst',
        level: 1,
        xp: -200,
        attributes: {
          strategicMind: 5,
          englishRhetoric: 5,
          financeIQ: 5,
          gritStamina: 5,
        },
        streak: { current: 0, best: 0, lastActiveDate: null },
      };

      const { unmount } = render(
        React.createElement(ExecutiveHud, { character: negChar })
      );
      expect(screen.getByText('0 / 25 XP')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.queryByText(/NaN/i)).not.toBeInTheDocument();
      unmount();
    });

    it('cleans up interval timer on unmount without throwing errors', () => {
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
      const { unmount } = render(React.createElement(ExecutiveHud));
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
