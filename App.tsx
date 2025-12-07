
import React, { useState, useEffect, useMemo } from 'react';
import { TiltContainer } from './components/TiltContainer';
import { CustomCursor } from './components/CustomCursor';
import { ProgressBar } from './components/ProgressBar';
import { TrollBanner } from './components/TrollBanner';
import { DevNav } from './components/DevNav';
import Particles from './components/Particles';
import { BackgroundMusic } from './components/BackgroundMusic';
import { AppLevel, LEVEL_COLORS } from './types';
import { AlertTriangle, SkipForward } from 'lucide-react';
import { playUISound } from './utils/sound';

// Level Imports
import { Level1Intro } from './components/levels/Level1Intro';
import { Level2Morse } from './components/levels/Level2Morse';
import { Level3Code } from './components/levels/Level3Code';
import { Level4Eraser } from './components/levels/Level4Eraser';
import { Level5Memory } from './components/levels/Level5Memory';
import { Level6Sliders } from './components/levels/Level6Sliders';
import { Level7Timing } from './components/levels/Level7Timing';
import { Level8Cipher } from './components/levels/Level8Cipher';
import { Level9Troll } from './components/levels/Level9Troll';
import { Level10Align } from './components/levels/Level10Align';
import { Level11Maze } from './components/levels/Level11Maze';
import { Level12Reverse } from './components/levels/Level12Reverse';
import { Level13Stroop } from './components/levels/Level13Stroop';
import { Level14Static } from './components/levels/Level14Static';
import { Level15Frequency } from './components/levels/Level15Frequency';
import { Level16Binary } from './components/levels/Level16Binary';
import { Level17Keypad } from './components/levels/Level17Keypad';
import { Level18Eye } from './components/levels/Level18Eye';
import { Level10Clicker } from './components/levels/Level10Clicker';
import { Level5Success } from './components/levels/Level5Success';

