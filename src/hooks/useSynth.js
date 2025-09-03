import { useState, useEffect, useCallback, useRef } from 'react';
import { PolyphonicSynthesizer } from '../audio/PolyphonicSynthesizer';
import { MINI_MOOG_PRESETS } from '../data/miniMoogPresets';

export function useSynth() {
  const [synth, setSynth] = useState(null);
  const [synthState, setSynthState] = useState({
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.8 },
      osc2: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.6 },
      osc3: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.4 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0
    },
    filter: {
      cutoff: 0.7,
      resonance: 0.3,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.5,
      lfoAmount: 0,
      keyboardTracking: 0.3
    },
    envelopes: {
      amplitude: { attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.3 },
      filter: { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.3 }
    },
    lfo: {
      waveform: 'sine',
      rate: 1,
      amount: 0.3,
      delay: 0,
      toPitch: 0,
      toFilter: 0.5,
      toAmp: 0
    },
    effects: {
      reverb: { enabled: false, roomSize: 0.5, damping: 0.5, wet: 0.3, dry: 0.7 },
      delay: { enabled: false, time: 0.3, feedback: 0.3, wet: 0.3, dry: 0.7 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0.3, dry: 0.7 },
      chorus: { enabled: false, rate: 1.5, depth: 0.002, wet: 0.3, dry: 0.7 }
    },
    masterVolume: 0.7
  });

  const synthRef = useRef(null);

  // Initialize synthesizer
  useEffect(() => {
    const initSynth = async () => {
      try {

        const newSynth = new PolyphonicSynthesizer();
        synthRef.current = newSynth;
        setSynth(newSynth);

      } catch (error) {

      }
    };

    initSynth();

    return () => {
      if (synthRef.current) {
        synthRef.current.stopAllVoices();
        synthRef.current = null;
      }
    };
  }, []);

  // Load initial state to synth when it's created
  useEffect(() => {
    if (synthRef.current) {

      
      // Load initial LFO state
      synthRef.current.updateParam('lfo', 'amount', 0.3);
      synthRef.current.updateParam('lfo', 'rate', 1);
      synthRef.current.updateParam('lfo', 'waveform', 'sine');
      synthRef.current.updateParam('lfo', 'toFilter', 0.5);
      

    }
  }, [synth]);

  // Update parameter
  const updateParam = (section, param, value) => {
    ('🔧 useSynth: updateParam called with', { section, param, value });
    
    if (!synthRef.current) {
      ('❌ useSynth: synthRef.current is null, cannot update');
      return;
    }

    setSynthState(prev => {
      ('🔧 useSynth: Previous state:', prev);
      const newState = { ...prev };
      
      if (section === 'oscillators') {
        if (param.includes('.')) {
          const [osc, prop] = param.split('.');
          newState.oscillators[osc] = { ...newState.oscillators[osc], [prop]: value };
          ('🔧 useSynth: Updated oscillators', osc, prop, 'to', value);
        } else {
          newState.oscillators[param] = value;
          ('🔧 useSynth: Updated oscillators', param, 'to', value);
        }
      } else if (section === 'filter') {
        newState.filter[param] = value;
        ('🔧 useSynth: Updated filter', param, 'to', value);
      } else if (section === 'envelopes') {
        if (param.includes('.')) {
          const [env, prop] = param.split('.');
          newState.envelopes[env] = { ...newState.envelopes[env], [prop]: value };
          ('🔧 useSynth: Updated envelopes', env, prop, 'to', value);
        } else {
          newState.envelopes[param] = value;
          ('🔧 useSynth: Updated envelopes', param, 'to', value);
        }
      } else if (section === 'lfo') {
        newState.lfo[param] = value;
        ('🔧 useSynth: Updated LFO', param, 'to', value);
      } else if (section === 'effects') {
        if (param.includes('.')) {
          const [effect, prop] = param.split('.');
          if (!newState.effects[effect]) {
            newState.effects[effect] = {};
          }
          newState.effects[effect] = { ...newState.effects[effect], [prop]: value };
          ('🔧 useSynth: Updated effects', effect, prop, 'to', value);
        } else {
          newState.effects[param] = value;
          ('🔧 useSynth: Updated effects', param, 'to', value);
        }
      } else if (section === 'masterVolume') {
        newState.masterVolume = value;
        ('🔧 useSynth: Updated master volume to', value);
      }

      ('🔧 useSynth: New state:', newState);
      
      // Update the actual synth parameters
      synthRef.current.updateParam(section, param, value);
      
      return newState;
    });
  };

  // Play note
  const playNote = useCallback((note, velocity = 0.8) => {
    ('🎵 useSynth: playNote called with', { note, velocity });
    ('🎵 synthRef.current:', synthRef.current);
    ('🎵 audioContext state:', synthRef.current?.audioContext?.state);
    
    if (synthRef.current) {
      ('🎵 Calling synth.noteOn...');
      synthRef.current.noteOn(note, velocity);
    } else {
      ('❌ synthRef.current is null!');
    }
  }, []);

  // Stop note
  const stopNote = useCallback((note) => {
    ('🔇 useSynth: stopNote called with', { note });
    ('🔇 synthRef.current:', synthRef.current);
    
    if (synthRef.current) {
      ('🔇 Calling synth.noteOff...');
      synthRef.current.noteOff(note);
    } else {
      ('❌ synthRef.current is null!');
    }
  }, []);

  // Stop all voices
  const stopAllVoices = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.stopAllVoices();
    }
  }, []);

  // Load preset
  const loadPreset = useCallback((presetKey) => {
    if (!synthRef.current) return;
    
    const preset = MINI_MOOG_PRESETS[presetKey];
    if (!preset) return;
    
    (`🎹 Loading preset: ${preset.name} - ${preset.description}`);
    
    // Update all parameters at once
    setSynthState(preset);
    
    // Apply preset to synthesizer
    try {
      // Update oscillators
      Object.entries(preset.oscillators).forEach(([param, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([prop, propValue]) => {
            synthRef.current.updateParam('oscillators', `${param}.${prop}`, propValue);
          });
        } else {
          synthRef.current.updateParam('oscillators', param, value);
        }
      });
      
      // Update filter
      Object.entries(preset.filter).forEach(([param, value]) => {
        synthRef.current.updateParam('filter', param, value);
        });
      
      // Update envelopes
      Object.entries(preset.envelopes).forEach(([env, params]) => {
        Object.entries(params).forEach(([param, value]) => {
          synthRef.current.updateParam('envelopes', `${env}.${param}`, value);
        });
      });
      
      // Update LFO
      Object.entries(preset.lfo).forEach(([param, value]) => {
        synthRef.current.updateParam('lfo', param, value);
      });
      
      // Update effects
      Object.entries(preset.effects).forEach(([effect, params]) => {
        if (typeof params === 'object') {
          Object.entries(params).forEach(([param, value]) => {
            synthRef.current.updateParam('effects', `${effect}.${param}`, value);
          });
        } else {
          // Handle legacy simple effect values
          synthRef.current.updateParam('effects', effect, params);
        }
      });
      
      // Update master volume
      synthRef.current.updateParam('masterVolume', 'masterVolume', preset.masterVolume);
      
      (`✅ Preset "${preset.name}" loaded successfully!`);
    } catch (error) {
      ('❌ Error loading preset:', error);
    }
  }, []);

  // Play simple test tone
  const playSimpleTestTone = useCallback(() => {
    if (synthRef.current) {
      ('🧪 useSynth: Calling playSimpleTestTone');
      synthRef.current.playSimpleTestTone();
    } else {
      ('❌ synthRef.current is null for test tone');
    }
  }, []);

  // Update synthState with voice count
  const updateSynthState = useCallback(() => {
      if (synthRef.current) {
          setSynthState(prev => ({
              ...prev,
              voiceCount: synthRef.current.getVoiceCount(),
              activeNotes: synthRef.current.getActiveNotes()
          }));
      }
  }, []);

  // Update state when voices change
  useEffect(() => {
      const interval = setInterval(updateSynthState, 100); // Update every 100ms
      return () => clearInterval(interval);
  }, [updateSynthState]);

  return {
    synth,
    synthState,
    updateParam,
    playNote,
    stopNote,
    stopAllVoices,
    loadPreset,
    playSimpleTestTone
  };
} 