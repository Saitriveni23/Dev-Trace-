import React, { useState, useEffect } from 'react';
import { useBugs } from '../../context/BugContext';
import { useAuth } from '../../hooks/useAuth';
import { ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LandingPage() {
  const { dispatch } = useBugs();
  const { user } = useAuth();
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 150 });
  const [boardRef, setBoardRef] = useState<HTMLDivElement | null>(null);

  // Confetti welcome triggers
  const handleEnterWorkspace = () => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
    if (user) {
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
    } else {
      dispatch({ type: 'SET_VIEW', payload: 'login' });
    }
  };

  const handleLiveDemo = () => {
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.5 }
    });
    dispatch({ type: 'SET_GUEST_MODE', payload: true });
    dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
  };

  // Magnifying glass follow cursor within the investigation board container
  useEffect(() => {
    if (!boardRef) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = boardRef.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    boardRef.addEventListener('mousemove', handleMouseMove);
    return () => {
      boardRef.removeEventListener('mousemove', handleMouseMove);
    };
  }, [boardRef]);

  return (
    <div 
      className="landing-page-workspace"
      style={{
        background: '#080A12',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        minHeight: '100vh',
        width: '100%',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
        padding: '24px 60px'
      }}
    >
      
      {/* minimal floating navbar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '6px', 
            background: '#FBBF24', 
            border: '2px solid #111827', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '3px 3px 0px rgba(0,0,0,0.95)'
          }}>
            <svg viewBox="0 0 100 100" width="20" height="20" fill="#111827" stroke="currentColor" strokeWidth="8">
              <circle cx="50" cy="50" r="30" />
              <path d="M 20 40 L 5 35 M 80 40 L 95 35" />
            </svg>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-sans)', letterSpacing: '-0.03em' }}>
            Dev<span style={{ color: '#FBBF24' }}>Trace</span>
          </span>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={handleLiveDemo}
            className="navbar-btn"
            style={{
              background: 'transparent',
              color: '#FFFFFF',
              border: '2px solid rgba(255,255,255,0.15)',
              padding: '8px 18px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            data-tooltip="Skip login and jump into the dashboard"
            data-tooltip-pos="bottom"
          >
            Access Board
          </button>
        </div>
      </header>

      {/* Main split-screen container */}
      <main 
        style={{ 
          flex: 1, 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '60px', 
          alignItems: 'center',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          zIndex: 5
        }}
      >
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
          
          <div className="tape-strip" style={{ width: '90px', top: '-30px', left: '-10px', transform: 'rotate(-4deg)' }}></div>

          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '4.8rem', fontWeight: 800, lineHeight: 1.05, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Solve mysteries,<br />
            not just <span style={{ position: 'relative', display: 'inline-block' }}>
              bugs.
              <span style={{
                position: 'absolute',
                bottom: '8px',
                left: '0',
                right: '0',
                height: '14px',
                background: '#FBBF24',
                zIndex: -1,
                transform: 'skewX(-10deg) rotate(-1.5deg)',
                opacity: 0.9
              }} />
            </span>
          </h1>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: '#9CA3AF', lineHeight: 1.5, maxWidth: '540px' }}>
            AI-powered bug tracking, collaboration, sprint planning, analytics, and intelligent debugging. Designed like a case investigation file.
          </p>

          {/* Interactive buttons */}
          <div style={{ display: 'flex', gap: '16px' }}>
            
            <button 
              onClick={handleEnterWorkspace}
              style={{
                background: '#FBBF24',
                color: '#111827',
                padding: '14px 28px',
                borderRadius: '4px',
                border: '2px solid #111827',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
                fontWeight: 'bold',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              data-tooltip="Go to login and start tracking bugs"
            >
              Start Tracking <ArrowRight size={16} strokeWidth={2.5} />
            </button>

            <button 
              onClick={handleLiveDemo}
              style={{
                background: '#1A2233',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '4px',
                border: '2px solid rgba(255,255,255,0.1)',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
                fontWeight: 'bold',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              data-tooltip="Skip login and explore a live demo"
            >
              Live Demo <BookOpen size={16} />
            </button>

          </div>

          {/* Sticky Notes feature tags */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            <div className="metric-sticky-card note-yellow" style={{ flex: 1, minHeight: 'auto', padding: '12px', transform: 'rotate(-1.5deg)', boxShadow: '3px 3px 0px rgba(0,0,0,0.85)' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold', color: '#111827' }}>
                🕵️‍♂️ Solve mysteries.
              </span>
            </div>
            <div className="metric-sticky-card note-pink" style={{ flex: 1, minHeight: 'auto', padding: '12px', transform: 'rotate(2deg)', boxShadow: '3px 3px 0px rgba(0,0,0,0.85)' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold', color: '#111827' }}>
                📌 Red String Clues.
              </span>
            </div>
            <div className="metric-sticky-card note-purple" style={{ flex: 1, minHeight: 'auto', padding: '12px', transform: 'rotate(-1deg)', boxShadow: '3px 3px 0px rgba(0,0,0,0.85)' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold', color: '#111827' }}>
                🤖 AI Detective Bot.
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Detective Board */}
        <div 
          ref={el => setBoardRef(el)}
          style={{
            position: 'relative',
            width: '100%',
            height: '480px',
            background: '#111827',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            border: '4px solid #1A2233',
            borderRadius: '12px',
            boxShadow: '12px 12px 0px rgba(0,0,0,0.95)',
            overflow: 'hidden'
          }}
        >
          
          {/* Background Blueprint Grid Line */}
          <div style={{ position: 'absolute', top: '15%', left: '10%', right: '10%', height: '2px', borderTop: '2px dashed rgba(255,255,255,0.05)' }} />

          {/* Red Connection Strings */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
            {/* Red string 1: sticky 1 to bug card */}
            <path d="M 80 110 Q 180 180 230 180" stroke="#EF4444" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
            {/* Red string 2: bug card to clue note */}
            <path d="M 330 220 Q 280 320 180 340" stroke="#EF4444" strokeWidth="2.5" fill="none" />
            {/* Red string 3: clue note to mascot */}
            <path d="M 180 340 Q 300 380 380 350" stroke="#EF4444" strokeWidth="2" fill="none" />
          </svg>

          {/* Sticky Note 1: Clue Case */}
          <div 
            className="metric-sticky-card note-yellow" 
            style={{ 
              position: 'absolute', 
              left: '40px', 
              top: '40px', 
              width: '150px',
              padding: '10px',
              transform: 'rotate(-4deg)',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.85)'
            }}
          >
            <div className="tape-strip" style={{ width: '40px', top: '-8px' }}></div>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.95rem', color: '#111827', fontWeight: 'bold' }}>
              Case #104: Database socket leakage logs verified. 🕵️‍♂️
            </span>
          </div>

          {/* Bug Card Case */}
          <div 
            style={{ 
              position: 'absolute', 
              left: '210px', 
              top: '120px', 
              width: '210px',
              background: '#1A2233',
              border: '2px solid #111827',
              borderRadius: '6px',
              padding: '12px',
              transform: 'rotate(2deg)',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
              zIndex: 8
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#FBBF24', fontWeight: 'bold' }}>BS-114 CRASH</span>
              <span style={{ fontSize: '0.55rem', background: '#EF4444', color: '#FFFFFF', padding: '1px 5px', borderRadius: '3px', fontWeight: 900 }}>CRITICAL</span>
            </div>
            <p style={{ fontSize: '0.82rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>Safari connection hangs during espresso refills</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Assignee: Alex</span>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FBBF24', border: '1px solid #111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: '#111827', fontWeight: 'bold' }}>A</div>
            </div>
          </div>

          {/* Sprint Clue Note */}
          <div 
            className="metric-sticky-card note-pink" 
            style={{ 
              position: 'absolute', 
              left: '50px', 
              top: '280px', 
              width: '160px',
              padding: '10px',
              transform: 'rotate(3deg)',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.85)'
            }}
          >
            <div className="tape-strip" style={{ width: '50px', top: '-8px' }}></div>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.95rem', color: '#111827', fontWeight: 'bold' }}>
              Sprint clue: 12 bugs resolved today. Target speed +15%! ⚡
            </span>
          </div>

          {/* Tiny Bug Mascot */}
          <div 
            style={{ 
              position: 'absolute', 
              right: '40px', 
              bottom: '40px',
              transform: 'rotate(-6deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 8
            }}
          >
            {/* Mini SVG Bug */}
            <svg viewBox="0 0 100 80" width="36" height="30" fill="#F9F5E9" stroke="#111827" strokeWidth="5">
              <path d="M 20 60 C 10 20, 90 20, 80 60" />
              <circle cx="38" cy="40" r="3" fill="#111827" />
              <circle cx="62" cy="40" r="3" fill="#111827" />
              <path d="M 25 15 Q 15 5 5 10 M 75 15 Q 85 5 95 10" strokeWidth="4" />
            </svg>
            <span style={{
              background: '#FBBF24',
              color: '#111827',
              fontSize: '0.62rem',
              fontWeight: 'bold',
              fontFamily: 'var(--font-sans)',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1.5px solid #111827',
              marginTop: '4px'
            }}>
              BugBot Jr
            </span>
          </div>

          {/* Magnifying Glass Following Cursor */}
          <div 
            style={{
              position: 'absolute',
              left: cursorPos.x - 40,
              top: cursorPos.y - 40,
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid #FBBF24',
              boxShadow: '0 0 15px rgba(251,191,36,0.3), inset 0 0 15px rgba(251,191,36,0.2)',
              pointerEvents: 'none',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Magnifying Glass Handle */}
            <div style={{ position: 'absolute', width: '25px', height: '6px', background: '#FBBF24', bottom: '-8px', right: '-12px', transform: 'rotate(45deg)', borderRadius: '2px' }} />
          </div>

        </div>

      </main>

    </div>
  );
}
