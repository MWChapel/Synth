import { SampleLoader } from './SampleLoader.js';

export class DrumMachine {
    constructor(audioContext, masterGain) {
        this.audioContext = audioContext;
        this.masterGain = masterGain;
        this.isPlaying = false;
        this.currentStep = 0;
        this.intervalId = null;
        this.sampleLoader = new SampleLoader(audioContext);
        
        // Track currently playing samples to stop them at tick boundaries
        this.playingSamples = new Map(); // Map of drumType -> Set of AudioBufferSourceNodes
        
        // Drum parameters - authentic TR-808 defaults
        this.params = {
            kick: { volume: 0.8, pitch: 60, decay: 0.4, tune: 0.5, decayParam: 0.5 },      // 808: Deep, boomy kick with long decay + tuning
            snare: { volume: 0.7, pitch: 200, decay: 0.3, tune: 0.5, snappy: 0.5 },         // 808: Bright, snappy snare
            hihat: { volume: 0.6, pitch: 800, decay: 0.15, tune: 0.5 },                     // 808: Sharp, bright hi-hat
            clap: { volume: 0.7, pitch: 600, decay: 0.35 },                                 // 808: Authentic clap with proper decay
            lowTom: { volume: 0.65, pitch: 120, decay: 0.5, tune: 0.5 },                   // 808: Deep, resonant low tom
            highTom: { volume: 0.65, pitch: 180, decay: 0.4, tune: 0.5 },                  // 808: Bright, punchy high tom
            rimShot: { volume: 0.7, pitch: 800, decay: 0.2 },                              // 808: Sharp, metallic rim shot
            cowBell: { volume: 0.6, pitch: 800, decay: 0.8 },                              // 808: Bright, sustained cow bell
            cymbal: { volume: 0.55, pitch: 2000, decay: 1.0, tune: 0.5, decayParam: 0.5 }, // 808: Bright, long-decay cymbal
            openHihat: { volume: 0.6, pitch: 600, decay: 0.6, tune: 0.5 },                 // 808: Open, airy hi-hat
            lowConga: { volume: 0.6, pitch: 150, decay: 0.4, tune: 0.5 },                  // 808: Low conga with tuning
            maracas: { volume: 0.5, pitch: 1000, decay: 0.3 },                             // 808: Shaker-like maracas
            midConga: { volume: 0.6, pitch: 200, decay: 0.4, tune: 0.5 },                  // 808: Mid conga with tuning
            midTom: { volume: 0.65, pitch: 150, decay: 0.45, tune: 0.5 },                  // 808: Mid tom with tuning
            tempo: 120,  // Classic TR-808 default tempo
            volume: 0.8  // Authentic TR-808 master volume
        };
        
        // Individual drum patterns (16 steps each)
        this.patterns = {
            kick: Array(16).fill(false),
            snare: Array(16).fill(false),
            hihat: Array(16).fill(false),
            clap: Array(16).fill(false),
            lowTom: Array(16).fill(false),
            highTom: Array(16).fill(false),
            rimShot: Array(16).fill(false),
            cowBell: Array(16).fill(false),
            cymbal: Array(16).fill(false),
            openHihat: Array(16).fill(false),
            lowConga: Array(16).fill(false),
            maracas: Array(16).fill(false),
            midConga: Array(16).fill(false),
            midTom: Array(16).fill(false)
        };

        // WAV variation selections for each drum
        this.wavVariations = {
            kick: 'BD5050',      // Default: middle tuning, middle decay
            snare: 'SD5050',     // Default: middle tuning, middle snappy
            hihat: 'HC50',       // Default: middle tuning
            clap: 'CP',          // Single sample
            lowTom: 'LT50',      // Default: middle tuning
            highTom: 'HT50',     // Default: middle tuning
            rimShot: 'RS',       // Single sample
            cowBell: 'CB',       // Single sample
            cymbal: 'CY5050',    // Default: middle tuning, middle decay
            openHihat: 'OH50',   // Default: middle tuning
            lowConga: 'LC50',    // Default: middle tuning
            maracas: 'MA',       // Single sample
            midConga: 'MC50',    // Default: middle tuning
            midTom: 'MT50'       // Default: middle tuning
        };
        
        // Master pattern (legacy)
        this.pattern = Array(16).fill(false);
        
        // Initialize drum sounds only if we have valid audio context and master gain
        if (this.audioContext && this.masterGain && this.masterGain.connect) {
            this.initDrumSounds();
            this.loadSamples();
        } else {

        }
        
        // Define comprehensive drum presets using all 16 drums
        this.presets = {
            'classic-beat': {
                name: 'Classic Beat',
                description: 'Traditional TR-808 pattern',
                patterns: {
                    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'hip-hop-beat': {
                name: 'Hip-Hop Beat',
                description: 'Classic hip-hop with swing',
                patterns: {
                    kick: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
                    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'house-beat': {
                name: 'House Beat',
                description: 'Four-on-the-floor house pattern',
                patterns: {
                    kick: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
                    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'techno-beat': {
                name: 'Techno Beat',
                description: 'Driving techno with complex hi-hats',
                patterns: {
                    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true],
                    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'full-orchestra': {
                name: 'Full Orchestra',
                description: 'Showcase all 16 drums',
                patterns: {
                    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                    clap: [false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true],
                    lowTom: [false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false],
                    highTom: [false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true],
                    rimShot: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    cowBell: [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    maracas: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
                    midConga: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'latin-groove': {
                name: 'Latin Groove',
                description: 'Latin percussion showcase',
                patterns: {
                    kick: [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
                    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
                    maracas: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                    midConga: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    midTom: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
                }
            },
            'breakbeat': {
                name: 'Breakbeat',
                description: 'Complex breakbeat pattern',
                patterns: {
                    kick: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true],
                    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'minimal': {
                name: 'Minimal',
                description: 'Sparse, minimal pattern',
                patterns: {
                    kick: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
                    snare: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    hihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    clap: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'funk-beat': {
                name: 'Funk Beat',
                description: 'Funky groove with syncopated kick and snare',
                patterns: {
                    kick: [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
                    clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'disco-beat': {
                name: 'Disco Beat',
                description: 'Disco pattern with four-on-the-floor and open hi-hats',
                patterns: {
                    kick: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                    clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'jungle-beat': {
                name: 'Jungle Beat',
                description: 'Jungle/Drum & Bass with complex breakbeats',
                patterns: {
                    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
                    snare: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
                    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                    clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            },
            'trap-beat': {
                name: 'Trap Beat',
                description: 'Trap pattern with triplet hi-hats and sparse kicks',
                patterns: {
                    kick: [true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false],
                    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    hihat: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
                    clap: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    lowTom: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
                    highTom: [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
                    rimShot: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    cowBell: [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
                    cymbal: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    openHihat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
                    lowConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    maracas: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midConga: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    midTom: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
            }
        };
    }
    
    initDrumSounds() {
        // Safety check: ensure we have valid audio context and master gain
        if (!this.audioContext || !this.masterGain || !this.masterGain.connect) {
            ('🥁 DrumMachine: Cannot initialize drum sounds - audio context or master gain not ready');
            return;
        }

        try {
            // Create drum gain nodes
            this.kickGain = this.audioContext.createGain();
            this.snareGain = this.audioContext.createGain();
            this.hihatGain = this.audioContext.createGain();
            this.clapGain = this.audioContext.createGain();
            this.lowTomGain = this.audioContext.createGain();
            this.highTomGain = this.audioContext.createGain();
            this.rimShotGain = this.audioContext.createGain();
            this.cowBellGain = this.audioContext.createGain();
            this.cymbalGain = this.audioContext.createGain();
            this.openHihatGain = this.audioContext.createGain();
            this.lowCongaGain = this.audioContext.createGain();
            this.maracasGain = this.audioContext.createGain();
            this.midCongaGain = this.audioContext.createGain();
            this.midTomGain = this.audioContext.createGain();
            
            // Set initial volumes
            this.kickGain.gain.setValueAtTime(this.params.kick.volume, this.audioContext.currentTime);
            this.snareGain.gain.setValueAtTime(this.params.snare.volume, this.audioContext.currentTime);
            this.hihatGain.gain.setValueAtTime(this.params.hihat.volume, this.audioContext.currentTime);
            this.clapGain.gain.setValueAtTime(this.params.clap.volume, this.audioContext.currentTime);
            this.lowTomGain.gain.setValueAtTime(this.params.lowTom.volume, this.audioContext.currentTime);
            this.highTomGain.gain.setValueAtTime(this.params.highTom.volume, this.audioContext.currentTime);
            this.rimShotGain.gain.setValueAtTime(this.params.rimShot.volume, this.audioContext.currentTime);
            this.cowBellGain.gain.setValueAtTime(this.params.cowBell.volume, this.audioContext.currentTime);
            this.cymbalGain.gain.setValueAtTime(this.params.cymbal.volume, this.audioContext.currentTime);
            this.openHihatGain.gain.setValueAtTime(this.params.openHihat.volume, this.audioContext.currentTime);
            this.lowCongaGain.gain.setValueAtTime(this.params.lowConga.volume, this.audioContext.currentTime);
            this.maracasGain.gain.setValueAtTime(this.params.maracas.volume, this.audioContext.currentTime);
            this.midCongaGain.gain.setValueAtTime(this.params.midConga.volume, this.audioContext.currentTime);
            this.midTomGain.gain.setValueAtTime(this.params.midTom.volume, this.audioContext.currentTime);
            
            // Connect to master gain
            this.kickGain.connect(this.masterGain);
            this.snareGain.connect(this.masterGain);
            this.hihatGain.connect(this.masterGain);
            this.clapGain.connect(this.masterGain);
            this.lowTomGain.connect(this.masterGain);
            this.highTomGain.connect(this.masterGain);
            this.rimShotGain.connect(this.masterGain);
            this.cowBellGain.connect(this.masterGain);
            this.cymbalGain.connect(this.masterGain);
            this.openHihatGain.connect(this.masterGain);
            this.lowCongaGain.connect(this.masterGain);
            this.maracasGain.connect(this.masterGain);
            this.midCongaGain.connect(this.masterGain);
            this.midTomGain.connect(this.masterGain);
            
            ('🥁 DrumMachine Audio: Initialized drum gains:', {
                kick: this.params.kick.volume,
                snare: this.params.snare.volume,
                hihat: this.params.hihat.volume,
                clap: this.params.clap.volume,
                lowTom: this.params.lowTom.volume,
                highTom: this.params.highTom.volume,
                rimShot: this.params.rimShot.volume,
                cowBell: this.params.cowBell.volume,
                cymbal: this.params.cymbal.volume,
                openHihat: this.params.openHihat.volume
            });
        } catch (error) {
            ('🥁 DrumMachine: Error initializing drum sounds:', error);
        }
    }

    // Method to initialize drum sounds when audio context and master gain are ready
    ensureInitialized() {
        if (!this.kickGain && this.audioContext && this.masterGain && this.masterGain.connect) {
            ('🥁 DrumMachine: Audio context and master gain ready, initializing drum sounds');
            this.initDrumSounds();
        }
    }

    // Method to force re-initialization of drum sounds
    reinitialize() {
        if (this.audioContext && this.masterGain && this.masterGain.connect) {
            ('🥁 DrumMachine: Re-initializing drum sounds');
            this.initDrumSounds();
        } else {
            ('🥁 DrumMachine: Cannot re-initialize - audio context or master gain not ready');
        }
    }

    // Helper method to check if drum sounds are initialized
    areDrumSoundsInitialized() {
        return this.kickGain && this.snareGain && this.hihatGain && this.clapGain && 
               this.lowTomGain && this.highTomGain && this.rimShotGain && 
               this.cowBellGain && this.cymbalGain && this.openHihatGain &&
               this.lowCongaGain && this.maracasGain && this.midCongaGain && this.midTomGain;
    }
    
    updateParam(drum, param, value) {
        if (!this.audioContext) return;
        
        try {
            if (drum === 'tempo') {
                this.params.tempo = value;
                if (this.isPlaying) {
                    this.stop();
                    this.start();
                }
            } else if (drum === 'volume') {
                this.params.volume = value;
                // Update master drum volume
                this.masterGain.gain.setValueAtTime(value, this.audioContext.currentTime);
            } else if (this.params[drum]) {
                this.params[drum][param] = value;
                
                // Update gain nodes
                if (param === 'volume') {
                    const gainNode = this[`${drum}Gain`];
                    if (gainNode) {
                        gainNode.gain.setValueAtTime(value, this.audioContext.currentTime);
                    }
                }
            }
        } catch (error) {
            ('❌ Error updating drum parameter:', error);
        }
    }
    
    updatePattern(drumType, newPattern) {
        if (drumType && this.patterns[drumType]) {
            this.patterns[drumType] = [...newPattern];
        } else {
            // Legacy master pattern
            this.pattern = [...newPattern];
        }
    }
    
    async loadSamples() {
        try {
            // Use the new preloadAllSamples method for better performance
            const result = await this.sampleLoader.preloadAllSamples();
            
            // All samples are now loaded and cached for maximum performance
            return result;
        } catch (error) {
            // Fallback to individual loading if preload fails
            await this.sampleLoader.loadAllSamples();
            
            const drumNames = ['kick', 'snare', 'hihat', 'clap', 'lowTom', 'highTom', 'rimShot', 'cowBell', 'cymbal', 'openHihat'];
            drumNames.forEach(name => {
                if (!this.sampleLoader.hasSample(name)) {
                    this.sampleLoader.generateFallbackSample(name);
                }
            });
        }
    }
    
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentStep = 0;
        
        // TR-808 uses 16th note timing (4 steps per beat)
        // At 120 BPM: 60/120 = 0.5 seconds per beat, /4 = 0.125 seconds per 16th note
        const stepTime = (60 / this.params.tempo) / 4;
        
        // Initialize system clock timing
        this.startTime = performance.now();
        this.stepTimeMs = stepTime * 1000; // Convert to milliseconds
        this.nextStepTime = this.startTime + this.stepTimeMs;
        
        // Use system clock-based scheduling for precise timing
        this.scheduleStepsWithSystemClock();
    }
    
    scheduleStepsWithSystemClock() {
        if (!this.isPlaying || !this.audioContext) return;
        
        const now = performance.now();
        
        // Check if it's time for the next step
        if (now >= this.nextStepTime) {
            // Schedule the current step using Web Audio API timing
            const audioTime = this.audioContext.currentTime;
            const lookahead = 0.01; // Minimal lookahead for system clock precision
            const scheduleTime = audioTime + lookahead;
            
            this.scheduleStep(this.currentStep, scheduleTime);
            
            // Advance to next step
            this.currentStep = (this.currentStep + 1) % 16;
            
            // Calculate next step time based on system clock
            this.nextStepTime += this.stepTimeMs;
            
            // Handle timing drift correction
            const drift = now - this.nextStepTime;
            if (Math.abs(drift) > 5) { // If drift > 5ms, correct it
                this.nextStepTime = now + this.stepTimeMs;
            }
        }
        
        // Continue scheduling using requestAnimationFrame for precise timing
        this.animationFrameId = requestAnimationFrame(() => {
            this.scheduleStepsWithSystemClock();
        });
    }
    
    scheduleStep(stepIndex, scheduleTime) {
        // stepIndex is already guaranteed to be 0-15 from scheduleSteps
        
        // Safety check: ensure patterns are initialized
        if (!this.patterns) {
            return;
        }
        
        // Debug logging to track which drums are playing on each step
        const playingDrums = [];
        
        // Play each drum based on its individual pattern
        if (this.patterns.kick && this.patterns.kick[stepIndex]) {
            this.scheduleDrumSound('kick', scheduleTime);
            playingDrums.push('kick');
        }
        
        if (this.patterns.snare && this.patterns.snare[stepIndex]) {
            this.scheduleDrumSound('snare', scheduleTime);
            playingDrums.push('snare');
        }
        
        if (this.patterns.hihat && this.patterns.hihat[stepIndex]) {
            this.scheduleDrumSound('hihat', scheduleTime);
            playingDrums.push('hihat');
        }
        
        if (this.patterns.clap && this.patterns.clap[stepIndex]) {
            this.scheduleDrumSound('clap', scheduleTime);
            playingDrums.push('clap');
        }
        
        if (this.patterns.lowTom && this.patterns.lowTom[stepIndex]) {
            this.scheduleDrumSound('lowTom', scheduleTime);
            playingDrums.push('lowTom');
        }
        
        if (this.patterns.highTom && this.patterns.highTom[stepIndex]) {
            this.scheduleDrumSound('highTom', scheduleTime);
            playingDrums.push('highTom');
        }
        
        if (this.patterns.rimShot && this.patterns.rimShot[stepIndex]) {
            this.scheduleDrumSound('rimShot', scheduleTime);
            playingDrums.push('rimShot');
        }
        
        if (this.patterns.cowBell && this.patterns.cowBell[stepIndex]) {
            this.scheduleDrumSound('cowBell', scheduleTime);
            playingDrums.push('cowBell');
        }
        
        if (this.patterns.cymbal && this.patterns.cymbal[stepIndex]) {
            this.scheduleDrumSound('cymbal', scheduleTime);
            playingDrums.push('cymbal');
        }
        
        if (this.patterns.openHihat && this.patterns.openHihat[stepIndex]) {
            this.scheduleDrumSound('openHihat', scheduleTime);
            playingDrums.push('openHihat');
        }
        
        if (this.patterns.lowConga && this.patterns.lowConga[stepIndex]) {
            this.scheduleDrumSound('lowConga', scheduleTime);
            playingDrums.push('lowConga');
        }
        
        if (this.patterns.maracas && this.patterns.maracas[stepIndex]) {
            this.scheduleDrumSound('maracas', scheduleTime);
            playingDrums.push('maracas');
        }
        
        if (this.patterns.midConga && this.patterns.midConga[stepIndex]) {
            this.scheduleDrumSound('midConga', scheduleTime);
            playingDrums.push('midConga');
        }
        
        if (this.patterns.midTom && this.patterns.midTom[stepIndex]) {
            this.scheduleDrumSound('midTom', scheduleTime);
            playingDrums.push('midTom');
        }
        
        // Debug logging
        if (playingDrums.length > 0) {
            (`🥁 DrumMachine: Step ${stepIndex} - Playing: ${playingDrums.join(', ')}`);
        }
    }
    
    scheduleDrumSound(drumType, scheduleTime) {
        if (!this.audioContext) return;
        
        switch (drumType) {
            case 'kick':
                this.scheduleKick(scheduleTime);
                break;
            case 'snare':
                this.scheduleSnare(scheduleTime);
                break;
            case 'hihat':
                this.scheduleHiHat(scheduleTime);
                break;
            case 'clap':
                this.scheduleClap(scheduleTime);
                break;
            case 'lowTom':
                this.scheduleLowTom(scheduleTime);
                break;
            case 'highTom':
                this.scheduleHighTom(scheduleTime);
                break;
            case 'rimShot':
                this.scheduleRimShot(scheduleTime);
                break;
            case 'cowBell':
                this.scheduleCowBell(scheduleTime);
                break;
            case 'cymbal':
                this.scheduleCymbal(scheduleTime);
                break;
            case 'openHihat':
                this.scheduleOpenHihat(scheduleTime);
                break;
            case 'lowConga':
                this.scheduleLowConga(scheduleTime);
                break;
            case 'maracas':
                this.scheduleMaracas(scheduleTime);
                break;
            case 'midConga':
                this.scheduleMidConga(scheduleTime);
                break;
            case 'midTom':
                this.scheduleMidTom(scheduleTime);
                break;
        }
    }
    

    
    stop() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.scheduleTimeout) {
            clearTimeout(this.scheduleTimeout);
            this.scheduleTimeout = null;
        }
        
        // Cancel animation frame for system clock timing
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Stop all currently playing samples
        this.stopAllSamples();
    }
    
    
    // Scheduled drum methods for precise timing
    scheduleKick(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playKick(scheduleTime);
    }
    
    scheduleSnare(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playSnare(scheduleTime);
    }
    
    scheduleHiHat(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playHiHat(scheduleTime);
    }
    
    scheduleClap(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playClap(scheduleTime);
    }
    
    scheduleLowTom(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playLowTom(scheduleTime);
    }
    
    scheduleHighTom(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playHighTom(scheduleTime);
    }
    
    scheduleRimShot(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playRimShot(scheduleTime);
    }
    
    scheduleCowBell(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playCowBell(scheduleTime);
    }
    
    scheduleCymbal(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playCymbal(scheduleTime);
    }
    
    scheduleOpenHihat(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playOpenHihat(scheduleTime);
    }
    
    scheduleLowConga(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playLowConga(scheduleTime);
    }
    
    scheduleMaracas(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playMaracas(scheduleTime);
    }
    
    scheduleMidConga(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playMidConga(scheduleTime);
    }
    
    scheduleMidTom(scheduleTime) {
        if (!this.areDrumSoundsInitialized()) return;
        this.playMidTom(scheduleTime);
    }
    
    playSample(sampleName, now, volume = 1.0) {
        // Get the WAV variation based on current parameter values
        const variationName = this.getWavVariationFromParams(sampleName);
        const samplePath = this.sampleLoader.getSamplePath(sampleName, variationName);
        
        // Try to get the sample with the specific variation
        let sample = this.sampleLoader.getSample(sampleName, variationName);
        
        // If not found, try to load it
        if (!sample) {
            // Load the sample with the specific variation
            this.sampleLoader.loadSample(sampleName, samplePath, variationName).then(() => {
                // Retry playing the sample after loading
                const loadedSample = this.sampleLoader.getSample(sampleName, variationName);
                if (loadedSample) {
                    this.playSampleWithBuffer(loadedSample, now, volume, sampleName);
                }
            }).catch(() => {
                // Fallback to default sample
                const fallbackSample = this.sampleLoader.getSample(sampleName);
                if (fallbackSample) {
                    this.playSampleWithBuffer(fallbackSample, now, volume, sampleName);
                }
            });
            return;
        }
        
        this.playSampleWithBuffer(sample, now, volume, sampleName);
    }

    playSampleWithBuffer(sample, now, volume, sampleName) {

        try {
            const source = this.audioContext.createBufferSource();
            const gain = this.audioContext.createGain();
            
            source.buffer = sample;
            
            // Play at natural speed (1.0) - authentic TR-808 behavior
            source.playbackRate.setValueAtTime(1.0, now);
            
            // Apply volume
            gain.gain.setValueAtTime(volume * this.params.volume, now);
            
            // Connect and play
            source.connect(gain);
            gain.connect(this.masterGain);
            
            // Track this playing sample
            this.trackPlayingSample(sampleName, source);
            
            source.start(now);
            
            // Let sample play for its natural duration - authentic TR-808 behavior
            source.stop(now + sample.duration);
            
            // Auto-cleanup when sample finishes
            source.onended = () => {
                this.untrackPlayingSample(sampleName, source);
            };
            
        } catch (error) {
            (`🥁 DrumMachine: Error playing sample ${sampleName}:`, error);
        }
    }
    


    // Helper methods for sample tracking and stopping
    trackPlayingSample(drumType, source) {
        if (!this.playingSamples.has(drumType)) {
            this.playingSamples.set(drumType, new Set());
        }
        this.playingSamples.get(drumType).add(source);
    }
    
    untrackPlayingSample(drumType, source) {
        if (this.playingSamples.has(drumType)) {
            this.playingSamples.get(drumType).delete(source);
            if (this.playingSamples.get(drumType).size === 0) {
                this.playingSamples.delete(drumType);
            }
        }
    }
    
    stopAllSamples() {
        this.playingSamples.forEach((sources, drumType) => {
            sources.forEach(source => {
                try {
                    source.stop();
                } catch (e) {
                    // Source might already be stopped, ignore error
                }
            });
        });
        this.playingSamples.clear();
    }

    playKick(now) {
        this.playSample('kick', now, this.params.kick.volume);
    }
    

    
    playSnare(now) {
        this.playSample('snare', now, this.params.snare.volume);
    }
    

    
    playHiHat(now) {
        this.playSample('hihat', now, this.params.hihat.volume);
    }
    
    
    playClap(now) {
        this.playSample('clap', now, this.params.clap.volume);
    }
    
    
    playLowTom(now) {
        this.playSample('lowTom', now, this.params.lowTom.volume);
    }
    
    
    playHighTom(now) {
        this.playSample('highTom', now, this.params.highTom.volume);
    }
    
    
    playRimShot(now) {
        this.playSample('rimShot', now, this.params.rimShot.volume);
    }
    
    
    playCowBell(now) {
        this.playSample('cowBell', now, this.params.cowBell.volume);
    }
    
    
    playCymbal(now) {
        this.playSample('cymbal', now, this.params.cymbal.volume);
    }
    
    
    playOpenHihat(now) {
        this.playSample('openHihat', now, this.params.openHihat.volume);
    }
    
    playLowConga(now) {
        this.playSample('lowConga', now, this.params.lowConga.volume);
    }
    
    playMaracas(now) {
        this.playSample('maracas', now, this.params.maracas.volume);
    }
    
    playMidConga(now) {
        this.playSample('midConga', now, this.params.midConga.volume);
    }
    
    playMidTom(now) {
        this.playSample('midTom', now, this.params.midTom.volume);
    }
    
    
    // Get current state
    getState() {
        return {
            isPlaying: this.isPlaying,
            currentStep: this.currentStep,
            params: { ...this.params },
            patterns: { ...this.patterns },
            pattern: [...this.pattern]
        };
    }
    
    // Get current patterns
    getPatterns() {
        return {
            kick: [...this.patterns.kick],
            snare: [...this.patterns.snare],
            hihat: [...this.patterns.hihat],
            clap: [...this.patterns.clap],
            lowTom: [...this.patterns.lowTom],
            highTom: [...this.patterns.highTom],
            rimShot: [...this.patterns.rimShot],
            cowBell: [...this.patterns.cowBell],
            cymbal: [...this.patterns.cymbal],
            openHihat: [...this.patterns.openHihat]
        };
    }
    
    // Set patterns
    setPatterns(patterns) {
        ('🥁 DrumMachine Audio: setPatterns called with:', patterns);
        
        // Handle both naming conventions: kickPattern vs kick
        if (patterns.kickPattern && Array.isArray(patterns.kickPattern)) {
            this.patterns.kick = [...patterns.kickPattern];
            ('🥁 DrumMachine Audio: Updated kick pattern:', this.patterns.kick);
        } else if (patterns.kick && Array.isArray(patterns.kick)) {
            this.patterns.kick = [...patterns.kick];
            ('🥁 DrumMachine Audio: Updated kick pattern (alt):', this.patterns.kick);
        }
        
        if (patterns.snarePattern && Array.isArray(patterns.snarePattern)) {
            this.patterns.snare = [...patterns.snarePattern];
            ('🥁 DrumMachine Audio: Updated snare pattern:', this.patterns.snare);
        } else if (patterns.snare && Array.isArray(patterns.snare)) {
            this.patterns.snare = [...patterns.snare];
            ('🥁 DrumMachine Audio: Updated snare pattern (alt):', this.patterns.snare);
        }
        
        if (patterns.hihatPattern && Array.isArray(patterns.hihatPattern)) {
            this.patterns.hihat = [...patterns.hihatPattern];
            ('🥁 DrumMachine Audio: Updated hi-hat pattern:', this.patterns.hihat);
        } else if (patterns.hihat && Array.isArray(patterns.hihat)) {
            this.patterns.hihat = [...patterns.hihat];
            ('🥁 DrumMachine Audio: Updated hi-hat pattern (alt):', this.patterns.hihat);
        }
        
        if (patterns.clapPattern && Array.isArray(patterns.clapPattern)) {
            this.patterns.clap = [...patterns.clapPattern];
            ('🥁 DrumMachine Audio: Updated clap pattern:', this.patterns.clap);
        } else if (patterns.clap && Array.isArray(patterns.clap)) {
            this.patterns.clap = [...patterns.clap];
            ('🥁 DrumMachine Audio: Updated clap pattern (alt):', this.patterns.clap);
        } else {
            ('🥁 DrumMachine Audio: No clap pattern found in:', patterns);
        }
        
        if (patterns.lowTomPattern && Array.isArray(patterns.lowTomPattern)) {
            this.patterns.lowTom = [...patterns.lowTomPattern];
            ('🥁 DrumMachine Audio: Updated low tom pattern:', this.patterns.lowTom);
        } else if (patterns.lowTom && Array.isArray(patterns.lowTom)) {
            this.patterns.lowTom = [...patterns.lowTom];
            ('🥁 DrumMachine Audio: Updated low tom pattern (alt):', this.patterns.lowTom);
        }
        
        if (patterns.highTomPattern && Array.isArray(patterns.highTomPattern)) {
            this.patterns.highTom = [...patterns.highTomPattern];
            ('🥁 DrumMachine Audio: Updated high tom pattern:', this.patterns.highTom);
        } else if (patterns.highTom && Array.isArray(patterns.highTom)) {
            this.patterns.highTom = [...patterns.highTom];
            ('🥁 DrumMachine Audio: Updated high tom pattern (alt):', this.patterns.highTom);
        }
        
        if (patterns.rimShotPattern && Array.isArray(patterns.rimShotPattern)) {
            this.patterns.rimShot = [...patterns.rimShotPattern];
            ('🥁 DrumMachine Audio: Updated rim shot pattern:', this.patterns.rimShot);
        } else if (patterns.rimShot && Array.isArray(patterns.rimShot)) {
            this.patterns.rimShot = [...patterns.rimShot];
            ('🥁 DrumMachine Audio: Updated rim shot pattern (alt):', this.patterns.rimShot);
        } else {
            ('🥁 DrumMachine Audio: No rim shot pattern found in:', patterns);
        }
        
        if (patterns.cowBellPattern && Array.isArray(patterns.cowBellPattern)) {
            this.patterns.cowBell = [...patterns.cowBellPattern];
            ('🥁 DrumMachine Audio: Updated cow bell pattern:', this.patterns.cowBell);
        } else if (patterns.cowBell && Array.isArray(patterns.cowBell)) {
            this.patterns.cowBell = [...patterns.cowBell];
            ('🥁 DrumMachine Audio: Updated cow bell pattern (alt):', this.patterns.cowBell);
        }
        
        if (patterns.cymbalPattern && Array.isArray(patterns.cymbalPattern)) {
            this.patterns.cymbal = [...patterns.cymbalPattern];
            ('🥁 DrumMachine Audio: Updated cymbal pattern:', this.patterns.cymbal);
        } else if (patterns.cymbal && Array.isArray(patterns.cymbal)) {
            this.patterns.cymbal = [...patterns.cymbal];
            ('🥁 DrumMachine Audio: Updated cymbal pattern (alt):', this.patterns.cymbal);
        }
        
        if (patterns.openHihatPattern && Array.isArray(patterns.openHihatPattern)) {
            this.patterns.openHihat = [...patterns.openHihatPattern];
            ('🥁 DrumMachine Audio: Updated open hi-hat pattern:', this.patterns.openHihat);
        } else if (patterns.openHihat && Array.isArray(patterns.openHihat)) {
            this.patterns.openHihat = [...patterns.openHihat];
            ('🥁 DrumMachine Audio: Updated open hi-hat pattern (alt):', this.patterns.openHihat);
        }
        
        ('🥁 DrumMachine Audio: All patterns updated:', this.patterns);
    }
    
    // Set tempo
    setTempo(tempo) {
        this.params.tempo = tempo;
        
        // Recalculate timing if currently playing
        if (this.isPlaying) {
            const stepTime = (60 / this.params.tempo) / 4;
            this.stepTimeMs = stepTime * 1000;
            
            // Adjust next step time based on current progress
            const now = performance.now();
            const elapsed = now - this.startTime;
            const currentStepProgress = (elapsed % (this.stepTimeMs * 16)) / this.stepTimeMs;
            this.nextStepTime = now + (this.stepTimeMs - (currentStepProgress * this.stepTimeMs));
        } else {
            // Auto-start the sequencer when tempo is changed manually
            this.start();
        }
    }
    
    // Set master volume
    setVolume(volume) {
        this.params.volume = volume;
        ('🥁 DrumMachine Audio: Master volume set to:', volume);
        
        // Update all drum gain nodes
        if (this.audioContext) {
            const now = this.audioContext.currentTime;
            
            // Update individual drum volumes based on master volume
            if (this.kickGain) this.kickGain.gain.setValueAtTime(this.params.kick.volume * volume, now);
            if (this.snareGain) this.snareGain.gain.setValueAtTime(this.params.snare.volume * volume, now);
            if (this.hihatGain) this.hihatGain.gain.setValueAtTime(this.params.hihat.volume * volume, now);
            if (this.clapGain) this.clapGain.gain.setValueAtTime(this.params.clap.volume * volume, now);
            if (this.lowTomGain) this.lowTomGain.gain.setValueAtTime(this.params.lowTom.volume * volume, now);
            if (this.highTomGain) this.highTomGain.gain.setValueAtTime(this.params.highTom.volume * volume, now);
            if (this.rimShotGain) this.rimShotGain.gain.setValueAtTime(this.params.rimShot.volume * volume, now);
            if (this.cowBellGain) this.cowBellGain.gain.setValueAtTime(this.params.cowBell.volume * volume, now);
            if (this.cymbalGain) this.cymbalGain.gain.setValueAtTime(this.params.cymbal.volume * volume, now);
            if (this.openHihatGain) this.openHihatGain.gain.setValueAtTime(this.params.openHihat.volume * volume, now);
        }
    }
    
    // Panic - stop all sounds immediately
    panic() {
        ('🥁 DrumMachine Audio: PANIC - stopping all sounds');
        this.stop();
        
        // Stop all currently playing samples immediately
        this.stopAllSamples();
        
        // Stop any currently playing drum sounds
        if (this.audioContext) {
            const now = this.audioContext.currentTime;
            
            // Set all gains to 0 immediately
            if (this.kickGain) this.kickGain.gain.setValueAtTime(0, now);
            if (this.snareGain) this.snareGain.gain.setValueAtTime(0, now);
            if (this.hihatGain) this.hihatGain.gain.setValueAtTime(0, now);
            if (this.clapGain) this.clapGain.gain.setValueAtTime(0, now);
            if (this.lowTomGain) this.lowTomGain.gain.setValueAtTime(0, now);
            if (this.highTomGain) this.highTomGain.gain.setValueAtTime(0, now);
            if (this.rimShotGain) this.rimShotGain.gain.setValueAtTime(0, now);
            if (this.cowBellGain) this.cowBellGain.gain.setValueAtTime(0, now);
            if (this.cymbalGain) this.cymbalGain.gain.setValueAtTime(0, now);
            if (this.openHihatGain) this.openHihatGain.gain.setValueAtTime(0, now);
            
            // Restore volumes after a brief moment
            setTimeout(() => {
                if (this.audioContext) {
                    const restoreTime = this.audioContext.currentTime;
                    const masterVol = this.params.volume;
                    
                    if (this.kickGain) this.kickGain.gain.setValueAtTime(this.params.kick.volume * masterVol, restoreTime);
                    if (this.snareGain) this.snareGain.gain.setValueAtTime(this.params.snare.volume * masterVol, restoreTime);
                    if (this.hihatGain) this.hihatGain.gain.setValueAtTime(this.params.hihat.volume * masterVol, restoreTime);
                    if (this.clapGain) this.clapGain.gain.setValueAtTime(this.params.clap.volume * masterVol, restoreTime);
                    if (this.lowTomGain) this.lowTomGain.gain.setValueAtTime(this.params.lowTom.volume * masterVol, restoreTime);
                    if (this.highTomGain) this.highTomGain.gain.setValueAtTime(this.params.highTom.volume * masterVol, restoreTime);
                    if (this.rimShotGain) this.rimShotGain.gain.setValueAtTime(this.params.rimShot.volume * masterVol, restoreTime);
                    if (this.cowBellGain) this.cowBellGain.gain.setValueAtTime(this.params.cowBell.volume * masterVol, restoreTime);
                    if (this.cymbalGain) this.cymbalGain.gain.setValueAtTime(this.params.cymbal.volume * masterVol, restoreTime);
                    if (this.openHihatGain) this.openHihatGain.gain.setValueAtTime(this.params.openHihat.volume * masterVol, restoreTime);
                }
            }, 100);
        }
    }
    
    // Clear all patterns - set all steps to false
    clearPattern() {
        // Clear all drum patterns
        this.patterns = {
            kick: new Array(16).fill(false),
            snare: new Array(16).fill(false),
            hihat: new Array(16).fill(false),
            clap: new Array(16).fill(false),
            lowTom: new Array(16).fill(false),
            highTom: new Array(16).fill(false),
            rimShot: new Array(16).fill(false),
            cowBell: new Array(16).fill(false),
            cymbal: new Array(16).fill(false),
            openHihat: new Array(16).fill(false)
        };
    }

    // Get cache performance statistics
    getCacheStats() {
        if (this.sampleLoader) {
            return this.sampleLoader.getCacheStats();
        }
        return null;
    }

    // Clear sample cache (useful for memory management)
    clearSampleCache() {
        if (this.sampleLoader) {
            this.sampleLoader.clearCache();
        }
    }

    // Get available WAV variations for a drum
    getWavVariations(drumType) {
        return this.sampleLoader.getWavVariations(drumType);
    }

    // Check if a drum has multiple WAV variations
    hasMultipleVariations(drumType) {
        return this.sampleLoader.hasMultipleVariations(drumType);
    }

    // Set WAV variation for a drum
    setWavVariation(drumType, variationName) {
        if (this.wavVariations[drumType] !== undefined) {
            this.wavVariations[drumType] = variationName;
        }
    }

    // Get current WAV variation for a drum
    getWavVariation(drumType) {
        return this.wavVariations[drumType] || null;
    }

    // Map dial values to WAV variation name
    getWavVariationFromParams(drumType) {
        const params = this.params[drumType];
        if (!params) return null;

        // Map 0-1 values to discrete TR-808 parameter values (0, 10, 25, 50, 75)
        const tuneValue = this.mapToDiscreteValue(params.tune || 0.5);
        const decayValue = this.mapToDiscreteValue(params.decayParam || 0.5);
        const snappyValue = this.mapToDiscreteValue(params.snappy || 0.5);

        // Generate WAV variation name based on drum type and parameters
        switch (drumType) {
            case 'kick':
                return `BD${tuneValue.toString().padStart(2, '0')}${decayValue.toString().padStart(2, '0')}`;
            case 'snare':
                return `SD${tuneValue.toString().padStart(2, '0')}${snappyValue.toString().padStart(2, '0')}`;
            case 'cymbal':
                return `CY${tuneValue.toString().padStart(2, '0')}${decayValue.toString().padStart(2, '0')}`;
            case 'hihat':
                return `HC${tuneValue.toString().padStart(2, '0')}`;
            case 'lowTom':
                return `LT${tuneValue.toString().padStart(2, '0')}`;
            case 'highTom':
                return `HT${tuneValue.toString().padStart(2, '0')}`;
            case 'openHihat':
                return `OH${tuneValue.toString().padStart(2, '0')}`;
            case 'lowConga':
                return `LC${tuneValue.toString().padStart(2, '0')}`;
            case 'maracas':
                return 'MA';
            case 'midConga':
                return `MC${tuneValue.toString().padStart(2, '0')}`;
            case 'midTom':
                return `MT${tuneValue.toString().padStart(2, '0')}`;
            default:
                return null;
        }
    }

    // Map continuous 0-1 value to discrete TR-808 parameter values
    mapToDiscreteValue(value) {
        // TR-808 uses discrete values: 0, 10, 25, 50, 75
        if (value <= 0.1) return 0;      // 0-10% -> 0
        if (value <= 0.3) return 10;     // 10-30% -> 10
        if (value <= 0.5) return 25;     // 30-50% -> 25
        if (value <= 0.7) return 50;     // 50-70% -> 50
        return 75;                       // 70-100% -> 75
    }
    
    // Load a drum preset
    loadPreset(presetKey) {
        if (!this.presets[presetKey]) {
            return false;
        }
        
        const preset = this.presets[presetKey];
        
        // Load all patterns from the preset
        for (const drumType in preset.patterns) {
            if (this.patterns[drumType]) {
                this.patterns[drumType] = [...preset.patterns[drumType]];
            }
        }
        
        return true;
    }
    
    // Get available presets
    getPresets() {
        return Object.keys(this.presets).map(key => ({
            key,
            name: this.presets[key].name,
            description: this.presets[key].description
        }));
    }
    
    // Get preset info
    getPresetInfo(presetKey) {
        if (!this.presets[presetKey]) {
            return null;
        }
        
        return {
            key: presetKey,
            name: this.presets[presetKey].name,
            description: this.presets[presetKey].description
        };
    }
} 