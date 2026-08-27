import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Sparkles, Terminal, Code, Heart, ArrowRight, Play, BookOpen, User, CheckSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

// Cute Bug Mascot sitting on a laptop looking at the dashboard
const MascotCute = () => (
  <div style={{ position: 'relative', width: '100px', height: '100px' }}>
    <svg 
      viewBox="0 0 100 100" 
      width="100%" 
      height="100%" 
      fill="none" 
      stroke="var(--text-dark)" 
      strokeWidth="5"
      strokeLinecap="round"
      style={{ transform: 'rotate(-4deg)' }}
    >
      {/* Antennas */}
      <path d="M 40 25 Q 32 10 24 13" stroke="currentColor" strokeWidth="4" />
      <path d="M 60 25 Q 68 10 76 13" stroke="currentColor" strokeWidth="4" />
      <circle cx="24" cy="13" r="3" fill="var(--accent-mint)" stroke="currentColor" strokeWidth="2" />
      <circle cx="76" cy="13" r="3" fill="var(--accent-mint)" stroke="currentColor" strokeWidth="2" />

      {/* Body */}
      <path 
        d="M 25 45 C 20 30, 80 30, 75 45 C 80 68, 70 80, 50 80 C 30 80, 20 68, 25 45 Z" 
        fill="var(--paper-beige)" 
        stroke="currentColor" 
        strokeWidth="5" 
      />

      {/* Cute eyes & smile */}
      <circle cx="40" cy="45" r="5" fill="currentColor" />
      <circle cx="60" cy="45" r="5" fill="currentColor" />
      <circle cx="40" cy="45" r="1.5" fill="white" stroke="none" />
      <circle cx="60" cy="45" r="1.5" fill="white" stroke="none" />
      <path d="M 46 58 Q 50 63 54 58" stroke="currentColor" strokeWidth="3.5" />

      {/* Little arms holding keyboard base */}
      <path d="M 20 60 Q 30 64 35 68" stroke="currentColor" strokeWidth="4" />
      <path d="M 80 60 Q 70 64 65 68" stroke="currentColor" strokeWidth="4" />
    </svg>

    {/* Laptop */}
    <div 
      style={{ 
        position: 'absolute', 
        bottom: '5px', 
        left: '12px', 
        width: '76px', 
        height: '4px', 
        background: 'var(--text-dark)', 
        borderRadius: '2px' 
      }} 
    />
  </div>
);

