import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EnhancedDial from './EnhancedDial';

const LFOContainer = styled.div`
  border: 2px solid #FFD700;
  border-radius: 8px;
  padding: 20px;
  color: #FFD700;
  font-family: 'Courier New', monospace;
`;

const Title = styled.h3`
  color: #FFD700;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 20px 0;
  text-align: center;
`;

const LFOGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const LFOSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, rgba(255, 215, 0, 0.01) 100%);
    border-radius: 5px;
    pointer-events: none;
  }
`;

const LFOTitle = styled.h4`
  color: #FFD700;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
`;

const Select = styled.select`
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 1px solid #FFD700;
  color: #FFD700;
  padding: 4px 6px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  outline: none;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    border-color: #FFA500;
  }
  
  &:focus {
    border-color: #FFA500;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
  }
  
  option {
    background: #1a1a1a;
    color: #FFD700;
  }
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ControlLabel = styled.label`
  font-size: 12px;
  margin-bottom: 5px;
  display: block;
  font-family: 'Courier New', monospace;
`;

const LFOGraph = styled.div`
  width: 100%;
  height: 80px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  margin: 10px 0;
`;

const LFOPath = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const LFOLine = styled.path`
  stroke: #FFD700;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const LFO = ({ params, onParamChange }) => {
  const [graphKey, setGraphKey] = useState(0);

  // Update graph when parameters change
  useEffect(() => {
    setGraphKey(prev => prev + 1);
  }, [params.waveform, params.rate, params.amount]);

  // Function to generate LFO waveform path
  const generateLFOPath = (waveform, rate, amount, width, height) => {
    const centerY = height / 2;
    const amplitude = (amount * height * 0.3); // Scale amplitude by amount
    const frequency = rate * 2; // Scale frequency by rate
    
    let path = '';
    const points = [];
    
    for (let x = 0; x <= width; x += 2) {
      const normalizedX = x / width;
      let y;
      
      switch (waveform) {
        case 'sine':
          y = centerY + amplitude * Math.sin(normalizedX * Math.PI * 2 * frequency);
          break;
        case 'triangle':
          const triangleX = (normalizedX * frequency * 2) % 2;
          y = centerY + amplitude * (triangleX < 1 ? 2 * triangleX - 1 : 3 - 2 * triangleX);
          break;
        case 'square':
          y = centerY + amplitude * (Math.sin(normalizedX * Math.PI * 2 * frequency) > 0 ? 1 : -1);
          break;
        case 'sawtooth':
          const sawX = (normalizedX * frequency * 2) % 2;
          y = centerY + amplitude * (sawX - 1);
          break;
        default:
          y = centerY + amplitude * Math.sin(normalizedX * Math.PI * 2 * frequency);
      }
      
      points.push({ x, y });
    }
    
    // Create SVG path
    if (points.length > 0) {
      path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
      }
    }
    
    return path;
  };

  return (
    <LFOContainer>
      <Title>LFO & Modulation</Title>
      
      <LFOGrid>
        {/* LFO Controls */}
        <LFOSection>
          <LFOTitle>LFO Controls</LFOTitle>
          
          <LFOGraph key={graphKey}>
            <LFOPath>
              <LFOLine d={generateLFOPath(
                params.waveform || 'sine',
                params.rate || 1,
                params.amount || 0,
                300,
                80
              )} />
            </LFOPath>
          </LFOGraph>
          
          <DialGrid>
            <ControlSection>
              <ControlLabel>Waveform</ControlLabel>
              <Select
                value={params.waveform || 'sine'}
                onChange={(e) => onParamChange('lfo', 'waveform', e.target.value)}
              >
                <option value="sine">Sine</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
              </Select>
            </ControlSection>
            
            <EnhancedDial
              value={params.rate || 1}
              min={0.1}
              max={10}
              step={0.1}
              onChange={(value) => onParamChange('lfo', 'rate', value)}
              label="Rate"
              unit="Hz"
              title="LFO Rate"
            />
            <EnhancedDial
              value={params.amount || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('lfo', 'amount', value)}
              label="Amount"
              unit="%"
              title="LFO Amount"
            />
          </DialGrid>
        </LFOSection>

        {/* LFO Settings */}
        <LFOSection>
          <LFOTitle>LFO Settings</LFOTitle>
          <DialGrid>
            <EnhancedDial
              value={params.delay || 0}
              min={0}
              max={2}
              step={0.01}
              onChange={(value) => onParamChange('lfo', 'delay', value)}
              label="Delay"
              unit="s"
              title="LFO Delay"
            />
            <EnhancedDial
              value={params.toPitch || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('lfo', 'toPitch', value)}
              label="To Pitch"
              unit="%"
              title="LFO to Pitch Modulation"
            />
            <EnhancedDial
              value={params.toFilter || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('lfo', 'toFilter', value)}
              label="To Filter"
              unit="%"
              title="LFO to Filter Modulation"
            />
            <EnhancedDial
              value={params.toAmp || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('lfo', 'toAmplitude', value)}
              label="To Amp"
              unit="%"
              title="LFO to Amplitude Modulation"
            />
          </DialGrid>
        </LFOSection>
      </LFOGrid>
    </LFOContainer>
  );
};

export default LFO; 