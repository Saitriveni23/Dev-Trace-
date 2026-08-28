import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Calendar as CalendarIcon, Coffee, Sparkles, CheckSquare, Square, Flame, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SprintPlannerView() {
  const { showToast } = useBugs();

  // Today's goals on sticky notes state
  const [goals, setGoals] = useState([
    { id: 1, text: 'File P1 blocking ticket for database leak', done: true, color: 'note-yellow' },
    { id: 2, text: 'Resolve scroll glitch on metrics frame', done: false, color: 'note-orange' },
    { id: 3, text: 'Clean off workspace desk coffee cup stains', done: false, color: 'note-purple' },
    { id: 4, text: 'Draw BugBot mascot in sketch margin', done: false, color: 'note-green' },
  ]);

  const completedCount = goals.filter(g => g.done).length;
  const progressPercent = Math.round((completedCount / goals.length) * 100);

  const handleGoalToggle = (id: number) => {
    setGoals(prev => {
      const next = prev.map(g => g.id === id ? { ...g, done: !g.done } : g);
      const nextCompleted = next.filter(g => g.done).length;
      
      if (nextCompleted === next.length) {
        // Double confetti explosion on 100% sprint!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        showToast('Sprint goals 100% completed! Desk coffee cup filled! ☕🎉', 'success');
      } else {
        confetti({ particleCount: 30, spread: 30 });
        showToast(`Goal status updated! Sprint progress: ${Math.round((nextCompleted / next.length) * 100)}%`, 'info');
      }
      return next;
    });
  };

  // Mock Calendar dates
  const calendarDays = Array.from({ length: 30 }).map((_, idx) => {
    const dayNum = idx + 1;
    const isSprintDay = dayNum >= 12 && dayNum <= 24;
    const isToday = dayNum === 18;
    return { dayNum, isSprintDay, isToday };
  });

  return (
    <div 
      className="sprint-planner-page" 
      style={{ 
        background: 'var(--bg-notebook)', 
        minHeight: '100vh', 
        padding: '30px',
        color: 'var(--text-white)'
      }}
    >
      
      {/* View Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2.5px solid #201E2B', paddingBottom: '16px', marginBottom: '24px' }}>
        <span className="view-title">Sprint Planner & Coffee Monitor</span>
        <span className="view-count">{progressPercent}% sprint velocity achieved</span>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          alignItems: 'start'
        }}
      >
        {/* LEFT COLUMN: Coffee Progress Cup & Today's Goals Sticky Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Coffee Mug Progress */}
          <div 
            style={{
              background: 'white',
              border: '3px solid var(--text-dark)',
              borderRadius: '8px',
              padding: '20px',
              color: 'var(--text-dark)',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
              position: 'relative'
            }}
          >
            <div className="tape-strip" style={{ width: '80px', top: '-10px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.25rem' }}>Sprint Completion Mug</span>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', fontWeight: 'bold' }}>{progressPercent}% full</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'center' }}>
              {/* Huge Coffee Mug SVG */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '90px', 
                  height: '110px', 
                  border: '4.5px solid var(--text-dark)', 
                  borderRadius: '6px 6px 20px 20px',
                  background: '#F8F3E8',
                  overflow: 'hidden'
                }}
              >
                {/* handle */}
                <div style={{ 
                  position: 'absolute', 
                  right: '-14px', 
                  top: '20px', 
                  width: '14px', 
                  height: '45px', 
                  border: '4.5px solid var(--text-dark)', 
                  borderLeft: 'none', 
                  borderRadius: '0 8px 8px 0' 
                }} />
                
                {/* Coffee fill layer */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${progressPercent}%`,
                    background: 'var(--accent-yellow)',
                    transition: 'height 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                />
                
                {/* Steam waves */}
                {progressPercent > 50 && (
                  <span style={{ position: 'absolute', top: '10px', left: '20px', fontSize: '1.2rem', color: 'var(--accent-purple)', animation: 'mascot-float 2s infinite' }}>♨</span>
                )}
              </div>

              <div style={{ flex: 1, fontFamily: 'var(--font-hand)', fontSize: '1.2rem' }}>
                {progressPercent === 100 ? (
                  <span style={{ color: 'var(--accent-mint)', fontWeight: 'bold' }}>★ Case closed! Maximum coffee velocity achieved!</span>
                ) : (
                  <span>Compile goals to fill your mug with hot espresso. Today's target: 100% full.</span>
                )}
              </div>
            </div>
          </div>

          {/* Today's Goals Sticky Notes */}
          <div>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.15rem', display: 'block', marginBottom: '14px' }}>
              Today's Case Goals
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {goals.map(g => (
                <div 
                  key={g.id}
                  className={`metric-sticky-card ${g.color}`}
                  onClick={() => handleGoalToggle(g.id)}
                  style={{
                    minHeight: 'auto',
                    padding: '14px 18px',
                    borderRadius: '2px',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.95)',
                    transform: `rotate(${(g.id % 2 === 0 ? -1 : 1.5)}deg)`,
                    cursor: 'pointer'
                  }}
                  data-tooltip={g.done ? 'Mark this goal as not done' : 'Mark this goal as done'}
                >
                  <div className="tape-strip" style={{ width: '40px', top: '-10px', left: '15px' }}></div>
                  <div style={{ color: 'var(--text-dark)' }}>
                    {g.done ? <CheckSquare size={16} /> : <Square size={16} />}
                  </div>
                  <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-dark)', textDecoration: g.done ? 'line-through' : 'none' }}>
                    {g.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Paper Calendar & Chalk Burndown Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Paper Calendar */}
          <div 
            style={{
              background: 'white',
              border: '2.5px solid var(--text-dark)',
              borderRadius: '6px',
              padding: '18px',
              color: 'var(--text-dark)',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
              position: 'relative'
            }}
          >
            {/* Coffee stain on calendar */}
            <div className="coffee-stain" style={{ bottom: '-20px', right: '-20px', width: '90px', height: '90px' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1.5px dashed rgba(0,0,0,0.15)', paddingBottom: '6px', marginBottom: '12px' }}>
              <CalendarIcon size={14} />
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1rem' }}>Sprint 02 Calendar notepad</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(0,0,0,0.4)' }}>{d}</span>
              ))}
              
              {calendarDays.map(d => (
                <div 
                  key={d.dayNum}
                  style={{
                    padding: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'bold',
                    background: d.isToday ? 'var(--accent-yellow)' : d.isSprintDay ? 'var(--paper-blue)' : 'transparent',
                    border: d.isToday ? '1.5px solid var(--text-dark)' : 'none',
                    borderRadius: '3px',
                    boxShadow: d.isToday ? '1px 1px 0px rgba(0,0,0,0.9)' : 'none',
                    transform: d.isToday ? 'rotate(-3deg)' : 'none'
                  }}
                >
                  {d.dayNum}
                </div>
              ))}
            </div>
          </div>

          {/* Chalk Burndown Chart */}
          <div 
            style={{
              background: '#0F0E13',
              border: '3px solid #201E2B',
              borderRadius: '8px',
              padding: '18px',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.95)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
              <Flame size={14} style={{ color: 'var(--accent-coral)' }} />
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1rem', color: 'var(--accent-yellow)' }}>Chalky Burndown Scribe</span>
            </div>

            {/* burndown chart backing */}
            <div style={{ position: 'relative', height: '140px', borderBottom: '2.5px solid rgba(255,255,255,0.15)', borderLeft: '2.5px solid rgba(255,255,255,0.15)', margin: '10px 10px 10px 20px' }}>
              <svg viewBox="0 0 400 150" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3">
                {/* Guideline (Chalk dotted line) */}
                <line x1="0" y1="20" x2="390" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="6 6" />
                
                {/* Chalk Solid burn down path */}
                <path 
                  d="M 0 20 Q 80 40 120 70 T 260 110 T 390 140" 
                  stroke="rgba(255,255,255,0.85)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <span style={{ position: 'absolute', left: '-25px', top: '10px', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', opacity: 0.5 }}>40h</span>
              <span style={{ position: 'absolute', left: '-25px', bottom: '2px', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', opacity: 0.5 }}>0h</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
