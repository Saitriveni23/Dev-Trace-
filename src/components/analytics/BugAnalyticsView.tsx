import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Sparkles, Trophy, Flame, HelpCircle, Thermometer, Filter, Star, AlertTriangle, ShieldAlert } from 'lucide-react';
import { CvssChip } from '../common/Badge';

export default function BugAnalyticsView() {
  const { bugs, products, filterProduct, dispatch } = useBugs();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Filter logic
  const filteredBugs = bugs.filter(b => {
    const matchProd = !filterProduct || b.product === filterProduct;
    const matchSev = selectedSeverity === 'ALL' || b.severity === selectedSeverity;
    return matchProd && matchSev;
  });

  // Calculate statistics metrics
  const openBugsCount = filteredBugs.filter(b => b.status !== 'CLOSED').length;
  const criticalCount = filteredBugs.filter(b => ['BLOCKER', 'CRITICAL', 'MAJOR'].includes(b.severity)).length;
  
  // Top modules
  const moduleCounts = filteredBugs.reduce((acc, b) => {
    acc[b.component] = (acc[b.component] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedModules = Object.entries(moduleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Bug Weather Indicator
  const getWeatherStatus = () => {
    if (criticalCount > 5) return { label: 'Thunderstorm ⛈', desc: 'Heavy blockers deluge, grab your boots!' };
    if (openBugsCount > 8) return { label: 'Partly Cloudy ⛅', desc: 'Moderate precipitation of glitches.' };
    return { label: 'Sunny ☀️', desc: 'Desk workspace is clear, clean sky!' };
  };
  const weather = getWeatherStatus();

  // Chaos to Calm Meter calculation
  const totalBugs = filteredBugs.length;
  const chaosPercentage = totalBugs > 0 ? Math.min((openBugsCount / totalBugs) * 100, 100) : 0;

  return (
    <div className="bug-analytics-page" style={{ background: 'var(--bg-notebook)', minHeight: '100vh', padding: '30px', color: 'var(--text-white)' }}>
      
      {/* View Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2.5px solid #201E2B', paddingBottom: '16px', marginBottom: '24px' }}>
        <span className="view-title">BugStudio Analytics & Scribes</span>
        <span className="view-count">{filteredBugs.length} records processed</span>
      </div>

      {/* Sticky Note Filters row */}
      <div 
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}
      >
        {/* Pinned Sticky note for Project selection */}
        <div 
          className="metric-sticky-card note-yellow"
          style={{
            minHeight: 'auto',
            padding: '12px 18px',
            transform: 'rotate(-1.5deg)',
            flexDirection: 'row',
            gap: '12px',
            boxShadow: '3px 3px 0px rgba(0,0,0,0.95)',
            alignItems: 'center'
          }}
        >
          <div className="tape-strip" style={{ width: '40px', top: '-8px' }}></div>
          <Filter size={14} style={{ color: 'var(--text-dark)' }} />
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.85rem', color: 'var(--text-dark)' }}>Project:</span>
          <select 
            value={filterProduct || ''} 
            onChange={e => dispatch({ type: 'SET_FILTER_PRODUCT', payload: e.target.value || null })}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1.5px solid var(--text-dark)',
              fontFamily: 'var(--font-hand)',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">All Projects</option>
            {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>

        {/* Pinned Sticky note for Severity selection */}
        <div 
          className="metric-sticky-card note-orange"
          style={{
            minHeight: 'auto',
            padding: '12px 18px',
            transform: 'rotate(2deg)',
            flexDirection: 'row',
            gap: '12px',
            boxShadow: '3px 3px 0px rgba(0,0,0,0.95)',
            alignItems: 'center'
          }}
        >
          <div className="tape-strip" style={{ width: '40px', top: '-8px' }}></div>
          <ShieldAlert size={14} style={{ color: 'var(--text-dark)' }} />
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.85rem', color: 'var(--text-dark)' }}>Severity:</span>
          <select 
            value={selectedSeverity} 
            onChange={e => setSelectedSeverity(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1.5px solid var(--text-dark)',
              fontFamily: 'var(--font-hand)',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="ALL">All Levels</option>
            <option value="BLOCKER">Blocker</option>
            <option value="CRITICAL">Critical</option>
            <option value="MAJOR">Major</option>
            <option value="NORMAL">Normal</option>
            <option value="MINOR">Minor</option>
          </select>
        </div>
      </div>

      {/* Grid of cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}
      >
        {/* Card 1: Resolution time */}
        <div className="wins-box" style={{ transform: 'rotate(-1.5deg)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.95rem' }}>Mean Resolution Time</span>
          <div style={{ fontFamily: 'var(--font-marker)', fontSize: '2.2rem', marginTop: '6px' }}>4.8 hrs</div>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', opacity: 0.7 }}>Avg file to merge fix</span>
        </div>

        {/* Card 2: Critical bugs */}
        <div className="museum-box" style={{ transform: 'rotate(2deg)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.95rem' }}>Alert Glitch Count</span>
          <div style={{ fontFamily: 'var(--font-marker)', fontSize: '2.2rem', marginTop: '6px', color: 'var(--accent-coral)' }}>{criticalCount}</div>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', opacity: 0.7 }}>Blockers / Criticals</span>
        </div>

        {/* Card 3: Top modules */}
        <div className="mood-board-box" style={{ transform: 'rotate(-1deg)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px 18px' }}>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.95rem' }}>Hotspot Modules</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
            {sortedModules.length > 0 ? sortedModules.map(([name, count]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-hand)', fontWeight: 'bold' }}>
                <span>• {name.split(' ')[0]}</span>
                <span>{count} cases</span>
              </div>
            )) : (
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', opacity: 0.5 }}>All clear</span>
            )}
          </div>
        </div>

        {/* Card 4: Developer XP badge */}
        <div 
          style={{
            background: 'white',
            border: '2.5px solid var(--text-dark)',
            borderRadius: '6px',
            padding: '16px',
            color: 'var(--text-dark)',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
            transform: 'rotate(2deg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Trophy size={16} style={{ color: 'var(--accent-yellow)' }} />
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.95rem' }}>Developer XP Log</span>
          </div>
          <div style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem' }}>LEVEL 14</div>
          <div style={{ width: '100%', height: '8px', border: '1.5px solid var(--text-dark)', background: '#E2E8F0', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: 'var(--accent-purple)' }}></div>
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(0,0,0,0.5)', marginTop: '4px', display: 'block' }}>700 / 1000 XP to Level Up</span>
        </div>
      </div>

      {/* Charts Layout split */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '24px'
        }}
      >
        {/* Left column: Marker line chart & Hand-colored Pie Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Line Chart */}
          <div className="heatmap-paper" style={{ color: 'var(--text-dark)' }}>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem', display: 'block', marginBottom: '14px' }}>
              Marker-Drawn Burn Down Trail
            </span>
            
            <div style={{ position: 'relative', height: '150px', borderBottom: '3.5px solid var(--text-dark)', borderLeft: '3.5px solid var(--text-dark)', margin: '10px 10px 20px 20px' }}>
              <svg viewBox="0 0 400 150" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="4">
                {/* Sketchy Line path */}
                <path 
                  d="M 10 20 L 90 45 L 180 85 L 270 95 L 390 135" 
                  stroke="var(--accent-purple)" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="20" r="5" fill="var(--accent-coral)" stroke="var(--text-dark)" strokeWidth="2" />
                <circle cx="90" cy="45" r="5" fill="var(--accent-coral)" stroke="var(--text-dark)" strokeWidth="2" />
                <circle cx="180" cy="85" r="5" fill="var(--accent-coral)" stroke="var(--text-dark)" strokeWidth="2" />
                <circle cx="270" cy="95" r="5" fill="var(--accent-coral)" stroke="var(--text-dark)" strokeWidth="2" />
                <circle cx="390" cy="135" r="5" fill="var(--accent-coral)" stroke="var(--text-dark)" strokeWidth="2" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, padding: '0 10px' }}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
          </div>

          {/* Hand Colored Pie Chart */}
          <div className="heatmap-paper" style={{ color: 'var(--text-dark)', position: 'relative' }}>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem', display: 'block', marginBottom: '14px' }}>
              Hand-Colored Severity Share
            </span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', justifyContent: 'center' }}>
              {/* Circular SVG simulating colored sections */}
              <svg viewBox="0 0 100 100" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                {/* Section 1 (Blocker - Coral) */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-coral)" strokeWidth="20" strokeDasharray="63 251" />
                {/* Section 2 (Major - Purple) */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-purple)" strokeWidth="20" strokeDasharray="100 251" strokeDashoffset="-63" />
                {/* Section 3 (Normal - Mint) */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-mint)" strokeWidth="20" strokeDasharray="88 251" strokeDashoffset="-163" />
              </svg>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-hand)', fontSize: '1.15rem', fontWeight: 'bold' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--accent-coral)', border: '1px solid var(--text-dark)' }}></div>
                  <span>Blockers (25%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--accent-purple)', border: '1px solid var(--text-dark)' }}></div>
                  <span>Majors (40%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--accent-mint)', border: '1px solid var(--text-dark)' }}></div>
                  <span>Normals (35%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Heatmap, Productivity, Weather, Chaos meter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Weather & Chaos meter split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Bug Weather widget */}
            <div 
              style={{
                background: 'white',
                border: '2.5px solid var(--text-dark)',
                borderRadius: '6px',
                padding: '16px',
                color: 'var(--text-dark)',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
                transform: 'rotate(-2deg)'
              }}
            >
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
                Glitch Weather
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-purple)' }}>{weather.label}</div>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'rgba(0,0,0,0.6)', marginTop: '4px', lineHeight: 1.2 }}>
                {weather.desc}
              </p>
            </div>

            {/* Chaos to Calm Meter */}
            <div 
              style={{
                background: 'white',
                border: '2.5px solid var(--text-dark)',
                borderRadius: '6px',
                padding: '16px',
                color: 'var(--text-dark)',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
                transform: 'rotate(1.5deg)'
              }}
            >
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
                Calm to Chaos Dial
              </span>
              <div style={{ position: 'relative', width: '100px', height: '55px', margin: '0 auto', overflow: 'hidden' }}>
                {/* Curved semi-circle background */}
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '10px solid #E2E8F0', borderTopColor: 'var(--accent-coral)', borderRightColor: 'var(--accent-yellow)', transform: 'rotate(-45deg)' }} />
                
                {/* Needle pointer */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50px',
                  width: '2px',
                  height: '42px',
                  background: 'var(--text-dark)',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${(chaosPercentage * 1.8) - 90}deg)`,
                  transition: 'transform 0.5s ease'
                }} />
              </div>
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 900, marginTop: '4px' }}>
                CHAOS: {Math.round(chaosPercentage)}%
              </div>
            </div>

          </div>

          {/* Coffee productivity graph */}
          <div className="heatmap-paper" style={{ color: 'var(--text-dark)' }}>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem', display: 'block', marginBottom: '14px' }}>
              Caffeine Productivity Ratio (Cups vs Fixes)
            </span>
            
            <div style={{ position: 'relative', height: '140px', borderBottom: '3px solid var(--text-dark)', borderLeft: '3px solid var(--text-dark)', margin: '10px 10px 20px 20px' }}>
              {/* Scatter plots or hand drawn bars */}
              <div style={{ display: 'flex', height: '100%', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '16px', height: '40px', background: 'var(--accent-yellow)', border: '2px solid var(--text-dark)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '4px' }}>1 Cup</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '16px', height: '75px', background: 'var(--accent-purple)', border: '2px solid var(--text-dark)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '4px' }}>3 Cups</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '16px', height: '115px', background: 'var(--accent-coral)', border: '2px solid var(--text-dark)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '4px' }}>5 Cups</span>
                </div>
              </div>
              <span style={{ position: 'absolute', left: '-25px', top: '10px', fontSize: '0.65rem', fontWeight: 900 }}>12 Fix</span>
              <span style={{ position: 'absolute', left: '-25px', top: '65px', fontSize: '0.65rem', fontWeight: 900 }}>6 Fix</span>
            </div>
          </div>

          {/* Pixel Heatmap */}
          <div className="heatmap-paper" style={{ color: 'var(--text-dark)' }}>
            <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem', display: 'block', marginBottom: '12px' }}>
              Stability Index (Pixel Matrix)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px' }}>
              {Array.from({ length: 36 }).map((_, idx) => {
                const health = Math.random();
                const bg = health > 0.7 ? 'var(--accent-mint)' : health > 0.4 ? 'var(--accent-yellow)' : 'rgba(0,0,0,0.05)';
                return (
                  <div 
                    key={idx}
                    style={{
                      height: '18px',
                      background: bg,
                      border: '1.5px solid var(--text-dark)',
                      boxShadow: bg !== 'rgba(0,0,0,0.05)' ? '1.5px 1.5px 0px rgba(0,0,0,0.9)' : 'none',
                      borderRadius: '2px'
                    }}
                    title={`Index ${idx}: ${health > 0.4 ? 'Stable' : 'Volatile'}`}
                  />
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
