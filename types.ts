
export enum AppLevel {
  INTRO = 1,
  MORSE = 2,
  CODE = 3,
  ERASER = 4,
  MEMORY = 5,
  SLIDERS = 6,
  TIMING = 7,
  CIPHER = 8,
  TROLL = 9,
  ALIGN = 10, // Spectrum Alignment
  MAZE = 11, // Rhythm Uplink
  REVERSE = 12,
  STROOP = 13,
  STATIC = 14,
  FREQUENCY = 15,
  BINARY = 16, // Hex Matcher
  KEYPAD = 17, // Quantum Entanglement
  EYE = 18, // Orbital Stabilization
  CLICKER = 19, 
  SUCCESS = 20
}

export interface LevelProps {
  onComplete: () => void;
  onPrev?: () => void;
  isActive: boolean;
}

export const LEVEL_COLORS: Record<number, string> = {
  [AppLevel.INTRO]: '#3b82f6',
  [AppLevel.MORSE]: '#fbbf24',
  [AppLevel.CODE]: '#00ffc8',
  [AppLevel.ERASER]: '#ff8c00',
  [AppLevel.MEMORY]: '#ec4899',
  [AppLevel.SLIDERS]: '#8b5cf6',
  [AppLevel.TIMING]: '#0ea5e9',
  [AppLevel.CIPHER]: '#ef4444',
  [AppLevel.TROLL]: '#eab308',
  [AppLevel.ALIGN]: '#6366f1',
  [AppLevel.MAZE]: '#d946ef',
  [AppLevel.REVERSE]: '#14b8a6',
  [AppLevel.STROOP]: '#84cc16',
  [AppLevel.STATIC]: '#a3e635',
  [AppLevel.FREQUENCY]: '#06b6d4',
  [AppLevel.BINARY]: '#f43f5e',
  [AppLevel.KEYPAD]: '#d946ef',
  [AppLevel.EYE]: '#f97316',
  [AppLevel.CLICKER]: '#dc2626',
  [AppLevel.SUCCESS]: '#10b981'
};