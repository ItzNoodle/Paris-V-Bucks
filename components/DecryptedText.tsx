import React, { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'hover' | 'view' | 'both';
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover'
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (animateOn === 'view' && !hasAnimated) {
        setIsAnimating(true);
        setHasAnimated(true);
    }
  }, [animateOn, hasAnimated]);

  useEffect(() => {
    if (!isAnimating) {
        setDisplayText(text);
        return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
        setDisplayText(prev => 
            text.split('').map((char, i) => {
                if (i < iterations) return text[i];
                return characters[Math.floor(Math.random() * characters.length)];
            }).join('')
        );

        if (iterations >= text.length) {
            clearInterval(interval);
            setIsAnimating(false);
        }
        
        iterations += 1 / (maxIterations / text.length); 
    }, speed);

    return () => clearInterval(interval);
  }, [isAnimating, text, speed, maxIterations, characters]);

  return (
    <span 
        className={parentClassName}
        onMouseEnter={() => { if(animateOn === 'hover') setIsAnimating(true); }}
    >
      <span className={isAnimating ? encryptedClassName : className}>{displayText}</span>
    </span>
  );
}