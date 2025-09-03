class PolyphonicSynthesizer {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.activeVoices = new Map();
        this.voiceId = 0;
        this.debugMode = true; // Enable debugging
        
        // Mini Moog parameters
        this.params = {
            // Oscillators
            osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.8 },
            osc2: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.6 },
            osc3: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.4 },
            
            // Modulation
            oscSync: 0,
            ringMod: 0,
            noiseLevel: 0,
            
            // Filter
            filterCutoff: 2000,
            filterResonance: 0,
            filterType: 'lowpass',
            filterSlope: 24,
            filterEnvAmount: 0.5,
            filterLfoAmount: 0,
            filterKeyboard: 0.3,
            
            // Envelopes
            attack: 0.1,
            decay: 0.1,
            sustain: 0.7,
            release: 0.3,
            filterAttack: 0.1,
            filterDecay: 0.1,
            filterSustain: 0.5,
            filterRelease: 0.3,
            
            // LFO
            lfoWaveform: 'sine',
            lfoRate: 1,
            lfoAmount: 0,
            lfoDelay: 0,
            lfoToPitch: 0,
            lfoToFilter: 0,
            lfoToAmp: 0,
            
            // Effects
            reverb: 0.3,
            delay: 0.2,
            distortion: 0,
            chorus: 0,
            
            masterVolume: 0.5
        };
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🔧 Initializing Mini Moog Synthesizer...');
            
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('✅ Audio Context created:', this.audioContext.state);
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.setValueAtTime(this.params.masterVolume, this.audioContext.currentTime);
            this.masterGain.connect(this.audioContext.destination);
            console.log('✅ Master gain node created and connected');
            
            // Create effects chain
            this.createEffectsChain();
            console.log('✅ Effects chain created');
            
            // Initialize controls
            this.initializeControls();
            console.log('✅ Controls initialized');
            
            // Initialize keyboard
            this.initializeKeyboard();
            console.log('✅ Keyboard initialized');
            
            // Initialize drum machine
            this.drumMachine = new DrumMachine(this.audioContext, this.masterGain);
            console.log('✅ Drum machine initialized');
            
            // Run system tests
            this.runSystemTests();
            
            console.log('🎹 Mini Moog Synthesizer initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize synthesizer:', error);
        }
    }
    
    createEffectsChain() {
        // Create filter
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = this.params.filterType;
        this.filter.frequency.setValueAtTime(this.params.filterCutoff, this.audioContext.currentTime);
        this.filter.Q.setValueAtTime(this.params.filterResonance, this.audioContext.currentTime);
        
        // Create reverb (convolution-based)
        this.reverbGain = this.audioContext.createGain();
        this.reverbGain.gain.setValueAtTime(this.params.reverb, this.audioContext.currentTime);
        
        // Create delay
        this.delay = this.audioContext.createDelay(1.0);
        this.delay.delayTime.setValueAtTime(0.3, this.audioContext.currentTime);
        this.delayGain = this.audioContext.createGain();
        this.delayGain.gain.setValueAtTime(this.params.delay, this.audioContext.currentTime);
        
        // Create distortion
        this.distortion = this.audioContext.createWaveShaper();
        this.distortion.curve = this.makeDistortionCurve(this.params.distortion);
        
        // Create chorus
        this.chorusGain = this.audioContext.createGain();
        this.chorusGain.gain.setValueAtTime(this.params.chorus, this.audioContext.currentTime);
        
        // Connect effects chain
        this.filter.connect(this.reverbGain);
        this.reverbGain.connect(this.delay);
        this.delay.connect(this.delayGain);
        this.delayGain.connect(this.distortion);
        this.distortion.connect(this.chorusGain);
        this.chorusGain.connect(this.masterGain);
    }
    
    makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        
        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }
    
    initializeControls() {
        // Master volume control
        const masterVolumeDial = document.getElementById('masterVolume');
        const masterVolumeValue = masterVolumeDial.nextElementSibling;
        this.setupDial(masterVolumeDial, masterVolumeValue, 0, 1, 0.5);
        masterVolumeDial.addEventListener('input', (e) => {
            this.params.masterVolume = parseFloat(e.target.value);
            this.masterGain.gain.setValueAtTime(this.params.masterVolume, this.audioContext.currentTime);
            masterVolumeValue.textContent = e.target.value;
            this.updateDialRotation(masterVolumeDial, e.target.value, 0, 1);
        });
        
        // Oscillator 1 controls
        const osc1Waveform = document.getElementById('osc1Waveform');
        osc1Waveform.addEventListener('change', (e) => {
            this.params.osc1.waveform = e.target.value;
        });
        
        const osc1Octave = document.getElementById('osc1Octave');
        const osc1OctaveValue = osc1Octave.nextElementSibling;
        this.setupDial(osc1Octave, osc1OctaveValue, -2, 2, 0);
        osc1Octave.addEventListener('input', (e) => {
            this.params.osc1.octave = parseInt(e.target.value);
            osc1OctaveValue.textContent = e.target.value;
            this.updateDialRotation(osc1Octave, e.target.value, -2, 2);
        });
        
        const osc1Tune = document.getElementById('osc1Tune');
        const osc1TuneValue = osc1Tune.nextElementSibling;
        this.setupDial(osc1Tune, osc1TuneValue, -7, 7, 0);
        osc1Tune.addEventListener('input', (e) => {
            this.params.osc1.tune = parseInt(e.target.value);
            osc1TuneValue.textContent = e.target.value;
            this.updateDialRotation(osc1Tune, e.target.value, -7, 7);
        });
        
        const osc1Level = document.getElementById('osc1Level');
        const osc1LevelValue = osc1Level.nextElementSibling;
        this.setupDial(osc1Level, osc1LevelValue, 0, 1, 0.8);
        osc1Level.addEventListener('input', (e) => {
            this.params.osc1.level = parseFloat(e.target.value);
            osc1LevelValue.textContent = e.target.value;
            this.updateDialRotation(osc1Level, e.target.value, 0, 1);
        });
        
        // Oscillator 2 controls
        const osc2Waveform = document.getElementById('osc2Waveform');
        osc2Waveform.addEventListener('change', (e) => {
            this.params.osc2.waveform = e.target.value;
        });
        
        const osc2Octave = document.getElementById('osc2Octave');
        const osc2OctaveValue = osc2Octave.nextElementSibling;
        this.setupDial(osc2Octave, osc2OctaveValue, -2, 2, 0);
        osc2Octave.addEventListener('input', (e) => {
            this.params.osc2.octave = parseInt(e.target.value);
            osc2OctaveValue.textContent = e.target.value;
            this.updateDialRotation(osc2Octave, e.target.value, -2, 2);
        });
        
        const osc2Tune = document.getElementById('osc2Tune');
        const osc2TuneValue = osc2Tune.nextElementSibling;
        this.setupDial(osc2Tune, osc2TuneValue, -7, 7, 0);
        osc2Tune.addEventListener('input', (e) => {
            this.params.osc2.tune = parseInt(e.target.value);
            osc2TuneValue.textContent = e.target.value;
            this.updateDialRotation(osc2Tune, e.target.value, -7, 7);
        });
        
        const osc2Level = document.getElementById('osc2Level');
        const osc2LevelValue = osc2Level.nextElementSibling;
        this.setupDial(osc2Level, osc2LevelValue, 0, 1, 0.6);
        osc2Level.addEventListener('input', (e) => {
            this.params.osc2.level = parseFloat(e.target.value);
            osc2LevelValue.textContent = e.target.value;
            this.updateDialRotation(osc2Level, e.target.value, 0, 1);
        });
        
        // Oscillator 3 controls
        const osc3Waveform = document.getElementById('osc3Waveform');
        osc3Waveform.addEventListener('change', (e) => {
            this.params.osc3.waveform = e.target.value;
        });
        
        const osc3Octave = document.getElementById('osc3Octave');
        const osc3OctaveValue = osc3Octave.nextElementSibling;
        this.setupDial(osc3Octave, osc3OctaveValue, -2, 2, 0);
        osc3Octave.addEventListener('input', (e) => {
            this.params.osc3.octave = parseInt(e.target.value);
            osc3OctaveValue.textContent = e.target.value;
            this.updateDialRotation(osc3Octave, e.target.value, -2, 2);
        });
        
        const osc3Tune = document.getElementById('osc3Tune');
        const osc3TuneValue = osc3Tune.nextElementSibling;
        this.setupDial(osc3Tune, osc3TuneValue, -7, 7, 0);
        osc3Tune.addEventListener('input', (e) => {
            this.params.osc3.tune = parseInt(e.target.value);
            osc3TuneValue.textContent = e.target.value;
            this.updateDialRotation(osc3Tune, e.target.value, -7, 7);
        });
        
        const osc3Level = document.getElementById('osc3Level');
        const osc3LevelValue = osc3Level.nextElementSibling;
        this.setupDial(osc3Level, osc3LevelValue, 0, 1, 0.4);
        osc3Level.addEventListener('input', (e) => {
            this.params.osc3.level = parseFloat(e.target.value);
            osc3LevelValue.textContent = e.target.value;
            this.updateDialRotation(osc3Level, e.target.value, 0, 1);
        });
        
        // Modulation controls
        const oscSync = document.getElementById('oscSync');
        const oscSyncValue = oscSync.nextElementSibling;
        this.setupDial(oscSync, oscSyncValue, 0, 1, 0);
        oscSync.addEventListener('input', (e) => {
            this.params.oscSync = parseFloat(e.target.value);
            oscSyncValue.textContent = e.target.value;
            this.updateDialRotation(oscSync, e.target.value, 0, 1);
        });
        
        const ringMod = document.getElementById('ringMod');
        const ringModValue = ringMod.nextElementSibling;
        this.setupDial(ringMod, ringModValue, 0, 1, 0);
        ringMod.addEventListener('input', (e) => {
            this.params.ringMod = parseFloat(e.target.value);
            ringModValue.textContent = e.target.value;
            this.updateDialRotation(ringMod, e.target.value, 0, 1);
        });
        
        const noiseLevel = document.getElementById('noiseLevel');
        const noiseLevelValue = noiseLevel.nextElementSibling;
        this.setupDial(noiseLevel, noiseLevelValue, 0, 1, 0);
        noiseLevel.addEventListener('input', (e) => {
            this.params.noiseLevel = parseFloat(e.target.value);
            noiseLevelValue.textContent = e.target.value;
            this.updateDialRotation(noiseLevel, e.target.value, 0, 1);
        });
        
        // Filter controls
        const filterCutoff = document.getElementById('filterCutoff');
        const filterCutoffValue = filterCutoff.nextElementSibling;
        this.setupDial(filterCutoff, filterCutoffValue, 20, 20000, 2000);
        filterCutoff.addEventListener('input', (e) => {
            this.params.filterCutoff = parseFloat(e.target.value);
            this.filter.frequency.setValueAtTime(this.params.filterCutoff, this.audioContext.currentTime);
            filterCutoffValue.textContent = e.target.value;
            this.updateDialRotation(filterCutoff, e.target.value, 20, 20000);
        });
        
        const filterResonance = document.getElementById('filterResonance');
        const filterResonanceValue = filterResonance.nextElementSibling;
        this.setupDial(filterResonance, filterResonanceValue, 0, 20, 0);
        filterResonance.addEventListener('input', (e) => {
            this.params.filterResonance = parseFloat(e.target.value);
            this.filter.Q.setValueAtTime(this.params.filterResonance, this.audioContext.currentTime);
            filterResonanceValue.textContent = e.target.value;
            this.updateDialRotation(filterResonance, e.target.value, 0, 20);
        });
        
        const filterType = document.getElementById('filterType');
        filterType.addEventListener('change', (e) => {
            this.params.filterType = e.target.value;
            this.filter.type = this.params.filterType;
        });
        
        const filterSlope = document.getElementById('filterSlope');
        filterSlope.addEventListener('change', (e) => {
            this.params.filterSlope = parseInt(e.target.value);
        });
        
        // Filter modulation controls
        const filterEnvAmount = document.getElementById('filterEnvAmount');
        const filterEnvAmountValue = filterEnvAmount.nextElementSibling;
        this.setupDial(filterEnvAmount, filterEnvAmountValue, 0, 1, 0.5);
        filterEnvAmount.addEventListener('input', (e) => {
            this.params.filterEnvAmount = parseFloat(e.target.value);
            filterEnvAmountValue.textContent = e.target.value;
            this.updateDialRotation(filterEnvAmount, e.target.value, 0, 1);
        });
        
        const filterLfoAmount = document.getElementById('filterLfoAmount');
        const filterLfoAmountValue = filterLfoAmount.nextElementSibling;
        this.setupDial(filterLfoAmount, filterLfoAmountValue, 0, 1, 0);
        filterLfoAmount.addEventListener('input', (e) => {
            this.params.filterLfoAmount = parseFloat(e.target.value);
            filterLfoAmountValue.textContent = e.target.value;
            this.updateDialRotation(filterLfoAmount, e.target.value, 0, 1);
        });
        
        const filterKeyboard = document.getElementById('filterKeyboard');
        const filterKeyboardValue = filterKeyboard.nextElementSibling;
        this.setupDial(filterKeyboard, filterKeyboardValue, 0, 1, 0.3);
        filterKeyboard.addEventListener('input', (e) => {
            this.params.filterKeyboard = parseFloat(e.target.value);
            filterKeyboardValue.textContent = e.target.value;
            this.updateDialRotation(filterKeyboard, e.target.value, 0, 1);
        });
        
        // Amplitude envelope controls
        const attack = document.getElementById('attack');
        const attackValue = attack.nextElementSibling;
        this.setupDial(attack, attackValue, 0.001, 5, 0.1);
        attack.addEventListener('input', (e) => {
            this.params.attack = parseFloat(e.target.value);
            attackValue.textContent = e.target.value;
            this.updateDialRotation(attack, e.target.value, 0.001, 5);
        });
        
        const decay = document.getElementById('decay');
        const decayValue = decay.nextElementSibling;
        this.setupDial(decay, decayValue, 0.001, 5, 0.1);
        decay.addEventListener('input', (e) => {
            this.params.decay = parseFloat(e.target.value);
            decayValue.textContent = e.target.value;
            this.updateDialRotation(decay, e.target.value, 0.001, 5);
        });
        
        const sustain = document.getElementById('sustain');
        const sustainValue = sustain.nextElementSibling;
        this.setupDial(sustain, sustainValue, 0, 1, 0.7);
        sustain.addEventListener('input', (e) => {
            this.params.sustain = parseFloat(e.target.value);
            sustainValue.textContent = e.target.value;
            this.updateDialRotation(sustain, e.target.value, 0, 1);
        });
        
        const release = document.getElementById('release');
        const releaseValue = release.nextElementSibling;
        this.setupDial(release, releaseValue, 0.001, 5, 0.3);
        release.addEventListener('input', (e) => {
            this.params.release = parseFloat(e.target.value);
            releaseValue.textContent = e.target.value;
            this.updateDialRotation(release, e.target.value, 0.001, 5);
        });
        
        // Filter envelope controls
        const filterAttack = document.getElementById('filterAttack');
        const filterAttackValue = filterAttack.nextElementSibling;
        this.setupDial(filterAttack, filterAttackValue, 0.001, 5, 0.1);
        filterAttack.addEventListener('input', (e) => {
            this.params.filterAttack = parseFloat(e.target.value);
            filterAttackValue.textContent = e.target.value;
            this.updateDialRotation(filterAttack, e.target.value, 0.001, 5);
        });
        
        const filterDecay = document.getElementById('filterDecay');
        const filterDecayValue = filterDecay.nextElementSibling;
        this.setupDial(filterDecay, filterDecayValue, 0.001, 5, 0.1);
        filterDecay.addEventListener('input', (e) => {
            this.params.filterDecay = parseFloat(e.target.value);
            filterDecayValue.textContent = e.target.value;
            this.updateDialRotation(filterDecay, e.target.value, 0.001, 5);
        });
        
        const filterSustain = document.getElementById('filterSustain');
        const filterSustainValue = filterSustain.nextElementSibling;
        this.setupDial(filterSustain, filterSustainValue, 0, 1, 0.5);
        filterSustain.addEventListener('input', (e) => {
            this.params.filterSustain = parseFloat(e.target.value);
            filterSustainValue.textContent = e.target.value;
            this.updateDialRotation(filterSustain, e.target.value, 0, 1);
        });
        
        const filterRelease = document.getElementById('filterRelease');
        const filterReleaseValue = filterRelease.nextElementSibling;
        this.setupDial(filterRelease, filterReleaseValue, 0.001, 5, 0.3);
        filterRelease.addEventListener('input', (e) => {
            this.params.filterRelease = parseFloat(e.target.value);
            filterReleaseValue.textContent = e.target.value;
            this.updateDialRotation(filterRelease, e.target.value, 0.001, 5);
        });
        
        // LFO controls
        const lfoWaveform = document.getElementById('lfoWaveform');
        lfoWaveform.addEventListener('change', (e) => {
            this.params.lfoWaveform = e.target.value;
        });
        
        const lfoRate = document.getElementById('lfoRate');
        const lfoRateValue = lfoRate.nextElementSibling;
        this.setupDial(lfoRate, lfoRateValue, 0.1, 20, 1);
        lfoRate.addEventListener('input', (e) => {
            this.params.lfoRate = parseFloat(e.target.value);
            lfoRateValue.textContent = e.target.value;
            this.updateDialRotation(lfoRate, e.target.value, 0.1, 20);
        });
        
        const lfoAmount = document.getElementById('lfoAmount');
        const lfoAmountValue = lfoAmount.nextElementSibling;
        this.setupDial(lfoAmount, lfoAmountValue, 0, 1, 0);
        lfoAmount.addEventListener('input', (e) => {
            this.params.lfoAmount = parseFloat(e.target.value);
            lfoAmountValue.textContent = e.target.value;
            this.updateDialRotation(lfoAmount, e.target.value, 0, 1);
        });
        
        const lfoDelay = document.getElementById('lfoDelay');
        const lfoDelayValue = lfoDelay.nextElementSibling;
        this.setupDial(lfoDelay, lfoDelayValue, 0, 2, 0);
        lfoDelay.addEventListener('input', (e) => {
            this.params.lfoDelay = parseFloat(e.target.value);
            lfoDelayValue.textContent = e.target.value;
            this.updateDialRotation(lfoDelay, e.target.value, 0, 2);
        });
        
        // LFO modulation routing
        const lfoToPitch = document.getElementById('lfoToPitch');
        const lfoToPitchValue = lfoToPitch.nextElementSibling;
        this.setupDial(lfoToPitch, lfoToPitchValue, 0, 1, 0);
        lfoToPitch.addEventListener('input', (e) => {
            this.params.lfoToPitch = parseFloat(e.target.value);
            lfoToPitchValue.textContent = e.target.value;
            this.updateDialRotation(lfoToPitch, e.target.value, 0, 1);
        });
        
        const lfoToFilter = document.getElementById('lfoToFilter');
        const lfoToFilterValue = lfoToFilter.nextElementSibling;
        this.setupDial(lfoToFilter, lfoToFilterValue, 0, 1, 0);
        lfoToFilter.addEventListener('input', (e) => {
            this.params.lfoToFilter = parseFloat(e.target.value);
            lfoToFilterValue.textContent = e.target.value;
            this.updateDialRotation(lfoToFilter, e.target.value, 0, 1);
        });
        
        const lfoToAmp = document.getElementById('lfoToAmp');
        const lfoToAmpValue = lfoToAmp.nextElementSibling;
        this.setupDial(lfoToAmp, lfoToAmpValue, 0, 1, 0);
        lfoToAmp.addEventListener('input', (e) => {
            this.params.lfoToAmp = parseFloat(e.target.value);
            lfoToAmpValue.textContent = e.target.value;
            this.updateDialRotation(lfoToAmp, e.target.value, 0, 1);
        });
        
        // Effects controls
        const reverb = document.getElementById('reverb');
        const reverbValue = reverb.nextElementSibling;
        this.setupDial(reverb, reverbValue, 0, 1, 0.3);
        reverb.addEventListener('input', (e) => {
            this.params.reverb = parseFloat(e.target.value);
            this.reverbGain.gain.setValueAtTime(this.params.reverb, this.audioContext.currentTime);
            reverbValue.textContent = e.target.value;
            this.updateDialRotation(reverb, e.target.value, 0, 1);
        });
        
        const delay = document.getElementById('delay');
        const delayValue = delay.nextElementSibling;
        this.setupDial(delay, delayValue, 0, 1, 0.2);
        delay.addEventListener('input', (e) => {
            this.params.delay = parseFloat(e.target.value);
            this.delayGain.gain.setValueAtTime(this.params.delay, this.audioContext.currentTime);
            delayValue.textContent = e.target.value;
            this.updateDialRotation(delay, e.target.value, 0, 1);
        });
        
        const distortion = document.getElementById('distortion');
        const distortionValue = distortion.nextElementSibling;
        this.setupDial(distortion, distortionValue, 0, 1, 0);
        distortion.addEventListener('input', (e) => {
            this.params.distortion = parseFloat(e.target.value);
            this.distortion.curve = this.makeDistortionCurve(this.params.distortion);
            distortionValue.textContent = e.target.value;
            this.updateDialRotation(distortion, e.target.value, 0, 1);
        });
        
        const chorus = document.getElementById('chorus');
        const chorusValue = chorus.nextElementSibling;
        this.setupDial(chorus, chorusValue, 0, 1, 0);
        chorus.addEventListener('input', (e) => {
            this.params.chorus = parseFloat(e.target.value);
            this.chorusGain.gain.setValueAtTime(this.params.chorus, this.audioContext.currentTime);
            chorusValue.textContent = e.target.value;
            this.updateDialRotation(chorus, e.target.value, 0, 1);
        });
    }
    
    initializeKeyboard() {
        // Add click event listeners to all keys
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('mousedown', () => this.noteOn(key.dataset.note, key.dataset.frequency));
            key.addEventListener('mouseup', () => this.noteOff(key.dataset.note));
            key.addEventListener('mouseleave', () => this.noteOff(key.dataset.note));
        });
        
        // QWERTY keyboard mapping for 6 octaves
        this.keyMap = {
            // Octave 1 (C1-B1) - Lower case letters
            'z': 'C1', 'x': 'D1', 'c': 'E1', 'v': 'F1', 'b': 'G1', 'n': 'A1', 'm': 'B1',
            's': 'C#1', 'd': 'D#1', 'g': 'F#1', 'h': 'G#1', 'j': 'A#1',
            
            // Octave 2 (C2-B2) - Numbers
            '1': 'C2', '2': 'D2', '3': 'E2', '4': 'F2', '5': 'G2', '6': 'A2', '7': 'B2',
            'q': 'C#2', 'w': 'D#2', 'e': 'F#2', 'r': 'G#2', 't': 'A#2',
            
            // Octave 3 (C3-B3) - QWERTY row
            'q': 'C3', 'w': 'D3', 'e': 'E3', 'r': 'F3', 't': 'G3', 'y': 'A3', 'u': 'B3',
            '2': 'C#3', '3': 'D#3', '5': 'F#3', '6': 'G#3', '7': 'A#3',
            
            // Octave 4 (C4-B4) - ASDF row
            'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4',
            'w': 'C#4', 'e': 'D#4', 't': 'F#4', 'y': 'G#4', 'u': 'A#4',
            
            // Octave 5 (C5-B5) - ZXCV row
            'z': 'C5', 'x': 'D5', 'c': 'E5', 'v': 'F5', 'b': 'G5', 'n': 'A5', 'm': 'B5',
            's': 'C#5', 'd': 'D#5', 'g': 'F#5', 'h': 'G#5', 'j': 'A#5',
            
            // Octave 6 (C6-B6) - Shifted keys
            '!': 'C6', '@': 'D6', '#': 'E6', '$': 'F6', '%': 'G6', '^': 'A6', '&': 'B6',
            'Q': 'C#6', 'W': 'D#6', 'E': 'F#6', 'R': 'G#6', 'T': 'A#6'
        };
        
        // Add keyboard event listeners
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return; // Prevent key repeat
            const note = this.keyMap[e.key.toLowerCase()];
            if (note) {
                const key = document.querySelector(`[data-note="${note}"]`);
                if (key) {
                    key.classList.add('active');
                    this.noteOn(note, key.dataset.frequency);
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const note = this.keyMap[e.key.toLowerCase()];
            if (note) {
                const key = document.querySelector(`[data-note="${note}"]`);
                if (key) {
                    key.classList.remove('active');
                    this.noteOff(note);
                }
            }
        });
    }
    
    noteOn(note, frequency) {
        // Resume audio context if suspended (required for mobile browsers)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (this.activeVoices.has(note)) return; // Note already playing
        
        const voiceId = ++this.voiceId;
        const now = this.audioContext.currentTime;
        
        // Create voice object
        const voice = {
            id: voiceId,
            note: note,
            frequency: parseFloat(frequency),
            oscillators: [],
            gain: this.audioContext.createGain(),
            filter: this.audioContext.createBiquadFilter(),
            lfo: this.audioContext.createOscillator(),
            noise: null
        };
        
        // Configure filter
        voice.filter.type = this.params.filterType;
        voice.filter.frequency.setValueAtTime(this.params.filterCutoff, now);
        voice.filter.Q.setValueAtTime(this.params.filterResonance, now);
        
        // Create oscillators
        this.createOscillators(voice, now);
        
        // Create noise if needed
        if (this.params.noiseLevel > 0) {
            voice.noise = this.createNoise(voice, now);
        }
        
        // Create LFO
        this.createLFO(voice, now);
        
        // Apply envelopes
        this.applyEnvelopes(voice, now);
        
        // Connect voice to effects chain
        voice.gain.connect(voice.filter);
        voice.filter.connect(this.filter);
        
        // Store voice
        this.activeVoices.set(note, voice);
        
        console.log(`Note on: ${note} (${frequency}Hz)`);
    }
    
    createOscillators(voice, now) {
        const baseFreq = voice.frequency;
        
        // Oscillator 1
        if (this.params.osc1.level > 0) {
            const osc1 = this.audioContext.createOscillator();
            const freq1 = baseFreq * Math.pow(2, this.params.osc1.octave) * Math.pow(2, this.params.osc1.tune / 12);
            osc1.frequency.setValueAtTime(freq1, now);
            osc1.type = this.params.osc1.waveform;
            osc1.connect(voice.gain);
            voice.oscillators.push(osc1);
            osc1.start(now);
        }
        
        // Oscillator 2
        if (this.params.osc2.level > 0) {
            const osc2 = this.audioContext.createOscillator();
            const freq2 = baseFreq * Math.pow(2, this.params.osc2.octave) * Math.pow(2, this.params.osc2.tune / 12);
            osc2.frequency.setValueAtTime(freq2, now);
            osc2.type = this.params.osc2.waveform;
            osc2.connect(voice.gain);
            voice.oscillators.push(osc2);
            osc2.start(now);
        }
        
        // Oscillator 3
        if (this.params.osc3.level > 0) {
            const osc3 = this.audioContext.createOscillator();
            const freq3 = baseFreq * Math.pow(2, this.params.osc3.octave) * Math.pow(2, this.params.osc3.tune / 12);
            osc3.frequency.setValueAtTime(freq3, now);
            osc3.type = this.params.osc3.waveform;
            osc3.connect(voice.gain);
            voice.oscillators.push(osc3);
            osc3.start(now);
        }
        
        // Apply oscillator sync if enabled
        if (this.params.oscSync > 0) {
            this.applyOscillatorSync(voice);
        }
        
        // Apply ring modulation if enabled
        if (this.params.ringMod > 0) {
            this.applyRingModulation(voice, now);
        }
        
        // Set oscillator levels
        voice.gain.gain.setValueAtTime(0, now);
        voice.gain.gain.linearRampToValueAtTime(
            this.params.osc1.level + this.params.osc2.level + this.params.osc3.level,
            now + 0.01
        );
    }
    
    createNoise(voice, now) {
        const noise = this.audioContext.createBufferSource();
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = noiseBuffer;
        noise.loop = true;
        noise.connect(voice.gain);
        noise.start(now);
        
        return noise;
    }
    
    createLFO(voice, now) {
        if (this.params.lfoAmount > 0) {
            voice.lfo.frequency.setValueAtTime(this.params.lfoRate, now);
            voice.lfo.type = this.params.lfoWaveform;
            
            // Apply LFO delay if set
            if (this.params.lfoDelay > 0) {
                const lfoGain = this.audioContext.createGain();
                lfoGain.gain.setValueAtTime(0, now);
                lfoGain.gain.linearRampToValueAtTime(this.params.lfoAmount, now + this.params.lfoDelay);
                voice.lfo.connect(lfoGain);
                lfoGain.connect(voice.filter.frequency);
            } else {
                voice.lfo.connect(voice.filter.frequency);
            }
            
            voice.lfo.start(now);
        }
    }
    
    applyOscillatorSync(voice) {
        if (voice.oscillators.length >= 2) {
            // Sync oscillator 2 to oscillator 1
            voice.oscillators[1].frequency.setValueAtTime(
                voice.oscillators[0].frequency.value,
                this.audioContext.currentTime
            );
        }
    }
    
    applyRingModulation(voice, now) {
        if (voice.oscillators.length >= 2) {
            const ringMod = this.audioContext.createGain();
            ringMod.gain.setValueAtTime(this.params.ringMod, now);
            
            // Create ring modulator
            const ringModulator = this.audioContext.createOscillator();
            ringModulator.frequency.setValueAtTime(voice.frequency * 2, now);
            ringModulator.connect(ringMod);
            ringMod.connect(voice.gain);
            ringModulator.start(now);
            
            voice.oscillators.push(ringModulator);
        }
    }
    
    applyEnvelopes(voice, now) {
        // Amplitude envelope
        voice.gain.gain.setValueAtTime(0, now);
        voice.gain.gain.linearRampToValueAtTime(1, now + this.params.attack);
        voice.gain.gain.linearRampToValueAtTime(this.params.sustain, now + this.params.attack + this.params.decay);
        
        // Filter envelope
        const filterEnv = this.audioContext.createGain();
        filterEnv.gain.setValueAtTime(0, now);
        filterEnv.gain.linearRampToValueAtTime(this.params.filterEnvAmount, now + this.params.filterAttack);
        filterEnv.gain.linearRampToValueAtTime(this.params.filterSustain * this.params.filterEnvAmount, now + this.params.filterAttack + this.params.filterDecay);
        filterEnv.connect(voice.filter.frequency);
        
        // Keyboard tracking
        const keyboardTracking = this.audioContext.createGain();
        keyboardTracking.gain.setValueAtTime(this.params.filterKeyboard, now);
        keyboardTracking.connect(voice.filter.frequency);
    }
    
    noteOff(note) {
        const voice = this.activeVoices.get(note);
        if (!voice) return;
        
        const now = this.audioContext.currentTime;
        
        // Apply release envelope
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.linearRampToValueAtTime(0, now + this.params.release);
        
        // Stop all oscillators after release
        setTimeout(() => {
            voice.oscillators.forEach(osc => osc.stop());
            if (voice.noise) voice.noise.stop();
            if (voice.lfo) voice.lfo.stop();
        }, this.params.release * 1000);
        
        // Remove from active voices
        this.activeVoices.delete(note);
        
        console.log(`Note off: ${note}`);
    }
    
    // Utility method to stop all voices
    stopAllVoices() {
        this.activeVoices.forEach((voice, note) => {
            voice.oscillators.forEach(osc => osc.stop());
            if (voice.noise) voice.noise.stop();
            if (voice.lfo) voice.lfo.stop();
        });
        this.activeVoices.clear();
    }
    
    // Circular dial methods
    setupDial(dialElement, valueElement, min, max, defaultValue) {
        if (!dialElement || !valueElement) return;
        
        // Set initial value
        dialElement.value = defaultValue;
        valueElement.textContent = defaultValue;
        
        // Create visual indicator
        this.createDialIndicator(dialElement);
        
        // Set initial rotation
        this.updateDialRotation(dialElement, defaultValue, min, max);
    }
    
    updateDialRotation(dialElement, value, min, max) {
        if (!dialElement) return;
        
        // Calculate rotation angle (-135deg to +135deg for 270deg range)
        const range = max - min;
        const normalizedValue = (value - min) / range;
        const rotation = -135 + (normalizedValue * 270);
        
        // Apply rotation to CSS custom property
        dialElement.style.setProperty('--dial-rotation', `${rotation}deg`);
        
        // Update the visual indicator
        const indicator = dialElement.querySelector('.dial-indicator');
        if (indicator) {
            indicator.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        }
    }
    
    createDialIndicator(dialElement) {
        // Remove existing indicator if any
        const existingIndicator = dialElement.querySelector('.dial-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = 'dial-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 20px;
            background: #ffffff;
            border-radius: 1px;
            transform-origin: center bottom;
            transform: translate(-50%, -50%) rotate(0deg);
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
            z-index: 2;
            pointer-events: none;
        `;
        
        dialElement.appendChild(indicator);
    }

    // Add comprehensive system testing
    runSystemTests() {
        console.log('🧪 Running system tests...');
        
        // Test 1: Audio Context Status
        this.testAudioContext();
        
        // Test 2: Basic Oscillator
        this.testBasicOscillator();
        
        // Test 3: Master Gain
        this.testMasterGain();
        
        // Test 4: Effects Chain
        this.testEffectsChain();
        
        // Test 5: Browser Compatibility
        this.testBrowserCompatibility();
        
        console.log('🧪 System tests completed');
    }
    
    testAudioContext() {
        console.log('🔍 Test 1: Audio Context Status');
        console.log('   - State:', this.audioContext.state);
        console.log('   - Sample Rate:', this.audioContext.sampleRate);
        console.log('   - Current Time:', this.audioContext.currentTime);
        console.log('   - Destination:', this.audioContext.destination);
        
        if (this.audioContext.state === 'suspended') {
            console.log('⚠️  Audio context is suspended - user interaction required');
        } else if (this.audioContext.state === 'running') {
            console.log('✅ Audio context is running');
        } else {
            console.log('❌ Audio context has unexpected state');
        }
    }
    
    testBasicOscillator() {
        console.log('🔍 Test 2: Basic Oscillator Test');
        try {
            const testOsc = this.audioContext.createOscillator();
            const testGain = this.audioContext.createGain();
            
            testOsc.frequency.setValueAtTime(440, this.audioContext.currentTime);
            testOsc.type = 'sine';
            testGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            
            testOsc.connect(testGain);
            testGain.connect(this.audioContext.destination);
            
            console.log('✅ Basic oscillator created successfully');
            console.log('   - Oscillator type:', testOsc.type);
            console.log('   - Frequency:', testOsc.frequency.value);
            console.log('   - Gain:', testGain.gain.value);
            
            // Don't start the test oscillator - just verify creation
            testOsc.disconnect();
            testGain.disconnect();
            
        } catch (error) {
            console.error('❌ Basic oscillator test failed:', error);
        }
    }
    
    testMasterGain() {
        console.log('🔍 Test 3: Master Gain Test');
        console.log('   - Master gain value:', this.masterGain.gain.value);
        console.log('   - Master gain connected to destination:', this.masterGain.connections.length > 0);
        console.log('   - Destination max channel count:', this.audioContext.destination.maxChannelCount);
    }
    
    testEffectsChain() {
        console.log('🔍 Test 4: Effects Chain Test');
        console.log('   - Filter created:', !!this.filter);
        console.log('   - Filter type:', this.filter?.type);
        console.log('   - Filter frequency:', this.filter?.frequency.value);
        console.log('   - Effects chain connected to master gain:', this.filter?.connections.length > 0);
    }
    
    testBrowserCompatibility() {
        console.log('🔍 Test 5: Browser Compatibility Test');
        console.log('   - Web Audio API supported:', !!window.AudioContext || !!window.webkitAudioContext);
        console.log('   - AudioContext constructor:', window.AudioContext ? 'Standard' : 'Webkit');
        console.log('   - User Agent:', navigator.userAgent);
        console.log('   - Platform:', navigator.platform);
    }
    
    // Add a simple test tone method
    playTestTone() {
        console.log('🔊 Playing test tone...');
        
        if (this.audioContext.state === 'suspended') {
            console.log('⚠️  Resuming audio context...');
            this.audioContext.resume();
        }
        
        try {
            // Create a simple test oscillator
            const testOsc = this.audioContext.createOscillator();
            const testGain = this.audioContext.createGain();
            
            // Set up the test tone
            testOsc.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
            testOsc.type = 'sine';
            testGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            
            // Connect through the effects chain
            testOsc.connect(testGain);
            testGain.connect(this.filter);
            
            // Start and stop the test tone
            testOsc.start(this.audioContext.currentTime);
            testOsc.stop(this.audioContext.currentTime + 1); // Play for 1 second
            
            console.log('✅ Test tone started - you should hear an A4 note for 1 second');
            
            // Clean up
            setTimeout(() => {
                testOsc.disconnect();
                testGain.disconnect();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Test tone failed:', error);
        }
    }
    
    // Add a method to force audio context resume
    forceResume() {
        console.log('🔄 Forcing audio context resume...');
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('✅ Audio context resumed successfully');
                console.log('   - New state:', this.audioContext.state);
                console.log('   - Current time:', this.audioContext.currentTime);
            }).catch(error => {
                console.error('❌ Failed to resume audio context:', error);
            });
        } else {
            console.log('ℹ️  Audio context is already running or not available');
        }
    }
}

// Drum Machine Class
class DrumMachine {
    constructor(audioContext, masterGain) {
        this.audioContext = audioContext;
        this.masterGain = masterGain;
        this.isPlaying = false;
        this.currentStep = 0;
        this.intervalId = null;
        this.pattern = this.createEmptyPattern();
        
        // Drum parameters
        this.drumParams = {
            tempo: 120,
            volume: 0.6,
            kick: { volume: 0.8, pitch: 60, decay: 0.3 },
            snare: { volume: 0.7, pitch: 400, decay: 0.2 },
            hihat: { volume: 0.6, pitch: 1200, decay: 0.1 },
            clap: { volume: 0.6, pitch: 600, decay: 0.15 }
        };
        
        this.init();
    }
    
    init() {
        this.createSequencer();
        this.initializeControls();
        this.loadDefaultPattern();
    }
    
    createEmptyPattern() {
        return {
            kick: new Array(16).fill(false),
            snare: new Array(16).fill(false),
            hihat: new Array(16).fill(false),
            clap: new Array(16).fill(false)
        };
    }
    
    createSequencer() {
        const sequencerSteps = document.querySelector('.sequencer-steps');
        sequencerSteps.innerHTML = '';
        
        for (let step = 0; step < 16; step++) {
            const stepRow = document.createElement('div');
            stepRow.className = 'step-row';
            
            // Step number
            const stepNumber = document.createElement('div');
            stepNumber.className = 'step-number';
            stepNumber.textContent = step + 1;
            stepRow.appendChild(stepNumber);
            
            // Kick button
            const kickBtn = document.createElement('button');
            kickBtn.className = 'step-button';
            kickBtn.dataset.step = step;
            kickBtn.dataset.drum = 'kick';
            kickBtn.addEventListener('click', () => this.toggleStep(step, 'kick'));
            stepRow.appendChild(kickBtn);
            
            // Snare button
            const snareBtn = document.createElement('button');
            snareBtn.className = 'step-button';
            snareBtn.dataset.step = step;
            snareBtn.dataset.drum = 'snare';
            snareBtn.addEventListener('click', () => this.toggleStep(step, 'snare'));
            stepRow.appendChild(snareBtn);
            
            // Hi-hat button
            const hihatBtn = document.createElement('button');
            hihatBtn.className = 'step-button';
            hihatBtn.dataset.step = step;
            hihatBtn.dataset.drum = 'hihat';
            hihatBtn.addEventListener('click', () => this.toggleStep(step, 'hihat'));
            stepRow.appendChild(hihatBtn);
            
            // Clap button
            const clapBtn = document.createElement('button');
            clapBtn.className = 'step-button';
            clapBtn.dataset.step = step;
            clapBtn.dataset.drum = 'clap';
            clapBtn.addEventListener('click', () => this.toggleStep(step, 'clap'));
            stepRow.appendChild(clapBtn);
            
            sequencerSteps.appendChild(stepRow);
        }
    }
    
    toggleStep(step, drum) {
        this.pattern[drum][step] = !this.pattern[drum][step];
        this.updateStepDisplay(step, drum);
    }
    
    updateStepDisplay(step, drum) {
        const button = document.querySelector(`[data-step="${step}"][data-drum="${drum}"]`);
        if (this.pattern[drum][step]) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
    
    loadDefaultPattern() {
        // Classic 808 pattern
        this.pattern.kick = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
        this.pattern.snare = [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
        this.pattern.hihat = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        this.pattern.clap = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
        
        // Update display
        for (let step = 0; step < 16; step++) {
            this.updateStepDisplay(step, 'kick');
            this.updateStepDisplay(step, 'snare');
            this.updateStepDisplay(step, 'hihat');
            this.updateStepDisplay(step, 'clap');
        }
    }
    
    initializeControls() {
        // Tempo control
        const tempoDial = document.getElementById('drumTempo');
        const tempoValue = tempoDial.nextElementSibling;
        this.setupDial(tempoDial, tempoValue, 60, 180, 120);
        tempoDial.addEventListener('input', (e) => {
            this.drumParams.tempo = parseInt(e.target.value);
            tempoValue.textContent = e.target.value;
            this.updateDialRotation(tempoDial, e.target.value, 60, 180);
            if (this.isPlaying) {
                this.stop();
                this.play();
            }
        });
        
        // Drum volume control
        const drumVolumeDial = document.getElementById('drumVolume');
        const drumVolumeValue = drumVolumeDial.nextElementSibling;
        this.setupDial(drumVolumeDial, drumVolumeValue, 0, 1, 0.6);
        drumVolumeDial.addEventListener('input', (e) => {
            this.drumParams.volume = parseFloat(e.target.value);
            drumVolumeValue.textContent = e.target.value;
            this.updateDialRotation(drumVolumeDial, e.target.value, 0, 1);
        });
        
        // Play/Stop button
        const playStopBtn = document.getElementById('playStopBtn');
        playStopBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.play();
            }
        });
        
        // Clear pattern button
        const clearPatternBtn = document.getElementById('clearPatternBtn');
        clearPatternBtn.addEventListener('click', () => {
            this.clearPattern();
        });
        
        // Individual drum controls
        this.initializeDrumControls();
    }
    
    initializeDrumControls() {
        // Kick controls
        const kickVolumeDial = document.getElementById('kickVolume');
        const kickVolumeValue = kickVolumeDial.nextElementSibling;
        this.setupDial(kickVolumeDial, kickVolumeValue, 0, 1, 0.8);
        kickVolumeDial.addEventListener('input', (e) => {
            this.drumParams.kick.volume = parseFloat(e.target.value);
            kickVolumeValue.textContent = e.target.value;
            this.updateDialRotation(kickVolumeDial, e.target.value, 0, 1);
        });
        
        const kickPitchDial = document.getElementById('kickPitch');
        const kickPitchValue = kickPitchDial.nextElementSibling;
        this.setupDial(kickPitchDial, kickPitchValue, 20, 200, 60);
        kickPitchDial.addEventListener('input', (e) => {
            this.drumParams.kick.pitch = parseInt(e.target.value);
            kickPitchValue.textContent = e.target.value;
            this.updateDialRotation(kickPitchDial, e.target.value, 20, 200);
        });
        
        const kickDecayDial = document.getElementById('kickDecay');
        const kickDecayValue = kickDecayDial.nextElementSibling;
        this.setupDial(kickDecayDial, kickDecayValue, 0.01, 1, 0.3);
        kickDecayDial.addEventListener('input', (e) => {
            this.drumParams.kick.decay = parseFloat(e.target.value);
            kickDecayValue.textContent = e.target.value;
            this.updateDialRotation(kickDecayDial, e.target.value, 0.01, 1);
        });
        
        // Snare controls
        const snareVolumeDial = document.getElementById('snareVolume');
        const snareVolumeValue = snareVolumeDial.nextElementSibling;
        this.setupDial(snareVolumeDial, snareVolumeValue, 0, 1, 0.7);
        snareVolumeDial.addEventListener('input', (e) => {
            this.drumParams.snare.volume = parseFloat(e.target.value);
            snareVolumeValue.textContent = e.target.value;
            this.updateDialRotation(snareVolumeDial, e.target.value, 0, 1);
        });
        
        const snarePitchDial = document.getElementById('snarePitch');
        const snarePitchValue = snarePitchDial.nextElementSibling;
        this.setupDial(snarePitchDial, snarePitchValue, 200, 800, 400);
        snarePitchDial.addEventListener('input', (e) => {
            this.drumParams.snare.pitch = parseInt(e.target.value);
            snarePitchValue.textContent = e.target.value;
            this.updateDialRotation(snarePitchDial, e.target.value, 200, 800);
        });
        
        const snareDecayDial = document.getElementById('snareDecay');
        const snareDecayValue = snareDecayDial.nextElementSibling;
        this.setupDial(snareDecayDial, snareDecayValue, 0.01, 1, 0.2);
        snareDecayDial.addEventListener('input', (e) => {
            this.drumParams.snare.decay = parseFloat(e.target.value);
            snareDecayValue.textContent = e.target.value;
            this.updateDialRotation(snareDecayDial, e.target.value, 0.01, 1);
        });
        
        // Hi-hat controls
        const hihatVolumeDial = document.getElementById('hihatVolume');
        const hihatVolumeValue = hihatVolumeDial.nextElementSibling;
        this.setupDial(hihatVolumeDial, hihatVolumeValue, 0, 1, 0.6);
        hihatVolumeDial.addEventListener('input', (e) => {
            this.drumParams.hihat.volume = parseFloat(e.target.value);
            hihatVolumeValue.textContent = e.target.value;
            this.updateDialRotation(hihatVolumeDial, e.target.value, 0, 1);
        });
        
        const hihatPitchDial = document.getElementById('hihatPitch');
        const hihatPitchValue = hihatPitchDial.nextElementSibling;
        this.setupDial(hihatPitchDial, hihatPitchValue, 800, 2000, 1200);
        hihatPitchDial.addEventListener('input', (e) => {
            this.drumParams.hihat.pitch = parseInt(e.target.value);
            hihatPitchValue.textContent = e.target.value;
            this.updateDialRotation(hihatPitchDial, e.target.value, 800, 2000);
        });
        
        const hihatDecayDial = document.getElementById('hihatDecay');
        const hihatDecayValue = hihatDecayDial.nextElementSibling;
        this.setupDial(hihatDecayDial, hihatDecayValue, 0.01, 0.5, 0.1);
        hihatDecayDial.addEventListener('input', (e) => {
            this.drumParams.hihat.decay = parseFloat(e.target.value);
            hihatDecayValue.textContent = e.target.value;
            this.updateDialRotation(hihatDecayDial, e.target.value, 0.01, 0.5);
        });
        
        // Clap controls
        const clapVolumeDial = document.getElementById('clapVolume');
        const clapVolumeValue = clapVolumeDial.nextElementSibling;
        this.setupDial(clapVolumeDial, clapVolumeValue, 0, 1, 0.6);
        clapVolumeDial.addEventListener('input', (e) => {
            this.drumParams.clap.volume = parseFloat(e.target.value);
            clapVolumeValue.textContent = e.target.value;
            this.updateDialRotation(clapVolumeDial, e.target.value, 0, 1);
        });
        
        const clapPitchDial = document.getElementById('clapPitch');
        const clapPitchValue = clapPitchDial.nextElementSibling;
        this.setupDial(clapPitchDial, clapPitchValue, 300, 1000, 600);
        clapPitchDial.addEventListener('input', (e) => {
            this.drumParams.clap.pitch = parseInt(e.target.value);
            clapPitchValue.textContent = e.target.value;
            this.updateDialRotation(clapPitchDial, e.target.value, 300, 1000);
        });
        
        const clapDecayDial = document.getElementById('clapDecay');
        const clapDecayValue = clapDecayDial.nextElementSibling;
        this.setupDial(clapDecayDial, clapDecayValue, 0.01, 0.5, 0.15);
        clapDecayDial.addEventListener('input', (e) => {
            this.drumParams.clap.decay = parseFloat(e.target.value);
            clapDecayValue.textContent = e.target.value;
            this.updateDialRotation(clapDecayDial, e.target.value, 0.01, 0.5);
        });
    }
    
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentStep = 0;
        const playStopBtn = document.getElementById('playStopBtn');
        playStopBtn.textContent = '⏸️ Stop';
        
        const stepTime = (60 / this.drumParams.tempo) / 4; // 16th notes
        
        this.intervalId = setInterval(() => {
            this.playStep(this.currentStep);
            this.highlightStep(this.currentStep);
            this.currentStep = (this.currentStep + 1) % 16;
        }, stepTime * 1000);
    }
    
    stop() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        const playStopBtn = document.getElementById('playStopBtn');
        playStopBtn.textContent = '▶️ Play';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // Remove all step highlighting
        document.querySelectorAll('.step-button').forEach(btn => {
            btn.classList.remove('playing');
        });
    }
    
    playStep(step) {
        const now = this.audioContext.currentTime;
        
        // Play kick
        if (this.pattern.kick[step]) {
            this.playKick(now);
        }
        
        // Play snare
        if (this.pattern.snare[step]) {
            this.playSnare(now);
        }
        
        // Play hi-hat
        if (this.pattern.hihat[step]) {
            this.playHihat(now);
        }
        
        // Play clap
        if (this.pattern.clap[step]) {
            this.playClap(now);
        }
    }
    
    highlightStep(step) {
        // Remove previous highlighting
        document.querySelectorAll('.step-button').forEach(btn => {
            btn.classList.remove('playing');
        });
        
        // Highlight current step
        document.querySelectorAll(`[data-step="${step}"]`).forEach(btn => {
            btn.classList.add('playing');
        });
    }
    
    playKick(time) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(this.drumParams.kick.pitch, time);
        oscillator.frequency.exponentialRampToValueAtTime(1, time + this.drumParams.kick.decay);
        
        gainNode.gain.setValueAtTime(this.drumParams.kick.volume * this.drumParams.volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + this.drumParams.kick.decay);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start(time);
        oscillator.stop(time + this.drumParams.kick.decay);
    }
    
    playSnare(time) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const noise = this.audioContext.createBufferSource();
        
        // Create noise buffer for snare
        const bufferSize = this.audioContext.sampleRate * this.drumParams.snare.decay;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = noiseBuffer;
        
        oscillator.frequency.setValueAtTime(this.drumParams.snare.pitch, time);
        oscillator.frequency.exponentialRampToValueAtTime(1, time + this.drumParams.snare.decay);
        
        gainNode.gain.setValueAtTime(this.drumParams.snare.volume * this.drumParams.volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + this.drumParams.snare.decay);
        
        oscillator.connect(gainNode);
        noise.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.start(time);
        noise.start(time);
        oscillator.stop(time + this.drumParams.snare.decay);
        noise.stop(time + this.drumParams.snare.decay);
    }
    
    playHihat(time) {
        const gainNode = this.audioContext.createGain();
        const noise = this.audioContext.createBufferSource();
        
        // Create noise buffer for hi-hat
        const bufferSize = this.audioContext.sampleRate * this.drumParams.hihat.decay;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = noiseBuffer;
        
        // High-pass filter for hi-hat
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(this.drumParams.hihat.pitch, time);
        
        gainNode.gain.setValueAtTime(this.drumParams.hihat.volume * this.drumParams.volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + this.drumParams.hihat.decay);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        noise.start(time);
        noise.stop(time + this.drumParams.hihat.decay);
    }
    
    playClap(time) {
        const gainNode = this.audioContext.createGain();
        const noise = this.audioContext.createBufferSource();
        
        // Create noise buffer for clap
        const bufferSize = this.audioContext.sampleRate * this.drumParams.clap.decay;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = noiseBuffer;
        
        // Band-pass filter for clap
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(this.drumParams.clap.pitch, time);
        filter.Q.setValueAtTime(10, time);
        
        gainNode.gain.setValueAtTime(this.drumParams.clap.volume * this.drumParams.volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + this.drumParams.clap.decay);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        noise.start(time);
        noise.stop(time + this.drumParams.clap.decay);
    }
    
    clearPattern() {
        this.pattern = this.createEmptyPattern();
        document.querySelectorAll('.step-button').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // Add the missing dial methods
    setupDial(dialElement, valueElement, min, max, defaultValue) {
        if (!dialElement || !valueElement) return;
        
        // Set initial value
        dialElement.value = defaultValue;
        valueElement.textContent = defaultValue;
        
        // Create visual indicator
        this.createDialIndicator(dialElement);
        
        // Set initial rotation
        this.updateDialRotation(dialElement, defaultValue, min, max);
    }
    
    updateDialRotation(dialElement, value, min, max) {
        if (!dialElement) return;
        
        // Calculate rotation angle (-135deg to +135deg for 270deg range)
        const range = max - min;
        const normalizedValue = (value - min) / range;
        const rotation = -135 + (normalizedValue * 270);
        
        // Apply rotation to CSS custom property
        dialElement.style.setProperty('--dial-rotation', `${rotation}deg`);
        
        // Update the visual indicator
        const indicator = dialElement.querySelector('.dial-indicator');
        if (indicator) {
            indicator.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        }
    }
    
    createDialIndicator(dialElement) {
        // Remove existing indicator if any
        const existingIndicator = dialElement.querySelector('.dial-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = 'dial-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 20px;
            background: #ffffff;
            border-radius: 1px;
            transform-origin: center bottom;
            transform: translate(-50%, -50%) rotate(0deg);
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
            z-index: 2;
            pointer-events: none;
        `;
        
        dialElement.appendChild(indicator);
    }
}

