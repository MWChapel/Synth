# 🎹 Polyphonic Synthesizer

A fully-featured polyphonic synthesizer built with HTML5 Web Audio API, featuring a beautiful dark mode UI with dial controls, a comprehensive 72-key keyboard, and a classic 808-style drum machine.

## ✨ Features

### 🔊 **Master Volume Control**
- **Volume Dial**: Adjust overall output level from 0 to 1
- **Real-time Control**: Instant volume changes
- **Safe Default**: Starts at 0.5 for comfortable listening

### 🎛️ **Oscillator Section**
- **Waveform Selection**: Choose from Sine, Square, Sawtooth, and Triangle waves
- **Detune Control**: Fine-tune pitch from -50 to +50 cents
- **Octave Control**: Shift octaves from -2 to +2

### 🔧 **Filter Section**
- **Cutoff Frequency**: Adjust from 20Hz to 20kHz
- **Resonance**: Add character with 0-20 Q factor
- **Filter Types**: Lowpass, Highpass, and Bandpass

### 📈 **Envelope Section (ADSR)**
- **Attack**: 0-2 seconds for note onset
- **Decay**: 0-2 seconds for sustain level
- **Sustain**: 0-1 for held note volume
- **Release**: 0-2 seconds for note fade-out

### 🎵 **Effects Section**
- **Reverb**: Add space and depth (0-1)
- **Delay**: Create echoes and repeats (0-1)
- **Distortion**: Add harmonic saturation (0-1)

### 🥁 **808-Style Drum Machine**
- **Classic Drum Sounds**: Kick, Snare, Hi-Hat, and Clap
- **16-Step Sequencer**: Program your own patterns
- **Real-time Controls**: Adjust tempo, volume, and individual drum parameters
- **Pattern Editor**: Click to create custom rhythms
- **Default Pattern**: Loaded with classic 808-style beat
- **Individual Drum Controls**: Volume, pitch, and decay for each sound

### 🎹 **72-Key Keyboard (6 Octaves)**
- **Full Range**: C1 to B6 (32.70 Hz to 1975.53 Hz)
- **Visual Keys**: Click to play notes
- **Extended QWERTY Support**: Comprehensive keyboard mapping
- **Touch Support**: Works on mobile devices
- **Polyphonic**: Play multiple notes simultaneously
- **Horizontal Scrolling**: Navigate through all octaves

## 🚀 Getting Started

1. **Open the synthesizer**: Simply open `index.html` in a modern web browser
2. **Enable audio**: Click anywhere on the page to start the audio context
3. **Adjust volume**: Use the master volume dial to set comfortable listening level
4. **Start playing**: Use the 72-key keyboard or QWERTY keys to play notes
5. **Create beats**: Use the drum machine to add rhythm to your music
6. **Experiment**: Adjust the dials and controls to shape your sound

## 🎯 How to Use

### Basic Playing
- **Click the piano keys** with your mouse
- **Use QWERTY keys** for comprehensive note access across all octaves
- **Touch support** for mobile devices
- **Horizontal scroll** to access all 6 octaves

### Extended QWERTY Mapping
- **Lower Octaves (1-2)**: A-Z, semicolon, quote, comma, period, slash
- **Middle Octaves (3-4)**: QWERTYUIOP, brackets, backslash, numbers 1-9, 0, minus, equals
- **Upper Octaves (5-6)**: Shift+numbers, symbols, and capital QWERTY keys

### 🥁 Drum Machine Usage

#### **Basic Controls**
- **Play/Stop Button**: Start and stop the sequencer
- **Tempo Control**: Adjust BPM from 60 to 180
- **Drum Volume**: Master volume for all drum sounds
- **Clear Pattern**: Reset to empty pattern

#### **Pattern Sequencer**
- **16 Steps**: Click any step button to activate/deactivate
- **Visual Feedback**: Active steps are highlighted in blue
- **Real-time Playback**: Current step is highlighted with animation
- **Four Drum Tracks**: Kick, Snare, Hi-Hat, and Clap

#### **Individual Drum Controls**
Each drum sound has three parameters:
- **Volume**: Individual volume control (0-1)
- **Pitch**: Frequency adjustment for each sound
- **Decay**: How long the sound sustains

#### **Classic 808 Sounds**
- **🥁 Kick**: Deep, punchy bass drum with pitch decay
- **🥁 Snare**: Sharp, snappy snare with noise and tone
- **🥁 Hi-Hat**: Crisp, high-frequency cymbal sound
- **🥁 Clap**: Hand clap with band-pass filtering

### Sound Design
1. **Set Volume**: Start with master volume at 0.5
2. **Choose Oscillator**: Select your base waveform
3. **Shape with Filter**: Use cutoff and resonance to sculpt the tone
4. **Add Movement**: Adjust ADSR envelope for dynamic sound
5. **Layer Effects**: Add reverb, delay, and distortion to taste
6. **Add Rhythm**: Use the drum machine for beats and grooves

### Tips for Great Sounds
- **Bass**: Use sawtooth + lowpass filter + long release
- **Lead**: Use square wave + highpass filter + short attack
- **Pad**: Use sine wave + reverb + long attack/release
- **Pluck**: Use any waveform + short attack + medium release
- **Drums**: Start with the default pattern and modify to taste

## 🔧 Technical Details

