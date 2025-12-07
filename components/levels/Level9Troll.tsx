import React, { useState, useRef } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level9Troll: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const moveButton = () => {
    if (!containerRef.current || !buttonRef.current) return;
    
    playUISound('hover');
    setAttempts(p => p + 1);

    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = buttonRef.current.getBoundingClientRect();
    
    // Calculate safe boundaries (keeping button fully inside)
    const maxX = (containerRect.width - btnRect.width) / 2 - 20; // 20px padding
    const maxY = (containerRect.height - btnRect.height) / 2 - 20;
    
    // Generate new random position
    const newX = (Math.random() - 0.5) * 2 * maxX;
    const newY = (Math.random() - 0.5) * 2 * maxY;

    setBtnPos({ x: newX, y: newY });
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header>
        <h2 className="text-3xl font-display font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
          HUMAN VERIFICATION
        </h2>
        <p className="text-gray-400 mt-2">Level 9/20</p>
      </header>

      <div className="bg-black/60 border border-yellow-400/30 p-8 rounded-xl backdrop-blur-md max-w-xl mx-auto shadow-[0_0_30px_rgba(250,204,21,0.2)] relative min-h-[500px] flex flex-col items-center">
        
        <div className="mb-6 flex flex-col items-center gap-2">
            <ShieldAlert className="text-yellow-400 w-12 h-12 mb-2 animate-pulse" />
            <h3 className="text-xl font-bold text-white">Suspicious Activity Detected</h3>
            <p className="text-gray-400 text-sm max-w-sm">
                Our systems have flagged you as a potential bot. Please click the button below to verify your humanity.
            </p>
        </div>

        <div ref={containerRef} className="relative flex-grow w-full flex items-center justify-center overflow-hidden border-2 border-yellow-900 bg-gray-900/80 rounded-lg shadow-inner">
            <button
                ref={buttonRef}
                onMouseEnter={moveButton}
                onClick={onComplete}
                style={{ transform: `translate(${btnPos.x}px, ${btnPos.y}px)` }}
                className={`
                    absolute transition-all duration-75 ease-out z-10
                    px-8 py-4 bg-yellow-400 text-black font-bold rounded shadow-[0_0_20px_rgba(250,204,21,0.8)]
                    whitespace-nowrap flex items-center gap-2 cursor-interactive border-2 border-white
                    ${attempts > 15 ? 'scale-90' : 'scale-100'} 
                `}
            >
                <AlertTriangle size={20} />
                I AM NOT A ROBOT
            </button>
            
            {attempts > 5 && (
                <div className="absolute top-4 text-yellow-600 text-xs font-mono animate-pulse font-bold tracking-widest">
                    NICE TRY BOT (FAILURES: {attempts})
                </div>
            )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full pt-12 gap-8 px-8">
        <button 
            onClick={onPrev} 
            className="text-gray-500 border border-gray-700 hover:border-white hover:text-white flex items-center justify-center gap-2 px-8 py-4 rounded-lg hover:bg-white/5 transition-all cursor-interactive bg-gray-900 shadow-lg"
        >
           <ArrowLeft size={18} /> BACK
        </button>
      </div>
    </div>
  );
};