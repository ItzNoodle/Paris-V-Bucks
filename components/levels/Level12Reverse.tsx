import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Timer, Type, ZapOff } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level12Reverse: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [displayedWord, setDisplayedWord] = useState("SECURITY");
  const [isGlitching, setIsGlitching] = useState(false);
  
  const TARGET_WORD = "SECURITY";
  const REVERSED_TARGET = "YTIRUCES";

  const timerRef = useRef<number>(null);

  useEffect(() => {
    if (gameOver) return;
    
    // Timer Logic
    timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                setGameOver(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    // Glitch Logic
    const glitchInterval = setInterval(() => {
        setIsGlitching(true);
        playUISound('hover');
        
        let scrambleCount = 0;
        const scrambler = setInterval(() => {
            setDisplayedWord(prev => 
                prev.split('').map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')
            );
            scrambleCount++;
            if (scrambleCount > 5) {
                clearInterval(scrambler);
                if (Math.random() > 0.5) {
                     setDisplayedWord("53CVR17Y"); 
                } else {
                     setDisplayedWord(TARGET_WORD); 
                }
                setIsGlitching(false);
            }
        }, 50);

    }, 3000); 

    return () => {
        clearInterval(timerRef.current!);
        clearInterval(glitchInterval);
    };
  }, [gameOver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameOver) return;
    const val = e.target.value.toUpperCase();
    setInput(val);
    playUISound('click');

    if (val === REVERSED_TARGET) {
        clearInterval(timerRef.current!);
        playUISound('lock');
        setTimeout(onComplete, 500);
    }
  };

  const handleRetry = () => {
    setGameOver(false);
    setTimeLeft(20);
    setInput('');
    setDisplayedWord(TARGET_WORD);
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-display font-bold text-teal-500 drop-shadow-[0_0_15px_rgba(20,184,166,0.6)]">
          REVERSE PROTOCOL
        </h2>
        <p className="text-gray-400 mt-2">Level 12/20</p>
      </header>

      <div className="bg-black/70 border border-teal-500/30 p-12 rounded-xl backdrop-blur-md max-w-lg mx-auto shadow-2xl mb-12 relative overflow-hidden group">
        
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2 text-teal-400">
                <Type />
                <span className="font-mono text-sm">INPUT REVERSE:</span>
            </div>
            <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 5 ? 'text-red-500 animate-bounce' : 'text-white'}`}>
                <Timer />
                {timeLeft}s
            </div>
        </div>

        <div className="mb-12 relative min-h-[60px]">
            {isGlitching && <div className="absolute inset-0 bg-white/10 animate-pulse z-0" />}
            <div className={`relative z-10 text-5xl font-display font-black tracking-[0.2em] transition-colors duration-100 
                ${isGlitching ? 'text-red-500 blur-[1px] translate-x-1' : 'text-white blur-none'}
            `}>
                {displayedWord}
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50 mt-4" />
            
            {isGlitching && (
                <div className="absolute -top-4 -right-4 text-red-500 animate-bounce">
                    <ZapOff />
                </div>
            )}
        </div>

        <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="TYPE BACKWARDS"
            disabled={gameOver}
            autoFocus
            className={`
                w-full bg-gray-900 border-4 text-center text-3xl font-mono p-6 rounded-lg outline-none transition-all uppercase tracking-widest
                ${gameOver ? 'border-red-500 text-red-500' : 'border-teal-500/50 focus:border-teal-500 text-teal-400'}
                focus:shadow-[0_0_30px_rgba(20,184,166,0.4)]
            `}
        />

        {gameOver && (
            <div className="mt-8 animate-in zoom-in">
                <p className="text-red-500 font-bold mb-4 font-mono text-xl">CONNECTION LOST</p>
                <button 
                    onClick={handleRetry}
                    className="px-10 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 cursor-interactive"
                >
                    RE-INITIALIZE
                </button>
            </div>
        )}
      </div>

      <div className="flex justify-start w-full pt-12 px-8">
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