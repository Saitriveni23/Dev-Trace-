import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug, BugSeverity, BugPriority, OperatingSystem, Architecture } from '../../types';
import { X, Plus, AlertTriangle, Mic, Image, Sparkles, FolderOpen, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props { onClose: () => void; }

const SEVERITIES: BugSeverity[] = ['BLOCKER', 'CRITICAL', 'MAJOR', 'NORMAL', 'MINOR', 'TRIVIAL', 'ENHANCEMENT'];
const PRIORITIES: BugPriority[] = ['P1', 'P2', 'P3', 'P4', 'P5'];
const OS_OPTIONS: OperatingSystem[] = ['macOS', 'Linux', 'Windows', 'iOS', 'Android', 'All'];
const ARCH_OPTIONS: Architecture[] = ['ARM64', 'x86_64', 'Wasm', 'Universal', 'All'];

const RELATED_BUGS = [
  { id: 'BS-1045', name: 'Phantom Scroll Glitch' },
  { id: 'BS-1112', name: 'Infinite Spinner' }
];

// Bug Detective Mascot SVG
const DetectiveMascot = () => (
  <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
    <svg 
      viewBox="0 0 100 100" 
      width="100%" 
      height="100%" 
      fill="none" 
      stroke="var(--text-dark)" 
      strokeWidth="6" 
      strokeLinecap="round"
    >
      {/* Detective Hat */}
      <path d="M 15 35 C 15 15, 85 15, 85 35 Z" fill="var(--accent-purple)" stroke="currentColor" />
      <path d="M 10 35 L 90 35" stroke="currentColor" strokeWidth="8" />
      
      {/* Body/Head */}
      <path d="M 25 45 C 20 30, 80 30, 75 45 C 80 65, 70 78, 50 78 C 30 78, 20 65, 25 45 Z" fill="var(--paper-beige)" stroke="currentColor" />
      
      {/* Eyes with detective monocle */}
      <circle cx="38" cy="45" r="4" fill="currentColor" stroke="none" />
      <circle cx="58" cy="45" r="4" fill="currentColor" stroke="none" />
      {/* Monocle on right eye */}
      <circle cx="58" cy="45" r="8" stroke="var(--accent-yellow)" strokeWidth="4.5" fill="none" />
      {/* Monocle chain */}
      <path d="M 66 45 Q 75 60 70 70" stroke="var(--accent-yellow)" strokeWidth="3" fill="none" />

      {/* Smile */}
      <path d="M 45 56 Q 50 60 55 56" stroke="currentColor" strokeWidth="4" fill="none" />

      {/* Crawly Legs */}
      <path d="M 18 45 L 8 42 M 82 45 L 92 42" />
      <path d="M 15 58 L 5 60 M 85 58 L 95 60" />
    </svg>
  </div>
);

export default function NewBugModal({ onClose }: Props) {
  const { products, currentUser, dispatch, showToast } = useBugs();
  const [step, setStep] = useState(0);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [product, setProduct] = useState(products[0]?.name ?? '');
  const [component, setComponent] = useState('');
  const [severityIndex, setSeverityIndex] = useState(3); // Normal
  const [priority, setPriority] = useState<BugPriority>('P3');
  const [os, setOs] = useState<OperatingSystem>('All');
  const [arch, setArch] = useState<Architecture>('All');
  const [environment, setEnvironment] = useState('');
  const [version, setVersion] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [tags, setTags] = useState('');

  // Interactive mock states
  const [isRecording, setIsRecording] = useState(false);
  const [mockScreenshot, setMockScreenshot] = useState<string | null>(null);

  const severity = SEVERITIES[severityIndex];

  const selectedProduct = products.find(p => p.name === product);
  const components = selectedProduct?.components ?? [];
  const versions = selectedProduct?.versions ?? [];
  const milestones = selectedProduct?.milestones ?? [];

  const steps = ['Notebook Guide', 'Glitch Clues', 'Env trace', 'Review'];

  // Handle Polaroid screenshot drop/click file selector
  const handlePolaroidClick = () => {
    if (mockScreenshot) {
      setMockScreenshot(null);
      showToast('Screenshot removed from Polaroid', 'info');
    } else {
      document.getElementById('polaroid-file-picker')?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMockScreenshot(reader.result as string);
      showToast('Polaroid evidence snapshot attached! 📸', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Handle Microphone tap
  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      setDescription(prev => prev + '\n\n### Voice Note Transcript\n"Logged voice clues about phantom scrolling events."');
      showToast('Voice report transcript injected!', 'success');
    } else {
      setIsRecording(true);
      showToast('Recording voice note clues... Tap sticker to stop.', 'info');
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !product || !component) {
      showToast('Title, product, and component are required', 'error');
      return;
    }
    const now = new Date().toISOString();
    const latestNum = 1200 + Math.floor(Math.random() * 100);
    const newBug: Bug = {
      id: `BS-${latestNum}`,
      numId: latestNum,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      product,
      component,
      version: version || (versions[0] ?? 'HEAD'),
      targetMilestone: milestones[0] ?? 'Unspecified',
      status: 'UNCONFIRMED',
      resolution: null,
      duplicateBugs: [],
      severity,
      priority,
      reporter: currentUser.name,
      reporterEmail: currentUser.email,
      assignee: currentUser.name,
      assigneeEmail: currentUser.email,
      ccList: [],
      os,
      architecture: arch,
      environment: environment.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      flags: [],
      dependsOn: [],
      blocks: [],
      security: { isEmbargoed: false, restrictedGroups: [] },
      timeTracking: { estimatedHours: 0, spentHours: 0, remainingHours: 0 },
      stackTrace: stackTrace.trim() || undefined,
      comments: [],
      attachments: mockScreenshot ? [{
        id: `att-${Date.now()}`,
        name: 'polaroid_evidence.jpg',
        size: 42100,
        type: 'screenshot',
        uploadedBy: currentUser.name,
        uploadedAt: now
      }] : [],
      auditLog: [
        {
          id: `aud-new-${Date.now()}`,
          timestamp: now,
          user: currentUser.username,
          field: 'Status',
          oldValue: '',
          newValue: 'UNCONFIRMED'
        }
      ],
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch({ type: 'CREATE_BUG', payload: newBug });
    
    // Confetti success
    confetti({
      particleCount: 140,
      spread: 90,
      colors: ['#FFD84D', '#8B5CF6', '#FF7B6B', '#66D9A8']
    });
    
    showToast(`Glitch pinned in case BS-${newBug.id}!`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      {/* Large investigation folder backing */}
      <div 
        className="modal-content-paper" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '24px',
          padding: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Binder Masking Tape */}
        <div className="tape-strip" style={{ width: '120px', height: '24px', top: '-14px' }}></div>

        {/* LEFT COLUMN: Investigation Notebook Decors */}
        <div 
          style={{
            borderRight: '2px dashed rgba(31, 30, 37, 0.15)',
            paddingRight: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative'
          }}
        >
          {/* Bug Detective Mascot */}
          <div style={{ textAlign: 'center' }}>
            <DetectiveMascot />
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 'bold', marginTop: '6px' }}>
              Detective Bugsy 🔍
            </div>
            
            {/* Footprints trails */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', opacity: 0.25, margin: '8px 0' }}>
              .. .. .. ..
            </div>
          </div>

          {/* Polaroid drag screenshot frame */}
          <div 
            onClick={handlePolaroidClick}
            className="polaroid-dropzone"
            style={{ margin: '0 auto', cursor: 'pointer' }}
          >
            <input 
              type="file" 
              id="polaroid-file-picker" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            {mockScreenshot ? (
              <img 
                src={mockScreenshot} 
                alt="evidence" 
                style={{ width: '100%', height: '110px', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ color: 'rgba(31,30,37,0.5)', textAlign: 'center', padding: '10px' }}>
                <Image size={24} style={{ margin: '0 auto 6px' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Evidence Polaroid</span>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '2px', fontFamily: 'var(--font-hand)', fontSize: '0.75rem', fontWeight: 'bold', color: 'white' }}>
              {mockScreenshot ? 'EVIDENCE.PNG' : 'DROP SCREENSHOT'}
            </div>
          </div>

          {/* Voice Microphone Sticker */}
          <button
            type="button"
            onClick={handleMicClick}
            style={{
              alignSelf: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: isRecording ? 'var(--accent-coral)' : 'var(--paper-yellow)',
              border: '2px solid var(--text-dark)',
              borderRadius: '24px',
              fontFamily: 'var(--font-hand)',
              fontWeight: 'bold',
              fontSize: '1rem',
              color: 'var(--text-dark)',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.9)',
              cursor: 'pointer',
              animation: isRecording ? 'mascot-wobble 0.8s infinite' : 'none'
            }}
          >
            <Mic size={14} />
            <span>{isRecording ? 'RECORDING CLUES...' : 'VOICE REPORT'}</span>
          </button>

          {/* AI Prediction Sticky Note */}
          <div 
            className="metric-sticky-card bug-card-color-1" 
            style={{ 
              minHeight: 'auto', 
              padding: '12px', 
              transform: 'rotate(2deg)',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.85)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', borderBottom: '1px dashed rgba(0,0,0,0.15)', paddingBottom: '4px', marginBottom: '6px' }}>
              <Sparkles size={12} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>AI predictions</span>
            </div>
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.2, textAlign: 'left' }}>
              ✍ {title.length > 5 ? `Glitch trace fits '${severity}' severity (92% accuracy)` : 'Fill summary to invoke prediction.'}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Investigation Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '78vh', paddingRight: '4px' }}>
          
          {/* Header */}
          <div className="modal-header-handwritten" style={{ borderBottom: '2.5px solid var(--text-dark)' }}>
            <span className="modal-title-marker">Investigation Case-Log</span>
            <button className="modal-close-doodle" onClick={onClose}><X size={16} strokeWidth={2.5} /></button>
          </div>

          {/* Multi-step Notebook Tabs */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2.5px solid var(--text-dark)', margin: '10px 0 24px', paddingBottom: '0' }}>
            {steps.map((s, i) => (
              <div
                key={i}
                onClick={() => i <= step && setStep(i)}
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  padding: '6px 14px',
                  border: '2px solid var(--text-dark)',
                  borderBottom: 'none',
                  borderRadius: '6px 6px 0 0',
                  background: i === step ? 'var(--paper-beige)' : 'rgba(0,0,0,0.05)',
                  color: i === step ? 'var(--text-dark)' : 'rgba(31,30,37,0.5)',
                  cursor: i <= step ? 'pointer' : 'default',
                  marginBottom: i === step ? '-2.5px' : '0',
                  zIndex: i === step ? 5 : 1,
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1}deg)`
                }}
              >
                {i < step ? '✓' : i + 1}. {s}
              </div>
            ))}
          </div>

          {/* Forms Body */}
          <div style={{ flex: 1 }}>
            
            {/* Step 0: Component & Severity marker slider */}
            {step === 0 && (
              <>
                <div className="form-group-ruled">
                  <label className="form-label-ruled">Investigation Category</label>
                  <select className="form-select-ruled" value={product} onChange={e => { setProduct(e.target.value); setComponent(''); setVersion(''); }}>
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>

                <div className="form-group-ruled">
                  <label className="form-label-ruled">Glitch Subcomponent</label>
                  <select className="form-select-ruled" value={component} onChange={e => setComponent(e.target.value)}>
                    <option value="">-- Choose Subcomponent --</option>
                    {components.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                {/* Marker Severity range slider */}
                <div className="form-group-ruled" style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label-ruled">Glitch Severity Impact</label>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-marker)', 
                        fontSize: '1rem', 
                        background: 'var(--accent-yellow)', 
                        color: 'var(--text-dark)',
                        padding: '1px 6px',
                        borderRadius: '2px',
                        transform: 'rotate(-2deg)',
                        boxShadow: '1.5px 1.5px 0px rgba(0,0,0,0.9)'
                      }}
                    >
                      {severity}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={SEVERITIES.length - 1}
                    className="marker-slider"
                    value={severityIndex}
                    onChange={e => setSeverityIndex(parseInt(e.target.value))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 800, color: 'rgba(31,30,37,0.5)', marginTop: '4px' }}>
                    <span>BLOCKER</span>
                    <span>ENHANCEMENT</span>
                  </div>
                </div>

                <div className="form-group-ruled">
                  <label className="form-label-ruled">Priority Mark</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {PRIORITIES.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        style={{
                          flex: 1, padding: '6px', borderRadius: '4px', fontWeight: 950,
                          border: '2px solid var(--text-dark)',
                          background: priority === p ? 'var(--accent-yellow)' : 'transparent',
                          color: 'var(--text-dark)',
                          cursor: 'pointer'
                        }}
                      >{p}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <>
                <div className="form-group-ruled">
                  <label className="form-label-ruled">Case Summary / Title</label>
                  <input
                    className="form-input-ruled"
                    placeholder="Briefly scribe the defect behavior..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="form-group-ruled">
                  <label className="form-label-ruled">Detailed Clues Log (Markdown)</label>
                  <textarea
                    className="form-input-ruled"
                    style={{ border: '2px solid var(--text-dark)', borderRadius: '4px', padding: '10px', background: 'transparent' }}
                    placeholder={`### Defect Behavior\n\n### Steps to Expose\n1. `}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={6}
                  />
                </div>

                {/* Duplicate Bugs Pinned Notes */}
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                    📌 Related Case Notes (Possible Duplicates)
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {RELATED_BUGS.map(b => (
                      <div 
                        key={b.id}
                        style={{
                          background: 'var(--paper-pink)',
                          color: 'var(--text-dark)',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1.5px solid var(--text-dark)',
                          boxShadow: '2px 2px 0px rgba(0,0,0,0.9)',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          transform: `rotate(${(b.id === 'BS-1045' ? -2 : 1)}deg)`
                        }}
                      >
                        <strong>{b.id}</strong>: {b.name}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Env tags as washi tape labels */}
            {step === 2 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  
                  <div className="form-group-ruled">
                    <label className="form-label-ruled">Operating System</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      {/* washi tape styles */}
                      <span className="washi-tape-tag washi-tape-coral">{os}</span>
                      <select 
                        className="form-select-ruled" 
                        style={{ padding: '4px', fontSize: '0.8rem', border: '1.5px solid var(--text-dark)' }} 
                        value={os} 
                        onChange={e => setOs(e.target.value as OperatingSystem)}
                      >
                        {OS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group-ruled">
                    <label className="form-label-ruled">Architecture</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <span className="washi-tape-tag">{arch}</span>
                      <select 
                        className="form-select-ruled" 
                        style={{ padding: '4px', fontSize: '0.8rem', border: '1.5px solid var(--text-dark)' }} 
                        value={arch} 
                        onChange={e => setArch(e.target.value as Architecture)}
                      >
                        {ARCH_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                </div>

                <div className="form-group-ruled">
                  <label className="form-label-ruled">Glitch Environment Scribes</label>
                  <input
                    className="form-input-ruled"
                    placeholder="e.g. Chrome 124, Ubuntu 22.0"
                    value={environment}
                    onChange={e => setEnvironment(e.target.value)}
                  />
                </div>

                <div className="form-group-ruled">
                  <label className="form-label-ruled">Stack Trace / Log Evidence</label>
                  <textarea
                    className="form-input-ruled"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', border: '2px solid var(--text-dark)', borderRadius: '4px', padding: '10px', background: 'transparent' }}
                    placeholder="Paste logs here..."
                    value={stackTrace}
                    onChange={e => setStackTrace(e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <>
                <div style={{ 
                  padding: '20px', 
                  background: 'white', 
                  borderRadius: '8px', 
                  border: '2px solid var(--text-dark)', 
                  marginBottom: 16,
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.85)',
                  transform: 'rotate(-1deg)'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(0,0,0,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Glitch Investigation Draft</div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: 12, color: 'var(--text-dark)' }}>{title || <span style={{ color: 'var(--accent-coral)', fontStyle: 'italic' }}>Missing Case Summary</span>}</div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span className={`badge badge-stamp badge-severity-${severity}`}>{severity}</span>
                    <span className="washi-tape-tag washi-tape-coral" style={{ fontSize: '0.75rem' }}>OS: {os}</span>
                    <span className="washi-tape-tag" style={{ fontSize: '0.75rem' }}>Arch: {arch}</span>
                  </div>

                  {mockScreenshot && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.6)', marginTop: '8px' }}>
                      <Image size={14} /> Attached polaroid_evidence.jpg
                    </div>
                  )}
                </div>

                {!title.trim() && (
                  <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: 'rgba(255, 123, 107, 0.1)', borderRadius: '6px', border: '2px dashed var(--accent-coral)', marginBottom: 12, color: 'var(--text-dark)' }}>
                    <AlertTriangle size={16} style={{ color: 'var(--accent-coral)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                      A case summary is required to pin this glitch.
                    </span>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer actions */}
          <div className="form-actions-notebook">
            {step > 0 && (
              <button className="btn btn-secondary" style={{ border: '2px solid var(--text-dark)', color: 'var(--text-dark)' }} onClick={() => setStep(s => s - 1)}>← Back</button>
            )}
            <button className="btn btn-ghost" style={{ color: 'rgba(31,30,37,0.6)' }} onClick={onClose}>Cancel</button>
            {step < steps.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && !component}
              >
                Next →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!title.trim() || !component}
                style={{
                  background: 'var(--accent-yellow)',
                  color: 'var(--text-dark)',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
                  transform: 'rotate(-2deg)',
                  fontSize: '1rem',
                  fontWeight: 900
                }}
              >
                Pin this Bug
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