// Initialize synthesizer when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Starting synth initialization...');
    
    // Check if DOM elements exist
    console.log('🔍 Checking DOM elements...');
    console.log('   testToneBtn:', document.getElementById('testToneBtn'));
    console.log('   forceResumeBtn:', document.getElementById('forceResumeBtn'));
    console.log('   runTestsBtn:', document.getElementById('runTestsBtn'));
    console.log('   checkStatusBtn:', document.getElementById('checkStatusBtn'));
    console.log('   debugOutput:', document.getElementById('debugOutput'));
    
    const synth = new PolyphonicSynthesizer();
    
    // Expose synth globally for debugging
    window.synth = synth;
    
    // Wait a bit for synth to initialize, then initialize test buttons
    setTimeout(() => {
        console.log('⏰ Initializing test buttons after delay...');
        initializeTestButtons(synth);
    }, 1000);
    
    // Add click-to-start functionality for mobile browsers
    document.addEventListener('click', () => {
        if (synth.audioContext && synth.audioContext.state === 'suspended') {
            synth.audioContext.resume();
        }
    }, { once: true });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            synth.stopAllVoices();
            if (synth.drumMachine) {
                synth.drumMachine.stop();
            }
        }
    });
    
    // Add a manual test button for debugging
    addManualTestButton();
});

