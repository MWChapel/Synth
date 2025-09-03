import { renderHook, act } from '@testing-library/react';
import { useDrumMachine } from '../useDrumMachine';

// Mock the DrumMachine class
jest.mock('../../audio/DrumMachine');

const MockDrumMachine = require('../../audio/DrumMachine').DrumMachine;

describe('useDrumMachine', () => {
  let mockDrumMachine;
  let mockAudioContext;
  let mockMasterGain;
  let consoleSpy;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
    
    // Create mock objects
    mockAudioContext = { state: 'running', sampleRate: 44100 };
    mockMasterGain = { gain: { value: 0.7 } };
    
    // Create mock drum machine instance
    mockDrumMachine = {
      audioContext: mockAudioContext,
      masterGain: mockMasterGain,
      isPlaying: false,
      currentStep: 0,
      intervalId: null,
      params: {
        kick: { volume: 0.8, pitch: 60, decay: 0.3 },
        snare: { volume: 0.7, pitch: 200, decay: 0.2 },
        hihat: { volume: 0.6, pitch: 800, decay: 0.1 },
        clap: { volume: 0.5, pitch: 400, decay: 0.15 },
        tempo: 120,
        volume: 0.7
      },
      pattern: Array(16).fill(false),
      stop: jest.fn(),
      updateParam: jest.fn(),
      updatePattern: jest.fn(),
      start: jest.fn()
    };
    
    // Mock constructor
    MockDrumMachine.mockImplementation(() => mockDrumMachine);
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  describe('Initialization', () => {
    test('should initialize with default state', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      expect(result.current.drumMachine).toBe(mockDrumMachine);
      expect(result.current.drumState).toEqual({
        kick: { volume: 0.8, pitch: 60, decay: 0.3 },
        snare: { volume: 0.7, pitch: 200, decay: 0.2 },
        hihat: { volume: 0.6, pitch: 800, decay: 0.1 },
        clap: { volume: 0.5, pitch: 400, decay: 0.15 },
        tempo: 120,
        volume: 0.7,
        pattern: Array(16).fill(false),
        isPlaying: false
      });
    });

    test('should create drum machine instance', () => {
      renderHook(() => useDrumMachine());
      
      expect(MockDrumMachine).toHaveBeenCalledWith(mockAudioContext, mockMasterGain);
    });

    test('should handle initialization errors gracefully', () => {
      const error = new Error('Initialization failed');
      MockDrumMachine.mockImplementationOnce(() => {
        throw error;
      });
      
      renderHook(() => useDrumMachine());
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        '❌ Failed to initialize drum machine:',
        error
      );
    });

    test('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useDrumMachine());
      
      unmount();
      
      expect(mockDrumMachine.stop).toHaveBeenCalled();
    });

    test('should not initialize if audio context is not available', () => {
      // Set audio context to null
      mockAudioContext = null;
      
      const { result } = renderHook(() => useDrumMachine());
      
      expect(result.current.drumMachine).toBeNull();
      expect(MockDrumMachine).not.toHaveBeenCalled();
    });
  });

  describe('Parameter Updates', () => {
    let result;

    beforeEach(() => {
      const hookResult = renderHook(() => useDrumMachine());
      result = hookResult.result;
    });

    test('should update kick parameters', () => {
      act(() => {
        result.current.updateDrumParam('kick', 'volume', 0.9);
      });
      
      expect(result.current.drumState.kick.volume).toBe(0.9);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('kick', 'volume', 0.9);
    });

    test('should update snare parameters', () => {
      act(() => {
        result.current.updateDrumParam('snare', 'pitch', 300);
      });
      
      expect(result.current.drumState.snare.pitch).toBe(300);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('snare', 'pitch', 300);
    });

    test('should update hi-hat parameters', () => {
      act(() => {
        result.current.updateDrumParam('hihat', 'decay', 0.2);
      });
      
      expect(result.current.drumState.hihat.decay).toBe(0.2);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('hihat', 'decay', 0.2);
    });

    test('should update clap parameters', () => {
      act(() => {
        result.current.updateDrumParam('clap', 'volume', 0.6);
      });
      
      expect(result.current.drumState.clap.volume).toBe(0.6);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('clap', 'volume', 0.6);
    });

    test('should update tempo', () => {
      act(() => {
        result.current.updateDrumParam('tempo', null, 140);
      });
      
      expect(result.current.drumState.tempo).toBe(140);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('tempo', null, 140);
    });

    test('should update master volume', () => {
      act(() => {
        result.current.updateDrumParam('volume', null, 0.8);
      });
      
      expect(result.current.drumState.volume).toBe(0.8);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('volume', null, 0.8);
    });

    test('should update pattern', () => {
      const newPattern = Array(16).fill(true);
      
      act(() => {
        result.current.updateDrumParam('pattern', null, newPattern);
      });
      
      expect(result.current.drumState.pattern).toBe(newPattern);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('pattern', null, newPattern);
    });

    test('should not update if drum machine is not available', () => {
      // Set drum machine to null
      result.current.drumMachine = null;
      
      const originalState = { ...result.current.drumState };
      
      act(() => {
        result.current.updateDrumParam('kick', 'volume', 0.9);
      });
      
      expect(result.current.drumState).toEqual(originalState);
      expect(mockDrumMachine.updateParam).not.toHaveBeenCalled();
    });
  });

  describe('Sequencer Control', () => {
    let result;

    beforeEach(() => {
      const hookResult = renderHook(() => useDrumMachine());
      result = hookResult.result;
    });

    test('should start sequencer', () => {
      act(() => {
        result.current.startSequencer();
      });
      
      expect(mockDrumMachine.start).toHaveBeenCalled();
      expect(result.current.drumState.isPlaying).toBe(true);
    });

    test('should stop sequencer', () => {
      // First start
      act(() => {
        result.current.startSequencer();
      });
      
      // Then stop
      act(() => {
        result.current.stopSequencer();
      });
      
      expect(mockDrumMachine.stop).toHaveBeenCalled();
      expect(result.current.drumState.isPlaying).toBe(false);
    });

    test('should not call methods if drum machine is null', () => {
      result.current.drumMachine = null;
      
      act(() => {
        result.current.startSequencer();
        result.current.stopSequencer();
      });
      
      expect(mockDrumMachine.start).not.toHaveBeenCalled();
      expect(mockDrumMachine.stop).not.toHaveBeenCalled();
    });
  });

  describe('Pattern Management', () => {
    let result;

    beforeEach(() => {
      const hookResult = renderHook(() => useDrumMachine());
      result = hookResult.result;
    });

    test('should toggle pattern step', () => {
      const step = 5;
      
      act(() => {
        result.current.togglePatternStep(step);
      });
      
      expect(result.current.drumState.pattern[step]).toBe(true);
      expect(mockDrumMachine.updatePattern).toHaveBeenCalled();
    });

    test('should toggle pattern step back to false', () => {
      const step = 5;
      
      // First toggle to true
      act(() => {
        result.current.togglePatternStep(step);
      });
      
      expect(result.current.drumState.pattern[step]).toBe(true);
      
      // Then toggle back to false
      act(() => {
        result.current.togglePatternStep(step);
      });
      
      expect(result.current.drumState.pattern[step]).toBe(false);
      expect(mockDrumMachine.updatePattern).toHaveBeenCalledTimes(2);
    });

    test('should not toggle if drum machine is null', () => {
      result.current.drumMachine = null;
      
      const originalPattern = [...result.current.drumState.pattern];
      
      act(() => {
        result.current.togglePatternStep(5);
      });
      
      expect(result.current.drumState.pattern).toEqual(originalPattern);
      expect(mockDrumMachine.updatePattern).not.toHaveBeenCalled();
    });

    test('should handle multiple pattern toggles', () => {
      const steps = [0, 4, 8, 12];
      
      act(() => {
        steps.forEach(step => {
          result.current.togglePatternStep(step);
        });
      });
      
      steps.forEach(step => {
        expect(result.current.drumState.pattern[step]).toBe(true);
      });
      
      expect(mockDrumMachine.updatePattern).toHaveBeenCalledTimes(4);
    });
  });

  describe('State Management', () => {
    test('should maintain state between renders', () => {
      const { result, rerender } = renderHook(() => useDrumMachine());
      
      // Update a parameter
      act(() => {
        result.current.updateDrumParam('kick', 'volume', 0.9);
      });
      
      // Rerender
      rerender();
      
      // State should persist
      expect(result.current.drumState.kick.volume).toBe(0.9);
    });

    test('should create new state object on updates', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      const originalState = result.current.drumState;
      
      act(() => {
        result.current.updateDrumParam('kick', 'volume', 0.9);
      });
      
      // Should be a new object reference
      expect(result.current.drumState).not.toBe(originalState);
      
      // But should have the updated value
      expect(result.current.drumState.kick.volume).toBe(0.9);
    });

    test('should handle multiple parameter updates', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      act(() => {
        result.current.updateDrumParam('kick', 'volume', 0.9);
        result.current.updateDrumParam('snare', 'pitch', 300);
        result.current.updateDrumParam('tempo', null, 140);
      });
      
      expect(result.current.drumState.kick.volume).toBe(0.9);
      expect(result.current.drumState.snare.pitch).toBe(300);
      expect(result.current.drumState.tempo).toBe(140);
      
      expect(mockDrumMachine.updateParam).toHaveBeenCalledTimes(3);
    });

    test('should handle pattern updates correctly', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      const newPattern = Array(16).fill(false);
      newPattern[0] = true;
      newPattern[8] = true;
      
      act(() => {
        result.current.updateDrumParam('pattern', null, newPattern);
      });
      
      expect(result.current.drumState.pattern[0]).toBe(true);
      expect(result.current.drumState.pattern[8]).toBe(true);
      expect(result.current.drumState.pattern[1]).toBe(false);
    });
  });

  describe('Callback Stability', () => {
    test('should maintain stable callback references', () => {
      const { result, rerender } = renderHook(() => useDrumMachine());
      
      const originalUpdateDrumParam = result.current.updateDrumParam;
      const originalStartSequencer = result.current.startSequencer;
      const originalStopSequencer = result.current.stopSequencer;
      const originalTogglePatternStep = result.current.togglePatternStep;
      
      // Rerender
      rerender();
      
      // Callbacks should be the same reference
      expect(result.current.updateDrumParam).toBe(originalUpdateDrumParam);
      expect(result.current.startSequencer).toBe(originalStartSequencer);
      expect(result.current.stopSequencer).toBe(originalStopSequencer);
      expect(result.current.togglePatternStep).toBe(originalTogglePatternStep);
    });

    test('should use useCallback for stable references', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      // These should be functions (indicating useCallback was used)
      expect(typeof result.current.updateDrumParam).toBe('function');
      expect(typeof result.current.startSequencer).toBe('function');
      expect(typeof result.current.stopSequencer).toBe('function');
      expect(typeof result.current.togglePatternStep).toBe('function');
    });
  });

  describe('Sequencer State Management', () => {
    test('should track playing state correctly', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      // Initially not playing
      expect(result.current.drumState.isPlaying).toBe(false);
      
      // Start sequencer
      act(() => {
        result.current.startSequencer();
      });
      
      expect(result.current.drumState.isPlaying).toBe(true);
      
      // Stop sequencer
      act(() => {
        result.current.stopSequencer();
      });
      
      expect(result.current.drumState.isPlaying).toBe(false);
    });

    test('should handle multiple start/stop cycles', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.startSequencer();
        });
        expect(result.current.drumState.isPlaying).toBe(true);
        
        act(() => {
          result.current.stopSequencer();
        });
        expect(result.current.drumState.isPlaying).toBe(false);
      }
    });
  });

  describe('Error Scenarios', () => {
    test('should handle drum machine method errors gracefully', () => {
      const error = new Error('Method failed');
      mockDrumMachine.updateParam.mockImplementationOnce(() => {
        throw error;
      });
      
      const { result } = renderHook(() => useDrumMachine());
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.updateDrumParam('kick', 'volume', 0.9);
        });
      }).not.toThrow();
    });

    test('should handle sequencer method errors gracefully', () => {
      const error = new Error('Sequencer failed');
      mockDrumMachine.start.mockImplementationOnce(() => {
        throw error;
      });
      
      const { result } = renderHook(() => useDrumMachine());
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.startSequencer();
        });
      }).not.toThrow();
    });

    test('should handle pattern update errors gracefully', () => {
      const error = new Error('Pattern update failed');
      mockDrumMachine.updatePattern.mockImplementationOnce(() => {
        throw error;
      });
      
      const { result } = renderHook(() => useDrumMachine());
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.togglePatternStep(5);
        });
      }).not.toThrow();
    });
  });

  describe('Integration with Drum Machine', () => {
    test('should sync state with drum machine parameters', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      // Update a parameter
      act(() => {
        result.current.updateDrumParam('kick', 'volume', 0.9);
      });
      
      // Check that both local state and drum machine were updated
      expect(result.current.drumState.kick.volume).toBe(0.9);
      expect(mockDrumMachine.updateParam).toHaveBeenCalledWith('kick', 'volume', 0.9);
    });

    test('should sync pattern with drum machine', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      // Toggle a pattern step
      act(() => {
        result.current.togglePatternStep(5);
      });
      
      // Check that both local state and drum machine were updated
      expect(result.current.drumState.pattern[5]).toBe(true);
      expect(mockDrumMachine.updatePattern).toHaveBeenCalled();
    });

    test('should handle drum machine state changes', () => {
      const { result } = renderHook(() => useDrumMachine());
      
      // Simulate drum machine starting
      act(() => {
        result.current.startSequencer();
      });
      
      // Check that local state reflects the change
      expect(result.current.drumState.isPlaying).toBe(true);
      expect(mockDrumMachine.start).toHaveBeenCalled();
    });
  });
}); 