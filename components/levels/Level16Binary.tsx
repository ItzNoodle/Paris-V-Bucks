import React, { useState, useEffect } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Hash, Check, X } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level16Binary: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [target, setTarget] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [failed, setFailed] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const TARGET_SCORE = 8;
  const SYMBOLS = ['#A1', '#B9', '#C4', '#D7', '#E2', '#F5', '#00', '#FF', '#33', '#7A'];

  const generateRound = () => {
      const newTarget = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      setTarget(newTarget);
      setFlippedIndex(null); // Reset flip
      
      const newOptions = [newTarget];
      while(newOptions.length < 9) {
          const s = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          if(!newOptions.includes(s)) newOptions.push(s);
      }
      setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
      generateRound();
      const timer = setInterval(() => {
          setTimeLeft(t => {
              if (t <= 1) {
                  setFailed(true);
                  return 0;
              }
              return t - 1;
          });
      }, 1000);
      return () => clearInterval(timer);
  }, []);

  const handleClick = (opt: string, index: number) => {
      if(failed || flippedIndex !== null) return;
      
      setFlippedIndex(index);
      playUISound('flip');

      if(opt === target) {
          setTimeout(() => {
            const newScore = score + 1;
            setScore(newScore);
            if(newScore >= TARGET_SCORE) {
                playUISound('lock');
                setTimeout(onComplete, 500);
            } else {
                generateRound();
            }
          }, 600);
      } else {
          playUISound('error');
          setTimeout(() => {
            setTimeLeft(t => Math.max(0, t - 5)); // Penalty
            setFlippedIndex(null); // Flip back
          }, 600);
      }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none preserve-3d">
      <header style={{ transform: 'translateZ(20px)' }}>
        <h2 className="text-3xl font-display font-bold text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
          HEX STREAM MATCHING
        </h2>
        <p className="text-gray-400 mt-2">Level 16/20</p>
      </header>

      <div 
        className="bg-black/80 border border-rose-500/30 p-8 rounded-xl backdrop-blur-md max-w-lg mx-auto shadow-2xl relative overflow-hidden"
        style={{ transform: 'translateZ(40px)' }}
      >
         {failed && (
             <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center">
                 <h3 className="text-red-500 text-3xl font-bold mb-4">STREAM LOST</h3>
                 <button 
                    onClick={() => { setFailed(false); setScore(0); setTimeLeft(30); generateRound(); }} 
                    className="px-8 py-3 bg-white text-black font-bold rounded cursor-interactive"
                 >
                     REBOOT SYSTEM
                 </button>
             </div>
         )}

         <div className="flex justify-between items-center mb-8 bg-gray-900 p-4 rounded-lg border border-gray-700">
             <div className="text-rose-400 font-mono font-bold text-xl flex items-center gap-2">
                 <Hash /> {score}/{TARGET_SCORE}
             </div>
             <div className="text-2xl font-black text-white bg-rose-600 px-6 py-2 rounded shadow-lg animate-pulse">
                 {target}
             </div>
             <div className={`font-mono font-bold text-xl ${timeLeft < 10 ? 'text-red-500 animate-bounce' : 'text-gray-400'}`}>
                 {timeLeft}s
             </div>
         </div>

         <div className="grid grid-cols-3 gap-3 perspective-1000">
             {options.map((opt, i) => {
                 const isFlipped = flippedIndex === i;
                 const isCorrect = opt === target;
                 
                 return (
                    <div 
                        key={i}
                        className="relative h-20 w-full cursor-interactive perspective-1000 group"
                        onClick={() => handleClick(opt, i)}
                    >
                         <div className={`
                            w-full h-full transition-all duration-500 transform-style-3d preserve-3d
                            ${isFlipped ? 'rotate-y-180' : ''}
                         `}>
                             {/* Front */}
                             <div className="absolute inset-0 backface-hidden bg-gray-800 border-2 border-gray-700 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-300 group-hover:bg-gray-700 group-hover:border-rose-500 group-hover:text-white transition-colors">
                                 {opt}
                             </div>

                             {/* Back */}
                             <div className={`
                                absolute inset-0 backface-hidden rotate-y-180 rounded-lg flex items-center justify-center border-2
                                ${isCorrect 
                                    ? 'bg-green-600 border-green-400' 
                                    : 'bg-red-600 border-red-400'}
                             `}>
                                 {isCorrect ? <Check className="text-white w-8 h-8" /> : <X className="text-white w-8 h-8" />}
                             </div>
                         </div>
                    </div>
                 );
             })}
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