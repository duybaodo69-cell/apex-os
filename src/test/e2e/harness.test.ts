/**
 * APEX: Executive RPG Execution OS
 * Complete Test Harness & Infrastructure Verification Suite
 *
 * File target: src/test/e2e/harness.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import {
  renderApexApp,
  seedLocalStorage,
  readStoredState,
  clearLocalStorage,
  STORAGE_KEY,
  createAnalystCharacter,
  createAssociateCharacter,
  createVpCharacter,
  createPartnerCharacter,
  createCharacterByTier,
  createTestQuest,
  createGraceQuest,
  createActiveQuestSet,
  createTestLockInSession,
  createTestBoss,
  createStoreStateForTier,
  createBackupPackage,
  advanceSeconds,
  advanceMinutes,
  setSimulatedDate,
  advanceDays,
  withFakeTimers,
  flushAllTimers,
  setMockFetchConfig,
  resetMockFetchConfig,
  MOCK_QUESTS,
  MOCK_BOSS_SUBMISSIONS,
  MOCK_AI_CRITIQUES,
  MOCK_VALID_BACKUP_PACKAGE,
  MOCK_CORRUPTED_BACKUP_PACKAGES,
} from '../harness';

describe('APEX OS E2E Test Harness Infrastructure', () => {
  // ==========================================
  // Suite 1: Web Audio API Mock Verification
  // ==========================================
  describe('1. Web Audio API Mock', () => {
    it('provides a functional AudioContext and webkitAudioContext in jsdom', () => {
      expect(window.AudioContext).toBeDefined();
      expect(window.webkitAudioContext).toBeDefined();

      const ctx = new window.AudioContext();
      expect(ctx.state).toBe('running');
      expect(ctx.currentTime).toBe(0);
      expect(ctx.destination).toBeDefined();
    });

    it('creates and connects GainNode and OscillatorNode with audio param scheduling', async () => {
      const ctx = new window.AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      expect(osc).toBeDefined();
      expect(gain).toBeDefined();

      // Audio Param scheduling
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(880, 0);
      expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(440, 0.1);
      expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
      expect(gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.01, 0.2);

      // Node connections
      osc.connect(gain);
      gain.connect(ctx.destination);
      expect(osc.connect).toHaveBeenCalledWith(gain);
      expect(gain.connect).toHaveBeenCalledWith(ctx.destination);

      // Node lifecycle
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
      expect(osc.start).toHaveBeenCalledWith(0);
      expect(osc.stop).toHaveBeenCalledWith(0.3);

      // Context lifecycle
      await ctx.suspend();
      expect(ctx.state).toBe('suspended');
      await ctx.resume();
      expect(ctx.state).toBe('running');
      await ctx.close();
      expect(ctx.state).toBe('closed');
    });
  });

  // ==========================================
  // Suite 2: Timer & Calendar Controller Verification
  // ==========================================
  describe('2. Deterministic Timer & Calendar Controller', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('advances seconds deterministically and flushes React state updates', async () => {
      let triggered = false;
      setTimeout(() => {
        triggered = true;
      }, 5000);

      expect(triggered).toBe(false);
      await advanceSeconds(3);
      expect(triggered).toBe(false);
      await advanceSeconds(2);
      expect(triggered).toBe(true);
    });

    it('advances minutes for Lock-In session timers', async () => {
      let lockInCompleted = false;
      setTimeout(() => {
        lockInCompleted = true;
      }, 25 * 60 * 1000);

      expect(lockInCompleted).toBe(false);
      await advanceMinutes(20);
      expect(lockInCompleted).toBe(false);
      await advanceMinutes(5);
      expect(lockInCompleted).toBe(true);
    });

    it('sets simulated system date and advances calendar days for streak evaluation', async () => {
      setSimulatedDate('2026-11-10T12:00:00.000Z');
      expect(new Date().toISOString()).toBe('2026-11-10T12:00:00.000Z');

      let nextDayActionTriggered = false;
      setTimeout(() => {
        nextDayActionTriggered = true;
      }, 24 * 60 * 60 * 1000);

      await advanceDays(1);
      expect(nextDayActionTriggered).toBe(true);
    });

    it('supports withFakeTimers helper with automatic restoration', async () => {
      vi.useRealTimers(); // ensure real timers initially
      const result = await withFakeTimers(async () => {
        let flag = false;
        setTimeout(() => {
          flag = true;
        }, 1000);
        await advanceSeconds(1);
        return flag;
      });
      expect(result).toBe(true);
    });

    it('flushes all pending timers via flushAllTimers', async () => {
      let count = 0;
      setTimeout(() => { count += 1; }, 100);
      setTimeout(() => { count += 2; }, 500);
      setTimeout(() => { count += 4; }, 10000);

      expect(count).toBe(0);
      await flushAllTimers();
      expect(count).toBe(7);
    });
  });

  // ==========================================
  // Suite 3: Strongly Typed State Factories
  // ==========================================
  describe('3. Strongly Typed State Factories', () => {
    it('creates Junior Analyst character with baseline attributes and Level 1', () => {
      const analyst = createAnalystCharacter();
      expect(analyst.tier).toBe('Junior Analyst');
      expect(analyst.level).toBe(1);
      expect(analyst.xp).toBe(0);
      expect(analyst.attributes.strategicMind).toBe(10);
      expect(analyst.attributes.englishRhetoric).toBe(10);
      expect(analyst.attributes.financeIQ).toBe(10);
      expect(analyst.attributes.gritStamina).toBe(10);
      expect(analyst.streak.current).toBe(1);
    });

    it('creates Associate character with Level 11 and 2,500 XP threshold', () => {
      const associate = createAssociateCharacter();
      expect(associate.tier).toBe('Associate');
      expect(associate.level).toBe(11);
      expect(associate.xp).toBe(2500);
      expect(associate.attributes.strategicMind).toBe(25);
    });

    it('creates VP / Manager character with Level 21 and 10,000 XP threshold', () => {
      const vp = createVpCharacter();
      expect(vp.tier).toBe('VP / Manager');
      expect(vp.level).toBe(21);
      expect(vp.xp).toBe(10000);
      expect(vp.attributes.strategicMind).toBe(50);
    });

    it('creates Partner / MD character with Level 35 and 30,000 XP threshold', () => {
      const partner = createPartnerCharacter();
      expect(partner.tier).toBe('Partner / MD');
      expect(partner.level).toBe(35);
      expect(partner.xp).toBe(30000);
      expect(partner.attributes.strategicMind).toBe(85);
    });

    it('creates character dynamically by tier using createCharacterByTier', () => {
      const tiers = ['Junior Analyst', 'Associate', 'VP / Manager', 'Partner / MD'] as const;
      tiers.forEach((tier) => {
        const char = createCharacterByTier(tier);
        expect(char.tier).toBe(tier);
      });
    });

    it('creates valid standard and grace quests', () => {
      const standardQuest = createTestQuest('q-test-1', { xpReward: 180 });
      expect(standardQuest.id).toBe('q-test-1');
      expect(standardQuest.xpReward).toBe(180);
      expect(standardQuest.category).toBe('FIN');
      expect(standardQuest.status).toBe('pending');
      expect(standardQuest.isGraceQuest).toBeUndefined();

      const graceQuest = createGraceQuest();
      expect(graceQuest.isGraceQuest).toBe(true);
      expect(graceQuest.xpReward).toBe(50);
      expect(graceQuest.attributeReward.attribute).toBe('gritStamina');
      expect(graceQuest.attributeReward.amount).toBe(2);
    });

    it('creates active quest sets enforcing desired capacity', () => {
      const quests1 = createActiveQuestSet(1);
      expect(quests1.length).toBe(1);
      expect(quests1[0].status).toBe('in_progress');

      const quests3 = createActiveQuestSet(3);
      expect(quests3.length).toBe(3);
      expect(quests3.filter((q) => q.status === 'in_progress' || q.status === 'pending').length).toBe(3);
    });

    it('creates valid Lock-In session with MECE tree and notes', () => {
      const session = createTestLockInSession(50);
      expect(session.presetMinutes).toBe(50);
      expect(session.status).toBe('running');
      expect(session.meceTree.children.length).toBe(2);
      expect(session.notes).toContain('Drafting 13-week cash waterfall');
    });

    it('creates valid Boss Battles and full store state for each tier', () => {
      const boss = createTestBoss('boss-1');
      expect(boss.id).toBe('boss-1');
      expect(boss.requiredXp).toBe(2500);
      expect(boss.targetTier).toBe('Associate');

      const vpState = createStoreStateForTier('VP / Manager');
      expect(vpState.character.tier).toBe('VP / Manager');
      // Boss 1 and Boss 2 should be marked passed for VP
      const boss1 = vpState.bossBattles.find((b) => b.id === 'boss-1');
      const boss2 = vpState.bossBattles.find((b) => b.id === 'boss-2');
      const boss3 = vpState.bossBattles.find((b) => b.id === 'boss-3');
      expect(boss1?.passed).toBe(true);
      expect(boss2?.passed).toBe(true);
      expect(boss3?.passed).toBe(false);
    });

    it('creates schema-compliant backup packages', () => {
      const pkg = createBackupPackage();
      expect(pkg.version).toBe('1.0.0');
      expect(pkg.exportTimestamp).toBeDefined();
      expect(pkg.data.character).toBeDefined();
      expect(pkg.data.quests).toBeDefined();
      expect(pkg.data.bossBattles).toBeDefined();
      expect(pkg.data.settings).toBeDefined();
    });
  });

  // ==========================================
  // Suite 4: Storage Isolation & Lifecycle
  // ==========================================
  describe('4. Storage Isolation & Lifecycle Auto-Cleanup', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('seeds and reads LocalStorage state correctly', () => {
      const customState = {
        character: createAssociateCharacter({ name: 'Jordan Belfort' }),
      };
      seedLocalStorage(customState);

      const stored = readStoredState();
      expect(stored).not.toBeNull();
      expect(stored?.character.name).toBe('Jordan Belfort');
      expect(stored?.character.tier).toBe('Associate');
    });

    it('verifies that clearLocalStorage and beforeEach clears state cleanly', () => {
      seedLocalStorage({ character: createAnalystCharacter() });
      expect(readStoredState()).not.toBeNull();

      clearLocalStorage();
      expect(readStoredState()).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  // ==========================================
  // Suite 5: Fullscreen API Mock Verification
  // ==========================================
  describe('5. Fullscreen API Mock', () => {
    it('tracks document.fullscreenElement on requestFullscreen and exitFullscreen', async () => {
      expect(document.fullscreenElement).toBeNull();

      let changeEventFired = 0;
      const listener = () => { changeEventFired += 1; };
      document.addEventListener('fullscreenchange', listener);

      await document.documentElement.requestFullscreen();
      expect(document.fullscreenElement).toBe(document.documentElement);
      expect(changeEventFired).toBe(1);

      await document.exitFullscreen();
      expect(document.fullscreenElement).toBeNull();
      expect(changeEventFired).toBe(2);

      document.removeEventListener('fullscreenchange', listener);
    });
  });

  // ==========================================
  // Suite 6: Canvas 2D & canvas-confetti Mocks
  // ==========================================
  describe('6. Canvas 2D & canvas-confetti Mocks', () => {
    it('provides stub 2D context methods without throwing jsdom errors', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      expect(ctx).not.toBeNull();

      // Test drawing calls that would throw in unmocked jsdom
      expect(() => {
        ctx?.fillRect(0, 0, 100, 100);
        ctx?.clearRect(0, 0, 100, 100);
        ctx?.beginPath();
        ctx?.arc(50, 50, 25, 0, Math.PI * 2);
        ctx?.fill();
        ctx?.stroke();
        ctx?.getImageData(0, 0, 1, 1);
      }).not.toThrow();
    });

    it('mocks canvas-confetti module safely', async () => {
      const confetti = (await import('canvas-confetti')).default;
      expect(confetti).toBeDefined();
      await expect(confetti({ particleCount: 100 })).resolves.toBeNull();
    });
  });

  // ==========================================
  // Suite 7: Blob URL Mock Verification
  // ==========================================
  describe('7. Blob URL Mock (Export Backup)', () => {
    it('generates unique synthetic blob URLs and revokes them safely', () => {
      const blob1 = new Blob(['{"test": 1}'], { type: 'application/json' });
      const blob2 = new Blob(['{"test": 2}'], { type: 'application/json' });

      const url1 = URL.createObjectURL(blob1);
      const url2 = URL.createObjectURL(blob2);

      expect(url1).toContain('blob:apex-test-backup-mock-');
      expect(url2).toContain('blob:apex-test-backup-mock-');
      expect(url1).not.toBe(url2);

      expect(() => {
        URL.revokeObjectURL(url1);
        URL.revokeObjectURL(url2);
      }).not.toThrow();
    });
  });

  // ==========================================
  // Suite 8: Global Fetch Mock & Gemini API Simulation
  // ==========================================
  describe('8. Global Fetch Mock & Google Gemini API Routing', () => {
    beforeEach(() => {
      resetMockFetchConfig();
    });

    afterEach(() => {
      resetMockFetchConfig();
    });

    it('returns structured candidate response when fetching Gemini API endpoint', async () => {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyFakeKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Evaluate my MECE pitch' }] }] }),
      });

      expect(res.ok).toBe(true);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.candidates).toBeDefined();
      expect(json.candidates[0].content.parts[0].text).toBeDefined();

      const parsedCritique = JSON.parse(json.candidates[0].content.parts[0].text);
      expect(parsedCritique.score).toBe(9);
      expect(parsedCritique.verdict).toBe('STRONG_PASS');
      expect(parsedCritique.meceCritique).toContain('issue tree cleanly partitions');
      expect(parsedCritique.englishElevation.length).toBeGreaterThan(0);
      expect(parsedCritique.pressureQuestion).toBeDefined();
    });

    it('simulates offline network failure when mode is set to offline', async () => {
      setMockFetchConfig({ mode: 'offline' });

      await expect(
        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyFakeKey')
      ).rejects.toThrow('Failed to fetch: NetworkError');
    });

    it('simulates HTTP errors (e.g. 401 Unauthorized, 500) when configured', async () => {
      setMockFetchConfig({ mode: 'http_error', errorCode: 401, errorMessage: 'API key not valid' });

      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=INVALID_KEY');
      expect(res.ok).toBe(false);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.error.code).toBe(401);
      expect(json.error.message).toBe('API key not valid');
    });

    it('returns 404 for unmocked external URLs', async () => {
      const res = await fetch('https://unknown-external-domain.com/api');
      expect(res.ok).toBe(false);
      expect(res.status).toBe(404);
    });
  });

  // ==========================================
  // Suite 9: Render Harness & Test Driver Helpers
  // ==========================================
  describe('9. Render Harness & Opaque-Box Test Driver', () => {
    it('mounts the APEX OS test harness shell and reads HUD telemetry', async () => {
      const driver = await renderApexApp({
        initialState: {
          character: createAssociateCharacter({ name: 'Elena Rostova', streak: { current: 14, best: 20, lastActiveDate: '2026-11-10' } }),
        },
      });

      const metrics = driver.getHudMetrics();
      expect(metrics.tier).toBe('Associate');
      expect(metrics.level).toBe(11);
      expect(metrics.xp).toBe(2500);
      expect(metrics.streak).toBe(14);

      expect(screen.getByTestId('executive-hud')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('view-execution')).toBeInTheDocument();
    });

    it('supports tab navigation via driver.navToTab helper', async () => {
      const driver = await renderApexApp();

      // Default is execution
      expect(screen.getByTestId('view-execution')).toBeInTheDocument();

      // Navigate to lockin
      await driver.navToTab('lockin');
      expect(screen.getByTestId('view-lockin')).toBeInTheDocument();

      // Navigate to sparring
      await driver.navToTab('sparring');
      expect(screen.getByTestId('view-sparring')).toBeInTheDocument();

      // Navigate to character
      await driver.navToTab('character');
      expect(screen.getByTestId('view-character')).toBeInTheDocument();

      // Navigate to settings
      await driver.navToTab('settings');
      expect(screen.getByTestId('view-settings')).toBeInTheDocument();
    });

    it('simulates file upload for 1-click backup restoration testing', async () => {
      const driver = await renderApexApp();
      await driver.navToTab('settings');

      const fileInput = screen.getByTestId('backup-file-input') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const backupJson = JSON.stringify(MOCK_VALID_BACKUP_PACKAGE);
      await driver.simulateBackupUpload(backupJson, 'apex-backup-test.json');

      expect(fileInput.files).not.toBeNull();
      expect(fileInput.files?.length).toBe(1);
      expect(fileInput.files?.[0].name).toBe('apex-backup-test.json');
    });

    it('provides access to realistic consulting fixtures', () => {
      expect(MOCK_QUESTS.meceTreeAnalysis.title).toContain('MECE Root Cause Decomposition');
      expect(MOCK_BOSS_SUBMISSIONS.boss1CoffeeChain.passing).toContain('EXECUTIVE SYNTHESIS');
      expect(MOCK_BOSS_SUBMISSIONS.boss1CoffeeChain.failing).toContain('Profit went down');
      expect(MOCK_AI_CRITIQUES.highPass.verdict).toBe('STRONG_PASS');
      expect(MOCK_AI_CRITIQUES.failSuperficial.score).toBe(3);
      expect(MOCK_CORRUPTED_BACKUP_PACKAGES.missingCharacter.data.quests).toBeDefined();
    });
  });
});
