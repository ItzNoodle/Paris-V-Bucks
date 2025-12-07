
import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Activity, Radio } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import GlareHover from '../GlareHover';

export const Level11Maze: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(false);
  const [barPos, setBarPos] = useState(0);
  
  const TARGET_SCORE = 5;
  const BAR_SPEED = 1.5;
  const targets = useRef<number[]>([20, 50, 80]); // Percentages
  const direction = useRef(1);
  const requestRef = useRef<number>(null);
  const beatIntervalRef = useRef<number>(null);

  useEffect(() => {
    if (!active || failed) {
        if (beatIntervalRef.current) {
            clearInterval(beatIntervalRef.current);
            beatIntervalRef.current = null;
        }
        return;
    }

    // Start beat loop (120 BPM approx)
    beatIntervalRef.current = window.setInterval(() => {
        playUISound('beat');
    }, 500);

    const animate = () => {
      setBarPos(prev => {
        let next = prev + (BAR_SPEED * direction.current);
        if (next >= 100 || next <= 0) {
          direction.current *= -1;
          next = Math.max(0, Math.min(100, next));
        }
        return next;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
        cancelAnimationFrame(requestRef.current!);
        if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    };
  }, [active, failed]);

  const handleSync = () => {
    if (!active) {
        setActive(true);
        setScore(0);
        setFailed(false);
        playUISound('click');
        return;
    }

    // Check hit
    const hit = targets.current.some(t => Math.abs(barPos - t) < 5); // 5% tolerance
    
    if (hit) {
        playUISound('click');
        const newScore = score + 1;
        setScore(newScore);
        
        // Randomize targets for next hit
        targets.current = [Math.random() * 80 + 10]; 
        
        if (newScore >= TARGET_SCORE) {
            playUISound('lock');
            setActive(false);
            setTimeout(onComplete, 500);
        }
    } else {
        playUISound('hover');
        setFailed(true);
        setActive(false);
    }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header>
        <h2 className="text-3xl font-display font-bold text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]">
          RHYTHM UPLINK
        </h2>
        <p className="text-gray-400 mt-2">Level 11/20</p>
      </header>

      <div className="bg-black/80 border border-fuchsia-600/50 rounded-xl max-w-lg mx-auto p-12 shadow-[0_0_50px_rgba(217,70,239,0.2)]">
        <div className="flex justify-center mb-8 text-fuchsia-400 gap-4">
            <Radio className={active ? "animate-pulse" : ""} />
            <span className="font-mono font-bold">{score}/{TARGET_SCORE} PACKETS SYNCED</span>
        </div>

        <div className="relative h-24 bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden mb-8">
            {/* Targets */}
            {targets.current.map((t, i) => (
                <div 
                    key={i}
                    className="absolute top-0 bottom-0 w-8 -ml-4 bg-fuchsia-900/50 border-x border-fuchsia-500 z-0"
                    style={{ left: `${t}%` }}
                />
            ))}

            {/* Moving Bar */}
            <div 
                className="absolute top-0 bottom-0 w-2 -ml-1 bg-white shadow-[0_0_15px_white] z-10"
                style={{ left: `${barPos}%` }}
            />
        </div>

        {failed && <div className="text-red-500 font-mono font-bold animate-bounce mb-4">SYNC FAILED - TIMING ERROR</div>}

        <div className="flex justify-center">
            <GlareHover glareColor="#d946ef">
                <button
                    onMouseDown={handleSync}
                    className={`px-12 py-6 font-bold rounded-lg transition-all border cursor-interactive shadow-lg text-xl flex items-center gap-3
                        ${failed 
                            ? 'bg-red-600 text-white border-red-400 hover:bg-red-500' 
                            : active 
                                ? 'bg-fuchsia-600 text-white border-white active:scale-95'
                                : 'bg-fuchsia-900 text-fuchsia-200 border-fuchsia-500 hover:bg-fuchsia-800'}
                    `}
                >
                    <Activity />
                    {failed ? 'RETRY CONNECTION' : active ? 'SYNC DATA' : 'START UPLINK'}
                </button>
            </GlareHover>
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
