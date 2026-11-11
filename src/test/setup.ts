/**
 * APEX: Executive RPG Execution OS
 * Comprehensive JSDOM Browser Mocks & Global Test Setup
 *
 * File target: src/test/setup.ts
 */

import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import {
  hermeticFetchHandler,
  resetMockFetchConfig,
} from './harness/mockFetch';

// ==========================================
// 1. Web Audio API Mock (AudioContext / Nodes)
// ==========================================

export class MockAudioParam {
  value: number;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  setValueAtTime = vi.fn().mockImplementation((val: number) => {
    this.value = val;
    return this;
  });

  exponentialRampToValueAtTime = vi.fn().mockImplementation((val: number) => {
    this.value = val;
    return this;
  });

  linearRampToValueAtTime = vi.fn().mockImplementation((val: number) => {
    this.value = val;
    return this;
  });

  setTargetAtTime = vi.fn().mockImplementation((val: number) => {
    this.value = val;
    return this;
  });

  setValueCurveAtTime = vi.fn().mockImplementation(() => {
    return this;
  });

  cancelScheduledValues = vi.fn().mockImplementation(() => {
    return this;
  });
}

export class MockGainNode {
  gain: MockAudioParam;
  connect = vi.fn().mockReturnValue({});
  disconnect = vi.fn();

  constructor() {
    this.gain = Object.create(MockGainNode.prototype.gain);
    this.gain.value = 1;
  }
}
MockGainNode.prototype.gain = new MockAudioParam(1);

export class MockOscillatorNode {
  type: OscillatorType = 'sine';
  frequency: MockAudioParam;
  detune: MockAudioParam;
  connect = vi.fn().mockReturnValue({});
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
  onended: (() => void) | null = null;

  constructor() {
    this.frequency = Object.create(MockOscillatorNode.prototype.frequency);
    this.frequency.value = 440;
    this.detune = Object.create(MockOscillatorNode.prototype.detune);
    this.detune.value = 0;
  }
}
MockOscillatorNode.prototype.frequency = new MockAudioParam(440);
MockOscillatorNode.prototype.detune = new MockAudioParam(0);

export class MockAudioContext {
  state: AudioContextState = 'running';
  currentTime = 0;
  sampleRate = 44100;
  destination = {};

  createGain() {
    return new MockGainNode();
  }

  createOscillator() {
    return new MockOscillatorNode();
  }

  resume = vi.fn().mockImplementation(async () => {
    this.state = 'running';
  });

  suspend = vi.fn().mockImplementation(async () => {
    this.state = 'suspended';
  });

  close = vi.fn().mockImplementation(async () => {
    this.state = 'closed';
  });
}
MockAudioContext.prototype.resume = vi.fn().mockImplementation(async function(this: MockAudioContext) {
  this.state = 'running';
});
MockAudioContext.prototype.suspend = vi.fn().mockImplementation(async function(this: MockAudioContext) {
  this.state = 'suspended';
});
MockAudioContext.prototype.close = vi.fn().mockImplementation(async function(this: MockAudioContext) {
  this.state = 'closed';
});

// Attach AudioContext to window and global
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
});

Object.defineProperty(globalThis, 'AudioContext', {
  writable: true,
  configurable: true,
  value: MockAudioContext,
});

// ==========================================
// 2. Window matchMedia Mock
// ==========================================
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ==========================================
// 3. Canvas 2D & canvas-confetti Mocks
// ==========================================
export const mock2dContext = {
  canvas: null as unknown as HTMLCanvasElement,
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 1,
    height: 1,
    colorSpace: 'srgb',
  })),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  rect: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  fillText: vi.fn(),
  strokeText: vi.fn(),
};

const getContextMock = vi.fn().mockImplementation(function (this: HTMLCanvasElement, contextId: string) {
  if (contextId === '2d') {
    mock2dContext.canvas = this;
    return mock2dContext;
  }
  return null;
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: getContextMock,
  writable: true,
  configurable: true,
});

if (typeof window !== 'undefined' && window.HTMLCanvasElement) {
  Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
    value: getContextMock,
    writable: true,
    configurable: true,
  });
}

const mockConfettiFn = vi.fn().mockResolvedValue(null);
Object.assign(mockConfettiFn, {
  create: vi.fn(() => mockConfettiFn),
  reset: vi.fn(),
});

vi.mock('canvas-confetti', () => ({
  __esModule: true,
  default: mockConfettiFn,
  create: vi.fn(() => mockConfettiFn),
  reset: vi.fn(),
}));

// ==========================================
// 4. Fullscreen API Mock
// ==========================================
let currentFullscreenElement: Element | null = null;

const fullscreenElementDescriptor: PropertyDescriptor = {
  get: () => currentFullscreenElement,
  set: (val: Element | null) => {
    currentFullscreenElement = val;
  },
  configurable: true,
  enumerable: true,
};

Object.defineProperty(document, 'fullscreenElement', fullscreenElementDescriptor);
if (typeof Document !== 'undefined') {
  Object.defineProperty(Document.prototype, 'fullscreenElement', fullscreenElementDescriptor);
}

const requestFullscreenMock = vi.fn().mockImplementation(async function (this: Element) {
  currentFullscreenElement = this;
  document.dispatchEvent(new Event('fullscreenchange'));
});

Element.prototype.requestFullscreen = requestFullscreenMock;
if (typeof HTMLElement !== 'undefined') {
  HTMLElement.prototype.requestFullscreen = requestFullscreenMock;
}

const exitFullscreenMock = vi.fn().mockImplementation(async function () {
  currentFullscreenElement = null;
  document.dispatchEvent(new Event('fullscreenchange'));
});

document.exitFullscreen = exitFullscreenMock;
if (typeof Document !== 'undefined') {
  Document.prototype.exitFullscreen = exitFullscreenMock;
}

// ==========================================
// 5. Blob URL Mock (Export Backup)
// ==========================================
let blobCounter = 0;
const createObjectURLMock = vi.fn().mockImplementation((_blob: Blob | MediaSource) => {
  blobCounter += 1;
  return `blob:apex-test-backup-mock-${blobCounter}`;
});

const revokeObjectURLMock = vi.fn();

Object.defineProperty(URL, 'createObjectURL', {
  value: createObjectURLMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: revokeObjectURLMock,
  writable: true,
  configurable: true,
});

if (typeof window !== 'undefined' && window.URL) {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: createObjectURLMock,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window.URL, 'revokeObjectURL', {
    value: revokeObjectURLMock,
    writable: true,
    configurable: true,
  });
}

// ==========================================
// 6. Global Fetch Mock (Google Gemini & Offline Fallback)
// ==========================================
global.fetch = hermeticFetchHandler as unknown as typeof fetch;
globalThis.fetch = hermeticFetchHandler as unknown as typeof fetch;
if (typeof window !== 'undefined') {
  window.fetch = hermeticFetchHandler as unknown as typeof fetch;
}

// ==========================================
// 7. Test Lifecycle Resets & Storage Isolation
// ==========================================
beforeEach(() => {
  localStorage.clear();
  window.localStorage.clear();
  sessionStorage.clear();
  window.sessionStorage.clear();
  currentFullscreenElement = null;
  resetMockFetchConfig();
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
  window.localStorage.clear();
  sessionStorage.clear();
  window.sessionStorage.clear();
  currentFullscreenElement = null;
  resetMockFetchConfig();
});
