
import React, { useState } from 'react';
import { LevelProps } from '../../types';
import { Lock, Unlock, ArrowLeft } from 'lucide-react';
import GlareHover from '../GlareHover';

export const Level3Code: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const CORRECT_CODE = "6708";

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1); 
    setCode(newCode);
    setError(false);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
        handleSubmit();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode === CORRECT_CODE) {
      setSuccess(true);
      setTimeout(onComplete, 1500); 
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setCode(['','','','']);
      inputs.current[0]?.focus();
    }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-8">
      <header>
        <h2 className="text-2xl font-display font-bold text-neon-green drop-shadow-[0_0_15px_rgba(0,255,200,0.6)]">
          CODE VALIDATION
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Level 3/20</p>
      </header>

      <div className="bg-black/50 border border-neon-green/30 p-8 rounded-xl backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(0,255,200,0.15)]">
        <div className="mb-6 flex justify-center">
            {success ? (
                <Unlock className="w-12 h-12 text-neon-green animate-bounce drop-shadow-[0_0_15px_rgba(0,255,200,0.8)]" />
            ) : (
                <Lock className="w-12 h-12 text-gray-500" />
            )}
        </div>

        <p className="text-gray-300 font-mono mb-6 tracking-widest text-sm">ENTER DECRYPTED SIGNAL:</p>

        <div className={`flex justify-center gap-4 mb-8 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-14 h-20 bg-epic-dark border-2 text-center text-4xl font-mono text-neon-green rounded-lg focus:outline-none focus:shadow-[0_0_25px_rgba(0,255,200,0.6)] transition-all cursor-interactive
                ${error ? 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-gray-700 focus:border-neon-green'}
                ${success ? 'border-neon-green bg-neon-green/20' : ''}
              `}
            />
          ))}
        </div>

        <GlareHover glareColor="#00ffc8">
            <button
            onClick={handleSubmit}
            className={`w-full py-4 rounded-lg font-bold font-display tracking-widest transition-all cursor-interactive text-lg
                ${success 
                    ? 'bg-neon-green text-black shadow-[0_0_30px_rgba(0,255,200,0.8)]' 
                    : 'bg-neon-green/10 text-neon-green border border-neon-green/50 hover:bg-neon-green hover:text-black'}
            `}
            >
            {success ? 'ACCESS GRANTED' : 'AUTHENTICATE'}
            </button>
        </GlareHover>
      </div>

      <div className="flex justify-start w-full pt-4 px-4">
        <button onClick={onPrev} className="text-gray-500 hover:text-white flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-lg hover:bg-white/5 cursor-interactive bg-gray-900 shadow-lg text-sm">
           <ArrowLeft size={16} /> BACK
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-10px); }
            40%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};