/**
 * APEX: Executive RPG Execution OS
 * Strongly Typed State Factories for E2E Tests
 *
 * File target: src/test/harness/stateFactory.ts
 */

import {
  CharacterState,
  CareerTier,
  Quest,
  LockInSession,
  MeceNode,
  BossBattle,
  Settings,
  ApexStoreState,
  ApexBackupPackage,
} from '@/types';
import { MOCK_BOSS_BATTLES } from './mockData';

// ==========================================
// 1. Character State Factories
// ==========================================

export function createAnalystCharacter(overrides?: Partial<CharacterState>): CharacterState {
  return {
    name: 'Analyst #001',
    title: 'Junior Strategic Analyst',
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
      lastActiveDate: '2026-11-10',
    },
    ...overrides,
  };
}

export function createAssociateCharacter(overrides?: Partial<CharacterState>): CharacterState {
  return {
    name: 'Associate #104',
    title: 'Senior Associate Consultant',
    tier: 'Associate',
    level: 11,
    xp: 2500,
    attributes: {
      strategicMind: 25,
      englishRhetoric: 25,
      financeIQ: 25,
      gritStamina: 25,
    },
    streak: {
      current: 7,
      best: 10,
      lastActiveDate: '2026-11-10',
    },
    ...overrides,
  };
}

export function createVpCharacter(overrides?: Partial<CharacterState>): CharacterState {
  return {
    name: 'Manager #302',
    title: 'Engagement Manager / VP',
    tier: 'VP / Manager',
    level: 21,
    xp: 10000,
    attributes: {
      strategicMind: 50,
      englishRhetoric: 50,
      financeIQ: 50,
      gritStamina: 50,
    },
    streak: {
      current: 21,
      best: 30,
      lastActiveDate: '2026-11-10',
    },
    ...overrides,
  };
}

export function createPartnerCharacter(overrides?: Partial<CharacterState>): CharacterState {
  return {
    name: 'Partner #777',
    title: 'Senior Partner & Managing Director',
    tier: 'Partner / MD',
    level: 35,
    xp: 30000,
    attributes: {
      strategicMind: 85,
      englishRhetoric: 85,
      financeIQ: 85,
      gritStamina: 85,
    },
    streak: {
      current: 60,
      best: 90,
      lastActiveDate: '2026-11-10',
    },
    ...overrides,
  };
}

export function createCharacterByTier(tier: CareerTier, overrides?: Partial<CharacterState>): CharacterState {
  switch (tier) {
    case 'Junior Analyst':
      return createAnalystCharacter(overrides);
    case 'Associate':
      return createAssociateCharacter(overrides);
    case 'VP / Manager':
      return createVpCharacter(overrides);
    case 'Partner / MD':
      return createPartnerCharacter(overrides);
    default:
      return createAnalystCharacter(overrides);
  }
}

// ==========================================
// 2. Quest Factories
// ==========================================

export function createTestQuest(id: string = `quest-${Date.now()}`, overrides?: Partial<Quest>): Quest {
  return {
    id,
    title: `Financial Modeling Sprint ${id}`,
    description: 'Construct a dynamic 3-statement forecast model and terminal growth sensitivity.',
    category: 'FIN',
    xpReward: 150,
    attributeReward: { attribute: 'financeIQ', amount: 5 },
    status: 'pending',
    createdAt: '2026-11-11T09:00:00.000Z',
    ...overrides,
  };
}

export function createGraceQuest(overrides?: Partial<Quest>): Quest {
  return {
    id: `grace-quest-${Date.now()}`,
    title: '15-Minute Low-Energy Grace Mode',
    description: 'Executive reflection and quick journaling to preserve daily streak on exhausting days.',
    category: 'STA',
    xpReward: 50,
    attributeReward: { attribute: 'gritStamina', amount: 2 },
    status: 'pending',
    isGraceQuest: true,
    createdAt: '2026-11-11T21:00:00.000Z',
    ...overrides,
  };
}

export function createActiveQuestSet(count: number = 3): Quest[] {
  const categories: Array<'STR' | 'ENG' | 'FIN' | 'STA'> = ['STR', 'ENG', 'FIN', 'STA'];
  const titles = [
    'MECE Root Cause Tree',
    '3-Minute Elevator Pitch',
    'DCF Valuation Model',
    'Strategy Executive Memo',
  ];

  return Array.from({ length: count }, (_, index) => {
    const cat = categories[index % categories.length];
    return createTestQuest(`active-q-${index + 1}`, {
      title: titles[index % titles.length],
      category: cat,
      status: index === 0 ? 'in_progress' : 'pending',
      xpReward: 100 + index * 50,
    });
  });
}

