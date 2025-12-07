
import React, { useState, useEffect, useCallback } from 'react';
import { LevelProps } from '../../types';
import { ArrowLeft, Zap, Droplets } from 'lucide-react';
import { playUISound } from '../../utils/sound';

// Grid 4x4
const GRID_SIZE = 4;
// Types: 0=Empty, 1=Straight, 2=Corner, 3=Tee
type NodeType = 'straight' | 'corner' | 'tee' | 'cross';

interface NodeData {
    id: number;
    type: NodeType;
    rotation: number; // 0, 1, 2, 3 (x90 deg)
    x: number;
    y: number;
    fixed?: boolean; // Source/Sink are fixed
}

// Initial Configuration (Harder)
const INITIAL_NODES_BASE: NodeData[] = [
    { id: 0, type: 'corner', rotation: 0, x: 0, y: 0, fixed: true }, // Source
    { id: 1, type: 'tee', rotation: 1, x: 1, y: 0 },
    { id: 2, type: 'straight', rotation: 0, x: 2, y: 0 },
    { id: 3, type: 'corner', rotation: 1, x: 3, y: 0 },

    { id: 4, type: 'straight', rotation: 1, x: 0, y: 1 },
    { id: 5, type: 'cross', rotation: 0, x: 1, y: 1 },
    { id: 6, type: 'corner', rotation: 2, x: 2, y: 1 },
    { id: 7, type: 'straight', rotation: 1, x: 3, y: 1 },

    { id: 8, type: 'corner', rotation: 0, x: 0, y: 2 },
    { id: 9, type: 'straight', rotation: 0, x: 1, y: 2 },
    { id: 10, type: 'tee', rotation: 3, x: 2, y: 2 },
    { id: 11, type: 'straight', rotation: 1, x: 3, y: 2 },

    { id: 12, type: 'tee', rotation: 0, x: 0, y: 3 },
    { id: 13, type: 'corner', rotation: 3, x: 1, y: 3 },
    { id: 14, type: 'straight', rotation: 0, x: 2, y: 3 },
    { id: 15, type: 'corner', rotation: 2, x: 3, y: 3, fixed: true }, // Sink
];

