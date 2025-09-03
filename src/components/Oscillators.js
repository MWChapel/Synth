import React from 'react';
import styled from 'styled-components';
import EnhancedDial from './EnhancedDial';

const OscillatorsContainer = styled.div`
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

const OscillatorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
  width: 100%;
`;

const OscillatorSection = styled.div`
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

const OscillatorTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace
`;

const DialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #FFD700;
  border-radius: 3px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  cursor: pointer;
  position: relative;
  
  &:checked {
    background: #FFD700;
    
    &::after {
      content: '✓';
      position: absolute;
      top: -2px;
      left: 1px;
      color: #FFD700;
      font-size: 12px;
      font-weight: bold;
    }
  }
  
  &:hover {
    border-color: #FFA500;
  }
`;

const CheckboxLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
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

const ModulationSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: 15px;
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

const ModulationTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`;

const ModulationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
`;

const Oscillators = ({ params, onParamChange }) => {
  const waveforms = ['Sine', 'Square', 'Sawtooth', 'Triangle'];
  
  // Debug logging

  
  return (
    <OscillatorsContainer>
      <Title>Oscillators</Title>
      
      <OscillatorGrid>
        {/* Oscillator 1 */}
        <OscillatorSection>
          <OscillatorTitle>OSC 1</OscillatorTitle>
          <DialGrid>
            <ControlSection>
              <ControlLabel>Waveform</ControlLabel>
              <Select
                value={typeof params.osc1?.waveform === 'number' ? params.osc1.waveform : 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  onParamChange('oscillators', 'osc1.waveform', value);
                }}
              >
                {waveforms.map((waveform, index) => (
                  <option key={index} value={index}>
                    {waveform}
                  </option>
                ))}
              </Select>
            </ControlSection>
            <ControlSection>
              <ControlLabel>Octave</ControlLabel>
              <Select
                value={params.osc1?.octave || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  onParamChange('oscillators', 'osc1.octave', value);
                }}
              >
                <option value={-2}>-2</option>
                <option value={-1}>-1</option>
                <option value={0}>0</option>
                <option value={1}>+1</option>
                <option value={2}>+2</option>
              </Select>
            </ControlSection>
            <EnhancedDial
              value={params.osc1?.tune || 0}
              min={-12}
              max={12}
              step={0.1}
              onChange={(value) => {

                onParamChange('oscillators', 'osc1.tune', value);
              }}
              label="Tune"
              title="Oscillator 1 Tune"
            />
            <EnhancedDial
              value={params.osc1?.level || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => {

                onParamChange('oscillators', 'osc1.level', value);
              }}
              label="Level"
              unit="%"
              title="Oscillator 1 Level"
            />
          </DialGrid>
        </OscillatorSection>

        {/* Oscillator 2 */}
        <OscillatorSection>
          <OscillatorTitle>OSC 2</OscillatorTitle>
          <DialGrid>
            <ControlSection>
              <ControlLabel>Waveform</ControlLabel>
              <Select
                value={typeof params.osc2?.waveform === 'number' ? params.osc2.waveform : 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  onParamChange('oscillators', 'osc2.waveform', value);
                }}
              >
                {waveforms.map((waveform, index) => (
                  <option key={index} value={index}>
                    {waveform}
                  </option>
                ))}
              </Select>
            </ControlSection>
            <ControlSection>
              <ControlLabel>Octave</ControlLabel>
              <Select
                value={params.osc2?.octave || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  onParamChange('oscillators', 'osc2.octave', value);
                }}
              >
                <option value={-2}>-2</option>
                <option value={-1}>-1</option>
                <option value={0}>0</option>
                <option value={1}>+1</option>
                <option value={2}>+2</option>
              </Select>
            </ControlSection>
            <EnhancedDial
              value={params.osc2?.tune || 0}
              min={-12}
              max={12}
              step={0.1}
              onChange={(value) => {

                onParamChange('oscillators', 'osc2.tune', value);
              }}
              label="Tune"
              title="Oscillator 2 Tune"
            />
            <EnhancedDial
              value={params.osc2?.level || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => {

                onParamChange('oscillators', 'osc2.level', value);
              }}
              label="Level"
              unit="%"
              title="Oscillator 2 Level"
            />
          </DialGrid>
        </OscillatorSection>

        {/* Oscillator 3 */}
        <OscillatorSection>
          <OscillatorTitle>OSC 3</OscillatorTitle>
          <DialGrid>
            <ControlSection>
              <ControlLabel>Waveform</ControlLabel>
              <Select
                value={typeof params.osc3?.waveform === 'number' ? params.osc3.waveform : 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  onParamChange('oscillators', 'osc3.waveform', value);
                }}
              >
                {waveforms.map((waveform, index) => (
                  <option key={index} value={index}>
                    {waveform}
                  </option>
                ))}
              </Select>
            </ControlSection>
            <ControlSection>
              <ControlLabel>Octave</ControlLabel>
              <Select
                value={params.osc3?.octave || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  onParamChange('oscillators', 'osc3.octave', value);
                }}
              >
                <option value={-2}>-2</option>
                <option value={-1}>-1</option>
                <option value={0}>0</option>
                <option value={1}>+1</option>
                <option value={2}>+2</option>
              </Select>
            </ControlSection>
            <EnhancedDial
              value={params.osc3?.tune || 0}
              min={-12}
              max={12}
              step={0.1}
              onChange={(value) => {

                onParamChange('oscillators', 'osc3.tune', value);
              }}
              label="Tune"
              title="Oscillator 3 Tune"
            />
            <EnhancedDial
              value={params.osc3?.level || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => {

                onParamChange('oscillators', 'osc3.level', value);
              }}
              label="Level"
              unit="%"
              title="Oscillator 3 Level"
            />
          </DialGrid>
        </OscillatorSection>
      </OscillatorGrid>

      {/* Modulation Section */}
      <ModulationSection>
        <ModulationTitle>Modulation</ModulationTitle>
        <ModulationGrid>
          <CheckboxContainer onClick={() => {
            const newValue = !params.oscSync;

            onParamChange('oscillators', 'oscSync', newValue);
          }}>
            <Checkbox 
              type="checkbox" 
              checked={params.oscSync || false}
              readOnly
            />
            <CheckboxLabel>OSC Sync</CheckboxLabel>
          </CheckboxContainer>
          <CheckboxContainer onClick={() => {
            const newValue = !params.ringMod;

            onParamChange('oscillators', 'ringMod', newValue);
          }}>
            <Checkbox 
              type="checkbox" 
              checked={params.ringMod || false}
              readOnly
            />
            <CheckboxLabel>Ring Mod</CheckboxLabel>
          </CheckboxContainer>
          <EnhancedDial
            value={typeof params.noise?.level === 'number' ? params.noise.level : 0}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => {

              onParamChange('oscillators', 'noise.level', value);
            }}
            label="Noise Level"
            unit="%"
            title="Noise Level"
          />
          <EnhancedDial
            value={typeof params.noise?.color === 'number' ? params.noise.color : 0}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => {

              onParamChange('oscillators', 'noise.color', value);
            }}
            label="Noise Color"
            unit="%"
            title="Noise Color"
          />
        </ModulationGrid>
      </ModulationSection>
    </OscillatorsContainer>
  );
};

export default Oscillators; 