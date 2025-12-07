
import React, { useState, useRef, useEffect } from 'react';
import { LevelProps } from '../../types';
import { Radio, Play, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import GlareHover from '../GlareHover';

const MORSE_SEQUENCE = [
  { char: '6', code: '-....' },
  { char: '7', code: '--...' },
  { char: '0', code: '-----' },
  { char: '8', code: '---..' },
];

const SEQUENCE_TEXT = "-.... --... ----- ---..";

const DOT_DURATION = 120;

export const Level2Morse: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSignal, setActiveSignal] = useState(false); 
  const [progressText, setProgressText] = useState("AWAITING INPUT");
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playTone = (duration: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square'; 
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const startSequence = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setProgressText("TRANSMITTING...");

    await sleep(500);

    for (const item of MORSE_SEQUENCE) {
      await sleep(DOT_DURATION * 3);

      for (const symbol of item.code) {
        const duration = symbol === '.' ? DOT_DURATION : DOT_DURATION * 3;
        
        setActiveSignal(true);
        playTone(duration / 1000);
        await sleep(duration);
        setActiveSignal(false);
        
        await sleep(DOT_DURATION);
      }
    }
    
    setProgressText("TRANSMISSION COMPLETE");
    setIsPlaying(false);
  };

  return (
    <div className="text-center space-y-6 animate-in slide-in-from-right duration-500 pb-8">
      <header>
        <h2 className="text-2xl font-display font-bold text-neon-yellow drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
          AUDIO INTERCEPT
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Level 2/20</p>
      </header>

      <div className="bg-black/40 border border-neon-yellow/30 p-8 rounded-xl backdrop-blur-md relative overflow-hidden mb-8 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-100 ${activeSignal ? 'bg-neon-yellow border-neon-yellow shadow-[0_0_60px_rgba(251,191,36,0.9)] scale-110' : 'bg-transparent border-gray-700'}`}>
            <Radio className={`w-10 h-10 transition-colors ${activeSignal ? 'text-black' : 'text-gray-600'}`} />
          </div>
          
          <div className="font-mono text-lg text-neon-yellow tracking-widest min-h-[1.5rem]">
            [{progressText}]
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <GlareHover glareColor="#fbbf24" width="auto">
            <button
                onClick={startSequence}
                disabled={isPlaying}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-neon-yellow/10 border border-neon-yellow text-neon-yellow rounded-lg hover:bg-neon-yellow hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-interactive text-sm font-bold"
            >
                {isPlaying ? <RefreshCw className="animate-spin w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'PLAYING...' : 'PLAY SIGNAL'}
            </button>
          </GlareHover>
        </div>
        
        {/* Visual Readout for Copy/Paste */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-gray-500 font-mono text-xs mb-2">SIGNAL BUFFER:</p>
            <div className="bg-black/50 p-2 rounded border border-gray-700 select-all font-mono text-sm tracking-[0.2em] text-white">
                {SEQUENCE_TEXT}
            </div>
        </div>
      </div>

      <div className="flex justify-between w-full pt-4 gap-4 px-4">
        <button onClick={onPrev} className="text-gray-500 hover:text-white flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-lg hover:bg-white/5 cursor-interactive bg-gray-900 shadow-lg text-sm">
           <ArrowLeft size={16} /> BACK
        </button>
        <GlareHover glareColor="#fbbf24" width="auto">
            <button 
            onClick={onComplete} 
            className="bg-gray-800 hover:bg-neon-yellow/20 text-white hover:text-neon-yellow border border-gray-700 hover:border-neon-yellow px-8 py-3 rounded-lg flex items-center gap-2 transition-all group cursor-interactive text-sm font-bold"
            >
            PROCEED <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </button>
        </GlareHover>
      </div>
    </div>
  );
};