// ==========================================
// 3. MECE Tree & Lock-In Session Factories
// ==========================================

export function createMeceTree(rootText: string = 'Core Strategic Problem'): MeceNode {
  return {
    id: 'mece-root-node',
    text: rootText,
    children: [
      {
        id: 'mece-branch-1',
        text: 'Revenue Acceleration',
        children: [
          { id: 'mece-sub-1a', text: 'Price Elasticity Optimization', children: [] },
          { id: 'mece-sub-1b', text: 'Volume & Channel Expansion', children: [] },
        ],
      },
      {
        id: 'mece-branch-2',
        text: 'Cost Rationalization',
        children: [
          { id: 'mece-sub-2a', text: 'COGS Procurement Renegotiation', children: [] },
          { id: 'mece-sub-2b', text: 'Operating Overhead Reduction', children: [] },
        ],
      },
    ],
  };
}

export function createTestLockInSession(
  presetMinutes: 25 | 50 | 90 = 25,
  overrides?: Partial<LockInSession>
): LockInSession {
  return {
    id: `lockin-session-${Date.now()}`,
    presetMinutes,
    elapsedSeconds: 0,
    status: 'running',
    meceTree: createMeceTree('Margin Turnaround Synthesis'),
    notes: 'Drafting 13-week cash waterfall and activist defense memorandum.',
    xpEarned: 0,
    startedAt: '2026-11-11T14:00:00.000Z',
    ...overrides,
  };
}

// ==========================================
// 4. Boss Battle Factories
// ==========================================

export function createTestBoss(id: string = 'boss-1', overrides?: Partial<BossBattle>): BossBattle {
  const base = MOCK_BOSS_BATTLES.find((b) => b.id === id) || MOCK_BOSS_BATTLES[0];
  return {
    ...base,
    ...overrides,
    rubric: {
      ...base.rubric,
      ...(overrides?.rubric || {}),
    },
  };
}

// ==========================================
// 5. System Settings Factories
// ==========================================

export function createTestSettings(overrides?: Partial<Settings>): Settings {
  return {
    geminiApiKey: '',
    soundEnabled: true,
    ...overrides,
  };
}

// ==========================================
// 6. Complete Store State Factories
// ==========================================

export function createDefaultStoreState(overrides?: Partial<ApexStoreState>): ApexStoreState {
  return {
    character: createAnalystCharacter(overrides?.character),
    quests: overrides?.quests ?? createActiveQuestSet(2),
    activeLockIn: overrides?.activeLockIn ?? null,
    lockInHistory: overrides?.lockInHistory ?? [],
    bossBattles: overrides?.bossBattles ?? MOCK_BOSS_BATTLES.map((b) => ({ ...b })),
    settings: createTestSettings(overrides?.settings),
    activeTab: overrides?.activeTab ?? 'execution',
  };
}

export function createStoreStateForTier(
  tier: CareerTier,
  overrides?: Partial<ApexStoreState>
): ApexStoreState {
  const character = createCharacterByTier(tier, overrides?.character);
  const bossBattles = MOCK_BOSS_BATTLES.map((b) => {
    // If character tier exceeds boss tier gate, mark that boss as passed
    if (tier === 'Associate' && b.id === 'boss-1') {
      return { ...b, passed: true, score: 85 };
    }
    if (tier === 'VP / Manager' && (b.id === 'boss-1' || b.id === 'boss-2')) {
      return { ...b, passed: true, score: 90 };
    }
    if (tier === 'Partner / MD') {
      return { ...b, passed: true, score: 95 };
    }
    return { ...b };
  });

  return {
    character,
    quests: overrides?.quests ?? createActiveQuestSet(3),
    activeLockIn: overrides?.activeLockIn ?? null,
    lockInHistory: overrides?.lockInHistory ?? [],
    bossBattles: overrides?.bossBattles ?? bossBattles,
    settings: createTestSettings(overrides?.settings),
    activeTab: overrides?.activeTab ?? 'execution',
  };
}

// ==========================================
// 7. Backup Package Factory
// ==========================================

export function createBackupPackage(
  state?: ApexStoreState,
  overrides?: Partial<ApexBackupPackage>
): ApexBackupPackage {
  const sourceState = state || createDefaultStoreState();
  return {
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    data: {
      character: sourceState.character,
      quests: sourceState.quests,
      lockInHistory: sourceState.lockInHistory,
      bossBattles: sourceState.bossBattles,
      settings: sourceState.settings,
    },
    ...overrides,
  };
}
