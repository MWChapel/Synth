export class SampleLoader {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.samples = {};
        this.cache = new Map(); // In-memory cache for decoded audio buffers
        this.cacheVersion = '1.0'; // Version for cache invalidation
        this.samplePaths = {
            kick: '/samples/tr808/Roland TR-808/BD/BD5050.WAV',        // Bass Drum - middle tuning, middle decay
            snare: '/samples/tr808/Roland TR-808/SD/SD5050.WAV',       // Snare Drum - middle tuning, middle snappy
            hihat: '/samples/tr808/Roland TR-808/CH/CH.WAV',           // Closed Hi-Hat (single sample)
            clap: '/samples/tr808/Roland TR-808/CP/CP.WAV',            // Hand Clap (single sample)
            lowTom: '/samples/tr808/Roland TR-808/LT/LT50.WAV',        // Low Tom - middle tuning
            highTom: '/samples/tr808/Roland TR-808/HT/HT50.WAV',       // High Tom - middle tuning
            rimShot: '/samples/tr808/Roland TR-808/RS/RS.WAV',         // Rim Shot (single sample)
            cowBell: '/samples/tr808/Roland TR-808/CB/CB.WAV',         // Cow Bell (single sample)
            cymbal: '/samples/tr808/Roland TR-808/CY/CY5050.WAV',      // Cymbal - middle tuning, middle decay
            openHihat: '/samples/tr808/Roland TR-808/OH/OH50.WAV',     // Open Hi-Hat - middle tuning
            lowConga: '/samples/tr808/Roland TR-808/LC/LC50.WAV',      // Low Conga - middle tuning
            maracas: '/samples/tr808/Roland TR-808/MA/MA.WAV',         // Maracas (single sample)
            midConga: '/samples/tr808/Roland TR-808/MC/MC50.WAV',      // Mid Conga - middle tuning
            midTom: '/samples/tr808/Roland TR-808/MT/MT50.WAV'         // Mid Tom - middle tuning
        };

        // Define available WAV variations for each drum
        this.wavVariations = {
            kick: [
                { name: 'BD0000', path: '/samples/tr808/Roland TR-808/BD/BD0000.WAV', label: 'Tune: 0, Decay: 0' },
                { name: 'BD0010', path: '/samples/tr808/Roland TR-808/BD/BD0010.WAV', label: 'Tune: 0, Decay: 10' },
                { name: 'BD0025', path: '/samples/tr808/Roland TR-808/BD/BD0025.WAV', label: 'Tune: 0, Decay: 25' },
                { name: 'BD0050', path: '/samples/tr808/Roland TR-808/BD/BD0050.WAV', label: 'Tune: 0, Decay: 50' },
                { name: 'BD0075', path: '/samples/tr808/Roland TR-808/BD/BD0075.WAV', label: 'Tune: 0, Decay: 75' },
                { name: 'BD1000', path: '/samples/tr808/Roland TR-808/BD/BD1000.WAV', label: 'Tune: 10, Decay: 0' },
                { name: 'BD1010', path: '/samples/tr808/Roland TR-808/BD/BD1010.WAV', label: 'Tune: 10, Decay: 10' },
                { name: 'BD1025', path: '/samples/tr808/Roland TR-808/BD/BD1025.WAV', label: 'Tune: 10, Decay: 25' },
                { name: 'BD1050', path: '/samples/tr808/Roland TR-808/BD/BD1050.WAV', label: 'Tune: 10, Decay: 50' },
                { name: 'BD1075', path: '/samples/tr808/Roland TR-808/BD/BD1075.WAV', label: 'Tune: 10, Decay: 75' },
                { name: 'BD2500', path: '/samples/tr808/Roland TR-808/BD/BD2500.WAV', label: 'Tune: 25, Decay: 0' },
                { name: 'BD2510', path: '/samples/tr808/Roland TR-808/BD/BD2510.WAV', label: 'Tune: 25, Decay: 10' },
                { name: 'BD2525', path: '/samples/tr808/Roland TR-808/BD/BD2525.WAV', label: 'Tune: 25, Decay: 25' },
                { name: 'BD2550', path: '/samples/tr808/Roland TR-808/BD/BD2550.WAV', label: 'Tune: 25, Decay: 50' },
                { name: 'BD2575', path: '/samples/tr808/Roland TR-808/BD/BD2575.WAV', label: 'Tune: 25, Decay: 75' },
                { name: 'BD5000', path: '/samples/tr808/Roland TR-808/BD/BD5000.WAV', label: 'Tune: 50, Decay: 0' },
                { name: 'BD5010', path: '/samples/tr808/Roland TR-808/BD/BD5010.WAV', label: 'Tune: 50, Decay: 10' },
                { name: 'BD5025', path: '/samples/tr808/Roland TR-808/BD/BD5025.WAV', label: 'Tune: 50, Decay: 25' },
                { name: 'BD5050', path: '/samples/tr808/Roland TR-808/BD/BD5050.WAV', label: 'Tune: 50, Decay: 50' },
                { name: 'BD5075', path: '/samples/tr808/Roland TR-808/BD/BD5075.WAV', label: 'Tune: 50, Decay: 75' },
                { name: 'BD7500', path: '/samples/tr808/Roland TR-808/BD/BD7500.WAV', label: 'Tune: 75, Decay: 0' },
                { name: 'BD7510', path: '/samples/tr808/Roland TR-808/BD/BD7510.WAV', label: 'Tune: 75, Decay: 10' },
                { name: 'BD7525', path: '/samples/tr808/Roland TR-808/BD/BD7525.WAV', label: 'Tune: 75, Decay: 25' },
                { name: 'BD7550', path: '/samples/tr808/Roland TR-808/BD/BD7550.WAV', label: 'Tune: 75, Decay: 50' },
                { name: 'BD7575', path: '/samples/tr808/Roland TR-808/BD/BD7575.WAV', label: 'Tune: 75, Decay: 75' }
            ],
            snare: [
                { name: 'SD0000', path: '/samples/tr808/Roland TR-808/SD/SD0000.WAV', label: 'Tune: 0, Snappy: 0' },
                { name: 'SD0010', path: '/samples/tr808/Roland TR-808/SD/SD0010.WAV', label: 'Tune: 0, Snappy: 10' },
                { name: 'SD0025', path: '/samples/tr808/Roland TR-808/SD/SD0025.WAV', label: 'Tune: 0, Snappy: 25' },
                { name: 'SD0050', path: '/samples/tr808/Roland TR-808/SD/SD0050.WAV', label: 'Tune: 0, Snappy: 50' },
                { name: 'SD0075', path: '/samples/tr808/Roland TR-808/SD/SD0075.WAV', label: 'Tune: 0, Snappy: 75' },
                { name: 'SD1000', path: '/samples/tr808/Roland TR-808/SD/SD1000.WAV', label: 'Tune: 10, Snappy: 0' },
                { name: 'SD1010', path: '/samples/tr808/Roland TR-808/SD/SD1010.WAV', label: 'Tune: 10, Snappy: 10' },
                { name: 'SD1025', path: '/samples/tr808/Roland TR-808/SD/SD1025.WAV', label: 'Tune: 10, Snappy: 25' },
                { name: 'SD1050', path: '/samples/tr808/Roland TR-808/SD/SD1050.WAV', label: 'Tune: 10, Snappy: 50' },
                { name: 'SD1075', path: '/samples/tr808/Roland TR-808/SD/SD1075.WAV', label: 'Tune: 10, Snappy: 75' },
                { name: 'SD2500', path: '/samples/tr808/Roland TR-808/SD/SD2500.WAV', label: 'Tune: 25, Snappy: 0' },
                { name: 'SD2510', path: '/samples/tr808/Roland TR-808/SD/SD2510.WAV', label: 'Tune: 25, Snappy: 10' },
                { name: 'SD2525', path: '/samples/tr808/Roland TR-808/SD/SD2525.WAV', label: 'Tune: 25, Snappy: 25' },
                { name: 'SD2550', path: '/samples/tr808/Roland TR-808/SD/SD2550.WAV', label: 'Tune: 25, Snappy: 50' },
                { name: 'SD2575', path: '/samples/tr808/Roland TR-808/SD/SD2575.WAV', label: 'Tune: 25, Snappy: 75' },
                { name: 'SD5000', path: '/samples/tr808/Roland TR-808/SD/SD5000.WAV', label: 'Tune: 50, Snappy: 0' },
                { name: 'SD5010', path: '/samples/tr808/Roland TR-808/SD/SD5010.WAV', label: 'Tune: 50, Snappy: 10' },
                { name: 'SD5025', path: '/samples/tr808/Roland TR-808/SD/SD5025.WAV', label: 'Tune: 50, Snappy: 25' },
                { name: 'SD5050', path: '/samples/tr808/Roland TR-808/SD/SD5050.WAV', label: 'Tune: 50, Snappy: 50' },
                { name: 'SD5075', path: '/samples/tr808/Roland TR-808/SD/SD5075.WAV', label: 'Tune: 50, Snappy: 75' },
                { name: 'SD7500', path: '/samples/tr808/Roland TR-808/SD/SD7500.WAV', label: 'Tune: 75, Snappy: 0' },
                { name: 'SD7510', path: '/samples/tr808/Roland TR-808/SD/SD7510.WAV', label: 'Tune: 75, Snappy: 10' },
                { name: 'SD7525', path: '/samples/tr808/Roland TR-808/SD/SD7525.WAV', label: 'Tune: 75, Snappy: 25' },
                { name: 'SD7550', path: '/samples/tr808/Roland TR-808/SD/SD7550.WAV', label: 'Tune: 75, Snappy: 50' },
                { name: 'SD7575', path: '/samples/tr808/Roland TR-808/SD/SD7575.WAV', label: 'Tune: 75, Snappy: 75' }
            ],
            cymbal: [
                { name: 'CY0000', path: '/samples/tr808/Roland TR-808/CY/CY0000.WAV', label: 'Tune: 0, Decay: 0' },
                { name: 'CY0010', path: '/samples/tr808/Roland TR-808/CY/CY0010.WAV', label: 'Tune: 0, Decay: 10' },
                { name: 'CY0025', path: '/samples/tr808/Roland TR-808/CY/CY0025.WAV', label: 'Tune: 0, Decay: 25' },
                { name: 'CY0050', path: '/samples/tr808/Roland TR-808/CY/CY0050.WAV', label: 'Tune: 0, Decay: 50' },
                { name: 'CY0075', path: '/samples/tr808/Roland TR-808/CY/CY0075.WAV', label: 'Tune: 0, Decay: 75' },
                { name: 'CY1000', path: '/samples/tr808/Roland TR-808/CY/CY1000.WAV', label: 'Tune: 10, Decay: 0' },
                { name: 'CY1010', path: '/samples/tr808/Roland TR-808/CY/CY1010.WAV', label: 'Tune: 10, Decay: 10' },
                { name: 'CY1025', path: '/samples/tr808/Roland TR-808/CY/CY1025.WAV', label: 'Tune: 10, Decay: 25' },
                { name: 'CY1050', path: '/samples/tr808/Roland TR-808/CY/CY1050.WAV', label: 'Tune: 10, Decay: 50' },
                { name: 'CY1075', path: '/samples/tr808/Roland TR-808/CY/CY1075.WAV', label: 'Tune: 10, Decay: 75' },
                { name: 'CY2500', path: '/samples/tr808/Roland TR-808/CY/CY2500.WAV', label: 'Tune: 25, Decay: 0' },
                { name: 'CY2510', path: '/samples/tr808/Roland TR-808/CY/CY2510.WAV', label: 'Tune: 25, Decay: 10' },
                { name: 'CY2525', path: '/samples/tr808/Roland TR-808/CY/CY2525.WAV', label: 'Tune: 25, Decay: 25' },
                { name: 'CY2550', path: '/samples/tr808/Roland TR-808/CY/CY2550.WAV', label: 'Tune: 25, Decay: 50' },
                { name: 'CY2575', path: '/samples/tr808/Roland TR-808/CY/CY2575.WAV', label: 'Tune: 25, Decay: 75' },
                { name: 'CY5000', path: '/samples/tr808/Roland TR-808/CY/CY5000.WAV', label: 'Tune: 50, Decay: 0' },
                { name: 'CY5010', path: '/samples/tr808/Roland TR-808/CY/CY5010.WAV', label: 'Tune: 50, Decay: 10' },
                { name: 'CY5025', path: '/samples/tr808/Roland TR-808/CY/CY5025.WAV', label: 'Tune: 50, Decay: 25' },
                { name: 'CY5050', path: '/samples/tr808/Roland TR-808/CY/CY5050.WAV', label: 'Tune: 50, Decay: 50' },
                { name: 'CY5075', path: '/samples/tr808/Roland TR-808/CY/CY5075.WAV', label: 'Tune: 50, Decay: 75' },
                { name: 'CY7500', path: '/samples/tr808/Roland TR-808/CY/CY7500.WAV', label: 'Tune: 75, Decay: 0' },
                { name: 'CY7510', path: '/samples/tr808/Roland TR-808/CY/CY7510.WAV', label: 'Tune: 75, Decay: 10' },
                { name: 'CY7525', path: '/samples/tr808/Roland TR-808/CY/CY7525.WAV', label: 'Tune: 75, Decay: 25' },
                { name: 'CY7550', path: '/samples/tr808/Roland TR-808/CY/CY7550.WAV', label: 'Tune: 75, Decay: 50' },
                { name: 'CY7575', path: '/samples/tr808/Roland TR-808/CY/CY7575.WAV', label: 'Tune: 75, Decay: 75' }
            ],
            hihat: [
                { name: 'HC00', path: '/samples/tr808/Roland TR-808/HC/HC00.WAV', label: 'Tune: 0' },
                { name: 'HC10', path: '/samples/tr808/Roland TR-808/HC/HC10.WAV', label: 'Tune: 10' },
                { name: 'HC25', path: '/samples/tr808/Roland TR-808/HC/HC25.WAV', label: 'Tune: 25' },
                { name: 'HC50', path: '/samples/tr808/Roland TR-808/HC/HC50.WAV', label: 'Tune: 50' },
                { name: 'HC75', path: '/samples/tr808/Roland TR-808/HC/HC75.WAV', label: 'Tune: 75' }
            ],
            lowTom: [
                { name: 'LT00', path: '/samples/tr808/Roland TR-808/LT/LT00.WAV', label: 'Tune: 0' },
                { name: 'LT10', path: '/samples/tr808/Roland TR-808/LT/LT10.WAV', label: 'Tune: 10' },
                { name: 'LT25', path: '/samples/tr808/Roland TR-808/LT/LT25.WAV', label: 'Tune: 25' },
                { name: 'LT50', path: '/samples/tr808/Roland TR-808/LT/LT50.WAV', label: 'Tune: 50' },
                { name: 'LT75', path: '/samples/tr808/Roland TR-808/LT/LT75.WAV', label: 'Tune: 75' }
            ],
            highTom: [
                { name: 'HT00', path: '/samples/tr808/Roland TR-808/HT/HT00.WAV', label: 'Tune: 0' },
                { name: 'HT10', path: '/samples/tr808/Roland TR-808/HT/HT10.WAV', label: 'Tune: 10' },
                { name: 'HT25', path: '/samples/tr808/Roland TR-808/HT/HT25.WAV', label: 'Tune: 25' },
                { name: 'HT50', path: '/samples/tr808/Roland TR-808/HT/HT50.WAV', label: 'Tune: 50' },
                { name: 'HT75', path: '/samples/tr808/Roland TR-808/HT/HT75.WAV', label: 'Tune: 75' }
            ],
            openHihat: [
                { name: 'OH00', path: '/samples/tr808/Roland TR-808/OH/OH00.WAV', label: 'Tune: 0' },
                { name: 'OH10', path: '/samples/tr808/Roland TR-808/OH/OH10.WAV', label: 'Tune: 10' },
                { name: 'OH25', path: '/samples/tr808/Roland TR-808/OH/OH25.WAV', label: 'Tune: 25' },
                { name: 'OH50', path: '/samples/tr808/Roland TR-808/OH/OH50.WAV', label: 'Tune: 50' },
                { name: 'OH75', path: '/samples/tr808/Roland TR-808/OH/OH75.WAV', label: 'Tune: 75' }
            ],
            lowConga: [
                { name: 'LC00', path: '/samples/tr808/Roland TR-808/LC/LC00.WAV', label: 'Tune: 0' },
                { name: 'LC10', path: '/samples/tr808/Roland TR-808/LC/LC10.WAV', label: 'Tune: 10' },
                { name: 'LC25', path: '/samples/tr808/Roland TR-808/LC/LC25.WAV', label: 'Tune: 25' },
                { name: 'LC50', path: '/samples/tr808/Roland TR-808/LC/LC50.WAV', label: 'Tune: 50' },
                { name: 'LC75', path: '/samples/tr808/Roland TR-808/LC/LC75.WAV', label: 'Tune: 75' }
            ],
            maracas: [
                { name: 'MA', path: '/samples/tr808/Roland TR-808/MA/MA.WAV', label: 'Single Sample' }
            ],
            midConga: [
                { name: 'MC00', path: '/samples/tr808/Roland TR-808/MC/MC00.WAV', label: 'Tune: 0' },
                { name: 'MC10', path: '/samples/tr808/Roland TR-808/MC/MC10.WAV', label: 'Tune: 10' },
                { name: 'MC25', path: '/samples/tr808/Roland TR-808/MC/MC25.WAV', label: 'Tune: 25' },
                { name: 'MC50', path: '/samples/tr808/Roland TR-808/MC/MC50.WAV', label: 'Tune: 50' },
                { name: 'MC75', path: '/samples/tr808/Roland TR-808/MC/MC75.WAV', label: 'Tune: 75' }
            ],
            midTom: [
                { name: 'MT00', path: '/samples/tr808/Roland TR-808/MT/MT00.WAV', label: 'Tune: 0' },
                { name: 'MT10', path: '/samples/tr808/Roland TR-808/MT/MT10.WAV', label: 'Tune: 10' },
                { name: 'MT25', path: '/samples/tr808/Roland TR-808/MT/MT25.WAV', label: 'Tune: 25' },
                { name: 'MT50', path: '/samples/tr808/Roland TR-808/MT/MT50.WAV', label: 'Tune: 50' },
                { name: 'MT75', path: '/samples/tr808/Roland TR-808/MT/MT75.WAV', label: 'Tune: 75' }
            ]
        };
    }

    // Check if sample is cached in memory
    isCached(name) {
        return this.cache.has(name);
    }

    // Get cached sample from memory
    getCachedSample(name) {
        return this.cache.get(name) || null;
    }

    // Store sample in memory cache
    cacheSample(name, audioBuffer) {
        this.cache.set(name, audioBuffer);
    }

    // Clear memory cache
    clearCache() {
        this.cache.clear();
    }

    // Get cache statistics
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            version: this.cacheVersion
        };
    }

    // Get available WAV variations for a drum
    getWavVariations(drumType) {
        return this.wavVariations[drumType] || [];
    }

    // Check if a drum has multiple WAV variations
    hasMultipleVariations(drumType) {
        return this.wavVariations[drumType] && this.wavVariations[drumType].length > 1;
    }

    // Get the current sample path for a drum with variation
    getSamplePath(drumType, variationName = null) {
        if (variationName && this.wavVariations[drumType]) {
            const variation = this.wavVariations[drumType].find(v => v.name === variationName);
            if (variation) {
                return variation.path;
            }
        }
        return this.samplePaths[drumType];
    }

    async loadSample(name, path, variationName = null) {
        // Create a unique key for this sample variation
        const sampleKey = variationName ? `${name}_${variationName}` : name;
        
        // Check if sample is already cached in memory
        if (this.isCached(sampleKey)) {
            const cachedBuffer = this.getCachedSample(sampleKey);
            this.samples[sampleKey] = cachedBuffer;
            return cachedBuffer;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // Store in both samples and cache with unique key
            this.samples[sampleKey] = audioBuffer;
            this.cacheSample(sampleKey, audioBuffer);

            return audioBuffer;
        } catch (error) {
            return null;
        }
    }

    async loadAllSamples() {
        const results = await Promise.allSettled(
            Object.entries(this.samplePaths).map(([name, path]) => 
                this.loadSample(name, path)
            )
        );
        
        const loadedCount = results.filter(result => result.status === 'fulfilled' && result.value !== null).length;
        const failedCount = results.filter(result => result.status === 'rejected' || result.value === null).length;
        
        return this.samples;
    }

    // Preload all samples into cache for maximum performance
    async preloadAllSamples() {
        const startTime = performance.now();
        
        // Load all WAV samples first
        await this.loadAllSamples();
        
        // Generate fallback samples for any that failed to load
        for (const [name, path] of Object.entries(this.samplePaths)) {
            if (!this.hasSample(name)) {
                this.generateFallbackSample(name);
            }
        }
        
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        return {
            samples: this.samples,
            cacheStats: this.getCacheStats(),
            loadTime: loadTime,
            totalSamples: Object.keys(this.samplePaths).length,
            cachedSamples: this.cache.size
        };
    }

    getSample(name, variationName = null) {
        const sampleKey = variationName ? `${name}_${variationName}` : name;
        return this.samples[sampleKey] || null;
    }

    hasSample(name) {
        return this.samples[name] !== undefined;
    }
    
    // Debug method to see what samples are loaded
    getLoadedSamples() {
        return Object.keys(this.samples);
    }
    
    // Debug method to see sample details
    getSampleInfo(name) {
        const sample = this.samples[name];
        if (!sample) return null;
        return {
            duration: sample.duration,
            sampleRate: sample.sampleRate,
            numberOfChannels: sample.numberOfChannels,
            length: sample.length
        };
    }

    // Fallback: Generate authentic TR-808-like analog sounds if samples fail to load
    generateFallbackSample(name, duration = 0.5) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        switch (name) {
            case 'kick':
                // TR-808 Kick: Deep sine wave with pitch envelope + noise burst
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 6); // Slower decay for 808 boom
                    const pitchEnv = Math.exp(-t * 15); // Pitch sweep
                    const freq = 60 + (120 * pitchEnv); // 60Hz to 180Hz sweep
                    const sine = Math.sin(2 * Math.PI * freq * t);
                    
                    // Add noise burst at the beginning
                    const noiseEnv = Math.exp(-t * 25);
                    const noise = (Math.random() * 2 - 1) * noiseEnv * 0.3;
                    
                    data[i] = (sine * envelope + noise) * 0.8;
                }
                break;
                
            case 'snare':
                // TR-808 Snare: Tone + noise with proper filtering characteristics
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 12);
                    
                    // Tone component (200Hz fundamental)
                    const tone = Math.sin(2 * Math.PI * 200 * t) * envelope * 0.4;
                    
                    // Noise component with high-frequency emphasis
                    const noiseEnv = Math.exp(-t * 18);
                    const noise = (Math.random() * 2 - 1) * noiseEnv * 0.6;
                    
                    data[i] = (tone + noise) * 0.7;
                }
                break;
                
            case 'hihat':
                // TR-808 Hi-Hat: High-frequency noise with sharp attack
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 30); // Very sharp decay
                    const noise = (Math.random() * 2 - 1) * envelope;
                    data[i] = noise * 0.4;
                }
                break;
                
            case 'clap':
                // TR-808 Clap: Multiple noise bursts with staggered timing
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    let envelope = 0;
                    
                    // First clap
                    if (t < 0.05) {
                        envelope = Math.exp(-t * 40);
                    }
                    // Second clap (slightly delayed)
                    else if (t < 0.08) {
                        envelope = Math.exp(-(t - 0.05) * 50) * 0.8;
                    }
                    // Third clap (even more delayed)
                    else if (t < 0.1) {
                        envelope = Math.exp(-(t - 0.08) * 60) * 0.6;
                    }
                    
                    const noise = (Math.random() * 2 - 1) * envelope;
                    data[i] = noise * 0.5;
                }
                break;
                
            case 'lowTom':
                // TR-808 Low Tom: Deep sine wave with pitch envelope
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 4); // Longer decay
                    const pitchEnv = Math.exp(-t * 8);
                    const freq = 80 + (40 * pitchEnv); // 80Hz to 120Hz
                    const sine = Math.sin(2 * Math.PI * freq * t);
                    data[i] = sine * envelope * 0.6;
                }
                break;
                
            case 'highTom':
                // TR-808 High Tom: Higher frequency sine wave
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 5);
                    const pitchEnv = Math.exp(-t * 10);
                    const freq = 120 + (60 * pitchEnv); // 120Hz to 180Hz
                    const sine = Math.sin(2 * Math.PI * freq * t);
                    data[i] = sine * envelope * 0.6;
                }
                break;
                
            case 'rimShot':
                // TR-808 Rim Shot: Sharp noise burst with high-frequency content
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 20);
                    const noise = (Math.random() * 2 - 1) * envelope;
                    data[i] = noise * 0.3;
                }
                break;
                
            case 'cowBell':
                // TR-808 Cow Bell: Metallic tone with harmonics
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 3); // Long decay
                    const freq1 = 800; // Fundamental
                    const freq2 = 1200; // Harmonic
                    const freq3 = 1600; // Another harmonic
                    
                    const tone1 = Math.sin(2 * Math.PI * freq1 * t) * 0.4;
                    const tone2 = Math.sin(2 * Math.PI * freq2 * t) * 0.3;
                    const tone3 = Math.sin(2 * Math.PI * freq3 * t) * 0.2;
                    
                    data[i] = (tone1 + tone2 + tone3) * envelope * 0.5;
                }
                break;
                
            case 'cymbal':
                // TR-808 Cymbal: High-frequency noise with long decay
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 1.5); // Very long decay
                    const noise = (Math.random() * 2 - 1) * envelope;
                    data[i] = noise * 0.3;
                }
                break;
                
            case 'openHihat':
                // TR-808 Open Hi-Hat: Longer noise burst than closed hi-hat
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 8); // Longer decay than closed
                    const noise = (Math.random() * 2 - 1) * envelope;
                    data[i] = noise * 0.4;
                }
                break;
                
            default:
                // Generic percussive sound
                for (let i = 0; i < length; i++) {
                    const t = i / sampleRate;
                    const envelope = Math.exp(-t * 10);
                    const noise = (Math.random() * 2 - 1) * envelope;
                    data[i] = noise * 0.2;
                }
        }

        // Store in both samples and cache
        this.samples[name] = buffer;
        this.cacheSample(name, buffer);
        return buffer;
    }
}
