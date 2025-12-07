import React, { useState } from 'react';
import { LevelProps } from '../../types';
import { OblivionCutscene } from '../OblivionCutscene';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const Level21CutsceneTest: React.FC<LevelProps> = ({ onPrev }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-display font-bold text-white drop-shadow-md">
          CUTSCENE DEBUGGER
        </h2>
        <p className="text-gray-400 mt-2">Level 21/20 (TEST)</p>
      </header>

      <div className="bg-black/60 border border-gray-700 p-12 rounded-xl backdrop-blur-md max-w-lg mx-auto shadow-2xl min-h-[300px] flex flex-col items-center justify-center">
         {!playing ? (
             <button 
                onClick={() => setPlaying(true)}
                className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-3 transition-all"
             >
                 <RefreshCw /> PLAY OBLIVION
             </button>
         ) : (
             <div className="text-purple-400 animate-pulse font-mono">RENDERING CUTSCENE...</div>
         )}
      </div>

      {playing && <OblivionCutscene onComplete={() => setPlaying(false)} />}

      <div className="flex justify-start w-full px-8">
        <button onClick={onPrev} className="text-gray-500 border border-gray-700 hover:text-white px-8 py-4 rounded-lg bg-gray-900 cursor-interactive flex gap-2 items-center">
           <ArrowLeft size={18} /> BACK
        </button>
      </div>
    </div>
  );
};