import React from 'react';
import { LevelProps } from '../../types';
import { Shield, ArrowRight } from 'lucide-react';
import GlareHover from '../GlareHover';

interface GenericProps extends LevelProps {
    levelNum: number;
}

export const LevelGeneric: React.FC<GenericProps> = ({ onComplete, levelNum }) => {
  return (
    <div className="text-center space-y-12 animate-in slide-in-from-right duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-display font-bold text-indigo-500">
          SECURITY CHECKPOINT
        </h2>
        <p className="text-gray-400 mt-2">Level {levelNum}/20</p>
      </header>

      <div className="bg-black/60 border border-indigo-500/30 p-12 rounded-xl backdrop-blur-md max-w-lg mx-auto mb-12">
        <Shield className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
        <p className="text-gray-300 mb-8">
            Intermediate firewall layer detected. Manual confirmation required to proceed deeper into the system.
        </p>

        <GlareHover glareColor="#6366f1">
            <button
                onClick={onComplete}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg cursor-interactive flex items-center justify-center gap-2"
            >
                BYPASS FIREWALL <ArrowRight />
            </button>
        </GlareHover>
      </div>
    </div>
  );
};