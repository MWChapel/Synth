// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Web Audio API
const mockAudioContext = {
  state: 'running',
  sampleRate: 44100,
  currentTime: 0,
  destination: {
    maxChannelCount: 2
  },
  createGain: jest.fn(() => ({
    gain: {
      setValueAtTime: jest.fn(),
      value: 0.5,
      connections: []
    },
    connect: jest.fn()
  })),
  createBiquadFilter: jest.fn(() => ({
    type: 'lowpass',
    frequency: {
      setValueAtTime: jest.fn(),
      value: 2000
    },
    Q: {
      setValueAtTime: jest.fn(),
      value: 0
    },
    connect: jest.fn()
  })),
  createOscillator: jest.fn(() => ({
    frequency: {
      setValueAtTime: jest.fn(),
      value: 440
    },
    type: 'sine',
    start: jest.fn(),
    stop: jest.fn(),
    connect: jest.fn()
  })),
  createBufferSource: jest.fn(() => ({
    buffer: null,
    loop: false,
    start: jest.fn(),
    stop: jest.fn(),
    connect: jest.fn()
  })),
  resume: jest.fn().mockResolvedValue(undefined)
};

// Mock window objects
Object.defineProperty(window, 'AudioContext', {
  value: jest.fn(() => mockAudioContext),
  writable: true
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: jest.fn(() => mockAudioContext),
  writable: true
});

// Mock console methods to avoid noise in tests
const originalConsole = { ...console };
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});

// Global test utilities
global.mockAudioContext = mockAudioContext; 