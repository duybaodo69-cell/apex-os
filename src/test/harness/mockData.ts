/**
 * APEX: Executive RPG Execution OS
 * Realistic Finance & Consulting Test Fixtures
 *
 * File target: src/test/harness/mockData.ts
 */

import {
  Quest,
  BossBattle,
  ApexStoreState,
  ApexBackupPackage,
  AiPartnerCritique,
  CharacterState,
} from '@/types';

// ==========================================
// 1. Realistic Consulting & Finance Quests Fixtures
// ==========================================

export const MOCK_QUESTS: Record<string, Quest> = {
  meceTreeAnalysis: {
    id: 'quest-str-mece-01',
    title: 'MECE Root Cause Decomposition',
    description: 'Structure a mutually exclusive, collectively exhaustive issue tree to diagnose a 15% revenue decline in European operations.',
    category: 'STR',
    xpReward: 150,
    attributeReward: { attribute: 'strategicMind', amount: 5 },
    status: 'pending',
    createdAt: '2026-11-10T08:00:00.000Z',
  },
  executivePitch: {
    id: 'quest-eng-pitch-01',
    title: '3-Minute C-Suite Elevator Pitch',
    description: 'Deliver a concise, top-down Pyramid Principle synthesis to the Operating Committee on corporate restructuring.',
    category: 'ENG',
    xpReward: 120,
    attributeReward: { attribute: 'englishRhetoric', amount: 4 },
    status: 'in_progress',
    createdAt: '2026-11-10T09:30:00.000Z',
  },
  dcfFinancialModel: {
    id: 'quest-fin-dcf-01',
    title: 'Dynamic 3-Statement & DCF Model',
    description: 'Construct a multi-scenario discounted cash flow model with terminal growth sensitivity and WACC matrix.',
    category: 'FIN',
    xpReward: 200,
    attributeReward: { attribute: 'financeIQ', amount: 6 },
    status: 'pending',
    createdAt: '2026-11-10T10:00:00.000Z',
  },
  staminaLockIn: {
    id: 'quest-sta-sprint-01',
    title: '90-Minute Valuation Focus Sprint',
    description: 'Execute uninterrupted focus on financial due diligence without email or phone interruptions.',
    category: 'STA',
    xpReward: 250,
    attributeReward: { attribute: 'gritStamina', amount: 8 },
    status: 'completed',
    createdAt: '2026-11-09T14:00:00.000Z',
    completedAt: '2026-11-09T15:30:00.000Z',
  },
  graceQuickQuest: {
    id: 'quest-grace-15m-01',
    title: 'Low-Energy Grace Reflection',
    description: '15-minute tactical synthesis reviewing key strategic learnings to preserve streak continuity under cognitive exhaustion.',
    category: 'STA',
    xpReward: 50,
    attributeReward: { attribute: 'gritStamina', amount: 2 },
    status: 'pending',
    isGraceQuest: true,
    createdAt: '2026-11-11T20:00:00.000Z',
  },
};

// ==========================================
// 2. Realistic Boss Battle Submissions & Rubrics
// ==========================================