- **Built with**: HTML5, CSS3, JavaScript (ES6+)
- **Audio Engine**: Web Audio API
- **Polyphony**: Unlimited voices
- **Keyboard Range**: 6 octaves (C1 to B6)
- **Drum Machine**: 16-step sequencer with 4 drum tracks
- **Sample Rate**: Browser default (typically 44.1kHz)
- **Latency**: Minimal (depends on browser implementation)

## 🌐 Browser Compatibility

- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 14+
- ✅ Edge 79+
- ⚠️ Mobile browsers may have audio context limitations

## 🎨 UI Features

- **Dark Mode**: Easy on the eyes for long sessions
- **Dial Controls**: Intuitive circular sliders
- **Responsive Design**: Works on desktop and mobile
- **Visual Feedback**: Keys light up when pressed
- **Smooth Animations**: Hover effects and transitions
- **Horizontal Scrolling**: Navigate through all 72 keys
- **Step Sequencer**: Visual pattern editor with real-time feedback

## 🐛 Troubleshooting

### No Sound?
1. Make sure your browser supports Web Audio API
2. Check that your system audio is working
3. Try clicking on the page to resume audio context
4. **Check the master volume dial** - it should be above 0
5. Check browser console for error messages

### Audio Glitches?
1. Close other audio applications
2. Reduce the number of simultaneous notes
3. Lower the master volume
4. Check your system's audio buffer settings

### Volume Issues?
1. **Master volume dial** controls overall output level
2. Start with volume at 0.5 for safe listening
3. Adjust gradually to find comfortable level
4. Check your system volume as well

### Drum Machine Issues?
1. **Check drum volume** - separate from master volume
2. **Verify tempo** - should be between 60-180 BPM
3. **Check pattern** - make sure steps are activated
4. **Restart sequencer** if timing gets off

## 🎵 Example Patches

### Classic Bass
- **Volume**: 0.6
- **Waveform**: Sawtooth
- **Filter**: Lowpass, Cutoff: 800Hz, Resonance: 2
- **Envelope**: Attack: 0.05s, Decay: 0.1s, Sustain: 0.8, Release: 0.3s
- **Effects**: Reverb: 0.2, Delay: 0.1, Distortion: 0.3

### Ambient Pad
- **Volume**: 0.4
- **Waveform**: Sine
- **Filter**: Lowpass, Cutoff: 2000Hz, Resonance: 1
- **Envelope**: Attack: 1.5s, Decay: 0.5s, Sustain: 0.9, Release: 2s
- **Effects**: Reverb: 0.8, Delay: 0.4, Distortion: 0

### Lead Synth
- **Volume**: 0.5
- **Waveform**: Square
- **Filter**: Highpass, Cutoff: 500Hz, Resonance: 5
- **Envelope**: Attack: 0.01s, Decay: 0.1s, Sustain: 0.6, Release: 0.2s
- **Effects**: Reverb: 0.3, Delay: 0.2, Distortion: 0.5

### Classic 808 Beat
- **Tempo**: 120 BPM
- **Kick**: Volume: 0.8, Pitch: 60Hz, Decay: 0.3s
- **Snare**: Volume: 0.7, Pitch: 400Hz, Decay: 0.2s
- **Hi-Hat**: Volume: 0.6, Pitch: 1200Hz, Decay: 0.1s
- **Clap**: Volume: 0.6, Pitch: 600Hz, Decay: 0.15s

## 🎹 Keyboard Layout

### Octave 1 (C1-B1): 32.70 Hz - 61.74 Hz
- **Keys**: A, S, D, F, G, H, J, K, L, ;, ', Z, X, C, V, B, N, M, ,, ., /, Q, W, E

### Octave 2 (C2-B2): 65.41 Hz - 123.47 Hz
- **Keys**: R, T, Y, U, I, O, P, [, ], \, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -, =

### Octave 3 (C3-B3): 130.81 Hz - 246.94 Hz
- **Keys**: Q, W, E, R, T, Y, U, I, O, P, [, ], \, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -, =

### Octave 4 (C4-B4): 261.63 Hz - 493.88 Hz
- **Keys**: Q, W, E, R, T, Y, U, I, O, P, [, ], \, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -, =

### Octave 5 (C5-B5): 523.25 Hz - 987.77 Hz
- **Keys**: Shift+1-9, symbols, Q, W, E, R, T, Y, U, I, O, P, {, }, |

### Octave 6 (C6-B6): 1046.50 Hz - 1975.53 Hz
- **Keys**: Shift+1-9, symbols, Q, W, E, R, T, Y, U, I, O, P, {, }, |

## 🥁 Drum Machine Patterns

### Classic 808 Pattern (Default)
- **Kick**: Steps 1, 5, 9, 13 (every 4th beat)
- **Snare**: Steps 3, 7, 11, 15 (backbeat)
- **Hi-Hat**: All 16 steps (constant 16th notes)
- **Clap**: Steps 5, 13 (accent beats)

### Custom Pattern Ideas
- **Hip-Hop**: Heavy kick on 1 and 3, snare on 2 and 4
- **House**: Four-on-the-floor kick, offbeat hi-hats
- **Breakbeat**: Complex kick patterns, rolling snares
- **Minimal**: Sparse kicks, subtle hi-hats

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Add more waveforms (FM, AM, wavetables)
- Implement LFO modulation
- Add preset management
- Create a sequencer
- Add MIDI support
- Add more octaves
- Implement velocity sensitivity
- Add more drum sounds (tom, crash, ride)
- Implement pattern chaining
- Add swing/groove quantization

## 📄 License

This project is open source and available under the MIT License.

---

**Happy synthesizing! 🎹✨** 