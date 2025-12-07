import React, { useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = ''
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!startWhen || !ref.current) return;

    const startValue = direction === 'down' ? to : from;
    const endValue = direction === 'down' ? from : to;
    
    // Initial render
    ref.current.textContent = format(startValue, separator);

    const startTime = Date.now() + (delay * 1000);
    const endTime = startTime + (duration * 1000);

    let frameId: number;

    const animate = () => {
        const now = Date.now();
        if (now < startTime) {
            frameId = requestAnimationFrame(animate);
            return;
        }

        const progress = Math.min(1, (now - startTime) / (duration * 1000));
        // Ease out quart
        const ease = 1 - Math.pow(1 - progress, 4);
        
        const current = startValue + (endValue - startValue) * ease;
        
        if (ref.current) {
            ref.current.textContent = format(Math.round(current), separator);
        }

        if (progress < 1) {
            frameId = requestAnimationFrame(animate);
        }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [to, from, direction, delay, duration, startWhen, separator]);

  return <span className={className} ref={ref} />;
}

function format(num: number, separator: string): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}