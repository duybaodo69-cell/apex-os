/**
 * APEX: Executive RPG Execution OS
 * Web Audio Synthesis Engine — Adversarial Empirical Stress Test Suite
 *
 * File target: src/test/audio.stress.test.ts
 *
 * Challenger Role: challenger_m1_2 (Empirical Adversarial Verifier)
 * Stress-testing:
 *  1. Concurrency bursts (100+ rapid calls, node allocation, leak prevention)
 *  2. State transitions (null, closed, suspended contexts, autoplay rejections)
 *  3. Mute control (soundEnabled toggling, zero allocation on mute)
 *  4. Exponential ramp validity (strict W3C <= 0 target RangeError guard)
 *  5. Node cleanup and teardown fault tolerance
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  playClick,
  playLevelUp,
  playTimerFinish,
  playAlert,
  setSoundEnabled,
  isSoundEnabled,
  getAudioContext,
  initAudio,
  _resetAudioContextForTesting,
} from '../utils/audio';
import { MockAudioContext, MockOscillatorNode, MockGainNode } from './setup';

describe('Adversarial Stress Test: Web Audio Synthesis Engine', () => {
  // Track all created nodes across tests to verify clean lifecycle
  let createdOscillators: MockOscillatorNode[] = [];
  let createdGainNodes: MockGainNode[] = [];

  // Preserve pristine window audio reference
  const originalAudioContext = window.AudioContext;
  const originalWebkitAudioContext = (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  beforeEach(() => {
    _resetAudioContextForTesting();
    setSoundEnabled(true);
    createdOscillators = [];
    createdGainNodes = [];

    // Instrument MockAudioContext to capture every generated node
    vi.spyOn(MockAudioContext.prototype, 'createOscillator').mockImplementation(function (
      this: MockAudioContext
    ) {
      const osc = new MockOscillatorNode();
      createdOscillators.push(osc);
      return osc;
    });

    vi.spyOn(MockAudioContext.prototype, 'createGain').mockImplementation(function (
      this: MockAudioContext
    ) {
      const gain = new MockGainNode();
      createdGainNodes.push(gain);
      return gain;
    });
  });

  afterEach(() => {
    _resetAudioContextForTesting();
    setSoundEnabled(true);
    vi.restoreAllMocks();
    window.AudioContext = originalAudioContext;
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext = originalWebkitAudioContext;
  });

  // =========================================================================
  // 1. CONCURRENCY STRESS
  // =========================================================================
  describe('1. Concurrency & Rapid Burst Stress', () => {
    it('executes a rapid burst of 100 consecutive playClick() calls without errors', async () => {
      const burstCount = 100;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < burstCount; i++) {
        promises.push(playClick());
      }

      await expect(Promise.all(promises)).resolves.not.toThrow();

      // 1 oscillator + 1 gain node per click
      expect(createdOscillators.length).toBe(burstCount);
      expect(createdGainNodes.length).toBe(burstCount);

      // Verify each oscillator was started, stopped, and has an onended handler
      createdOscillators.forEach((osc) => {
        expect(osc.start).toHaveBeenCalledTimes(1);
        expect(osc.stop).toHaveBeenCalledTimes(1);
        expect(typeof osc.onended).toBe('function');
      });

      // Simulate onended trigger for all 100 oscillators
      createdOscillators.forEach((osc) => {
        osc.onended?.();
      });

      // Verify all oscillators and gain nodes disconnected cleanly
      createdOscillators.forEach((osc) => {
        expect(osc.disconnect).toHaveBeenCalledTimes(1);
      });
      createdGainNodes.forEach((gain) => {
        expect(gain.disconnect).toHaveBeenCalledTimes(1);
      });
    });

    it('executes a rapid burst of 100 consecutive playLevelUp() calls (1,000 tone channels)', async () => {
      const burstCount = 100;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < burstCount; i++) {
        promises.push(playLevelUp());
      }

      await expect(Promise.all(promises)).resolves.not.toThrow();

      // playLevelUp produces 5 notes * 2 (primary sine + overtone triangle) = 10 tones per call
      const expectedNodes = burstCount * 10;
      expect(createdOscillators.length).toBe(expectedNodes);
      expect(createdGainNodes.length).toBe(expectedNodes);

      // Verify onended triggers clean teardown across all 1,000 nodes
      createdOscillators.forEach((osc) => {
        expect(typeof osc.onended).toBe('function');
        osc.onended?.();
        expect(osc.disconnect).toHaveBeenCalledTimes(1);
      });

      createdGainNodes.forEach((gain) => {
        expect(gain.disconnect).toHaveBeenCalledTimes(1);
      });
    });

    it('executes a rapid burst of 100 consecutive playTimerFinish() calls (300 tone channels)', async () => {
      const burstCount = 100;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < burstCount; i++) {
        promises.push(playTimerFinish());
      }

      await expect(Promise.all(promises)).resolves.not.toThrow();

      // 3 resonant harmonic bell tones per call = 300 nodes
      const expectedNodes = burstCount * 3;
      expect(createdOscillators.length).toBe(expectedNodes);
      expect(createdGainNodes.length).toBe(expectedNodes);

      createdOscillators.forEach((osc) => {
        osc.onended?.();
        expect(osc.disconnect).toHaveBeenCalledTimes(1);
      });
      createdGainNodes.forEach((gain) => {
        expect(gain.disconnect).toHaveBeenCalledTimes(1);
      });
    });

    it('executes a rapid burst of 100 consecutive playAlert() calls (200 tone channels)', async () => {
      const burstCount = 100;
      const promises: Promise<void>[] = [];

      for (let i = 0; i < burstCount; i++) {
        promises.push(playAlert());
      }

      await expect(Promise.all(promises)).resolves.not.toThrow();

      // 2 dual-pulse tones per call = 200 nodes
      const expectedNodes = burstCount * 2;
      expect(createdOscillators.length).toBe(expectedNodes);
      expect(createdGainNodes.length).toBe(expectedNodes);

      createdOscillators.forEach((osc) => {
        osc.onended?.();
        expect(osc.disconnect).toHaveBeenCalledTimes(1);
      });
      createdGainNodes.forEach((gain) => {
        expect(gain.disconnect).toHaveBeenCalledTimes(1);
      });
    });

    it('survives an interleaved chaos burst of 50 multi-channel sound waves simultaneously', async () => {
      const cycles = 50;
      const tasks: Promise<void>[] = [];

      for (let i = 0; i < cycles; i++) {
        tasks.push(playClick());
        tasks.push(playLevelUp());
        tasks.push(playTimerFinish());
        tasks.push(playAlert());
      }

      await expect(Promise.all(tasks)).resolves.not.toThrow();

      // (1 + 10 + 3 + 2) = 16 tones * 50 = 800 tone channels
      expect(createdOscillators.length).toBe(800);
      expect(createdGainNodes.length).toBe(800);

      // Trigger all ended handlers in batch
      createdOscillators.forEach((osc) => osc.onended?.());

      // Assert 100% clean disconnection
      expect(createdOscillators.every((osc) => vi.mocked(osc.disconnect).mock.calls.length === 1)).toBe(true);
      expect(createdGainNodes.every((gain) => vi.mocked(gain.disconnect).mock.calls.length === 1)).toBe(true);
    });
  });

  // =========================================================================
  // 2. EXPONENTIAL RAMP VALIDITY & RANGEERROR ADVERSARIAL ORACLE
  // =========================================================================
  describe('2. Web Audio W3C Exponential Ramp Safety Oracle', () => {
    it('strictly guarantees NO exponential ramp target is <= 0 or non-finite', async () => {
      // In Web Audio W3C spec, AudioParam.exponentialRampToValueAtTime throws RangeError
      // if value <= 0 or if the start value was 0.
      const rampTargets: { target: number; time: number }[] = [];
      const setValues: { value: number; time: number }[] = [];

      // Intercept and rigorously validate every setValueAtTime and exponentialRampToValueAtTime
      const setValueSpy = vi.fn().mockImplementation(function (this: any, val: number, time: number) {
        setValues.push({ value: val, time });
        this.value = val;
        return this;
      });

      const exponentialSpy = vi.fn().mockImplementation(function (this: any, val: number, time: number) {
        rampTargets.push({ target: val, time });

        if (typeof val !== 'number' || !Number.isFinite(val)) {
          throw new TypeError(`AudioParam: exponential ramp value must be finite, got ${val}`);
        }
        if (val <= 0) {
          throw new RangeError(
            `Web Audio API RangeError: The float value provided (${val}) MUST be strictly greater than 0.`
          );
        }
        if (this.value <= 0) {
          throw new RangeError(
            `Web Audio API RangeError: Cannot ramp exponentially from initial value <= 0 (was ${this.value}).`
          );
        }

        this.value = val;
        return this;
      });

      // Apply strict oracle to prototype
      const originalSetValue = MockGainNode.prototype.gain.setValueAtTime;
      const originalExpRamp = MockGainNode.prototype.gain.exponentialRampToValueAtTime;
      (MockGainNode.prototype.gain as any).setValueAtTime = setValueSpy;
      (MockGainNode.prototype.gain as any).exponentialRampToValueAtTime = exponentialSpy;

      try {
        // Trigger all procedural sounds
        await playLevelUp();
        await playTimerFinish();
        await playAlert();
        await playClick();

        // Verify that ramps occurred
        expect(rampTargets.length).toBeGreaterThan(0);
        expect(setValues.length).toBeGreaterThan(0);

        // Explicitly verify each recorded target value
        for (const record of rampTargets) {
          expect(record.target).toBeGreaterThan(0);
          expect(Number.isFinite(record.target)).toBe(true);
          expect(record.time).toBeGreaterThanOrEqual(0);
        }

        // Verify each recorded baseline setValue
        for (const record of setValues) {
          expect(record.value).toBeGreaterThan(0);
          expect(record.value).toBeGreaterThanOrEqual(0.0001);
        }
      } finally {
        (MockGainNode.prototype.gain as any).setValueAtTime = originalSetValue;
        (MockGainNode.prototype.gain as any).exponentialRampToValueAtTime = originalExpRamp;
      }
    });

    it('verifies playClick frequency sweep exponential ramp is strictly positive', async () => {
      const freqTargets: number[] = [];

      // Spy specifically on oscillator frequency exponential ramps
      const oscExpSpy = vi.fn().mockImplementation(function (this: any, val: number) {
        freqTargets.push(val);
        if (val <= 0) throw new RangeError('Frequency ramp <= 0');
        this.value = val;
        return this;
      });

      const origOscExp = MockOscillatorNode.prototype.frequency.exponentialRampToValueAtTime;
      (MockOscillatorNode.prototype.frequency as any).exponentialRampToValueAtTime = oscExpSpy;

      try {
        await playClick();

        expect(freqTargets.length).toBe(1);
        expect(freqTargets[0]).toBe(600); // 600 Hz sweep end
        expect(freqTargets[0]).toBeGreaterThan(0);
      } finally {
        (MockOscillatorNode.prototype.frequency as any).exponentialRampToValueAtTime = origOscExp;
      }
    });
  });

  // =========================================================================
  // 3. STATE TRANSITION & ENVIRONMENTAL ADVERSITY STRESS
  // =========================================================================
  describe('3. AudioContext State Transition & Fallback Stress', () => {
    it('handles null/missing Web Audio API gracefully (SSR or unequipped browser)', async () => {
      // Simulate environment where AudioContext is completely undefined
      delete (window as any).AudioContext;
      delete (window as any).webkitAudioContext;

      expect(getAudioContext()).toBeNull();

      // Sound functions should gracefully return without uncaught errors
      await expect(playClick()).resolves.toBeUndefined();
      await expect(playLevelUp()).resolves.toBeUndefined();
      await expect(playTimerFinish()).resolves.toBeUndefined();
      await expect(playAlert()).resolves.toBeUndefined();
      await expect(initAudio()).resolves.toBe(false);

      expect(createdOscillators.length).toBe(0);
      expect(createdGainNodes.length).toBe(0);
    });

    it('handles AudioContext constructor throw gracefully', async () => {
      // Simulate constructor throwing (e.g. security sandbox or audio hardware in use)
      window.AudioContext = vi.fn().mockImplementation(() => {
        throw new Error('Audio hardware device unavailable');
      }) as any;

      expect(getAudioContext()).toBeNull();

      await expect(playClick()).resolves.toBeUndefined();
      await expect(playLevelUp()).resolves.toBeUndefined();
      await expect(playTimerFinish()).resolves.toBeUndefined();
      await expect(playAlert()).resolves.toBeUndefined();
      await expect(initAudio()).resolves.toBe(false);
    });

    it('automatically resumes a suspended AudioContext when sounds are invoked', async () => {
      const ctx = getAudioContext() as unknown as MockAudioContext;
      expect(ctx).toBeDefined();

      ctx.state = 'suspended';
      expect(ctx.state).toBe('suspended');

      await playClick();

      expect(ctx.resume).toHaveBeenCalled();
      expect(ctx.state).toBe('running');
      expect(createdOscillators.length).toBe(1);
    });

    it('catches and handles AudioContext.resume() rejection gracefully (browser autoplay block)', async () => {
      const ctx = getAudioContext() as unknown as MockAudioContext;
      ctx.state = 'suspended';

      // Mock resume to reject with a DOMException (NotAllowedError: user gesture required)
      ctx.resume = vi.fn().mockRejectedValue(
        new DOMException('The play() request was interrupted by a call to pause().', 'NotAllowedError')
      );

      // None of these should throw or reject
      await expect(playClick()).resolves.toBeUndefined();
      await expect(playLevelUp()).resolves.toBeUndefined();
      await expect(playTimerFinish()).resolves.toBeUndefined();
      await expect(playAlert()).resolves.toBeUndefined();

      // initAudio should return false on failed resume
      await expect(initAudio()).resolves.toBe(false);

      // Since resume failed, zero sound nodes should be scheduled
      expect(createdOscillators.length).toBe(0);
      expect(createdGainNodes.length).toBe(0);
    });

    it('handles closed AudioContext state without uncaught errors', async () => {
      const ctx = getAudioContext() as unknown as MockAudioContext;
      await ctx.close();
      expect(ctx.state).toBe('closed');

      // On a closed context, standard Web Audio throws InvalidStateError when creating nodes
      ctx.createOscillator = vi.fn().mockImplementation(() => {
        throw new DOMException('Cannot create nodes on a closed context', 'InvalidStateError');
      });
      ctx.createGain = vi.fn().mockImplementation(() => {
        throw new DOMException('Cannot create nodes on a closed context', 'InvalidStateError');
      });

      // Sound functions must swallow node errors safely through their error boundary
      await expect(playClick()).resolves.toBeUndefined();
      await expect(playLevelUp()).resolves.toBeUndefined();
      await expect(playTimerFinish()).resolves.toBeUndefined();
      await expect(playAlert()).resolves.toBeUndefined();

      // initAudio on closed context must return false
      await expect(initAudio()).resolves.toBe(false);
    });
  });

  // =========================================================================
  // 4. MUTE CONTROL & RESOURCE CONSERVATION STRESS
  // =========================================================================
  describe('4. Mute Control & Resource Conservation Stress', () => {
    it('creates ZERO audio nodes and executes ZERO scheduling when muted', async () => {
      setSoundEnabled(false);
      expect(isSoundEnabled()).toBe(false);

      const ctx = getAudioContext() as unknown as MockAudioContext;
      const initialOscCallCount = vi.mocked(ctx.createOscillator).mock.calls.length;
      const initialGainCallCount = vi.mocked(ctx.createGain).mock.calls.length;

      // Dispatch every sound trigger
      await playClick();
      await playLevelUp();
      await playTimerFinish();
      await playAlert();

      // Absolute zero audio node creation
      expect(vi.mocked(ctx.createOscillator).mock.calls.length).toBe(initialOscCallCount);
      expect(vi.mocked(ctx.createGain).mock.calls.length).toBe(initialGainCallCount);
      expect(createdOscillators.length).toBe(0);
      expect(createdGainNodes.length).toBe(0);
    });

    it('resumes normal tone generation immediately upon unmuting', async () => {
      setSoundEnabled(false);
      await playClick();
      expect(createdOscillators.length).toBe(0);

      // Unmute
      setSoundEnabled(true);
      expect(isSoundEnabled()).toBe(true);

      await playClick();
      expect(createdOscillators.length).toBe(1);
      expect(createdGainNodes.length).toBe(1);
    });

    it('survives high-frequency mute toggling during concurrent sound dispatches', async () => {
      const iterations = 50;
      const tasks: Promise<void>[] = [];

      for (let i = 0; i < iterations; i++) {
        // Rapid toggle
        setSoundEnabled(i % 2 === 0);
        tasks.push(playClick());
        tasks.push(playAlert());
      }

      await expect(Promise.all(tasks)).resolves.not.toThrow();

      // Half the calls were muted, half unmuted.
      // Unmuted iterations: 25. Each has 1 click (1 tone) + 1 alert (2 tones) = 3 tones * 25 = 75 tones
      expect(createdOscillators.length).toBe(75);
      expect(createdGainNodes.length).toBe(75);
    });
  });

  // =========================================================================
  // 5. TEARDOWN FAULT TOLERANCE & LIFECYCLE RESILIENCE
  // =========================================================================
  describe('5. Teardown Fault Tolerance & Lifecycle Invariants', () => {
    it('safely handles exceptions thrown during osc.disconnect() or gain.disconnect() in onended', async () => {
      await playClick();
      expect(createdOscillators.length).toBe(1);
      const osc = createdOscillators[0];
      const gain = createdGainNodes[0];

      // Simulate disconnection throwing an error (e.g. if already torn down by garbage collector)
      osc.disconnect = vi.fn().mockImplementation(() => {
        throw new Error('Node already disconnected');
      });
      gain.disconnect = vi.fn().mockImplementation(() => {
        throw new Error('Node already disconnected');
      });

      // Invoking onended should NOT propagate the error
      expect(() => {
        osc.onended?.();
      }).not.toThrow();

      expect(osc.disconnect).toHaveBeenCalledTimes(1);
    });

    it('enforces chronological timeline: stopTime > startTime >= currentTime', async () => {
      const ctx = getAudioContext() as unknown as MockAudioContext;
      ctx.currentTime = 10.5;

      await playLevelUp();

      // All oscillators must start at or after currentTime, and stop after their start
      for (const osc of createdOscillators) {
        expect(osc.start).toHaveBeenCalledTimes(1);
        expect(osc.stop).toHaveBeenCalledTimes(1);

        const startTime = vi.mocked(osc.start).mock.calls[0][0] as number;
        const stopTime = vi.mocked(osc.stop).mock.calls[0][0] as number;

        expect(startTime).toBeGreaterThanOrEqual(10.5);
        expect(stopTime).toBeGreaterThan(startTime);
      }
    });

    it('verifies all synthesized procedural frequencies are within valid human audible range', async () => {
      await playLevelUp();
      await playTimerFinish();
      await playAlert();

      // Human hearing range: 20 Hz to 20,000 Hz
      for (const osc of createdOscillators) {
        const freqValue = osc.frequency.value;
        expect(freqValue).toBeGreaterThanOrEqual(20);
        expect(freqValue).toBeLessThanOrEqual(20000);
      }
    });
  });
});
