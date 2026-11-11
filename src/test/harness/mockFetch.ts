/**
 * APEX: Executive RPG Execution OS
 * Hermetic Global Fetch & Google Gemini Mock Configuration
 *
 * File target: src/test/harness/mockFetch.ts
 */

import { vi } from 'vitest';

export interface MockFetchConfig {
  mode: 'online' | 'offline' | 'http_error';
  errorCode?: number;
  errorMessage?: string;
  customResponse?: Record<string, unknown> | string;
}

// Module-level singleton
const internalFetchConfig: MockFetchConfig = {
  mode: 'online',
};

function syncStateToGlobals(state: MockFetchConfig): void {
  if (typeof window !== 'undefined') {
    (window as unknown as { __apexMockFetchState: MockFetchConfig }).__apexMockFetchState = state;
  }
  if (typeof global !== 'undefined') {
    (global as unknown as { __apexMockFetchState: MockFetchConfig }).__apexMockFetchState = state;
  }
  if (typeof globalThis !== 'undefined') {
    (globalThis as unknown as { __apexMockFetchState: MockFetchConfig }).__apexMockFetchState = state;
  }
}

export function getMockFetchState(): MockFetchConfig {
  // Check any global reference first
  const fromWin = typeof window !== 'undefined' ? (window as unknown as { __apexMockFetchState?: MockFetchConfig }).__apexMockFetchState : undefined;
  const fromGlob = typeof global !== 'undefined' ? (global as unknown as { __apexMockFetchState?: MockFetchConfig }).__apexMockFetchState : undefined;
  const fromGlobalThis = typeof globalThis !== 'undefined' ? (globalThis as unknown as { __apexMockFetchState?: MockFetchConfig }).__apexMockFetchState : undefined;

  const current = fromWin || fromGlob || fromGlobalThis || internalFetchConfig;
  syncStateToGlobals(current);
  return current;
}

export function setMockFetchConfig(config: Partial<MockFetchConfig>): void {
  const state = getMockFetchState();
  Object.assign(state, config);
  Object.assign(internalFetchConfig, config);
  syncStateToGlobals(state);
}

export function resetMockFetchConfig(): void {
  const state = getMockFetchState();
  state.mode = 'online';
  delete state.errorCode;
  delete state.errorMessage;
  delete state.customResponse;

  internalFetchConfig.mode = 'online';
  delete internalFetchConfig.errorCode;
  delete internalFetchConfig.errorMessage;
  delete internalFetchConfig.customResponse;

  syncStateToGlobals(state);
}

// Initialize on module load
syncStateToGlobals(internalFetchConfig);

export const DEFAULT_GEMINI_CRITIQUE = {
  score: 9,
  verdict: 'STRONG_PASS',
  meceCritique: 'The issue tree cleanly partitions revenue drivers and cost centers with mutually exclusive categorization.',
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
  pressureQuestion: 'How would you defend this margin turnaround plan when presented to activist shareholders?',
};

export const hermeticFetchHandler = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
  const state = getMockFetchState();
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;

  // Handle explicit offline mode simulation
  if (state.mode === 'offline') {
    throw new TypeError('Failed to fetch: NetworkError when attempting to fetch resource.');
  }

  // Handle explicit HTTP error simulation
  if (state.mode === 'http_error') {
    const status = state.errorCode || 401;
    return {
      ok: false,
      status,
      statusText: status === 401 ? 'Unauthorized' : 'Internal Server Error',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({
        error: {
          code: status,
          message: state.errorMessage || 'Simulated HTTP Error',
        },
      }),
      text: async () => JSON.stringify({ error: state.errorMessage || 'Simulated HTTP Error' }),
    };
  }

  // Google Gemini API route interceptor
  if (typeof url === 'string' && (url.includes('generativelanguage.googleapis.com') || url.includes('/models/gemini'))) {
    const payload = state.customResponse || DEFAULT_GEMINI_CRITIQUE;
    const bodyText = typeof payload === 'string' ? payload : JSON.stringify(payload);

    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: bodyText,
                },
              ],
            },
            finishReason: 'STOP',
          },
        ],
      }),
      text: async () => JSON.stringify({
        candidates: [
          {
            content: {
              parts: [{ text: bodyText }],
            },
          },
        ],
      }),
    };
  }

  // Default 404 for unhandled endpoints
  return {
    ok: false,
    status: 404,
    statusText: 'Not Found',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => ({ error: 'Endpoint not mocked in test harness' }),
    text: async () => JSON.stringify({ error: 'Endpoint not mocked in test harness' }),
  };
});
