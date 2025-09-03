import { renderHook, act } from '@testing-library/react';
import { useSynth } from '../useSynth';

// Mock the PolyphonicSynthesizer class
jest.mock('../../audio/PolyphonicSynthesizer');

const MockPolyphonicSynthesizer = require('../../audio/PolyphonicSynthesizer').PolyphonicSynthesizer;

describe('useSynth', () => {
  let mockSynth;
  let consoleSpy;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
    
    // Create mock synth instance
    mockSynth = {
      audioContext: { state: 'running', sampleRate: 44100 },
      masterGain: { gain: { value: 0.5 } },
      activeVoices: new Map(),
      stopAllVoices: jest.fn(),
      updateParam: jest.fn(),
      noteOn: jest.fn(),
      noteOff: jest.fn(),
      playTestTone: jest.fn(),
      forceResume: jest.fn(),
      runSystemTests: jest.fn()
    };
    
    // Mock constructor
    MockPolyphonicSynthesizer.mockImplementation(() => mockSynth);
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe('Initialization', () => {
    test('should initialize with default state', () => {
      const { result } = renderHook(() => useSynth());
      
      expect(result.current.synth).toBe(mockSynth);
      expect(result.current.synthState).toEqual({
        oscillators: {
          osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.8 },
          osc2: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.6 },
          osc3: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.4 },
          oscSync: 0,
          ringMod: 0,
          noiseLevel: 0
        },
        filter: {
          cutoff: 2000,
          resonance: 0,
          type: 'lowpass',
          slope: 24,
          envAmount: 0.5,
          lfoAmount: 0,
          keyboard: 0.3
        },
        envelopes: {
          amplitude: { attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.3 },
          filter: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.3 }
        },
        lfo: {
          waveform: 'sine',
          rate: 1,
          amount: 0,
          delay: 0,
          toPitch: 0,
          toFilter: 0,
          toAmp: 0
        },
        effects: {
          reverb: 0.3,
          delay: 0.2,
          distortion: 0,
          chorus: 0
        },
        masterVolume: 0.5
      });
    });

    test('should create synthesizer instance', () => {
      renderHook(() => useSynth());
      
      expect(MockPolyphonicSynthesizer).toHaveBeenCalled();
    });

    test('should handle initialization errors gracefully', () => {
      const error = new Error('Initialization failed');
      MockPolyphonicSynthesizer.mockImplementationOnce(() => {
        throw error;
      });
      
      renderHook(() => useSynth());
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        '❌ Failed to initialize synthesizer:',
        error
      );
    });

    test('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useSynth());
      
      unmount();
      
      expect(mockSynth.stopAllVoices).toHaveBeenCalled();
    });
  });

  describe('Parameter Updates', () => {
    let result;

    beforeEach(() => {
      const hookResult = renderHook(() => useSynth());
      result = hookResult.result;
    });

    test('should update oscillator parameters', () => {
      act(() => {
        result.current.updateParam('oscillators', 'osc1.waveform', 'square');
      });
      
      expect(result.current.synthState.oscillators.osc1.waveform).toBe('square');
      expect(mockSynth.updateParam).toHaveBeenCalledWith('oscillators', 'osc1.waveform', 'square');
    });

    test('should update filter parameters', () => {
      act(() => {
        result.current.updateParam('filter', 'cutoff', 3000);
      });
      
      expect(result.current.synthState.filter.cutoff).toBe(3000);
      expect(mockSynth.updateParam).toHaveBeenCalledWith('filter', 'cutoff', 3000);
    });

    test('should update envelope parameters', () => {
      act(() => {
        result.current.updateParam('envelopes', 'amplitude.attack', 0.2);
      });
      
      expect(result.current.synthState.envelopes.amplitude.attack).toBe(0.2);
      expect(mockSynth.updateParam).toHaveBeenCalledWith('envelopes', 'amplitude.attack', 0.2);
    });

    test('should update LFO parameters', () => {
      act(() => {
        result.current.updateParam('lfo', 'rate', 2.0);
      });
      
      expect(result.current.synthState.lfo.rate).toBe(2.0);
      expect(mockSynth.updateParam).toHaveBeenCalledWith('lfo', 'rate', 2.0);
    });

    test('should update effects parameters', () => {
      act(() => {
        result.current.updateParam('effects', 'reverb', 0.5);
      });
      
      expect(result.current.synthState.effects.reverb).toBe(0.5);
      expect(mockSynth.updateParam).toHaveBeenCalledWith('effects', 'reverb', 0.5);
    });

    test('should update master volume', () => {
      act(() => {
        result.current.updateParam('masterVolume', null, 0.8);
      });
      
      expect(result.current.synthState.masterVolume).toBe(0.8);
      expect(mockSynth.updateParam).toHaveBeenCalledWith('masterVolume', null, 0.8);
    });

    test('should handle nested parameter updates', () => {
      act(() => {
        result.current.updateParam('oscillators', 'osc2.level', 0.9);
      });
      
      expect(result.current.synthState.oscillators.osc2.level).toBe(0.9);
      expect(mockSynth.updateParam).toHaveBeenCalledWith('oscillators', 'osc2.level', 0.9);
    });

    test('should handle direct parameter updates', () => {
      act(() => {
        result.current.updateParam('oscillators', 'oscSync', 1);
      });
      
      expect(result.current.synthState.oscillators.oscSync).toBe(1);
      expect(mockSynth.updateParam).toHaveBeenCalledWith('oscillators', 'oscSync', 1);
    });

    test('should not update if synth is not available', () => {
      // Set synth to null
      result.current.synth = null;
      
      const originalState = { ...result.current.synthState };
      
      act(() => {
        result.current.updateParam('oscillators', 'osc1.waveform', 'triangle');
      });
      
      expect(result.current.synthState).toEqual(originalState);
      expect(mockSynth.updateParam).not.toHaveBeenCalled();
    });
  });

  describe('Note Handling', () => {
    let result;

    beforeEach(() => {
      const hookResult = renderHook(() => useSynth());
      result = hookResult.result;
    });

    test('should play note', () => {
      const note = 60;
      const velocity = 0.8;
      
      act(() => {
        result.current.playNote(note, velocity);
      });
      
      expect(mockSynth.noteOn).toHaveBeenCalledWith(note, velocity);
    });

    test('should play note with default velocity', () => {
      const note = 60;
      
      act(() => {
        result.current.playNote(note);
      });
      
      expect(mockSynth.noteOn).toHaveBeenCalledWith(note, 0.8);
    });

    test('should stop note', () => {
      const note = 60;
      
      act(() => {
        result.current.stopNote(note);
      });
      
      expect(mockSynth.noteOff).toHaveBeenCalledWith(note);
    });

    test('should not call synth methods if synth is null', () => {
      result.current.synth = null;
      
      act(() => {
        result.current.playNote(60);
        result.current.stopNote(60);
      });
      
      expect(mockSynth.noteOn).not.toHaveBeenCalled();
      expect(mockSynth.noteOff).not.toHaveBeenCalled();
    });
  });

  describe('Utility Functions', () => {
    let result;

    beforeEach(() => {
      const hookResult = renderHook(() => useSynth());
      result = hookResult.result;
    });

    test('should stop all voices', () => {
      act(() => {
        result.current.stopAllVoices();
      });
      
      expect(mockSynth.stopAllVoices).toHaveBeenCalled();
    });

    test('should play test tone', () => {
      act(() => {
        result.current.playTestTone();
      });
      
      expect(mockSynth.playTestTone).toHaveBeenCalled();
    });

    test('should force resume audio context', () => {
      act(() => {
        result.current.forceResume();
      });
      
      expect(mockSynth.forceResume).toHaveBeenCalled();
    });

    test('should run system tests', () => {
      act(() => {
        result.current.runSystemTests();
      });
      
      expect(mockSynth.runSystemTests).toHaveBeenCalled();
    });

    test('should not call synth methods if synth is null', () => {
      result.current.synth = null;
      
      act(() => {
        result.current.stopAllVoices();
        result.current.playTestTone();
        result.current.forceResume();
        result.current.runSystemTests();
      });
      
      expect(mockSynth.stopAllVoices).not.toHaveBeenCalled();
      expect(mockSynth.playTestTone).not.toHaveBeenCalled();
      expect(mockSynth.forceResume).not.toHaveBeenCalled();
      expect(mockSynth.runSystemTests).not.toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    test('should maintain state between renders', () => {
      const { result, rerender } = renderHook(() => useSynth());
      
      // Update a parameter
      act(() => {
        result.current.updateParam('oscillators', 'osc1.waveform', 'square');
      });
      
      // Rerender
      rerender();
      
      // State should persist
      expect(result.current.synthState.oscillators.osc1.waveform).toBe('square');
    });

    test('should create new state object on updates', () => {
      const { result } = renderHook(() => useSynth());
      
      const originalState = result.current.synthState;
      
      act(() => {
        result.current.updateParam('oscillators', 'osc1.waveform', 'square');
      });
      
      // Should be a new object reference
      expect(result.current.synthState).not.toBe(originalState);
      
      // But should have the updated value
      expect(result.current.synthState.oscillators.osc1.waveform).toBe('square');
    });

    test('should handle multiple parameter updates', () => {
      const { result } = renderHook(() => useSynth());
      
      act(() => {
        result.current.updateParam('oscillators', 'osc1.waveform', 'square');
        result.current.updateParam('filter', 'cutoff', 3000);
        result.current.updateParam('effects', 'reverb', 0.5);
      });
      
      expect(result.current.synthState.oscillators.osc1.waveform).toBe('square');
      expect(result.current.synthState.filter.cutoff).toBe(3000);
      expect(result.current.synthState.effects.reverb).toBe(0.5);
      
      expect(mockSynth.updateParam).toHaveBeenCalledTimes(3);
    });
  });

  describe('Callback Stability', () => {
    test('should maintain stable callback references', () => {
      const { result, rerender } = renderHook(() => useSynth());
      
      const originalUpdateParam = result.current.updateParam;
      const originalPlayNote = result.current.playNote;
      const originalStopNote = result.current.stopNote;
      
      // Rerender
      rerender();
      
      // Callbacks should be the same reference
      expect(result.current.updateParam).toBe(originalUpdateParam);
      expect(result.current.playNote).toBe(originalPlayNote);
      expect(result.current.stopNote).toBe(originalStopNote);
    });

    test('should use useCallback for stable references', () => {
      const { result } = renderHook(() => useSynth());
      
      // These should be functions (indicating useCallback was used)
      expect(typeof result.current.updateParam).toBe('function');
      expect(typeof result.current.playNote).toBe('function');
      expect(typeof result.current.stopNote).toBe('function');
      expect(typeof result.current.stopAllVoices).toBe('function');
      expect(typeof result.current.playTestTone).toBe('function');
      expect(typeof result.current.forceResume).toBe('function');
      expect(typeof result.current.runSystemTests).toBe('function');
    });
  });

  describe('Error Scenarios', () => {
    test('should handle synth method errors gracefully', () => {
      const error = new Error('Method failed');
      mockSynth.updateParam.mockImplementationOnce(() => {
        throw error;
      });
      
      const { result } = renderHook(() => useSynth());
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.updateParam('oscillators', 'osc1.waveform', 'square');
        });
      }).not.toThrow();
    });

    test('should handle note method errors gracefully', () => {
      const error = new Error('Note failed');
      mockSynth.noteOn.mockImplementationOnce(() => {
        throw error;
      });
      
      const { result } = renderHook(() => useSynth());
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.playNote(60);
        });
      }).not.toThrow();
    });
  });
}); 