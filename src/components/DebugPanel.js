import React, { useState } from 'react';
import styled from 'styled-components';

const DebugPanelContainer = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid #FFD700;
  margin-bottom: 8px;
`;

const DebugTitle = styled.h3`
  color: #FFD700;
  font-size: 0.8rem;
  margin-bottom: 8px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const TestButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const TestButton = styled.button`
  background: linear-gradient(45deg, #FF4500, #FF6347);
  border: 1px solid #8B0000;
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
    transform: translateY(-1px);
    box-shadow: 
      inset 0 0 8px rgba(0, 0, 0, 0.3),
      0 3px 10px rgba(0, 0, 0, 0.5);
    background: linear-gradient(45deg, #FF6347, #FF7F50);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 
      inset 0 0 12px rgba(0, 0, 0, 0.4),
      0 1px 4px rgba(0, 0, 0, 0.3);
  }
`;

const DebugOutput = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #FFD700;
  border-radius: 4px;
  padding: 8px;
  font-size: 0.6rem;
  color: #FFD700;
  font-family: 'Courier New', monospace;
  max-height: 100px;
  overflow-y: auto;
  text-align: left;
`;

const DebugMessage = styled.p`
  margin: 2px 0;
  line-height: 1.2;
  
  &.success {
    color: #00FF00;
  }
  
  &.warning {
    color: #FFA500;
  }
  
  &.error {
    color: #FF0000;
  }
`;

function DebugPanel({ synth, synthState, drumMachine, drumState }) {
  const [debugMessages, setDebugMessages] = useState([
    { id: 1, text: 'Click test buttons to diagnose synth issues...', type: 'info' }
  ]);

  const addDebugMessage = (text, type = 'info') => {
    const newMessage = {
      id: Date.now(),
      text,
      type
    };
    
    setDebugMessages(prev => {
      const updated = [...prev, newMessage];
      // Keep only last 10 messages
      return updated.slice(-10);
    });
  };

  const handleTestTone = () => {
    addDebugMessage('🔊 Testing basic audio output...', 'info');
    if (synth?.playTestTone) {
      synth.playTestTone();
      addDebugMessage('✅ Test tone triggered - check console for details', 'success');
    } else {
      addDebugMessage('❌ Test tone function not available', 'error');
    }
  };

  const handleForceResume = () => {
    addDebugMessage('🔄 Forcing audio context resume...', 'info');
    if (synth?.forceResume) {
      synth.forceResume();
      addDebugMessage('✅ Resume command sent - check console for details', 'success');
    } else {
      addDebugMessage('❌ Force resume function not available', 'error');
    }
  };

  const handleRunTests = () => {
    addDebugMessage('🧪 Running comprehensive system tests...', 'info');
    if (synth?.runSystemTests) {
      synth.runSystemTests();
      addDebugMessage('✅ All tests completed - check console for detailed results', 'success');
    } else {
      addDebugMessage('❌ System tests function not available', 'error');
    }
  };

  const handleCheckStatus = () => {
    addDebugMessage('📊 Checking current system status...', 'info');
    
    if (!synth) {
      addDebugMessage('❌ No synthesizer available', 'error');
      return;
    }

    const status = {
      audioContextState: synth.audioContext?.state || 'unknown',
      sampleRate: synth.audioContext?.sampleRate || 'N/A',
      masterVolume: synthState?.masterVolume || 'N/A',
      filterCutoff: synthState?.filter?.cutoff || 'N/A',
      osc1Level: synthState?.oscillators?.osc1?.level || 'N/A',
      activeVoices: synth.activeVoices?.size || 0
    };

    addDebugMessage(`📊 Status Report:`, 'info');
    addDebugMessage(`   Audio Context: ${status.audioContextState}`, 
                   status.audioContextState === 'running' ? 'success' : 'warning');
    addDebugMessage(`   Sample Rate: ${status.sampleRate} Hz`, 'info');
    addDebugMessage(`   Master Volume: ${status.masterVolume}`, 'info');
    addDebugMessage(`   Filter Cutoff: ${status.filterCutoff} Hz`, 'info');
    addDebugMessage(`   OSC1 Level: ${status.osc1Level}`, 'info');
    addDebugMessage(`   Active Voices: ${status.activeVoices}`, 'info');

    if (status.audioContextState === 'suspended') {
      addDebugMessage('⚠️  Audio context is suspended - click "Force Resume" or interact with the page', 'warning');
    }
  };

  return (
    <DebugPanelContainer>
      <DebugTitle>🔧 SYSTEM TESTS</DebugTitle>
      <TestButtons>
        <TestButton onClick={handleTestTone}>
          🔊 Test Tone
        </TestButton>
        <TestButton onClick={handleForceResume}>
          🔄 Force Resume
        </TestButton>
        <TestButton onClick={handleRunTests}>
          🧪 Run All Tests
        </TestButton>
        <TestButton onClick={handleCheckStatus}>
          📊 Check Status
        </TestButton>
      </TestButtons>
      <DebugOutput>
        {debugMessages.map(message => (
          <DebugMessage key={message.id} className={message.type}>
            {message.text}
          </DebugMessage>
        ))}
      </DebugOutput>
    </DebugPanelContainer>
  );
}

export default DebugPanel; 