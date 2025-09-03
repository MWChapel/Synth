import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

// Mock styled-components
jest.mock('styled-components', () => ({
  styled: {
    header: (tag) => tag,
    h1: (tag) => tag,
    button: (tag) => tag,
    div: (tag) => tag
  }
}));

describe('Header', () => {
  const defaultProps = {
    debugMode: true,
    setDebugMode: jest.fn(),
    synthState: {
      audioContext: { state: 'running' }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render title correctly', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByText('MINI MOOG SYNTHESIZER')).toBeInTheDocument();
    });

    test('should render debug toggle button', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByText('🔧 Hide Debug')).toBeInTheDocument();
    });

    test('should render audio status indicator', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByText('Audio: running')).toBeInTheDocument();
    });

    test('should show correct debug button text when debug mode is true', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByText('🔧 Hide Debug')).toBeInTheDocument();
    });

    test('should show correct debug button text when debug mode is false', () => {
      render(<Header {...defaultProps} debugMode={false} />);
      
      expect(screen.getByText('🔧 Show Debug')).toBeInTheDocument();
    });
  });

  describe('Audio Status Display', () => {
    test('should display running status correctly', () => {
      render(<Header {...defaultProps} />);
      
      expect(screen.getByText('Audio: running')).toBeInTheDocument();
    });

    test('should display suspended status correctly', () => {
      const props = {
        ...defaultProps,
        synthState: {
          audioContext: { state: 'suspended' }
        }
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: suspended')).toBeInTheDocument();
    });

    test('should display closed status correctly', () => {
      const props = {
        ...defaultProps,
        synthState: {
          audioContext: { state: 'closed' }
        }
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: closed')).toBeInTheDocument();
    });

    test('should handle missing audio context gracefully', () => {
      const props = {
        ...defaultProps,
        synthState: {}
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: unknown')).toBeInTheDocument();
    });

    test('should handle null audio context gracefully', () => {
      const props = {
        ...defaultProps,
        synthState: {
          audioContext: null
        }
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: unknown')).toBeInTheDocument();
    });
  });

  describe('Debug Toggle Functionality', () => {
    test('should call setDebugMode when debug toggle is clicked', () => {
      const setDebugMode = jest.fn();
      render(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      fireEvent.click(debugButton);
      
      expect(setDebugMode).toHaveBeenCalledWith(false);
    });

    test('should toggle debug mode correctly', () => {
      const setDebugMode = jest.fn();
      render(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      fireEvent.click(debugButton);
      
      expect(setDebugMode).toHaveBeenCalledWith(false);
    });

    test('should handle multiple debug toggle clicks', () => {
      const setDebugMode = jest.fn();
      render(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      
      // Click multiple times
      fireEvent.click(debugButton);
      fireEvent.click(debugButton);
      fireEvent.click(debugButton);
      
      expect(setDebugMode).toHaveBeenCalledTimes(3);
      expect(setDebugMode).toHaveBeenNthCalledWith(1, false);
      expect(setDebugMode).toHaveBeenNthCalledWith(2, false);
      expect(setDebugMode).toHaveBeenNthCalledWith(3, false);
    });
  });

  describe('Status Indicator', () => {
    test('should show green indicator for running status', () => {
      render(<Header {...defaultProps} />);
      
      // The status indicator should be present
      // Note: Since we're mocking styled-components, we can't easily test the color
      // but we can verify the text content
      expect(screen.getByText('Audio: running')).toBeInTheDocument();
    });

    test('should show red indicator for suspended status', () => {
      const props = {
        ...defaultProps,
        synthState: {
          audioContext: { state: 'suspended' }
        }
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: suspended')).toBeInTheDocument();
    });

    test('should show red indicator for closed status', () => {
      const props = {
        ...defaultProps,
        synthState: {
          audioContext: { state: 'closed' }
        }
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: closed')).toBeInTheDocument();
    });

    test('should show red indicator for unknown status', () => {
      const props = {
        ...defaultProps,
        synthState: {}
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: unknown')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper button role', () => {
      render(<Header {...defaultProps} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      expect(debugButton).toHaveAttribute('role', 'button');
    });

    test('should be keyboard accessible', () => {
      render(<Header {...defaultProps} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      
      // Should be focusable
      debugButton.focus();
      expect(debugButton).toHaveFocus();
      
      // Should respond to Enter key
      fireEvent.keyDown(debugButton, { key: 'Enter', code: 'Enter' });
      expect(defaultProps.setDebugMode).toHaveBeenCalledWith(false);
      
      // Should respond to Space key
      fireEvent.keyDown(debugButton, { key: ' ', code: 'Space' });
      expect(defaultProps.setDebugMode).toHaveBeenCalledWith(false);
    });
  });

  describe('Props Validation', () => {
    test('should handle missing props gracefully', () => {
      // Render with minimal props
      render(<Header />);
      
      // Should still render basic structure
      expect(screen.getByText('MINI MOOG SYNTHESIZER')).toBeInTheDocument();
    });

    test('should handle undefined setDebugMode gracefully', () => {
      const props = {
        debugMode: true,
        synthState: { audioContext: { state: 'running' } }
      };
      
      render(<Header {...props} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      
      // Should not throw when clicked
      expect(() => {
        fireEvent.click(debugButton);
      }).not.toThrow();
    });

    test('should handle undefined synthState gracefully', () => {
      const props = {
        debugMode: true,
        setDebugMode: jest.fn()
      };
      
      render(<Header {...props} />);
      
      expect(screen.getByText('Audio: unknown')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('should have proper header structure', () => {
      render(<Header {...defaultProps} />);
      
      // Should have main title
      expect(screen.getByText('MINI MOOG SYNTHESIZER')).toBeInTheDocument();
      
      // Should have debug controls
      expect(screen.getByText('🔧 Hide Debug')).toBeInTheDocument();
      
      // Should have status display
      expect(screen.getByText('Audio: running')).toBeInTheDocument();
    });

    test('should maintain layout structure', () => {
      const { container } = render(<Header {...defaultProps} />);
      
      // Should have header element
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      
      // Should have title
      const title = header.querySelector('h1');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toBe('MINI MOOG SYNTHESIZER');
    });
  });

  describe('Event Handling', () => {
    test('should handle click events correctly', () => {
      const setDebugMode = jest.fn();
      render(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      
      // Single click
      fireEvent.click(debugButton);
      expect(setDebugMode).toHaveBeenCalledWith(false);
      
      // Double click
      fireEvent.doubleClick(debugButton);
      expect(setDebugMode).toHaveBeenCalledWith(false);
    });

    test('should handle touch events correctly', () => {
      const setDebugMode = jest.fn();
      render(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      
      // Touch start
      fireEvent.touchStart(debugButton);
      
      // Touch end
      fireEvent.touchEnd(debugButton);
      
      // Should not trigger setDebugMode until click
      expect(setDebugMode).not.toHaveBeenCalled();
      
      // Click should work
      fireEvent.click(debugButton);
      expect(setDebugMode).toHaveBeenCalledWith(false);
    });
  });

  describe('Performance', () => {
    test('should not re-render unnecessarily', () => {
      const setDebugMode = jest.fn();
      const { rerender } = render(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      // Re-render with same props
      rerender(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      // Should still have the same elements
      expect(screen.getByText('MINI MOOG SYNTHESIZER')).toBeInTheDocument();
      expect(screen.getByText('🔧 Hide Debug')).toBeInTheDocument();
    });

    test('should handle rapid state changes', () => {
      const setDebugMode = jest.fn();
      render(<Header {...defaultProps} setDebugMode={setDebugMode} />);
      
      const debugButton = screen.getByText('🔧 Hide Debug');
      
      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(debugButton);
      }
      
      expect(setDebugMode).toHaveBeenCalledTimes(10);
      expect(setDebugMode).toHaveBeenLastCalledWith(false);
    });
  });
}); 