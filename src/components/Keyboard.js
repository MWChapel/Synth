import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 160px;
  max-height: 180px;
  background: 
    linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(255, 215, 0, 0.02) 2px,
      rgba(255, 215, 0, 0.02) 4px
    );
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 12px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 8px;
    min-height: 140px;
    max-height: 160px;
  }
`;

const KeyboardTitle = styled.h3`
  text-align: center;
  color: #FFD700;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  margin: 0 0 8px 0;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
`;

const KeyboardInfo = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.5rem;
  color: #FFD700;
  font-family: 'Courier New', monospace;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const KeysContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px 8px 0 0;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 120px;
    padding: 6px 6px 0 6px;
  }
`;

const KeysRow = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  align-items: flex-end;
`;

const WhiteKey = styled.div`
  width: ${props => props.keyWidth}px;
  height: 120px;
  background: linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%);
  border: 1px solid #ccc;
  border-radius: 0 0 4px 4px;
  margin: 0 0.5px;
  cursor: pointer;
  position: relative;
  transition: all 0.1s ease;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  
  &:hover {
    background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 0 0 1px rgba(0, 0, 0, 0.1);
  }
  
  &:active, &.active {
    background: linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%);
    transform: translateY(1px);
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 0 0 1px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    height: 70px;
  }
