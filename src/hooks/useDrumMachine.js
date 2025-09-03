import { useState, useEffect, useRef, useCallback } from 'react';

export function useDrumMachine(audioContext, masterGain) {
  const [state, setState] = useState({
    isPlaying: false,
    currentStep: 0,
    tempo: 120,
    volume: 0.8,
    // Individual drum patterns
    kickPattern: Array(16).fill(false),
    snarePattern: Array(16).fill(false),
    hihatPattern: Array(16).fill(false),
    clapPattern: Array(16).fill(false),
    lowTomPattern: Array(16).fill(false),
    highTomPattern: Array(16).fill(false),
    rimShotPattern: Array(16).fill(false),
    cowBellPattern: Array(16).fill(false),
    cymbalPattern: Array(16).fill(false),
    openHihatPattern: Array(16).fill(false),
    // Master pattern (legacy)
    pattern: Array(16).fill(false),
    // Default drum parameters - 808-style
    kick: { volume: 0.75, pitch: 60, decay: 0.4, tune: 0.5 },
    snare: { volume: 0.65, pitch: 200, decay: 0.3 },
    hihat: { volume: 0.55, pitch: 800, decay: 0.15 },
    clap: { volume: 0.65, pitch: 600, decay: 0.35 },
    lowTom: { volume: 0.6, pitch: 120, decay: 0.5 },
    highTom: { volume: 0.6, pitch: 180, decay: 0.4 },
    rimShot: { volume: 0.5, pitch: 800, decay: 0.2 },
    cowBell: { volume: 0.5, pitch: 800, decay: 0.8 },
    cymbal: { volume: 0.4, pitch: 2000, decay: 1.0 },
    openHihat: { volume: 0.5, pitch: 600, decay: 0.6 }
  });

  const drumMachineRef = useRef(null);

  // Initialize drum machine
  useEffect(() => {
    if (audioContext && masterGain) {
      const { DrumMachine } = require('../audio/DrumMachine');
      // Use the drum machine output if available, otherwise fall back to master gain
      const outputNode = masterGain.getDrumMachineOutput ? masterGain.getDrumMachineOutput() : masterGain;
      drumMachineRef.current = new DrumMachine(audioContext, outputNode);
      
      // Ensure drum sounds are initialized
      drumMachineRef.current.ensureInitialized();
      
      // Set initial patterns
      drumMachineRef.current.setPatterns({
        kick: state.kickPattern,
        snare: state.snarePattern,
        hihat: state.hihatPattern,
        clap: state.clapPattern,
        lowTom: state.lowTomPattern,
        highTom: state.highTomPattern,
        rimShot: state.rimShotPattern,
        cowBell: state.cowBellPattern,
        cymbal: state.cymbalPattern,
        openHihat: state.openHihatPattern
      });
      


    }
  }, [audioContext, masterGain]);

  // Sync state with drum machine
  useEffect(() => {
    if (drumMachineRef.current) {
      // Ensure drum sounds are initialized
      drumMachineRef.current.ensureInitialized();
      
      // Ensure all patterns are arrays before syncing
      const safePatterns = {
        kick: Array.isArray(state.kickPattern) ? state.kickPattern : Array(16).fill(false),
        snare: Array.isArray(state.snarePattern) ? state.snarePattern : Array(16).fill(false),
        hihat: Array.isArray(state.hihatPattern) ? state.hihatPattern : Array(16).fill(false),
        clap: Array.isArray(state.clapPattern) ? state.clapPattern : Array(16).fill(false),
        lowTom: Array.isArray(state.lowTomPattern) ? state.lowTomPattern : Array(16).fill(false),
        highTom: Array.isArray(state.highTomPattern) ? state.highTomPattern : Array(16).fill(false),
        rimShot: Array.isArray(state.rimShotPattern) ? state.rimShotPattern : Array(16).fill(false),
        cowBell: Array.isArray(state.cowBellPattern) ? state.cowBellPattern : Array(16).fill(false),
        cymbal: Array.isArray(state.cymbalPattern) ? state.cymbalPattern : Array(16).fill(false),
        openHihat: Array.isArray(state.openHihatPattern) ? state.openHihatPattern : Array(16).fill(false)
      };
      
      drumMachineRef.current.setPatterns(safePatterns);
    }
  }, [state.kickPattern, state.snarePattern, state.hihatPattern, state.clapPattern, 
    state.lowTomPattern, state.highTomPattern, state.rimShotPattern, 
    state.cowBellPattern, state.cymbalPattern, state.openHihatPattern]);

  // Periodic check to ensure drum sounds are initialized
  useEffect(() => {
    if (drumMachineRef.current) {
      const checkInterval = setInterval(() => {
        if (drumMachineRef.current && !drumMachineRef.current.areDrumSoundsInitialized()) {

          drumMachineRef.current.ensureInitialized();
        }
      }, 1000); // Check every second

      return () => clearInterval(checkInterval);
    }
  }, [drumMachineRef.current]);

  const updateParam = useCallback((section, param, value) => {

    
    if (drumMachineRef.current) {
      // Handle different parameter update patterns
      if (section === 'drumMachine') {
        // Handle drum machine parameters like 'kick.volume', 'tempo', 'volume'
        if (param.includes('.')) {
          const [drum, prop] = param.split('.');
          drumMachineRef.current.updateParam(drum, prop, value);

        } else {
          // Handle direct parameters like 'tempo', 'volume'
          drumMachineRef.current.updateParam(param, value);

        }
      }
    }
    
    setState(prev => {
      const newState = { ...prev };
      
      // Handle pattern updates
      if (param.endsWith('Pattern') && Array.isArray(value)) {
        newState[param] = [...value];

      }
      // Handle basic parameters
      else if (param === 'tempo' || param === 'volume') {
        newState[param] = value;

      }
      // Handle drum parameters (volume, pitch, decay)
      else if (param.includes('.')) {
        const [drum, prop] = param.split('.');
        if (newState[drum] && typeof newState[drum] === 'object') {
          newState[drum] = { ...newState[drum], [prop]: value };

        }
      }
      
      return newState;
    });
  }, []);

  const updatePattern = useCallback((drumType, newPattern) => {
    if (drumMachineRef.current) {
      drumMachineRef.current.updatePattern(drumType, newPattern);
    }
    
    setState(prev => {
      const newState = { ...prev };
      if (drumType) {
        const patternKey = `${drumType}Pattern`;
        newState[patternKey] = [...newPattern];
      }
      return newState;
    });
  }, []);

  const start = useCallback(() => {
    if (drumMachineRef.current) {
      drumMachineRef.current.start();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const stop = useCallback(() => {
    if (drumMachineRef.current) {
      drumMachineRef.current.stop();
      setState(prev => ({ ...prev, isPlaying: false, currentStep: 0 }));
    }
  }, []);

  // Get current drum machine instance
  const getDrumMachine = useCallback(() => {
    return drumMachineRef.current;
  }, []);

  // Get current state from drum machine
  const getState = useCallback(() => {
    if (drumMachineRef.current) {
      return drumMachineRef.current.getState();
    }
    return state;
  }, [state]);

  return {
    state,
    updateParam,
    updatePattern,
    start,
    stop,
    getDrumMachine,
    getState
  };
} 