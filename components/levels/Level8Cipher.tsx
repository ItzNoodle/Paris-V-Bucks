import React, { useState, useEffect } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import GlareHover from '../GlareHover';

export const Level8Cipher: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [target, setTarget] = useState<string>('');
  const [selected, setSelected] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  
  const GRID_SIZE = 64; 
  const TARGET_COUNT = 5;

  useEffect(() => {
    const hex = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', '99', '4A', '2B', '1C', '0F', '88', '7D', '3E', '5A', '6B'];
    const newGrid = [];
    const targetVal = 'FF';
    
    for(let i=0; i<GRID_SIZE; i++) {
        newGrid.push(hex[Math.floor(Math.random() * hex.length)]);
    }
    
    const targetIndices = new Set<number>();
    while(targetIndices.size < TARGET_COUNT) {
        targetIndices.add(Math.floor(Math.random() * GRID_SIZE));
    }
    
    targetIndices.forEach(idx => {
        newGrid[idx] = targetVal;
    });

    setGrid(newGrid);
    setTarget(targetVal);
  }, []);

  const handleSelect = (index: number) => {
    if (completed) return;
    
    if (grid[index] === target) {
        if (!selected.includes(index)) {
            playUISound('click');
            const newSel = [...selected, index];
            setSelected(newSel);
            
            if (newSel.length === TARGET_COUNT) {
                playUISound('lock');
                setCompleted(true);
            }
        }
    } else {
        playUISound('hover');
    }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-display font-bold text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
          QUANTUM CIPHER
        </h2>
        <p className="text-gray-400 mt-2">Level 8/20</p>
      </header>

      <div className="bg-black/80 border border-red-500/30 p-8 rounded-xl backdrop-blur-md max-w-2xl mx-auto shadow-[0_0_30px_rgba(239,68,68,0.15)] mb-8">
        <div className="flex justify-center mb-6 gap-4 items-center bg-gray-900/50 py-3 px-6 rounded-lg border border-gray-800">
            <Search className="text-red-500 w-5 h-5" />
            <span className="text-gray-300 font-mono text-xs tracking-wide">LOCATE PATTERN:</span>
            <span className="text-white font-mono font-bold text-lg bg-red-500/20 px-3 py-1 rounded border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.4)]">{target}</span>
        </div>

        <div className="grid grid-cols-8 gap-2 mx-auto w-fit bg-gray-900 p-4 rounded-lg border border-red-900">
            {grid.map((cell, idx) => {
                const isSelected = selected.includes(idx);
                return (
                    <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-mono font-bold text-xs sm:text-sm rounded border transition-all duration-200 cursor-interactive
                            ${isSelected 
                                ? 'bg-red-500 text-white border-white shadow-[0_0_15px_rgba(239,68,68,1)] scale-110 z-10' 
                                : 'bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700 hover:border-red-500/50 hover:text-white'}
                        `}
                    >
                        {cell}
                    </button>
                );
            })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full pt-4 gap-8 px-8">
        <button 
            onClick={onPrev} 
            className="text-gray-500 border border-gray-700 hover:border-white hover:text-white flex items-center justify-center gap-2 px-8 py-4 rounded-lg hover:bg-white/5 transition-all cursor-interactive bg-gray-900 shadow-lg"
        >
           <ArrowLeft size={18} /> BACK
        </button>

        <GlareHover glareColor="#ef4444">
            <button 
            onClick={onComplete} 
            disabled={!completed}
            className={`px-10 py-4 rounded-lg flex items-center justify-center gap-2 transition-all group border cursor-interactive font-bold shadow-lg
                ${completed
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-400'
                    : 'bg-gray-800 text-gray-500 border-gray-700 opacity-50 cursor-not-allowed'}
            `}
            >
            CONFIRM DATA <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
            </button>
        </GlareHover>
      </div>
    </div>
  );
};