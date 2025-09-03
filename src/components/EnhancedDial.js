import React, { useState } from 'react';
import styled from 'styled-components';
import PopupSlider from './PopupSlider';

const DialContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
`;

const Dial = styled.div`
  width: 37.5px;
  height: 37.5px;
  border-radius: 50%;
  background: conic-gradient(
    from -90deg,
    #FFD700 ${props => props.percentage * 3.6}deg,
    #333 ${props => props.percentage * 3.6}deg,
    #333 360deg
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFD700;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 4px 16px rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const DialCenter = styled.div`
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const DialTicks = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
`;

const Tick = styled.div`
  position: absolute;
  width: 1px;
  height: 4px;
  background: #FFD700;
  left: 50%;
  transform-origin: 50% 18.75px;
  transform: translateX(-50%) rotate(${props => props.angle}deg);
  opacity: 0.6;
  box-shadow: 0 0 2px rgba(255, 215, 0, 0.5);
`;

const DialIndicator = styled.div`
  position: absolute;
  width: 2px;
  height: 8px;
  background: #000;
  left: 50%;
  transform-origin: 50% 15px;
  transform: translateX(-50%) rotate(${props => props.percentage * 3.6 - 90}deg);
  border-radius: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

const DialValue = styled.div`
  color: #FFD700;
  font-size: 8px;
  font-weight: 600;
  text-align: center;
  font-family: 'Courier New', monospace;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const DialLabels = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const DialLabel = styled.div`
  color: #FFD700;
  font-size: 8px;
  text-align: center;
  max-width: 37.5px;
  line-height: 1.1;
  font-family: 'Courier New', monospace;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EnhancedDial = ({ 
  value, 
  min, 
  max, 
  step = 0.01, 
  onChange, 
  label, 
  unit = '',
  title = label 
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Debug logging
  (`🎛️ EnhancedDial ${label}: render with value:`, value, 'type:', typeof value);
  
  // Ensure value is a valid number with fallback
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : min || 0;
  const safeMin = typeof min === 'number' && !isNaN(min) ? min : 0;
  const safeMax = typeof max === 'number' && !isNaN(max) ? max : 1;
  
  // Calculate percentage for pie chart (0-100)
  const percentage = Math.max(0, Math.min(100, ((safeValue - safeMin) / (safeMax - safeMin)) * 100));
  
  (`🎛️ EnhancedDial ${label}: calculated percentage:`, percentage, 'from safeValue:', safeValue);
  
  // Generate tick marks around the dial
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    ticks.push(i * 30); // 12 ticks at 30-degree intervals
  }

  const handleDialClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleValueChange = (newValue) => {
    (`🎛️ EnhancedDial ${label}: handleValueChange called with:`, newValue);
    if (typeof newValue === 'number' && !isNaN(newValue)) {
      (`🎛️ EnhancedDial ${label}: calling onChange with:`, newValue);
      onChange(newValue);
    }
  };

  const formatValue = (val) => {
    // Ensure val is a number
    const numVal = typeof val === 'number' ? val : parseFloat(val) || 0;
    
    if (unit === '%') return `${Math.round(numVal * 100)}%`;
    if (unit === 'Hz') return `${numVal.toFixed(1)} Hz`;
    if (unit === 'ms') return `${numVal.toFixed(1)} ms`;
    if (unit === 's') return `${numVal.toFixed(2)}s`;
    if (unit === 'dB') return `${numVal.toFixed(1)} dB`;
    return numVal.toFixed(3);
  };

  return (
    <>
      <DialContainer onClick={handleDialClick}>
        <Dial percentage={percentage}>
          <DialTicks>
            {ticks.map((angle, index) => (
              <Tick key={index} angle={angle} />
            ))}
          </DialTicks>
          <DialIndicator percentage={percentage} />
          <DialCenter>
            <DialValue>{formatValue(safeValue)}</DialValue>
          </DialCenter>
        </Dial>
        
        <DialLabels>
          <DialLabel>{label}</DialLabel>
        </DialLabels>
      </DialContainer>

      <PopupSlider
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        title={title}
        value={safeValue}
        min={safeMin}
        max={safeMax}
        step={step}
        onChange={handleValueChange}
        unit={unit}
      />
    </>
  );
};

export default EnhancedDial; 