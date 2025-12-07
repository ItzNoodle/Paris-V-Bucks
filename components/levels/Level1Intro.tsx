
import React from 'react';
import { LevelProps } from '../../types';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import GlareHover from '../GlareHover';

export const Level1Intro: React.FC<LevelProps> = ({ onComplete }) => {
  return (
    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 px-4 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-wider drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          PROTOCOL <span className="text-neon-blue">INITIATED</span>
        </h1>
        <p className="text-gray-400 font-mono text-xs md:text-sm tracking-widest">SECURE CONNECTION ESTABLISHED // USER: PARIS</p>
      </div>

      <div className="bg-epic-dark/60 border border-neon-blue/30 rounded-xl p-6 max-w-lg mx-auto backdrop-blur-sm shadow-[0_0_40px_rgba(59,130,246,0.15)] mb-8">
        <ShieldCheck className="w-12 h-12 text-neon-blue mx-auto mb-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
        <h2 className="text-xl font-bold text-white mb-2">Identity Verified: <span className="text-neon-blue">Paris</span></h2>
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
          Listen closely, Paris. You need to pass all security levels to get your V-Bucks.
          <br/>
          <span className="text-neon-blue font-bold">You aren't gonna get them that easy.</span>
          <br/>
          Prove you have the skills to bypass the firewall.
        </p>
      </div>

      <div className="pt-4 pb-2 flex justify-center">
        <GlareHover glareColor="#3b82f6" width="auto">
            <button
                onClick={onComplete}
                className="group relative px-10 py-4 bg-neon-blue/10 border border-neon-blue/50 text-neon-blue font-bold rounded-lg overflow-hidden transition-all hover:bg-neon-blue hover:text-black cursor-interactive"
            >
                <span className="relative z-10 flex items-center gap-2 text-base">
                INITIALIZE SEQUENCE <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
        </GlareHover>
      </div>
    </div>
  );
};