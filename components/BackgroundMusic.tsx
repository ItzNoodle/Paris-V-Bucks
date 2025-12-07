
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const BackgroundMusic: React.FC = () => {
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15; // Low volume background
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Create drone oscillators (Pads)
    // Frequencies for a dark, sci-fi chord (e.g., D minor add9)
    const freqs = [73.42, 110.00, 146.83, 174.61, 220.00]; 
    
    freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f;

        // LFO for movement
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + Math.random() * 0.1; // Slow breathing
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 5; // Modulate pitch slightly

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        // Filter for warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300 + Math.random() * 200;

        const gain = ctx.createGain();
        gain.gain.value = 0.08 / freqs.length;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        lfo.start();
    });

    // Melodic Arpeggiator (Relaxing)
    const notes = [293.66, 349.23, 440.00, 523.25, 698.46]; // D Minor Pentatonicish
    let noteIndex = 0;

    const playNote = () => {
        if (!masterGainRef.current || muted) return;
        const now = ctx.currentTime;
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        noteOsc.type = 'sine';
        const freq = notes[Math.floor(Math.random() * notes.length)];
        noteOsc.frequency.setValueAtTime(freq, now);
        
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.05, now + 0.5); // Slow attack
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 4); // Long release

        // Reverb-ish effect via delay
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.4;
        const feedback = ctx.createGain();
        feedback.gain.value = 0.3;
        
        noteOsc.connect(noteGain);
        noteGain.connect(masterGain);
        noteGain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(masterGain);

        noteOsc.start(now);
        noteOsc.stop(now + 4);
        
        noteIndex = (noteIndex + 1) % notes.length;
    };

    intervalRef.current = window.setInterval(playNote, 3000); // Play a note every 3 seconds
  };

  useEffect(() => {
    const startAudio = () => {
        if (!isPlayingRef.current) {
            initAudio();
            isPlayingRef.current = true;
        }
        if (audioCtxRef.current?.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);
    
    return () => {
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
        }
    };
  }, []);

  useEffect(() => {
      if (!masterGainRef.current) return;
      
      if (muted) {
          masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.5);
      } else {
          masterGainRef.current.gain.setTargetAtTime(0.15, audioCtxRef.current!.currentTime, 0.5);
      }
  }, [muted]);

  return (
    <button 
        onClick={() => setMuted(!muted)}
        className="fixed top-4 left-4 z-[99999] text-gray-500 hover:text-white transition-colors bg-black/50 p-2 rounded-full cursor-interactive"
    >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
};
