
import React, { useState, useEffect } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Palette } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level13Stroop: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'];
  const HEX_MAP: Record<string, string> = {
      'RED': '#ef4444',
      'BLUE': '#3b82f6',
      'GREEN': '#22c55e',
      'YELLOW': '#eab308',
      'PURPLE': '#a855f7'
  };

  const [score, setScore] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [failed, setFailed] = useState(false);

  const TARGET_SCORE = 5;

  const generateRound = () => {
      const text = COLORS[Math.floor(Math.random() * COLORS.length)];
      let color = COLORS[Math.floor(Math.random() * COLORS.length)];
      while(color === text) {
          color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      
      setCurrentText(text);
      setCurrentColor(color);
      
      // Generate options
      const opts = [color];
      while(opts.length < 3) {
          const r = COLORS[Math.floor(Math.random() * COLORS.length)];
          if(!opts.includes(r)) opts.push(r);
      }
      setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
      generateRound();
  }, []);

  useEffect(() => {
      if(score >= TARGET_SCORE) return;
      const timer = setInterval(() => {
          setTimeLeft(p => {
              if(p <= 0) {
                  setFailed(true);
                  return 0;
              }
              return p - 1;
          });
      }, 1000);
      return () => clearInterval(timer);
  }, [score, failed]);

  const handleOption = (opt: string) => {
      if(failed) return;
      if(opt === currentColor) {
          playUISound('click');
          const newScore = score + 1;
          setScore(newScore);
          if(newScore >= TARGET_SCORE) {
              playUISound('lock');
              setTimeout(onComplete, 500);
          } else {
              generateRound();
          }
      } else {
          setFailed(true);
          playUISound('hover');
      }
  };

  const handleRetry = () => {
      setScore(0);
      setTimeLeft(15);
      setFailed(false);
      generateRound();
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header>
        <h2 className="text-3xl font-display font-bold text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">
          STROOP PROTOCOL
        </h2>
        <p className="text-gray-400 mt-2">Level 13/20</p>
      </header>

      <div className="bg-black/60 border border-indigo-500/30 p-8 rounded-xl backdrop-blur-md max-w-lg mx-auto shadow-2xl min-h-[400px] flex flex-col justify-between">
         <div className="flex justify-between items-center text-gray-400 font-mono text-sm">
             <span>SCORE: {score}/{TARGET_SCORE}</span>
             <span className={`${timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}`}>TIME: {timeLeft}s</span>
         </div>

         {!failed && score < TARGET_SCORE ? (
             <>
                <div className="flex flex-col items-center justify-center flex-grow py-8">
                    <p className="text-gray-500 mb-4 font-mono text-xs uppercase tracking-widest">Select the color, NOT the text</p>
                    <h1 
                        className="text-6xl font-black tracking-wider transition-all duration-300"
                        style={{ color: HEX_MAP[currentColor] }}
                    >
                        {currentText}
                    </h1>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleOption(opt)}
                            className="py-4 bg-gray-800 border border-gray-700 hover:border-white rounded-lg font-bold text-white transition-all hover:scale-105 cursor-interactive"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
             </>
         ) : failed ? (
             <div className="flex flex-col items-center justify-center flex-grow">
                 <h3 className="text-red-500 text-2xl font-bold mb-4">NEURAL OVERLOAD</h3>
                 <button onClick={handleRetry} className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 cursor-interactive">
                     RETRY
                 </button>
             </div>
         ) : (
            <div className="flex flex-col items-center justify-center flex-grow">
                <h3 className="text-green-500 text-2xl font-bold mb-4">CALIBRATION COMPLETE</h3>
            </div>
         )}
      </div>

      <div className="flex justify-start w-full px-8">
        <button onClick={onPrev} className="text-gray-500 border border-gray-700 hover:text-white px-8 py-4 rounded-lg bg-gray-900 cursor-interactive flex gap-2 items-center">
           <ArrowLeft size={18} /> BACK
        </button>
      </div>
    </div>
  );
};
