import React, { useState, useEffect, useRef } from 'react';
import { useBugs } from '../../context/BugContext';
import {
  BarChart2, TrendingDown, Clock, ShieldAlert, Zap, Coffee,
  Sparkles, Smile, Bug, CheckSquare, Square, Search, Bell, Sun, Moon,
  Volume2, VolumeX, CloudRain, Keyboard, BookOpen, ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Funny named bug slides for the Bug Museum
const MUSEUM_BUGS = [
  { id: 'BM-01', name: 'The Infinite Spinner', desc: 'A loading state that survived 4 product managers.', stamp: 'LOST SOUL' },
  { id: 'BM-02', name: 'Phantom Scroll', desc: 'Page scrolls to bottom whenever developer takes a sip of coffee.', stamp: 'HAUNTED' },
  { id: 'BM-03', name: 'Ghost Event Listener', desc: 'Clicking anywhere triggers console log "hello".', stamp: 'EERIE' },
  { id: 'BM-04', name: 'The CSS Float Leak', desc: 'Div floated so far left it appears on adjacent developer screen.', stamp: 'ESCAPE' },
];

// Offline Synthesized Ambient audio controller using Web Audio API
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private lofiTimer: any = null;
  private typingTimer: any = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Rain sound generator (Low passed white noise)
  public startRain() {
    this.init();
    if (!this.ctx) return;
    if (this.rainSource) return;

    const bufferSize = 3 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = noiseBuffer;
    this.rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    this.rainSource.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);
    
    this.rainSource.start();
  }

  public stopRain() {
    if (this.rainSource) {
      try {
        this.rainSource.stop();
      } catch (e) {}
      this.rainSource.disconnect();
      this.rainSource = null;
    }
  }

  // Lo-Fi repeating beat loop
  public startLofi() {
    this.init();
    if (!this.ctx) return;

    let step = 0;
    const playBeat = () => {
      if (!this.ctx) return;

      // Low bass A note
      if (step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      }

      // Soft high hats noise burst
      if (step % 2 === 1) {
        const noiseBuffer = this.ctx.createBuffer(1, 0.08 * this.ctx.sampleRate, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(8000, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noiseSource.start();
      }

      step = (step + 1) % 4;
      this.lofiTimer = setTimeout(playBeat, 700); // Relaxed lofi pace
    };

    playBeat();
  }

  public stopLofi() {
    if (this.lofiTimer) {
      clearTimeout(this.lofiTimer);
      this.lofiTimer = null;
    }
  }

  // Keyboard clicks loop
  public startTyping() {
    this.init();
    if (!this.ctx) return;

    const playClick = () => {
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 + Math.random() * 150, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);

      this.typingTimer = setTimeout(playClick, 150 + Math.random() * 250);
    };

    playClick();
  }

  public stopTyping() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  // Cleanup all audio contexts
  public destroy() {
    this.stopRain();
    this.stopLofi();
    this.stopTyping();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export default function MetricsDashboard() {
  const { bugs, getMetrics, showToast } = useBugs();
  const metrics = getMetrics();

  // State hooks for interactive widgets
  const [coffeeCups, setCoffeeCups] = useState(3);
  const [devMood, setDevMood] = useState('Energetic ⚡');
  const [toggleDark, setToggleDark] = useState(true);
  const [museumIndex, setMuseumIndex] = useState(0);
  const [howToOpen, setHowToOpen] = useState(true);

  // Ambient sound state toggles
  const [isLofi, setIsLofi] = useState(false);
  const [isRain, setIsRain] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const synthRef = useRef<AmbientSynth | null>(null);

  useEffect(() => {
    synthRef.current = new AmbientSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.destroy();
      }
    };
  }, []);

  const toggleLofi = () => {
    if (!synthRef.current) return;
    synthRef.current.init();
    if (isLofi) {
      synthRef.current.stopLofi();
      setIsLofi(false);
      showToast('Lofi beats paused', 'info');
    } else {
      synthRef.current.startLofi();
      setIsLofi(true);
      showToast('Lofi beats streaming offline 🎵', 'success');
    }
  };

  const toggleRain = () => {
    if (!synthRef.current) return;
    synthRef.current.init();
    if (isRain) {
      synthRef.current.stopRain();
      setIsRain(false);
      showToast('Rain sounds paused', 'info');
    } else {
      synthRef.current.startRain();
      setIsRain(true);
      showToast('Rainfall noise activated 🌧️', 'success');
    }
  };

  const toggleTyping = () => {
    if (!synthRef.current) return;
    synthRef.current.init();
    if (isTyping) {
      synthRef.current.stopTyping();
      setIsTyping(false);
      showToast('Clicky typing simulator paused', 'info');
    } else {
      synthRef.current.startTyping();
      setIsTyping(true);
      showToast('Keyboard keypad click-clacks toggled ⌨️', 'success');
    }
  };

  // Today's priorities checkbox list
  const [priorities, setPriorities] = useState([
    { id: 1, text: 'Fix connection timeout check loops', done: true },
    { id: 2, text: 'Refactor phantom scroll offset glitches', done: false },
    { id: 3, text: 'Clear coffee stains off notebook margin', done: true },
    { id: 4, text: 'Clean CSS float leak indexes', done: false },
  ]);

  const handlePriorityToggle = (id: number) => {
    setPriorities(prev => prev.map(p => {
      if (p.id === id) {
        const nextDone = !p.done;
        if (nextDone) {
          confetti({
            particleCount: 30,
            spread: 30,
            colors: ['#FFD84D', '#8B5CF6']
          });
          showToast('Priority goal check completed! 🏆', 'success');
        }
        return { ...p, done: nextDone };
      }
      return p;
    }));
  };

  const handleCoffeeClick = () => {
    if (coffeeCups >= 5) {
      showToast('Maximum caffeine velocity achieved! ☕⚡', 'warning');
      setCoffeeCups(0);
      return;
    }
    const nextCups = coffeeCups + 1;
    setCoffeeCups(nextCups);
    confetti({
      particleCount: 40,
      spread: 40,
      colors: ['#FF7B6B', '#FFD84D']
    });
    showToast(`Coffee consumed! Mug level: ${nextCups}/5`, 'info');
  };

  return (
    <div 
      className="metrics-dashboard" 
      style={{ 
        background: 'var(--bg-notebook)', 
        minHeight: '100vh', 
        padding: '30px',
        color: 'var(--text-white)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >

      {/* HOW TO USE: onboarding guide, collapsible */}
      <div className="howto-section">
        <div className="howto-header" onClick={() => setHowToOpen(o => !o)}>
          <div className="howto-header-title">
            <BookOpen size={18} />
            <span>How to Use DevTrace</span>
          </div>
          <button
            className={`howto-toggle-btn ${howToOpen ? 'open' : ''}`}
            onClick={(e) => { e.stopPropagation(); setHowToOpen(o => !o); }}
            data-tooltip={howToOpen ? 'Collapse this guide' : 'Expand this guide'}
            data-tooltip-pos="left"
            aria-label={howToOpen ? 'Collapse how-to guide' : 'Expand how-to guide'}
          >
            <ChevronDown size={16} />
          </button>
        </div>
        {howToOpen && (
          <div className="howto-body">
            <div className="howto-step">
              <div className="howto-step-num">STEP 1</div>
              <div className="howto-step-title">Report a bug</div>
              <div className="howto-step-desc">Click "New Sticker" in the top navbar (or press ⌘N / Ctrl+N) to file a new bug report.</div>
            </div>
            <div className="howto-step">
              <div className="howto-step-num">STEP 2</div>
              <div className="howto-step-title">Track your work</div>
              <div className="howto-step-desc">Use the sidebar to switch between the Bugs list, Kanban Board, and Reports views.</div>
            </div>
            <div className="howto-step">
              <div className="howto-step-num">STEP 3</div>
              <div className="howto-step-title">Find anything fast</div>
              <div className="howto-step-desc">Search bugs from the navbar, or open the command palette with ⌘K / Ctrl+K to jump to any view or filter.</div>
            </div>
            <div className="howto-step">
              <div className="howto-step-num">STEP 4</div>
              <div className="howto-step-title">Dig into insights</div>
              <div className="howto-step-desc">Visit Analytics for trend charts, or the AI Assistant for triage suggestions on tricky bugs.</div>
            </div>
            <div className="howto-step">
              <div className="howto-step-num">STEP 5</div>
              <div className="howto-step-title">Collaborate with your team</div>
              <div className="howto-step-desc">Check Team to see teammates, and GitHub Sync to link bugs to commits and pull requests.</div>
            </div>
            <div className="howto-step">
              <div className="howto-step-num">TIP</div>
              <div className="howto-step-title">Hover for help</div>
              <div className="howto-step-desc">Hover over any button across the app to see a quick tooltip explaining what it does.</div>
            </div>
          </div>
        )}
      </div>

      {/* ROW 1: Top Bar (Search, Notifications, Theme, Profile) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
          gap: '16px',
          alignItems: 'center',
          background: '#17161F',
          padding: '14px 20px',
          borderRadius: '8px',
          border: '2.5px solid var(--text-dark)',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.95)'
        }}
      >
        {/* Command Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--accent-yellow)', paddingBottom: '2px' }}>
          <Search size={16} style={{ color: 'var(--accent-yellow)' }} />
          <input 
            type="text" 
            placeholder="Search notebook cases..." 
            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontFamily: 'var(--font-hand)', fontSize: '1.2rem', width: '100%' }}
          />
        </div>

        {/* Notifications Pinned like paper clip */}
        <div
          onClick={() => showToast('No new case alerts pins!', 'info')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.1rem' }}
          data-tooltip="Check your notifications"
          data-tooltip-pos="bottom"
        >
          <Bell size={16} style={{ color: 'var(--accent-purple)' }} />
          <span>Notifications (0)</span>
        </div>

        {/* Theme switch */}
        <div
          onClick={() => setToggleDark(!toggleDark)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.1rem' }}
          data-tooltip="Toggle between the dark and light notebook cover"
          data-tooltip-pos="bottom"
        >
          {toggleDark ? <Moon size={16} style={{ color: 'var(--accent-yellow)' }} /> : <Sun size={16} style={{ color: 'var(--accent-yellow)' }} />}
          <span>{toggleDark ? 'Dark Cover' : 'Light Cover'}</span>
        </div>

        {/* Polaroid Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', color: 'var(--text-dark)', padding: '6px 12px 10px', borderRadius: '4px', transform: 'rotate(-1.5deg)', boxShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent-purple)', border: '1.5px solid var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.62rem' }}>D</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>Det. Alex</span>
            <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>Lead Scribe</span>
          </div>
        </div>

      </div>

      {/* ROW 2: Four colorful sticky statistic cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }}
      >
        <div className="metric-sticky-card note-yellow" style={{ transform: 'rotate(-2deg)' }}>
          <div className="tape-strip" style={{ width: '60px', top: '-10px' }}></div>
          <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }}>open glitches</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '4px 0' }}>{metrics.openBugs}</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'rgba(0,0,0,0.6)' }}>.. crawling trails ..</span>
        </div>

        <div className="metric-sticky-card note-orange" style={{ transform: 'rotate(1.5deg)' }}>
          <div className="tape-strip" style={{ width: '60px', top: '-10px' }}></div>
          <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }}>resolved cases</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '4px 0' }}>{metrics.resolvedBugs}</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'rgba(0,0,0,0.6)' }}>.. stamps issued today ..</span>
        </div>

        <div className="metric-sticky-card note-purple" style={{ transform: 'rotate(-1deg)' }}>
          <div className="tape-strip" style={{ width: '60px', top: '-10px' }}></div>
          <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }}>AI suggestions</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '4px 0' }}>{metrics.criticalBlockers}</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'rgba(0,0,0,0.6)' }}>.. robots clue sifting ..</span>
        </div>

        <div className="metric-sticky-card note-blue" style={{ transform: 'rotate(2.5deg)' }}>
          <div className="tape-strip" style={{ width: '60px', top: '-10px' }}></div>
          <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }}>Sprint velocity</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '4px 0' }}>{metrics.securityEmbargoes}%</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'rgba(0,0,0,0.6)' }}>.. target goals speed ..</span>
        </div>
      </div>

      {/* ROW 3: Large analytics graph, AI Insight, Sprint donut, Recent activity */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '20px'
        }}
      >
        {/* Large Analytics Graph */}
        <div style={{ background: '#17161F', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '16px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-yellow)', marginBottom: '12px' }}>Burn down chart</div>
          <div style={{ height: '140px', borderBottom: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <svg viewBox="0 0 300 120" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M 10 10 L 80 40 L 150 55 L 220 85 L 290 115" stroke="var(--accent-coral)" strokeDasharray="3 3" />
              <path d="M 10 10 Q 90 20 150 70 T 290 110" stroke="var(--accent-mint)" strokeWidth="4" />
            </svg>
          </div>
        </div>

        {/* AI Insight sticky note */}
        <div className="metric-sticky-card note-pink" style={{ transform: 'rotate(-2.5deg)' }}>
          <div className="tape-strip" style={{ width: '70px', top: '-10px' }}></div>
          <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }}>AI clue insight</span>
          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 'bold', margin: '10px 0 0 0', lineHeight: 1.3 }}>
            "Connection block timeouts share an 88% stack signature. Swipable connections are likely leaking pool allocations."
          </p>
        </div>

        {/* Sprint Donut & Recent Activity */}
        <div style={{ background: '#17161F', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" width="100%" height="100%">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent-mint)" strokeWidth="4" strokeDasharray="80 20" />
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', fontWeight: 'bold' }}>Sprint: 80% complete</div>
          </div>

          <div style={{ borderTop: '1.5px dashed rgba(255,255,255,0.1)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>recent activity timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', opacity: 0.8 }}>
              <div>[10:45 AM] closed BS-108 scroll failure</div>
              <div>[09:12 AM] filed BS-114 connection blockages</div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4: Kanban board preview, Bug heatmap, Developer mood board, Today's priorities */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '20px'
        }}
      >
        {/* Kanban Board Preview */}
        <div className="bg-cork" style={{ padding: '16px', borderRadius: '6px', border: '3px solid var(--text-dark)', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', marginBottom: '12px' }}>Kanban columns</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-yellow)', marginBottom: '8px' }}>DOING (2)</div>
              <div style={{ background: 'var(--paper-yellow)', color: 'var(--text-dark)', padding: '6px', fontSize: '0.75rem', borderRadius: '2px', fontWeight: 'bold', transform: 'rotate(-2deg)' }}>BS-114 connection</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-mint)', marginBottom: '8px' }}>DONE (14)</div>
              <div style={{ background: 'var(--paper-blue)', color: 'var(--text-dark)', padding: '6px', fontSize: '0.75rem', borderRadius: '2px', fontWeight: 'bold', transform: 'rotate(1.5deg)' }}>BS-108 scroll solved</div>
            </div>
          </div>
        </div>

        {/* Bug Heatmap (Pixel blocks) */}
        <div style={{ background: '#17161F', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '16px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-purple)', marginBottom: '12px' }}>glitch heatmap</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} style={{ width: '100%', height: '14px', background: i % 3 === 0 ? 'var(--accent-yellow)' : i % 5 === 0 ? 'var(--accent-coral)' : 'var(--accent-mint)', borderRadius: '2px' }} />
            ))}
          </div>
        </div>

        {/* Developer Mood Board */}
        <div style={{ background: '#17161F', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '16px', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', gap: '10px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-coral)' }}>mood stamp</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
            {['Energetic ⚡', 'Coffee High ☕', 'Zzz Sleepy 💤'].map(mood => (
              <button
                key={mood}
                onClick={() => { setDevMood(mood); showToast(`Mood updated to ${mood}!`, 'success'); }}
                className={`mood-sticker ${devMood === mood ? 'active' : ''}`}
                data-tooltip={`Set your mood stamp to "${mood}"`}
                style={{
                  fontSize: '0.72rem',
                  background: devMood === mood ? 'var(--accent-yellow)' : 'var(--paper-beige)',
                  color: 'var(--text-dark)',
                  transform: `rotate(${(mood.length % 2 === 0 ? -2 : 1.5)}deg)`
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Priorities Checklist */}
        <div style={{ background: '#17161F', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-yellow)' }}>today priorities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {priorities.map(p => (
              <div 
                key={p.id}
                onClick={() => handlePriorityToggle(p.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '0.98rem' }}
                data-tooltip={p.done ? 'Mark this priority as not done' : 'Mark this priority as done'}
              >
                <span style={{ color: 'var(--accent-yellow)' }}>{p.done ? <CheckSquare size={13} /> : <Square size={13} />}</span>
                <span style={{ textDecoration: p.done ? 'line-through' : 'none', opacity: p.done ? 0.5 : 1 }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 5: GitHub activity, Bug museum, Productivity coffee meter, Team collaboration */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }}
      >
        {/* GitHub Activity */}
        <div style={{ background: '#17161F', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '16px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-mint)', marginBottom: '8px' }}>git activity stamps</div>
          <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
            {[2, 4, 0, 8, 3, 5, 2, 6, 4].map((commits, idx) => (
              <div 
                key={idx} 
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  background: commits === 0 ? 'rgba(255,255,255,0.04)' : commits < 4 ? '#2E6B3E' : '#4EAD5E', 
                  borderRadius: '2px' 
                }} 
              />
            ))}
          </div>
        </div>

        {/* Bug Museum */}
        <div
          onClick={() => setMuseumIndex(idx => (idx + 1) % MUSEUM_BUGS.length)}
          style={{
            background: 'white',
            color: 'var(--text-dark)',
            border: '2.5px solid var(--text-dark)',
            borderRadius: '6px',
            padding: '12px 14px',
            position: 'relative',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
            transform: 'rotate(1.5deg)',
            cursor: 'pointer'
          }}
          data-tooltip="Click to cycle through the Bug Museum's featured oddities"
        >
          <div className="tape-strip" style={{ width: '50px', top: '-8px' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontWeight: 900, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>
            <span>museum slider</span>
            <span>{MUSEUM_BUGS[museumIndex].stamp}</span>
          </div>
          <h4 style={{ fontFamily: 'var(--font-marker)', fontSize: '0.98rem', margin: '4px 0 2px 0' }}>
            {MUSEUM_BUGS[museumIndex].name}
          </h4>
          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '0.88rem', margin: 0, lineHeight: 1.2 }}>
            {MUSEUM_BUGS[museumIndex].desc}
          </p>
        </div>

        {/* Productivity Coffee Meter + Caffeine Ambient Soundboard */}
        <div 
          style={{ 
            background: '#17161F', 
            border: '2.5px solid var(--text-dark)', 
            borderRadius: '6px', 
            padding: '14px 16px', 
            boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div onClick={handleCoffeeClick} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} data-tooltip="Log a cup of coffee (resets after 5)">
              <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-yellow)' }}>caffeine monitor</span>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.92rem', opacity: 0.7 }}>{coffeeCups}/5 cups (click to fill)</span>
            </div>
            <Coffee onClick={handleCoffeeClick} size={20} style={{ color: coffeeCups > 0 ? 'var(--accent-yellow)' : 'white', cursor: 'pointer' }} data-tooltip="Log a cup of coffee" />
          </div>
          
          {/* Ambient Soundboard Toggles */}
          <div style={{ display: 'flex', gap: '6px', borderTop: '1.5px dashed rgba(255,255,255,0.1)', paddingTop: '6px' }}>
            {/* Lofi */}
            <button
              onClick={toggleLofi}
              data-tooltip={isLofi ? 'Pause the lo-fi beat loop' : 'Play a looping lo-fi beat'}
              style={{
                flex: 1,
                fontSize: '0.68rem',
                fontFamily: 'var(--font-hand)',
                background: isLofi ? 'var(--accent-purple)' : 'rgba(255,255,255,0.04)',
                color: isLofi ? 'white' : 'rgba(255,255,255,0.8)',
                border: '1.5px solid var(--text-dark)',
                borderRadius: '3px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px'
              }}
            >
              {isLofi ? <Volume2 size={10} /> : <VolumeX size={10} />} Lofi
            </button>

            {/* Rain */}
            <button
              onClick={toggleRain}
              data-tooltip={isRain ? 'Pause the rainfall ambience' : 'Play looping rainfall ambience'}
              style={{
                flex: 1,
                fontSize: '0.68rem',
                fontFamily: 'var(--font-hand)',
                background: isRain ? 'var(--accent-mint)' : 'rgba(255,255,255,0.04)',
                color: isRain ? 'var(--text-dark)' : 'rgba(255,255,255,0.8)',
                border: '1.5px solid var(--text-dark)',
                borderRadius: '3px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px'
              }}
            >
              <CloudRain size={10} /> Rain
            </button>

            {/* Typing */}
            <button
              onClick={toggleTyping}
              data-tooltip={isTyping ? 'Pause the keyboard click-clack sounds' : 'Play looping keyboard click-clack sounds'}
              style={{
                flex: 1,
                fontSize: '0.68rem',
                fontFamily: 'var(--font-hand)',
                background: isTyping ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.04)',
                color: isTyping ? 'var(--text-dark)' : 'rgba(255,255,255,0.8)',
                border: '1.5px solid var(--text-dark)',
                borderRadius: '3px',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px'
              }}
            >
              <Keyboard size={10} /> Type
            </button>
          </div>
        </div>

        {/* Team Collaboration */}
        <div style={{ background: '#17161F', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '16px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-purple)', marginBottom: '8px' }}>desk sync</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {['A', 'C', 'M', 'E'].map(initial => (
              <div 
                key={initial}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  background: 'var(--paper-beige)', 
                  color: 'var(--text-dark)',
                  fontSize: '0.62rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid var(--text-dark)'
                }}
              >
                {initial}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
