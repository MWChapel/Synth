import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EnhancedDial from './EnhancedDial';

const EnvelopesContainer = styled.div`
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

const EnvelopeGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EnvelopeSection = styled.div`
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

const EnvelopeTitle = styled.h4`
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

const EnvelopeGraph = styled.div`
  width: 100%;
  height: 80px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  margin: 10px 0;
`;

const EnvelopePath = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const EnvelopeLine = styled.path`
  stroke: #FFD700;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const EnvelopePoint = styled.circle`
  fill: #FFA500;
  stroke: #FFD700;
  stroke-width: 1;
`;

const EnvelopeLabel = styled.text`
  fill: #FFD700;
  font-size: 8px;
  font-family: 'Courier New', monospace;
  text-anchor: middle;
`;

const Envelopes = ({ params, onParamChange }) => {
  const [graphKey, setGraphKey] = useState(0);

  // Update graph when parameters change
  useEffect(() => {
    setGraphKey(prev => prev + 1);
  }, [params.amplitude, params.filter]);

  // Function to generate ADSR envelope path
  const generateEnvelopePath = (envelope, width, height) => {
    const { attack, decay, sustain, release } = envelope;
    const totalTime = attack + decay + release;
    
    // Normalize times to fit in the graph width
    const attackX = (attack / totalTime) * width * 0.8;
    const decayX = attackX + (decay / totalTime) * width * 0.8;
    const releaseX = decayX + (release / totalTime) * width * 0.8;
    
    // Y coordinates (inverted because SVG Y=0 is at top)
    const startY = height * 0.9;
    const peakY = height * 0.1;
    const sustainY = height * (0.9 - sustain * 0.8);
    const endY = height * 0.9;
    
    // Create the path
    const path = `M 0 ${startY} L ${attackX} ${peakY} L ${decayX} ${sustainY} L ${releaseX} ${endY}`;
    
    return {
      path,
      points: [
        { x: 0, y: startY, label: 'Start' },
        { x: attackX, y: peakY, label: 'A' },
        { x: decayX, y: sustainY, label: 'S' },
        { x: releaseX, y: endY, label: 'R' }
      ]
    };
  };

  return (
    <EnvelopesContainer>
      <Title>Envelopes</Title>
      
      <EnvelopeGrid>
        {/* Amplitude Envelope */}
        <EnvelopeSection>
          <EnvelopeTitle>Amplitude Envelope</EnvelopeTitle>
          
          <EnvelopeGraph key={graphKey}>
            <EnvelopePath>
              {(() => {
                const envelopeData = generateEnvelopePath(
                  params.amplitude || { attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.3 },
                  300,
                  80
                );
                return (
                  <>
                    <EnvelopeLine d={envelopeData.path} />
                    {envelopeData.points.map((point, index) => (
                      <g key={index}>
                        <EnvelopePoint cx={point.x} cy={point.y} r="2" />
                        <EnvelopeLabel x={point.x} y={point.y - 6}>
                          {point.label}
                        </EnvelopeLabel>
                      </g>
                    ))}
                  </>
                );
              })()}
            </EnvelopePath>
          </EnvelopeGraph>
          
          <DialGrid>
            <EnhancedDial
              value={params.amplitude?.attack || 0.1}
              min={0.001}
              max={2}
              step={0.001}
              onChange={(value) => onParamChange('envelopes', 'amplitude.attack', value)}
              label="Attack"
              unit="s"
              title="Amplitude Attack Time"
            />
            <EnhancedDial
              value={params.amplitude?.decay || 0.1}
              min={0.001}
              max={2}
              step={0.001}
              onChange={(value) => onParamChange('envelopes', 'amplitude.decay', value)}
              label="Decay"
              unit="s"
              title="Amplitude Decay Time"
            />
            <EnhancedDial
              value={params.amplitude?.sustain || 0.7}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('envelopes', 'amplitude.sustain', value)}
              label="Sustain"
              unit="%"
              title="Amplitude Sustain Level"
            />
            <EnhancedDial
              value={params.amplitude?.release || 0.3}
              min={0.001}
              max={2}
              step={0.001}
              onChange={(value) => onParamChange('envelopes', 'amplitude.release', value)}
              label="Release"
              unit="s"
              title="Amplitude Release Time"
            />
          </DialGrid>
        </EnvelopeSection>

        {/* Filter Envelope */}
        <EnvelopeSection>
          <EnvelopeTitle>Filter Envelope</EnvelopeTitle>
          
          <EnvelopeGraph key={graphKey}>
            <EnvelopePath>
              {(() => {
                const envelopeData = generateEnvelopePath(
                  params.filter || { attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.3 },
                  300,
                  80
                );
                return (
                  <>
                    <EnvelopeLine d={envelopeData.path} />
                    {envelopeData.points.map((point, index) => (
                      <g key={index}>
                        <EnvelopePoint cx={point.x} cy={point.y} r="2" />
                        <EnvelopeLabel x={point.x} y={point.y - 6}>
                          {point.label}
                        </EnvelopeLabel>
                      </g>
                    ))}
                  </>
                );
              })()}
            </EnvelopePath>
          </EnvelopeGraph>
          
          <DialGrid>
            <EnhancedDial
              value={params.filter?.attack || 0.1}
              min={0.001}
              max={2}
              step={0.001}
              onChange={(value) => onParamChange('envelopes', 'filter.attack', value)}
              label="Attack"
              unit="s"
              title="Filter Attack Time"
            />
            <EnhancedDial
              value={params.filter?.decay || 0.1}
              min={0.001}
              max={2}
              step={0.001}
              onChange={(value) => onParamChange('envelopes', 'filter.decay', value)}
              label="Decay"
              unit="s"
              title="Filter Decay Time"
            />
            <EnhancedDial
              value={params.filter?.sustain || 0.5}
              min={0}
              max={1}
              step={0.01}
              onChange={(value) => onParamChange('envelopes', 'filter.sustain', value)}
              label="Sustain"
              unit="%"
              title="Filter Sustain Level"
            />
            <EnhancedDial
              value={params.filter?.release || 0.3}
              min={0.001}
              max={2}
              step={0.001}
              onChange={(value) => onParamChange('envelopes', 'filter.release', value)}
              label="Release"
              unit="s"
              title="Filter Release Time"
            />
          </DialGrid>
        </EnvelopeSection>
      </EnvelopeGrid>
    </EnvelopesContainer>
  );
};

export default Envelopes; 