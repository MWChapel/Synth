import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EnhancedDial from './EnhancedDial';

const DrumMachineContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 2px solid #FFD700;
  border-radius: 8px;
  padding: 12px;
  margin: 20px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%);
    border-radius: 6px;
    pointer-events: none;
  }
`;

const Title = styled.h2`
  color: #FFD700;
  margin: 0 0 15px 0;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const ControlsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

const MainControlsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const DrumControlsRow = styled.div`
  width: 100%;
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace
`;

const MainControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  width: 100%;
`;

const PresetButton = styled.button`
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border: 2px solid #FFD700;
  border-radius: 8px;
  color: #000;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #FFA500, #FF8C00);
    border-color: #FFA500;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(255, 215, 0, 0.2);
  }
`;

const DrumControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(120px, 1fr));
  gap: 12px;
  padding: 10px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
`;

const CompactDial = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid #333;
  min-width: 100px;
`;

const CompactDialLabel = styled.div`
  color: #FFD700;
  font-size: 9px;
  font-weight: 600;
  text-align: center;
  font-family: 'Courier New', monospace;
`;

const CompactDialValue = styled.div`
  color: #FFD700;
  font-size: 8px;
  font-weight: 500;
  text-align: center;
  font-family: 'Courier New', monospace;
  min-height: 12px;
`;

const TestButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: #FFD700;
  border: 1px solid #FFD700;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  
  &:hover {
    background: rgba(255, 215, 0, 0.2);
    border-color: #FFD700;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    background: #FFD700;
    color: #000;
  }
`;

const ParameterDial = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 4px;
`;

const ParameterLabel = styled.div`
  color: #FFD700;
  font-size: 8px;
  font-weight: 500;
  text-align: center;
  opacity: 0.8;
  min-height: 12px;
`;

const ParameterValue = styled.div`
  color: #FFD700;
  font-size: 8px;
  font-weight: 400;
  text-align: center;
  opacity: 0.7;
  min-height: 10px;
`;

const Button = styled.button`
  background: ${props => props.active ? '#FFD700' : 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.active ? '#000' : '#FFD700'};
  border: 1px solid #444;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#FFD700' : 'rgba(255, 215, 0, 0.2)'};
    border-color: #FFD700;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
  }
`;

const SequencerContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid #444;
  width: 100%;
  box-sizing: border-box;
`;

const SequencerGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const StepButton = styled.button`
  flex: 1;
  min-width: 20px;
  height: 32px;
  border: 1px solid #666;
  border-radius: 4px;
  background: ${props => props.active ? '#FFD700' : 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.active ? '#000' : '#fff'};
  font-size: 9px;
  cursor: pointer;
  transition: all 0.1s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.active ? '#FFA500' : 'rgba(255, 215, 0, 0.2)'};
    border-color: #FFD700;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
  }
`;

const DrumRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const DrumLabel = styled.div`
  color: #FFD700;
  font-size: 10px;
  font-weight: 600;
  text-align: right;
  padding-right: 8px;
  font-family: 'Courier New', monospace;
  width: 80px;
  min-width: 80px;
  flex-shrink: 0;
`;

const StepHeader = styled.div`
  color: #FFD700;
  font-size: 9px;
  font-weight: bold;
  text-align: center;
  font-family: 'Courier New', monospace;
  flex: 1;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepsContainer = styled.div`
  display: flex;
  gap: 2px;
  flex: 1;
  width: 100%;
`;

const SequenceIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  border: 1px solid #444;
`;

const SequenceLabel = styled.div`
  color: #FFD700;
  font-size: 10px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  width: 80px;
  min-width: 80px;
  flex-shrink: 0;
`;

const SequenceStep = styled.div`
  flex: 1;
  min-width: 20px;
  height: 24px;
  border: 1px solid #666;
  border-radius: 3px;
  background: ${props => props.current ? '#FF8C00' : 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.current ? '#000' : '#fff'};
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  transition: all 0.1s ease;
  
  ${props => props.current && `
    animation: pulse 0.5s ease-in-out infinite alternate;
    
    @keyframes pulse {
      from { opacity: 0.8; }
      to { opacity: 1; }
    }
  `}
`;

