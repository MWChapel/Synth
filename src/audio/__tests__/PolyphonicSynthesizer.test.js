import { PolyphonicSynthesizer } from '../PolyphonicSynthesizer';

describe('PolyphonicSynthesizer', () => {
  let synth;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset audio context state
    global.mockAudioContext.state = 'running';
    global.mockAudioContext.currentTime = 0;
  });

  describe('Constructor', () => {
    test('should initialize with default parameters', () => {
      synth = new PolyphonicSynthesizer();
      
      expect(synth.audioContext).toBeDefined();
      expect(synth.masterGain).toBeDefined();
      expect(synth.activeVoices).toBeInstanceOf(Map);
      expect(synth.voiceId).toBe(0);
      expect(synth.debugMode).toBe(true);
      
      // Check default parameters
      expect(synth.params.osc1.waveform).toBe('sawtooth');
      expect(synth.params.filterCutoff).toBe(2000);
      expect(synth.params.masterVolume).toBe(0.5);
    });

    test('should have correct oscillator parameters', () => {
      synth = new PolyphonicSynthesizer();
      
      expect(synth.params.osc1).toEqual({
        waveform: 'sawtooth',
        octave: 0,
        tune: 0,
        level: 0.8
      });
      
      expect(synth.params.osc2).toEqual({
        waveform: 'sawtooth',
        octave: 0,
        tune: 0,
        level: 0.6
      });
      
      expect(synth.params.osc3).toEqual({
        waveform: 'sawtooth',
        octave: 0,
        tune: 0,
        level: 0.4
      });
    });

    test('should have correct filter parameters', () => {
      synth = new PolyphonicSynthesizer();
      
      expect(synth.params.filterCutoff).toBe(2000);
      expect(synth.params.filterResonance).toBe(0);
      expect(synth.params.filterType).toBe('lowpass');
      expect(synth.params.filterSlope).toBe(24);
      expect(synth.params.filterEnvAmount).toBe(0.5);
    });
  });

  describe('Initialization', () => {
    test('should create audio context successfully', async () => {
      synth = new PolyphonicSynthesizer();
      
      expect(synth.audioContext).toBeDefined();
      expect(synth.audioContext.state).toBe('running');
    });

    test('should create master gain node', async () => {
      synth = new PolyphonicSynthesizer();
      
      expect(global.mockAudioContext.createGain).toHaveBeenCalled();
      expect(synth.masterGain).toBeDefined();
    });

    test('should create effects chain', async () => {
      synth = new PolyphonicSynthesizer();
      
      expect(global.mockAudioContext.createBiquadFilter).toHaveBeenCalled();
      expect(synth.filter).toBeDefined();
    });
  });

  describe('Parameter Updates', () => {
    beforeEach(() => {
      synth = new PolyphonicSynthesizer();
    });

    test('should update oscillator parameters', () => {
      synth.updateParam('oscillators', 'osc1.waveform', 'square');
      
      expect(synth.params.osc1.waveform).toBe('square');
    });

    test('should update filter parameters', () => {
      synth.updateParam('filter', 'cutoff', 3000);
      
      expect(synth.params.filterCutoff).toBe(3000);
    });

    test('should update envelope parameters', () => {
      synth.updateParam('envelopes', 'amplitude.attack', 0.2);
      
      expect(synth.params.attack).toBe(0.2);
    });

    test('should update LFO parameters', () => {
      synth.updateParam('lfo', 'rate', 2.0);
      
      expect(synth.params.lfoRate).toBe(2.0);
    });

    test('should update effects parameters', () => {
      synth.updateParam('effects', 'reverb', 0.5);
      
      expect(synth.params.reverb).toBe(0.5);
    });

    test('should update master volume', () => {
      synth.updateParam('masterVolume', null, 0.8);
      
      expect(synth.params.masterVolume).toBe(0.8);
    });

    test('should handle invalid parameter updates gracefully', () => {
      const originalParams = { ...synth.params };
      
      synth.updateParam('invalid', 'param', 'value');
      
      expect(synth.params).toEqual(originalParams);
    });
  });

  describe('Note Handling', () => {
    beforeEach(() => {
      synth = new PolyphonicSynthesizer();
    });

    test('should handle note on gracefully', () => {
      const note = 60; // Middle C
      const velocity = 0.8;
      
      expect(() => {
        synth.noteOn(note, velocity);
      }).not.toThrow();
    });

    test('should handle note off gracefully', () => {
      const note = 60;
      
      expect(() => {
        synth.noteOff(note);
      }).not.toThrow();
    });

    test('should handle multiple notes gracefully', () => {
      expect(() => {
        synth.noteOn(60); // C
        synth.noteOn(64); // E
        synth.noteOn(67); // G
      }).not.toThrow();
    });

    test('should resume audio context if suspended', () => {
      global.mockAudioContext.state = 'suspended';
      
      expect(() => {
        synth.noteOn(60);
      }).not.toThrow();
    });

    test('should handle note off for non-existent note gracefully', () => {
      expect(() => {
        synth.noteOff(999);
      }).not.toThrow();
    });
  });

  describe('Voice Creation', () => {
    beforeEach(() => {
      synth = new PolyphonicSynthesizer();
    });

    test('should handle voice creation gracefully', () => {
      const note = 60;
      const velocity = 0.8;
      
      expect(() => {
        const voice = synth.createVoice(note, velocity);
        expect(voice).toBeDefined();
        expect(voice.note).toBe(note);
        expect(voice.velocity).toBe(velocity);
      }).not.toThrow();
    });

    test('should handle oscillator creation gracefully', () => {
      const note = 69; // A4 (440 Hz)
      
      expect(() => {
        const voice = synth.createVoice(note, 0.8);
        expect(voice.oscillators).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Test Methods', () => {
    beforeEach(() => {
      synth = new PolyphonicSynthesizer();
    });

    test('should handle test tone gracefully', () => {
      expect(() => {
        synth.playTestTone();
      }).not.toThrow();
    });

    test('should handle force resume gracefully', () => {
      global.mockAudioContext.state = 'suspended';
      
      expect(() => {
        synth.forceResume();
      }).not.toThrow();
    });

    test('should handle system tests gracefully', () => {
      expect(() => {
        synth.runSystemTests();
      }).not.toThrow();
    });

    test('should handle audio context status test gracefully', () => {
      expect(() => {
        synth.testAudioContext();
      }).not.toThrow();
    });

    test('should handle basic oscillator test gracefully', () => {
      expect(() => {
        synth.testBasicOscillator();
      }).not.toThrow();
    });

    test('should handle master gain test gracefully', () => {
      expect(() => {
        synth.testMasterGain();
      }).not.toThrow();
    });

    test('should handle effects chain test gracefully', () => {
      expect(() => {
        synth.testEffectsChain();
      }).not.toThrow();
    });

    test('should handle browser compatibility test gracefully', () => {
      expect(() => {
        synth.testBrowserCompatibility();
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      synth = new PolyphonicSynthesizer();
    });

    test('should handle note creation errors gracefully', () => {
      // Mock oscillator creation to fail
      global.mockAudioContext.createOscillator.mockImplementationOnce(() => {
        throw new Error('Oscillator creation failed');
      });
      
      expect(() => {
        synth.noteOn(60);
      }).not.toThrow();
    });

    test('should handle parameter update errors gracefully', () => {
      expect(() => {
        synth.updateParam('filter', 'cutoff', 3000);
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    beforeEach(() => {
      synth = new PolyphonicSynthesizer();
    });

    test('should handle stop all voices gracefully', () => {
      expect(() => {
        synth.stopAllVoices();
      }).not.toThrow();
    });

    test('should handle voice cleanup gracefully', () => {
      const voice = synth.createVoice(60, 0.8);
      
      expect(() => {
        synth.stopVoice(voice);
      }).not.toThrow();
    });
  });

  describe('Audio Context Management', () => {
    test('should handle suspended audio context', () => {
      global.mockAudioContext.state = 'suspended';
      
      synth = new PolyphonicSynthesizer();
      
      expect(() => {
        synth.forceResume();
      }).not.toThrow();
    });

    test('should handle running audio context', () => {
      global.mockAudioContext.state = 'running';
      
      synth = new PolyphonicSynthesizer();
      
      expect(synth.audioContext.state).toBe('running');
    });
  });

  describe('Parameter Validation', () => {
    beforeEach(() => {
      synth = new PolyphonicSynthesizer();
    });

    test('should validate oscillator parameters', () => {
      expect(synth.params.osc1.waveform).toBe('sawtooth');
      expect(synth.params.osc1.octave).toBe(0);
      expect(synth.params.osc1.tune).toBe(0);
      expect(synth.params.osc1.level).toBe(0.8);
    });

    test('should validate filter parameters', () => {
      expect(synth.params.filterCutoff).toBe(2000);
      expect(synth.params.filterResonance).toBe(0);
      expect(synth.params.filterType).toBe('lowpass');
    });

    test('should validate envelope parameters', () => {
      expect(synth.params.attack).toBe(0.1);
      expect(synth.params.decay).toBe(0.1);
      expect(synth.params.sustain).toBe(0.7);
      expect(synth.params.release).toBe(0.3);
    });

    test('should validate LFO parameters', () => {
      expect(synth.params.lfoWaveform).toBe('sine');
      expect(synth.params.lfoRate).toBe(1);
      expect(synth.params.lfoAmount).toBe(0);
    });

    test('should validate effects parameters', () => {
      expect(synth.params.reverb).toBe(0.3);
      expect(synth.params.delay).toBe(0.2);
      expect(synth.params.distortion).toBe(0);
      expect(synth.params.chorus).toBe(0);
    });
  });
}); 