function App() {
  const [currentLevel, setCurrentLevel] = useState<AppLevel>(AppLevel.INTRO);
  const [penaltyActive, setPenaltyActive] = useState(false);
  const [penaltyTime, setPenaltyTime] = useState(10);
  const [levelTime, setLevelTime] = useState(0);

  // --- TAB SWITCHING PENALTY ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentLevel !== AppLevel.INTRO && currentLevel !== AppLevel.SUCCESS) {
        setPenaltyActive(true);
        setPenaltyTime(10);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [currentLevel]);

  // Penalty Timer
  useEffect(() => {
    if (!penaltyActive) return;

    if (penaltyTime > 0) {
      const timer = setTimeout(() => setPenaltyTime(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPenaltyActive(false);
    }
  }, [penaltyActive, penaltyTime]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLevelTime(0); // Reset time on level change
    if (currentLevel > AppLevel.INTRO) {
        playUISound('level_next');
    }
  }, [currentLevel]);

  // Level Timer for Skip Hint
  useEffect(() => {
      if (currentLevel === AppLevel.SUCCESS) return;
      const timer = setInterval(() => setLevelTime(t => t + 1), 1000);
      return () => clearInterval(timer);
  }, [currentLevel]);

  const nextLevel = () => {
    if (currentLevel < AppLevel.SUCCESS) {
      setCurrentLevel(prev => prev + 1);
    }
  };

  const prevLevel = () => {
    if (currentLevel > AppLevel.INTRO) {
      setCurrentLevel(prev => prev - 1);
    }
  };

  const renderLevel = () => {
    const commonProps = {
      onComplete: nextLevel,
      onPrev: prevLevel,
      isActive: true
    };

    switch (currentLevel) {
      case AppLevel.INTRO: return <Level1Intro {...commonProps} />;
      case AppLevel.MORSE: return <Level2Morse {...commonProps} />;
      case AppLevel.CODE: return <Level3Code {...commonProps} />;
      case AppLevel.ERASER: return <Level4Eraser {...commonProps} />;
      case AppLevel.MEMORY: return <Level5Memory {...commonProps} />;
      case AppLevel.SLIDERS: return <Level6Sliders {...commonProps} />;
      case AppLevel.TIMING: return <Level7Timing {...commonProps} />;
      case AppLevel.CIPHER: return <Level8Cipher {...commonProps} />;
      case AppLevel.TROLL: return <Level9Troll {...commonProps} />;
      case AppLevel.ALIGN: return <Level10Align {...commonProps} />;
      case AppLevel.MAZE: return <Level11Maze {...commonProps} />; 
      case AppLevel.REVERSE: return <Level12Reverse {...commonProps} />;
      case AppLevel.STROOP: return <Level13Stroop {...commonProps} />;
      case AppLevel.STATIC: return <Level14Static {...commonProps} />;
      case AppLevel.FREQUENCY: return <Level15Frequency {...commonProps} />;
      case AppLevel.BINARY: return <Level16Binary {...commonProps} />;
      case AppLevel.KEYPAD: return <Level17Keypad {...commonProps} />;
      case AppLevel.EYE: return <Level18Eye {...commonProps} />;
      case AppLevel.CLICKER: return <Level10Clicker {...commonProps} />;
      case AppLevel.SUCCESS: return <Level5Success {...commonProps} />;
      
      default: return <div className="text-white">Level Under Construction</div>;
    }
  };

  const currentColor = LEVEL_COLORS[currentLevel] || '#ffffff';
  // Memoize colors to prevent Particles re-render on every timer tick
  const particleColors = useMemo(() => [currentColor], [currentColor]);
  const showSkipHint = levelTime > 20; // Show hint after 20 seconds (faster)

  return (
    <div className={`min-h-screen bg-epic-dark text-white flex flex-col items-center justify-center p-4 selection:bg-neon-blue selection:text-black overflow-x-hidden transition-colors duration-700 relative ${penaltyActive ? 'cursor-auto' : ''}`}>
      
      <BackgroundMusic />

      {/* PENALTY OVERLAY */}
      {penaltyActive && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 cursor-auto">
            <AlertTriangle className="text-red-500 w-24 h-24 mb-6 animate-bounce" />
            <h1 className="text-5xl font-black text-red-500 mb-4 tracking-tighter">BREACH DETECTED</h1>
            <p className="text-xl text-gray-400 font-mono mb-8 max-w-md">
                "Trying to switch tabs, Paris? Looking for answers? That's cheating."
            </p>
            <div className="text-6xl font-mono font-bold text-white border-4 border-red-900 rounded-xl p-8 bg-red-900/20 mb-8">
                LOCKED: {penaltyTime}s
            </div>
            <a 
                href="https://r.mtdv.me/getbacktoworkparis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-lg animate-pulse pointer-events-auto"
            >
                GO BACK TO GAME
            </a>
        </div>
      )}

      {/* Global Particles */}
      <div className="fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none">
        <Particles
          particleColors={particleColors}
          particleCount={currentLevel === AppLevel.EYE ? 300 : 150}
          particleSpread={currentLevel === AppLevel.EYE ? 20 : 12}
          speed={currentLevel === AppLevel.EYE ? 0.05 : 0.15}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Custom Cursor High Z-Index */}
      <div className="z-[100000] relative pointer-events-none w-full h-full fixed top-0 left-0">
        {!penaltyActive && <CustomCursor currentLevel={currentLevel} />}
      </div>
      
      <TrollBanner currentLevel={currentLevel} />
      
      <ProgressBar currentLevel={currentLevel} />
      
      <DevNav currentLevel={currentLevel} setLevel={setCurrentLevel} />
      
      {/* Global Skip Button */}
      <div className="fixed bottom-4 left-4 z-[60]">
          <a 
            href="https://r.mtdv.me/ParisTroll"
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 bg-gray-900/80 border border-gray-700 text-gray-500 hover:text-white hover:border-white rounded-lg transition-all text-xs font-mono cursor-interactive
                ${showSkipHint ? 'animate-bounce border-yellow-500 text-yellow-500 shadow-[0_0_15px_gold]' : ''}
            `}
          >
              <SkipForward size={12} /> SKIP LEVEL
          </a>
      </div>
      
      <main className="w-full flex justify-center z-10 pb-8 pt-16 perspective-1000">
        <TiltContainer level={currentLevel}>
            <div key={currentLevel} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                {renderLevel()}
            </div>
        </TiltContainer>
      </main>

      {/* Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div 
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse-fast transition-colors duration-1000 opacity-20" 
            style={{ backgroundColor: currentColor }}
        />
        <div 
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse-fast transition-colors duration-1000 opacity-20" 
            style={{ backgroundColor: currentColor, animationDelay: '1s' }}
        />
      </div>
    </div>
  );
}

export default App;
