import React, { useEffect, useRef, useState } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, GitBranch, Info } from 'lucide-react';

interface NodeLayout {
  bug: Bug;
  x: number;
  y: number;
  level: number;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 72;
const LEVEL_SPACING_X = 260;
const LEVEL_SPACING_Y = 90;

const STATUS_COLOR: Record<string, string> = {
  UNCONFIRMED: '#6e7eab',
  CONFIRMED: '#38bdf8',
  IN_PROGRESS: '#fb923c',
  RESOLVED: '#4ade80',
  VERIFIED: '#34d399',
  CLOSED: '#6e7eab',
};

const SEVERITY_COLOR: Record<string, string> = {
  BLOCKER: '#f87171', CRITICAL: '#fb923c', MAJOR: '#facc15',
  NORMAL: '#60a5fa', MINOR: '#4ade80', TRIVIAL: '#94a3b8',
  ENHANCEMENT: '#c084fc'
};

function buildGraph(bugs: Bug[]): { nodes: NodeLayout[]; edges: { from: string; to: string }[] } {
  // Find all bugs that participate in dependency relationships
  const participantIds = new Set<string>();
  bugs.forEach(b => {
    if (b.dependsOn.length > 0 || b.blocks.length > 0) {
      participantIds.add(b.id);
      b.dependsOn.forEach(id => participantIds.add(id));
      b.blocks.forEach(id => participantIds.add(id));
    }
  });

  const participants = bugs.filter(b => participantIds.has(b.id));
  if (participants.length === 0) return { nodes: [], edges: [] };

  // Simple hierarchical layout by dependency depth
  const levels: Map<string, number> = new Map();
  const queue = participants.filter(b => b.dependsOn.length === 0 || b.dependsOn.every(d => !participantIds.has(d)));
  queue.forEach(b => levels.set(b.id, 0));

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 100) {
    changed = false;
    iterations++;
    participants.forEach(b => {
      b.blocks.forEach(blockedId => {
        const myLevel = levels.get(b.id) ?? 0;
        const currentLevel = levels.get(blockedId) ?? 0;
        if (myLevel + 1 > currentLevel) {
          levels.set(blockedId, myLevel + 1);
          changed = true;
        }
      });
    });
  }

  // Group by level
  const levelGroups: Map<number, Bug[]> = new Map();
  participants.forEach(b => {
    const lvl = levels.get(b.id) ?? 0;
    if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
    levelGroups.get(lvl)!.push(b);
  });

  const nodes: NodeLayout[] = [];
  levelGroups.forEach((bugsInLevel, level) => {
    bugsInLevel.forEach((bug, idx) => {
      const totalInLevel = bugsInLevel.length;
      const offsetY = (idx - (totalInLevel - 1) / 2) * LEVEL_SPACING_Y;
      nodes.push({
        bug,
        x: level * LEVEL_SPACING_X + 40,
        y: 200 + offsetY,
        level
      });
    });
  });

  const edges: { from: string; to: string }[] = [];
  participants.forEach(b => {
    b.blocks.forEach(blockedId => {
      if (participantIds.has(blockedId)) {
        edges.push({ from: b.id, to: blockedId });
      }
    });
  });

  return { nodes, edges };
}

