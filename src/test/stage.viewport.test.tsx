import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  IdleStageViewport,
  calculateCombatPower,
  getCultivationRealmTitle,
} from '../components/stage/IdleStageViewport';
import { useApexStore } from '../store/useApexStore';
import type { CharacterState } from '../types';

describe('IdleStageViewport Component & Combat Power Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Combat Power Math Engine', () => {
    it('calculates combat power accurately based on attributes, level, and XP', () => {
      const mockCharacter: CharacterState = {
        name: 'Alex Vance',
        title: 'Junior Analyst',
        tier: 'Junior Analyst',
        level: 1,
        xp: 100,
        attributes: {
          strategicMind: 10,
          englishRhetoric: 10,
          financeIQ: 10,
          gritStamina: 10,
        },
        streak: { current: 1, best: 1, lastActiveDate: null },
      };

      // 10*12 (120) + 10*10 (100) + 10*12 (120) + 10*8 (80) + 1*85 (85) + floor(100/4) (25) = 530
      const power = calculateCombatPower(mockCharacter);
      expect(power).toBe(530);
    });

    it('scales properly with higher level and cultivation attributes', () => {
      const highTierCharacter: CharacterState = {
        name: 'Grandmaster',
        title: 'Managing Director',
        tier: 'Partner / MD',
        level: 25,
        xp: 10000,
        attributes: {
          strategicMind: 50,
          englishRhetoric: 40,
          financeIQ: 60,
          gritStamina: 45,
        },
        streak: { current: 30, best: 30, lastActiveDate: null },
      };

      // 50*12 (600) + 40*10 (400) + 60*12 (720) + 45*8 (360) + 25*85 (2125) + floor(10000/4) (2500) = 6705
      const power = calculateCombatPower(highTierCharacter);
      expect(power).toBe(6705);
    });

    it('returns appropriate cultivation realm titles', () => {
      expect(getCultivationRealmTitle(1, 'Junior Analyst')).toContain('Luyện Khí Kỳ');
      expect(getCultivationRealmTitle(6, 'Junior Analyst')).toContain('Trúc Cơ Kỳ');
      expect(getCultivationRealmTitle(10, 'Associate')).toContain('Kim Đan Kỳ');
      expect(getCultivationRealmTitle(15, 'VP / Manager')).toContain('Nguyên Anh Kỳ');
      expect(getCultivationRealmTitle(25, 'Partner / MD')).toContain('Đại Thừa Cảnh');
    });
  });

  describe('IdleStageViewport UI & Interaction Lifecycle', () => {
    it('renders stage header, combat power, and auto-cultivation badge', () => {
      render(<IdleStageViewport />);

      // Verify stage progression header
      expect(screen.getAllByText(/Ải 1: Phong Vân Trúc Lâm/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/STAGE 1-1/i)[0]).toBeInTheDocument();

      // Verify auto-cultivating Qi badge
      expect(screen.getByText(/Auto-Cultivating Qi \/ Đang Vận Khí Tự Động/i)).toBeInTheDocument();
      expect(screen.getByText(/\+1 Qi \/ 2\.0s/i)).toBeInTheDocument();

      // Verify boss challenge button
      expect(screen.getByRole('button', { name: /KHIÊU CHIẾN BOSS ĐẠI TRƯỞNG LÃO/i })).toBeInTheDocument();

      // Verify Combat Power label
      expect(screen.getByText(/CHIẾN LỰC \/\/ ĐẠO HẠNH/i)).toBeInTheDocument();
    });

    it('transitions to sparring/boss arena tab when boss challenge button is clicked', () => {
      render(<IdleStageViewport />);

      const bossButton = screen.getByRole('button', { name: /KHIÊU CHIẾN BOSS ĐẠI TRƯỞNG LÃO/i });
      fireEvent.click(bossButton);

      const activeTab = useApexStore.getState().activeTab;
      expect(activeTab).toBe('sparring');
    });

    it('triggers clicker sword strike mechanic and awards Qi when stage is clicked', () => {
      render(<IdleStageViewport />);
      const initialXp = useApexStore.getState().character.xp;

      // Find stage click target and fire click event
      const stageText = screen.getByText(/Kiếm Khí Trảm Trúc • Nhấp Chuột Để Trảm Kích/i);
      const stageContainer = stageText.closest('.cursor-crosshair');
      expect(stageContainer).not.toBeNull();

      if (stageContainer) {
        fireEvent.click(stageContainer);
      }

      const nextXp = useApexStore.getState().character.xp;
      // Normal gives +5, crit gives +25
      expect(nextXp).toBeGreaterThanOrEqual(initialXp + 5);
    });

    it('accumulates Qi automatically every 2 seconds via idle cultivation loop', () => {
      render(<IdleStageViewport />);
      const initialXp = useApexStore.getState().character.xp;

      // Advance timers by 4000ms (2 ticks = +2 Qi)
      act(() => {
        vi.advanceTimersByTime(4000);
      });

      const nextXp = useApexStore.getState().character.xp;
      expect(nextXp).toBeGreaterThanOrEqual(initialXp + 2);
    });
  });
});
