/**
 * APEX: Sword x Staff Idle RPG Overhaul
 * End-to-End Regression & Responsive Architecture Suite
 *
 * File target: src/test/e2e/sword_x_staff.integration.test.tsx
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { App } from '../../App';
import { useApexStore } from '../../store/useApexStore';

describe('Sword x Staff Idle RPG Redesign: E2E & Responsive Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset Zustand store to fresh state
    useApexStore.setState({
      activeTab: 'stage',
      character: {
        name: 'Alex Vance',
        title: 'Senior Partner',
        tier: 'Associate',
        level: 10,
        xp: 2500,
        attributes: {
          strategicMind: 25,
          englishRhetoric: 20,
          financeIQ: 30,
          gritStamina: 22,
        },
        streak: {
          current: 7,
          best: 14,
          lastActiveDate: '2026-11-10',
        },
      },
    });
  });

  it('renders default Idle Stage viewport with Combat Power and auto-cultivation loop', () => {
    render(React.createElement(App));

    // Telemetry & Branding Invariants
    expect(screen.getByText(/APEX OS v1.0/i)).toBeInTheDocument();
    expect(screen.getAllByText(/CHIẾN LỰC/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/Kim Đan Kỳ/i).length).toBeGreaterThanOrEqual(2);

    // Auto-cultivation Qi badge
    expect(screen.getByText(/Auto-Cultivating Qi \/ Đang Vận Khí Tự Động/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 Qi \/ 2\.0s/i)).toBeInTheDocument();

    // Stage progression header
    expect(screen.getByText(/Ải 1: Phong Vân Trúc Lâm \(Stage 1-1\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /KHIÊU CHIẾN BOSS ĐẠI TRƯỞNG LÃO/i })).toBeInTheDocument();

    // Rule of 3 banner also present in default Stage view
    expect(screen.getByText(/THE RULE OF 3/i)).toBeInTheDocument();
  });

  it('transitions from Idle Stage to Boss Arena when clicking KHIÊU CHIẾN BOSS button', () => {
    render(React.createElement(App));

    const challengeBtn = screen.getByRole('button', { name: /KHIÊU CHIẾN BOSS ĐẠI TRƯỞNG LÃO/i });
    expect(challengeBtn).toBeInTheDocument();

    fireEvent.click(challengeBtn);

    // Should switch active tab to sparring / arena
    expect(screen.getByText(/AI SPARRING & BOSS BATTLE ARENA/i)).toBeInTheDocument();
    expect(useApexStore.getState().activeTab).toBe('sparring');
  });

  it('supports 6-tab navigation across both desktop NavigationTabs and mobile dock', () => {
    render(React.createElement(App));

    // Desktop nav buttons
    const stageTab = screen.getByRole('tab', { name: /đấu trường \/ stage/i });
    const questTab = screen.getByRole('tab', { name: /nhiệm vụ \/ daily execution/i });
    const lockInTab = screen.getByRole('tab', { name: /bế quan \/ lock-in session/i });
    const arenaTab = screen.getByRole('tab', { name: /luận kiếm \/ ai sparring arena/i });
    const profileTab = screen.getByRole('tab', { name: /hồ sơ \/ character profile/i });
    const vaultTab = screen.getByRole('tab', { name: /tàng kinh \/ system settings/i });

    expect(stageTab).toBeInTheDocument();
    expect(questTab).toBeInTheDocument();
    expect(lockInTab).toBeInTheDocument();
    expect(arenaTab).toBeInTheDocument();
    expect(profileTab).toBeInTheDocument();
    expect(vaultTab).toBeInTheDocument();

    // Switch to Quests tab
    fireEvent.click(questTab);
    expect(useApexStore.getState().activeTab).toBe('execution');

    // Switch to Lock-In tab
    fireEvent.click(lockInTab);
    expect(screen.getByText(/LOCK-IN DEEP WORK SESSION/i)).toBeInTheDocument();

    // Switch to Profile tab
    fireEvent.click(profileTab);
    expect(screen.getByText(/EXECUTIVE DOSSIER/i)).toBeInTheDocument();

    // Switch to Vault Settings tab
    fireEvent.click(vaultTab);
    expect(screen.getByText(/SYSTEM SETTINGS & PERSISTENCE/i)).toBeInTheDocument();

    // Switch back to Stage tab
    fireEvent.click(stageTab);
    expect(screen.getByTestId('view-stage')).toBeInTheDocument();
  });

  it('validates responsive framing: desktop rail hidden on mobile and mobile bottom dock present with safe-area spacing', () => {
    const { container } = render(React.createElement(App));

    // Desktop navigation rail container has hidden sm:block
    const desktopRailWrapper = container.querySelector('.hidden.sm\\:block');
    expect(desktopRailWrapper).toBeInTheDocument();

    // Mobile dock is present with sm:hidden and bottom padding
    const mobileDock = screen.getByLabelText(/Mobile Bottom Navigation Dock/i);
    expect(mobileDock).toBeInTheDocument();
    expect(mobileDock.className).toContain('sm:hidden');
    expect(mobileDock.className).toContain('fixed');
    expect(mobileDock.className).toContain('bottom-0');

    // Main workspace container has padding-bottom to clear mobile dock
    const mainWorkspace = container.querySelector('main');
    expect(mainWorkspace).toBeInTheDocument();
    expect(mainWorkspace?.className).toContain('pb-24');
    expect(mainWorkspace?.className).toContain('sm:pb-8');
  });
});