export default function DependencyGraph() {
  const { bugs, dispatch } = useBugs();
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { nodes, edges } = buildGraph(bugs);

  const getNodeById = (id: string) => nodes.find(n => n.bug.id === id);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('.dep-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(2.5, z - e.deltaY * 0.001)));
  };

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  return (
    <div className="graph-view" style={{ 
      background: '#2b211a', // Dark corkboard color
      backgroundImage: 'radial-gradient(#4a382c 15%, transparent 15%), radial-gradient(#4a382c 15%, transparent 15%)',
      backgroundSize: '16px 16px',
      backgroundPosition: '0 0, 8px 8px',
      flex: 1, display: 'flex', flexDirection: 'column', height: '100%' 
    }}>
      {/* Toolbar */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-surface)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GitBranch size={16} style={{ color: 'var(--accent-coral)' }} />
          <span className="view-title">"Red String" Evidence Board</span>
        </div>
        <span className="view-count">{nodes.length} nodes · {edges.length} edges</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setZoom(z => Math.min(2.5, z + 0.15))} data-tooltip="Zoom in" data-tooltip-pos="bottom">
            <ZoomIn size={13} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setZoom(z => Math.max(0.3, z - 0.15))} data-tooltip="Zoom out" data-tooltip-pos="bottom">
            <ZoomOut size={13} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={resetView} data-tooltip="Reset zoom and pan" data-tooltip-pos="bottom">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</span>
        {Object.entries(STATUS_COLOR).map(([s, c]) => (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />
            {s.replace('_', ' ')}
          </span>
        ))}
        <div style={{ width: 1, height: 12, background: 'var(--border)' }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <svg width="28" height="10" style={{ flexShrink: 0 }}>
            <defs><marker id="arr-legend" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f87171" /></marker></defs>
            <line x1="0" y1="5" x2="22" y2="5" stroke="#f87171" strokeWidth="2" markerEnd="url(#arr-legend)" />
          </svg>
          Blocks →
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Drag to pan · Scroll to zoom · Click node to open</span>
      </div>

      {/* Graph Canvas */}
      {nodes.length === 0 ? (
        <div className="empty-state" style={{ flex: 1 }}>
          <div className="empty-state-icon"><GitBranch size={24} /></div>
          <div className="empty-state-title">No dependency relationships found</div>
          <div className="empty-state-desc">Add "Blocks" or "Depends On" relationships to bugs to visualize their dependencies here.</div>
        </div>
      ) : (
        <div
          className="graph-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#f87171" />
              </marker>
              <marker id="arrowhead-normal" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill="#6e7eab" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges (Red Strings) */}
              {edges.map(edge => {
                const from = getNodeById(edge.from);
                const to = getNodeById(edge.to);
                if (!from || !to) return null;
                const x1 = from.x + NODE_WIDTH;
                const y1 = from.y + NODE_HEIGHT / 2;
                const x2 = to.x;
                const y2 = to.y + NODE_HEIGHT / 2;
                const cp1x = x1 + (x2 - x1) * 0.5;
                const cp2x = x2 - (x2 - x1) * 0.5;
                const isHighlighted = hoveredId === edge.from || hoveredId === edge.to;
                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    {/* Shadow of string */}
                    <path
                      d={`M ${x1} ${y1} C ${cp1x} ${y1 + 10}, ${cp2x} ${y2 + 10}, ${x2} ${y2}`}
                      fill="none"
                      stroke="rgba(0,0,0,0.5)"
                      strokeWidth={5}
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Main String */}
                    <path
                      d={`M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={isHighlighted ? '#ff1111' : '#dc2626'}
                      strokeWidth={isHighlighted ? 4 : 3}
                      strokeLinecap="round"
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Red Thread texture over it */}
                    <path
                      d={`M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth={1}
                      strokeDasharray="2,2"
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Thumbtacks */}
                    <circle cx={x1} cy={y1} r={4.5} fill="#fca5a5" stroke="#991b1b" strokeWidth={1} />
                    <circle cx={x1 - 1} cy={y1 - 1} r={1.5} fill="#fff" opacity={0.6} />
                    
                    <circle cx={x2} cy={y2} r={4.5} fill="#fca5a5" stroke="#991b1b" strokeWidth={1} />
                    <circle cx={x2 - 1} cy={y2 - 1} r={1.5} fill="#fff" opacity={0.6} />
                  </g>
                );
              })}

              {/* Nodes (Polaroid Evidence Cards) */}
              {nodes.map(node => {
                const { bug, x, y } = node;
                const statusColor = STATUS_COLOR[bug.status] ?? '#6e7eab';
                const severityColor = SEVERITY_COLOR[bug.severity] ?? '#60a5fa';
                const isHovered = hoveredId === bug.id;
                const isRelated = hoveredId
                  ? edges.some(e => (e.from === hoveredId && e.to === bug.id) || (e.to === hoveredId && e.from === bug.id))
                  : false;
                
                // Slight random rotation for messy board look (-3 to +3 degrees)
                const rot = (bug.numId % 7) - 3; 

                return (
                  <g
                    key={bug.id}
                    className="dep-node"
                    transform={`translate(${x}, ${y}) rotate(${rot}, ${NODE_WIDTH/2}, ${NODE_HEIGHT/2})`}
                    onMouseEnter={() => setHoveredId(bug.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Shadow */}
                    <rect
                      x={3} y={5}
                      width={NODE_WIDTH} height={NODE_HEIGHT + 25}
                      fill="rgba(0,0,0,0.4)"
                    />
                    
                    {/* Polaroid White Base */}
                    <rect
                      width={NODE_WIDTH} height={NODE_HEIGHT + 25}
                      fill="#f9f5e9"
                      stroke={isHovered ? statusColor : '#d1d5db'}
                      strokeWidth={isHovered ? 2 : 1}
                      style={{ transition: 'all 0.2s' }}
                    />
                    
                    {/* Image Area placeholder (Top part of polaroid) */}
                    <rect 
                      x={8} y={8} 
                      width={NODE_WIDTH - 16} height={NODE_HEIGHT - 20} 
                      fill="#111827" 
                    />

                    {/* Status indicator line instead of image */}
                    <rect
                      x={8} y={8}
                      width={NODE_WIDTH - 16} height={4}
                      fill={statusColor}
                    />
                    
                    {/* Bug ID in marker font */}
                    <text
                      x={14} y={32}
                      fontSize={16} fontWeight={800}
                      fontFamily="var(--font-hand)"
                      fill="#f9f5e9"
                    >{bug.id}</text>

                    {/* Masking tape on top */}
                    <path 
                      d={`M ${NODE_WIDTH/2 - 20} -6 L ${NODE_WIDTH/2 + 25} -12 L ${NODE_WIDTH/2 + 22} 8 L ${NODE_WIDTH/2 - 23} 10 Z`}
                      fill="rgba(255,255,255,0.7)"
                    />
                    
                    {/* Title in marker font (Polaroid footer area) */}
                    <foreignObject x={8} y={NODE_HEIGHT - 6} width={NODE_WIDTH - 16} height={35}>
                      <div
                        style={{
                          fontSize: 13, lineHeight: '14px', color: '#111827',
                          fontFamily: 'var(--font-hand)', fontWeight: 'bold',
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          textAlign: 'center'
                        }}
                      >
                        {bug.title}
                      </div>
                    </foreignObject>
                    
                    {/* Priority Stamp */}
                    <text 
                      x={NODE_WIDTH - 25} y={32} 
                      fontSize={14} fontWeight={800} 
                      fontFamily="var(--font-hand)" 
                      fill={severityColor}
                      transform={`rotate(15, ${NODE_WIDTH - 25}, 32)`}
                    >
                      {bug.priority}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
