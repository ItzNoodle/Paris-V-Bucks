import React, { useRef, useState, useEffect } from 'react';
import { LEVEL_COLORS, AppLevel } from '../types';

interface TiltContainerProps {
  children: React.ReactNode;
  level: AppLevel;
}

export const TiltContainer: React.FC<TiltContainerProps> = ({ children, level }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const color = LEVEL_COLORS[level];

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;
          const { left, top, width, height } = containerRef.current.getBoundingClientRect();
          const cx = left + width / 2;
          const cy = top + height / 2;
          
          const dx = (e.clientX - cx) / (width / 2);
          const dy = (e.clientY - cy) / (height / 2);
          
          // Limit rotation to +/- 10 degrees for subtle 3D effect
          setRotation({
              x: -dy * 5,
              y: dx * 5
          });
      };
      
      const handleMouseLeave = () => {
          setRotation({ x: 0, y: 0 });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
      }
  }, []);

  return (
    <div className="w-full max-w-4xl p-4 md:p-8 flex justify-center perspective-1000">
      <div
        ref={containerRef}
        className="relative bg-epic-card rounded-2xl border border-gray-700 w-full transition-transform duration-100 ease-out preserve-3d"
        style={{
          boxShadow: `0 20px 50px -12px rgba(0,0,0,0.7), 0 0 30px ${color}10`,
          borderColor: `${color}40`,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {/* Inner ambient glow */}
        <div 
           className="absolute inset-0 pointer-events-none opacity-20 transition-colors duration-500 rounded-2xl"
           style={{
             background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)`
           }}
        />
        
        {/* Glass Reflection Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-50 mix-blend-overlay" />

        <div className="relative z-10 p-4 sm:p-8" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};