import React, { useState, useRef, useEffect } from 'react';
import {
  List, LayoutGrid, BarChart2, ShieldAlert, GitBranch,
  Search, Flame, HelpCircle, UserCheck, GitPullRequest, Star,
  Atom, Database, ShieldCheck, Layers, Bug, Sparkles, Calendar, Smartphone, Palette, Users, Settings,
  Coffee, Radio, Volume2, VolumeX, Music
} from 'lucide-react';
import { useBugs } from '../../context/BugContext';
import ReportProblemModal from '../ReportProblemModal';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Atom, Database, ShieldCheck, Layers, Flame, HelpCircle, UserCheck, GitPullRequest, Star
};

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const STATUS_COLORS: Record<string, string> = {
  UNCONFIRMED: 'var(--accent-coral)',
  CONFIRMED: 'var(--accent-purple)',
  IN_PROGRESS: 'var(--accent-yellow)',
  RESOLVED: 'var(--accent-mint)',
  VERIFIED: 'var(--accent-yellow)',
  CLOSED: 'var(--text-muted)',
};

// Bottom detective mascot profile card with XP progress
const DetectiveProfileCard = () => (
  <div style={{
    background: '#1A2233',
    border: '2.5px solid var(--accent-yellow)',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    transform: 'rotate(-1deg)',
    margin: '16px 12px 12px 12px'
  }}>
    {/* Detective Mascot mini drawing */}
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: '#F9F5E9',
      border: '1.5px solid #111827',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      <svg viewBox="0 0 100 80" width="24" height="18" fill="#111827" stroke="currentColor" strokeWidth="6">
        <path d="M 20 60 C 10 20, 90 20, 80 60" fill="#EF4444" />
        <circle cx="38" cy="40" r="3" />
        <circle cx="62" cy="40" r="3" />
        <path d="M 25 15 Q 15 5 5 10 M 75 15 Q 85 5 95 10" strokeWidth="4" />
      </svg>
    </div>

    {/* Text info and XP bar */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#FFFFFF' }}>Det. Triveni</span>
      <span style={{ fontSize: '0.68rem', color: '#FBBF24', fontFamily: 'var(--font-hand)', fontWeight: 'bold' }}>Lead Clue Collector</span>
      
      {/* XP Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
        <div style={{ flex: 1, height: '6px', background: '#111827', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '68%', height: '100%', background: '#FBBF24' }} />
        </div>
        <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#9CA3AF' }}>68% XP</span>
      </div>
    </div>
  </div>
);

export default function Sidebar() {
  const { activeView, dispatch, bugs, products, savedSearches, filterProduct, getMetrics } = useBugs();
  const metrics = getMetrics();

  const openCount = bugs.filter(b => !['CLOSED'].includes(b.status)).length;

  // Desk Radio state
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [radioMuted, setRadioMuted] = useState(false);
  const [typewriterEnabled, setTypewriterEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Caffeine Tracker state
  const [caffeineCount, setCaffeineCount] = useState(() => {
    return Number(localStorage.getItem('devtrace_caffeine') || '0');
  });

  const handleCaffeineIncrement = () => {
    const nextCount = caffeineCount + 1;
    setCaffeineCount(nextCount);
    localStorage.setItem('devtrace_caffeine', String(nextCount));
  };

  const handleCaffeineReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCaffeineCount(0);
    localStorage.setItem('devtrace_caffeine', '0');
  };

  // Keyboard clicks audio synthesis on keystrokes
  useEffect(() => {
    if (!typewriterEnabled) return;

    const playKeyClickSound = () => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 0.015; // 15ms short click
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime); // very quiet click
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start();
      } catch (e) {
        // Ignore audio contexts blocked or uninitialized
      }
    };

    const handleKeyDown = () => {
      playKeyClickSound();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [typewriterEnabled]);

  // Radio Audio playback management
  useEffect(() => {
    if (radioPlaying) {
      if (!audioRef.current) {
        // Steady royalty-free instrumental track
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audioRef.current.loop = true;
      }
      audioRef.current.muted = radioMuted;
      audioRef.current.play().catch(err => {
        console.warn('Playback blocked by browser auto-play policy:', err);
        setRadioPlaying(false);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [radioPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = radioMuted;
    }
  }, [radioMuted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const views = [
    { id: 'dashboard', icon: <Layers size={15} />, label: 'Overview', count: null, tooltip: 'See key bug metrics and stats at a glance' },
    { id: 'list', icon: <List size={15} />, label: 'Bugs', count: openCount, tooltip: 'Browse and manage every reported bug in a list' },
    { id: 'kanban', icon: <LayoutGrid size={15} />, label: 'Board', count: null, tooltip: 'Drag bugs across a Kanban board by status' },
    { id: 'graph', icon: <GitBranch size={15} />, label: 'Reports', count: null, tooltip: 'Explore how bugs and files depend on each other' },
    { id: 'analytics', icon: <BarChart2 size={15} />, label: 'Analytics', count: null, tooltip: 'Dive into bug trends and analytics charts' },
    { id: 'assistant', icon: <Sparkles size={15} />, label: 'AI Assistant', count: null, tooltip: 'Chat with the AI assistant for bug triage help' },
    { id: 'team', icon: <Users size={15} />, label: 'Team', count: null, tooltip: 'Manage team and collaboration' },
    { id: 'settings', icon: <Settings size={15} />, label: 'Settings', count: null, tooltip: 'Configure your workspace settings' },
    { id: 'sketch', icon: <Palette size={15} />, label: 'Doodle Canvas', count: null, tooltip: 'Sketch out ideas or architectural diagrams' },
    { id: 'github', icon: <GithubIcon size={15} />, label: 'GitHub Sync', count: null, tooltip: 'Sync bugs and issues with GitHub repositories' },
    { id: 'feedback', icon: <HelpCircle size={15} />, label: 'Report a Problem', count: null, tooltip: 'Submit feedback or report an issue with DevTrace' },
  ] as const;

  return (
    <aside className="sidebar" style={{ position: 'relative' }}>
      {/* Views */}
      <div className="sidebar-section-label" style={{ fontFamily: 'var(--font-hand)' }}>Workspace Views</div>
      {views.map(v => (
        <div
          key={v.id}
          className={`sidebar-item ${activeView === v.id ? 'active' : ''}`}
          data-tour-id={v.id === 'dashboard' ? 'tour-nav-overview' : v.id === 'assistant' ? 'tour-ai-assistant' : undefined}
          style={activeView === v.id ? { background: '#FBBF24', color: '#111827', fontWeight: 800, borderRadius: '4px', boxShadow: '2px 2px 0px rgba(0,0,0,0.95)' } : {}}
          onClick={() => {
            if (v.id === 'feedback') {
              setShowFeedbackModal(true);
            } else {
              dispatch({ type: 'SET_VIEW', payload: v.id as typeof activeView });
            }
          }}
          data-tooltip={v.tooltip}
          data-tooltip-pos="bottom"
        >
          <span className="sidebar-item-icon" style={activeView === v.id ? { color: '#111827' } : {}}>{v.icon}</span>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.label}>{v.label}</span>
          {v.count !== null && v.count !== undefined && v.count > 0 && (
            <span className="sidebar-item-count" style={
              (v.id as string) === 'security' ? { background: 'rgba(255, 123, 107, 0.2)', color: 'var(--accent-coral)' } : {}
            }>{v.count}</span>
          )}
        </div>
      ))}

      <div className="sidebar-divider" />

      {/* Products */}
      <div className="sidebar-section-label">Components</div>
      <div
        className={`product-chip ${!filterProduct ? 'active' : ''}`}
        onClick={() => dispatch({ type: 'SET_FILTER_PRODUCT', payload: null })}
        data-tour-id="tour-product-filters"
        data-tooltip="Show bugs from all projects"
        data-tooltip-pos="bottom"
      >
        <div className="product-chip-icon" style={{ background: '#252431', color: 'var(--text-muted)' }}>
          <Bug size={12} />
        </div>
        All Projects
      </div>
      {products.map(p => {
        const Icon = ICON_MAP[p.icon] || Atom;
        const count = bugs.filter(b => b.product === p.name && b.status !== 'CLOSED').length;
        return (
          <div
            key={p.id}
            className={`product-chip ${filterProduct === p.name ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_FILTER_PRODUCT', payload: filterProduct === p.name ? null : p.name })}
            data-tooltip={`Filter bugs to the "${p.name}" project`}
            data-tooltip-pos="bottom"
          >
            <div
              className="product-chip-icon"
              style={filterProduct === p.name ? {} : { color: 'var(--accent-purple)' }}
            >
              <Icon size={12} />
            </div>
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.name}>{p.name}</span>
            {count > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>{count}</span>}
          </div>
        );
      })}

      <div className="sidebar-divider" />

      {/* Saved Searches */}
      <div className="sidebar-section-label font-hand">Ink Queries</div>
      {savedSearches.map(s => {
        const Icon = ICON_MAP[s.icon || 'Star'] || Star;
        return (
          <div
            key={s.id}
            className="sidebar-item"
            onClick={() => {
              if (s.queryString) dispatch({ type: 'SET_SEARCH_QUERY', payload: s.queryString });
              dispatch({ type: 'SET_VIEW', payload: 'list' });
            }}
            data-tooltip={s.description || `Run the saved search "${s.name}"`}
            data-tooltip-pos="bottom"
          >
            <span className="sidebar-item-icon"><Icon size={14} /></span>
            <span style={{ flex: 1, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.name}>{s.name}</span>
          </div>
        );
      })}

      <div className="sidebar-divider" />

      {/* Status quick filters */}
      <div className="sidebar-section-label">Quick Marks</div>
      {Object.entries(STATUS_COLORS).map(([status, color]) => {
        const count = bugs.filter(b => b.status === status).length;
        if (count === 0) return null;
        return (
          <div
            key={status}
            className="sidebar-item"
            onClick={() => {
              dispatch({ type: 'SET_FILTER_STATUS', payload: status as any });
              dispatch({ type: 'SET_VIEW', payload: 'list' });
            }}
            data-tooltip={`Show only ${status.replace('_', ' ').toLowerCase()} bugs`}
            data-tooltip-pos="bottom"
          >
            <span
              className="sidebar-item-icon"
              style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0, margin: '3px 4px' }}
            />
            <span style={{ flex: 1, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={status.replace('_', ' ')}>{status.replace('_', ' ')}</span>
            <span className="sidebar-item-count">{count}</span>
          </div>
        );
      })}
      
      <div className="sidebar-divider" />

      {/* Retro Desk Radio Widget */}
      <div style={{
        margin: '12px 14px',
        padding: '12px 14px',
        background: '#181A20',
        border: '2px solid var(--text-dark)',
        borderRadius: '6px',
        boxShadow: '3px 3px 0px rgba(0,0,0,0.95)',
        transform: 'rotate(-0.8deg)',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Radio size={14} style={{ color: radioPlaying ? 'var(--accent-yellow)' : 'var(--text-muted)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Precinct Dispatch Radio
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setRadioPlaying(!radioPlaying)}
            style={{
              background: radioPlaying ? 'var(--accent-yellow)' : 'transparent',
              color: radioPlaying ? 'var(--text-dark)' : '#FFFFFF',
              border: '1.5px solid var(--text-dark)',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '0.68rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {radioPlaying ? 'STOP BEATS' : 'PLAY BEATS'}
          </button>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setRadioMuted(!radioMuted)}
              data-tooltip={radioMuted ? 'Unmute radio' : 'Mute radio'}
              style={{
                background: 'transparent',
                border: 'none',
                color: radioMuted ? 'var(--accent-coral)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              {radioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={() => setTypewriterEnabled(!typewriterEnabled)}
              data-tooltip="Toggle clicky mechanical keyboard keys"
              style={{
                background: 'transparent',
                border: 'none',
                color: typewriterEnabled ? 'var(--accent-mint)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <Music size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Caffeine Tracker Widget */}
      <div 
        onClick={handleCaffeineIncrement}
        style={{
          margin: '12px 14px 20px',
          padding: '12px 14px',
          background: 'var(--paper-yellow)',
          color: 'var(--text-dark)',
          border: '2px solid var(--text-dark)',
          borderRadius: '6px',
          boxShadow: '3px 3px 0px rgba(0,0,0,0.95)',
          transform: 'rotate(0.5deg)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        {/* Coffee level filled graphic */}
        <div style={{ width: '28px', height: '28px', position: 'relative' }}>
          <Coffee size={28} style={{ color: 'var(--text-dark)' }} />
          <div style={{
            position: 'absolute',
            bottom: '4px',
            left: '5px',
            width: '18px',
            height: `${Math.min((caffeineCount % 5) * 4, 18)}px`,
            background: '#5C3A21',
            borderRadius: '1px',
            opacity: 0.8,
            transition: 'height 0.3s ease'
          }} />
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.04em' }}>
            Inspector Fuel Levels
          </span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {caffeineCount === 0 ? 'Need coffee...' : `${caffeineCount} Cups Logged ☕`}
          </span>
        </div>
        
        {caffeineCount > 0 && (
          <span 
            onClick={handleCaffeineReset}
            style={{ fontSize: '0.62rem', fontWeight: 900, textDecoration: 'underline', color: 'var(--accent-coral)' }}
          >
            RESET
          </span>
        )}
      </div>
      
      {/* Detective Profile Card */}
      <DetectiveProfileCard />

      {showFeedbackModal && (
        <ReportProblemModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </aside>
  );
}