`;

const BlackKey = styled.div`
  width: ${props => props.keyWidth}px;
  height: 80px;
  background: linear-gradient(180deg, #333 0%, #000 100%);
  border: 1px solid #000;
  border-radius: 0 0 3px 3px;
  position: absolute;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 215, 0, 0.2);
  z-index: 10;
  top: 0;
  
  &:hover {
    background: linear-gradient(180deg, #444 0%, #222 100%);
    transform: translateY(-1px);
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 0 1px rgba(255, 215, 0, 0.2);
  }
  
  &:active, &.active {
    background: linear-gradient(180deg, #222 0%, #111 100%);
    transform: translateY(1px);
    box-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 0 0 1px rgba(255, 215, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    height: 42px;
  }
`;

const KeyLabel = styled.div`
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: #FFD700;
  font-family: 'Courier New', monospace;
  pointer-events: none;
`;

const BlackKeyLabel = styled.div`
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5rem;
  color: #FFD700;
  font-family: 'Courier New', monospace;
  pointer-events: none;
`;

const KeyboardStats = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  font-size: 0.5rem;
  color: #FFD700;
  font-family: 'Courier New', monospace;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

// Note names for each octave
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
const BLACK_KEYS = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#

function Keyboard({ onNoteOn, onNoteOff }) {
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [startOctave] = useState(2); // Start from C2
  const [numOctaves] = useState(6); // 6 octaves total
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  // Handle window resize for responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate key dimensions to fit all 72 keys in the container
  const getKeyDimensions = () => {
    const isMobile = screenSize <= 768;
    const containerWidth = screenSize;
    const availableWidth = containerWidth - 48; // Account for padding and margins
    
    // We have 42 white keys total (6 octaves × 7 white keys)
    const whiteKeyWidth = Math.max(16, Math.floor(availableWidth / 42));
    const blackKeyWidth = Math.max(12, Math.floor(whiteKeyWidth * 0.6));
    
    return {
      whiteKeyWidth: isMobile ? Math.min(24, whiteKeyWidth) : whiteKeyWidth,
      blackKeyWidth: isMobile ? Math.min(16, blackKeyWidth) : blackKeyWidth
    };
  };

  const dimensions = getKeyDimensions();

  const getNoteNumber = useCallback((octave, noteIndex) => {
    return (octave + 1) * 12 + noteIndex;
  }, []);

  const getNoteName = useCallback((noteIndex) => {
    return NOTE_NAMES[noteIndex];
  }, []);

  const isBlackKey = useCallback((noteIndex) => {
    return BLACK_KEYS.includes(noteIndex);
  }, []);

  const getBlackKeyPosition = useCallback((noteIndex, whiteKeyIndex, whiteKeyWidth, blackKeyWidth) => {
    // Position black keys between white keys
    if (noteIndex === 1) return whiteKeyIndex * whiteKeyWidth + Math.floor(whiteKeyWidth * 0.7); // C#
    if (noteIndex === 3) return whiteKeyIndex * whiteKeyWidth + Math.floor(whiteKeyWidth * 0.7); // D#
    if (noteIndex === 6) return whiteKeyIndex * whiteKeyWidth + Math.floor(whiteKeyWidth * 0.7); // F#
    if (noteIndex === 8) return whiteKeyIndex * whiteKeyWidth + Math.floor(whiteKeyWidth * 0.7); // G#
    if (noteIndex === 10) return whiteKeyIndex * whiteKeyWidth + Math.floor(whiteKeyWidth * 0.7); // A#
    
    return 0;
  }, []);

  const handleKeyDown = useCallback((note, velocity = 0.8) => {
    if (!activeKeys.has(note)) {
      setActiveKeys(prev => new Set([...prev, note]));
      onNoteOn?.(note, velocity);
    }
  }, [activeKeys, onNoteOn]);

  const handleKeyUp = useCallback((note) => {
    if (activeKeys.has(note)) {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      onNoteOff?.(note);
    }
  }, [activeKeys, onNoteOff]);

  const handleMouseDown = useCallback((note) => {

    if (onNoteOn) {
      setActiveKeys(prev => new Set([...prev, note]));
      onNoteOn(note);
    } else {

    }
  }, [onNoteOn]);

  const handleMouseUp = useCallback((note) => {

    if (onNoteOff) {
      // Add a delay to ensure the note plays for a reasonable duration
      // and the attack envelope can complete (300ms should be sufficient)
      setTimeout(() => {
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
        onNoteOff(note);
      }, 300); // Reduced from 500ms to 300ms for better responsiveness
    } else {

    }
  }, [onNoteOff]);

  const handleMouseLeave = useCallback((note) => {
    // Only stop the note if it's currently active
    // This prevents stopping notes when moving between keys

    // Don't automatically stop notes on mouse leave to allow for proper note duration
  }, []);

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = {
        'a': 60, 's': 62, 'd': 64, 'f': 65, 'g': 67, 'h': 69, 'j': 71, // C4 to B4
        'q': 72, 'w': 74, 'e': 76, 'r': 77, 't': 79, 'y': 81, 'u': 83, // C5 to B5
        'z': 48, 'x': 50, 'c': 52, 'v': 53, 'b': 55, 'n': 57, 'm': 59  // C3 to B3
      };
      
      const note = keyMap[event.key.toLowerCase()];
      if (note && !event.repeat) {
        handleMouseDown(note);
      }
    };

    const handleKeyUp = (event) => {
      const keyMap = {
        'a': 60, 's': 62, 'd': 64, 'f': 65, 'g': 67, 'h': 69, 'j': 71,
        'q': 72, 'w': 74, 'e': 76, 'r': 77, 't': 79, 'y': 81, 'u': 83,
        'z': 48, 'x': 50, 'c': 52, 'v': 53, 'b': 55, 'n': 57, 'm': 59
      };
      
      const note = keyMap[event.key.toLowerCase()];
      if (note) {
        handleMouseUp(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleMouseDown, handleMouseUp]);

  // Render all 72 keys in a single horizontal row
  const renderAllKeys = () => {
    const keys = [];
    const blackKeys = [];
    let whiteKeyIndex = 0;

    // Render all octaves
    for (let octave = startOctave; octave < startOctave + numOctaves; octave++) {
      // Render white keys for this octave
      WHITE_KEYS.forEach((noteIndex) => {
        const note = getNoteNumber(octave, noteIndex);
        const noteName = getNoteName(noteIndex);
        
        keys.push(
          <WhiteKey
            key={`white-${octave}-${noteIndex}`}
            keyWidth={dimensions.whiteKeyWidth}
            className={activeKeys.has(note) ? 'active' : ''}
            onMouseDown={() => handleMouseDown(note)}
            onMouseUp={() => handleMouseUp(note)}
            onMouseLeave={() => handleMouseLeave(note)}
          >
            <KeyLabel>{noteName}</KeyLabel>
          </WhiteKey>
        );
        
        whiteKeyIndex++;
      });

      // Render black keys for this octave
      BLACK_KEYS.forEach((noteIndex) => {
        const note = getNoteNumber(octave, noteIndex);
        const noteName = getNoteName(noteIndex);
        
        // Calculate the correct white key index for this black key
        let targetWhiteKeyIndex = 0;
        if (noteIndex === 1) targetWhiteKeyIndex = (octave - startOctave) * 7; // C# after C
        else if (noteIndex === 3) targetWhiteKeyIndex = (octave - startOctave) * 7 + 1; // D# after D
        else if (noteIndex === 6) targetWhiteKeyIndex = (octave - startOctave) * 7 + 3; // F# after F
        else if (noteIndex === 8) targetWhiteKeyIndex = (octave - startOctave) * 7 + 4; // G# after G
        else if (noteIndex === 10) targetWhiteKeyIndex = (octave - startOctave) * 7 + 5; // A# after A
        
        // Calculate the position for the black key
        const whiteKeyStart = targetWhiteKeyIndex * dimensions.whiteKeyWidth;
        const blackKeyOffset = Math.floor(dimensions.whiteKeyWidth * 0.6); // Position between white keys
        const position = whiteKeyStart + blackKeyOffset;
        
        blackKeys.push(
          <BlackKey
            key={`black-${octave}-${noteIndex}`}
            keyWidth={dimensions.blackKeyWidth}
            className={activeKeys.has(note) ? 'active' : ''}
            onMouseDown={() => handleMouseDown(note)}
            onMouseUp={() => handleMouseUp(note)}
            onMouseLeave={() => handleMouseLeave(note)}
            style={{ 
              left: position,
              top: 0
            }}
          >
            <BlackKeyLabel>{noteName}</BlackKeyLabel>
          </BlackKey>
        );
      });
    }

    return { keys, blackKeys };
  };

  const { keys, blackKeys } = renderAllKeys();

  return (
    <KeyboardContainer>
      <KeysContainer>
        <KeyboardInfo>72 Keys • 6 Octaves • C2-C7</KeyboardInfo>
        <KeysRow>
          {keys}
        </KeysRow>
        {blackKeys}
        <KeyboardStats>Active: {activeKeys.size} • Total: 72</KeyboardStats>
      </KeysContainer>
    </KeyboardContainer>
  );
}

export default Keyboard; 