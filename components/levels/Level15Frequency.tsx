import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Waves } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level15Frequency: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  // Use Refs for values to prevent Re-renders on every slider move
  const freqRef = useRef(50);
  const ampRef = useRef(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State only for final check/lock
  const [locked, setLocked] = useState(false);

  const TARGET_FREQ = 75;
  const TARGET_AMP = 30;
  const TOLERANCE = 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    let offset = 0;
    let animId: number;

    const animate = () => {
        const freq = freqRef.current;
        const amp = ampRef.current;

        ctx.fillStyle = '#0f1014';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw Target (Ghost)
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d433'; // Low opacity cyan
        ctx.lineWidth = 4;
        for(let x = 0; x < canvas.width; x++) {
            const y = canvas.height/2 + Math.sin((x + offset) * (TARGET_FREQ/1000)) * (TARGET_AMP);
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Player
        ctx.beginPath();
        const matchF = Math.abs(freq - TARGET_FREQ) < TOLERANCE;
        const matchA = Math.abs(amp - TARGET_AMP) < TOLERANCE;
        
        ctx.strokeStyle = (matchF && matchA) ? '#22c55e' : '#06b6d4';
        ctx.lineWidth = 2;
        ctx.shadowBlur = (matchF && matchA) ? 10 : 0;
        ctx.shadowColor = '#22c55e';

        for(let x = 0; x < canvas.width; x++) {
            const y = canvas.height/2 + Math.sin((x + offset) * (freq/1000)) * (amp);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        offset += 2;
        animId = requestAnimationFrame(animate);
    };
    
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const checkMatch = () => {
      const f = freqRef.current;
      const a = ampRef.current;
      if(Math.abs(f - TARGET_FREQ) < TOLERANCE && Math.abs(a - TARGET_AMP) < TOLERANCE) {
          if (!locked) {
              setLocked(true);
              playUISound('lock');
              setTimeout(onComplete, 800);
          }
      }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none preserve-3d">
      <header style={{ transform: 'translateZ(20px)' }}>
        <h2 className="text-3xl font-display font-bold text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
          FREQUENCY TUNING
        </h2>
        <p className="text-gray-400 mt-2">Level 15/20</p>
      </header>

      <div 
        className="bg-black/60 border border-cyan-500/30 p-8 rounded-xl backdrop-blur-md max-w-lg mx-auto shadow-2xl"
        style={{ transform: 'translateZ(40px)' }}
      >
         <canvas ref={canvasRef} width={400} height={200} className="w-full bg-black rounded-lg border border-gray-800 mb-8" />
         
         <div className="space-y-6">
             <div>
                 <label className="text-cyan-400 font-mono text-sm block mb-2">FREQUENCY</label>
                 <input 
                    type="range" min="10" max="150" 
                    defaultValue={50}
                    onInput={(e) => {
                        freqRef.current = Number((e.target as HTMLInputElement).value);
                    }}
                    onMouseUp={checkMatch}
                    onTouchEnd={checkMatch}
                    className="w-full accent-cyan-500 cursor-interactive"
                 />
             </div>
             <div>
                 <label className="text-cyan-400 font-mono text-sm block mb-2">AMPLITUDE</label>
                 <input 
                    type="range" min="10" max="100" 
                    defaultValue={50}
                    onInput={(e) => {
                        ampRef.current = Number((e.target as HTMLInputElement).value);
                    }}
                    onMouseUp={checkMatch}
                    onTouchEnd={checkMatch}
                    className="w-full accent-cyan-500 cursor-interactive"
                 />
             </div>
         </div>
      </div>

      <div className="flex justify-start w-full px-8" style={{ transform: 'translateZ(30px)' }}>
        <button onClick={onPrev} className="text-gray-500 border border-gray-700 hover:text-white px-8 py-4 rounded-lg bg-gray-900 cursor-interactive flex gap-2 items-center">
           <ArrowLeft size={18} /> BACK
        </button>
      </div>
    </div>
  );
};