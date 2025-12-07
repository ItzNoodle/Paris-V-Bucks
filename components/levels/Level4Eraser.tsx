
import React, { useRef, useEffect, useState } from 'react';
import { LevelProps } from '../../types';
import { Eraser, ArrowLeft, ArrowRight, Frown } from 'lucide-react';
import { playUISound } from '../../utils/sound';
import GlareHover from '../GlareHover';

export const Level4Eraser: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [erasedPercent, setErasedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const lastPos = useRef<{x: number, y: number} | null>(null);

  // Troll Logic: Show fake code first, then switch
  const [hiddenText, setHiddenText] = useState("V-BUCKS-9923-XJ4");
  const FAKE_CODE = "V-BUCKS-9923-XJ4";
  const TROLL_CODE = "NO CODE LOL";
  
  const ERASE_THRESHOLD = 85; 
  const IMG_SRC = "https://upload.wikimedia.org/wikipedia/commons/2/20/Saimiri_sciureus-1_Luc_Viatour.jpg"; 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = IMG_SRC;

    img.onload = () => {
        const aspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;
        let renderW, renderH, offX, offY;

        if (aspect > canvasAspect) {
            renderH = canvas.height;
            renderW = canvas.height * aspect;
            offX = (canvas.width - renderW) / 2;
            offY = 0;
        } else {
            renderW = canvas.width;
            renderH = canvas.width / aspect;
            offX = 0;
            offY = (canvas.height - renderH) / 2;
        }

        ctx.drawImage(img, offX, offY, renderW, renderH);
        
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, canvas.height/2 - 30, canvas.width, 60);
        ctx.font = "bold 24px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("SCRATCH TO REVEAL CODE", canvas.width/2, canvas.height/2 + 8);
    };

    img.onerror = () => {
        ctx.fillStyle = '#1e2029';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = "bold 24px monospace";
        ctx.fillText("IMAGE FAIL - JUST SCRATCH", canvas.width/2, canvas.height/2);
    };

  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    setIsDrawing(true);
    lastPos.current = getPos(e);
    draw(e); 
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (e.buttons === 1) { 
        startDrawing(e);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current || isRevealed) return;
    
    // Play softer scratch sound periodically
    if (Math.random() > 0.85) playUISound('scratch');

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPos = getPos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 30; // Bigger brush
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (lastPos.current) {
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(currentPos.x, currentPos.y);
    } else {
        ctx.arc(currentPos.x, currentPos.y, 15, 0, Math.PI * 2);
    }
    ctx.stroke();

    lastPos.current = currentPos;
    if (Math.random() > 0.1) checkProgress();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
    checkProgress();
  };

  const checkProgress = () => {
    if (!canvasRef.current || isRevealed) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    let transparentCount = 0;
    const sampleRate = 20; // Optimization
    
    for (let i = 0; i < data.length; i += 4 * sampleRate) { 
        if (data[i + 3] === 0) {
            transparentCount++;
        }
    }
    
    const percent = Math.round((transparentCount / (data.length / (4 * sampleRate))) * 100);
    setErasedPercent(percent);

    // Troll Logic: Switch text when user has scratched a lot (75%)
    if (percent > 75 && hiddenText === FAKE_CODE) {
        setHiddenText(TROLL_CODE);
        playUISound('error'); // Subtle glitch sound
    }

    if (percent > ERASE_THRESHOLD) {
        setIsRevealed(true);
        playUISound('click'); 
        ctx.clearRect(0,0,w,h);
    }
  };

  return (
    <div className="text-center space-y-8 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neon-orange drop-shadow-[0_0_15px_rgba(255,140,0,0.6)]">
          DATA RECOVERY
        </h2>
        <p className="text-gray-400 mt-2">Level 4/20</p>
      </header>

      <div className="relative mx-auto w-full max-w-[500px] h-[300px] rounded-xl shadow-[0_0_30px_rgba(255,140,0,0.3)] border-2 border-neon-orange group mb-12 overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gray-900 transition-colors duration-200">
             <div className="flex flex-col items-center gap-4">
                {hiddenText === TROLL_CODE && <Frown size={48} className="text-neon-orange animate-bounce" />}
                <span className={`text-3xl font-mono font-bold tracking-widest select-text transition-all duration-300 ${hiddenText === TROLL_CODE ? 'text-neon-orange scale-110' : 'text-gray-500 blur-[1px]'}`}>
                    {hiddenText}
                </span>
                {hiddenText === TROLL_CODE && (
                    <span className="text-xs text-neon-orange font-mono">
                    TRY HARDER PARIS
                    </span>
                )}
            </div>
        </div>

        <canvas
            ref={canvasRef}
            width={500}
            height={300}
            onMouseDown={startDrawing}
            onMouseEnter={handleMouseEnter} 
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className={`absolute inset-0 z-20 touch-none rounded-xl cursor-none transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />

        {!isDrawing && erasedPercent < 5 && !isRevealed && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <div className="bg-black/90 px-6 py-3 rounded-full text-white font-bold animate-pulse flex items-center gap-3 border border-neon-orange/50 shadow-lg">
                    <Eraser size={20} className="text-neon-orange" /> 
                    <span>SCRUB TO DECRYPT</span>
                </div>
            </div>
        )}
      </div>

      <div className="space-y-4 mb-16">
        <div className="bg-gray-800/50 rounded-full h-4 w-64 mx-auto overflow-hidden border border-gray-700">
            <div 
                className="h-full bg-neon-orange shadow-[0_0_15px_rgba(255,140,0,0.8)] transition-all duration-300 ease-out"
                style={{ width: `${Math.min(erasedPercent, 100)}%` }}
            />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full pt-12 gap-8 px-8">
        <button 
            onClick={onPrev} 
            className="text-gray-500 border border-gray-700 hover:border-white hover:text-white flex items-center justify-center gap-2 px-8 py-4 rounded-lg hover:bg-white/5 transition-all cursor-interactive bg-gray-900 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
           <ArrowLeft size={18} /> BACK
        </button>
        
        <GlareHover glareColor="#ff8c00">
            <button 
            onClick={onComplete}
            disabled={!isRevealed}
            className={`px-10 py-4 rounded-lg flex items-center justify-center gap-3 transition-all font-bold border cursor-interactive shadow-lg
                ${isRevealed 
                    ? 'bg-neon-orange text-black border-neon-orange hover:bg-white hover:border-white shadow-[0_0_20px_rgba(255,140,0,0.5)]' 
                    : 'bg-gray-800 text-gray-500 border-gray-700 opacity-50 cursor-not-allowed'}
            `}
            >
            CONFIRM (LOL) <ArrowRight size={20} />
            </button>
        </GlareHover>
      </div>
    </div>
  );
};
