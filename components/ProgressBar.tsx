import React from 'react';
import { AppLevel, LEVEL_COLORS } from '../types';

interface ProgressBarProps {
  currentLevel: AppLevel;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel }) => {
  const totalLevels = 19; // 19 playable levels
  const progress = Math.min(((currentLevel - 1) / totalLevels) * 100, 100);
  const color = LEVEL_COLORS[currentLevel] || '#10b981';

  if (currentLevel === AppLevel.INTRO || currentLevel === AppLevel.SUCCESS) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 w-full max-w-4xl mx-auto">
           <span className="font-mono text-xs text-gray-500 hidden sm:block">SECURE_BOOT_SEQUENCE</span>
           <div className="flex-grow h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
             <div 
               className="h-full transition-all duration-500 ease-out relative"
               style={{ width: `${progress}%`, backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
             >
                <div className="absolute right-0 top-0 bottom-0 w-[20px] bg-white/50 blur-[5px]" />
             </div>
           </div>
           <span className="font-mono text-xs font-bold" style={{ color }}>
             {(currentLevel - 1).toString().padStart(2, '0')}/{totalLevels.toString().padStart(2, '0')}
           </span>
        </div>
      </div>
    </div>
  );
};