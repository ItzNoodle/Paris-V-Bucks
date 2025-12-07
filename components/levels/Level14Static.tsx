
import React, { useState, useEffect } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Radio } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level14Static: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const GRID_SIZE = 80; // 10x8

  useEffect(() => {
    // Confusing character set
    const chars = ['X', 'V', 'T', '7', 'K', 'Y'];
    const noiseChar = 'V'; // 'V' looks very similar to 'Y'
    const targetChar = 'Y';
    
    const newGrid = [];
    for(let i=0; i<GRID_SIZE; i++) {
        // Occasionally mix in other chars to break patterns but keep noise high
        if (Math.random() > 0.8) {
            newGrid.push(chars[Math.floor(Math.random() * chars.length)]);
        } else {
            newGrid.push(noiseChar);
        }
    }
    
    const target = Math.floor(Math.random() * GRID_SIZE);
    newGrid[target] = targetChar;
    
    setGrid(newGrid);
    setTargetIndex(target);
  }, []);

  const handleClick = (idx: number) => {
      if(completed) return;
      if(idx === targetIndex) {
          playUISound('lock');
          setCompleted(true);
          setTimeout(onComplete, 1000);
      } else {
          playUISound('hover');
      }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header>
        <h2 className="text-3xl font-display font-bold text-lime-500 drop-shadow-[0_0_15px_rgba(132,204,22,0.6)]">
          STATIC ANALYSIS
        </h2>
        <p className="text-gray-400 mt-2">Level 14/20</p>
      </header>

      <div className="bg-black/60 border border-lime-500/30 p-8 rounded-xl backdrop-blur-md max-w-3xl mx-auto shadow-2xl">
         <div className="flex justify-center mb-6 text-lime-400 gap-2 items-center">
             <Radio className="animate-pulse" />
             <span className="font-mono">LOCATE THE ANOMALY 'Y'</span>
         </div>

         <div className="grid grid-cols-10 gap-1 sm:gap-2">
             {grid.map((char, i) => (
                 <button
                    key={i}
                    onClick={() => handleClick(i)}
                    className={`
                        w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-mono font-bold rounded border transition-all duration-75 text-sm sm:text-base
                        ${completed && i === targetIndex ? 'bg-lime-500 text-black scale-150 z-20 shadow-[0_0_20px_lime]' : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-gray-300'}
                        ${!completed && 'animate-[pulse_0.5s_ease-in-out_infinite]'}
                    `}
                    style={{ 
                        animationDelay: `${Math.random()}s`,
                        opacity: Math.random() * 0.4 + 0.6 
                    }}
                 >
                     {char}
                 </button>
             ))}
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
