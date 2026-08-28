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
    <div className="graph-view" style={{ background: 'var(--bg-base)' }}>
      {/* Toolbar */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GitBranch size={16} style={{ color: 'var(--color-primary)' }} />
          <span className="view-title">Dependency Graph</span>
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
              {/* Edges */}
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
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={`M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2 - 8} ${y2}`}
                    fill="none"
                    stroke={isHighlighted ? '#f87171' : '#6e7eab'}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeOpacity={isHighlighted ? 1 : 0.5}
                    strokeDasharray={isHighlighted ? undefined : '5,4'}
                    markerEnd={isHighlighted ? 'url(#arrowhead)' : 'url(#arrowhead-normal)'}
                    style={{ transition: 'all 0.2s' }}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const { bug, x, y } = node;
                const statusColor = STATUS_COLOR[bug.status] ?? '#6e7eab';
                const severityColor = SEVERITY_COLOR[bug.severity] ?? '#60a5fa';
                const isHovered = hoveredId === bug.id;
                const isRelated = hoveredId
                  ? edges.some(e => (e.from === hoveredId && e.to === bug.id) || (e.to === hoveredId && e.from === bug.id))
                  : false;

                return (
                  <g
                    key={bug.id}
                    className="dep-node"
                    transform={`translate(${x}, ${y})`}
                    onMouseEnter={() => setHoveredId(bug.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
                    data-tooltip={`Open ${bug.id} details`}
                  >
                    {/* Shadow */}
                    <rect
                      x={2} y={4}
                      width={NODE_WIDTH} height={NODE_HEIGHT}
                      rx={10} ry={10}
                      fill={statusColor}
                      opacity={0.12}
                    />
                    {/* Main rect */}
                    <rect
                      width={NODE_WIDTH} height={NODE_HEIGHT}
                      rx={10} ry={10}
                      fill={isHovered ? 'hsl(228, 14%, 16%)' : 'hsl(228, 14%, 12%)'}
                      stroke={isHovered ? statusColor : isRelated ? severityColor : 'hsla(220, 25%, 40%, 0.4)'}
                      strokeWidth={isHovered ? 2 : isRelated ? 1.5 : 1}
                      filter={isHovered ? 'url(#glow)' : undefined}
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Top severity bar */}
                    <rect
                      width={NODE_WIDTH} height={3}
                      rx={10} ry={10}
                      fill={severityColor}
                      opacity={0.8}
                    />
                    {/* Status indicator dot */}
                    <circle cx={16} cy={20} r={5} fill={statusColor} />
                    {/* Bug ID */}
                    <text
                      x={26} y={24}
                      fontSize={11} fontWeight={700}
                      fontFamily="JetBrains Mono, monospace"
                      fill={statusColor}
                    >{bug.id}</text>
                    {/* Title */}
                    <foreignObject x={10} y={32} width={NODE_WIDTH - 20} height={30}>
                      <div
                        style={{
                          fontSize: 10, lineHeight: '13px', color: '#c8d0e8',
                          overflow: 'hidden', display: '-webkit-box',
                          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {bug.title}
                      </div>
                    </foreignObject>
                    {/* Priority tag */}
                    <rect x={NODE_WIDTH - 32} y={6} width={26} height={14} rx={7} fill={`${severityColor}22`} stroke={`${severityColor}55`} />
                    <text x={NODE_WIDTH - 19} y={16.5} fontSize={9} fontWeight={800} textAnchor="middle" fill={severityColor}>
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
