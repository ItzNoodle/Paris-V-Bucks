import React, { useState, useEffect, useRef } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, ArrowRight, Activity, Sliders, AlertTriangle } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import GlareHover from '../GlareHover';

export const Level6Sliders: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const targets = [80, 40, 65];
  const tolerance = 5; 
  const [values, setValues] = useState([20, 20, 20]);
  const [completed, setCompleted] = useState(false);
  
  // Decay logic refs
  const decayInterval = useRef<number | null>(null);

  const locks = values.map((v, i) => Math.abs(v - targets[i]) <= tolerance);
  const isAllLocked = locks.every(Boolean);

  useEffect(() => {
    // Start Decay Engine
    decayInterval.current = window.setInterval(() => {
        if (completed) return;
        
        setValues(prevValues => prevValues.map(v => {
            // Decay random amount between 0.2 and 0.8
            const decay = Math.random() * 0.6 + 0.2;
            return Math.max(0, v - decay);
        }));
    }, 50);

    return () => clearInterval(decayInterval.current!);
  }, [completed]);

  const handleChange = (index: number, val: string) => {
    const numVal = parseFloat(val);
    const newValues = [...values];
    newValues[index] = numVal;
    setValues(newValues);

    const isLocked = Math.abs(numVal - targets[index]) <= tolerance;
    if (isLocked && !locks[index]) {
        playUISound('hover'); 
    }
  };

  const handleProceed = () => {
      if (isAllLocked) {
          setCompleted(true);
          playUISound('lock');
          clearInterval(decayInterval.current!);
          onComplete();
      }
  };

  return (
    <div className="text-center space-y-12 animate-in slide-in-from-right duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-display font-bold text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">
          SIGNAL STABILIZATION
        </h2>
        <p className="text-gray-400 mt-2">Level 6/20</p>
      </header>

      <div className="bg-[#0f0716] border-2 border-violet-900/50 p-10 rounded-xl max-w-lg mx-auto shadow-[0_0_40px_rgba(139,92,246,0.15)] mb-12 relative overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
             }} 
        />

        <div className="flex justify-center mb-10 gap-4 relative z-10">
            <Activity className="text-violet-400 animate-pulse" />
            <span className="text-violet-200 font-mono text-sm uppercase tracking-widest">
                Maintain Levels against Decay
            </span>
        </div>

        <div className="flex justify-around gap-4 mb-12 relative z-10 h-64 items-end">
            {values.map((val, idx) => {
                const isLocked = Math.abs(val - targets[idx]) <= tolerance;
                return (
                    <div key={idx} className="relative w-16 h-full bg-black/50 rounded-lg border border-gray-800 p-2 flex justify-center">
                        {/* Track */}
                        <div className="absolute top-2 bottom-2 w-2 bg-gray-900 rounded-full" />
                        
                        {/* Target Zone */}
                        <div 
                            className="absolute w-8 bg-green-500/20 border-y border-green-500/50 z-0"
                            style={{ 
                                bottom: `${targets[idx] - tolerance}%`, 
                                height: `${tolerance * 2}%`,
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {isLocked && <div className="w-full h-full bg-green-400/50 animate-pulse shadow-[0_0_15px_#22c55e]" />}
                        </div>

                        {/* Slider Input (Vertical) */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={val}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                            style={{ writingMode: 'vertical-lr', direction: 'rtl' }} // Hack for vertical feel if supported, otherwise standard overlay
                        />

                        {/* Custom Thumb Visual */}
                        <div 
                            className={`
                                absolute w-12 h-6 rounded border-2 transition-all duration-75 z-10 flex items-center justify-center
                                ${isLocked 
                                    ? 'bg-green-500 border-white shadow-[0_0_20px_#22c55e]' 
                                    : 'bg-violet-600 border-violet-400 shadow-[0_0_10px_#8b5cf6]'}
                            `}
                            style={{ bottom: `${val}%`, transform: 'translateY(50%)' }}
                        >
                            <div className="w-8 h-[2px] bg-black/50" />
                        </div>
                        
                        {/* Value Readout */}
                        <div className="absolute -bottom-8 font-mono text-xs text-gray-500">
                            {Math.round(val)}%
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="h-16 flex items-center justify-center relative z-10">
            {isAllLocked ? (
                <div className="text-green-400 font-bold font-display text-xl animate-pulse flex items-center gap-3 bg-green-900/40 px-6 py-3 rounded border border-green-500 shadow-lg">
                    <Sliders size={20} /> STABLE
                </div>
            ) : (
                 <div className="text-orange-500 font-mono text-sm tracking-wider flex items-center gap-2 animate-bounce">
                    <AlertTriangle size={16} /> SIGNAL DECAYING
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

        <GlareHover glareColor="#8b5cf6">
            <button 
            onClick={handleProceed} 
            className={`px-10 py-4 rounded-lg flex items-center justify-center gap-2 transition-all group border cursor-interactive font-bold shadow-lg
                ${isAllLocked 
                    ? 'bg-violet-600 hover:bg-violet-500 text-white border-violet-400' 
                    : 'bg-gray-800 text-gray-500 border-gray-700 opacity-50 cursor-not-allowed'}
            `}
            >
            LOCK SIGNAL <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
            </button>
        </GlareHover>
      </div>
    </div>
  );
};