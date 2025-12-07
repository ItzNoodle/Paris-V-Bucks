import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Radar, Target } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level17Keypad: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [rotation, setRotation] = useState(0);
  const [stage, setStage] = useState(1);
  const [targetZone, setTargetZone] = useState({ start: 0, width: 60 });
  const [spinning, setSpinning] = useState(false);
  const [failed, setFailed] = useState(false);
  
  const reqRef = useRef<number>(null);
  const speedRef = useRef(2);

  const TOTAL_STAGES = 3;

  const initStage = (stg: number) => {
      // Randomize target zone (avoid top dead center 0/360 boundary issues for simplicity)
      const start = Math.random() * 260 + 20; 
      const width = 70 - (stg * 15); // Smaller zone each stage
      setTargetZone({ start, width });
      setRotation(0);
      speedRef.current = 2 + stg * 1.5; // Faster each stage
      setSpinning(true);
      setFailed(false);
  };

  useEffect(() => {
      initStage(1);
      return () => cancelAnimationFrame(reqRef.current!);
  }, []);

  useEffect(() => {
      if (!spinning) return;
      
      const animate = () => {
          setRotation(prev => (prev + speedRef.current) % 360);
          reqRef.current = requestAnimationFrame(animate);
      };
      
      reqRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(reqRef.current!);
  }, [spinning]);

  const handleAction = () => {
      if (!spinning) return;
      
      // Stop
      setSpinning(false);
      cancelAnimationFrame(reqRef.current!);
      
      // Check Hit
      // Logic: rotation needs to be inside [start, start+width]
      const r = rotation;
      const { start, width } = targetZone;
      const end = start + width;
      
      if (r >= start && r <= end) {
          playUISound('lock');
          if (stage >= TOTAL_STAGES) {
              setTimeout(onComplete, 800);
          } else {
              setTimeout(() => {
                  setStage(s => s + 1);
                  initStage(stage + 1);
              }, 800);
          }
      } else {
          playUISound('error');
          setFailed(true);
          setTimeout(() => {
              setStage(1);
              initStage(1);
          }, 1000);
      }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header>
        <h2 className="text-3xl font-display font-bold text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]">
          CHRONO LOCK
        </h2>
        <p className="text-gray-400 mt-2">Level 17/20</p>
      </header>

      <div className="relative max-w-lg mx-auto flex flex-col items-center">
         <div className="mb-6 flex items-center gap-4 text-fuchsia-400 font-mono">
             <Radar className={spinning ? "animate-spin-slow" : ""} />
             <span>STAGE {stage}/{TOTAL_STAGES}</span>
         </div>

         {/* Radar Display */}
         <div 
            className="relative w-80 h-80 rounded-full border-4 border-gray-800 bg-black shadow-[0_0_40px_rgba(217,70,239,0.15)] cursor-pointer active:scale-95 transition-transform"
            onMouseDown={handleAction}
         >
             {/* Target Zone */}
             <div 
                className="absolute inset-0 rounded-full"
                style={{ 
                    background: `conic-gradient(transparent ${targetZone.start}deg, #d946ef 0deg, #d946ef ${targetZone.start + targetZone.width}deg, transparent 0deg)`,
                    opacity: 0.3
                }}
             />
             {/* Target Zone Border Highlight */}
             <div 
                className="absolute inset-4 rounded-full border-4 border-transparent"
                style={{ 
                    borderColor: 'transparent',
                    borderTopColor: '#d946ef',
                    transform: `rotate(${targetZone.start}deg)`,
                    // This is a hacky visualization, true conic border is hard. 
                    // Using conic background above is the main visual.
                }}
             />

             {/* Spinning Hand */}
             <div 
                className="absolute inset-0 z-10"
                style={{ transform: `rotate(${rotation}deg)` }}
             >
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-t from-transparent to-white shadow-[0_0_10px_white]" />
                 <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]" />
             </div>

             {/* Center Hub */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-900 rounded-full border-4 border-fuchsia-900 flex items-center justify-center z-20">
                 {failed ? (
                     <span className="text-red-500 font-bold text-xs">FAIL</span>
                 ) : (
                     <span className="text-fuchsia-500 font-mono">{Math.floor(rotation)}°</span>
                 )}
             </div>
         </div>

         <div className="mt-8 text-sm text-gray-500 font-mono animate-pulse">
             CLICK TO STOP IN THE ZONE
         </div>
      </div>

      <div className="flex justify-start w-full px-8">
        <button onClick={onPrev} className="text-gray-500 border border-gray-700 hover:text-white px-8 py-4 rounded-lg bg-gray-900 cursor-interactive flex gap-2 items-center hover:bg-gray-800 transition-colors shadow-lg">
           <ArrowLeft size={18} /> BACK
        </button>
      </div>
    </div>
  );
};