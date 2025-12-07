
import React, { useRef, useState } from 'react';
import { LevelProps } from '../../types';
import { Lock, Unlock, Mail, CheckCircle2 } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import { gsap } from 'gsap';

export const LevelEnvelope: React.FC<LevelProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const flapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    playUISound('lock');

    const tl = gsap.timeline();

    // 1. Lock unlocks and vanishes
    tl.to(lockRef.current, {
        scale: 1.2,
        duration: 0.1,
        ease: 'back.out'
    })
    .to(lockRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.2,
        delay: 0.1
    })
    .call(() => playUISound('flip'))

    // 2. Flap opens (3D rotation)
    .to(flapRef.current, {
        rotateX: 180,
        duration: 0.6,
        ease: 'power2.inOut'
    })

    // 3. Reward screen preview slides UP and scales UP to fill screen
    .to(cardRef.current, {
        y: -200, // Move up
        scale: 3, // Scale massively to fill viewport
        duration: 1.5,
        ease: 'power3.inOut',
        delay: -0.2,
        onStart: () => playUISound('slide')
    })
    
    // 4. Complete level right as the card fills the view
    .call(onComplete, [], "-=0.5");
  };

  return (
    <div className="text-center space-y-6 animate-in slide-in-from-right duration-500 pb-8 perspective-1000 h-[400px] flex flex-col justify-center items-center overflow-visible">
      
      <div ref={containerRef} className="relative w-80 h-48 preserve-3d transition-transform duration-75">
        
        {/* REWARD SCREEN PREVIEW (Hidden inside initially) */}
        {/* This mimics the Level5Success look but starts small inside the envelope */}
        <div 
            ref={cardRef}
            className="absolute left-2 right-2 top-2 h-44 bg-epic-dark rounded-lg shadow-2xl flex flex-col items-center justify-center border-4 border-emerald-500 z-10 overflow-hidden"
            style={{ transform: 'translateZ(1px)' }} // Just behind front
        >
             <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500 mb-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
             </div>
             <div className="text-white font-black text-xl tracking-tighter">
                SYSTEM <span className="text-emerald-500">OWNED</span>
             </div>
             <div className="text-emerald-300 font-mono text-xs mt-2 font-bold">
                1,000 V-BUCKS
             </div>
        </div>

        {/* ENVELOPE BACK */}
        <div 
            className="absolute inset-0 bg-gray-900 border-2 border-gray-700 rounded-b-lg z-0"
            style={{ 
                boxShadow: '0 0 30px rgba(245,158,11,0.2)',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            }}
        />

        {/* ENVELOPE FLAP */}
        <div 
            ref={flapRef}
            className="absolute top-0 left-0 w-full h-1/2 z-30 origin-top preserve-3d"
            style={{ 
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'visible' 
            }}
        >
             {/* Front of Flap (Closed state) */}
             <div className="absolute inset-0 bg-gray-800 border-2 border-gray-600 rounded-t-lg backface-hidden" 
                 style={{ 
                     clipPath: 'polygon(0 0, 100% 0, 50% 100%)', // Triangle
                     background: 'linear-gradient(to bottom, #374151, #1f2937)'
                 }}
             />
             
             {/* Back of Flap (Seen when open) */}
             <div className="absolute inset-0 bg-gray-900 border-2 border-gray-700 rounded-t-lg rotate-x-180" 
                 style={{ 
                     clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                     transform: 'rotateX(180deg)'
                 }}
             />
        </div>

        {/* ENVELOPE FRONT POCKET */}
        <div 
            className="absolute bottom-0 left-0 w-full h-full z-20 pointer-events-none"
            style={{ 
                clipPath: 'polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)',
                background: 'linear-gradient(to top, #1f2937, #374151)',
                borderBottomLeftRadius: '0.5rem',
                borderBottomRightRadius: '0.5rem',
                border: '2px solid #374151'
            }}
        >
            <div className="absolute bottom-4 right-4 opacity-50">
                <Mail className="text-yellow-500 w-6 h-6" />
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-xs text-yellow-500/50">
                CONFIDENTIAL
            </div>
        </div>

        {/* LOCK INTERFACE */}
        <div 
            ref={lockRef}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer hover:scale-110 transition-transform"
            onClick={handleOpen}
        >
            <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-50 animate-pulse" />
                <div className="w-16 h-16 bg-gray-900 rounded-full border-2 border-yellow-500 flex items-center justify-center shadow-2xl relative z-10 cursor-interactive group">
                    {isOpen ? <Unlock className="text-yellow-400 w-8 h-8" /> : <Lock className="text-yellow-500 w-8 h-8 group-hover:text-white transition-colors" />}
                </div>
            </div>
            
            {!isOpen && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded text-xs font-bold font-mono border border-yellow-500/50 animate-bounce">
                        CLICK TO OPEN
                    </span>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};