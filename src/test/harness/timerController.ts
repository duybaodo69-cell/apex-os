/**
 * APEX: Executive RPG Execution OS
 * Deterministic Fake Timer & Date Controller for E2E Tests
 *
 * File target: src/test/harness/timerController.ts
 */

import { vi } from 'vitest';
import { act } from '@testing-library/react';

/**
 * Deterministically advances fake timers by a specified number of seconds,
 * wrapping the tick inside React's act() to guarantee all concurrent state
 * updates, effects, and re-renders flush completely before assertions.
 */
export async function advanceSeconds(seconds: number): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(seconds * 1000);
  });
}

/**
 * Deterministically advances fake timers by minutes (e.g., 25m focus session).
 */
export async function advanceMinutes(minutes: number): Promise<void> {
  await advanceSeconds(minutes * 60);
}

/**
 * Sets the simulated system clock to an exact ISO date string or Date object.
 * Used for testing calendar streak transitions, same-day idempotency, and streak resets.
 *
 * Example: setSimulatedDate('2026-11-12T10:00:00.000Z')
 */
export function setSimulatedDate(dateInput: string | Date): void {
  const targetDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  vi.setSystemTime(targetDate);
}

/**
 * Advances system time and fake timers forward by a discrete number of calendar days.
 * Flushes all pending timers and re-evaluates date deltas inside act().
 */
export async function advanceDays(days: number): Promise<void> {
  const ms = days * 24 * 60 * 60 * 1000;
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

/**
 * Executes a callback within an isolated fake timer scope, automatically
 * restoring real timers upon completion.
 */
export async function withFakeTimers<T>(fn: () => Promise<T>): Promise<T> {
  vi.useFakeTimers();
  try {
    return await fn();
  } finally {
    vi.useRealTimers();
  }
}

/**
 * Flushes all queued macrotasks, microtasks, and fake timers.
 */
export async function flushAllTimers(): Promise<void> {
  await act(async () => {
    vi.runAllTimers();
  });
}
