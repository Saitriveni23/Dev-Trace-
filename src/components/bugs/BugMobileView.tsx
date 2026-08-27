import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Smartphone, Sparkles, Send, Trash, Check, MessageSquare, List, LayoutGrid, BarChart2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileCard {
  id: string;
  title: string;
  severity: string;
  noteColor: string;
  swipeDir: 'left' | 'right' | null;
}

export default function BugMobileView() {
  const { showToast } = useBugs();
  const [activeMobileTab, setActiveMobileTab] = useState<'list' | 'kanban' | 'analytics'>('list');

  // Local card state to demonstrate swipe animations
  const [mobileCards, setMobileCards] = useState<MobileCard[]>([
    { id: 'MC-1', title: 'Phantom Scroll Glitch in main div', severity: 'MAJOR', noteColor: 'note-yellow', swipeDir: null },
    { id: 'MC-2', title: 'Infinite Loading Spinner checkout crash', severity: 'BLOCKER', noteColor: 'note-orange', swipeDir: null },
    { id: 'MC-3', title: 'CSS float leakage on grid layouts', severity: 'MINOR', noteColor: 'note-purple', swipeDir: null },
    { id: 'MC-4', title: 'Database connection pool timeout loop', severity: 'CRITICAL', noteColor: 'note-blue', swipeDir: null },
  ]);

  // Floating AI Bug mascot balloon
  const [showAIBalloon, setShowAIBalloon] = useState(false);

  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    setMobileCards(prev => prev.map(c => c.id === id ? { ...c, swipeDir: direction } : c));
    
    setTimeout(() => {
      // Remove card from list
      setMobileCards(prev => prev.filter(c => c.id !== id));
      
      if (direction === 'right') {
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.6 }
        });
        showToast('Glitch resolved! Card swiped to Done 🎉', 'success');
      } else {
        showToast('Glitch postponed! Card swiped to Backlog 📝', 'info');
      }
    }, 300);
  };

  return (
    <div 
      className="mobile-preview-page" 
      style={{ 
        background: 'var(--bg-notebook)', 
        minHeight: '100vh', 
        padding: '30px', 
        color: 'var(--text-white)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }}
    >
      {/* Left Column: Device Information Scribe */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--accent-yellow)', textShadow: '2px 2px 0px rgba(0,0,0,0.8)', marginBottom: '10px' }}>
          BugStudio Mobile Workspace
        </h1>
        <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Experience the mobile design language. Issue tracking pinned on compact dark sketchbook screens.
        </p>

        {/* Feature list */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-hand)', fontSize: '1.25rem', fontWeight: 'bold' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-mint)' }}>✓</span>
            <span>Bottom binder index tabs for navigation.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-mint)' }}>✓</span>
            <span>Cards styled as mini angled sticky notes.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-mint)' }}>✓</span>
            <span>Interactive click-to-swipe card gestures!</span>
          </div>
        </div>

        {/* Reset button */}
        {mobileCards.length === 0 && (
          <button 
            className="btn btn-primary"
            onClick={() => setMobileCards([
              { id: 'MC-1', title: 'Phantom Scroll Glitch in main div', severity: 'MAJOR', noteColor: 'note-yellow', swipeDir: null },
              { id: 'MC-2', title: 'Infinite Loading Spinner checkout crash', severity: 'BLOCKER', noteColor: 'note-orange', swipeDir: null },
              { id: 'MC-3', title: 'CSS float leakage on grid layouts', severity: 'MINOR', noteColor: 'note-purple', swipeDir: null },
              { id: 'MC-4', title: 'Database connection pool timeout loop', severity: 'CRITICAL', noteColor: 'note-blue', swipeDir: null },
            ])}
            style={{ marginTop: '20px', transform: 'rotate(-2deg)' }}
          >
            Refill Sticky Deck 📝
          </button>
        )}
      </div>

      {/* Right Column: Simulated Mobile Device Frame */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        
        {/* CSS simulated Smartphone Frame */}
        <div 
          style={{
            width: '280px',
            height: '540px',
            background: '#0F0E13',
            border: '8px solid var(--text-dark)',
            borderRadius: '32px',
            boxShadow: '10px 10px 0px rgba(0, 0, 0, 0.95)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'sans-serif'
          }}
        >
          {/* Top Notch speaker */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '90px', height: '14px', background: 'var(--text-dark)', borderRadius: '0 0 10px 10px', zIndex: 50 }} />

          {/* Device Header */}
          <div style={{ padding: '24px 16px 8px', borderBottom: '2.5px solid #201E2B', background: '#17161F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1rem', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>
              BugStudio
            </span>
            <span style={{ fontSize: '0.62rem', fontWeight: 900, background: 'var(--accent-purple)', padding: '1px 5px', borderRadius: '4px' }}>
              M-02
            </span>
          </div>

          {/* Main App Content Viewport */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', background: '#0F0E13', position: 'relative' }}>
            
            {/* View 1: List */}
            {activeMobileTab === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  Glitch Deck ({mobileCards.length} notes)
                </span>

                {mobileCards.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 10px', fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
                    All bugs swiped! 🥳
                  </div>
                ) : (
                  mobileCards.map(card => {
                    const isSwipedLeft = card.swipeDir === 'left';
                    const isSwipedRight = card.swipeDir === 'right';

                    return (
                      <div 
                        key={card.id}
                        className={`metric-sticky-card ${card.noteColor}`}
                        style={{
                          minHeight: 'auto',
                          padding: '12px 14px',
                          borderRadius: '2px',
                          boxShadow: '2px 2px 0px rgba(0,0,0,0.95)',
                          alignItems: 'flex-start',
                          textAlign: 'left',
                          position: 'relative',
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                          transform: isSwipedLeft 
                            ? 'translateX(-150%) rotate(-12deg)' 
                            : isSwipedRight 
                            ? 'translateX(150%) rotate(12deg)' 
                            : 'none',
                          opacity: card.swipeDir ? 0 : 1
                        }}
                      >
                        <div className="tape-strip" style={{ width: '40px', top: '-8px', left: '15px' }}></div>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '0.62rem', fontWeight: 900, color: 'rgba(0,0,0,0.4)', marginBottom: '4px' }}>
                          <span>{card.id}</span>
                          <span>{card.severity}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', color: 'var(--text-dark)', lineHeight: 1.2, margin: '0 0 10px 0', fontWeight: 'bold' }}>
                          {card.title}
                        </p>

                        {/* Interactive swipe buttons on mobile preview cards */}
                        <div style={{ display: 'flex', gap: '8px', width: '100%', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '6px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSwipe(card.id, 'left'); }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-coral)', cursor: 'pointer', padding: '2px' }}
                            title="Swipe Backlog"
                          >
                            <Trash size={13} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSwipe(card.id, 'right'); }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-mint)', cursor: 'pointer', padding: '2px' }}
                            title="Swipe Done"
                          >
                            <Check size={13} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* View 2: Kanban */}
            {activeMobileTab === 'kanban' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  Cork Columns
                </span>
                
                {/* Simulated mobile Kanban columns list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Backlog 📝', 'In Progress ⚡', 'Done 🎉'].map((col, idx) => (
                    <div 
                      key={col} 
                      className="bg-cork" 
                      style={{ 
                        padding: '10px 14px', 
                        borderRadius: '6px', 
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        border: '2px solid var(--text-dark)'
                      }}
                    >
                      <span>{col}</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{idx === 0 ? '4 cards' : idx === 1 ? '1 card' : '12 cards'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 3: Analytics */}
            {activeMobileTab === 'analytics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  Weather & Metrics
                </span>
                
                {/* Weather widget */}
                <div style={{ background: 'white', border: '2px solid var(--text-dark)', borderRadius: '6px', padding: '12px', color: 'var(--text-dark)', transform: 'rotate(-2deg)', boxShadow: '2px 2px 0px rgba(0,0,0,0.9)' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 900, opacity: 0.4 }}>Glitch Weather</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--accent-purple)', marginTop: '2px' }}>Partly Cloudy ⛅</div>
                </div>

                {/* mini charts */}
                <div style={{ background: 'white', border: '2px solid var(--text-dark)', borderRadius: '6px', padding: '12px', color: 'var(--text-dark)', transform: 'rotate(1.5deg)', boxShadow: '2px 2px 0px rgba(0,0,0,0.9)' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 900, opacity: 0.4, marginBottom: '6px' }}>Sprint burndown line</div>
                  <div style={{ height: '40px', borderBottom: '2px solid var(--text-dark)', borderLeft: '2px solid var(--text-dark)', position: 'relative' }}>
                    <svg viewBox="0 0 100 40" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 5 5 L 30 15 L 60 20 L 95 38" stroke="var(--accent-coral)" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Floating AI Bug Button */}
            <div 
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                zIndex: 30
              }}
            >
              {/* Cute bug bubble dispatch */}
              {showAIBalloon && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '50px',
                    right: '0',
                    width: '150px',
                    background: 'var(--paper-yellow)',
                    border: '2px solid var(--text-dark)',
                    borderRadius: '8px',
                    padding: '8px',
                    fontFamily: 'var(--font-hand)',
                    fontSize: '0.88rem',
                    color: 'var(--text-dark)',
                    boxShadow: '2.5px 2.5px 0px rgba(0,0,0,0.9)',
                    zIndex: 40
                  }}
                >
                  "BugBot Clue: Tap card actions to swipe glitched notes away!"
                </div>
              )}

              <button
                onClick={() => {
                  setShowAIBalloon(!showAIBalloon);
                  confetti({ particleCount: 20, spread: 20 });
                }}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--accent-mint)',
                  border: '2.5px solid var(--text-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2.5px 2.5px 0px rgba(0,0,0,0.95)',
                  cursor: 'pointer',
                  animation: 'mascot-wobble 1.5s infinite ease-in-out'
                }}
              >
                <Sparkles size={16} style={{ color: 'var(--text-dark)' }} />
              </button>
            </div>

          </div>

          {/* Bottom Notebook Binder Tabs Navigation */}
          <div 
            style={{ 
              height: '50px', 
              background: '#17161F', 
              borderTop: '2.5px solid #201E2B', 
              display: 'flex', 
              justifyContent: 'space-around', 
              alignItems: 'center',
              padding: '0 8px'
            }}
          >
            {/* Tab 1: List */}
            <div 
              onClick={() => setActiveMobileTab('list')}
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                color: activeMobileTab === 'list' ? 'var(--accent-yellow)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                borderBottom: activeMobileTab === 'list' ? '2.5px solid var(--accent-yellow)' : 'none',
                paddingBottom: '2px'
              }}
            >
              <List size={13} />
              <span>Notes</span>
            </div>

            {/* Tab 2: Kanban */}
            <div 
              onClick={() => setActiveMobileTab('kanban')}
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                color: activeMobileTab === 'kanban' ? 'var(--accent-yellow)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                borderBottom: activeMobileTab === 'kanban' ? '2.5px solid var(--accent-yellow)' : 'none',
                paddingBottom: '2px'
              }}
            >
              <LayoutGrid size={13} />
              <span>Cork</span>
            </div>

            {/* Tab 3: Analytics */}
            <div 
              onClick={() => setActiveMobileTab('analytics')}
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                color: activeMobileTab === 'analytics' ? 'var(--accent-yellow)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                borderBottom: activeMobileTab === 'analytics' ? '2.5px solid var(--accent-yellow)' : 'none',
                paddingBottom: '2px'
              }}
            >
              <BarChart2 size={13} />
              <span>Weather</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