export default function LandingPage() {
  const { dispatch } = useBugs();
  const [toggleDark, setToggleDark] = useState(true);

  // Confetti welcome trigger
  const handleEnterWorkspace = () => {
    confetti({
      particleCount: 120,
      spread: 60,
      origin: { y: 0.6 }
    });
    dispatch({ type: 'SET_VIEW', payload: 'login' });
  };

  return (
    <div 
      className="landing-page-workspace"
      style={{
        background: '#0F0E13',
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          radial-gradient(rgba(255, 255, 255, 0.015) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '24px 24px, 48px 48px',
        minHeight: '100vh',
        width: '100%',
        color: 'var(--text-white)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
        padding: '20px 40px'
      }}
    >
      
      {/* Header bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '6px', 
            background: 'var(--accent-yellow)', 
            border: '2.5px solid var(--text-dark)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.9)'
          }}>
            <svg viewBox="0 0 100 100" width="20" height="20" fill="var(--text-dark)" stroke="currentColor" strokeWidth="8">
              <circle cx="50" cy="50" r="30" />
              <path d="M 20 40 L 5 35 M 80 40 L 95 35" />
            </svg>
          </div>
          <span className="brand-name" style={{ fontSize: '1.4rem' }}>Bug<span>Studio</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Theme switcher switch */}
          <div 
            onClick={() => setToggleDark(!toggleDark)}
            style={{
              padding: '6px 14px',
              border: '2px solid var(--text-dark)',
              borderRadius: '4px',
              background: toggleDark ? 'var(--accent-yellow)' : 'var(--accent-purple)',
              color: 'var(--text-dark)',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.9)',
              fontFamily: 'var(--font-hand)'
            }}
          >
            {toggleDark ? '★ Dark Mode' : '★ Light Mode'}
          </div>
        </div>
      </header>

      {/* Main split-screen container */}
      <main 
        style={{ 
          flex: 1, 
          display: 'grid', 
          gridTemplateColumns: '55fr 45fr', 
          gap: '40px', 
          alignItems: 'center',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          zIndex: 5
        }}
      >
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>
          
          {/* Masking tape top-left decoration */}
          <div className="tape-strip" style={{ width: '90px', top: '-30px', left: '-10px', transform: 'rotate(-4deg)' }}></div>

          <h1 style={{ fontFamily: 'var(--font-marker)', fontSize: '4.6rem', lineHeight: 1.05, color: 'var(--text-white)', margin: 0 }}>
            Ship great code.<br />
            Not more <span style={{ position: 'relative', display: 'inline-block' }}>
              bugs.
              <span style={{
                position: 'absolute',
                bottom: '2px',
                left: '0',
                right: '0',
                height: '16px',
                background: 'var(--accent-yellow)',
                zIndex: -1,
                transform: 'skewX(-10deg) rotate(-2deg)',
                opacity: 0.95
              }} />
            </span>
          </h1>

          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.45rem', color: 'var(--text-muted)', lineHeight: 1.4, maxWidth: '580px' }}>
            Forget standard spreadsheet tables. BugStudio is an aesthetic workspace notebook pinned with colorful sticky notes, caution tapes, and robotic bug detectives. Mix productivity with raw personality.
          </p>

          {/* Notebook Paper CTA Buttons */}
          <div style={{ display: 'flex', gap: '20px' }}>
            
            {/* CTA 1 */}
            <div 
              onClick={handleEnterWorkspace}
              style={{
                background: 'var(--paper-yellow)',
                color: 'var(--text-dark)',
                padding: '16px 28px',
                borderRadius: '2px',
                border: '2.5px solid var(--text-dark)',
                boxShadow: '6px 6px 0px rgba(0,0,0,0.95)',
                transform: 'rotate(-2.5deg)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'inline-flex',
                flexDirection: 'column',
                gap: '2px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) rotate(-1.5deg)';
                e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,0,0,0.95)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'rotate(-2.5deg)';
                e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.95)';
              }}
            >
              <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(0,0,0,0.45)' }}>Case Locker</span>
              <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-hand)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Open Workspace <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </div>

            {/* CTA 2 */}
            <div 
              onClick={handleEnterWorkspace}
              style={{
                background: 'var(--paper-beige)',
                color: 'var(--text-dark)',
                padding: '16px 28px',
                borderRadius: '2px',
                border: '2.5px solid var(--text-dark)',
                boxShadow: '6px 6px 0px rgba(0,0,0,0.95)',
                transform: 'rotate(1.5deg)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'inline-flex',
                flexDirection: 'column',
                gap: '2px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) rotate(0.5deg)';
                e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,0,0,0.95)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'rotate(1.5deg)';
                e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.95)';
              }}
            >
              <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(0,0,0,0.45)' }}>manual binder</span>
              <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-hand)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Read Guidebook <BookOpen size={16} />
              </span>
            </div>

          </div>

          {/* Three sticky-note feature badges below buttons */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
            
            <div className="metric-sticky-card note-yellow" style={{ flex: 1, minHeight: 'auto', padding: '10px 14px', borderRadius: '2px', transform: 'rotate(-2deg)', boxShadow: '3px 3px 0px rgba(0,0,0,0.9)' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                🤖 AI BugBot Agent
              </span>
            </div>

            <div className="metric-sticky-card note-orange" style={{ flex: 1, minHeight: 'auto', padding: '10px 14px', borderRadius: '2px', transform: 'rotate(1.5deg)', boxShadow: '3px 3px 0px rgba(0,0,0,0.9)' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                📌 Pinned Kanban Corks
              </span>
            </div>

            <div className="metric-sticky-card note-purple" style={{ flex: 1, minHeight: 'auto', padding: '10px 14px', borderRadius: '2px', transform: 'rotate(-1deg)', boxShadow: '3px 3px 0px rgba(0,0,0,0.9)' }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                📊 Crayon Analytics Scribes
              </span>
            </div>

          </div>

          {/* Floating airplane path & footprint decorations */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '10%', opacity: 0.35 }}>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.88rem', color: 'var(--text-white)' }}>🐾 bug crawling footprints . . . .</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Giant interactive dashboard preview inside notebook frame */}
        <div style={{ position: 'relative' }}>
          
          {/* Paper Clips decoration top right */}
          <div style={{ position: 'absolute', right: '40px', top: '-14px', width: '25px', height: '40px', border: '3.5px solid rgba(255,255,255,0.4)', borderRadius: '12px', zIndex: 10 }} />
          
          {/* Coffee Ring Stain top left */}
          <div 
            style={{ 
              position: 'absolute', 
              left: '-24px', 
              top: '40px', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              border: '4px double rgba(255,216,77,0.15)',
              transform: 'rotate(12deg)',
              pointerEvents: 'none',
              zIndex: 10
            }} 
          />

          {/* Giant Notebook preview container */}
          <div 
            style={{
              background: '#17161F',
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              border: '4px solid var(--text-dark)',
              borderRadius: '8px',
              boxShadow: '8px 8px 0px rgba(0,0,0,0.95)',
              padding: '24px 20px',
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative'
            }}
          >
            
            {/* Binder rings overlay on left margin */}
            <div style={{ position: 'absolute', left: '-12px', top: '10%', bottom: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '12px', zIndex: 10 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ width: '18px', height: '10px', background: 'var(--text-dark)', border: '2.5px solid #fff', borderRadius: '4px' }} />
              ))}
            </div>

            {/* Notebook headers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-mint)' }}>
                [ BS-SPRINT-02 WORKSPACE ]
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-coral)' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-yellow)' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-mint)' }} />
              </div>
            </div>

            {/* Simulated Layout Elements inside device */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gap: '16px'
              }}
            >
              
              {/* Internal Left: Kanban & List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Mini Kanban columns block */}
                <div style={{ background: '#0F0E13', borderRadius: '4px', padding: '10px', border: '1.5px solid var(--text-dark)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--accent-yellow)' }}>cork board</div>
                  
                  {/* Mini Kanban cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ background: 'var(--paper-yellow)', color: 'var(--text-dark)', padding: '6px', fontSize: '0.75rem', borderRadius: '2px', fontWeight: 'bold' }}>
                      BS-104 connection crash
                    </div>
                    <div style={{ background: 'var(--paper-blue)', color: 'var(--text-dark)', padding: '6px', fontSize: '0.75rem', borderRadius: '2px', fontWeight: 'bold' }}>
                      BS-108 scroll failure
                    </div>
                  </div>
                </div>

                {/* Heatmap blocks grid */}
                <div style={{ background: '#0F0E13', borderRadius: '4px', padding: '10px', border: '1.5px solid var(--text-dark)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--accent-mint)' }}>stability blocks</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} style={{ width: '100%', height: '10px', background: i % 4 === 0 ? 'var(--accent-coral)' : 'var(--accent-mint)', borderRadius: '1.5px' }} />
                    ))}
                  </div>
                </div>

              </div>

              {/* Internal Right: AI insight, Donut sprint progress, recent bugs list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* AI Insight sticky note */}
                <div style={{ background: 'var(--paper-pink)', color: 'var(--text-dark)', padding: '10px', borderRadius: '2px', position: 'relative', boxShadow: '2px 2px 0px rgba(0,0,0,0.9)' }}>
                  <div className="tape-strip" style={{ width: '40px', top: '-6px', left: '10px' }}></div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', display: 'block', opacity: 0.5 }}>AI Clue</span>
                  <p style={{ fontFamily: 'var(--font-hand)', fontSize: '0.88rem', margin: '4px 0 0 0', fontWeight: 'bold', lineHeight: 1.2 }}>
                    Connection leaks match connection loop crash patterns by 92%.
                  </p>
                </div>

                {/* Progress Donut & Avatars */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#0F0E13', borderRadius: '4px', padding: '10px', border: '1.5px solid var(--text-dark)' }}>
                  {/* Progress Circle SVG */}
                  <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                    <svg viewBox="0 0 36 36" width="100%" height="100%">
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--accent-yellow)" strokeWidth="4" strokeDasharray="80 20" strokeDashoffset="25" />
                    </svg>
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.62rem', fontWeight: 'bold' }}>80%</span>
                  </div>

                  {/* Avatars stamp list */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '2px' }}>Sprint Detectives</div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {['alice', 'bob', 'clara'].map(name => (
                        <div key={name} style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-purple)', border: '1px solid var(--text-dark)', fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {name[0].toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Mascot sitting on dashboard border looking inside */}
            <div style={{ position: 'absolute', bottom: '-40px', right: '-30px', zIndex: 30 }}>
              <MascotCute />
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
