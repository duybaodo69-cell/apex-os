/**
 * APEX: Executive RPG Execution OS
 * Core TypeScript Interface Contracts
 *
 * File target: src/types/index.ts
 */

// ==========================================
// 1. RPG Character & Progression Types
// ==========================================

export type CareerTier =
  | 'Junior Analyst'
  | 'Associate'
  | 'VP / Manager'
  | 'Partner / MD';

export type AttributeKey =
  | 'strategicMind'
  | 'englishRhetoric'
  | 'financeIQ'
  | 'gritStamina';

export type AttributeCategory = 'STR' | 'ENG' | 'FIN' | 'STA';

export interface CharacterAttributes {
  strategicMind: number;
  englishRhetoric: number;
  financeIQ: number;
  gritStamina: number;
}

export interface CharacterStreak {
  current: number;
  best: number;
  lastActiveDate: string | null;
}

export interface CharacterState {
  name: string;
  title: string;
  tier: CareerTier;
  level: number;
  xp: number;
  attributes: CharacterAttributes;
  streak: CharacterStreak;
}

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number; // 0 to 100
  tier: CareerTier;
  nextTier?: CareerTier;
}

// ==========================================
// 2. Daily Execution & Quests Types
// ==========================================

export type QuestCategory = AttributeCategory;

export type QuestStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export interface AttributeReward {
  attribute: keyof CharacterAttributes;
  amount: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  xpReward: number;
  attributeReward: AttributeReward;
  status: QuestStatus;
  isGraceQuest?: boolean;
  createdAt: string;
  completedAt?: string;
}

// ==========================================
// 3. Lock-In Deep Work & MECE Types
// ==========================================

export interface MeceNode {
  id: string;
  text: string;
  children: MeceNode[];
}

export type LockInPresetMinutes = 25 | 50 | 90;

export type LockInStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'abandoned';

export interface LockInSession {
  id: string;
  presetMinutes: LockInPresetMinutes;
  elapsedSeconds: number;
  status: LockInStatus;
  meceTree: MeceNode;
  notes: string;
  xpEarned: number;
  questId?: string;
  startedAt?: string;
  completedAt?: string;
}

// ==========================================
// 4. Boss Battle Arena Types
// ==========================================

export type BossTierGate = Exclude<CareerTier, 'Junior Analyst'>;

export interface BossRubric {
  strategicStructure: number; // max 25
  financialAcuity: number;     // max 25
  executiveRhetoric: number;   // max 25
  actionability: number;       // max 25
}

export interface BossBattle {
  id: string;
  title: string;
  targetTier: BossTierGate;
  requiredXp: number;
  brief: string;
  scenario: string;
  rubric: BossRubric;
  passingScore: number;
  userSubmission?: string;
  score?: number;
  feedback?: string;
  passed: boolean;
}

// ==========================================
// 5. System Settings Types
// ==========================================

export interface Settings {
  geminiApiKey: string;
  soundEnabled: boolean;
}

// ==========================================
// 6. Navigation & Layout Types
// ==========================================

export type NavigationTab =
  | 'execution'
  | 'lockin'
  | 'sparring'
  | 'character'
  | 'settings';

export interface TabItem {
  id: NavigationTab;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
}

// ==========================================
// 7. Audio Synthesizer Types
// ==========================================

export type SoundEffectType = 'levelUp' | 'timerFinish' | 'click' | 'alert';

export interface AudioSynthesizer {
  playLevelUp: () => Promise<void>;
  playTimerFinish: () => Promise<void>;
  playClick: () => Promise<void>;
  playAlert: () => Promise<void>;
  setSoundEnabled: (enabled: boolean) => void;
  isSoundEnabled: () => boolean;
}

// ==========================================
// 8. AI Sparring Partner Types
// ==========================================

export interface EnglishElevationItem {
  original: string;
  elevated: string;
  rationale?: string;
}

export interface AiPartnerCritique {
  score: number; // 1 to 10
  verdict: string;
  meceCritique: string;
  englishElevation: EnglishElevationItem[];
  pressureQuestion: string;
}

export interface SparringMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  critique?: AiPartnerCritique;
}

// ==========================================
// 9. Root Store State & Backup Contracts
// ==========================================

export interface ApexStoreState {
  character: CharacterState;
  quests: Quest[];
  activeLockIn: LockInSession | null;
  lockInHistory: LockInSession[];
  bossBattles: BossBattle[];
  settings: Settings;
  activeTab: NavigationTab;
}

export interface ApexBackupPackage {
  version: '1.0.0';
  exportTimestamp: string;
  data: {
    character: CharacterState;
    quests: Quest[];
    lockInHistory: LockInSession[];
    bossBattles: BossBattle[];
    settings: Settings;
  };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

