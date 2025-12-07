
import React, { useState, useEffect } from 'react';
import { AppLevel } from '../types';
import { Terminal, X, AlertOctagon } from 'lucide-react';
import TextType from './TextType';

interface TrollBannerProps {
  currentLevel: AppLevel;
}

const TROLL_MESSAGES: Record<number, string> = {
  1: "Oh, you clicked a button. Genius. Let's see how long you last.",
  2: "Morse code? I bet you're just guessing. Good luck with the ears.",
  3: "Can you count to 9? Or is math too hard for you, Paris?",
  4: "Try scratching harder. Maybe the answer is under your monitor.",
  5: "I bet you have the memory of a goldfish. Prove me wrong.",
  6: "Signal decaying... just like your brain cells trying to solve this.",
  7: "It's just timing. A toddler could do this. Why are you struggling?",
  8: "So many numbers, so little processing power in that head of yours.",
  9: "You are definitely a robot. No human clicks that slow.",
  10: "Rings spinning faster than your head right now?",
  11: "Syncing data requires rhythm. Something you clearly lack.",
  12: "Reading backwards hurt your brain? Try reading a book for once.",
  13: "Read the COLOR, not the word. Are you colorblind or just distracted?",
  14: "Find the odd one out. Use your eyes, not your forehead.",
  15: "Match the sine waves. It's high school physics, Paris.",
  16: "Hex codes matching... try not to blink, you might miss it.",
  17: "Chrono Lock. Spin to win. Don't get dizzy.",
  18: "Neural Flow? More like Neural Failure. Connect the pipes, plumber.",
  19: "Click faster! My grandmother clicks faster than this!",
  20: "Wait... you actually made it? I need to fix the difficulty."
};

const DEFAULT_MSG = "Systems nominal. User intelligence... questionable.";

export const TrollBanner: React.FC<TrollBannerProps> = ({ currentLevel }) => {
  const [visible, setVisible] = useState(false);
  const message = TROLL_MESSAGES[currentLevel] || DEFAULT_MSG;
  
  useEffect(() => {
    setVisible(false);
    const t1 = setTimeout(() => setVisible(true), 1000); 
    const t2 = setTimeout(() => setVisible(false), 8000); 
    
    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
    };
  }, [currentLevel]);

  if (currentLevel === AppLevel.SUCCESS || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full animate-in slide-in-from-right fade-in duration-500 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-0 shadow-[0_0_40px_rgba(234,179,8,0.2)] overflow-hidden pointer-events-auto">
        {/* Header */}
        <div className="bg-yellow-500/10 px-4 py-2 flex items-center justify-between border-b border-yellow-500/20">
            <div className="flex items-center gap-2">
                <div className="bg-yellow-500 rounded-full p-1">
                    <Terminal size={12} className="text-black" />
                </div>
                <span className="text-yellow-500 font-mono text-xs font-bold tracking-widest uppercase">SYSTEM_ADMIN_LOG</span>
            </div>
            <button onClick={() => setVisible(false)} className="text-yellow-500/50 hover:text-yellow-500 transition-colors cursor-interactive">
                <X size={14} />
            </button>
        </div>

        {/* Content */}
        <div className="p-4 flex gap-4">
            <div className="mt-1">
                <AlertOctagon className="text-yellow-500 animate-pulse" size={24} />
            </div>
            <div className="text-gray-300 text-sm font-medium leading-relaxed font-mono">
                <span className="text-yellow-500 mr-2">{`>`}</span>
                <TextType 
                    text={message}
                    typingSpeed={30}
                    showCursor={true}
                    cursorCharacter="|"
                />
            </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800 w-full mt-2">
            <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 animate-[width_7s_linear_forwards] w-full origin-left" />
        </div>
      </div>
    </div>
  );
};