export const MOCK_BOSS_SUBMISSIONS = {
  boss1CoffeeChain: {
    passing: `1. EXECUTIVE SYNTHESIS
The 25% operating profit decline across our 500-store specialty coffee footprint is primarily driven by store-level labor cost inflation (+18% YoY) combined with negative product mix shift towards low-margin seasonal beverages, rather than systemic foot-traffic erosion (-1.2% YoY).

2. MECE ROOT-CAUSE DECOMPOSITION
- Revenue Stream Drivers:
  * Traffic: Flat in drive-thru locations (+0.8%), down in urban business districts (-4.1%).
  * Average Ticket Size: Up 2.5% due to price elasticity, but transaction frequency decreased.
  * Product Margin Mix: Premium whole-bean sales contracted 12%; low-margin blended cold beverages increased to 48% of volume.
- Cost Structure Drivers:
  * Variable COGS: Milk and paper packaging procurement costs up 9% due to unhedged single-supplier contracts.
  * Store Operating Expenses: Overtime hours increased 22% resulting from recent shift-scheduling software transition failures.
  * Fixed Leases: Fixed occupancy costs remained constant at $82M annualized.

3. 90-DAY STRATEGIC TRIAGE & INITIATIVE ROADMAP
- Triage Day 1-30: Roll back automated shift scheduling; reinstate store manager manual dispatch to eliminate unnecessary overtime ($6.5M annualized saving).
- Day 31-60: Renegotiate dairy and oat milk supply contracts with secondary suppliers and index-linked hedging ($4.2M saving).
- Day 61-90: Re-engineer menu board pricing architecture, repricing blended cold items by +6% to protect gross margin while launching loyalty subscription for urban commuter breakfast bundles.`,

    failing: `Profit went down because costs are high and people don't buy coffee anymore. We should cut prices and do more marketing on TikTok.`,

    borderline: `The coffee company has lower profits because store costs went up and coffee beans got more expensive. Revenue is slightly down in city stores. We need to reduce staff hours and review our supplier contracts within the next quarter.`,
  },

  boss2SaasAcquisition: {
    passing: `MEMORANDUM: INVESTMENT COMMITTEE // PROJECT TITAN
Target: $52M ARR Enterprise B2B SaaS Provider

1. EXECUTIVE VALUATION & INVESTMENT THESIS
We recommend proceeding with the acquisition of CloudMetrics Inc. at an enterprise value of $285M (5.48x LTM ARR). While current GAAP EBITDA is negative (-$4.2M), target exhibits top-decile unit economics: 118% Net Revenue Retention (NRR), 82% Gross Margin, and an LTV/CAC ratio of 4.2x with an 11-month CAC payback period.

2. 3-STATEMENT FINANCIAL RE-UNDERWRITING
- Revenue Trajectory: Historical CAGR of 38%; conservative underwriting assumes deceleration to 26% Year 1 and 21% Year 2 post-acquisition.
- Gross Margin Expansion: 82% expanding to 85% through AWS enterprise discount agreement pooling with parent portfolio.
- EBITDA Triage: Immediate rationalization of non-quota-bearing R&D overhead converts EBITDA to positive +$6.8M (13.1% margin) by Month 12 post-close.
- Unlevered Free Cash Flow: Projected cumulative 5-year FCF of $74M supports 3.5x Senior Debt leverage with 2.8x DSCR minimum.

3. SENSITIVITY & EXIT SCENARIOS
- Base Case: Exit at Year 5 at 4.5x Terminal ARR yielding 24.2% Net IRR and 2.9x MoIC.
- Downside Stress (NRR decays to 102%, terminal multiple compresses to 3.0x): Net IRR remains positive at 11.4% with 1.6x MoIC.`,

    failing: `This SaaS company has 50M revenue. We like the product and think we can buy it and make money later.`,
  },

  boss3BoardroomTurnaround: {
    passing: `STRICTLY CONFIDENTIAL // SPECIAL COMMITTEE OF THE BOARD
Subject: 100-Day Cash Liquidity Triage & Operating Turnaround Defense

1. SITUATION AUDIT & 13-WEEK CASH CLIFF
Apex Tier-1 Precision Components faces an imminent cash deficit in Week 7 ($14.2M shortfall against $20M liquidity covenant) absent emergency intervention, caused by working capital expansion from inventory buildup ($38M excess WIP) and debt service on the floating-rate Term Loan B.

2. IMMEDIATE 30-DAY CASH PRESERVATION ACTIONS
- Moratorium on Uncommitted Capex: Immediate freeze on non-safety capital expenditures, preserving $18.5M cash over Q3/Q4.
- Accelerated Working Capital Monetization:
  * Receivables factoring on investment-grade OEM balances ($24M liquidity release).
  * Aggressive inventory clearance discounts on mature SKU inventory to OEM partners ($12M cash generated).
- Supplier Payment Term Alignment: Transition standard 45-day terms to 75-day supply-chain finance backed terms.

3. OPERATIONAL RESTRUCTURING & ACTIVIST ENGAGEMENT
- Plant Footprint Rationalization: Consolidation of two secondary stamping facilities into the flagship Ohio plant generates $22M permanent run-rate SG&A reduction.
- Creditor Standstill Negotiation: Execute 60-day covenant holiday with syndicate bank steering committee in exchange for 25 bps fee and equity pledge.
- Boardroom Defense Narrative: Present affirmative operational turnaround plan to activist blockholders ahead of proxy deadline, demonstrating EBITDA recovery from 4.2% to 11.8% within 18 months.`,

    failing: `We are running out of money soon. The board needs to tell shareholders to be patient while we try to sell some old equipment.`,
  },
};

// ==========================================
// 3. AI Partner Realistic Critique Fixtures
// ==========================================

