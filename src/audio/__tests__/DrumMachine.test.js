import { DrumMachine } from '../DrumMachine';

// Mock timers
jest.useFakeTimers();

describe('DrumMachine', () => {
  let drumMachine;
  let mockAudioContext;
  let mockMasterGain;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock objects
    mockAudioContext = {
      currentTime: 0,
      sampleRate: 44100,
      createGain: jest.fn(() => ({
        gain: {
          setValueAtTime: jest.fn(),
          value: 0.8
        },
        connect: jest.fn()
      })),
      createOscillator: jest.fn(() => ({
        frequency: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
          value: 440
        },
        type: 'sine',
        start: jest.fn(),
        stop: jest.fn(),
        connect: jest.fn()
      }))
    };
    
    mockMasterGain = {
      gain: {
        setValueAtTime: jest.fn(),
        value: 0.7
      },
      connect: jest.fn()
    };
    
    // Reset audio context
    mockAudioContext.currentTime = 0;
  });

  afterEach(() => {
    // Clear any intervals
    if (drumMachine && drumMachine.intervalId) {
      clearInterval(drumMachine.intervalId);
    }
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Constructor', () => {
    test('should initialize with default parameters', () => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
      
      expect(drumMachine.audioContext).toBe(mockAudioContext);
      expect(drumMachine.masterGain).toBe(mockMasterGain);
      expect(drumMachine.isPlaying).toBe(false);
      expect(drumMachine.currentStep).toBe(0);
      expect(drumMachine.intervalId).toBeNull();
      
      // Check default drum parameters
      expect(drumMachine.params.kick.volume).toBe(0.8);
      expect(drumMachine.params.snare.volume).toBe(0.7);
      expect(drumMachine.params.hihat.volume).toBe(0.6);
      expect(drumMachine.params.clap.volume).toBe(0.5);
      expect(drumMachine.params.tempo).toBe(120);
      expect(drumMachine.params.volume).toBe(0.7);
    });

    test('should initialize pattern sequencer', () => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
      
      expect(drumMachine.pattern).toHaveLength(16);
      expect(drumMachine.pattern.every(step => step === false)).toBe(true);
    });

    test('should create drum gain nodes', () => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
      
      expect(mockAudioContext.createGain).toHaveBeenCalledTimes(4);
      expect(drumMachine.kickGain).toBeDefined();
      expect(drumMachine.snareGain).toBeDefined();
      expect(drumMachine.hihatGain).toBeDefined();
      expect(drumMachine.clapGain).toBeDefined();
    });

    test('should connect drum gain nodes to master gain', () => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
      
      expect(drumMachine.kickGain.connect).toHaveBeenCalledWith(mockMasterGain);
      expect(drumMachine.snareGain.connect).toHaveBeenCalledWith(mockMasterGain);
      expect(drumMachine.hihatGain.connect).toHaveBeenCalledWith(mockMasterGain);
      expect(drumMachine.clapGain.connect).toHaveBeenCalledWith(mockMasterGain);
    });
  });

  describe('Parameter Updates', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should update kick parameters', () => {
      drumMachine.updateParam('kick', 'volume', 0.9);
      
      expect(drumMachine.params.kick.volume).toBe(0.9);
    });

    test('should update snare parameters', () => {
      drumMachine.updateParam('snare', 'pitch', 300);
      
      expect(drumMachine.params.snare.pitch).toBe(300);
    });

    test('should update hi-hat parameters', () => {
      drumMachine.updateParam('hihat', 'decay', 0.2);
      
      expect(drumMachine.params.hihat.decay).toBe(0.2);
    });

    test('should update clap parameters', () => {
      drumMachine.updateParam('clap', 'volume', 0.6);
      
      expect(drumMachine.params.clap.volume).toBe(0.6);
    });

    test('should update tempo', () => {
      drumMachine.updateParam('tempo', null, 140);
      
      expect(drumMachine.params.tempo).toBe(140);
    });

    test('should update master volume', () => {
      drumMachine.updateParam('volume', null, 0.8);
      
      expect(drumMachine.params.volume).toBe(0.8);
    });

    test('should handle invalid parameter updates gracefully', () => {
      const originalParams = { ...drumMachine.params };
      
      drumMachine.updateParam('invalid', 'param', 'value');
      
      expect(drumMachine.params).toEqual(originalParams);
    });
  });

  describe('Pattern Management', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should update pattern', () => {
      const newPattern = Array(16).fill(true);
      
      drumMachine.updatePattern(newPattern);
      
      expect(drumMachine.pattern).toBe(newPattern);
      expect(drumMachine.pattern.every(step => step === true)).toBe(true);
    });

    test('should handle pattern updates', () => {
      const newPattern = Array(16).fill(false);
      newPattern[0] = true;
      newPattern[8] = true;
      
      drumMachine.updatePattern(newPattern);
      
      expect(drumMachine.pattern[0]).toBe(true);
      expect(drumMachine.pattern[8]).toBe(true);
      expect(drumMachine.pattern[1]).toBe(false);
    });
  });

  describe('Sequencer Control', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should start sequencer', () => {
      drumMachine.start();
      
      expect(drumMachine.isPlaying).toBe(true);
      expect(drumMachine.currentStep).toBe(0);
      expect(drumMachine.intervalId).toBeDefined();
    });

    test('should not start if already playing', () => {
      drumMachine.start();
      const firstIntervalId = drumMachine.intervalId;
      
      drumMachine.start();
      
      expect(drumMachine.intervalId).toBe(firstIntervalId);
    });

    test('should stop sequencer', () => {
      drumMachine.start();
      expect(drumMachine.isPlaying).toBe(true);
      
      drumMachine.stop();
      
      expect(drumMachine.isPlaying).toBe(false);
      expect(drumMachine.intervalId).toBeNull();
    });

    test('should not stop if not playing', () => {
      drumMachine.stop();
      
      expect(drumMachine.isPlaying).toBe(false);
      expect(drumMachine.intervalId).toBeNull();
    });

    test('should advance steps correctly', () => {
      drumMachine.start();
      
      // Fast-forward time to trigger step advancement
      jest.advanceTimersByTime(125); // 60 BPM = 125ms per 16th note
      
      expect(drumMachine.currentStep).toBe(1);
    });

    test('should loop back to step 0 after step 15', () => {
      drumMachine.start();
      drumMachine.currentStep = 15;
      
      // Fast-forward time to trigger step advancement
      jest.advanceTimersByTime(125);
      
      expect(drumMachine.currentStep).toBe(0);
    });
  });

  describe('Drum Sound Generation', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should handle kick drum creation gracefully', () => {
      expect(() => {
        drumMachine.playKick(0);
      }).not.toThrow();
    });

    test('should handle snare drum creation gracefully', () => {
      expect(() => {
        drumMachine.playSnare(0);
      }).not.toThrow();
    });

    test('should handle hi-hat creation gracefully', () => {
      expect(() => {
        drumMachine.playHiHat(0);
      }).not.toThrow();
    });

    test('should handle clap creation gracefully', () => {
      expect(() => {
        drumMachine.playClap(0);
      }).not.toThrow();
    });

    test('should handle drum sound creation errors gracefully', () => {
      // Mock oscillator creation to fail
      mockAudioContext.createOscillator.mockImplementationOnce(() => {
        throw new Error('Oscillator creation failed');
      });
      
      expect(() => {
        drumMachine.playKick(0);
      }).not.toThrow();
    });
  });

  describe('Step Playback', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
      
      // Set up pattern to trigger sounds
      drumMachine.pattern[0] = true;
      drumMachine.pattern[4] = true;
      drumMachine.pattern[8] = true;
      drumMachine.pattern[12] = true;
    });

    test('should handle step playback gracefully', () => {
      expect(() => {
        drumMachine.playStep();
      }).not.toThrow();
    });

    test('should not play step when pattern is inactive', () => {
      drumMachine.pattern[0] = false;
      
      expect(() => {
        drumMachine.playStep();
      }).not.toThrow();
    });
  });

  describe('Test Methods', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should handle test kick sound gracefully', () => {
      expect(() => {
        drumMachine.playTestSound('kick');
      }).not.toThrow();
    });

    test('should handle test snare sound gracefully', () => {
      expect(() => {
        drumMachine.playTestSound('snare');
      }).not.toThrow();
    });

    test('should handle test hi-hat sound gracefully', () => {
      expect(() => {
        drumMachine.playTestSound('hihat');
      }).not.toThrow();
    });

    test('should handle test clap sound gracefully', () => {
      expect(() => {
        drumMachine.playTestSound('clap');
      }).not.toThrow();
    });

    test('should handle unknown drum type gracefully', () => {
      expect(() => {
        drumMachine.playTestSound('unknown');
      }).not.toThrow();
    });
  });

  describe('Timing and Performance', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should calculate correct step timing', () => {
      // 120 BPM = 0.5 seconds per beat = 125ms per 16th note
      drumMachine.params.tempo = 120;
      
      drumMachine.start();
      
      // Fast-forward by one step duration
      jest.advanceTimersByTime(125);
      
      expect(drumMachine.currentStep).toBe(1);
    });

    test('should handle different tempos correctly', () => {
      // 180 BPM = 0.333 seconds per beat = 83.33ms per 16th note
      drumMachine.params.tempo = 180;
      
      drumMachine.start();
      
      // Fast-forward by one step duration
      jest.advanceTimersByTime(84);
      
      expect(drumMachine.currentStep).toBe(1);
    });

    test('should maintain consistent timing', () => {
      drumMachine.start();
      
      // Fast-forward by multiple steps
      jest.advanceTimersByTime(500); // 4 steps at 120 BPM
      
      expect(drumMachine.currentStep).toBe(4);
    });
  });

  describe('Cleanup and Resource Management', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should clear interval on stop', () => {
      drumMachine.start();
      expect(drumMachine.intervalId).toBeDefined();
      
      drumMachine.stop();
      expect(drumMachine.intervalId).toBeNull();
    });

    test('should handle multiple start/stop cycles', () => {
      for (let i = 0; i < 5; i++) {
        drumMachine.start();
        expect(drumMachine.isPlaying).toBe(true);
        
        drumMachine.stop();
        expect(drumMachine.isPlaying).toBe(false);
      }
    });

    test('should reset current step on start', () => {
      drumMachine.currentStep = 10;
      
      drumMachine.start();
      
      expect(drumMachine.currentStep).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle audio context errors gracefully', () => {
      // Mock createGain to fail
      mockAudioContext.createGain.mockImplementationOnce(() => {
        throw new Error('Gain creation failed');
      });
      
      expect(() => {
        new DrumMachine(mockAudioContext, mockMasterGain);
      }).not.toThrow();
    });

    test('should handle parameter update errors gracefully', () => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
      
      expect(() => {
        drumMachine.updateParam('kick', 'volume', 0.9);
      }).not.toThrow();
    });
  });

  describe('Parameter Validation', () => {
    beforeEach(() => {
      drumMachine = new DrumMachine(mockAudioContext, mockMasterGain);
    });

    test('should validate kick parameters', () => {
      expect(drumMachine.params.kick.volume).toBe(0.8);
      expect(drumMachine.params.kick.pitch).toBe(60);
      expect(drumMachine.params.kick.decay).toBe(0.3);
    });

    test('should validate snare parameters', () => {
      expect(drumMachine.params.snare.volume).toBe(0.7);
      expect(drumMachine.params.snare.pitch).toBe(200);
      expect(drumMachine.params.snare.decay).toBe(0.2);
    });

    test('should validate hi-hat parameters', () => {
      expect(drumMachine.params.hihat.volume).toBe(0.6);
      expect(drumMachine.params.hihat.pitch).toBe(800);
      expect(drumMachine.params.hihat.decay).toBe(0.1);
    });

    test('should validate clap parameters', () => {
      expect(drumMachine.params.clap.volume).toBe(0.5);
      expect(drumMachine.params.clap.pitch).toBe(400);
      expect(drumMachine.params.clap.decay).toBe(0.15);
    });

    test('should validate tempo and volume', () => {
      expect(drumMachine.params.tempo).toBe(120);
      expect(drumMachine.params.volume).toBe(0.7);
    });
  });
}); 