const DrumMachine = ({ drumMachine, state, onParamChange, onStart, onStop }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState('');
  const [sequencerData, setSequencerData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (drumMachine) {
      setIsPlaying(drumMachine.isPlaying);
      // Initialize sequencer data with all 16 drums
      const drums = ['kick', 'snare', 'hihat', 'clap', 'lowTom', 'highTom', 'rimShot', 'cowBell', 'cymbal', 'openHihat', 'lowConga', 'maracas', 'midConga', 'midTom'];
      const initialData = {};
      drums.forEach(drum => {
        initialData[drum] = Array(16).fill(false);
      });
      
      // Add a simple test pattern to kick and snare so there's something to play
      initialData.kick = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
      initialData.snare = [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
      
      setSequencerData(initialData);
    }
  }, [drumMachine]);

  // Sync sequencer data to drum machine patterns
  useEffect(() => {
    if (drumMachine && sequencerData && Object.keys(sequencerData).length > 0) {
      // Update drum machine patterns with current sequencer data
      Object.keys(sequencerData).forEach(drumType => {
        if (sequencerData[drumType] && Array.isArray(sequencerData[drumType])) {
          drumMachine.updatePattern(drumType, sequencerData[drumType]);
        }
      });
    }
  }, [drumMachine, sequencerData]);

  // Track current step for visual indication and sync playing state
  useEffect(() => {
    if (!drumMachine) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      // Sync playing state
      if (drumMachine.isPlaying !== isPlaying) {
        setIsPlaying(drumMachine.isPlaying);
      }
      // Update current step if playing
      if (drumMachine.isPlaying && drumMachine.currentStep !== undefined) {
        setCurrentStep(drumMachine.currentStep);
      } else if (!drumMachine.isPlaying) {
        setCurrentStep(0);
      }
    }, 50); // Update every 50ms for smooth visual feedback

    return () => clearInterval(interval);
  }, [drumMachine, isPlaying]);

  const handlePlayStop = () => {
    if (isPlaying) {
      onStop();
      setIsPlaying(false);
    } else {
      onStart();
      setIsPlaying(true);
    }
  };

  const handleTempoChange = (value) => {
    if (drumMachine) {
      drumMachine.setTempo(value);
      onParamChange('drumMachine', 'tempo', value);
    }
  };

  const handleVolumeChange = (value) => {
    if (drumMachine) {
      drumMachine.setVolume(value);
      onParamChange('drumMachine', 'volume', value);
    }
  };

  const handleClear = () => {
    if (drumMachine) {
      // Clear all steps for all drums
      const clearedData = {};
      drums.forEach(drum => {
        clearedData[drum.key] = new Array(16).fill(false);
      });
      setSequencerData(clearedData);
      drumMachine.clearPattern();
    }
  };

  const handleTestDrum = (drumType) => {
    if (drumMachine) {
      const now = drumMachine.audioContext.currentTime;
      drumMachine.playSample(drumType, now, state?.[drumType]?.volume || 0.8);
    }
  };

  const loadPatternPreset = (presetKey) => {
    if (drumMachine) {
      drumMachine.loadPreset(presetKey);
      setSequencerData(drumMachine.getState().patterns);
    }
  };





  const toggleStep = (drum, step) => {

    
    setSequencerData(prev => {
      const newData = { ...prev };
      // Ensure the drum array exists before spreading
      newData[drum] = newData[drum] ? [...newData[drum]] : Array(16).fill(false);
      newData[drum][step] = !newData[drum][step];
      
      // Update the drum machine pattern
      if (drumMachine) {
        // Convert the drum key to match the drum machine's expected format
        const drumKey = drum === 'openHiHat' ? 'openHihat' : drum;
        drumMachine.updatePattern(drumKey, newData[drum]);

      }
      
      return newData;
    });
  };



  const drums = [
    { key: 'kick', name: 'Kick', color: '#FF6B6B' },
    { key: 'snare', name: 'Snare', color: '#4ECDC4' },
    { key: 'hihat', name: 'HiHat', color: '#45B7D1' },
    { key: 'clap', name: 'Clap', color: '#96CEB4' },
    { key: 'lowTom', name: 'Low Tom', color: '#FFEAA7' },
    { key: 'highTom', name: 'High Tom', color: '#DDA0DD' },
    { key: 'rimShot', name: 'Rim Shot', color: '#98D8C8' },
    { key: 'cowBell', name: 'Cow Bell', color: '#F7DC6F' },
    { key: 'cymbal', name: 'Cymbal', color: '#BB8FCE' },
    { key: 'openHihat', name: 'Open HiHat', color: '#85C1E9' },
    { key: 'lowConga', name: 'Low Conga', color: '#F8C471' },
    { key: 'maracas', name: 'Maracas', color: '#82E0AA' },
    { key: 'midConga', name: 'Mid Conga', color: '#F1948A' },
    { key: 'midTom', name: 'Mid Tom', color: '#D7BDE2' }
  ];

  return (
    <DrumMachineContainer>
      <Title>TR-808 Drum Machine</Title>
      
      <ControlsGrid>
        {/* Main Controls Row */}
        <MainControlsRow>
          <ControlSection>
            <SectionTitle>Main Controls</SectionTitle>
            <MainControlsGrid>
              <EnhancedDial
                value={state?.tempo || 120}
                min={60}
                max={200}
                step={1}
                onChange={handleTempoChange}
                label="Tempo"
                unit="BPM"
                title="Drum Machine Tempo"
              />
              <EnhancedDial
                value={state?.volume || 1}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                label="Volume"
                unit="%"
                title="Drum Machine Volume"
              />
            </MainControlsGrid>
            <ButtonGrid>
              <Button
                active={isPlaying}
                onClick={handlePlayStop}
              >
                {isPlaying ? 'Stop' : 'Play'}
              </Button>
              <Button
                onClick={handleClear}
              >
                Clear
              </Button>
            </ButtonGrid>
          </ControlSection>
        </MainControlsRow>



        {/* Drum Controls Row - Full Width */}
        <DrumControlsRow>
          <ControlSection>
            <SectionTitle>Drum Controls & Parameters</SectionTitle>
            <DrumControlsGrid>
            {drums.map(drum => (
              <CompactDial key={drum.key}>
                <CompactDialLabel>{drum.name}</CompactDialLabel>
                <EnhancedDial
                  value={state?.[drum.key]?.volume || 0.8}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(value) => onParamChange('drumMachine', `${drum.key}.volume`, value)}
                  label=""
                  unit=""
                  title={`${drum.name} Volume`}
                  size="small"
                />
                <CompactDialValue>
                  {Math.round((state?.[drum.key]?.volume || 0.8) * 100)}%
                </CompactDialValue>
                <TestButton
                  onClick={() => handleTestDrum(drum.key)}
                  title={`Test ${drum.name} Sound`}
                >
                  Test
                </TestButton>
                {drumMachine && drumMachine.hasMultipleVariations(drum.key) && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {/* Tune Control */}
                    {(drum.key === 'kick' || drum.key === 'snare' || drum.key === 'cymbal' || 
                      drum.key === 'hihat' || drum.key === 'lowTom' || drum.key === 'highTom' || drum.key === 'openHihat' ||
                      drum.key === 'lowConga' || drum.key === 'midConga' || drum.key === 'midTom') && (
                      <ParameterDial>
                        <ParameterLabel>Tune</ParameterLabel>
                        <EnhancedDial
                          value={state?.[drum.key]?.tune || 0.5}
                          min={0}
                          max={1}
                          step={0.01}
                          onChange={(value) => onParamChange('drumMachine', `${drum.key}.tune`, value)}
                          label=""
                          unit=""
                          title={`${drum.name} Tune`}
                          size="tiny"
                        />
                        <ParameterValue>{drumMachine ? drumMachine.mapToDiscreteValue(state?.[drum.key]?.tune || 0.5) : Math.round((state?.[drum.key]?.tune || 0.5) * 100)}</ParameterValue>
                      </ParameterDial>
                    )}
                    
                    {/* Decay Control */}
                    {(drum.key === 'kick' || drum.key === 'cymbal') && (
                      <ParameterDial>
                        <ParameterLabel>Decay</ParameterLabel>
                        <EnhancedDial
                          value={state?.[drum.key]?.decayParam || 0.5}
                          min={0}
                          max={1}
                          step={0.01}
                          onChange={(value) => onParamChange('drumMachine', `${drum.key}.decayParam`, value)}
                          label=""
                          unit=""
                          title={`${drum.name} Decay`}
                          size="tiny"
                        />
                        <ParameterValue>{drumMachine ? drumMachine.mapToDiscreteValue(state?.[drum.key]?.decayParam || 0.5) : Math.round((state?.[drum.key]?.decayParam || 0.5) * 100)}</ParameterValue>
                      </ParameterDial>
                    )}
                    
                    {/* Snappy Control */}
                    {drum.key === 'snare' && (
                      <ParameterDial>
                        <ParameterLabel>Snappy</ParameterLabel>
                        <EnhancedDial
                          value={state?.[drum.key]?.snappy || 0.5}
                          min={0}
                          max={1}
                          step={0.01}
                          onChange={(value) => onParamChange('drumMachine', `${drum.key}.snappy`, value)}
                          label=""
                          unit=""
                          title={`${drum.name} Snappy`}
                          size="tiny"
                        />
                        <ParameterValue>{drumMachine ? drumMachine.mapToDiscreteValue(state?.[drum.key]?.snappy || 0.5) : Math.round((state?.[drum.key]?.snappy || 0.5) * 100)}</ParameterValue>
                      </ParameterDial>
                    )}
                  </div>
                )}
              </CompactDial>
            ))}
            </DrumControlsGrid>
          </ControlSection>
        </DrumControlsRow>
      </ControlsGrid>

      {/* Sequencer */}
      <SectionTitle style={{ textAlign: 'center', marginBottom: '15px' }}>
        16-Step Sequencer
      </SectionTitle>
      <SequencerContainer>
        <SequencerGrid>
          {/* Header row */}
          <DrumRow>
            <DrumLabel>Drum</DrumLabel>
            <StepsContainer>
              {Array.from({ length: 16 }, (_, i) => (
                <StepHeader key={i}>
                  {i + 1}
                </StepHeader>
              ))}
            </StepsContainer>
          </DrumRow>
          
          {/* Drum rows */}
          {drums.map(drum => (
            <DrumRow key={drum.key}>
              <DrumLabel>{drum.name}</DrumLabel>
              <StepsContainer>
                {Array.from({ length: 16 }, (_, step) => (
                  <StepButton
                    key={step}
                    active={sequencerData[drum.key]?.[step] || false}
                    onClick={() => toggleStep(drum.key, step)}
                    style={{
                      borderColor: sequencerData[drum.key]?.[step] ? drum.color : '#666'
                    }}
                  />
                ))}
              </StepsContainer>
            </DrumRow>
          ))}
        </SequencerGrid>
      </SequencerContainer>

      {/* Sequence Position Indicator */}
      <SequenceIndicator>
        <SequenceLabel>Position</SequenceLabel>
        <StepsContainer>
          {Array.from({ length: 16 }, (_, i) => (
            <SequenceStep key={i} current={isPlaying && currentStep === i}>
              {i + 1}
            </SequenceStep>
          ))}
        </StepsContainer>
      </SequenceIndicator>

      {/* Pattern Presets */}
      <SectionTitle style={{ textAlign: 'center', marginBottom: '15px' }}>
        Pattern Presets
      </SectionTitle>
      <PresetGrid>
        <PresetButton
          onClick={() => loadPatternPreset('classic-beat')}
          title="Traditional TR-808 pattern with kick, snare, and hi-hat"
        >
          Classic Beat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('hip-hop-beat')}
          title="Classic hip-hop with swing and groove"
        >
          Hip-Hop Beat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('house-beat')}
          title="Four-on-the-floor house pattern"
        >
          House Beat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('techno-beat')}
          title="Driving techno with complex hi-hats"
        >
          Techno Beat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('full-orchestra')}
          title="Showcase all 16 drums in one pattern"
        >
          Full Orchestra
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('latin-groove')}
          title="Latin percussion showcase with congas and maracas"
        >
          Latin Groove
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('breakbeat')}
          title="Complex breakbeat with syncopated rhythms"
        >
          Breakbeat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('minimal')}
          title="Sparse, minimal pattern with lots of space"
        >
          Minimal
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('funk-beat')}
          title="Funky groove with syncopated kick and snare"
        >
          Funk Beat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('disco-beat')}
          title="Disco pattern with four-on-the-floor and open hi-hats"
        >
          Disco Beat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('jungle-beat')}
          title="Jungle/Drum & Bass with complex breakbeats"
        >
          Jungle Beat
        </PresetButton>
        <PresetButton
          onClick={() => loadPatternPreset('trap-beat')}
          title="Trap pattern with triplet hi-hats and sparse kicks"
        >
          Trap Beat
        </PresetButton>
      </PresetGrid>
    </DrumMachineContainer>
  );
};

export default DrumMachine; 