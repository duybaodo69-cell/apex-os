/**
 * APEX: Executive RPG Execution OS
 * Core Zustand Store with LocalStorage Persistence
 *
 * File target: src/store/useApexStore.ts
 */

import { create } from 'zustand';
import {
  ApexStoreState,
  CharacterState,
  Quest,
  LockInSession,
  BossBattle,
  NavigationTab,
  MeceNode,
  SparringMessage,
  ApexBackupPackage,
} from '../types';
import { playClick, playLevelUp, playTimerFinish, playAlert } from '../utils/audio';
import confetti from 'canvas-confetti';

export const STORAGE_KEY = 'APEX_OS_V1_STATE';

// Initial default quests aligned with high-leverage Finance & Consulting practice
export const DEFAULT_INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-str-mece-01',
    title: 'MECE Root Cause Decomposition',
    description: 'Structure a mutually exclusive, collectively exhaustive issue tree to diagnose a 15% revenue decline in European operations.',
    category: 'STR',
    xpReward: 150,
    attributeReward: { attribute: 'strategicMind', amount: 5 },
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'quest-eng-pitch-01',
    title: '3-Minute C-Suite Elevator Pitch',
    description: 'Deliver a concise, top-down Pyramid Principle synthesis to the Operating Committee on corporate restructuring.',
    category: 'ENG',
    xpReward: 120,
    attributeReward: { attribute: 'englishRhetoric', amount: 4 },
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'quest-fin-dcf-01',
    title: 'Dynamic 3-Statement & DCF Model',
    description: 'Construct a multi-scenario discounted cash flow model with terminal growth sensitivity and WACC matrix.',
    category: 'FIN',
    xpReward: 200,
    attributeReward: { attribute: 'financeIQ', amount: 6 },
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_INITIAL_BOSSES: BossBattle[] = [
  {
    id: 'boss-1',
    title: 'The Coffee Chain Profit Drop',
    targetTier: 'Associate',
    requiredXp: 2500,
    brief: 'Diagnose a 25% profit drop across a 500-store nationwide specialty coffee chain and construct a 90-day turnaround plan.',
    scenario: 'A nationwide specialty coffee chain experienced steady top-line revenues but an abrupt 25% drop in operating margins. The Board demands a structured MECE root-cause analysis and an executive presentation.',
    rubric: {
      strategicStructure: 25,
      financialAcuity: 25,
      executiveRhetoric: 25,
      actionability: 25,
    },
    passingScore: 70,
    passed: false,
  },
  {
    id: 'boss-2',
    title: 'Tech SaaS Acquisition Target',
    targetTier: 'VP / Manager',
    requiredXp: 10000,
    brief: 'Evaluate a $50M ARR Enterprise SaaS target, assess unit economics (NRR, CAC Payback), and pitch M&A thesis to the Investment Committee.',
    scenario: 'A private equity portfolio company seeks to acquire a high-growth cloud metrics provider. You must re-underwrite the 3-statement model, assess debt capacity, and present the synergy case.',
    rubric: {
      strategicStructure: 25,
      financialAcuity: 25,
      executiveRhetoric: 25,
      actionability: 25,
    },
    passingScore: 75,
    passed: false,
  },
  {
    id: 'boss-3',
    title: 'Boardroom Turnaround Pitch',
    targetTier: 'Partner / MD',
    requiredXp: 30000,
    brief: 'Design a 100-day emergency cash liquidity triage and lead the turnaround defense before a hostile Board and activist investors.',
    scenario: 'A $1.2B industrial manufacturer is facing a liquidity cliff in 7 weeks. You must structure a 13-week cash flow model, freeze non-essential capex, and negotiate debt covenant relief.',
    rubric: {
      strategicStructure: 25,
      financialAcuity: 25,
      executiveRhetoric: 25,
      actionability: 25,
    },
    passingScore: 80,
    passed: false,
  },
];

export const DEFAULT_API_KEY =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY) ||
  '';