export const MOCK_AI_CRITIQUES: Record<string, AiPartnerCritique> = {
  highPass: {
    score: 9,
    verdict: 'STRONG_PASS',
    meceCritique: 'The structural decomposition thoroughly separates controllable unit economics from macro market headwinds. Mutually exclusive across operational and financial axes.',
    englishElevation: [
      {
        original: 'We need to cut costs fast.',
        elevated: 'Immediate operational expenditure rationalization is warranted to restore EBITDA margins.',
        rationale: 'Elevates colloquial phrasing to executive C-level diction.',
      },
      {
        original: 'Sales might increase.',
        elevated: 'Top-line expansion is projected to accelerate following regional salesforce realignments.',
        rationale: 'Replaces tentative hedging with definitive strategic assertion.',
      },
    ],
    pressureQuestion: 'How would you defend this margin turnaround plan when presented to activist shareholders demand immediate dividend payout?',
  },

  marginalPass: {
    score: 7,
    verdict: 'MARGINAL_PASS',
    meceCritique: 'Adequate categorization, though overlapping synergies exist between variable procurement and fixed SG&A rationalization.',
    englishElevation: [
      {
        original: 'We should look at the supply chain.',
        elevated: 'A comprehensive end-to-end supply chain audit must be initiated.',
        rationale: 'Replaces vague proposition with concrete executive action.',
      },
    ],
    pressureQuestion: 'What contingency is established if vendor renegotiations stall beyond Day 60?',
  },

  failSuperficial: {
    score: 3,
    verdict: 'REJECT_SUPERFICIAL',
    meceCritique: 'Total lack of structural framework. Response fails to segment revenues and expenses. Answer is superficial (<30 words) and demonstrates no analytical rigor.',
    englishElevation: [
      {
        original: 'Costs are high and people do not buy.',
        elevated: 'Margin compression stems from asymmetric input cost inflation unmitigated by dynamic pricing.',
        rationale: 'Transforms casual observation into diagnostic financial analysis.',
      },
    ],
    pressureQuestion: 'How can you quantify these assertions with verifiable operational and financial data?',
  },
};

// ==========================================
// 4. Default Boss Battles Fixtures
// ==========================================

export const MOCK_BOSS_BATTLES: BossBattle[] = [
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

// ==========================================
// 5. Complete Seed Store State & Backup Package Fixtures
// ==========================================

export const MOCK_CHARACTER_JUNIOR_ANALYST: CharacterState = {
  name: 'Alex Vance',
  title: 'Strategic Finance Analyst',
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
};

export const MOCK_VALID_STORE_STATE: ApexStoreState = {
  character: MOCK_CHARACTER_JUNIOR_ANALYST,
  quests: [
    MOCK_QUESTS.meceTreeAnalysis,
    MOCK_QUESTS.executivePitch,
    MOCK_QUESTS.dcfFinancialModel,
  ],
  activeLockIn: null,
  lockInHistory: [
    {
      id: 'session-hist-01',
      presetMinutes: 25,
      elapsedSeconds: 1500,
      status: 'completed',
      meceTree: {
        id: 'root-1',
        text: 'Margin Turnaround',
        children: [
          { id: 'sub-1', text: 'Revenue Enhancement', children: [] },
          { id: 'sub-2', text: 'Cost Optimization', children: [] },
        ],
      },
      notes: 'Focused on dairy hedging contracts and overtime elimination.',
      xpEarned: 225,
      completedAt: '2026-11-10T11:00:00.000Z',
    },
  ],
  bossBattles: MOCK_BOSS_BATTLES,
  settings: {
    geminiApiKey: '',
    soundEnabled: true,
  },
  activeTab: 'execution',
};

export const MOCK_VALID_BACKUP_PACKAGE: ApexBackupPackage = {
  version: '1.0.0',
  exportTimestamp: '2026-11-11T10:00:00.000Z',
  data: {
    character: MOCK_CHARACTER_JUNIOR_ANALYST,
    quests: [
      MOCK_QUESTS.meceTreeAnalysis,
      MOCK_QUESTS.executivePitch,
    ],
    lockInHistory: [],
    bossBattles: MOCK_BOSS_BATTLES,
    settings: {
      geminiApiKey: '',
      soundEnabled: true,
    },
  },
};

export const MOCK_CORRUPTED_BACKUP_PACKAGES = {
  invalidJson: '{{{ NOT VALID JSON ... [[[',
  missingCharacter: {
    version: '1.0.0',
    exportTimestamp: '2026-11-11T10:00:00.000Z',
    data: {
      quests: [],
      lockInHistory: [],
      bossBattles: [],
      settings: { geminiApiKey: '', soundEnabled: true },
    },
  },
  wrongVersion: {
    version: '99.0.0',
    exportTimestamp: '2026-11-11T10:00:00.000Z',
    data: {
      character: MOCK_CHARACTER_JUNIOR_ANALYST,
      quests: [],
      lockInHistory: [],
      bossBattles: [],
      settings: { geminiApiKey: '', soundEnabled: true },
    },
  },
  negativeAttributes: {
    version: '1.0.0',
    exportTimestamp: '2026-11-11T10:00:00.000Z',
    data: {
      character: {
        ...MOCK_CHARACTER_JUNIOR_ANALYST,
        attributes: {
          strategicMind: -50,
          englishRhetoric: -20,
          financeIQ: -10,
          gritStamina: -5,
        },
      },
      quests: [],
      lockInHistory: [],
      bossBattles: [],
      settings: { geminiApiKey: '', soundEnabled: true },
    },
  },
};
