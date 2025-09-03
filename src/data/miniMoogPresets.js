// Mini Moog Classic Presets
// Based on authentic Mini Moog synthesizer sounds and popular presets

export const MINI_MOOG_PRESETS = {
  default: {
    name: 'Default',
    description: 'Classic Mini Moog starting point',
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
      amount: 0,
      delay: 0,
      toPitch: 0,
      toFilter: 0,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.5, damping: 0.5, wet: 0.3, dry: 0.7 },
      delay: { enabled: false, time: 0.3, feedback: 0.3, wet: 0.2, dry: 0.8 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: false, rate: 1.5, depth: 0.002, wet: 0, dry: 1 }
    },
    masterVolume: 0.6,
  },

  fat_lead: {
    name: 'Fat Lead',
    description: 'Thick, creamy lead sound with stacked oscillators',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'sawtooth', octave: 0, tune: 7, level: 0.8 },
      osc3: { waveform: 'square', octave: -1, tune: 0, level: 0.6 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0
    },
    filter: {
      cutoff: 0.75,
      resonance: 0.3,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.8,
      lfoAmount: 0.2,
      keyboardTracking: 0.5
    },
    envelopes: {
      amplitude: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.4 },
      filter: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.5 }
    },
    lfo: {
      waveform: 'triangle',
      rate: 0.8,
      amount: 0.1,
      delay: 0.1,
      toPitch: 0.05,
      toFilter: 0.1,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.6, damping: 0.4, wet: 0.2, dry: 0.8 },
      delay: { enabled: true, time: 0.2, feedback: 0.2, wet: 0.1, dry: 0.9 },
      distortion: { enabled: true, amount: 0.1, oversample: 2, wet: 0.1, dry: 0.9 },
      chorus: { enabled: true, rate: 1.2, depth: 0.003, wet: 0.2, dry: 0.8 }
    },
    masterVolume: 0.6,
  },

  bass: {
    name: 'Bass',
    description: 'Deep, punchy bass with tight envelope',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: -1, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: -1, tune: 0, level: 0.7 },
      osc3: { waveform: 'triangle', octave: -2, tune: 0, level: 0.5 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0.1
    },
    filter: {
      cutoff: 0.40,
      resonance: 0.4,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0,
      keyboardTracking: 0.7
    },
    envelopes: {
      amplitude: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.2 },
      filter: { attack: 0.01, decay: 0.15, sustain: 0.8, release: 0.3 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.5,
      amount: 0,
      delay: 0,
      toPitch: 0,
      toFilter: 0,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.3, damping: 0.7, wet: 0.1, dry: 0.9 },
      delay: { enabled: false, time: 0.2, feedback: 0.1, wet: 0, dry: 1 },
      distortion: { enabled: true, amount: 0.2, oversample: 2, wet: 0.2, dry: 0.8 },
      chorus: { enabled: false, rate: 1.0, depth: 0.001, wet: 0, dry: 1 }
    },
    masterVolume: 0.6,
  },

  pad: {
    name: 'Pad',
    description: 'Warm, atmospheric pad with slow envelopes',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.8 },
      osc2: { waveform: 'sine', octave: 0, tune: 7, level: 0.6 },
      osc3: { waveform: 'triangle', octave: -1, tune: 0, level: 0.4 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0
    },
    filter: {
      cutoff: 0.60,
      resonance: 0.2,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.6,
      lfoAmount: 0.3,
      keyboardTracking: 0.4
    },
    envelopes: {
      amplitude: { attack: 0.8, decay: 1.5, sustain: 0.9, release: 2.0 },
      filter: { attack: 0.6, decay: 1.2, sustain: 0.7, release: 1.8 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.3,
      amount: 0.2,
      delay: 0.5,
      toPitch: 0.1,
      toFilter: 0.2,
      toAmplitude: 0.1
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.8, damping: 0.3, wet: 0.6, dry: 0.4 },
      delay: { enabled: true, time: 0.8, feedback: 0.4, wet: 0.4, dry: 0.6 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 0.8, depth: 0.004, wet: 0.3, dry: 0.7 }
    },
    masterVolume: 0.6,
  },

  brass: {
    name: 'Brass',
    description: 'Bright, cutting brass with sharp attack',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 0, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.6 },
      oscSync: 0,
      ringMod: 0.3,
      noiseLevel: 0.2
    },
    filter: {
      cutoff: 1.25,
      resonance: 0.1,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.7,
      lfoAmount: 0.1,
      keyboardTracking: 0.6
    },
    envelopes: {
      amplitude: { attack: 0.02, decay: 0.3, sustain: 0.8, release: 0.4 },
      filter: { attack: 0.05, decay: 0.4, sustain: 0.7, release: 0.5 }
    },
    lfo: {
      waveform: 'square',
      rate: 1.2,
      amount: 0.05,
      delay: 0,
      toPitch: 0.02,
      toFilter: 0.05,
      toAmplitude: 0
    },
    effects: {
      reverb: 0.3,
      delay: 0.1,
      distortion: 0.1,
      chorus: 0.1
    },
    masterVolume: 0.6,
  },

  string: {
    name: 'String',
    description: 'Smooth, bowed string with vibrato',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'sine', octave: 0, tune: 7, level: 0.7 },
      osc3: { waveform: 'triangle', octave: 0, tune: 0, level: 0.5 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0
    },
    filter: {
      cutoff: 0.90,
      resonance: 0.1,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.4,
      lfoAmount: 0.4,
      keyboardTracking: 0.5
    },
    envelopes: {
      amplitude: { attack: 0.3, decay: 0.8, sustain: 0.9, release: 1.2 },
      filter: { attack: 0.4, decay: 0.9, sustain: 0.8, release: 1.4 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.8,
      amount: 0.15,
      delay: 0.2,
      toPitch: 0.1,
      toFilter: 0.1,
      toAmplitude: 0.05
    },
    effects: {
      reverb: 0.5,
      delay: 0.3,
      distortion: 0,
      chorus: 0.4
    },
    masterVolume: 0.6,
  },

  synth: {
    name: 'Synth',
    description: 'Classic analog synth with filter sweep',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 0, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.6 },
      oscSync: 0.5,
      ringMod: 0.2,
      noiseLevel: 0.1
    },
    filter: {
      cutoff: 1.50,
      resonance: 0.6,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0.3,
      keyboardTracking: 0.4
    },
    envelopes: {
      amplitude: { attack: 0.1, decay: 0.5, sustain: 0.7, release: 0.8 },
      filter: { attack: 0.2, decay: 0.8, sustain: 0.6, release: 1.0 }
    },
    lfo: {
      waveform: 'triangle',
      rate: 0.6,
      amount: 0.2,
      delay: 0.3,
      toPitch: 0.1,
      toFilter: 0.2,
      toAmplitude: 0.05
    },
    effects: {
      reverb: 0.4,
      delay: 0.2,
      distortion: 0.1,
      chorus: 0.2
    },
    masterVolume: 0.6,
  },

  lead: {
    name: 'Lead',
    description: 'Screaming lead with high resonance',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'sawtooth', octave: 0, tune: 12, level: 0.9 },
      osc3: { waveform: 'square', octave: 1, tune: 0, level: 0.7 },
      oscSync: 0.3,
      ringMod: 0.4,
      noiseLevel: 0.2
    },
    filter: {
      cutoff: 1.00,
      resonance: 0.8,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0.4,
      keyboardTracking: 0.6
    },
    envelopes: {
      amplitude: { attack: 0.02, decay: 0.2, sustain: 0.9, release: 0.3 },
      filter: { attack: 0.05, decay: 0.3, sustain: 0.8, release: 0.4 }
    },
    lfo: {
      waveform: 'sawtooth',
      rate: 1.0,
      amount: 0.2,
      delay: 0.1,
      toPitch: 0.1,
      toFilter: 0.2,
      toAmplitude: 0.05
    },
    effects: {
      reverb: 0.2,
      delay: 0.1,
      distortion: 0.2,
      chorus: 0.1
    },
    masterVolume: 0.6,
  },

  bass_lead: {
    name: 'Bass Lead',
    description: 'Bass and lead combined for powerful sound',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: -1, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 0, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 0, tune: 7, level: 0.6 },
      oscSync: 0.2,
      ringMod: 0.1,
      noiseLevel: 0.1
    },
    filter: {
      cutoff: 0.60,
      resonance: 0.5,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.8,
      lfoAmount: 0.2,
      keyboardTracking: 0.6
    },
    envelopes: {
      amplitude: { attack: 0.05, decay: 0.3, sustain: 0.8, release: 0.4 },
      filter: { attack: 0.1, decay: 0.4, sustain: 0.7, release: 0.5 }
    },
    lfo: {
      waveform: 'triangle',
      rate: 0.7,
      amount: 0.15,
      delay: 0.2,
      toPitch: 0.08,
      toFilter: 0.15,
      toAmplitude: 0.05
    },
    effects: {
      reverb: 0.3,
      delay: 0.2,
      distortion: 0.15,
      chorus: 0.2
    },
    masterVolume: 0.6,
  },

  arp: {
    name: 'Arpeggiator',
    description: 'Sequenced arpeggio with tight timing',
    oscillators: {
      osc1: { waveform: 'square', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'sawtooth', octave: 0, tune: 12, level: 0.7 },
      osc3: { waveform: 'triangle', octave: -1, tune: 0, level: 0.5 },
      oscSync: 0.4,
      ringMod: 0.2,
      noiseLevel: 0
    },
    filter: {
      cutoff: 0.90,
      resonance: 0.4,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.7,
      lfoAmount: 0.3,
      keyboardTracking: 0.5
    },
    envelopes: {
      amplitude: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.2 },
      filter: { attack: 0.02, decay: 0.15, sustain: 0.7, release: 0.3 }
    },
    lfo: {
      waveform: 'square',
      rate: 1.5,
      amount: 0.1,
      delay: 0,
      toPitch: 0.05,
      toFilter: 0.1,
      toAmplitude: 0
    },
    effects: {
      reverb: 0.2,
      delay: 0.1,
      distortion: 0.1,
      chorus: 0.1
    },
    masterVolume: 0.6,
  },

  filter_sweep: {
    name: 'Filter Sweep',
    description: 'Filter modulation with envelope control',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 0, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.6 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0
    },
    filter: {
      cutoff: 2.00,
      resonance: 0.7,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 1.0,
      lfoAmount: 0.5,
      keyboardTracking: 0.3
    },
    envelopes: {
      amplitude: { attack: 0.1, decay: 0.8, sustain: 0.6, release: 1.2 },
      filter: { attack: 0.3, decay: 1.5, sustain: 0.4, release: 2.0 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.4,
      amount: 0.3,
      delay: 0.5,
      toPitch: 0,
      toFilter: 0.3,
      toAmplitude: 0
    },
    effects: {
      reverb: 0.4,
      delay: 0.3,
      distortion: 0,
      chorus: 0.2
    },
    masterVolume: 0.6,
  },

  lfo_mod: {
    name: 'LFO Mod',
    description: 'LFO modulation for movement and texture',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'triangle', octave: 0, tune: 7, level: 0.7 },
      osc3: { waveform: 'sine', octave: -1, tune: 0, level: 0.5 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0
    },
    filter: {
      cutoff: 1.00,
      resonance: 0.3,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.5,
      lfoAmount: 0.8,
      keyboardTracking: 0.4
    },
    envelopes: {
      amplitude: { attack: 0.2, decay: 0.6, sustain: 0.8, release: 1.0 },
      filter: { attack: 0.3, decay: 0.8, sustain: 0.7, release: 1.2 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.6,
      amount: 0.4,
      delay: 0.3,
      toPitch: 0.2,
      toFilter: 0.4,
      toAmplitude: 0.1
    },
    effects: {
      reverb: 0.5,
      delay: 0.4,
      distortion: 0,
      chorus: 0.3
    },
    masterVolume: 0.6,
  },

  // AMBIENT & ATMOSPHERIC PRESETS
  ethereal_pad: {
    name: 'Ethereal Pad',
    description: 'Dreamy, floating pad with slow movement',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.8 },
      osc2: { waveform: 'sine', octave: 0, tune: 3.5, level: 0.6 },
      osc3: { waveform: 'triangle', octave: -1, tune: 0, level: 0.4 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0.05
    },
    filter: {
      cutoff: 0.40,
      resonance: 0.1,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.3,
      lfoAmount: 0.6,
      keyboardTracking: 0.2
    },
    envelopes: {
      amplitude: { attack: 2.0, decay: 3.0, sustain: 0.9, release: 4.0 },
      filter: { attack: 1.5, decay: 2.5, sustain: 0.6, release: 3.5 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.1,
      amount: 0.3,
      delay: 1.0,
      toPitch: 0.05,
      toFilter: 0.4,
      toAmplitude: 0.1
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.9, damping: 0.2, wet: 0.8, dry: 0.2 },
      delay: { enabled: true, time: 1.2, feedback: 0.3, wet: 0.3, dry: 0.7 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 0.3, depth: 0.005, wet: 0.4, dry: 0.6 }
    },
    masterVolume: 0.5,
  },

  space_drone: {
    name: 'Space Drone',
    description: 'Deep, evolving drone with cosmic textures',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: -2, tune: 0, level: 0.7 },
      osc2: { waveform: 'square', octave: -1, tune: 7, level: 0.5 },
      osc3: { waveform: 'triangle', octave: -2, tune: 0, level: 0.3 },
      oscSync: 0.3,
      ringMod: 0.2,
      noiseLevel: 0.15
    },
    filter: {
      cutoff: 0.20,
      resonance: 0.6,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.8,
      lfoAmount: 0.7,
      keyboardTracking: 0.1
    },
    envelopes: {
      amplitude: { attack: 0.5, decay: 2.0, sustain: 0.8, release: 3.0 },
      filter: { attack: 1.0, decay: 4.0, sustain: 0.4, release: 5.0 }
    },
    lfo: {
      waveform: 'triangle',
      rate: 0.05,
      amount: 0.5,
      delay: 2.0,
      toPitch: 0.1,
      toFilter: 0.6,
      toAmplitude: 0.2
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.95, damping: 0.1, wet: 0.9, dry: 0.1 },
      delay: { enabled: true, time: 2.0, feedback: 0.5, wet: 0.4, dry: 0.6 },
      distortion: { enabled: true, amount: 0.3, oversample: 2, wet: 0.2, dry: 0.8 },
      chorus: { enabled: true, rate: 0.1, depth: 0.008, wet: 0.5, dry: 0.5 }
    },
    masterVolume: 0.4,
  },

  cosmic_strings: {
    name: 'Cosmic Strings',
    description: 'Orchestral strings with space-age modulation',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'sine', octave: 0, tune: 7, level: 0.7 },
      osc3: { waveform: 'sine', octave: 0, tune: 12, level: 0.5 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0.02
    },
    filter: {
      cutoff: 0.75,
      resonance: 0.2,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.4,
      lfoAmount: 0.5,
      keyboardTracking: 0.6
    },
    envelopes: {
      amplitude: { attack: 0.8, decay: 1.2, sustain: 0.9, release: 2.5 },
      filter: { attack: 0.6, decay: 1.0, sustain: 0.7, release: 2.0 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.4,
      amount: 0.2,
      delay: 0.5,
      toPitch: 0.08,
      toFilter: 0.3,
      toAmplitude: 0.05
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.7, damping: 0.4, wet: 0.6, dry: 0.4 },
      delay: { enabled: true, time: 0.6, feedback: 0.2, wet: 0.2, dry: 0.8 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 0.6, depth: 0.003, wet: 0.3, dry: 0.7 }
    },
    masterVolume: 0.6,
  },

  // RETRO & VINTAGE PRESETS
  eighties_lead: {
    name: '80s Lead',
    description: 'Classic 80s synth lead with bright, cutting tone',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 12, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.6 },
      oscSync: 0.4,
      ringMod: 0.1,
      noiseLevel: 0.05
    },
    filter: {
      cutoff: 1.50,
      resonance: 0.4,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.7,
      lfoAmount: 0.3,
      keyboardTracking: 0.5
    },
    envelopes: {
      amplitude: { attack: 0.01, decay: 0.2, sustain: 0.9, release: 0.3 },
      filter: { attack: 0.02, decay: 0.3, sustain: 0.8, release: 0.4 }
    },
    lfo: {
      waveform: 'square',
      rate: 1.5,
      amount: 0.15,
      delay: 0.1,
      toPitch: 0.05,
      toFilter: 0.2,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.4, damping: 0.6, wet: 0.2, dry: 0.8 },
      delay: { enabled: true, time: 0.25, feedback: 0.3, wet: 0.3, dry: 0.7 },
      distortion: { enabled: true, amount: 0.2, oversample: 2, wet: 0.15, dry: 0.85 },
      chorus: { enabled: true, rate: 2.0, depth: 0.004, wet: 0.4, dry: 0.6 }
    },
    masterVolume: 0.7,
  },

  analog_bass: {
    name: 'Analog Bass',
    description: 'Warm, punchy analog bass with vintage character',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: -1, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: -1, tune: 0, level: 0.8 },
      osc3: { waveform: 'triangle', octave: -2, tune: 0, level: 0.4 },
      oscSync: 0.2,
      ringMod: 0,
      noiseLevel: 0.08
    },
    filter: {
      cutoff: 0.30,
      resonance: 0.5,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0.1,
      keyboardTracking: 0.8
    },
    envelopes: {
      amplitude: { attack: 0.005, decay: 0.1, sustain: 0.95, release: 0.2 },
      filter: { attack: 0.01, decay: 0.15, sustain: 0.8, release: 0.25 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.3,
      amount: 0.05,
      delay: 0,
      toPitch: 0,
      toFilter: 0.1,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.2, damping: 0.8, wet: 0.1, dry: 0.9 },
      delay: { enabled: false, time: 0.2, feedback: 0.1, wet: 0, dry: 1 },
      distortion: { enabled: true, amount: 0.3, oversample: 2, wet: 0.25, dry: 0.75 },
      chorus: { enabled: false, rate: 1.0, depth: 0.001, wet: 0, dry: 1 }
    },
    masterVolume: 0.7,
  },

  vintage_arp: {
    name: 'Vintage Arp',
    description: 'Classic arpeggiator sound with vintage warmth',
    oscillators: {
      osc1: { waveform: 'square', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'sawtooth', octave: 0, tune: 12, level: 0.7 },
      osc3: { waveform: 'triangle', octave: -1, tune: 0, level: 0.5 },
      oscSync: 0.3,
      ringMod: 0.1,
      noiseLevel: 0.03
    },
    filter: {
      cutoff: 1.00,
      resonance: 0.3,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.6,
      lfoAmount: 0.4,
      keyboardTracking: 0.4
    },
    envelopes: {
      amplitude: { attack: 0.005, decay: 0.08, sustain: 0.8, release: 0.15 },
      filter: { attack: 0.01, decay: 0.12, sustain: 0.7, release: 0.2 }
    },
    lfo: {
      waveform: 'square',
      rate: 2.0,
      amount: 0.1,
      delay: 0,
      toPitch: 0.03,
      toFilter: 0.15,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.3, damping: 0.7, wet: 0.15, dry: 0.85 },
      delay: { enabled: true, time: 0.15, feedback: 0.2, wet: 0.2, dry: 0.8 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 1.8, depth: 0.002, wet: 0.2, dry: 0.8 }
    },
    masterVolume: 0.6,
  },

  // MODERN ELECTRONIC PRESETS
  future_bass: {
    name: 'Future Bass',
    description: 'Modern future bass with punchy attack and wide stereo',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 7, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.6 },
      oscSync: 0.6,
      ringMod: 0.3,
      noiseLevel: 0.1
    },
    filter: {
      cutoff: 1.25,
      resonance: 0.7,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0.5,
      keyboardTracking: 0.3
    },
    envelopes: {
      amplitude: { attack: 0.001, decay: 0.1, sustain: 0.7, release: 0.2 },
      filter: { attack: 0.001, decay: 0.15, sustain: 0.6, release: 0.3 }
    },
    lfo: {
      waveform: 'sawtooth',
      rate: 0.8,
      amount: 0.3,
      delay: 0.1,
      toPitch: 0.1,
      toFilter: 0.4,
      toAmplitude: 0.05
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.6, damping: 0.3, wet: 0.4, dry: 0.6 },
      delay: { enabled: true, time: 0.3, feedback: 0.4, wet: 0.3, dry: 0.7 },
      distortion: { enabled: true, amount: 0.4, oversample: 2, wet: 0.2, dry: 0.8 },
      chorus: { enabled: true, rate: 1.2, depth: 0.006, wet: 0.5, dry: 0.5 }
    },
    masterVolume: 0.7,
  },

  trap_lead: {
    name: 'Trap Lead',
    description: 'Aggressive trap lead with heavy processing',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 12, level: 0.9 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.7 },
      oscSync: 0.8,
      ringMod: 0.5,
      noiseLevel: 0.15
    },
    filter: {
      cutoff: 0.90,
      resonance: 0.8,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0.6,
      keyboardTracking: 0.4
    },
    envelopes: {
      amplitude: { attack: 0.001, decay: 0.05, sustain: 0.8, release: 0.1 },
      filter: { attack: 0.001, decay: 0.08, sustain: 0.7, release: 0.15 }
    },
    lfo: {
      waveform: 'square',
      rate: 1.5,
      amount: 0.4,
      delay: 0,
      toPitch: 0.15,
      toFilter: 0.5,
      toAmplitude: 0.1
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.4, damping: 0.5, wet: 0.3, dry: 0.7 },
      delay: { enabled: true, time: 0.2, feedback: 0.5, wet: 0.4, dry: 0.6 },
      distortion: { enabled: true, amount: 0.6, oversample: 2, wet: 0.4, dry: 0.6 },
      chorus: { enabled: true, rate: 2.5, depth: 0.008, wet: 0.3, dry: 0.7 }
    },
    masterVolume: 0.8,
  },

  edm_pluck: {
    name: 'EDM Pluck',
    description: 'Bright, punchy EDM pluck with tight envelope',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 7, level: 0.8 },
      osc3: { waveform: 'triangle', octave: -1, tune: 0, level: 0.4 },
      oscSync: 0.2,
      ringMod: 0.1,
      noiseLevel: 0.05
    },
    filter: {
      cutoff: 1.75,
      resonance: 0.5,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.8,
      lfoAmount: 0.2,
      keyboardTracking: 0.5
    },
    envelopes: {
      amplitude: { attack: 0.001, decay: 0.02, sustain: 0.0, release: 0.05 },
      filter: { attack: 0.001, decay: 0.03, sustain: 0.0, release: 0.08 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.5,
      amount: 0.1,
      delay: 0,
      toPitch: 0.02,
      toFilter: 0.1,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.5, damping: 0.4, wet: 0.2, dry: 0.8 },
      delay: { enabled: true, time: 0.25, feedback: 0.3, wet: 0.3, dry: 0.7 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 1.0, depth: 0.003, wet: 0.2, dry: 0.8 }
    },
    masterVolume: 0.7,
  },

  // EXPERIMENTAL & WEIRD PRESETS
  glitch: {
    name: 'Glitch',
    description: 'Chaotic glitch sounds with extreme modulation',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.8 },
      osc2: { waveform: 'square', octave: 0, tune: 0, level: 0.6 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.4 },
      oscSync: 0.9,
      ringMod: 0.8,
      noiseLevel: 0.3
    },
    filter: {
      cutoff: 1.00,
      resonance: 0.9,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 1.0,
      lfoAmount: 1.0,
      keyboardTracking: 0.2
    },
    envelopes: {
      amplitude: { attack: 0.001, decay: 0.01, sustain: 0.5, release: 0.02 },
      filter: { attack: 0.001, decay: 0.005, sustain: 0.3, release: 0.01 }
    },
    lfo: {
      waveform: 'sawtooth',
      rate: 8.0,
      amount: 0.8,
      delay: 0,
      toPitch: 0.5,
      toFilter: 0.8,
      toAmplitude: 0.3
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.3, damping: 0.8, wet: 0.2, dry: 0.8 },
      delay: { enabled: true, time: 0.1, feedback: 0.8, wet: 0.5, dry: 0.5 },
      distortion: { enabled: true, amount: 0.8, oversample: 2, wet: 0.6, dry: 0.4 },
      chorus: { enabled: true, rate: 5.0, depth: 0.01, wet: 0.4, dry: 0.6 }
    },
    masterVolume: 0.5,
  },

  bitcrush: {
    name: 'Bitcrush',
    description: 'Lo-fi bitcrushed sound with digital artifacts',
    oscillators: {
      osc1: { waveform: 'square', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 7, level: 0.8 },
      osc3: { waveform: 'square', octave: -1, tune: 0, level: 0.6 },
      oscSync: 0.7,
      ringMod: 0.4,
      noiseLevel: 0.2
    },
    filter: {
      cutoff: 0.75,
      resonance: 0.6,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.7,
      lfoAmount: 0.4,
      keyboardTracking: 0.3
    },
    envelopes: {
      amplitude: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.2 },
      filter: { attack: 0.02, decay: 0.15, sustain: 0.7, release: 0.3 }
    },
    lfo: {
      waveform: 'square',
      rate: 2.0,
      amount: 0.3,
      delay: 0,
      toPitch: 0.1,
      toFilter: 0.3,
      toAmplitude: 0.05
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.4, damping: 0.6, wet: 0.3, dry: 0.7 },
      delay: { enabled: true, time: 0.2, feedback: 0.4, wet: 0.3, dry: 0.7 },
      distortion: { enabled: true, amount: 0.9, oversample: 2, wet: 0.7, dry: 0.3 },
      chorus: { enabled: false, rate: 1.0, depth: 0.001, wet: 0, dry: 1 }
    },
    masterVolume: 0.6,
  },

  alien: {
    name: 'Alien',
    description: 'Otherworldly sounds with extreme ring modulation',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'triangle', octave: 0, tune: 0, level: 0.7 },
      osc3: { waveform: 'sine', octave: -1, tune: 0, level: 0.5 },
      oscSync: 0,
      ringMod: 1.0,
      noiseLevel: 0.1
    },
    filter: {
      cutoff: 0.60,
      resonance: 0.8,
      filterType: 'bandpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0.8,
      keyboardTracking: 0.2
    },
    envelopes: {
      amplitude: { attack: 0.1, decay: 0.5, sustain: 0.7, release: 1.0 },
      filter: { attack: 0.2, decay: 0.8, sustain: 0.5, release: 1.5 }
    },
    lfo: {
      waveform: 'triangle',
      rate: 0.3,
      amount: 0.6,
      delay: 0.5,
      toPitch: 0.3,
      toFilter: 0.7,
      toAmplitude: 0.2
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.8, damping: 0.2, wet: 0.7, dry: 0.3 },
      delay: { enabled: true, time: 0.8, feedback: 0.6, wet: 0.5, dry: 0.5 },
      distortion: { enabled: true, amount: 0.5, oversample: 2, wet: 0.3, dry: 0.7 },
      chorus: { enabled: true, rate: 0.5, depth: 0.01, wet: 0.6, dry: 0.4 }
    },
    masterVolume: 0.5,
  },

  // ACOUSTIC-INSPIRED PRESETS
  woodwind: {
    name: 'Woodwind',
    description: 'Flute-like woodwind with breathy character',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'triangle', octave: 0, tune: 12, level: 0.6 },
      osc3: { waveform: 'sine', octave: 1, tune: 0, level: 0.3 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0.15
    },
    filter: {
      cutoff: 1.25,
      resonance: 0.2,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.3,
      lfoAmount: 0.4,
      keyboardTracking: 0.7
    },
    envelopes: {
      amplitude: { attack: 0.3, decay: 0.5, sustain: 0.9, release: 0.8 },
      filter: { attack: 0.4, decay: 0.6, sustain: 0.8, release: 1.0 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.8,
      amount: 0.2,
      delay: 0.2,
      toPitch: 0.08,
      toFilter: 0.2,
      toAmplitude: 0.1
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.6, damping: 0.5, wet: 0.4, dry: 0.6 },
      delay: { enabled: false, time: 0.3, feedback: 0.2, wet: 0, dry: 1 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 0.7, depth: 0.002, wet: 0.2, dry: 0.8 }
    },
    masterVolume: 0.6,
  },

  brass_section: {
    name: 'Brass Section',
    description: 'Full brass section with bright, cutting tone',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 0, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.6 },
      oscSync: 0,
      ringMod: 0.2,
      noiseLevel: 0.1
    },
    filter: {
      cutoff: 1.50,
      resonance: 0.1,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.6,
      lfoAmount: 0.1,
      keyboardTracking: 0.6
    },
    envelopes: {
      amplitude: { attack: 0.02, decay: 0.2, sustain: 0.9, release: 0.3 },
      filter: { attack: 0.03, decay: 0.25, sustain: 0.8, release: 0.4 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.5,
      amount: 0.05,
      delay: 0,
      toPitch: 0.02,
      toFilter: 0.05,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.5, damping: 0.6, wet: 0.3, dry: 0.7 },
      delay: { enabled: false, time: 0.2, feedback: 0.1, wet: 0, dry: 1 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: false, rate: 1.0, depth: 0.001, wet: 0, dry: 1 }
    },
    masterVolume: 0.7,
  },

  string_ensemble: {
    name: 'String Ensemble',
    description: 'Rich string ensemble with multiple voices',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.8 },
      osc2: { waveform: 'sine', octave: 0, tune: 7, level: 0.7 },
      osc3: { waveform: 'triangle', octave: -1, tune: 0, level: 0.5 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0.02
    },
    filter: {
      cutoff: 1.00,
      resonance: 0.1,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.4,
      lfoAmount: 0.3,
      keyboardTracking: 0.5
    },
    envelopes: {
      amplitude: { attack: 0.4, decay: 0.8, sustain: 0.9, release: 1.5 },
      filter: { attack: 0.5, decay: 1.0, sustain: 0.8, release: 1.8 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.6,
      amount: 0.15,
      delay: 0.3,
      toPitch: 0.06,
      toFilter: 0.15,
      toAmplitude: 0.03
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.8, damping: 0.3, wet: 0.7, dry: 0.3 },
      delay: { enabled: true, time: 0.6, feedback: 0.2, wet: 0.2, dry: 0.8 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 0.8, depth: 0.003, wet: 0.4, dry: 0.6 }
    },
    masterVolume: 0.6,
  },

  // PERCUSSIVE & RHYTHMIC PRESETS
  stab: {
    name: 'Stab',
    description: 'Sharp, percussive stab with quick attack',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'square', octave: 0, tune: 12, level: 0.8 },
      osc3: { waveform: 'sawtooth', octave: 1, tune: 0, level: 0.6 },
      oscSync: 0.5,
      ringMod: 0.2,
      noiseLevel: 0.1
    },
    filter: {
      cutoff: 2.00,
      resonance: 0.6,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.9,
      lfoAmount: 0.2,
      keyboardTracking: 0.4
    },
    envelopes: {
      amplitude: { attack: 0.001, decay: 0.01, sustain: 0.0, release: 0.02 },
      filter: { attack: 0.001, decay: 0.015, sustain: 0.0, release: 0.03 }
    },
    lfo: {
      waveform: 'square',
      rate: 1.0,
      amount: 0.1,
      delay: 0,
      toPitch: 0.02,
      toFilter: 0.1,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.3, damping: 0.7, wet: 0.15, dry: 0.85 },
      delay: { enabled: true, time: 0.2, feedback: 0.3, wet: 0.25, dry: 0.75 },
      distortion: { enabled: true, amount: 0.3, oversample: 2, wet: 0.2, dry: 0.8 },
      chorus: { enabled: false, rate: 1.0, depth: 0.001, wet: 0, dry: 1 }
    },
    masterVolume: 0.7,
  },

  pluck: {
    name: 'Pluck',
    description: 'Bright, bouncy pluck with natural decay',
    oscillators: {
      osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 1.0 },
      osc2: { waveform: 'triangle', octave: 0, tune: 7, level: 0.7 },
      osc3: { waveform: 'sine', octave: -1, tune: 0, level: 0.4 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0.05
    },
    filter: {
      cutoff: 1.50,
      resonance: 0.4,
      filterType: 'lowpass',
      filterSlope: 24,
      envelopeAmount: 0.8,
      lfoAmount: 0.1,
      keyboardTracking: 0.6
    },
    envelopes: {
      amplitude: { attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.1 },
      filter: { attack: 0.001, decay: 0.08, sustain: 0.0, release: 0.15 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.3,
      amount: 0.05,
      delay: 0,
      toPitch: 0.01,
      toFilter: 0.05,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.4, damping: 0.6, wet: 0.2, dry: 0.8 },
      delay: { enabled: true, time: 0.3, feedback: 0.2, wet: 0.2, dry: 0.8 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: true, rate: 0.8, depth: 0.002, wet: 0.15, dry: 0.85 }
    },
    masterVolume: 0.6,
  },

  marimba: {
    name: 'Marimba',
    description: 'Wooden marimba with natural resonance',
    oscillators: {
      osc1: { waveform: 'sine', octave: 0, tune: 0, level: 0.9 },
      osc2: { waveform: 'triangle', octave: 0, tune: 12, level: 0.6 },
      osc3: { waveform: 'sine', octave: 1, tune: 0, level: 0.3 },
      oscSync: 0,
      ringMod: 0,
      noiseLevel: 0.08
    },
    filter: {
      cutoff: 1.25,
      resonance: 0.3,
      filterType: 'lowpass',
      filterSlope: 12,
      envelopeAmount: 0.6,
      lfoAmount: 0.2,
      keyboardTracking: 0.8
    },
    envelopes: {
      amplitude: { attack: 0.001, decay: 0.3, sustain: 0.0, release: 0.8 },
      filter: { attack: 0.001, decay: 0.4, sustain: 0.0, release: 1.0 }
    },
    lfo: {
      waveform: 'sine',
      rate: 0.2,
      amount: 0.1,
      delay: 0,
      toPitch: 0.02,
      toFilter: 0.1,
      toAmplitude: 0
    },
    effects: {
      reverb: { enabled: true, roomSize: 0.5, damping: 0.5, wet: 0.3, dry: 0.7 },
      delay: { enabled: false, time: 0.2, feedback: 0.1, wet: 0, dry: 1 },
      distortion: { enabled: false, amount: 0, oversample: 2, wet: 0, dry: 1 },
      chorus: { enabled: false, rate: 1.0, depth: 0.001, wet: 0, dry: 1 }
    },
    masterVolume: 0.6,
  }
}; 