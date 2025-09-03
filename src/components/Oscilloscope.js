import React, { useRef, useEffect } from 'react';

export function Oscilloscope({ audioContext, synth }) {
  const canvasRef = useRef(null);
  const circularCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!audioContext || !synth) return;

    // Get analyser node from synth
    const analyser = synth.getAnalyser();
    if (!analyser) return;
    
    analyserRef.current = analyser;

    // Get canvases and contexts
    const canvas = canvasRef.current;
    const circularCanvas = circularCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const circularCtx = circularCanvas.getContext('2d');
    
    // Set canvas sizes
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      const circularRect = circularCanvas.getBoundingClientRect();
      circularCanvas.width = circularRect.width * window.devicePixelRatio;
      circularCanvas.height = circularRect.height * window.devicePixelRatio;
      circularCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      if (!analyserRef.current) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      const canvasWidth = canvas.width / window.devicePixelRatio;
      const canvasHeight = canvas.height / window.devicePixelRatio;
      const centerY = canvasHeight / 2;

      // Draw dB scale grid lines and tick marks
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      ctx.font = '8px "Courier New", monospace';
      ctx.fillStyle = '#FFD700'; // Yellow color

      // dB levels: -6dB, -12dB, -18dB, -24dB, -30dB
      const dbLevels = [0, -6, -12, -18, -24, -30];
      
      dbLevels.forEach((db, index) => {
        // Calculate position for this dB level
        const amplitude = Math.pow(10, db / 20); // Convert dB to linear amplitude
        const yPos = centerY - (amplitude * centerY);
        const yNeg = centerY + (amplitude * centerY);

        // Draw horizontal grid lines
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(canvasWidth, yPos);
        ctx.moveTo(0, yNeg);
        ctx.lineTo(canvasWidth, yNeg);
        ctx.stroke();



        // Draw dB labels
        if (db !== 0) {
          ctx.fillText(`${db}dB`, 12, yPos - 1);
          ctx.fillText(`${db}dB`, 12, yNeg + 7);
        } else {
          ctx.fillText('0dB', 12, centerY - 1);
        }
      });

      // Draw center line (zero axis) - make it more prominent
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvasWidth, centerY);
      ctx.stroke();

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff00';
      ctx.beginPath();

      const sliceWidth = canvasWidth / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Convert 0-255 to -1 to 1 range, then center it
        const v = (dataArray[i] - 128) / 128.0;
        const y = centerY - (v * centerY);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Draw circular oscilloscope
      const circularCanvasWidth = circularCanvas.width / window.devicePixelRatio;
      const circularCanvasHeight = circularCanvas.height / window.devicePixelRatio;
      const circularCenterX = circularCanvasWidth / 2;
      const circularCenterY = circularCanvasHeight / 2;
      const maxRadius = Math.min(circularCenterX, circularCenterY) - 20;

      // Clear circular canvas
      circularCtx.fillStyle = '#000';
      circularCtx.fillRect(0, 0, circularCanvasWidth, circularCanvasHeight);



      // Draw circular waveform
      circularCtx.strokeStyle = '#00ff00';
      circularCtx.lineWidth = 2;
      circularCtx.beginPath();

      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) / 128.0;
        const angle = (i / bufferLength) * 2 * Math.PI;
        const radius = Math.abs(v) * maxRadius;
        
        const x = circularCenterX + Math.cos(angle) * radius;
        const y = circularCenterY + Math.sin(angle) * radius;

        if (i === 0) {
          circularCtx.moveTo(x, y);
        } else {
          circularCtx.lineTo(x, y);
        }
      }

      circularCtx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
    };
  }, [audioContext, synth]);

  return (
    <div className="oscilloscope-container">
      <div className="oscilloscope-header">
        <h3>Oscilloscope</h3>
      </div>
      
      <div className="oscilloscope-display" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        {/* Linear Oscilloscope */}
        <div style={{ flex: 1 }}>
          <canvas 
            ref={canvasRef}
            className="oscilloscope-canvas"
            style={{
              width: '100%',
              height: '200px',
              border: '1px solid #333',
              backgroundColor: '#000'
            }}
          />
        </div>
        
        {/* Circular Oscilloscope - Square */}
        <div style={{ width: '200px', height: '200px', flexShrink: 0 }}>
          <canvas 
            ref={circularCanvasRef}
            className="oscilloscope-canvas"
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #333',
              backgroundColor: '#000'
            }}
          />
        </div>
      </div>
      <div className="oscilloscope-info">
        <p>Left: Linear waveform | Right: Circular oscilloscope (Lissajous-style)</p>
        <p>Green traces show the audio signal amplitude over time</p>
      </div>
    </div>
  );
}
