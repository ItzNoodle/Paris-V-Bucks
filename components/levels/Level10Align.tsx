
import React, { useState, useEffect } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Aperture, CheckCircle, RefreshCcw } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import GlareHover from '../GlareHover';

export const Level10Align: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [rings, setRings] = useState([0, 0, 0]); // R, G, B rotations
  const [targets, setTargets] = useState([0, 0, 0]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
      setTargets([
          Math.floor(Math.random() * 20) * 18,
          Math.floor(Math.random() * 20) * 18,
          Math.floor(Math.random() * 20) * 18
      ]);
  }, []);

  const handleRotate = (index: number) => {
      if (locked) return;
      playUISound('click');
      
      setRings(prev => {
          const newRings = [...prev];
          const ROTATION = 18;
          const CROSSTALK = 6; // Difficulty: Rotating one moves others

          // Primary Rotation
          newRings[index] = (newRings[index] + ROTATION) % 360;

          // Crosstalk (The Hard Part)
          if (index === 0) {
              newRings[1] = (newRings[1] - CROSSTALK + 360) % 360; // R moves G
          } else if (index === 1) {
              newRings[2] = (newRings[2] + CROSSTALK) % 360; // G moves B
          } else if (index === 2) {
              newRings[0] = (newRings[0] - CROSSTALK + 360) % 360; // B moves R
          }

          return newRings;
      });
  };

  const checkAlign = () => {
      // 15 deg tolerance
      const isAligned = rings.every((r, i) => {
          const diff = Math.abs(r - targets[i]);
          return diff < 15 || diff > 345;
      });

      if (isAligned) {
          setLocked(true);
          playUISound('lock');
          setTimeout(onComplete, 1000);
      } else {
          playUISound('hover'); // Fail
      }
  };

  return (
    <div className="text-center space-y-12 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header>
        <h2 className="text-3xl font-display font-bold text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">
          SPECTRUM ALIGNMENT
        </h2>
        <p className="text-gray-400 mt-2">Level 10/20</p>
      </header>

      <div className="bg-black/60 border border-indigo-500/30 p-12 rounded-xl backdrop-blur-md max-w-lg mx-auto shadow-2xl relative flex flex-col items-center">
         <div className="absolute top-4 right-4 text-xs text-indigo-400 font-mono flex items-center gap-1">
             <RefreshCcw size={12} /> CROSSTALK: ACTIVE
         </div>

         <div className="relative w-64 h-64 mb-8">
             {/* Red Ring */}
             <div 
                className="absolute inset-0 border-8 border-red-500/30 rounded-full border-t-red-500 transition-transform duration-300"
                style={{ transform: `rotate(${rings[0]}deg)` }}
             />
             <div className="absolute inset-0 border-2 border-white/10 rounded-full" style={{ transform: `rotate(${targets[0]}deg)` }}>
                 <div className="w-2 h-4 bg-red-500 absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_red]" />
             </div>

             {/* Green Ring */}
             <div 
                className="absolute inset-4 border-8 border-green-500/30 rounded-full border-t-green-500 transition-transform duration-300"
                style={{ transform: `rotate(${rings[1]}deg)` }}
             />
             <div className="absolute inset-4 border-2 border-white/10 rounded-full" style={{ transform: `rotate(${targets[1]}deg)` }}>
                 <div className="w-2 h-4 bg-green-500 absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_green]" />
             </div>

             {/* Blue Ring */}
             <div 
                className="absolute inset-8 border-8 border-blue-500/30 rounded-full border-t-blue-500 transition-transform duration-300"
                style={{ transform: `rotate(${rings[2]}deg)` }}
             />
             <div className="absolute inset-8 border-2 border-white/10 rounded-full" style={{ transform: `rotate(${targets[2]}deg)` }}>
                 <div className="w-2 h-4 bg-blue-500 absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_blue]" />
             </div>

             <div className="absolute inset-0 flex items-center justify-center">
                 {locked ? <CheckCircle className="text-white w-12 h-12" /> : <Aperture className="text-indigo-500 w-12 h-12 animate-spin-slow" />}
             </div>
         </div>

         <div className="flex gap-4 mb-8">
             <button onClick={() => handleRotate(0)} className="w-14 h-14 rounded-full bg-red-900/20 border border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all">R</button>
             <button onClick={() => handleRotate(1)} className="w-14 h-14 rounded-full bg-green-900/20 border border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-white transition-all">G</button>
             <button onClick={() => handleRotate(2)} className="w-14 h-14 rounded-full bg-blue-900/20 border border-blue-500 text-blue-500 font-bold hover:bg-blue-500 hover:text-white transition-all">B</button>
         </div>

         <div className="flex justify-center">
            <GlareHover glareColor="#6366f1">
                <button
                    onClick={checkAlign}
                    disabled={locked}
                    className={`px-12 py-4 rounded-lg font-bold transition-all border cursor-interactive flex items-center gap-2
                        ${locked 
                            ? 'bg-green-600 text-white border-green-400' 
                            : 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500'}
                    `}
                >
                    {locked ? 'SPECTRUM LOCKED' : 'ALIGN OPTICS'}
                </button>
            </GlareHover>
         </div>
      </div>

      <div className="flex justify-start w-full px-8">
        <button onClick={onPrev} className="text-gray-500 border border-gray-700 hover:text-white px-8 py-4 rounded-lg bg-gray-900 cursor-interactive flex gap-2 items-center">
           <ArrowLeft size={18} /> BACK
        </button>
      </div>
    </div>
  );
};
