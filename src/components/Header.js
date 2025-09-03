import React, { useState } from 'react';
import styled from 'styled-components';
import { MINI_MOOG_PRESETS } from '../data/miniMoogPresets';

const HeaderContainer = styled.header`
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.4);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 8px;
  box-shadow: 
    0 6px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: #FFD700;
  font-size: 1.2rem;
  margin-bottom: 12px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
  font-weight: bold;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #FFD700;
  font-size: 0.7rem;
  font-family: 'Courier New', monospace;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #FFD700;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #FFD700;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  }
`;

const PresetControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #FFD700;
  font-size: 0.7rem;
  font-family: 'Courier New', monospace;
`;

const PresetSelect = styled.select`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 6px;
  color: #FFD700;
  font-size: 0.7rem;
  font-family: 'Courier New', monospace;
  padding: 4px 8px;
  outline: none;
  cursor: pointer;
  min-width: 140px;
  
  &:hover {
    border-color: rgba(255, 215, 0, 0.8);
  }
  
  &:focus {
    border-color: rgba(255, 215, 0, 1);
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  }
  
  option {
    background: rgba(0, 0, 0, 0.9);
    color: #FFD700;
  }
`;

const PresetDescription = styled.div`
  font-size: 0.6rem;
  color: rgba(255, 215, 0, 0.7);
  text-align: center;
  max-width: 200px;
  line-height: 1.2;
`;

const TestButton = styled.button`
  background: linear-gradient(45deg, #00FF00, #00CC00);
  border: 1px solid #008000;
  border-radius: 6px;
  padding: 6px 12px;
  color: #FFD700;
  font-size: 0.6rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    inset 0 0 8px rgba(0, 0, 0, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.4);
  font-family: 'Courier New', monospace;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  
  &:hover {
    background: linear-gradient(45deg, #00CC00, #009900);
    transform: translateY(-1px);
  }
`;

const SimpleTestButton = styled.button`
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: #FFD700;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &:hover {
        background: linear-gradient(135deg, #45a049, #4CAF50);
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const PanicButton = styled.button`
    background: linear-gradient(135deg, #f44336, #d32f2f);
    color: #FFD700;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &:hover {
        background: linear-gradient(135deg, #d32f2f, #f44336);
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const StatusIndicator = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
  background: ${props => props.status === 'running' ? '#00FF00' : '#FF0000'};
  box-shadow: 0 0 8px ${props => props.status === 'running' ? '#00FF00' : '#FF0000'};
`;

const AudioStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #FFD700;
    font-weight: bold;
`;

const VoiceCount = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #ffaa00;
    font-weight: bold;
    padding: 4px 8px;
    background: rgba(255, 170, 0, 0.1);
    border-radius: 4px;
    border: 1px solid rgba(255, 170, 0, 0.3);
`;

function Header({ synthState, onMasterVolumeChange, onPresetChange, onSimpleTestTone, onPanic }) {
  const audioStatus = synthState?.audioContext?.state || 'unknown';
  const masterVolume = synthState?.masterVolume || 0.5;
  const [selectedPreset, setSelectedPreset] = useState('default');

  const handleVolumeChange = (event) => {
    const volume = parseFloat(event.target.value);
    onMasterVolumeChange(volume);
  };

  const handlePresetChange = (event) => {
    const presetKey = event.target.value;
    setSelectedPreset(presetKey);
    onPresetChange(presetKey);
  };


  const handlePanic = () => {

    if (onPanic) {
      onPanic();
    }
  };

  // Add keyboard shortcut for panic (ESC key)
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {

        handlePanic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePanic]);

  const currentPreset = MINI_MOOG_PRESETS[selectedPreset];

  return (
    <HeaderContainer>
      <Title>MINI MOOG SYNTHESIZER</Title>
      <ControlsRow>
        <VolumeControl>
          <label>VOL:</label>
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
        
        <PresetControl>
          <PresetSelect value={selectedPreset} onChange={handlePresetChange}>
            {Object.keys(MINI_MOOG_PRESETS).map(key => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </PresetSelect>
          <PresetDescription>
            {currentPreset?.description || 'Select a preset'}
          </PresetDescription>
        </PresetControl>
        
        <AudioStatus>
          <span>🔊 {audioStatus.toUpperCase()}</span>
        </AudioStatus>
        
        <VoiceCount>
          <span>🎹 {synthState?.voiceCount || 0} voices</span>
        </VoiceCount>
      </ControlsRow>
    </HeaderContainer>
  );
}

export default Header; 