
import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
}

const defaultColors = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const requestRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 1. Init WebGL Context & Static Program (Runs once)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);
    rendererRef.current = renderer;

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);
    cameraRef.current = camera;

    // Create program with initial uniforms
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 }
      },
      transparent: true,
      depthTest: false
    });
    programRef.current = program;

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', handleResize, false);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // 2. Handle Geometry Updates (When data props change)
  useEffect(() => {
    if (!programRef.current || !rendererRef.current) return;
    const gl = rendererRef.current.gl;

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    if (meshRef.current) {
      meshRef.current.geometry = geometry;
    } else {
      meshRef.current = new Mesh(gl, { mode: gl.POINTS, geometry, program: programRef.current });
    }
  }, [particleCount, particleColors, particleSpread]);

  // 3. Handle Uniform Updates
  useEffect(() => {
    if (programRef.current) {
      programRef.current.uniforms.uSpread.value = particleSpread;
      programRef.current.uniforms.uBaseSize.value = particleBaseSize * pixelRatio;
      programRef.current.uniforms.uSizeRandomness.value = sizeRandomness;
      programRef.current.uniforms.uAlphaParticles.value = alphaParticles ? 1 : 0;
    }
  }, [particleSpread, particleBaseSize, sizeRandomness, alphaParticles, pixelRatio]);

  // 4. Animation Loop
  useEffect(() => {
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t: number) => {
      requestRef.current = requestAnimationFrame(update);
      if (!rendererRef.current || !meshRef.current || !cameraRef.current || !programRef.current) return;

      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;
      timeRef.current = elapsed;

      programRef.current.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        meshRef.current.position.x = -mouseRef.current.x * particleHoverFactor;
        meshRef.current.position.y = -mouseRef.current.y * particleHoverFactor;
      } else {
        meshRef.current.position.x = 0;
        meshRef.current.position.y = 0;
      }

      if (!disableRotation) {
        meshRef.current.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        meshRef.current.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        meshRef.current.rotation.z += 0.01 * speed;
      }

      rendererRef.current.render({ scene: meshRef.current, camera: cameraRef.current });
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [speed, moveParticlesOnHover, particleHoverFactor, disableRotation]);

  return <div ref={containerRef} className={`particles-container ${className || ''}`} />;
};

export default Particles;
