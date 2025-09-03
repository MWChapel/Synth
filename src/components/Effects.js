import React from 'react';
import styled from 'styled-components';
import EnhancedDial from './EnhancedDial';

const EffectsContainer = styled.div`
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

const EffectsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EffectSection = styled.div`
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

const EffectTitle = styled.h3`
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

const ToggleButton = styled.button`
  background: ${props => props.active ? '#FFD700' : 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.active ? '#000' : '#FFD700'};
  border: 1px solid #FFD700;
  padding: 4px 8px;
  font-size: 11px;
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

const Effects = ({ params, onParamChange }) => {
  return (
    <EffectsContainer>
      <Title>Effects</Title>
      
      <EffectsGrid>
        {/* Reverb */}
        <EffectSection>
          <EffectTitle>Reverb</EffectTitle>
          <ToggleButton
            active={params.reverb?.enabled || false}
            onClick={() => onParamChange('effects', 'reverb.enabled', !params.reverb?.enabled)}
          >
            {params.reverb?.enabled ? 'ON' : 'OFF'}
          </ToggleButton>
          <DialGrid>
            <EnhancedDial
              value={params.reverb?.roomSize || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'reverb.roomSize', value)}
              label="Room Size"
              unit="%"
              title="Reverb Room Size"
            />
            <EnhancedDial
              value={params.reverb?.damping || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'reverb.damping', value)}
              label="Damping"
              unit="%"
              title="Reverb Damping"
            />
            <EnhancedDial
              value={params.reverb?.wet || 0.3}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'reverb.wet', value)}
              label="Wet Level"
              unit="%"
              title="Reverb Wet Level"
            />
            <EnhancedDial
              value={params.reverb?.dry || 0.7}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'reverb.dry', value)}
              label="Dry Level"
              unit="%"
              title="Reverb Dry Level"
            />
          </DialGrid>
        </EffectSection>

        {/* Delay */}
        <EffectSection>
          <EffectTitle>Delay</EffectTitle>
          <ToggleButton
            active={params.delay?.enabled || false}
            onClick={() => onParamChange('effects', 'delay.enabled', !params.delay?.enabled)}
          >
            {params.delay?.enabled ? 'ON' : 'OFF'}
          </ToggleButton>
          <DialGrid>
            <EnhancedDial
              value={params.delay?.time || 0.3}
              min={0}
              max={2}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'delay.time', value)}
              label="Time"
              unit="s"
              title="Delay Time"
            />
            <EnhancedDial
              value={params.delay?.feedback || 0.3}
              min={0}
              max={0.9}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'delay.feedback', value)}
              label="Feedback"
              unit="%"
              title="Delay Feedback"
            />
            <EnhancedDial
              value={params.delay?.wet || 0.3}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'delay.wet', value)}
              label="Wet Level"
              unit="%"
              title="Delay Wet Level"
            />
            <EnhancedDial
              value={params.delay?.dry || 0.7}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'delay.dry', value)}
              label="Dry Level"
              unit="%"
              title="Delay Dry Level"
            />
          </DialGrid>
        </EffectSection>

        {/* Distortion */}
        <EffectSection>
          <EffectTitle>Distortion</EffectTitle>
          <ToggleButton
            active={params.distortion?.enabled || false}
            onClick={() => onParamChange('effects', 'distortion.enabled', !params.distortion?.enabled)}
          >
            {params.distortion?.enabled ? 'ON' : 'OFF'}
          </ToggleButton>
          <DialGrid>
            <EnhancedDial
              value={params.distortion?.amount || 0}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'distortion.amount', value)}
              label="Amount"
              unit="%"
              title="Distortion Amount"
            />
            <EnhancedDial
              value={params.distortion?.oversample || 2}
              min={1}
              max={4}
              step={1}
              onChange={(value) => onParamChange('effects', 'distortion.oversample', value)}
              label="Oversample"
              title="Distortion Oversampling"
            />
            <EnhancedDial
              value={params.distortion?.wet || 0.3}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'distortion.wet', value)}
              label="Wet Level"
              unit="%"
              title="Distortion Wet Level"
            />
            <EnhancedDial
              value={params.distortion?.dry || 0.7}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'distortion.dry', value)}
              label="Dry Level"
              unit="%"
              title="Distortion Dry Level"
            />
          </DialGrid>
        </EffectSection>

        {/* Chorus */}
        <EffectSection>
          <EffectTitle>Chorus</EffectTitle>
          <ToggleButton
            active={params.chorus?.enabled || false}
            onClick={() => onParamChange('effects', 'chorus.enabled', !params.chorus?.enabled)}
          >
            {params.chorus?.enabled ? 'ON' : 'OFF'}
          </ToggleButton>
          <DialGrid>
            <EnhancedDial
              value={params.chorus?.rate || 1.5}
              min={0.1}
              max={10}
              step={0.1}
              onChange={(value) => onParamChange('effects', 'chorus.rate', value)}
              label="Rate"
              unit="Hz"
              title="Chorus Rate"
            />
            <EnhancedDial
              value={params.chorus?.depth || 0.002}
              min={0.001}
              max={0.01}
              step={0.001}
              onChange={(value) => onParamChange('effects', 'chorus.depth', value)}
              label="Depth"
              title="Chorus Depth"
            />
            <EnhancedDial
              value={params.chorus?.wet || 0.3}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'chorus.wet', value)}
              label="Wet Level"
              unit="%"
              title="Chorus Wet Level"
            />
            <EnhancedDial
              value={params.chorus?.dry || 0.7}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('effects', 'chorus.dry', value)}
              label="Dry Level"
              unit="%"
              title="Chorus Dry Level"
            />
          </DialGrid>
        </EffectSection>
      </EffectsGrid>
    </EffectsContainer>
  );
};

export default Effects; 