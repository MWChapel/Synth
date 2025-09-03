export class PolyphonicSynthesizer {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.activeVoices = new Map();
        this.voiceId = 0;
        this.debugMode = true;
        
        // Default parameters
        this.params = {
            // Oscillators
            osc1: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.7, sync: false },
            osc2: { waveform: 'sawtooth', octave: 0, tune: 0, level: 0.5, sync: false },
            osc3: { waveform: 'sine', octave: -1, tune: 0, level: 0.4, sync: false },
            
            // Modulation
            noise: 0.03, // Reduced from 0.08 to 0.03 for cleaner sound
            ringMod: 0,
            
            // Filter
            cutoff: 0.7,
            resonance: 0.3,
            filterType: 'lowpass',
            filterSlope: 24,
            envelopeAmount: 0.5,
            keyboardTracking: 0.3,
            
            // Envelopes
            attack: 0.1,
            decay: 0.3,
            sustain: 0.5,
            release: 0.2,
            filterAttack: 0.1,
            filterDecay: 0.2,
            filterSustain: 0.3,
            filterRelease: 0.1,
            
            // LFO
            lfoWaveform: 'sine',
            lfoRate: 1.0,
            lfoAmount: 0.3,
            lfoDelay: 0.1,
            lfoToPitch: 0.1,
            lfoToFilter: 0.5,
            lfoToAmplitude: 0.1,
            
            // Effects
            reverb: { enabled: false, roomSize: 0.5, damping: 0.5, wet: 0.3, dry: 0.7 },
            delay: { enabled: false, time: 0.3, feedback: 0.3, wet: 0.3, dry: 0.7 },
            distortion: { enabled: false, amount: 0, oversample: 2, wet: 0.3, dry: 0.7 },
            chorus: { enabled: false, rate: 1.5, depth: 0.002, wet: 0.3, dry: 0.7 },
            dryGain: 0.6,
            delayTime: 0.3,
            reverbDecay: 2.0,
            chorusRate: 1.5,
            
            // Master
            masterVolume: 0.7
        };
        
        this.init();
    }
    
    async init() {
        try {
            ('🔧 Initializing Mini Moog Synthesizer...');
            
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            ('✅ Audio Context created:', this.audioContext.state);
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.setValueAtTime(this.params.masterVolume, this.audioContext.currentTime);
            this.masterGain.connect(this.audioContext.destination);
            ('✅ Master gain node created and connected');
            
            // Create analyser node for oscilloscope
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            this.masterGain.connect(this.analyser);
            ('✅ Analyser node created for oscilloscope');
            
            // Create effects chain
            this.createEffectsChain();
            ('✅ Effects chain created');
            
            ('🎹 Mini Moog Synthesizer initialized successfully!');
        } catch (error) {
            // console.error('❌ Failed to initialize synthesizer:', error);
        }
    }
    
    createEffectsChain() {
        // Create input node for the effects chain
        this.effectsInput = this.audioContext.createGain();
        this.effectsInput.gain.setValueAtTime(1.0, this.audioContext.currentTime);
        
        // Create the main ladder filter (Moog-style)
        this.mainFilter = this.audioContext.createBiquadFilter();
        this.mainFilter.type = this.params.filterType;
        this.mainFilter.frequency.setValueAtTime(this.params.cutoff * 2000, this.audioContext.currentTime);
        this.mainFilter.Q.setValueAtTime(this.params.resonance * 3, this.audioContext.currentTime);
        
        // Create envelope-controlled filter modulation
        this.filterEnvelopeGain = this.audioContext.createGain();
        this.filterEnvelopeGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        // Create LFO-controlled filter modulation
        this.filterLFOGain = this.audioContext.createGain();
        this.filterLFOGain.gain.setValueAtTime(this.params.lfoToFilter * this.params.lfoAmount, this.audioContext.currentTime);
        
        // Create main LFO for global modulation
        this.mainLFO = this.audioContext.createOscillator();
        this.mainLFO.frequency.setValueAtTime(this.params.lfoRate, this.audioContext.currentTime);
        this.mainLFO.type = this.params.lfoWaveform;
        
        // Create LFO smoothing filter
        this.lfoSmoothing = this.audioContext.createBiquadFilter();
        this.lfoSmoothing.type = 'lowpass';
        this.lfoSmoothing.frequency.setValueAtTime(this.params.lfoRate * 2, this.audioContext.currentTime);
        this.lfoSmoothing.Q.setValueAtTime(0.7, this.audioContext.currentTime);
        
        // Create reverb (convolution-based with impulse response)
        this.reverbGain = this.audioContext.createGain();
        this.reverbGain.gain.setValueAtTime(this.params.reverb.wet, this.audioContext.currentTime);
        
        // Create reverb convolver with impulse response
        this.reverbConvolver = this.audioContext.createConvolver();
        this.createReverbImpulse();
        
        // Create delay with feedback
        this.delayGain = this.audioContext.createGain();
        this.delayGain.gain.setValueAtTime(this.params.delay.wet, this.audioContext.currentTime);
        
        this.delayNode = this.audioContext.createDelay(2.0); // 2 second max delay
        this.delayNode.delayTime.setValueAtTime(this.params.delay.time, this.audioContext.currentTime);
        
        this.delayFeedback = this.audioContext.createGain();
        this.delayFeedback.gain.setValueAtTime(this.params.delay.feedback, this.audioContext.currentTime);
        
        // Create distortion (WaveShaper)
        this.distortionGain = this.audioContext.createGain();
        this.distortionGain.gain.setValueAtTime(this.params.distortion.wet, this.audioContext.currentTime);
        
        this.distortionNode = this.audioContext.createWaveShaper();
        this.distortionNode.curve = this.makeDistortionCurve(100); // Reduced from 400 to 100 for softer distortion
        
        // Create chorus (modulated delay)
        this.chorusGain = this.audioContext.createGain();
        this.chorusGain.gain.setValueAtTime(this.params.chorus.wet, this.audioContext.currentTime);
        
        this.chorusDelay = this.audioContext.createDelay(0.05); // 50ms max delay
        this.chorusDelay.delayTime.setValueAtTime(0.02, this.audioContext.currentTime); // 20ms base delay
        
        // Create chorus LFO with proper scaling and smoothing
        this.chorusLFO = this.audioContext.createOscillator();
        this.chorusLFO.frequency.setValueAtTime(1.5, this.audioContext.currentTime); // 1.5Hz modulation
        
        // Add gain node to scale LFO modulation depth
        this.chorusLFOGain = this.audioContext.createGain();
        this.chorusLFOGain.gain.setValueAtTime(0.005, this.audioContext.currentTime); // 5ms modulation depth
        
        // Add smoothing filter to prevent clicking
        this.chorusLFOSmoothing = this.audioContext.createBiquadFilter();
        this.chorusLFOSmoothing.type = 'lowpass';
        this.chorusLFOSmoothing.frequency.setValueAtTime(3, this.audioContext.currentTime); // 3Hz smoothing
        this.chorusLFOSmoothing.Q.setValueAtTime(0.7, this.audioContext.currentTime);
        
        // Connect LFO through scaling and smoothing
        this.chorusLFO.connect(this.chorusLFOGain);
        this.chorusLFOGain.connect(this.chorusLFOSmoothing);
        this.chorusLFOSmoothing.connect(this.chorusDelay.delayTime);
        this.chorusLFO.start();
        
        // Create dry signal path (bypasses effects when they're disabled)
        this.dryGain = this.audioContext.createGain();
        this.dryGain.gain.setValueAtTime(this.params.dryGain, this.audioContext.currentTime);
        
        // Create drum machine output that connects to the same audio path
        this.drumMachineOutput = this.audioContext.createGain();
        this.drumMachineOutput.gain.setValueAtTime(1.0, this.audioContext.currentTime);
        
        // Create a mixer to combine synth and drum machine outputs
        this.mixer = this.audioContext.createGain();
        this.mixer.gain.setValueAtTime(1.0, this.audioContext.currentTime);
        
        // Create DC blocker to remove any DC offset
        this.dcBlocker = this.audioContext.createBiquadFilter();
        this.dcBlocker.type = 'highpass';
        this.dcBlocker.frequency.setValueAtTime(10, this.audioContext.currentTime); // 10Hz cutoff
        this.dcBlocker.Q.setValueAtTime(0.7, this.audioContext.currentTime);
        
        // Connect the proper Mini Moog signal chain:
        // Oscillators → Ladder Filter → Envelopes → LFO Module → Effects
        
        // 1. Connect LFO to filter modulation
        this.mainLFO.connect(this.lfoSmoothing);
        this.lfoSmoothing.connect(this.filterLFOGain);
        this.filterLFOGain.connect(this.mainFilter.frequency);
        
        // 2. Connect filter envelope modulation
        this.filterEnvelopeGain.connect(this.mainFilter.frequency);
        
        // 3. Connect main signal path through the ladder filter
        this.effectsInput.connect(this.mainFilter);
        
        // 4. Connect filtered signal to effects chain
        this.mainFilter.connect(this.reverbGain);
        this.reverbGain.connect(this.reverbConvolver);
        this.reverbConvolver.connect(this.delayGain);
        
        this.delayGain.connect(this.delayNode);
        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode); // Feedback loop
        this.delayNode.connect(this.distortionGain);
        
        this.distortionGain.connect(this.distortionNode);
        this.distortionNode.connect(this.chorusGain);
        
        this.chorusGain.connect(this.chorusDelay);
        this.chorusDelay.connect(this.mixer); // Connect effects output to mixer
        
        // 5. Connect dry signal path (bypasses effects) - ALWAYS ACTIVE
        this.effectsInput.connect(this.dryGain);
        this.dryGain.connect(this.mixer);
        
        // 6. Connect drum machine output to the mixer
        this.drumMachineOutput.connect(this.mixer);
        
        // 7. Connect mixer to final audio path
        this.mixer.connect(this.dcBlocker);
        this.dcBlocker.connect(this.masterGain);
        
        // Start the main LFO
        this.mainLFO.start();
        
        ('🔧 Main LFO started with parameters:', {
            frequency: this.params.lfoRate,
            type: this.params.lfoWaveform,
            filterModAmount: this.params.lfoToFilter * this.params.lfoAmount
        });
        
        ('🔧 Mini Moog Signal Chain: Oscillators → Ladder Filter → Envelopes → LFO Module → Effects');
        ('🔧 LFO Modulation: Connected to filter frequency for real-time modulation');
        ('🔧 Filter Envelope: Connected to filter frequency for envelope modulation');
        ('🔧 Effects Chain: Filter → Reverb → Delay → Distortion → Chorus → Mixer');
        ('🔧 Dry Signal Path: Filter → Mixer (always active)');
        ('🥁 Drum Machine Output: Connected to mixer → DC Blocker → Master Gain');
    }
    
    createReverbImpulse() {
        // Create a simple reverb impulse response
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2; // 2 second reverb
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Exponential decay
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        this.reverbConvolver.buffer = impulse;
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
    
    updateParam(section, param, value) {
        if (!this.audioContext) return;
        
        try {
            if (section === 'oscillators') {
                if (param.includes('.')) {
                    const [osc, prop] = param.split('.');
                    this.params[osc][prop] = value;
                } else {
                    this.params[param] = value;
                }
            } else if (section === 'filter') {
                if (param === 'cutoff') {
                    this.params.cutoff = value;
                    this.mainFilter.frequency.setValueAtTime(value * 2000, this.audioContext.currentTime);
                } else if (param === 'resonance') {
                    this.params.resonance = value;
                    this.mainFilter.Q.setValueAtTime(value * 3, this.audioContext.currentTime); // Reduced from 10x to 3x
                } else if (param === 'filterType') {
                    this.params.filterType = value;
                    this.mainFilter.type = value;
                    // Update all active voice filters
                    this.activeVoices.forEach(voice => {
                        if (voice.filter) {
                            voice.filter.type = value;
                        }
                    });
                } else if (param === 'filterSlope') {
                    this.params.filterSlope = value;
                    // Note: Web Audio API doesn't support slope directly, but we can implement it
                    // by adjusting the Q value or using multiple filters in series
                } else if (param === 'envelopeAmount') {
                    this.params.envelopeAmount = value;
                    // Update the filter envelope gain for real-time changes
                    if (this.filterEnvelopeGain) {
                        this.filterEnvelopeGain.gain.setValueAtTime(value, this.audioContext.currentTime);
                    }
                    // Update envelope modulation for active voices
                    this.updateEnvelopeModulation();
                } else if (param === 'keyboardTracking') {
                    this.params.keyboardTracking = value;
                }
            } else if (section === 'envelopes') {
                if (param.includes('.')) {
                    const [env, prop] = param.split('.');
                    if (env === 'amplitude') {
                        if (prop === 'attack') {
                            this.params.attack = value;
                        } else if (prop === 'decay') {
                            this.params.decay = value;
                        } else if (prop === 'sustain') {
                            this.params.sustain = value;
                        } else if (prop === 'release') {
                            this.params.release = value;
                        }
                    } else if (env === 'filter') {
                        if (prop === 'attack') {
                            this.params.filterAttack = value;
                        } else if (prop === 'decay') {
                            this.params.filterDecay = value;
                        } else if (prop === 'sustain') {
                            this.params.filterSustain = value;
                        } else if (prop === 'release') {
                            this.params.filterRelease = value;
                        }
                    }
                    // Update envelope modulation for active voices when envelope parameters change
                    this.updateEnvelopeModulation();
                } else {
                    this.params[param] = value;
                }
            } else if (section === 'lfo') {
                if (param === 'waveform') {
                    this.params.lfoWaveform = value;
                    if (this.mainLFO) {
                        this.mainLFO.type = value;
                    }
                    this.updateLFOModulation();
                } else if (param === 'rate') {
                    this.params.lfoRate = value;
                    if (this.mainLFO) {
                        this.mainLFO.frequency.setValueAtTime(value, this.audioContext.currentTime);
                    }
                    if (this.lfoSmoothing) {
                        this.lfoSmoothing.frequency.setValueAtTime(value * 2, this.audioContext.currentTime);
                    }
                    this.updateLFOModulation();
                } else if (param === 'amount') {
                    this.params.lfoAmount = value;
                    this.updateLFOModulation();
                } else if (param === 'delay') {
                    this.params.lfoDelay = value;
                } else if (param === 'toPitch') {
                    this.params.lfoToPitch = value;
                    this.updateLFOModulation();
                } else if (param === 'toFilter') {
                    this.params.lfoToFilter = value;
                    this.updateLFOModulation();
                } else if (param === 'toAmplitude') {
                    this.params.lfoToAmplitude = value;
                    this.updateLFOModulation();
                }
            } else if (section === 'effects') {
                if (param.includes('.')) {
                    const [effect, prop] = param.split('.');
                    if (!this.params[effect]) {
                        this.params[effect] = {};
                    }
                    this.params[effect][prop] = value;
                    
                    // Update the audio engine based on the effect and property
                    if (effect === 'reverb') {
                        if (prop === 'enabled') {
                            // Enable/disable reverb by setting gain to 0 or wet level
                            const gainValue = value ? this.params.reverb.wet : 0;
                            this.reverbGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
                        } else if (prop === 'wet') {
                            if (this.params.reverb.enabled) {
                                this.reverbGain.gain.setValueAtTime(value, this.audioContext.currentTime);
                            }
                        } else if (prop === 'roomSize') {
                            // Update reverb impulse response
                            this.createReverbImpulse();
                        }
                    } else if (effect === 'delay') {
                        if (prop === 'enabled') {
                            const gainValue = value ? this.params.delay.wet : 0;
                            this.delayGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
                        } else if (prop === 'wet') {
                            if (this.params.delay.enabled) {
                                this.delayGain.gain.setValueAtTime(value, this.audioContext.currentTime);
                            }
                        } else if (prop === 'time') {
                            this.delayNode.delayTime.setValueAtTime(value, this.audioContext.currentTime);
                        } else if (prop === 'feedback') {
                            this.delayFeedback.gain.setValueAtTime(value, this.audioContext.currentTime);
                        }
                    } else if (effect === 'distortion') {
                        if (prop === 'enabled') {
                            const gainValue = value ? this.params.distortion.wet : 0;
                            this.distortionGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
                        } else if (prop === 'wet') {
                            if (this.params.distortion.enabled) {
                                this.distortionGain.gain.setValueAtTime(value, this.audioContext.currentTime);
                            }
                        } else if (prop === 'amount') {
                            // Update distortion curve based on amount
                            this.distortionNode.curve = this.makeDistortionCurve(value * 800);
                        }
                    } else if (effect === 'chorus') {
                        if (prop === 'enabled') {
                            const gainValue = value ? this.params.chorus.wet : 0;
                            this.chorusGain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
                        } else if (prop === 'wet') {
                            if (this.params.chorus.enabled) {
                                this.chorusGain.gain.setValueAtTime(value, this.audioContext.currentTime);
                            }
                        } else if (prop === 'rate') {
                            // Update chorus LFO rate
                            if (this.chorusLFO) {
                                this.chorusLFO.frequency.setValueAtTime(value, this.audioContext.currentTime);
                            }
                            ('🔧 Chorus rate updated to:', value);
                        } else if (prop === 'depth') {
                            // Update chorus modulation depth
                            if (this.chorusLFOGain) {
                                // Scale depth to appropriate modulation range (0-10ms)
                                const modulationDepth = value * 0.01; // Convert to 0-10ms range
                                this.chorusLFOGain.gain.setValueAtTime(modulationDepth, this.audioContext.currentTime);
                            }
                            ('🔧 Chorus depth updated to:', value);
                        }
                    }
                    
                    (`🔧 Effects: Updated ${effect}.${prop} to ${value}`);
                } else {
                    // Handle legacy direct effect parameters
                    this.params[param] = value;
                    (`🔧 Effects: Updated ${param} to ${value}`);
                }
            } else if (section === 'masterVolume') {
                this.params.masterVolume = value;
                this.masterGain.gain.setValueAtTime(value, this.audioContext.currentTime);
            }
        } catch (error) {
            // console.error('❌ Error updating parameter:', error);
        }
    }
    
    updateLFOModulation() {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        (`🔧 updateLFOModulation: Starting - LFO Amount: ${this.params.lfoAmount}, Rate: ${this.params.lfoRate}, ToFilter: ${this.params.lfoToFilter}`);
        
        // Update LFO to filter modulation for main filter
        if (this.filterLFOGain) {
            const filterModAmount = this.params.lfoToFilter * this.params.lfoAmount;
            this.filterLFOGain.gain.setValueAtTime(filterModAmount, now);
            
            // Calculate the actual frequency modulation range
            const baseFreq = this.params.cutoff * 2000;
            const modRange = baseFreq * filterModAmount;
            const minFreq = baseFreq - modRange;
            const maxFreq = baseFreq + modRange;
            
            (`🔧 updateLFOModulation: Updated main filter LFO gain to ${filterModAmount}`);
            (`🔧 Filter Frequency Modulation: Base: ${baseFreq}Hz, Range: ±${modRange}Hz (${minFreq}Hz - ${maxFreq}Hz)`);
        }
        
        // Update LFO modulation for all active voices
        let updatedVoices = 0;
        this.activeVoices.forEach(voice => {
            if (voice.lfoComponents && voice.lfoComponents.gain) {
                // Update LFO amount for individual voice
                voice.lfoComponents.gain.gain.setValueAtTime(this.params.lfoAmount, now);
                
                // Update LFO frequency for individual voice
                if (voice.lfoComponents.osc) {
                    voice.lfoComponents.osc.frequency.setValueAtTime(this.params.lfoRate, now);
                }
                
                // Update LFO waveform for individual voice
                if (voice.lfoComponents.osc) {
                    voice.lfoComponents.osc.type = this.params.lfoWaveform;
                }
                
                // Update LFO smoothing for individual voice
                if (voice.lfoComponents.smoothing) {
                    voice.lfoComponents.smoothing.frequency.setValueAtTime(this.params.lfoRate * 2, now);
                }
                updatedVoices++;
                (`🔧 updateLFOModulation: Updated voice ${voice.id} LFO - Amount: ${this.params.lfoAmount}, Rate: ${this.params.lfoRate}`);
            } else {
                (`🔧 updateLFOModulation: Voice ${voice.id} has no LFO components`);
            }
        });
        
        (`🔧 LFO Modulation Updated - Filter: ${this.params.lfoToFilter * this.params.lfoAmount}, Pitch: ${this.params.lfoToPitch * this.params.lfoAmount}, Amplitude: ${this.params.lfoToAmplitude * this.params.lfoAmount}`);
        (`🔧 Updated LFO for ${updatedVoices} active voices (LFO Amount: ${this.params.lfoAmount}, Rate: ${this.params.lfoRate}, Waveform: ${this.params.lfoWaveform})`);
    }
    
    updateEnvelopeModulation() {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        
        // Update envelope modulation for all active voices
        let updatedVoices = 0;
        this.activeVoices.forEach(voice => {
            if (voice.filter && this.params.envelopeAmount > 0) {
                // Recalculate filter envelope for the voice
                const filterEnvAmount = this.params.envelopeAmount;
                const baseFreq = this.params.cutoff * 2000;
                const maxFreq = baseFreq * (1 + filterEnvAmount);
                
                // Update the current filter frequency based on envelope amount
                const currentFreq = voice.filter.frequency.value;
                const newFreq = baseFreq + (maxFreq - baseFreq) * filterEnvAmount;
                voice.filter.frequency.setValueAtTime(newFreq, now);
                updatedVoices++;
            }
        });
        
        (`🔧 Envelope Modulation Updated - Amount: ${this.params.envelopeAmount}`);
        (`🔧 Updated envelope modulation for ${updatedVoices} active voices (Envelope Amount: ${this.params.envelopeAmount})`);
    }
    
    noteOn(note, velocity = 0.8) {
        if (!this.audioContext || !this.masterGain) {
            // console.error('❌ noteOn: audioContext or masterGain is null');
            // console.error('❌ audioContext:', this.audioContext);
            // console.error('❌ masterGain:', this.masterGain);
            return;
        }
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            ('🔄 Audio context suspended, attempting to resume...');
            this.audioContext.resume().then(() => {
                ('✅ Audio context resumed, retrying noteOn...');
                this.noteOn(note, velocity); // Recursive call after resume
            }).catch(error => {
                // console.error('❌ Failed to resume audio context:', error);
            });
            return;
        }
        
        // Safety check: if note is already playing, stop it first
        if (this.activeVoices.has(note)) {
            (`🔄 Note ${note} already playing, stopping existing voice first`);
            this.noteOff(note);
        }
        
        (`🎵 noteOn: Creating voice for note ${note} with velocity ${velocity}`);
        (`🎵 Audio context state: ${this.audioContext.state}`);
        (`🎵 Master gain value: ${this.masterGain.gain.value}`);
        
        try {
            const voice = this.createVoice(note, velocity);
            this.activeVoices.set(note, voice);
            
            // Set a timeout to automatically clean up this voice if it gets stuck
            voice.timeoutId = setTimeout(() => {
                if (this.activeVoices.has(note)) {
                    (`⏰ Voice timeout: Auto-cleaning up stuck voice ${voice.id} for note ${note}`);
                    this.noteOff(note);
                }
            }, 10000); // 10 second timeout
            
            (`🎵 Note ${note} started, voice ID: ${voice.id}`);
        } catch (error) {
            // console.error('❌ Error starting note:', error);
        }
    }
    
    noteOff(note) {
        const voice = this.activeVoices.get(note);
        if (voice) {
            // Clear the timeout since we're stopping the voice normally
            if (voice.timeoutId) {
                clearTimeout(voice.timeoutId);
                voice.timeoutId = null;
            }
            
            // Apply release envelope to prevent clicking
            this.applyReleaseEnvelope(voice);
            
            (`🔇 Note ${note} release started`);
        } else {
            (`🔇 Note ${note} was not playing`);
        }
    }
    
    applyReleaseEnvelope(voice) {
        const now = this.audioContext.currentTime;
        const releaseTime = this.params.release;
        
        (`🔧 applyReleaseEnvelope: Starting release for voice ${voice.id}, release time: ${releaseTime}s`);
        
        // Apply release envelope to gain node
        if (voice.gain && voice.gain.gain) {
            // Cancel any existing scheduled values
            voice.gain.gain.cancelScheduledValues(now);
            // Set current value as starting point
            const currentGain = voice.gain.gain.value;
            voice.gain.gain.setValueAtTime(currentGain, now);
            
            // Use linear ramp to zero for clean cutoff
            voice.gain.gain.linearRampToValueAtTime(0, now + releaseTime);
            
            // Immediately set to zero after ramp completes to prevent any residual signal
            voice.gain.gain.setValueAtTime(0, now + releaseTime + 0.001);
            
            (`🔧 applyReleaseEnvelope: Gain envelope set to linear fade to 0 over ${releaseTime}s`);
        }
        
        // Apply release envelope to filter if it exists
        if (voice.filter && voice.filter.frequency && this.params.envelopeAmount > 0) {
            const filterRelease = this.params.filterRelease;
            const baseFreq = this.params.cutoff * 2000;
            
            // Cancel any existing scheduled values
            voice.filter.frequency.cancelScheduledValues(now);
            // Set current value as starting point
            voice.filter.frequency.setValueAtTime(voice.filter.frequency.value, now);
            // Use linear ramp for filter transition
            voice.filter.frequency.linearRampToValueAtTime(baseFreq, now + filterRelease);
            (`🔧 applyReleaseEnvelope: Filter envelope set to linear fade to ${baseFreq}Hz over ${filterRelease}s`);
        }
        
        // Schedule the actual stopping of oscillators after release completes
        setTimeout(() => {
            this.stopVoiceImmediately(voice);
            this.activeVoices.delete(voice.note);
            (`🔇 Voice ${voice.id} fully stopped after release envelope`);
        }, releaseTime * 1000 + 10); // Small buffer to ensure envelope completes
    }
    
    stopVoiceImmediately(voice) {
        const now = this.audioContext.currentTime;
        
        (`🔇 stopVoiceImmediately: Immediately stopping voice ${voice.id} for note ${voice.note}`);
        
        try {
            // Stop oscillators immediately
            voice.oscillators.forEach(oscObj => {
                try {
                    if (oscObj.osc) {
                        oscObj.osc.stop(now);
                        oscObj.osc.disconnect();
                    }
                    if (oscObj.filter) {
                        oscObj.filter.disconnect();
                    }
                } catch (error) {
                    console.warn(`⚠️ stopVoiceImmediately: Error with oscillator:`, error);
                }
            });
            
            // Stop noise components
            if (voice.noise) {
                try {
                    if (voice.noise.osc1) {
                        voice.noise.osc1.stop(now);
                        voice.noise.osc1.disconnect();
                    }
                    if (voice.noise.osc2) {
                        voice.noise.osc2.stop(now);
                        voice.noise.osc2.disconnect();
                    }
                    if (voice.noise.osc3) {
                        voice.noise.osc3.stop(now);
                        voice.noise.osc3.disconnect();
                    }
                    if (voice.noise.mixer) voice.noise.mixer.disconnect();
                    if (voice.noise.filter) voice.noise.filter.disconnect();
                } catch (error) {
                    console.warn(`⚠️ stopVoiceImmediately: Error with noise:`, error);
                }
            }
            
            // Stop LFO components
            if (voice.lfoComponents) {
                try {
                    if (voice.lfoComponents.osc) {
                        voice.lfoComponents.osc.stop(now);
                        voice.lfoComponents.osc.disconnect();
                    }
                    if (voice.lfoComponents.gain) voice.lfoComponents.gain.disconnect();
                    if (voice.lfoComponents.smoothing) voice.lfoComponents.smoothing.disconnect();
                } catch (error) {
                    console.warn(`⚠️ stopVoiceImmediately: Error with LFO:`, error);
                }
            } else if (voice.lfo) {
                try {
                    voice.lfo.stop(now);
                    voice.lfo.disconnect();
                } catch (error) {
                    console.warn(`⚠️ stopVoiceImmediately: Error with LFO:`, error);
                }
            }
            
            // Disconnect filter and gain
            if (voice.filter) {
                try {
                    voice.filter.disconnect();
                } catch (error) {
                    console.warn(`⚠️ stopVoiceImmediately: Error disconnecting filter:`, error);
                }
            }
            
            if (voice.gain) {
                try {
                    voice.gain.disconnect();
                } catch (error) {
                    console.warn(`⚠️ stopVoiceImmediately: Error disconnecting voice gain:`, error);
                }
            }
            
            (`✅ stopVoiceImmediately: Voice ${voice.id} immediately stopped and cleaned up`);
        } catch (error) {
            console.warn(`⚠️ stopVoiceImmediately: Error during cleanup:`, error);
        }
    }
    
    stopVoiceSmoothly(voice) {
        const now = this.audioContext.currentTime;
        
        (`🔇 stopVoiceSmoothly: Smoothly stopping voice ${voice.id} for note ${voice.note}`);
        
        // Apply a very short fade-out to oscillators before stopping them
        const fadeTime = 0.01; // 10ms fade-out
        
        try {
            // Disconnect oscillators with a very short fade
            voice.oscillators.forEach(oscObj => {
                try {
                    if (oscObj.osc) {
                        // Create a temporary gain node for smooth stopping
                        const tempGain = this.audioContext.createGain();
                        tempGain.gain.setValueAtTime(1, now);
                        tempGain.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
                        
                        // Disconnect from current chain and connect through temp gain
                        oscObj.osc.disconnect();
                        oscObj.osc.connect(tempGain);
                        tempGain.connect(oscObj.filter);
                        
                        // Stop oscillator after fade
                        setTimeout(() => {
                            try {
                                oscObj.osc.stop();
                                oscObj.osc.disconnect();
                                tempGain.disconnect();
                            } catch (e) {
                                // Oscillator might already be stopped
                            }
                        }, fadeTime * 1000);
                    }
                    
                    // Disconnect the filter
                    if (oscObj.filter) {
                        setTimeout(() => {
                            try {
                                oscObj.filter.disconnect();
                            } catch (e) {
                                // Filter might already be disconnected
                            }
                        }, fadeTime * 1000);
                    }
                } catch (error) {
                    console.warn(`⚠️ stopVoiceSmoothly: Error with oscillator:`, error);
                }
            });
            
            // Handle noise components
            if (voice.noise) {
                try {
                    if (voice.noise.osc1) {
                        voice.noise.osc1.stop(now + fadeTime);
                        setTimeout(() => voice.noise.osc1.disconnect(), fadeTime * 1000);
                    }
                    if (voice.noise.osc2) {
                        voice.noise.osc2.stop(now + fadeTime);
                        setTimeout(() => voice.noise.osc2.disconnect(), fadeTime * 1000);
                    }
                    if (voice.noise.osc3) {
                        voice.noise.osc3.stop(now + fadeTime);
                        setTimeout(() => voice.noise.osc3.disconnect(), fadeTime * 1000);
                    }
                    
                    setTimeout(() => {
                        if (voice.noise.mixer) voice.noise.mixer.disconnect();
                        if (voice.noise.filter) voice.noise.filter.disconnect();
                    }, fadeTime * 1000);
                } catch (error) {
                    console.warn(`⚠️ stopVoiceSmoothly: Error with noise:`, error);
                }
            }
            
            // Handle LFO components
            if (voice.lfoComponents) {
                try {
                    if (voice.lfoComponents.osc) {
                        voice.lfoComponents.osc.stop(now + fadeTime);
                        setTimeout(() => voice.lfoComponents.osc.disconnect(), fadeTime * 1000);
                    }
                    setTimeout(() => {
                        if (voice.lfoComponents.gain) voice.lfoComponents.gain.disconnect();
                        if (voice.lfoComponents.smoothing) voice.lfoComponents.smoothing.disconnect();
                    }, fadeTime * 1000);
                } catch (error) {
                    console.warn(`⚠️ stopVoiceSmoothly: Error with LFO:`, error);
                }
            } else if (voice.lfo) {
                try {
                    voice.lfo.stop(now + fadeTime);
                    setTimeout(() => voice.lfo.disconnect(), fadeTime * 1000);
                } catch (error) {
                    console.warn(`⚠️ stopVoiceSmoothly: Error with LFO:`, error);
                }
            }
            
            // Disconnect filter and gain after fade
            setTimeout(() => {
                try {
                    if (voice.filter) voice.filter.disconnect();
                    if (voice.gain) voice.gain.disconnect();
                } catch (error) {
                    console.warn(`⚠️ stopVoiceSmoothly: Error disconnecting filter/gain:`, error);
                }
            }, fadeTime * 1000);
            
            (`✅ stopVoiceSmoothly: Voice ${voice.id} smoothly stopped`);
        } catch (error) {
            console.warn(`⚠️ stopVoiceSmoothly: Error during smooth cleanup:`, error);
        }
    }
    
    createVoice(note, velocity) {
        (`🔧 createVoice: Creating voice for note ${note}`);
        
        const voice = {
            id: ++this.voiceId,
            note,
            velocity,
            oscillators: [],
            noise: null,
            lfo: null,
            gain: null,
            filter: null
        };
        
        const now = this.audioContext.currentTime;
        (`🔧 createVoice: Audio context time: ${now}`);
        
        // Create voice gain and filter FIRST
        voice.gain = this.audioContext.createGain();
        voice.gain.gain.setValueAtTime(0, now);
        (`🔧 createVoice: Created voice gain node`);
        
        // Create filter for this voice (for individual voice filtering)
        voice.filter = this.audioContext.createBiquadFilter();
        voice.filter.type = this.params.filterType; // Use current filter type parameter
        voice.filter.frequency.setValueAtTime(this.params.cutoff * 2000, now); // Convert normalized value to Hz
        voice.filter.Q.setValueAtTime(this.params.resonance * 3, now); // Reduced from 10x to 3x to prevent harsh ringing
        (`🔧 createVoice: Created voice filter node with type: ${this.params.filterType}`);
        
        // Create oscillators AFTER gain and filter are ready
        this.createOscillators(voice, now);
        (`🔧 createVoice: Created ${voice.oscillators.length} oscillators`);
        
        // Create noise
        this.createNoise(voice, now);
        
        // NOW create LFO (after filter exists)
        this.createLFO(voice, now);
        (`🔧 createVoice: LFO creation completed`);
        
        // Oscillators are already connected to voice filter in createOscillators method
        
        if (voice.noise) {
            voice.noise.filter.connect(voice.filter); // Individual voice filter
            (`🔧 createVoice: Connected filtered noise to voice filter`);
        }
        
        // Connect voice filter to voice gain
        voice.filter.connect(voice.gain);
        (`🔧 createVoice: Connected voice filter to voice gain`);
        
        // Connect voice gain to the main ladder filter input (Mini Moog signal chain)
        voice.gain.connect(this.effectsInput);
        (`🔧 createVoice: Connected voice gain to main ladder filter input`);
        
        // Debug: Check voice gain initial value
        (`🔧 createVoice: Voice gain initial value: ${voice.gain.gain.value}`);
        (`🔧 createVoice: Voice velocity: ${voice.velocity}`);
        
        // Apply envelopes
        this.applyEnvelopes(voice, now);
        (`🔧 createVoice: Applied envelopes`);
        
        // Debug: Check voice gain after envelope
        (`🔧 createVoice: Voice gain after envelope: ${voice.gain.gain.value}`);
        
        (`🔧 createVoice: Voice creation complete for note ${note}`);
        (`🔧 createVoice: Voice components:`, {
            oscillators: voice.oscillators.length,
            filter: !!voice.filter,
            gain: !!voice.gain,
            lfo: !!voice.lfo,
            noise: !!voice.noise
        });
        return voice;
    }
    
    createOscillators(voice, now) {
        (`🔧 createOscillators: Starting for note ${voice.note}`);
        const noteFreq = 440 * Math.pow(2, (voice.note - 69) / 12);
        (`🔧 createOscillators: Calculated frequency: ${noteFreq}Hz`);
        
        // OSC 1
        const osc1 = this.audioContext.createOscillator();
        const osc1Freq = noteFreq * Math.pow(2, this.params.osc1.octave) * Math.pow(2, this.params.osc1.tune / 1200);
        osc1.frequency.setValueAtTime(osc1Freq, now);
        osc1.type = this.params.osc1.waveform;
        
        // Add anti-aliasing filter for OSC1
        const osc1Filter = this.audioContext.createBiquadFilter();
        osc1Filter.type = 'lowpass';
        osc1Filter.frequency.setValueAtTime(Math.min(osc1Freq * 4, 8000), now); // 4x fundamental, max 8kHz
        osc1Filter.Q.setValueAtTime(0.7, now);
        
        (`🔧 createOscillators: OSC1 - freq: ${osc1Freq}Hz, type: ${this.params.osc1.waveform}, level: ${this.params.osc1.level}`);
        
        // Connect oscillator to its filter
        osc1.connect(osc1Filter);
        
        // Connect to voice filter immediately to prevent clicking
        osc1Filter.connect(voice.filter);
        
        // Start oscillator after connections are made
        osc1.start(now);
        
        // Store both oscillator and filter for proper cleanup
        voice.oscillators.push({ osc: osc1, filter: osc1Filter });
        
        // OSC 2
        const osc2 = this.audioContext.createOscillator();
        const osc2Freq = noteFreq * Math.pow(2, this.params.osc2.octave) * Math.pow(2, this.params.osc2.tune / 1200);
        osc2.frequency.setValueAtTime(osc2Freq, now);
        osc2.type = this.params.osc2.waveform;
        
        // Add anti-aliasing filter for OSC2
        const osc2Filter = this.audioContext.createBiquadFilter();
        osc2Filter.type = 'lowpass';
        osc2Filter.frequency.setValueAtTime(Math.min(osc2Freq * 4, 8000), now);
        osc2Filter.Q.setValueAtTime(0.7, now);
        
        (`🔧 createOscillators: OSC2 - freq: ${osc2Freq}Hz, type: ${this.params.osc2.waveform}, level: ${this.params.osc2.level}`);
        
        // Connect oscillator to its filter
        osc2.connect(osc2Filter);
        
        // Connect to voice filter immediately to prevent clicking
        osc2Filter.connect(voice.filter);
        
        // Start oscillator after connections are made
        osc2.start(now);
        
        // Store both oscillator and filter for proper cleanup
        voice.oscillators.push({ osc: osc2, filter: osc2Filter });
        
        // OSC 3
        const osc3 = this.audioContext.createOscillator();
        const osc3Freq = noteFreq * Math.pow(2, this.params.osc3.octave) * Math.pow(2, this.params.osc3.tune / 1200);
        osc3.frequency.setValueAtTime(osc3Freq, now);
        osc3.type = this.params.osc3.waveform;
        
        // Add anti-aliasing filter for OSC3
        const osc3Filter = this.audioContext.createBiquadFilter();
        osc3Filter.type = 'lowpass';
        osc3Filter.frequency.setValueAtTime(Math.min(osc3Freq * 4, 8000), now);
        osc3Filter.Q.setValueAtTime(0.7, now);
        
        (`🔧 createOscillators: OSC3 - freq: ${osc3Freq}Hz, type: ${this.params.osc3.waveform}, level: ${this.params.osc3.level}`);
        
        // Connect oscillator to its filter
        osc3.connect(osc3Filter);
        
        // Connect to voice filter immediately to prevent clicking
        osc3Filter.connect(voice.filter);
        
        // Start oscillator after connections are made
        osc3.start(now);
        
        // Store both oscillator and filter for proper cleanup
        voice.oscillators.push({ osc: osc3, filter: osc3Filter });
        
        (`🔧 createOscillators: Completed for note ${voice.note}`);
    }
    
    createNoise(voice, now) {
        if (this.params.noise > 0) {
            // Create smoother, more musical noise using filtered oscillators
            const noiseOsc1 = this.audioContext.createOscillator();
            const noiseOsc2 = this.audioContext.createOscillator();
            const noiseOsc3 = this.audioContext.createOscillator();
            
            // Use different frequencies for layered noise
            noiseOsc1.frequency.setValueAtTime(200 + Math.random() * 100, now);
            noiseOsc2.frequency.setValueAtTime(400 + Math.random() * 200, now);
            noiseOsc3.frequency.setValueAtTime(800 + Math.random() * 400, now);
            
            noiseOsc1.type = 'sawtooth';
            noiseOsc2.type = 'sawtooth';
            noiseOsc3.type = 'sawtooth';
            
            // Create noise mixer
            const noiseMixer = this.audioContext.createGain();
            noiseMixer.gain.setValueAtTime(this.params.noise * 0.3, now);
            
            // Create noise filter to remove harsh frequencies
            const noiseFilter = this.audioContext.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(300, now);
            noiseFilter.Q.setValueAtTime(1, now);
            
            // Connect noise chain
            noiseOsc1.connect(noiseMixer);
            noiseOsc2.connect(noiseMixer);
            noiseOsc3.connect(noiseMixer);
            noiseMixer.connect(noiseFilter);
            
            // Store references for cleanup
            voice.noise = {
                osc1: noiseOsc1,
                osc2: noiseOsc2,
                osc3: noiseOsc3,
                mixer: noiseMixer,
                filter: noiseFilter
            };
            
            // Start oscillators
            noiseOsc1.start(now);
            noiseOsc2.start(now);
            noiseOsc3.start(now);
        }
    }
    
    createLFO(voice, now) {
        (`🔧 createLFO: Starting for voice ${voice.id} - LFO Amount: ${this.params.lfoAmount}, Rate: ${this.params.lfoRate}, Waveform: ${this.params.lfoWaveform}`);
        
        if (this.params.lfoAmount > 0 && voice.filter) {
            (`🔧 createLFO: Creating LFO for voice ${voice.id}`);
            
            voice.lfo = this.audioContext.createOscillator();
            voice.lfo.frequency.setValueAtTime(this.params.lfoRate, now);
            voice.lfo.type = this.params.lfoWaveform;
            
            const lfoGain = this.audioContext.createGain();
            lfoGain.gain.setValueAtTime(this.params.lfoAmount, now);
            
            // Add smoothing to LFO modulation to prevent harsh changes
            const lfoSmoothing = this.audioContext.createBiquadFilter();
            lfoSmoothing.type = 'lowpass';
            lfoSmoothing.frequency.setValueAtTime(this.params.lfoRate * 2, now); // Smooth at 2x LFO rate
            lfoSmoothing.Q.setValueAtTime(0.7, now);
            
            voice.lfo.connect(lfoGain);
            lfoGain.connect(lfoSmoothing);
            lfoSmoothing.connect(voice.filter.frequency);
            (`🔧 createLFO: Connected smoothed LFO to voice filter frequency - Amount: ${this.params.lfoAmount}, Rate: ${this.params.lfoRate}`);
            
            // Also modulate the main ladder filter for global LFO modulation
            if (this.filterLFOGain) {
                const mainLfoGain = this.audioContext.createGain();
                mainLfoGain.gain.setValueAtTime(this.params.lfoAmount * 0.5, now); // Slightly less modulation on main filter
                
                voice.lfo.connect(mainLfoGain);
                mainLfoGain.connect(lfoSmoothing);
                lfoSmoothing.connect(this.mainFilter.frequency);
                
                (`🔧 createLFO: Connected LFO to main ladder filter frequency`);
            }
            
            // Store LFO components for cleanup
            voice.lfoComponents = {
                osc: voice.lfo,
                gain: lfoGain,
                smoothing: lfoSmoothing
            };
            
            voice.lfo.start(now);
            (`🔧 createLFO: LFO started for voice ${voice.id} - Amount: ${this.params.lfoAmount}, Rate: ${this.params.lfoRate}`);
        } else {
            (`🔧 createLFO: Skipping LFO creation - Amount: ${this.params.lfoAmount}, Has Filter: ${!!voice.filter}`);
        }
    }
    
    applyEnvelopes(voice, now) {
        (`🔧 applyEnvelopes: Starting for voice ${voice.id}`);
        
        // Amplitude envelope
        const attackTime = this.params.attack;
        const decayTime = this.params.decay;
        const sustainLevel = this.params.sustain;
        const releaseTime = this.params.release;
        
        (`🔧 applyEnvelopes: Attack: ${attackTime}s, Decay: ${decayTime}s, Sustain: ${sustainLevel}, Release: ${releaseTime}s`);
        
        // Set initial gain to a very small value to prevent clicks but allow immediate sound
        const initialGain = voice.velocity * 0.01; // 1% of velocity
        voice.gain.gain.setValueAtTime(initialGain, now);
        (`🔧 applyEnvelopes: Set initial gain to ${initialGain} to prevent clicks`);
        
        // Attack - use linear ramp for clean attack, starting immediately
        voice.gain.gain.linearRampToValueAtTime(voice.velocity, now + attackTime);
        (`🔧 applyEnvelopes: Linear attack ramp to ${voice.velocity} at ${now + attackTime}`);
        
        // Decay - use linear ramp for clean decay
        voice.gain.gain.linearRampToValueAtTime(sustainLevel * voice.velocity, now + attackTime + decayTime);
        (`🔧 applyEnvelopes: Linear decay ramp to ${sustainLevel * voice.velocity} at ${now + attackTime + decayTime}`);
        
        // Release (will be set when noteOff is called)
        voice.releaseTime = releaseTime;
        
        // Filter envelope
        if (this.params.envelopeAmount > 0 && voice.filter) {
            const filterAttack = this.params.filterAttack;
            const filterDecay = this.params.filterDecay;
            const filterSustain = this.params.filterSustain;
            const filterRelease = this.params.filterRelease;
            
            (`🔧 applyEnvelopes: Filter envelope - Attack: ${filterAttack}s, Decay: ${filterDecay}s, Sustain: ${filterSustain}, Release: ${filterRelease}s`);
            
            const filterEnvAmount = this.params.envelopeAmount;
            const baseFreq = this.params.cutoff * 2000; // Convert normalized value to Hz
            const maxFreq = baseFreq * (1 + filterEnvAmount);
            
            // Set initial filter frequency
            voice.filter.frequency.setValueAtTime(baseFreq, now);
            (`🔧 applyEnvelopes: Set initial voice filter frequency to ${baseFreq}Hz`);
            
            // Filter attack - use linear ramp for clean transition
            voice.filter.frequency.linearRampToValueAtTime(maxFreq, now + filterAttack);
            (`🔧 applyEnvelopes: Linear filter attack ramp to ${maxFreq}Hz at ${now + filterAttack}`);
            
            // Filter decay - use linear ramp for clean transition
            voice.filter.frequency.linearRampToValueAtTime(baseFreq + (maxFreq - baseFreq) * filterSustain, now + attackTime + filterDecay);
            (`🔧 applyEnvelopes: Linear filter decay ramp to ${baseFreq + (maxFreq - baseFreq) * filterSustain}Hz at ${now + attackTime + filterDecay}`);
            
            voice.filterReleaseTime = filterRelease;
            
            // Also modulate the main ladder filter for global filter envelope
            if (this.filterEnvelopeGain) {
                const mainBaseFreq = this.params.cutoff * 2000;
                const mainMaxFreq = mainBaseFreq * (1 + filterEnvAmount);
                
                // Set initial main filter frequency
                this.mainFilter.frequency.setValueAtTime(mainBaseFreq, now);
                
                // Main filter attack
                this.mainFilter.frequency.linearRampToValueAtTime(mainMaxFreq, now + filterAttack);
                
                // Main filter decay
                this.mainFilter.frequency.linearRampToValueAtTime(mainBaseFreq + (mainMaxFreq - mainBaseFreq) * filterSustain, now + attackTime + filterDecay);
                
                (`🔧 applyEnvelopes: Applied filter envelope to main ladder filter`);
            }
        }
        
        (`🔧 applyEnvelopes: Completed for voice ${voice.id}`);
    }
    
    stopVoice(voice) {
        const now = this.audioContext.currentTime;
        
        (`🔇 stopVoice: Stopping voice ${voice.id} for note ${voice.note}`);
        
        // Immediately disconnect all audio nodes to prevent stuck audio
        try {
            // Disconnect oscillators immediately
            voice.oscillators.forEach(oscObj => {
                try {
                    // Stop the oscillator
                    if (oscObj.osc) {
                        oscObj.osc.stop(now);
                        oscObj.osc.disconnect();
                    }
                    // Disconnect the filter
                    if (oscObj.filter) {
                        oscObj.filter.disconnect();
                    }
                    (`🔇 stopVoice: Stopped and disconnected oscillator and filter`);
                } catch (error) {
                    console.warn(`⚠️ stopVoice: Error with oscillator:`, error);
                }
            });
            
            // Disconnect noise immediately
            if (voice.noise) {
                try {
                    // Stop and disconnect all noise oscillators
                    if (voice.noise.osc1) {
                        voice.noise.osc1.stop(now);
                        voice.noise.osc1.disconnect();
                    }
                    if (voice.noise.osc2) {
                        voice.noise.osc2.stop(now);
                        voice.noise.osc2.disconnect();
                    }
                    if (voice.noise.osc3) {
                        voice.noise.osc3.stop(now);
                        voice.noise.osc3.disconnect();
                    }
                    
                    // Disconnect noise mixer and filter
                    if (voice.noise.mixer) voice.noise.mixer.disconnect();
                    if (voice.noise.filter) voice.noise.filter.disconnect();
                    
                    (`🔇 stopVoice: Stopped and disconnected noise components`);
                } catch (error) {
                    console.warn(`⚠️ stopVoice: Error with noise:`, error);
                }
            }
            
            // Disconnect LFO immediately
            if (voice.lfoComponents) {
                try {
                    if (voice.lfoComponents.osc) {
                        voice.lfoComponents.osc.stop(now);
                        voice.lfoComponents.osc.disconnect();
                    }
                    if (voice.lfoComponents.gain) {
                        voice.lfoComponents.gain.disconnect();
                    }
                    if (voice.lfoComponents.smoothing) {
                        voice.lfoComponents.smoothing.disconnect();
                    }
                    (`🔇 stopVoice: Stopped and disconnected LFO components`);
                } catch (error) {
                    console.warn(`⚠️ stopVoice: Error with LFO:`, error);
                }
            } else if (voice.lfo) {
                // Fallback for old LFO structure
                try {
                    voice.lfo.stop(now);
                    voice.lfo.disconnect();
                    (`🔇 stopVoice: Stopped and disconnected LFO (fallback)`);
                } catch (error) {
                    console.warn(`⚠️ stopVoice: Error with LFO:`, error);
                }
            }
            
            // Disconnect filter and gain immediately
            if (voice.filter) {
                try {
                    voice.filter.disconnect();
                    (`🔇 stopVoice: Disconnected filter`);
                } catch (error) {
                    console.warn(`⚠️ stopVoice: Error disconnecting filter:`, error);
                }
            }
            
            if (voice.gain) {
                try {
                    voice.gain.disconnect();
                    (`🔇 stopVoice: Disconnected voice gain`);
                } catch (error) {
                    console.warn(`⚠️ stopVoice: Error disconnecting voice gain:`, error);
                }
            }
            
            (`✅ stopVoice: Voice ${voice.id} immediately stopped and cleaned up`);
        } catch (error) {
            // console.error(`❌ stopVoice: Error during cleanup:`, error);
        }
    }
    
    stopAllVoices() {
        (`🔇 stopAllVoices: Stopping all ${this.activeVoices.size} active voices`);
        
        const notes = Array.from(this.activeVoices.keys());
        notes.forEach(note => {
            this.noteOff(note);
        });
        
        // Clear the active voices map
        this.activeVoices.clear();
        (`✅ stopAllVoices: All voices stopped and cleared`);
    }
    
    getVoiceCount() {
        return this.activeVoices.size;
    }
    
    getActiveNotes() {
        return Array.from(this.activeVoices.keys());
    }
    
    getMasterGain() {
        return this.masterGain;
    }
    
    getDrumMachineOutput() {
        return this.drumMachineOutput;
    }
    
    setDrumMachineVolume(volume) {
        if (this.drumMachineOutput) {
            this.drumMachineOutput.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }
    
    getAudioContext() {
        return this.audioContext;
    }
    
    getAnalyser() {
        return this.analyser;
    }
    
    // Simple test tone to verify audio chain
    playSimpleTestTone() {
        if (!this.audioContext || !this.masterGain) {
            // console.error('❌ playSimpleTestTone: audioContext or masterGain is null');
            return;
        }
        
        ('🧪 playSimpleTestTone: Starting simple test tone');
        ('🧪 Audio context state:', this.audioContext.state);
        ('🧪 Master gain value:', this.masterGain.gain.value);
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            ('🔄 Audio context suspended, attempting to resume...');
            this.audioContext.resume().then(() => {
                ('✅ Audio context resumed, playing test tone...');
                this.playSimpleTestTone();
            }).catch(error => {
                // console.error('❌ Failed to resume audio context:', error);
            });
            return;
        }
        
        try {
            // Create a simple oscillator
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Set up the oscillator
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
            oscillator.type = 'sine';
            
            // Set up the gain
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
            
            // Connect the chain
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            ('🧪 Test tone audio chain: oscillator → gain → masterGain → destination');
            ('🧪 Master gain connections:', this.masterGain.numberOfInputs, 'inputs,', this.masterGain.numberOfOutputs, 'outputs');
            
            // Start the oscillator
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 2);
            
            ('✅ Simple test tone started - you should hear a 2-second A4 note');
            
        } catch (error) {
            // console.error('❌ Error playing simple test tone:', error);
        }
    }
}