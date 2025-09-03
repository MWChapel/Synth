import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const PopupContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 2px solid #FFD700;
  border-radius: 8px;
  padding: 15px;
  min-width: 250px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
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

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #FFD700;
`;

const PopupTitle = styled.h3`
  color: #FFD700;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #FFD700;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    color: #FFD700;
  }
`;

const SliderContainer = styled.div`
  margin-bottom: 15px;
`;

const SliderLabel = styled.div`
  color: #FFD700;
  margin-bottom: 8px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  font-family: 'Courier New', monospace;
`;

const Slider = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #333 0%, #555 100%);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }
  
  &::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
`;

const ValueDisplay = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #FFD700;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
`;

const CurrentValue = styled.div`
  color: #FFD700;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
  font-family: 'Courier New', monospace;
`;

const ValueRange = styled.div`
  color: #FFD700;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  opacity: 0.8;
`;

const SaveButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.primary ? '#000' : '#FFD700'};
  border: 1px solid #FFD700;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
`;

const ChangeIndicator = styled.div`
  color: #FFD700;
  font-size: 10px;
  text-align: center;
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
  opacity: 0.8;
`;

const PopupSlider = ({ 
  isOpen, 
  onClose, 
  title, 
  value, 
  min, 
  max, 
  step = 0.01, 
  onChange, 
  unit = '' 
}) => {
  // Ensure value is a valid number
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : min || 0;
  const safeMin = typeof min === 'number' && !isNaN(min) ? min : 0;
  const safeMax = typeof max === 'number' && !isNaN(max) ? max : 1;
  
  const [localValue, setLocalValue] = useState(safeValue);
  const popupRef = useRef(null);

  useEffect(() => {
    setLocalValue(safeValue);
  }, [safeValue]);

  // Check if value has changed
  const hasChanges = Math.abs(localValue - safeValue) > 0.001;

  const handleSliderChange = useCallback((e) => {
    const newValue = parseFloat(e.target.value);
    if (typeof newValue === 'number' && !isNaN(newValue)) {
      setLocalValue(newValue);
      // Don't call onChange here - only update local state
    }
  }, []);

  const handleCancel = useCallback(() => {
    // Reset to original value and close without saving
    setLocalValue(safeValue);
    onClose();
  }, [safeValue, onClose]);

  const handleSave = useCallback(() => {
    // Save the current value and close
    if (typeof localValue === 'number' && !isNaN(localValue)) {
      onChange(localValue);
    }
    onClose();
  }, [localValue, onChange, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      // When Enter is pressed, save the value
      handleSave();
    } else if (e.key === 'Escape') {
      // When Escape is pressed, discard changes and close
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Don't save changes when clicking outside - just cancel
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleCancel, handleKeyDown]);

  const formatValue = (val) => {
    // Ensure val is a number
    const numVal = typeof val === 'number' && !isNaN(val) ? val : 0;
    
    if (unit === '%') return `${Math.round(numVal * 100)}%`;
    if (unit === 'Hz') return `${numVal.toFixed(1)} Hz`;
    if (unit === 'ms') return `${numVal.toFixed(1)} ms`;
    if (unit === 's') return `${numVal.toFixed(2)}s`;
    if (unit === 'dB') return `${numVal.toFixed(1)} dB`;
    return numVal.toFixed(3);
  };

  if (!isOpen) return null;

  return (
    <PopupOverlay>
      <PopupContainer ref={popupRef}>
        <PopupHeader>
          <PopupTitle>{title}</PopupTitle>
          <CloseButton onClick={handleCancel}>&times;</CloseButton>
        </PopupHeader>
        
        <SliderContainer>
          <SliderLabel>
            <span>Min: {formatValue(safeMin)}</span>
            <span>Max: {formatValue(safeMax)}</span>
          </SliderLabel>
          <Slider
            type="range"
            min={safeMin}
            max={safeMax}
            step={step}
            value={localValue}
            onChange={handleSliderChange}
            onKeyDown={handleKeyDown}
          />
        </SliderContainer>
        
        <ValueDisplay>
          <CurrentValue>{formatValue(localValue)}</CurrentValue>
          <ValueRange>
            Range: {formatValue(safeMin)} - {formatValue(safeMax)}
          </ValueRange>
        </ValueDisplay>

        <ButtonContainer>
          <SaveButton primary onClick={handleSave}>Save</SaveButton>
          <SaveButton onClick={handleCancel}>Cancel</SaveButton>
        </ButtonContainer>
        {hasChanges && <ChangeIndicator>Unsaved changes</ChangeIndicator>}
      </PopupContainer>
    </PopupOverlay>
  );
};

export default PopupSlider; 