export const Level18Eye: React.FC<LevelProps> = ({ onComplete, onPrev }) => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [poweredNodes, setPoweredNodes] = useState<Set<number>>(new Set());
  const [isFlowing, setIsFlowing] = useState(false);
  const [won, setWon] = useState(false);

  // Initialize with random rotations
  useEffect(() => {
      const randomized = INITIAL_NODES_BASE.map(n => {
          if (n.fixed) return n;
          return {
              ...n,
              rotation: Math.floor(Math.random() * 4) // Random initial rotation
          };
      });
      setNodes(randomized);
  }, []);

  const getConnections = (type: NodeType, rot: number) => {
      let base = [false, false, false, false];
      if (type === 'straight') base = [false, true, false, true]; 
      if (type === 'corner') base = [false, true, true, false]; 
      if (type === 'tee') base = [false, true, true, true]; 
      if (type === 'cross') base = [true, true, true, true]; 

      const shift = rot % 4;
      const connections = [...base];
      for(let i=0; i<shift; i++) {
          connections.unshift(connections.pop()!);
      }
      return connections; // [Top, Right, Bottom, Left]
  };

  const checkFlow = useCallback(() => {
      if (nodes.length === 0) return false;
      const queue = [0]; 
      const visited = new Set<number>();
      visited.add(0);
      const newPowered = new Set<number>();
      newPowered.add(0);

      let reachedSink = false;

      while(queue.length > 0) {
          const currIdx = queue.shift()!;
          const curr = nodes[currIdx];
          const [cTop, cRight, cBottom, cLeft] = getConnections(curr.type, curr.rotation);

          const neighbors = [
              { idx: currIdx - 4, dir: 0, open: cTop },    // Top
              { idx: currIdx + 1, dir: 1, open: cRight },  // Right
              { idx: currIdx + 4, dir: 2, open: cBottom }, // Bottom
              { idx: currIdx - 1, dir: 3, open: cLeft }    // Left
          ];

          for (const n of neighbors) {
              if (n.idx < 0 || n.idx >= 16) continue;
              if (n.dir === 1 && curr.x === 3) continue; 
              if (n.dir === 3 && curr.x === 0) continue; 
              
              if (!n.open) continue; 

              const neighborNode = nodes[n.idx];
              const nConns = getConnections(neighborNode.type, neighborNode.rotation);
              const oppDir = (n.dir + 2) % 4;
              
              if (nConns[oppDir]) {
                  if (!visited.has(n.idx)) {
                      visited.add(n.idx);
                      newPowered.add(n.idx);
                      queue.push(n.idx);
                      if (n.idx === 15) reachedSink = true;
                  }
              }
          }
      }

      setPoweredNodes(newPowered);
      return reachedSink;

  }, [nodes]);

  useEffect(() => {
      const reached = checkFlow();
      if (reached && !won) {
          setWon(true);
          setIsFlowing(true);
          playUISound('lock');
          setTimeout(onComplete, 2000);
      }
  }, [nodes, checkFlow, won, onComplete]);

  const handleRotate = (index: number) => {
      if (won || nodes[index].fixed) return;
      playUISound('click');
      setNodes(prev => {
          const copy = [...prev];
          copy[index] = { ...copy[index], rotation: (copy[index].rotation + 1) % 4 };
          return copy;
      });
  };

  const renderPipe = (node: NodeData, isPowered: boolean) => {
      const strokeW = 12;
      const color = isPowered ? (won ? '#22c55e' : '#f97316') : '#374151'; 

      let d = "";
      if (node.type === 'straight') d = "M 0 50 L 100 50";
      else if (node.type === 'corner') d = "M 100 50 L 50 50 L 50 100";
      else if (node.type === 'tee') d = "M 0 50 L 100 50 M 50 50 L 50 100";
      else if (node.type === 'cross') d = "M 0 50 L 100 50 M 50 0 L 50 100";

      return (
          <svg 
            width="100%" height="100%" viewBox="0 0 100 100" 
            className={`transition-all duration-300 pointer-events-none absolute inset-0 ${isPowered ? 'z-10' : 'z-0'}`}
            style={{ transform: `rotate(${node.rotation * 90}deg)` }}
          >
              <path d={d} stroke="#1f2937" strokeWidth={strokeW + 6} fill="none" strokeLinecap="square" />
              <path d={d} stroke="#374151" strokeWidth={strokeW} fill="none" strokeLinecap="square" />
              <path 
                d={d} 
                stroke={color} 
                strokeWidth={isPowered ? strokeW - 4 : 0} 
                fill="none" 
                strokeLinecap="square"
                className={`transition-all duration-500 ${isPowered ? 'opacity-100' : 'opacity-0'}`}
                style={{ filter: isPowered ? `drop-shadow(0 0 5px ${color})` : 'none' }}
              />
              {isPowered && (
                  <path 
                    d={d} stroke="white" strokeWidth="2" fill="none" strokeDasharray="10 20"
                    className={won ? "animate-[dash_1s_linear_infinite]" : ""}
                    style={{ opacity: 0.5 }}
                  />
              )}
          </svg>
      );
  };

  return (
    <div className="text-center space-y-6 animate-in slide-in-from-right duration-500 pb-20 select-none">
      <header>
        <h2 className="text-3xl font-display font-bold text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">
          NEURAL FLOW
        </h2>
        <p className="text-gray-400 mt-2">Level 18/20</p>
      </header>

      <div className="bg-black/80 border border-orange-500/30 p-6 rounded-xl backdrop-blur-md max-w-xl mx-auto shadow-2xl flex flex-col items-center">
         
         <div className="flex justify-between w-full px-4 mb-6 items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800">
             <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_orange]" />
                 <span className="text-xs font-mono text-orange-400 font-bold">SOURCE ACTIVE</span>
             </div>
             <div className="flex items-center gap-2">
                 <span className={`text-xs font-mono font-bold ${won ? 'text-green-500' : 'text-gray-600'}`}>
                     {won ? 'FLOW STABLE' : 'LINK OFFLINE'}
                 </span>
                 <div className={`w-3 h-3 rounded-full transition-colors ${won ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-gray-700'}`} />
             </div>
         </div>

         <div 
            className="grid grid-cols-4 gap-1 bg-gray-950 p-2 rounded-lg border-2 border-gray-800 shadow-inner relative"
            style={{ width: 'fit-content' }}
         >
             {nodes.map((node) => (
                 <div 
                    key={node.id}
                    onClick={() => handleRotate(node.id)}
                    className={`
                        w-16 h-16 sm:w-20 sm:h-20 relative bg-gray-900/50 rounded 
                        ${node.fixed ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:bg-gray-800'}
                        transition-colors
                    `}
                 >
                     {renderPipe(node, poweredNodes.has(node.id))}
                     {node.id === 0 && <div className="absolute top-1 left-1 w-2 h-2 bg-orange-500 rounded-full z-20" />}
                     {node.id === 15 && <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full z-20" />}
                     {node.fixed && <div className="absolute inset-0 border border-white/5 rounded pointer-events-none" />}
                 </div>
             ))}
         </div>

         <div className="mt-6 flex items-center gap-2 text-gray-500 text-xs font-mono">
             <Droplets size={14} />
             <span>CONNECT SOURCE [0,0] TO SINK [3,3]</span>
         </div>

      </div>

      <div className="flex justify-start w-full px-8">
        <button onClick={onPrev} className="text-gray-500 border border-gray-700 hover:text-white px-8 py-4 rounded-lg bg-gray-900 cursor-interactive flex gap-2 items-center hover:bg-gray-800 transition-colors shadow-lg">
           <ArrowLeft size={18} /> BACK
        </button>
      </div>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -30; }
        }
      `}</style>
    </div>
  );
};