// Add a manual test button to the page
function addManualTestButton() {
    console.log('🔧 Adding manual test button...');
    
    // Create a simple test button
    const manualTestBtn = document.createElement('button');
    manualTestBtn.textContent = '🧪 Manual Test';
    manualTestBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: red;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    manualTestBtn.addEventListener('click', () => {
        console.log('🧪 Manual test button clicked!');
        alert('Manual test button works! Check console for details.');
        
        // Test if synth exists
        if (window.synth) {
            console.log('✅ Synth found:', window.synth);
            console.log('   Audio context state:', window.synth.audioContext?.state);
            console.log('   Master gain:', window.synth.masterGain);
        } else {
            console.log('❌ Synth not found');
        }
        
        // Test if test buttons exist
        const testButtons = ['testToneBtn', 'forceResumeBtn', 'runTestsBtn', 'checkStatusBtn'];
        testButtons.forEach(id => {
            const element = document.getElementById(id);
            console.log(`   ${id}:`, element);
        });
    });
    
    document.body.appendChild(manualTestBtn);
    console.log('✅ Manual test button added');
}

// Initialize test button functionality
function initializeTestButtons(synth) {
    console.log('🔧 Initializing test buttons...');
    
    try {
        const debugOutput = document.getElementById('debugOutput');
        console.log('✅ Debug output element found:', debugOutput);
        
        // Test Tone Button
        const testToneBtn = document.getElementById('testToneBtn');
        if (testToneBtn) {
            console.log('✅ Test tone button found');
            testToneBtn.addEventListener('click', () => {
                console.log('🔊 Test tone button clicked');
                addDebugMessage('🔊 Testing basic audio output...', 'info');
                synth.playTestTone();
                addDebugMessage('✅ Test tone triggered - check console for details', 'success');
            });
        } else {
            console.error('❌ Test tone button not found');
        }
        
        // Force Resume Button
        const forceResumeBtn = document.getElementById('forceResumeBtn');
        if (forceResumeBtn) {
            console.log('✅ Force resume button found');
            forceResumeBtn.addEventListener('click', () => {
                console.log('🔄 Force resume button clicked');
                addDebugMessage('🔄 Forcing audio context resume...', 'info');
                synth.forceResume();
                addDebugMessage('✅ Resume command sent - check console for details', 'success');
            });
        } else {
            console.error('❌ Force resume button not found');
        }
        
        // Run All Tests Button
        const runTestsBtn = document.getElementById('runTestsBtn');
        if (runTestsBtn) {
            console.log('✅ Run tests button found');
            runTestsBtn.addEventListener('click', () => {
                console.log('🧪 Run tests button clicked');
                addDebugMessage('🧪 Running comprehensive system tests...', 'info');
                synth.runSystemTests();
                addDebugMessage('✅ All tests completed - check console for detailed results', 'success');
            });
        } else {
            console.error('❌ Run tests button not found');
        }
        
        // Check Status Button
        const checkStatusBtn = document.getElementById('checkStatusBtn');
        if (checkStatusBtn) {
            console.log('✅ Check status button found');
            checkStatusBtn.addEventListener('click', () => {
                console.log('📊 Check status button clicked');
                addDebugMessage('📊 Checking current system status...', 'info');
                checkCurrentStatus(synth);
            });
        } else {
            console.error('❌ Check status button not found');
        }
        
        console.log('✅ All test buttons initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing test buttons:', error);
    }
    
    // Helper function to add debug messages
    function addDebugMessage(message, type = 'info') {
        try {
            const p = document.createElement('p');
            p.textContent = message;
            p.className = type;
            debugOutput.appendChild(p);
            
            // Auto-scroll to bottom
            debugOutput.scrollTop = debugOutput.scrollHeight;
            
            // Remove old messages if too many
            if (debugOutput.children.length > 10) {
                debugOutput.removeChild(debugOutput.firstChild);
            }
            
            console.log(`📝 Debug message added: ${message}`);
        } catch (error) {
            console.error('❌ Error adding debug message:', error);
        }
    }
    
    // Function to check current status
    function checkCurrentStatus(synth) {
        try {
            if (!synth.audioContext) {
                addDebugMessage('❌ No audio context available', 'error');
                return;
            }
            
            const status = {
                audioContextState: synth.audioContext.state,
                sampleRate: synth.audioContext.sampleRate,
                currentTime: synth.audioContext.currentTime,
                masterGainValue: synth.masterGain?.gain.value || 'N/A',
                activeVoices: synth.activeVoices.size,
                filterCutoff: synth.params.filterCutoff,
                osc1Level: synth.params.osc1.level,
                masterVolume: synth.params.masterVolume
            };
            
            addDebugMessage(`📊 Status Report:`, 'info');
            addDebugMessage(`   Audio Context: ${status.audioContextState}`, 
                           status.audioContextState === 'running' ? 'success' : 'warning');
            addDebugMessage(`   Sample Rate: ${status.sampleRate} Hz`, 'info');
            addDebugMessage(`   Master Volume: ${status.masterVolume}`, 'info');
            addDebugMessage(`   Filter Cutoff: ${status.filterCutoff} Hz`, 'info');
            addDebugMessage(`   OSC1 Level: ${status.osc1Level}`, 'info');
            addDebugMessage(`   Active Voices: ${status.activeVoices}`, 'info');
            
            if (status.audioContextState === 'suspended') {
                addDebugMessage('⚠️  Audio context is suspended - click "Force Resume" or interact with the page', 'warning');
            }
        } catch (error) {
            console.error('❌ Error checking status:', error);
            addDebugMessage(`❌ Error checking status: ${error.message}`, 'error');
        }
    }
} 