import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, ArrowRight, Disc, Target } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import GlareHover from '../GlareHover';

export const Level7Timing: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [active, setActive] = useState(false);
  const [wins, setWins] = useState(0);
  const [failed, setFailed] = useState(false);
  
  // Logic Refs
  const rotationRef = useRef(0);
  const speedRef = useRef(4);
  const reqRef = useRef<number>(null);
  
  // DOM Refs for direct manipulation (High Performance)
  const ringRef = useRef<HTMLDivElement>(null);
  
  const TARGET_MIN = 340; // Top zone (-20 deg)
  const TARGET_MAX = 20;  // Top zone (+20 deg) - Logic handles wrap around
  const REQUIRED_WINS = 3;

  useEffect(() => {
    const animate = () => {
      if (active) {
        rotationRef.current = (rotationRef.current + speedRef.current) % 360;
        if (ringRef.current) {
            ringRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
        }
        reqRef.current = requestAnimationFrame(animate);
      }
    };
    if (active) {
        reqRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(reqRef.current!);
  }, [active]);

  const handleAction = () => {
    if (wins >= REQUIRED_WINS) return;

    if (!active) {
        // Start Round
        setActive(true);
        setFailed(false);
        playUISound('click');
        rotationRef.current = Math.random() * 180 + 90; // Random start pos away from top
    } else {
        // Stop Round
        setActive(false);
        const deg = rotationRef.current;
        
        // Check alignment (Top is 0/360)
        // Zone is roughly 340...360...20
        const isHit = (deg >= TARGET_MIN) || (deg <= TARGET_MAX);
        
        if (isHit) {
            playUISound('click');
            const newWins = wins + 1;
            setWins(newWins);
            
            if (newWins >= REQUIRED_WINS) {
                playUISound('lock');
            } else {
                speedRef.current += 2; // Speed up
            }
        } else {
            // Fail
            playUISound('hover');
            setFailed(true);
            setWins(0);
            speedRef.current = 4;
        }
    }
  };

  const isComplete = wins >= REQUIRED_WINS;

  return (
    <div className="text-center space-y-12 animate-in slide-in-from-right duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-display font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
          CENTRIFUGE ALIGNMENT
        </h2>
        <p className="text-gray-400 mt-2">Level 7/20</p>
      </header>

      <div className="bg-black/80 border border-cyan-500/30 p-12 rounded-full backdrop-blur-md max-w-lg mx-auto shadow-[0_0_50px_rgba(34,211,238,0.15)] mb-12 aspect-square flex flex-col items-center justify-center relative">
        
        {/* Background Static Rings */}
        <div className="absolute inset-4 rounded-full border border-gray-800" />
        <div className="absolute inset-12 rounded-full border border-gray-800" />
        
        {/* Target Zone Indicator (Top) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-12 h-8 bg-cyan-500/20 border border-cyan-400 rounded-b-lg blur-[2px] z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-cyan-400 z-10" />

        {/* Spinning Ring */}
        <div 
            ref={ringRef}
            className="absolute inset-8 rounded-full border-[12px] border-gray-900 shadow-[inset_0_0_20px_black] z-10"
            style={{ transform: 'rotate(0deg)' }}
        >
            {/* The "Marker" on the ring */}
            <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-4 h-8 bg-white rounded-full shadow-[0_0_15px_white]" />
        </div>

        {/* Center Core */}
        <div className="relative z-20 w-32 h-32 rounded-full bg-gray-900 border-4 border-cyan-900 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <div className={`text-4xl font-display font-bold ${isComplete ? 'text-green-500' : 'text-cyan-500'}`}>
                {wins}/{REQUIRED_WINS}
            </div>
            {failed && <div className="absolute -bottom-8 text-red-500 font-mono text-xs animate-bounce">MISALIGNED</div>}
        </div>

      </div>

      <div className="flex justify-center">
        <GlareHover glareColor={active ? '#22d3ee' : '#ffffff'}>
          <button
              onClick={handleAction}
              disabled={isComplete}
              className={`w-64 py-6 rounded-lg font-bold font-display tracking-widest text-lg transition-all cursor-interactive shadow-lg
                  ${isComplete ? 'bg-green-600 text-white' : 
                    failed ? 'bg-red-500/20 text-red-500 border border-red-500 animate-shake' :
                    active ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-500' : 
                    'bg-cyan-600 text-white hover:bg-cyan-500'}
              `}
          >
              {isComplete ? 'SYSTEM LOCKED' : active ? 'STOP' : 'SPIN'}
          </button>
        </GlareHover>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full pt-12 gap-8 px-8">
        <button 
            onClick={onPrev} 
            className="text-gray-500 border border-gray-700 hover:border-white hover:text-white flex items-center justify-center gap-2 px-8 py-4 rounded-lg hover:bg-white/5 transition-all cursor-interactive bg-gray-900 shadow-lg"
        >
           <ArrowLeft size={18} /> BACK
        </button>

        <button 
          onClick={onComplete} 
          disabled={!isComplete}
          className={`px-10 py-4 rounded-lg flex items-center justify-center gap-2 transition-all group border cursor-interactive font-bold shadow-lg
            ${isComplete
                ? 'bg-green-600 hover:bg-green-500 text-white border-green-400 transform hover:scale-105' 
                : 'bg-gray-800 text-gray-500 border-gray-700 opacity-50 cursor-not-allowed'}
          `}
        >
          NEXT LEVEL <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
        </button>
      </div>
    </div>
  );
};