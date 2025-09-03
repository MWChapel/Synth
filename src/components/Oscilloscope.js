import React, { useRef, useEffect } from 'react';

export function Oscilloscope({ audioContext, synth }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!audioContext || !synth) return;

    // Get analyser node from synth
    const analyser = synth.getAnalyser();
    if (!analyser) return;
    
    analyserRef.current = analyser;

    // Get canvas and context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
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

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff00';
      ctx.beginPath();

      const canvasWidth = canvas.width / window.devicePixelRatio;
      const canvasHeight = canvas.height / window.devicePixelRatio;
      const centerY = canvasHeight / 2;
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

      // Draw center line (zero axis)
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvasWidth, centerY);
      ctx.stroke();

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
      
      <div className="oscilloscope-display">
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
        <div className="oscilloscope-info">
          <p>Real-time audio waveform visualization</p>
          <p>Green line shows the audio signal amplitude over time</p>
        </div>
      </div>
    </div>
  );
}
