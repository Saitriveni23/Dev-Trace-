import React, { useState, useEffect, useRef } from 'react';
import { useBugs } from '../../context/BugContext';
import DemoTour from '../common/DemoTour';
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
  const [showDemoTour, setShowDemoTour] = useState(true);

  // Derive dynamic activity feed
  const recentActivities = [...bugs]
    .flatMap(b => b.auditLog.map(log => ({ bugId: b.id, log })))
    .sort((a, b) => new Date(b.log.timestamp).getTime() - new Date(a.log.timestamp).getTime())
    .slice(0, 4);

  const formatActivityTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

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
        background: '#0d0d12', 
        minHeight: '100vh', 
        padding: '20px',
        color: 'var(--text-white)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >

      {/* ROW 1: Top Bar (Search, Notifications, Theme, Profile) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        {/* Command Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid var(--accent-yellow)', paddingBottom: '2px' }}>
          <Search size={16} style={{ color: 'var(--accent-yellow)' }} />
          <input 
            type="text" 
            placeholder="Search notebook cases..." 
            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', width: '100%' }}
          />
        </div>

        {/* Notifications Pinned like paper clip */}
        <div
          onClick={() => showToast('No new case alerts pins!', 'info')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
          data-tooltip="Check your notifications"
          data-tooltip-pos="bottom"
        >
          <Bell size={14} />
          <span>Notifications (0)</span>
        </div>

        {/* Theme switch */}
        <div
          onClick={() => setToggleDark(!toggleDark)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
          data-tooltip="Toggle between the dark and light notebook cover"
          data-tooltip-pos="bottom"
        >
          {toggleDark ? <Moon size={14} /> : <Sun size={14} />}
          <span>{toggleDark ? 'Dark Cover' : 'Light Cover'}</span>
        </div>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--text-dark)', padding: '4px 10px 8px', borderRadius: '4px', transform: 'rotate(-1.5deg)', boxShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', border: '1.5px solid var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.55rem' }}>D</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, fontFamily: 'var(--font-sans)' }}>Det. Alex</span>
            <span style={{ fontSize: '0.5rem', opacity: 0.5 }}>Lead Scribe</span>
          </div>
        </div>

      </div>

      <DemoTour open={showDemoTour} onComplete={() => setShowDemoTour(false)} />

      {/* ROW 2: Four colorful sticky statistic cards */}
      <div 
        data-tour-id="tour-metrics"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}
      >
        <div className="metric-sticky-card note-yellow" style={{ transform: 'rotate(-2deg)' }}>
          <div className="tape-strip" style={{ width: '50px', top: '-8px' }}></div>
          <span style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', fontFamily: 'var(--font-sans)' }}>open glitches</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '2px 0', textAlign: 'center' }}>{metrics.openBugs}</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', textAlign: 'center' }}>.. crawling trails ..</span>
        </div>

        <div className="metric-sticky-card note-orange" style={{ transform: 'rotate(1.5deg)' }}>
          <div className="tape-strip" style={{ width: '50px', top: '-8px' }}></div>
          <span style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', fontFamily: 'var(--font-sans)' }}>resolved cases</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '2px 0', textAlign: 'center' }}>{metrics.resolvedBugs}</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', textAlign: 'center' }}>.. stamps issued today ..</span>
        </div>

        <div className="metric-sticky-card note-purple" style={{ transform: 'rotate(-1deg)' }}>
          <div className="tape-strip" style={{ width: '50px', top: '-8px' }}></div>
          <span style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', fontFamily: 'var(--font-sans)' }}>AI suggestions</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '2px 0', textAlign: 'center' }}>{metrics.criticalBlockers}</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', textAlign: 'center' }}>.. robots clue sifting ..</span>
        </div>

        <div className="metric-sticky-card note-blue" style={{ transform: 'rotate(2.5deg)' }}>
          <div className="tape-strip" style={{ width: '50px', top: '-8px' }}></div>
          <span style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)', fontFamily: 'var(--font-sans)' }}>Sprint velocity</span>
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', margin: '2px 0', textAlign: 'center' }}>{metrics.securityEmbargoes}%</span>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', textAlign: 'center' }}>.. target goals speed ..</span>
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
        <div style={{ background: '#181A20', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent-yellow)', marginBottom: '12px' }}>Burn down chart</div>
          <div style={{ height: '120px', borderBottom: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <svg viewBox="0 0 300 120" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M 10 10 L 80 40 L 150 55 L 220 85 L 290 115" stroke="var(--accent-coral)" strokeDasharray="3 3" />
              <path d="M 10 10 Q 90 20 150 70 T 290 110" stroke="var(--accent-mint)" strokeWidth="4" />
            </svg>
          </div>
        </div>

        {/* AI Insight sticky note */}
        <div style={{ transform: 'rotate(-2.5deg)', position: 'relative', marginTop: '20px' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)' }}>AI clue insight</span>
          <div className="tape-strip" style={{ width: '30px', top: '-10px' }}></div>
          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', lineHeight: 1.2 }}>
            "Connection block timeouts share an 88% stack signature. Swipable connections are likely leaking pool allocations."
          </p>
        </div>

        {/* Sprint Donut & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#181A20', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" width="100%" height="100%">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent-mint)" strokeWidth="2" strokeDasharray="80 20" />
              </svg>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', fontWeight: 'bold' }}>Sprint: 80% complete</div>
          </div>

          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>recent activity timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', opacity: 0.8 }}>
              {recentActivities.map((act, idx) => (
                <div key={idx} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  [{formatActivityTime(act.log.timestamp)}] {act.log.user} updated {act.bugId}
                </div>
              ))}
              {recentActivities.length === 0 && <div>No recent activity</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4: Kanban board preview, Bug heatmap, Developer mood board, Today's priorities */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '20px',
          marginTop: '10px'
        }}
      >
        {/* Kanban Board Preview */}
        <div style={{ background: '#C79A63', padding: '12px', borderRadius: '4px', border: '2px solid var(--text-dark)', boxShadow: '3px 3px 0px rgba(0,0,0,0.8)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>Kanban columns</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-yellow)', marginBottom: '8px' }}>DOING (2)</div>
              <div style={{ background: 'white', color: 'var(--text-dark)', padding: '8px', fontSize: '0.75rem', borderRadius: '2px', fontWeight: 'bold', transform: 'rotate(-2deg)' }}>BS-114 connection</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-mint)', marginBottom: '8px' }}>DONE (14)</div>
              <div style={{ background: '#60A5FA', color: 'var(--text-dark)', padding: '8px', fontSize: '0.75rem', borderRadius: '2px', fontWeight: 'bold', transform: 'rotate(1.5deg)' }}>BS-108 scroll solved</div>
            </div>
          </div>
        </div>

        {/* Bug Heatmap (Pixel blocks) */}
        <div style={{ background: '#181A20', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-purple)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>glitch heatmap</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} style={{ width: '100%', height: '14px', background: i % 3 === 0 ? 'var(--accent-yellow)' : i % 5 === 0 ? 'var(--accent-coral)' : 'var(--accent-mint)', borderRadius: '2px' }} />
            ))}
          </div>
        </div>

        {/* Developer Mood Board */}
        <div style={{ background: '#181A20', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-coral)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>mood stamp</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Energetic ⚡', 'Coffee High ☕', 'Zzz Sleepy 💤'].map(mood => (
              <button
                key={mood}
                onClick={() => { setDevMood(mood); showToast(`Mood updated to ${mood}!`, 'success'); }}
                className={`mood-sticker ${devMood === mood ? 'active' : ''}`}
                data-tooltip={`Set your mood stamp to "${mood}"`}
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 'bold',
                  background: devMood === mood ? 'var(--accent-yellow)' : 'white',
                  color: 'var(--text-dark)',
                  transform: `rotate(${(mood.length % 2 === 0 ? -2 : 1.5)}deg)`,
                  padding: '4px 10px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Priorities Checklist */}
        <div style={{ background: '#181A20', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-yellow)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>today priorities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {priorities.map(p => (
              <div 
                key={p.id}
                onClick={() => handlePriorityToggle(p.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '0.95rem' }}
                data-tooltip={p.done ? 'Mark this priority as not done' : 'Mark this priority as done'}
              >
                <span style={{ color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center' }}>{p.done ? <CheckSquare size={14} /> : <Square size={14} />}</span>
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
          gap: '20px',
          marginTop: '10px'
        }}
      >
        {/* GitHub Activity */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-mint)', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>git activity stamps</div>
          <div style={{ display: 'flex', gap: '4px' }}>
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
            padding: '12px',
            position: 'relative',
            transform: 'rotate(1.5deg)',
            cursor: 'pointer',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
          }}
          data-tooltip="Click to cycle through the Bug Museum's featured oddities"
        >
          <div className="tape-strip" style={{ width: '40px', top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontWeight: 900, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
            <span>museum slider</span>
            <span>{MUSEUM_BUGS[museumIndex].stamp}</span>
          </div>
          <h4 style={{ fontFamily: 'var(--font-marker)', fontSize: '1rem', margin: '6px 0 4px 0' }}>
            {MUSEUM_BUGS[museumIndex].name}
          </h4>
          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', margin: 0, lineHeight: 1.2 }}>
            {MUSEUM_BUGS[museumIndex].desc}
          </p>
        </div>

        {/* Productivity Coffee Meter + Caffeine Ambient Soundboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div onClick={handleCoffeeClick} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} data-tooltip="Log a cup of coffee (resets after 5)">
              <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-yellow)', fontFamily: 'var(--font-sans)' }}>caffeine monitor</span>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', opacity: 0.7 }}>{coffeeCups}/5 cups (click to fill)</span>
            </div>
            <Coffee onClick={handleCoffeeClick} size={20} style={{ color: coffeeCups > 0 ? 'var(--accent-yellow)' : 'white', cursor: 'pointer' }} />
          </div>
          
          {/* Ambient Soundboard Toggles */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={toggleLofi}
              data-tooltip={isLofi ? 'Pause the lo-fi beat loop' : 'Play a looping lo-fi beat'}
              style={{
                flex: 1,
                fontSize: '0.7rem',
                fontFamily: 'var(--font-sans)',
                background: 'transparent',
                color: isLofi ? 'white' : 'rgba(255,255,255,0.6)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              {isLofi ? <Volume2 size={12} /> : <VolumeX size={12} />} Lofi
            </button>
            <button
              onClick={toggleRain}
              data-tooltip={isRain ? 'Pause the rainfall ambience' : 'Play looping rainfall ambience'}
              style={{
                flex: 1,
                fontSize: '0.7rem',
                fontFamily: 'var(--font-sans)',
                background: 'transparent',
                color: isRain ? 'var(--text-dark)' : 'rgba(255,255,255,0.6)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <CloudRain size={12} /> Rain
            </button>
            <button
              onClick={toggleTyping}
              data-tooltip={isTyping ? 'Pause the keyboard click-clack sounds' : 'Play looping keyboard click-clack sounds'}
              style={{
                flex: 1,
                fontSize: '0.7rem',
                fontFamily: 'var(--font-sans)',
                background: 'transparent',
                color: isTyping ? 'var(--text-dark)' : 'rgba(255,255,255,0.6)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Keyboard size={12} /> Type
            </button>
          </div>
        </div>

        {/* Team Collaboration */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>desk sync</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['A', 'C', 'M', 'E'].map(initial => (
              <div 
                key={initial}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  background: 'white', 
                  color: 'var(--text-dark)',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-sans)'
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
