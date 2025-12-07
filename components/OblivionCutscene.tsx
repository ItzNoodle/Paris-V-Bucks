import React, { useEffect, useRef } from 'react';
import { playUISound } from '../utils/sound';

interface OblivionProps {
  onComplete: () => void;
}

export const OblivionCutscene: React.FC<OblivionProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(null);
  
  // Roman Numerals for the flash sequence
  const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const QUOTES = [
      "AM I THE ONLY ONE IN THIS WORLD?",
      "THE REASON I'M CRUEL IS THIS WORLD.",
      "I DON'T WANT TO LOSE ANYTHING MORE.",
      "ARE YOU AFRAID OF ME?",
      "HAVE YOU SEEN MY LAST MEMORY?"
  ];
  const quoteRef = useRef(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Force exact window size to prevent "Green Line" bug and cover everything
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height / 2;

    const startTime = Date.now();
    let tickCount = 0;
    
    // Create runes for the background ring
    const runes: { char: string, angle: number, radius: number, speed: number }[] = [];
    const RUNE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    for(let i=0; i<60; i++) {
        runes.push({
            char: RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)],
            angle: (i / 60) * Math.PI * 2,
            radius: 300, 
            speed: 0.005
        });
    }

    playUISound('wind');

    const render = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const cx = centerX();
        const cy = centerY();

        // 1. OBLIVION PURPLE BACKGROUND (Heavy saturation)
        // Use a slight radial gradient to mimic the vignette in the images
        const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width);
        bgGrad.addColorStop(0, '#6A0DAD'); // Center Purple
        bgGrad.addColorStop(1, '#2e0245'); // Darker Edge
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some noise/fog
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
        ctx.fillRect(0,0, canvas.width, canvas.height);

        if (elapsed > 150) {
            ctx.save();
            ctx.translate(cx, cy);

            // 2. THE FLASHING NUMERALS
            let displayNumeral = "I";
            let scale = 1;

            if (elapsed < 1500) {
                // Initial "I" Appearance
                scale = 1 + (elapsed / 3000); 
            } else if (elapsed < 2600) {
                // Ticking/Glitch Phase - Cycle Numerals
                const tensionProgress = (elapsed - 1500) / 1100;
                const tickIndex = Math.floor(tensionProgress * NUMERALS.length);
                displayNumeral = NUMERALS[Math.min(tickIndex, NUMERALS.length - 1)];
                scale = 1.2 + (tensionProgress * 0.5); // Grow bigger
                
                // Shake effect during ticking
                const shake = (Math.random() - 0.5) * 10 * tensionProgress;
                ctx.translate(shake, shake);
            }

            // Draw The Numeral
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.shadowColor = 'rgba(147, 51, 234, 0.8)'; // Purple glow
            ctx.shadowBlur = 40 + (Math.sin(elapsed * 0.01) * 10);
            ctx.font = `900 ${180 * scale}px "serif"`; // Using serif for Roman look
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(displayNumeral, 0, 0);
            ctx.shadowBlur = 0;

            // 3. The Quote (Fade in)
            if (elapsed > 300 && elapsed < 2600) {
                ctx.font = '700 16px "Orbitron", monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 4;
                ctx.fillText(`"${quoteRef.current}"`, 0, 150 * scale);
            }

            // 4. Rotating Rune Ring (Outer)
            if (elapsed < 2600) {
                const ringPulse = 1 + Math.sin(elapsed * 0.005) * 0.05;
                runes.forEach((rune) => {
                    rune.angle += rune.speed * (elapsed > 1500 ? 5 : 1); // Speed up later
                    const r = rune.radius * ringPulse;
                    const x = Math.cos(rune.angle) * r;
                    const y = Math.sin(rune.angle) * r;
                    
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rune.angle + Math.PI/2);
                    
                    // Random glitch characters during ticking phase
                    const char = (elapsed > 1500 && Math.random() > 0.8) 
                        ? RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)] 
                        : rune.char;

                    ctx.font = '18px monospace';
                    ctx.fillStyle = `rgba(168, 85, 247, ${0.4 + Math.random()*0.4})`; // Purple/White mix
                    ctx.fillText(char, 0, 0);
                    ctx.restore();
                });
                
                // Draw connecting lines for "Magic Circle" feel
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 300 * ringPulse, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, 280 * ringPulse, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Phase 3 Logic: Glitch/Tick Audio Sync
            if (elapsed > 1500 && elapsed < 2600) {
                // Flash white briefly at start of phase 3
                if (elapsed < 1550) {
                    ctx.save();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(-cx, -cy, canvas.width, canvas.height);
                    ctx.restore();
                }

                // Ticking Sound logic
                const tensionProgress = (elapsed - 1500) / 1100;
                const tickInterval = 100 * (1 - tensionProgress) + 20; // Accelerating

                if (Math.floor(elapsed / tickInterval) > tickCount) {
                    tickCount = Math.floor(elapsed / tickInterval);
                    playUISound('tick');
                }
            }

            // Phase 4: Slashes (2.6s - 2.8s)
            if (elapsed > 2600) {
                // Darken background for contrast
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(-cx, -cy, canvas.width, canvas.height);

                if (elapsed > 2600) {
                    if (elapsed < 2650) playUISound('shatter'); 
                    
                    // Slash 1 (Diagonal Left)
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 12;
                    ctx.shadowColor = '#d946ef';
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.moveTo(-cx * 0.8, -cy * 0.5);
                    ctx.lineTo(cx * 0.2, cy * 0.5);
                    ctx.stroke();
                }
                
                if (elapsed > 2650) {
                    // Slash 2 (Diagonal Right)
                    ctx.beginPath();
                    ctx.moveTo(cx * 0.8, -cy * 0.5);
                    ctx.lineTo(-cx * 0.2, cy * 0.5);
                    ctx.stroke();
                }

                if (elapsed > 2700) {
                    if (elapsed < 2750) playUISound('impact');
                    // Slash 3 (Horizontal Center)
                    ctx.beginPath();
                    ctx.moveTo(-cx, 0);
                    ctx.lineTo(cx, 0);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        if (elapsed < 2800) {
            animRef.current = requestAnimationFrame(render);
        } else {
            onComplete();
        }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
        cancelAnimationFrame(animRef.current!);
        window.removeEventListener('resize', resize);
    };
  }, []);

  return (
      <div className="fixed inset-0 z-[99999] bg-[#2e0245] flex items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      </div>
  );
};