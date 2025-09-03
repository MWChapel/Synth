import React from 'react';
import styled from 'styled-components';
import EnhancedDial from './EnhancedDial';

const FilterContainer = styled.div`
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

const FilterGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FilterSection = styled.div`
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

const FilterTitle = styled.h3`
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace
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

const Filter = ({ params, onParamChange }) => {
  const filterTypes = ['lowpass', 'highpass', 'bandpass', 'notch'];
  const slopes = [12, 24];

  return (
    <FilterContainer>
      <Title>Moog Ladder Filter</Title>
      
      <FilterGrid>
        {/* Filter Type and Slope */}
        <FilterSection>
          <FilterTitle>Type & Slope</FilterTitle>
          <ControlSection>
            <ControlLabel>Filter Type</ControlLabel>
            <Select
              value={params.filterType || 'lowpass'}
              onChange={(e) => onParamChange('filter', 'filterType', e.target.value)}
            >
              {filterTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </Select>
          </ControlSection>
          
          <ControlSection>
            <ControlLabel>Filter Slope</ControlLabel>
            <Select
              value={params.filterSlope || 24}
              onChange={(e) => onParamChange('filter', 'filterSlope', parseInt(e.target.value))}
            >
              {slopes.map(slope => (
                <option key={slope} value={slope}>
                  {slope} dB/oct
                </option>
              ))}
            </Select>
          </ControlSection>
        </FilterSection>

        {/* Filter Controls */}
        <FilterSection>
          <FilterTitle>Controls</FilterTitle>
          <DialGrid>
            <EnhancedDial
              value={params.cutoff || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('filter', 'cutoff', value)}
              label="Cutoff"
              unit="%"
              title="Filter Cutoff Frequency"
            />
            <EnhancedDial
              value={params.resonance || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('filter', 'resonance', value)}
              label="Resonance"
              unit="%"
              title="Filter Resonance"
            />
            <EnhancedDial
              value={params.envelopeAmount || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('filter', 'envelopeAmount', value)}
              label="Env Amount"
              unit="%"
              title="Filter Envelope Amount"
            />
            <EnhancedDial
              value={params.lfoAmount || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('filter', 'lfoAmount', value)}
              label="LFO Amount"
              unit="%"
              title="Filter LFO Amount"
            />
            <EnhancedDial
              value={params.keyboardTracking || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('filter', 'keyboardTracking', value)}
              label="Key Track"
              unit="%"
              title="Filter Keyboard Tracking"
            />
          </DialGrid>
        </FilterSection>
      </FilterGrid>
    </FilterContainer>
  );
};

export default Filter; 