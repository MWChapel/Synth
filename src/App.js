import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSynth } from './hooks/useSynth';
import { useDrumMachine } from './hooks/useDrumMachine';
import Header from './components/Header';
import Keyboard from './components/Keyboard';
import Oscillators from './components/Oscillators';
import Filter from './components/Filter';
import Envelopes from './components/Envelopes';
import LFO from './components/LFO';
import Effects from './components/Effects';
import DrumMachine from './components/DrumMachine';

const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px;
`;

const SynthMain = styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 8px;
  margin-top: 8px;
`;

const SynthSection = styled.section`
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  color: #FFD700;
  font-size: 0.8rem;
  margin-bottom: 16px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
`;

function App() {
    const { synth, synthState, playNote, stopNote, updateParam, loadPreset, playSimpleTestTone, stopAllVoices } = useSynth();
    const { state: drumState, updateParam: updateDrumParam, start, stop, getDrumMachine } = useDrumMachine(
        synth?.audioContext,
        synth
    );

    // Get drum machine instance for debugging
    const drumMachine = getDrumMachine();
    
    // Debug drum machine initialization
    useEffect(() => {
        if (drumMachine) {

        } else {

        }
    }, [drumMachine]);

    const handlePanic = useCallback(() => {

        stopAllVoices();
    }, [stopAllVoices]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (synth) synth.stopAllVoices();
      const drumMachine = getDrumMachine();
      if (drumMachine) drumMachine.stop();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [synth, getDrumMachine]);

  // Add click-to-start functionality for mobile browsers
  useEffect(() => {
    const handleClick = () => {
      if (synth?.audioContext?.state === 'suspended') {
        synth.audioContext.resume();
      }
    };

    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, [synth]);

  if (!synth) {
    return (
      <AppContainer>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px', color: '#FFD700' }}>
          <h2>Initializing Mini Moog Synthesizer...</h2>
          <p>Please wait while the audio system loads...</p>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header 
        synthState={synthState}
        onMasterVolumeChange={(volume) => updateParam('masterVolume', 'masterVolume', volume)}
        onPresetChange={loadPreset}
        onSimpleTestTone={playSimpleTestTone}
        onPanic={handlePanic}
      />
      
      <SynthMain>
        {/* Keyboard Section */}
        <SynthSection style={{ gridColumn: '1 / -1' }}>
          <SectionTitle>72-KEY KEYBOARD (6 OCTAVES)</SectionTitle>
          <Keyboard 
            onNoteOn={playNote}
            onNoteOff={stopNote}
          />
        </SynthSection>

        {/* Oscillators Section */}
        <SynthSection>
          <SectionTitle>OSCILLATORS</SectionTitle>
          <Oscillators 
            params={synthState.oscillators}
            onParamChange={updateParam}
          />
        </SynthSection>

        {/* Filter Section */}
        <SynthSection>
          <SectionTitle>MOOG LADDER FILTER</SectionTitle>
          <Filter 
            params={synthState.filter}
            onParamChange={updateParam}
          />
        </SynthSection>

        {/* Envelopes Section */}
        <SynthSection>
          <SectionTitle>ENVELOPES</SectionTitle>
          <Envelopes 
            params={synthState.envelopes}
            onParamChange={updateParam}
          />
        </SynthSection>

        {/* LFO Section */}
        <SynthSection>
          <SectionTitle>LFO & MODULATION</SectionTitle>
          <LFO 
            params={synthState.lfo}
            onParamChange={updateParam}
          />
        </SynthSection>

        {/* Effects Section */}
        <SynthSection>
          <SectionTitle>EFFECTS</SectionTitle>
          <Effects 
            params={synthState.effects}
            onParamChange={updateParam}
          />
        </SynthSection>

        {/* Drum Machine Section */}
        <SynthSection style={{ gridColumn: '1 / -1' }}>
          <SectionTitle>ROLAND TR-808 DRUM MACHINE</SectionTitle>
          <DrumMachine 
            drumMachine={drumMachine}
            state={drumState}
            onParamChange={updateDrumParam}
            onStart={start}
            onStop={stop}
          />
        </SynthSection>
      </SynthMain>
    </AppContainer>
  );
}

export default App; 