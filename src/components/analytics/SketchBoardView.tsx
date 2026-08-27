import React, { useRef, useState, useEffect } from 'react';
import { useBugs } from '../../context/BugContext';
import { Pencil, Trash2, Eraser, Plus, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CanvasSticky {
  id: string;
  x: number;
  y: number;
  text: string;
  color: 'yellow' | 'pink' | 'blue' | 'purple';
}

export default function SketchBoardView() {
  const { showToast } = useBugs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('var(--accent-purple)');
  const [thickness, setThickness] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [stickies, setStickies] = useState<CanvasSticky[]>([
    { id: 's-1', x: 80, y: 120, text: 'Check database pool allocations! 🕵️‍♂️', color: 'yellow' },
    { id: 's-2', x: 420, y: 160, text: 'Auto-registration added for testing! 🔐', color: 'pink' }
  ]);
  const [draggedStickyId, setDraggedStickyId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Scale for high DPI displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    // Set default drawing configurations
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // Drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    
    // Set drawing stroke options
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    ctx.lineWidth = thickness;

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Helper coordinate converter
  const getEventCoords = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showToast('Sketchpad wiped clean! 🧼', 'info');
  };

  // Sticky notes drag logic
  const addSticky = () => {
    const newSticky: CanvasSticky = {
      id: `s-${Date.now()}`,
      x: 150 + Math.random() * 100,
      y: 150 + Math.random() * 100,
      text: 'Double click to edit trace clue...',
      color: ['yellow', 'pink', 'blue', 'purple'][Math.floor(Math.random() * 4)] as any
    };
    setStickies([...stickies, newSticky]);
    confetti({ particleCount: 30, spread: 20 });
    showToast('New sticky note pinned! 📌', 'success');
  };

  const handleStickyMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const sticky = stickies.find(s => s.id === id);
    if (!sticky) return;
    setDraggedStickyId(id);
    setDragOffset({
      x: e.clientX - sticky.x,
      y: e.clientY - sticky.y
    });
  };

  const handleStickyMouseMove = (e: MouseEvent) => {
    if (!draggedStickyId) return;
    setStickies(prev => prev.map(s => {
      if (s.id === draggedStickyId) {
        return {
          ...s,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
      }
      return s;
    }));
  };

  const handleStickyMouseUp = () => {
    setDraggedStickyId(null);
  };

  useEffect(() => {
    if (draggedStickyId) {
      window.addEventListener('mousemove', handleStickyMouseMove);
      window.addEventListener('mouseup', handleStickyMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleStickyMouseMove);
      window.removeEventListener('mouseup', handleStickyMouseUp);
    };
  }, [draggedStickyId, dragOffset]);

  const updateStickyText = (id: string, newText: string) => {
    setStickies(prev => prev.map(s => s.id === id ? { ...s, text: newText } : s));
  };

  const removeSticky = (id: string) => {
    setStickies(prev => prev.filter(s => s.id !== id));
    showToast('Sticky note removed!', 'info');
  };

  return (
    <div className="sketch-board-view" style={{ background: 'var(--bg-notebook)', minHeight: '100vh', padding: '30px', color: 'var(--text-white)' }}>
      
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #201E2B', paddingBottom: '16px', marginBottom: '20px' }}>
        <div>
          <span className="view-title">Doodle Sketch Board 🎨</span>
          <span className="view-count" style={{ marginLeft: '12px' }}>Collaborative Detective Canvas</span>
        </div>
        
        {/* Canvas control bars */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#17161F', padding: '6px 12px', borderRadius: '6px', border: '2px solid var(--text-dark)' }}>
          {/* Tool Toggles */}
          <button 
            onClick={() => setTool('pen')} 
            className={`navbar-icon-btn ${tool === 'pen' ? 'active' : ''}`}
            style={{ background: tool === 'pen' ? 'var(--accent-purple)' : 'transparent', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
            title="Marker Pen"
          >
            <Pencil size={15} style={{ color: tool === 'pen' ? 'white' : 'var(--accent-purple)' }} />
          </button>
          
          <button 
            onClick={() => setTool('eraser')} 
            className={`navbar-icon-btn ${tool === 'eraser' ? 'active' : ''}`}
            style={{ background: tool === 'eraser' ? 'var(--accent-yellow)' : 'transparent', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
            title="Board Eraser"
          >
            <Eraser size={15} style={{ color: tool === 'eraser' ? 'var(--text-dark)' : 'var(--accent-yellow)' }} />
          </button>

          {/* Marker Colors */}
          <div style={{ display: 'flex', gap: '6px', borderLeft: '1.5px dashed rgba(255,255,255,0.15)', paddingLeft: '8px' }}>
            {['var(--accent-purple)', 'var(--accent-coral)', 'var(--accent-yellow)', 'var(--accent-mint)'].map(c => (
              <div 
                key={c}
                onClick={() => { setColor(c); setTool('pen'); }}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: c,
                  border: color === c && tool === 'pen' ? '2.5px solid white' : '1.5px solid var(--text-dark)',
                  cursor: 'pointer',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)'
                }}
              />
            ))}
          </div>

          {/* Thickness selection */}
          <div style={{ display: 'flex', gap: '4px', borderLeft: '1.5px dashed rgba(255,255,255,0.15)', paddingLeft: '8px' }}>
            {[2, 4, 8].map(t => (
              <button
                key={t}
                onClick={() => setThickness(t)}
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 'bold',
                  background: thickness === t ? 'white' : 'transparent',
                  color: thickness === t ? 'black' : 'white',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  cursor: 'pointer'
                }}
              >
                {t === 2 ? 'Fine' : t === 4 ? 'Med' : 'Bold'}
              </button>
            ))}
          </div>

          <div style={{ borderLeft: '1.5px dashed rgba(255,255,255,0.15)', paddingLeft: '8px', display: 'flex', gap: '8px' }}>
            {/* Add Sticky Note */}
            <button 
              onClick={addSticky} 
              className="navbar-btn navbar-btn-primary"
              style={{ padding: '4px 8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={12} strokeWidth={3} /> Sticky
            </button>

            {/* Clear Board */}
            <button 
              onClick={clearCanvas} 
              className="navbar-btn"
              style={{ background: 'var(--accent-coral)', color: 'white', padding: '4px 8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', border: '1.5px solid var(--text-dark)' }}
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* Main Sketch Canvas Layout */}
      <div 
        style={{ 
          position: 'relative',
          width: '100%',
          height: '74vh',
          background: 'white',
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          border: '4px solid var(--text-dark)',
          borderRadius: '8px',
          boxShadow: '8px 8px 0px rgba(0,0,0,0.95)',
          overflow: 'hidden'
        }}
      >
        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            cursor: tool === 'eraser' ? 'cell' : 'crosshair'
          }}
        />

        {/* Floating Movable Stickies */}
        {stickies.map(s => {
          const stickyColorClass = s.color === 'yellow' ? 'note-yellow' : s.color === 'pink' ? 'note-pink' : s.color === 'blue' ? 'note-blue' : 'note-purple';
          return (
            <div
              key={s.id}
              onMouseDown={(e) => handleStickyMouseDown(e, s.id)}
              className={`metric-sticky-card ${stickyColorClass}`}
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                width: '180px',
                minHeight: '100px',
                padding: '12px',
                zIndex: 10,
                boxShadow: '3px 3px 0px rgba(0,0,0,0.85)',
                cursor: 'grab',
                transform: 'rotate(-1.5deg)',
                userSelect: 'none'
              }}
            >
              {/* Tape Strip */}
              <div className="tape-strip" style={{ width: '45px', top: '-8px', left: '15px' }}></div>
              
              {/* Delete tag */}
              <button 
                onClick={(e) => { e.stopPropagation(); removeSticky(s.id); }}
                style={{ position: 'absolute', top: '2px', right: '4px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.45)' }}
              >
                ✕
              </button>

              <textarea
                value={s.text}
                onChange={(e) => updateStickyText(s.id, e.target.value)}
                onMouseDown={(e) => e.stopPropagation()} // Stop drag when typing
                style={{
                  width: '100%',
                  height: '60px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1rem',
                  color: 'var(--text-dark)',
                  lineHeight: 1.2
                }}
              />
            </div>
          );
        })}
      </div>

    </div>
  );
}
