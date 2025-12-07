
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LevelProps } from '../../types';
import { Zap, AlertTriangle, ArrowLeft, Radiation } from 'lucide-react';
import { playUISound } from '../../utils/sound';

export const Level10Clicker: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [charge, setCharge] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [whiteout, setWhiteout] = useState(false);
  
  const DRAIN_RATE = 1.5; 
  const CLICK_POWER = 8; 

  useEffect(() => {
    if (completed) return;

    const interval = setInterval(() => {
        setCharge(prev => Math.max(0, prev - DRAIN_RATE));
    }, 50);

    return () => clearInterval(interval);
  }, [completed]);

  const handleClick = (e: React.MouseEvent) => {
    if (completed) return;
    
    playUISound('click');
    setShaking(true);
    setTimeout(() => setShaking(false), 50);

    setCharge(prev => {
        const newCharge = prev + CLICK_POWER;
        if (newCharge >= 100) {
            handleWin();
            return 100;
        }
        return newCharge;
    });
  };

  const handleWin = () => {
    setCompleted(true);
    playUISound('lock');
    
    // Trigger Whiteout
    setTimeout(() => {
        setWhiteout(true);
        playUISound('shatter'); 
    }, 500);

    // Proceed to next level after screen is white - Extended for gradual effect
    setTimeout(() => onComplete(), 5500); 
  };

  const getCoreColor = () => {
      if (charge < 50) return '#3b82f6'; // Blue
      if (charge < 80) return '#eab308'; // Yellow
      return '#ef4444'; // Red
  };

  const coreColor = getCoreColor();
  const shakeIntensity = Math.floor(charge / 10) + (shaking ? 10 : 0);

  return (
    <div className={`relative text-center space-y-12 pb-20 select-none h-full min-h-[600px] flex flex-col items-center justify-center`}>
      
      {/* PURE WHITE FADE IN - PORTALED TO BODY TO COVER EVERYTHING */}
      {whiteout && createPortal(
        <div 
            className="fixed inset-0 z-[99999] bg-white pointer-events-none"
            style={{ 
                animation: 'gradualWhiteout 5s ease-in forwards'
            }}
        >
            <style>{`
                @keyframes gradualWhiteout {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>,
        document.body
      )}

      <header>
        <h2 className="text-4xl font-display font-black text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
          CORE <span style={{ color: coreColor }}>INSTABILITY</span>
        </h2>
        <p className="text-red-400 mt-2 font-mono uppercase tracking-widest text-lg animate-pulse">
            {charge > 80 ? "CRITICAL MASS IMMINENT" : "INCREASE PRESSURE"}
        </p>
      </header>

      {/* Reactor Core */}
      <div 
        className="relative"
        style={{ 
            transform: `translate(${Math.random() * shakeIntensity - shakeIntensity/2}px, ${Math.random() * shakeIntensity - shakeIntensity/2}px)` 
        }}
      >
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] transition-all duration-200"
            style={{ 
                width: `${300 + charge * 2}px`, 
                height: `${300 + charge * 2}px`,
                backgroundColor: coreColor,
                opacity: charge / 100
            }}
        />

        <button
            onMouseDown={handleClick}
            className={`
                relative w-80 h-80 rounded-full border-[12px] bg-black overflow-hidden group cursor-interactive transition-colors duration-200 outline-none
                ${completed ? 'scale-110 border-white' : 'active:scale-95'}
            `}
            style={{ borderColor: completed ? '#fff' : '#333' }}
        >
            <div className={`absolute inset-0 opacity-30 ${charge > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: `${2000 - charge * 18}ms` }}>
                <Radiation className="w-full h-full text-gray-500" />
            </div>

            <div 
                className="absolute bottom-0 left-0 w-full transition-all duration-100 ease-linear opacity-90"
                style={{ 
                    height: `${charge}%`,
                    backgroundColor: coreColor,
                    boxShadow: `0 0 50px ${coreColor}`
                }}
            />
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full drop-shadow-lg">
                {completed ? (
                    <AlertTriangle className="w-32 h-32 text-black animate-ping" />
                ) : (
                    <Zap className={`w-24 h-24 text-white mb-2 transition-transform ${charge > 50 ? 'animate-pulse' : ''}`} style={{ transform: `scale(${1 + charge/200})` }} />
                )}
                <span className="font-display font-black text-5xl text-white mix-blend-overlay">
                    {Math.floor(charge)}%
                </span>
            </div>
        </button>
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
