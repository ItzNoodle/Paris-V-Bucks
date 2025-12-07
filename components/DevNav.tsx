
import React from 'react';
import { AppLevel } from '../types';
import { ChevronRight, ChevronLeft, FastForward, Grid } from 'lucide-react';

interface DevNavProps {
  currentLevel: AppLevel;
  setLevel: (level: AppLevel) => void;
}

export const DevNav: React.FC<DevNavProps> = ({ currentLevel, setLevel }) => {
  const levels = Object.values(AppLevel).filter(v => typeof v === 'number') as number[];

  // Z-Index 9999 ensures it's above content but below cursor (which is 100000)
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] group">
        {/* Hover Handle */}
        <div className="absolute right-0 w-8 h-32 bg-gray-800/50 rounded-l-xl flex items-center justify-center group-hover:opacity-0 transition-opacity">
            <Grid size={16} className="text-gray-500" />
        </div>

        {/* Expanded Panel */}
        <div className="bg-black/95 border-l border-gray-800 p-4 rounded-l-xl translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-2xl max-w-[200px]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <span className="text-xs font-mono font-bold text-blue-500">DEV_CONTROLS</span>
            </div>
            
            <div className="flex gap-2 mb-4">
                 <button 
                    onClick={() => setLevel(Math.max(1, currentLevel - 1))}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded flex justify-center cursor-interactive"
                 >
                     <ChevronLeft size={14} />
                 </button>
                 <button 
                    onClick={() => setLevel(Math.min(levels.length, currentLevel + 1))}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex justify-center cursor-interactive"
                 >
                     <ChevronRight size={14} />
                 </button>
            </div>

            <div className="grid grid-cols-4 gap-1">
                {levels.map(lvl => (
                    <button
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`
                            text-[10px] font-mono w-8 h-8 rounded flex items-center justify-center transition-colors cursor-interactive
                            ${currentLevel === lvl ? 'bg-blue-600 text-white font-bold' : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-white'}
                        `}
                    >
                        {lvl}
                    </button>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800">
                <button 
                    onClick={() => setLevel(AppLevel.SUCCESS)}
                    className="w-full bg-emerald-900/50 hover:bg-emerald-800 text-emerald-400 text-xs py-2 rounded flex items-center justify-center gap-2 cursor-interactive"
                >
                    <FastForward size={12} /> JUMP TO END
                </button>
            </div>
        </div>
    </div>
  );
};