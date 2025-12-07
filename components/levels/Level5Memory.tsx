import React, { useState } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import GlareHover from '../GlareHover';

export const Level5Memory: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'success' | 'fail'>('idle');
  const [activeCell, setActiveCell] = useState<number | null>(null);

  const GRID_SIZE = 16;
  const SEQUENCE_LENGTH = 6;

  const generateSequence = () => {
    const newSeq = [];
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      newSeq.push(Math.floor(Math.random() * GRID_SIZE));
    }
    setSequence(newSeq);
    return newSeq;
  };

  const playSequence = async (seq: number[]) => {
    setGameState('showing');
    setUserSequence([]);
    await new Promise(r => setTimeout(r, 800));

    for (const cellIndex of seq) {
      setActiveCell(cellIndex);
      playUISound('click');
      
      await new Promise(r => setTimeout(r, 400));
      
      setActiveCell(null);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setGameState('playing');
  };

  const handleStart = () => {
    const seq = generateSequence();
    playSequence(seq);
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'playing') return;

    playUISound('click');
    const newUserSeq = [...userSequence, index];
    setUserSequence(newUserSeq);

    // Visual Flash
    setActiveCell(index);
    setTimeout(() => {
        setActiveCell(null);
    }, 200);

    const currentIndex = newUserSeq.length - 1;
    if (newUserSeq[currentIndex] !== sequence[currentIndex]) {
      setGameState('fail');
      playUISound('error'); 
      setTimeout(() => {
        setGameState('idle');
        setUserSequence([]);
        setActiveCell(null);
      }, 1500);
      return;
    }

    if (newUserSeq.length === SEQUENCE_LENGTH) {
      setGameState('success');
      playUISound('success'); 
      setTimeout(onComplete, 1200);
    }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 preserve-3d">
      <header style={{ transform: 'translateZ(20px)' }}>
        <h2 className="text-3xl font-display font-bold text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
          PATTERN VERIFICATION
        </h2>
        <p className="text-gray-400 mt-2">Level 5/20</p>
      </header>

      <div 
        className="bg-black/60 border border-pink-500/30 p-10 rounded-xl backdrop-blur-md max-w-lg mx-auto mb-8 shadow-[0_0_30px_rgba(236,72,153,0.15)]"
        style={{ transform: 'translateZ(30px)' }}
      >
        <div className="flex justify-center mb-8">
           <BrainCircuit className={`w-12 h-12 ${gameState === 'playing' ? 'text-pink-500 animate-pulse' : 'text-gray-600'}`} />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-10 mx-auto w-fit p-6 bg-gray-900 rounded-xl border border-pink-500/20 shadow-2xl">
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <div 
                key={i} 
                className={`
                    w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 transition-all duration-100 cursor-pointer
                    ${activeCell === i 
                        ? 'bg-pink-500 border-white shadow-[0_0_20px_#ec4899] scale-110' 
                        : 'bg-gray-800 border-gray-700 hover:border-pink-500/50 hover:bg-gray-700'}
                    ${gameState === 'fail' && activeCell === i ? 'bg-red-500 border-red-200' : ''}
                `}
                onClick={() => handleCellClick(i)}
            />
          ))}
        </div>

        <div className="h-16 flex justify-center items-center">
            {gameState === 'idle' && (
                <GlareHover glareColor="#ec4899">
                    <button 
                        onClick={handleStart}
                        className="px-10 py-4 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all cursor-interactive border border-pink-400"
                    >
                        INITIATE SEQUENCE
                    </button>
                </GlareHover>
            )}
            {gameState === 'showing' && <span className="text-pink-400 font-mono font-bold animate-pulse text-lg">OBSERVE SEQUENCE...</span>}
            {gameState === 'playing' && <span className="text-white font-mono font-bold text-lg">REPEAT SEQUENCE</span>}
            {gameState === 'fail' && <span className="text-red-500 font-bold font-mono text-lg">INCORRECT // RESETTING</span>}
            {gameState === 'success' && <span className="text-green-500 font-bold font-mono text-lg">PATTERN MATCHED</span>}
        </div>
      </div>

      <div className="flex justify-start w-full pt-12 px-8" style={{ transform: 'translateZ(40px)' }}>
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