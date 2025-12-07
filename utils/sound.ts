
export const playUISound = (type: 'hover' | 'click' | 'lock' | 'wind' | 'tick' | 'shatter' | 'impact' | 'slide' | 'success' | 'error' | 'flip' | 'thruster' | 'scan' | 'scratch' | 'sent' | 'water' | 'level_next' | 'beat') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    const createOscillator = (type: OscillatorType, freq: number, duration: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
        return { osc, gain };
    };

    switch (type) {
        case 'hover':
            createOscillator('sine', 800, 0.05, 0.02);
            break;
        case 'click':
            createOscillator('triangle', 300, 0.05, 0.05);
            break;
        case 'level_next': {
            // Sci-fi transition swoosh
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.linearRampToValueAtTime(3000, now + 0.3);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
        }
        case 'beat': {
            // Kick drum
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
        }
        case 'lock': {
            const { osc } = createOscillator('triangle', 400, 0.2, 0.1);
            osc.frequency.linearRampToValueAtTime(600, now + 0.1);
            break;
        }
        case 'slide': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.linearRampToValueAtTime(2000, now + 0.15);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        }
        case 'water': {
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.linearRampToValueAtTime(800, now + 0.1);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);
            break;
        }
        case 'scratch': {
            const bufferSize = ctx.sampleRate * 0.08;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11;
                b6 = white * 0.115926;
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.08);
            
            noise.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);
            break;
        }
        case 'sent': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
            
            setTimeout(() => {
                createOscillator('sine', 1200, 0.5, 0.1);
            }, 200);
            break;
        }
        case 'success':
            createOscillator('triangle', 440, 0.3, 0.1);
            setTimeout(() => createOscillator('triangle', 554, 0.3, 0.1), 100);
            setTimeout(() => createOscillator('triangle', 659, 0.4, 0.1), 200);
            break;
        case 'error':
            createOscillator('sawtooth', 150, 0.3, 0.1);
            setTimeout(() => createOscillator('sawtooth', 100, 0.3, 0.1), 100);
            break;
        case 'tick':
            createOscillator('square', 2000, 0.03, 0.05);
            break;
        case 'flip': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        }
        case 'thruster': {
             const bufferSize = ctx.sampleRate * 0.2;
             const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
             const data = buffer.getChannelData(0);
             for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
             const noise = ctx.createBufferSource();
             noise.buffer = buffer;
             const filter = ctx.createBiquadFilter();
             filter.type = 'lowpass';
             filter.frequency.value = 150;
             const gain = ctx.createGain();
             gain.gain.value = 0.3;
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
             noise.connect(filter);
             filter.connect(gain);
             gain.connect(ctx.destination);
             noise.start(now);
             break;
        }
        case 'wind': {
             const bufferSize = ctx.sampleRate * 2;
             const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
             const data = buffer.getChannelData(0);
             for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
             const noise = ctx.createBufferSource();
             noise.buffer = buffer;
             noise.loop = true;
             const filter = ctx.createBiquadFilter();
             filter.type = 'lowpass';
             filter.frequency.value = 400;
             const gain = ctx.createGain();
             gain.gain.setValueAtTime(0.1, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 3);
             noise.connect(filter);
             filter.connect(gain);
             gain.connect(ctx.destination);
             noise.start(now);
             break;
        }
        case 'shatter': {
            const bufferSize = ctx.sampleRate * 0.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 2000;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);
            break;
        }
        case 'impact': {
            const { osc } = createOscillator('sine', 150, 0.5, 0.5);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
            break;
        }
    }
  } catch (e) {
    // Ignore audio errors
  }
};
