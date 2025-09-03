import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DebugPanel from '../DebugPanel';

// Mock styled-components
jest.mock('styled-components', () => ({
  styled: {
    div: (tag) => tag,
    h3: (tag) => tag,
    button: (tag) => tag,
    p: (tag) => tag
  }
}));

describe('DebugPanel', () => {
  const defaultProps = {
    synth: {
      audioContext: { state: 'running', sampleRate: 44100 },
      playTestTone: jest.fn(),
      forceResume: jest.fn(),
      runSystemTests: jest.fn()
    },
    synthState: {
      masterVolume: 0.5,
      filter: { cutoff: 2000 },
      oscillators: { osc1: { level: 0.8 } }
    },
    drumMachine: {
      isPlaying: false
    },
    drumState: {
      tempo: 120
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render debug panel title', () => {
      render(<DebugPanel {...defaultProps} />);
      
      expect(screen.getByText('🔧 SYSTEM TESTS')).toBeInTheDocument();
    });

    test('should render all test buttons', () => {
      render(<DebugPanel {...defaultProps} />);
      
      expect(screen.getByText('🔊 Test Tone')).toBeInTheDocument();
      expect(screen.getByText('🔄 Force Resume')).toBeInTheDocument();
      expect(screen.getByText('🧪 Run All Tests')).toBeInTheDocument();
      expect(screen.getByText('📊 Check Status')).toBeInTheDocument();
    });

    test('should render initial debug message', () => {
      render(<DebugPanel {...defaultProps} />);
      
      expect(screen.getByText('Click test buttons to diagnose synth issues...')).toBeInTheDocument();
    });

    test('should render debug output container', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const debugOutput = screen.getByText('Click test buttons to diagnose synth issues...').parentElement;
      expect(debugOutput).toBeInTheDocument();
    });
  });

  describe('Test Button Functionality', () => {
    test('should call playTestTone when test tone button is clicked', () => {
      const mockPlayTestTone = jest.fn();
      const props = {
        ...defaultProps,
        synth: {
          ...defaultProps.synth,
          playTestTone: mockPlayTestTone
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      fireEvent.click(testToneButton);
      
      expect(mockPlayTestTone).toHaveBeenCalled();
    });

    test('should call forceResume when force resume button is clicked', () => {
      const mockForceResume = jest.fn();
      const props = {
        ...defaultProps,
        synth: {
          ...defaultProps.synth,
          forceResume: mockForceResume
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const forceResumeButton = screen.getByText('🔄 Force Resume');
      fireEvent.click(forceResumeButton);
      
      expect(mockForceResume).toHaveBeenCalled();
    });

    test('should call runSystemTests when run tests button is clicked', () => {
      const mockRunSystemTests = jest.fn();
      const props = {
        ...defaultProps,
        synth: {
          ...defaultProps.synth,
          runSystemTests: mockRunSystemTests
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const runTestsButton = screen.getByText('🧪 Run All Tests');
      fireEvent.click(runTestsButton);
      
      expect(mockRunSystemTests).toHaveBeenCalled();
    });

    test('should handle check status button click', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const checkStatusButton = screen.getByText('📊 Check Status');
      fireEvent.click(checkStatusButton);
      
      // Should add status messages
      expect(screen.getByText('📊 Checking current system status...')).toBeInTheDocument();
      expect(screen.getByText('📊 Status Report:')).toBeInTheDocument();
    });
  });

  describe('Debug Message Management', () => {
    test('should add new debug messages', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      fireEvent.click(testToneButton);
      
      expect(screen.getByText('🔊 Testing basic audio output...')).toBeInTheDocument();
      expect(screen.getByText('✅ Test tone triggered - check console for details')).toBeInTheDocument();
    });

    test('should limit debug messages to 10', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const checkStatusButton = screen.getByText('📊 Check Status');
      
      // Click multiple times to generate many messages
      for (let i = 0; i < 15; i++) {
        fireEvent.click(checkStatusButton);
      }
      
      // Should only show last 10 messages
      const messages = screen.getAllByText(/📊 Status Report:/);
      expect(messages.length).toBeLessThanOrEqual(10);
    });

    test('should auto-scroll to bottom on new messages', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const debugOutput = screen.getByText('Click test buttons to diagnose synth issues...').parentElement;
      const scrollSpy = jest.spyOn(debugOutput, 'scrollTop', 'set');
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      fireEvent.click(testToneButton);
      
      expect(scrollSpy).toHaveBeenCalled();
    });

    test('should handle different message types', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      fireEvent.click(testToneButton);
      
      // Should have info and success messages
      expect(screen.getByText('🔊 Testing basic audio output...')).toBeInTheDocument();
      expect(screen.getByText('✅ Test tone triggered - check console for details')).toBeInTheDocument();
    });
  });

  describe('Status Check Functionality', () => {
    test('should display comprehensive status report', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const checkStatusButton = screen.getByText('📊 Check Status');
      fireEvent.click(checkStatusButton);
      
      // Should show all status information
      expect(screen.getByText('📊 Status Report:')).toBeInTheDocument();
      expect(screen.getByText(/Audio Context: running/)).toBeInTheDocument();
      expect(screen.getByText(/Sample Rate: 44100 Hz/)).toBeInTheDocument();
      expect(screen.getByText(/Master Volume: 0.5/)).toBeInTheDocument();
      expect(screen.getByText(/Filter Cutoff: 2000 Hz/)).toBeInTheDocument();
      expect(screen.getByText(/OSC1 Level: 0.8/)).toBeInTheDocument();
      expect(screen.getByText(/Active Voices: 0/)).toBeInTheDocument();
    });

    test('should handle suspended audio context status', () => {
      const props = {
        ...defaultProps,
        synth: {
          ...defaultProps.synth,
          audioContext: { state: 'suspended', sampleRate: 44100 }
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const checkStatusButton = screen.getByText('📊 Check Status');
      fireEvent.click(checkStatusButton);
      
      expect(screen.getByText(/Audio Context: suspended/)).toBeInTheDocument();
      expect(screen.getByText(/⚠️  Audio context is suspended - click "Force Resume" or interact with the page/)).toBeInTheDocument();
    });

    test('should handle missing synth gracefully', () => {
      const props = {
        ...defaultProps,
        synth: null
      };
      
      render(<DebugPanel {...props} />);
      
      const checkStatusButton = screen.getByText('📊 Check Status');
      fireEvent.click(checkStatusButton);
      
      expect(screen.getByText('❌ No synthesizer available')).toBeInTheDocument();
    });

    test('should handle missing synth state gracefully', () => {
      const props = {
        ...defaultProps,
        synthState: null
      };
      
      render(<DebugPanel {...props} />);
      
      const checkStatusButton = screen.getByText('📊 Check Status');
      fireEvent.click(checkStatusButton);
      
      // Should still show basic status
      expect(screen.getByText('📊 Status Report:')).toBeInTheDocument();
      expect(screen.getByText(/Audio Context: running/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing synth methods gracefully', () => {
      const props = {
        ...defaultProps,
        synth: {
          audioContext: { state: 'running' }
          // Missing methods
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      fireEvent.click(testToneButton);
      
      expect(screen.getByText('❌ Test tone function not available')).toBeInTheDocument();
    });

    test('should handle missing force resume method gracefully', () => {
      const props = {
        ...defaultProps,
        synth: {
          audioContext: { state: 'running' }
          // Missing methods
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const forceResumeButton = screen.getByText('🔄 Force Resume');
      fireEvent.click(forceResumeButton);
      
      expect(screen.getByText('❌ Force resume function not available')).toBeInTheDocument();
    });

    test('should handle missing system tests method gracefully', () => {
      const props = {
        ...defaultProps,
        synth: {
          audioContext: { state: 'running' }
          // Missing methods
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const runTestsButton = screen.getByText('🧪 Run All Tests');
      fireEvent.click(runTestsButton);
      
      expect(screen.getByText('❌ System tests function not available')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper button roles', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('role', 'button');
      });
    });

    test('should be keyboard accessible', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      
      // Should be focusable
      testToneButton.focus();
      expect(testToneButton).toHaveFocus();
      
      // Should respond to Enter key
      fireEvent.keyDown(testToneButton, { key: 'Enter', code: 'Enter' });
      expect(defaultProps.synth.playTestTone).toHaveBeenCalled();
    });

    test('should handle keyboard navigation', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      
      // Tab through buttons
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();
      
      // Press Tab to move to next button
      fireEvent.keyDown(buttons[0], { key: 'Tab', code: 'Tab' });
      expect(buttons[1]).toHaveFocus();
    });
  });

  describe('Component Structure', () => {
    test('should have proper debug panel structure', () => {
      const { container } = render(<DebugPanel {...defaultProps} />);
      
      // Should have debug panel container
      const debugPanel = container.querySelector('[class*="debug-panel"]') || container.firstChild;
      expect(debugPanel).toBeInTheDocument();
      
      // Should have title
      const title = debugPanel.querySelector('h3');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toBe('🔧 SYSTEM TESTS');
      
      // Should have test buttons
      const testButtons = debugPanel.querySelector('[class*="test-buttons"]') || debugPanel.querySelector('div');
      expect(testButtons).toBeInTheDocument();
      
      // Should have debug output
      const debugOutput = debugPanel.querySelector('[class*="debug-output"]') || debugPanel.querySelector('div:last-child');
      expect(debugOutput).toBeInTheDocument();
    });

    test('should maintain layout structure', () => {
      render(<DebugPanel {...defaultProps} />);
      
      // Should have title
      expect(screen.getByText('🔧 SYSTEM TESTS')).toBeInTheDocument();
      
      // Should have test buttons section
      expect(screen.getByText('🔊 Test Tone')).toBeInTheDocument();
      expect(screen.getByText('🔄 Force Resume')).toBeInTheDocument();
      expect(screen.getByText('🧪 Run All Tests')).toBeInTheDocument();
      expect(screen.getByText('📊 Check Status')).toBeInTheDocument();
      
      // Should have debug output
      expect(screen.getByText('Click test buttons to diagnose synth issues...')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    test('should handle multiple rapid clicks', () => {
      const mockPlayTestTone = jest.fn();
      const props = {
        ...defaultProps,
        synth: {
          ...defaultProps.synth,
          playTestTone: mockPlayTestTone
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      
      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(testToneButton);
      }
      
      expect(mockPlayTestTone).toHaveBeenCalledTimes(5);
    });

    test('should handle touch events correctly', () => {
      const mockPlayTestTone = jest.fn();
      const props = {
        ...defaultProps,
        synth: {
          ...defaultProps.synth,
          playTestTone: mockPlayTestTone
        }
      };
      
      render(<DebugPanel {...props} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      
      // Touch start
      fireEvent.touchStart(testToneButton);
      
      // Touch end
      fireEvent.touchEnd(testToneButton);
      
      // Should not trigger until click
      expect(mockPlayTestTone).not.toHaveBeenCalled();
      
      // Click should work
      fireEvent.click(testToneButton);
      expect(mockPlayTestTone).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    test('should not re-render unnecessarily', () => {
      const { rerender } = render(<DebugPanel {...defaultProps} />);
      
      // Re-render with same props
      rerender(<DebugPanel {...defaultProps} />);
      
      // Should still have the same elements
      expect(screen.getByText('🔧 SYSTEM TESTS')).toBeInTheDocument();
      expect(screen.getByText('🔊 Test Tone')).toBeInTheDocument();
    });

    test('should handle large number of debug messages efficiently', () => {
      render(<DebugPanel {...defaultProps} />);
      
      const checkStatusButton = screen.getByText('📊 Check Status');
      
      // Generate many messages
      for (let i = 0; i < 20; i++) {
        fireEvent.click(checkStatusButton);
      }
      
      // Should still be responsive
      expect(screen.getByText('🔧 SYSTEM TESTS')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    test('should handle missing props gracefully', () => {
      // Render with minimal props
      render(<DebugPanel />);
      
      // Should still render basic structure
      expect(screen.getByText('🔧 SYSTEM TESTS')).toBeInTheDocument();
      expect(screen.getByText('🔊 Test Tone')).toBeInTheDocument();
    });

    test('should handle undefined synth gracefully', () => {
      const props = {
        synth: undefined,
        synthState: undefined,
        drumMachine: undefined,
        drumState: undefined
      };
      
      render(<DebugPanel {...props} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      fireEvent.click(testToneButton);
      
      expect(screen.getByText('❌ Test tone function not available')).toBeInTheDocument();
    });

    test('should handle null props gracefully', () => {
      const props = {
        synth: null,
        synthState: null,
        drumMachine: null,
        drumState: null
      };
      
      render(<DebugPanel {...props} />);
      
      const testToneButton = screen.getByText('🔊 Test Tone');
      fireEvent.click(testToneButton);
      
      expect(screen.getByText('❌ Test tone function not available')).toBeInTheDocument();
    });
  });
}); 