export const DEFAULT_INITIAL_CHARACTER: CharacterState = {
  name: 'Alex Vance',
  title: 'Tam Lưu Kiếm Khách (Tân Nhập Giang Hồ)',
  tier: 'Junior Analyst',
  level: 1,
  xp: 0,
  attributes: {
    strategicMind: 10,
    englishRhetoric: 10,
    financeIQ: 10,
    gritStamina: 10,
  },
  streak: {
    current: 1,
    best: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
};

export const DEFAULT_STATE: ApexStoreState = {
  character: DEFAULT_INITIAL_CHARACTER,
  quests: DEFAULT_INITIAL_QUESTS,
  activeLockIn: null,
  lockInHistory: [],
  bossBattles: DEFAULT_INITIAL_BOSSES,
  settings: {
    geminiApiKey: DEFAULT_API_KEY,
    soundEnabled: true,
  },
  activeTab: 'stage',
};

/**
 * Calculates level from total XP using the formula: Level = floor(sqrt(XP / 25)) + 1
 */
export function calculateLevelFromXp(xp: number): number {
  const safeXp = Math.max(0, Math.floor(xp || 0));
  return Math.floor(Math.sqrt(safeXp / 25)) + 1;
}

export interface MartialStrikeResult {
  damage: number;
  isCrit: boolean;
  bossRemainingHp: number;
  counterChallenge: string;
  techniqueName: string;
}

export interface ApexStoreActions {
  // Navigation
  setActiveTab: (tab: NavigationTab) => void;

  // Character & Progression
  addXp: (amount: number, reason?: string) => void;
  addAttributeScore: (attr: keyof CharacterState['attributes'], amount: number) => void;
  updateStreakOnActivity: () => void;
  dismissLevelUpModal: () => void;

  // Quests & Rule of 3
  createCustomQuest: (quest: Omit<Quest, 'id' | 'status' | 'createdAt'>) => boolean;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
  triggerGraceQuest: () => void;

  // Lock-In Deep Work
  initLockInSession: (presetMinutes: 25 | 50 | 90, linkedQuestId?: string) => void;
  updateLockInElapsed: (elapsedSeconds: number) => void;
  setLockInStatus: (status: LockInSession['status']) => void;
  updateMeceTree: (tree: MeceNode) => void;
  updateLockInNotes: (notes: string) => void;
  finishLockInSession: () => void;
  cancelLockInSession: () => void;

  // AI Sparring & Boss Battles
  chatMessages: SparringMessage[];
  addChatMessage: (msg: Omit<SparringMessage, 'id' | 'timestamp'>) => void;
  evaluateBossSubmission: (bossId: string, submissionText: string) => { passed: boolean; score: number; feedback: string };
  bossHp: Record<string, number>;
  executeMartialStrike: (bossId: string, technique: string, argumentText: string) => MartialStrikeResult;

  // Settings & Storage
  setGeminiApiKey: (key: string) => void;
  toggleSound: () => void;
  exportBackupJson: () => string;
  importBackupJson: (jsonString: string) => { success: boolean; error?: string };
  resetToDefaultState: () => void;

  // Level up trigger state for celebratory modal
  newLevelUpUnlocked: { level: number; oldLevel: number } | null;
}

export type ApexStore = ApexStoreState & ApexStoreActions;

function loadStoredState(): ApexStoreState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      character: { ...DEFAULT_INITIAL_CHARACTER, ...parsed.character },
      quests: Array.isArray(parsed.quests) && parsed.quests.length > 0 ? parsed.quests : DEFAULT_INITIAL_QUESTS,
      activeLockIn: parsed.activeLockIn || null,
      lockInHistory: Array.isArray(parsed.lockInHistory) ? parsed.lockInHistory : [],
      bossBattles: Array.isArray(parsed.bossBattles) && parsed.bossBattles.length > 0 ? parsed.bossBattles : DEFAULT_INITIAL_BOSSES,
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
      activeTab: parsed.activeTab || 'stage',
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function persistState(state: ApexStoreState) {
  if (typeof window === 'undefined') return;
  try {
    const snapshot: ApexStoreState = {
      character: state.character,
      quests: state.quests,
      activeLockIn: state.activeLockIn,
      lockInHistory: state.lockInHistory,
      bossBattles: state.bossBattles,
      settings: state.settings,
      activeTab: state.activeTab,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (err) {
    console.error('Failed to persist APEX state:', err);
  }
}

export const useApexStore = create<ApexStore>((set, get) => {
  const initial = loadStoredState();

  return {
    ...initial,
    newLevelUpUnlocked: null,
    chatMessages: [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `I am your Senior Partner sparring partner. My standard is McKinsey / Goldman Sachs executive caliber. 

I will ruthlessly test your logic for MECE completeness, challenge your assumptions, and elevate your English phrasing to C-suite authority. 

Present your case hypotheses, pitch scripts, or valuation logic below. What are we solving today?`,
        timestamp: new Date().toISOString(),
      },
    ],

    setActiveTab: (tab: NavigationTab) => {
      set({ activeTab: tab });
      playClick().catch(() => {});
      persistState(get());
    },

    addXp: (amount: number) => {
      const { character } = get();
      const oldLevel = character.level;
      const nextXp = Math.max(0, character.xp + amount);
      const nextLevel = calculateLevelFromXp(nextXp);

      let newLevelUp = get().newLevelUpUnlocked;
      if (nextLevel > oldLevel) {
        newLevelUp = { level: nextLevel, oldLevel };
        playLevelUp().catch(() => {});
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
          });
        } catch {
          // ignore in testing
        }
      }

      set({
        character: {
          ...character,
          xp: nextXp,
          level: nextLevel,
        },
        newLevelUpUnlocked: newLevelUp,
      });

      get().updateStreakOnActivity();
      persistState(get());
    },

    addAttributeScore: (attr: keyof CharacterState['attributes'], amount: number) => {
      const { character } = get();
      set({
        character: {
          ...character,
          attributes: {
            ...character.attributes,
            [attr]: Math.max(0, (character.attributes[attr] || 0) + amount),
          },
        },
      });
      persistState(get());
    },

    updateStreakOnActivity: () => {
      const { character } = get();
      const today = new Date().toISOString().split('T')[0];
      const last = character.streak.lastActiveDate;

      if (last === today) {
        // already active today
        return;
      }

      let newCurrent = character.streak.current;
      if (!last) {
        newCurrent = 1;
      } else {
        const lastDate = new Date(last);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          newCurrent += 1;
        } else if (diffDays > 1) {
          // streak broken
          newCurrent = 1;
        }
      }

      const newBest = Math.max(newCurrent, character.streak.best || 1);

      set({
        character: {
          ...character,
          streak: {
            current: newCurrent,
            best: newBest,
            lastActiveDate: today,
          },
        },
      });
      persistState(get());
    },

    dismissLevelUpModal: () => {
      set({ newLevelUpUnlocked: null });
      playClick().catch(() => {});
    },

    createCustomQuest: (questData) => {
      const { quests } = get();
      const activeCount = quests.filter((q) => q.status === 'pending' || q.status === 'in_progress').length;

      // Enforce Rule of 3 Invariant
      if (activeCount >= 3) {
        playAlert().catch(() => {});
        return false;
      }

      const newQuest: Quest = {
        ...questData,
        id: `quest-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      set({ quests: [newQuest, ...quests] });
      playClick().catch(() => {});
      persistState(get());
      return true;
    },

    startQuest: (questId: string) => {
      const { quests } = get();
      set({
        quests: quests.map((q) => (q.id === questId ? { ...q, status: 'in_progress' } : q)),
      });
      playClick().catch(() => {});
      persistState(get());
    },

    completeQuest: (questId: string) => {
      const { quests, addXp, addAttributeScore } = get();
      const quest = quests.find((q) => q.id === questId);
      if (!quest || quest.status === 'completed') return;

      addXp(quest.xpReward, `Completed quest: ${quest.title}`);
      if (quest.attributeReward) {
        addAttributeScore(quest.attributeReward.attribute, quest.attributeReward.amount);
      }

      set({
        quests: quests.map((q) =>
          q.id === questId ? { ...q, status: 'completed', completedAt: new Date().toISOString() } : q
        ),
      });

      playLevelUp().catch(() => {});
      persistState(get());
    },

    abandonQuest: (questId: string) => {
      const { quests } = get();
      set({
        quests: quests.map((q) => (q.id === questId ? { ...q, status: 'abandoned' } : q)),
      });
      playAlert().catch(() => {});
      persistState(get());
    },

    triggerGraceQuest: () => {
      const { quests, addXp, addAttributeScore } = get();
      const existing = quests.find((q) => q.isGraceQuest && q.status !== 'abandoned');
      if (existing) {
        if (existing.status !== 'completed') {
          addXp(existing.xpReward);
          addAttributeScore(existing.attributeReward.attribute, existing.attributeReward.amount);
          set({
            quests: quests.map((q) =>
              q.id === existing.id ? { ...q, status: 'completed', completedAt: new Date().toISOString() } : q
            ),
          });
        }
        return;
      }

      const activeCount = quests.filter((q) => q.status === 'pending' || q.status === 'in_progress').length;
      if (activeCount >= 3) {
        // Find one pending to replace or complete immediately
        const firstPending = quests.find((q) => q.status === 'pending');
        if (firstPending) {
          get().abandonQuest(firstPending.id);
        }
      }

      const graceQuest: Quest = {
        id: `quest-grace-${Date.now()}`,
        title: 'Low-Energy Grace Reflection (15m)',
        description: '15-minute tactical synthesis reviewing key strategic learnings to preserve streak continuity under cognitive exhaustion.',
        category: 'STA',
        xpReward: 50,
        attributeReward: { attribute: 'gritStamina', amount: 2 },
        status: 'completed',
        isGraceQuest: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      addXp(graceQuest.xpReward);
      addAttributeScore(graceQuest.attributeReward.attribute, graceQuest.attributeReward.amount);

      set({ quests: [graceQuest, ...get().quests] });
      playLevelUp().catch(() => {});
      persistState(get());
    },

    initLockInSession: (presetMinutes, linkedQuestId) => {
      const newSession: LockInSession = {
        id: `session-${Date.now()}`,
        presetMinutes,
        elapsedSeconds: 0,
        status: 'running',
        meceTree: {
          id: 'root-1',
          text: 'Core Business Objective',
          children: [
            { id: 'sub-rev', text: '1. Revenue Streams (Price x Volume x Mix)', children: [] },
            { id: 'sub-cost', text: '2. Cost Drivers (Fixed vs Variable COGS)', children: [] },
          ],
        },
        notes: '',
        xpEarned: Math.round(presetMinutes * 4 * 1.5), // 1.5x bonus XP
        questId: linkedQuestId,
        startedAt: new Date().toISOString(),
      };

      set({ activeLockIn: newSession, activeTab: 'lockin' });
      playClick().catch(() => {});
      persistState(get());
    },

    updateLockInElapsed: (elapsedSeconds) => {
      const { activeLockIn } = get();
      if (!activeLockIn) return;
      set({ activeLockIn: { ...activeLockIn, elapsedSeconds } });
    },

    setLockInStatus: (status) => {
      const { activeLockIn } = get();
      if (!activeLockIn) return;
      set({ activeLockIn: { ...activeLockIn, status } });
      persistState(get());
    },

    updateMeceTree: (meceTree) => {
      const { activeLockIn } = get();
      if (!activeLockIn) return;
      set({ activeLockIn: { ...activeLockIn, meceTree } });
      persistState(get());
    },

    updateLockInNotes: (notes) => {
      const { activeLockIn } = get();
      if (!activeLockIn) return;
      set({ activeLockIn: { ...activeLockIn, notes } });
      persistState(get());
    },

    finishLockInSession: () => {
      const { activeLockIn, lockInHistory, addXp, addAttributeScore, completeQuest } = get();
      if (!activeLockIn) return;

      const completedSession: LockInSession = {
        ...activeLockIn,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      // Award 1.5x bonus XP and Stamina points
      addXp(completedSession.xpEarned, 'Deep Work Lock-In Completed');
      addAttributeScore('gritStamina', Math.max(3, Math.round(activeLockIn.presetMinutes / 10)));

      if (activeLockIn.questId) {
        completeQuest(activeLockIn.questId);
      }

      set({
        activeLockIn: null,
        lockInHistory: [completedSession, ...lockInHistory],
      });

      playTimerFinish().catch(() => {});
      persistState(get());
    },

    cancelLockInSession: () => {
      const { activeLockIn } = get();
      if (!activeLockIn) return;
      set({ activeLockIn: null });
      playAlert().catch(() => {});
      persistState(get());
    },

    addChatMessage: (msg) => {
      const newMsg: SparringMessage = {
        ...msg,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      set({ chatMessages: [...get().chatMessages, newMsg] });
    },

    evaluateBossSubmission: (bossId, submissionText) => {
      const { bossBattles, character, addXp, addAttributeScore } = get();
      const boss = bossBattles.find((b) => b.id === bossId);
      if (!boss) return { passed: false, score: 0, feedback: 'Boss not found.' };

      // Heuristic Rubric Evaluator
      const length = submissionText.trim().length;
      const lower = submissionText.toLowerCase();

      let structureScore = 12;
      let financeScore = 12;
      let rhetoricScore = 12;
      let actionScore = 12;

      // Structure check
      if (lower.includes('mece') || lower.includes('driver') || lower.includes('tree') || lower.includes('1.') || lower.includes('root cause')) {
        structureScore += 10;
      }
      // Finance check
      if (lower.includes('margin') || lower.includes('revenue') || lower.includes('cogs') || lower.includes('ebitda') || lower.includes('cost') || lower.includes('cash flow')) {
        financeScore += 10;
      }
      // Rhetoric check (Executive vocabulary)
      if (lower.includes('synthesis') || lower.includes('recommend') || lower.includes('strategic') || lower.includes('prioritize') || lower.includes('initiative')) {
        rhetoricScore += 10;
      }
      // Actionability check (Timeline, roadmaps)
      if (lower.includes('day') || lower.includes('triage') || lower.includes('action') || lower.includes('timeline') || lower.includes('phase')) {
        actionScore += 10;
      }

      // Length penalty if too short
      if (length < 150) {
        structureScore = Math.min(structureScore, 10);
        financeScore = Math.min(financeScore, 10);
        rhetoricScore = Math.min(rhetoricScore, 10);
        actionScore = Math.min(actionScore, 10);
      }

      const totalScore = Math.min(100, structureScore + financeScore + rhetoricScore + actionScore);
      const passed = totalScore >= boss.passingScore;

      let feedback = '';
      if (passed) {
        feedback = `PROMOTION COMMITTEE RULING: APPROVED (${totalScore}/100).\n\nOutstanding executive synthesis. Your MECE root-cause decomposition and clear phased triage demonstrated true C-suite advisory maturity. Promotion gate unlocked.`;
        addXp(1000, `Defeated Boss Battle: ${boss.title}`);
        addAttributeScore('strategicMind', 10);
        addAttributeScore('financeIQ', 10);
        addAttributeScore('englishRhetoric', 10);

        // Update Career Tier if promotion condition met
        set({
          character: {
            ...character,
            tier: boss.targetTier,
            title: boss.targetTier === 'Associate' ? 'Senior Strategic Associate' : boss.targetTier === 'VP / Manager' ? 'Engagement Director / VP' : 'Managing Director & Senior Partner',
          },
          bossBattles: bossBattles.map((b) => (b.id === bossId ? { ...b, passed: true, score: totalScore, userSubmission: submissionText, feedback } : b)),
        });

        playLevelUp().catch(() => {});
        try {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
          });
        } catch {}
      } else {
        feedback = `PROMOTION COMMITTEE RULING: REJECTED (${totalScore}/100). Minimum required: ${boss.passingScore}/100.\n\nCritique: The submission lacks sufficient top-down Pyramid Principle structure, rigorous financial driver decomposition, or actionable 30-60-90 day timelines. Refine your issue tree and resubmit.`;
        set({
          bossBattles: bossBattles.map((b) => (b.id === bossId ? { ...b, score: totalScore, userSubmission: submissionText, feedback } : b)),
        });
        playAlert().catch(() => {});
      }

      persistState(get());
      return { passed, score: totalScore, feedback };
    },

    bossHp: {
      'boss-1': 1000,
      'boss-2': 1000,
      'boss-3': 1000,
    },

    executeMartialStrike: (bossId, technique, argumentText) => {
      const { bossHp, addXp, addAttributeScore } = get();
      const currentHp = bossHp[bossId] ?? 1000;
      const lower = argumentText.toLowerCase();

      let baseDamage = 180;
      let isCrit = false;

      if (technique.includes('MECE') || lower.includes('mece') || lower.includes('root cause') || lower.includes('driver')) {
        baseDamage += 120;
        isCrit = true;
      }
      if (lower.includes('margin') || lower.includes('cash') || lower.includes('ebitda') || lower.includes('revenue') || lower.includes('cogs')) {
        baseDamage += 100;
      }
      if (lower.length > 60) {
        baseDamage += 80;
      }

      const nextHp = Math.max(0, currentHp - baseDamage);
      const updatedBossHp = { ...bossHp, [bossId]: nextHp };

      addXp(Math.round(baseDamage / 2), `Martial Strike: ${technique}`);
      addAttributeScore('strategicMind', 2);
      addAttributeScore('englishRhetoric', 2);

      const counterChallenges = [
        "Đại Trưởng Lão xuất chiêu: 'Ngươi nói phân tích biến phí, nhưng nếu đối thủ hạ giá 15% để cướp thị phần thì kiếm chiêu này đỡ thế nào?'",
        "Ma Đầu cười lạnh: 'Lập luận MECE của ngươi có kẽ hở! Chi phí cố định tại sao không tính khấu hao thiết bị?'",
        "Chưởng Môn gật đầu nhưng vung kiếm phản kích: 'Khẩu khí sắc bén! Hãy dùng thuật ngữ C-level giải trình thời gian hoàn vốn cho Hội đồng!'",
      ];
      const counterChallenge = counterChallenges[Math.floor(Math.random() * counterChallenges.length)];

      set({ bossHp: updatedBossHp });

      if (nextHp === 0) {
        get().evaluateBossSubmission(bossId, argumentText);
      }

      persistState(get());
      return {
        damage: baseDamage,
        isCrit,
        bossRemainingHp: nextHp,
        counterChallenge,
        techniqueName: technique,
      };
    },

    setGeminiApiKey: (key: string) => {
      const { settings } = get();
      set({ settings: { ...settings, geminiApiKey: key } });
      playClick().catch(() => {});
      persistState(get());
    },

    toggleSound: () => {
      const { settings } = get();
      const nextSound = !settings.soundEnabled;
      set({ settings: { ...settings, soundEnabled: nextSound } });
      if (nextSound) playClick().catch(() => {});
      persistState(get());
    },

    exportBackupJson: () => {
      const state = get();
      const backupPackage: ApexBackupPackage = {
        version: '1.0.0',
        exportTimestamp: new Date().toISOString(),
        data: {
          character: state.character,
          quests: state.quests,
          lockInHistory: state.lockInHistory,
          bossBattles: state.bossBattles,
          settings: state.settings,
        },
      };

      const jsonStr = JSON.stringify(backupPackage, null, 2);
      try {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `apex-os-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Backup export blob failed, returning raw string:', err);
      }
      playClick().catch(() => {});
      return jsonStr;
    },

    importBackupJson: (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || parsed.version !== '1.0.0' || !parsed.data) {
          playAlert().catch(() => {});
          return { success: false, error: 'Invalid backup package format or unsupported version.' };
        }

        const data = parsed.data;
        if (!data.character || !Array.isArray(data.quests)) {
          playAlert().catch(() => {});
          return { success: false, error: 'Corrupted backup: Missing character profile or quests inventory.' };
        }

        set({
          character: data.character,
          quests: data.quests,
          lockInHistory: Array.isArray(data.lockInHistory) ? data.lockInHistory : [],
          bossBattles: Array.isArray(data.bossBattles) ? data.bossBattles : DEFAULT_INITIAL_BOSSES,
          settings: data.settings || DEFAULT_STATE.settings,
        });

        playLevelUp().catch(() => {});
        persistState(get());
        return { success: true };
      } catch (err) {
        playAlert().catch(() => {});
        return { success: false, error: (err as Error).message || 'Failed to parse JSON file.' };
      }
    },

    resetToDefaultState: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({
        ...DEFAULT_STATE,
        newLevelUpUnlocked: null,
      });
      playAlert().catch(() => {});
    },
  };
});
