// Simple script to generate basic TR-808-like samples
// This creates basic synthesized samples that sound more like TR-808 than the current ones

const fs = require('fs');
const path = require('path');

// Create a simple WAV file generator
function createWavFile(samples, sampleRate = 44100, filename) {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = samples.length * blockAlign;
    const fileSize = 44 + dataSize - 8;

    const buffer = Buffer.alloc(44 + dataSize);
    let offset = 0;

    // RIFF header
    buffer.write('RIFF', offset); offset += 4;
    buffer.writeUInt32LE(fileSize, offset); offset += 4;
    buffer.write('WAVE', offset); offset += 4;

    // fmt chunk
    buffer.write('fmt ', offset); offset += 4;
    buffer.writeUInt32LE(16, offset); offset += 4; // fmt chunk size
    buffer.writeUInt16LE(1, offset); offset += 2;  // audio format (PCM)
    buffer.writeUInt16LE(numChannels, offset); offset += 2;
    buffer.writeUInt32LE(sampleRate, offset); offset += 4;
    buffer.writeUInt32LE(byteRate, offset); offset += 4;
    buffer.writeUInt16LE(blockAlign, offset); offset += 2;
    buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

    // data chunk
    buffer.write('data', offset); offset += 4;
    buffer.writeUInt32LE(dataSize, offset); offset += 4;

    // audio data
    for (let i = 0; i < samples.length; i++) {
        const sample = Math.max(-1, Math.min(1, samples[i]));
        const intSample = Math.round(sample * 32767);
        buffer.writeInt16LE(intSample, offset);
        offset += 2;
    }

    fs.writeFileSync(filename, buffer);
    console.log(`Generated: ${filename}`);
}

// Generate TR-808-like samples
function generateKick(sampleRate = 44100, duration = 0.5) {
    const length = Math.floor(sampleRate * duration);
    const samples = new Float32Array(length);

    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 8);
        const freq = 60 * Math.exp(-t * 20);
        samples[i] = envelope * Math.sin(2 * Math.PI * freq * t) * 0.8;
    }

    return samples;
}

function generateSnare(sampleRate = 44100, duration = 0.3) {
    const length = Math.floor(sampleRate * duration);
    const samples = new Float32Array(length);

    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 15);
        const noise = (Math.random() * 2 - 1) * envelope;
        samples[i] = noise * 0.6;
    }

    return samples;
}

function generateHiHat(sampleRate = 44100, duration = 0.1) {
    const length = Math.floor(sampleRate * duration);
    const samples = new Float32Array(length);

    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 25);
        const noise = (Math.random() * 2 - 1) * envelope;
        samples[i] = noise * 0.3;
    }

    return samples;
}

function generateClap(sampleRate = 44100, duration = 0.2) {
    const length = Math.floor(sampleRate * duration);
    const samples = new Float32Array(length);

    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        let envelope = 0;
        if (t < 0.05) envelope = Math.exp(-t * 30);
        else if (t < 0.1) envelope = Math.exp(-(t - 0.05) * 40) * 0.7;
        const noise = (Math.random() * 2 - 1) * envelope;
        samples[i] = noise * 0.4;
    }

    return samples;
}

// Generate all samples
const sampleRate = 44100;
const samplesDir = path.join(__dirname, '..', 'public', 'samples', 'tr808');

// Ensure directory exists
if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir, { recursive: true });
}

// Generate samples
createWavFile(generateKick(sampleRate), sampleRate, path.join(samplesDir, 'kick.wav'));
createWavFile(generateSnare(sampleRate), sampleRate, path.join(samplesDir, 'snare.wav'));
createWavFile(generateHiHat(sampleRate), sampleRate, path.join(samplesDir, 'hihat.wav'));
createWavFile(generateClap(sampleRate), sampleRate, path.join(samplesDir, 'clap.wav'));

// Generate simple versions of other drums
createWavFile(generateKick(sampleRate, 0.3), sampleRate, path.join(samplesDir, 'lowTom.wav'));
createWavFile(generateKick(sampleRate, 0.2), sampleRate, path.join(samplesDir, 'highTom.wav'));
createWavFile(generateSnare(sampleRate, 0.1), sampleRate, path.join(samplesDir, 'rimShot.wav'));
createWavFile(generateHiHat(sampleRate, 0.3), sampleRate, path.join(samplesDir, 'cowBell.wav'));
createWavFile(generateHiHat(sampleRate, 0.5), sampleRate, path.join(samplesDir, 'cymbal.wav'));
createWavFile(generateHiHat(sampleRate, 0.2), sampleRate, path.join(samplesDir, 'openHihat.wav'));

console.log('All TR-808 samples generated!');
