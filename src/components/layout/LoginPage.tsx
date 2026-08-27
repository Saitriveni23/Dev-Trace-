import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '../../firebase';
import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const ChromeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// Potted plant sketch SVG
const PlantPot = () => (
  <svg viewBox="0 0 60 70" width="54" height="60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    {/* Leaves */}
    <path d="M 30 25 C 20 15, 10 20, 20 30 C 15 20, 5 25, 12 35" stroke="var(--accent-mint)" fill="var(--accent-mint)" fillOpacity="0.2" />
    <path d="M 30 25 C 40 15, 50 20, 40 30 C 45 20, 55 25, 48 35" stroke="var(--accent-mint)" fill="var(--accent-mint)" fillOpacity="0.2" />
    <path d="M 30 25 Q 30 5 30 2" stroke="var(--accent-mint)" />
    
    {/* Pot */}
    <path d="M 15 35 L 45 35 L 40 68 L 20 68 Z" fill="var(--paper-beige)" />
    <line x1="12" y1="35" x2="48" y2="35" strokeWidth="4" />
  </svg>
);

// Headphones sketch SVG
const HeadphonesSketch = () => (
  <svg viewBox="0 0 80 80" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
    {/* Arch headband */}
    <path d="M 15 50 C 10 15, 70 15, 65 50" />
    {/* Left ear pad */}
    <rect x="8" y="46" width="12" height="24" rx="4" fill="var(--accent-purple)" />
    {/* Right ear pad */}
    <rect x="60" y="46" width="12" height="24" rx="4" fill="var(--accent-purple)" />
  </svg>
);

// Pencil sketch SVG
const PencilSketch = () => (
  <svg viewBox="0 0 60 15" width="50" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: 'rotate(-25deg)' }}>
    {/* Pencil Body */}
    <path d="M 5 3 L 50 3 L 50 12 L 5 12 Z" fill="var(--accent-yellow)" />
    {/* Sharp point */}
    <path d="M 5 3 L 0 7.5 L 5 12 Z" fill="var(--paper-beige)" />
    {/* Lead tip */}
    <path d="M 2 5.5 L 0 7.5 L 2 9.5 Z" fill="currentColor" />
  </svg>
);

export default function LoginPage() {
  const { dispatch, showToast } = useBugs();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Scribe your credentials before logging!', 'error');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('Desk session secured! Welcome to BugStudio.', 'success');
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
    } catch (err: any) {
      console.error(err);
      // Auto-register convenience for testing or fallback message
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          confetti({
            particleCount: 140,
            spread: 70,
            origin: { y: 0.6 }
          });
          showToast('Account created and logged in! Welcome to BugStudio.', 'success');
          dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
        } catch (regErr: any) {
          showToast(`Auth error: ${regErr.message}`, 'error');
        }
      } else {
        showToast(`Auth error: ${err.message}`, 'error');
      }
    }
  };

  const handleEnterWorkspace = () => {
    confetti({
      particleCount: 140,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast('Secure social stamp authorized! Welcome to BugStudio.', 'success');
    dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
  };

  return (
    <div 
      className="login-page-desktop"
      style={{
        display: 'grid',
        gridTemplateColumns: '45fr 55fr',
        minHeight: '100vh',
        width: '100%',
        background: '#0F0E13',
        color: 'var(--text-white)',
        position: 'relative'
      }}
    >
      
      {/* LEFT COLUMN: Developer desk illustration (45%) */}
      <div 
        style={{
          background: '#09080C',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          borderRight: '4px solid var(--text-dark)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          overflow: 'hidden'
        }}
      >
        {/* Chalk notes background watermark */}
        <span style={{ position: 'absolute', top: '8%', left: '10%', color: 'rgba(255,255,255,0.03)', fontSize: '5rem', fontFamily: 'var(--font-hand)', pointerEvents: 'none' }}>★ Desk</span>

        {/* Developer desk setup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* Coffee Mug & Steam Wave animation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Steam wave */}
            <div style={{ position: 'absolute', top: '-15px', display: 'flex', gap: '4px' }}>
              <span className="steam-wave" style={{ color: 'var(--accent-yellow)', fontSize: '1.2rem', animationDelay: '0s' }}>♨</span>
              <span className="steam-wave" style={{ color: 'var(--accent-yellow)', fontSize: '1rem', animationDelay: '0.4s' }}>♨</span>
            </div>
            {/* Mug SVG */}
            <svg viewBox="0 0 80 80" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
              <path d="M 20 25 L 60 25 L 56 75 L 24 75 Z" fill="var(--paper-beige)" />
              {/* handle */}
              <path d="M 60 35 C 72 35, 72 60, 58 60" />
            </svg>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>espresso</span>
          </div>

          {/* Plant pot and headphones row */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
            <PlantPot />
            <HeadphonesSketch />
          </div>

          {/* Sleeping Mascot that wakes up when passwordFocused is true */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <svg 
              viewBox="0 0 100 80" 
              width="110" 
              height="90" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="5"
              strokeLinecap="round"
            >
              {/* Antennas */}
              {passwordFocused ? (
                <>
                  <path d="M 40 25 Q 32 8 20 11" />
                  <path d="M 60 25 Q 68 8 80 11" />
                  <circle cx="20" cy="11" r="3" fill="currentColor" />
                  <circle cx="80" cy="11" r="3" fill="currentColor" />
                </>
              ) : (
                <>
                  <path d="M 40 25 Q 32 18 24 22" />
                  <path d="M 60 25 Q 68 18 76 22" />
                  <circle cx="24" cy="22" r="3" fill="currentColor" />
                  <circle cx="76" cy="22" r="3" fill="currentColor" />
                </>
              )}

              {/* Body */}
              <path 
                d="M 28 42 C 23 27, 77 27, 72 42 C 77 62, 67 74, 50 74 C 33 74, 23 62, 28 42 Z" 
                fill="var(--paper-yellow)" 
                stroke="currentColor" 
              />

              {/* Eyes */}
              {passwordFocused ? (
                <>
                  <circle cx="41" cy="42" r="5.5" fill="currentColor" />
                  <circle cx="59" cy="42" r="5.5" fill="currentColor" />
                  <circle cx="41" cy="42" r="1.5" fill="white" stroke="none" />
                  <circle cx="59" cy="42" r="1.5" fill="white" stroke="none" />
                </>
              ) : (
                <>
                  <path d="M 36 44 Q 41 47 46 44" stroke="currentColor" strokeWidth="3.5" />
                  <path d="M 54 44 Q 59 47 64 44" stroke="currentColor" strokeWidth="3.5" />
                </>
              )}
            </svg>
            <div style={{ fontFamily: 'var(--font-marker)', fontSize: '1rem', color: 'var(--accent-yellow)', marginTop: '6px' }}>
              {passwordFocused ? 'BugBot is awake! 🤖' : 'BugBot is sleeping... zZ'}
            </div>
          </div>

          {/* Simulated Keyboard */}
          <div 
            style={{
              width: '180px',
              height: '46px',
              background: '#1A1A24',
              border: '3px solid var(--text-dark)',
              borderRadius: '6px',
              position: 'relative',
              padding: '6px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', height: '100%' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ background: '#0F0E13', border: '1.5px solid var(--text-dark)', borderRadius: '2px' }} />
              ))}
            </div>
            
            {/* Pencil lying next to keyboard */}
            <div style={{ position: 'absolute', right: '-40px', bottom: '-15px' }}>
              <PencilSketch />
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: Notebook paper login form (55%) */}
      <div 
        style={{
          background: 'var(--paper-beige)',
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          color: 'var(--text-dark)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          overflow: 'hidden'
        }}
      >
        {/* Jagged Torn Paper Edge separator */}
        <div 
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '12px',
            background: 'var(--paper-beige)',
            clipPath: 'polygon(0% 0%, 100% 2%, 0% 4%, 100% 6%, 0% 8%, 100% 10%, 0% 12%, 100% 14%, 0% 16%, 100% 18%, 0% 20%, 100% 22%, 0% 24%, 100% 26%, 0% 28%, 100% 30%, 0% 32%, 100% 34%, 0% 36%, 100% 38%, 0% 40%, 100% 42%, 0% 44%, 100% 46%, 0% 48%, 100% 50%, 0% 52%, 100% 54%, 0% 56%, 100% 58%, 0% 60%, 100% 62%, 0% 64%, 100% 66%, 0% 68%, 100% 70%, 0% 72%, 100% 74%, 0% 76%, 100% 78%, 0% 80%, 100% 82%, 0% 84%, 100% 86%, 0% 88%, 100% 90%, 0% 92%, 100% 94%, 0% 96%, 100% 98%, 0% 100%)',
            boxShadow: '-4px 0px 8px rgba(0,0,0,0.1)'
          }}
        />

        {/* Ruled Margin Line binder */}
        <div style={{ position: 'absolute', left: '60px', top: 0, bottom: 0, width: '2px', background: 'rgba(255,123,107,0.35)' }} />

        {/* Notebook header details */}
        <div style={{ marginLeft: '40px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            secure gate: BS-T-02
          </span>
          <h2 style={{ fontFamily: 'var(--font-marker)', fontSize: '2.5rem', color: 'var(--text-dark)', marginTop: '6px', marginBottom: '30px' }}>
            Welcome back to your desk.
          </h2>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '440px' }}>
            
            {/* Email Line Input */}
            <div style={{ borderBottom: '2.5px solid var(--text-dark)', display: 'flex', alignItems: 'center', paddingBottom: '6px' }}>
              <Mail size={18} style={{ opacity: 0.6, marginRight: '8px' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your detective email..."
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  flex: 1,
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.35rem',
                  outline: 'none',
                  color: 'var(--text-dark)'
                }}
              />
            </div>

            {/* Password Line Input */}
            <div style={{ borderBottom: '2.5px solid var(--text-dark)', display: 'flex', alignItems: 'center', paddingBottom: '6px' }}>
              <Lock size={18} style={{ opacity: 0.6, marginRight: '8px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Enter workspace key passcode..."
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  flex: 1,
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.35rem',
                  outline: 'none',
                  color: 'var(--text-dark)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Checkbox and Forgot Password row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Remember Me sticky checkbox toggle */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer', 
                  fontFamily: 'var(--font-hand)', 
                  fontSize: '1.15rem', 
                  fontWeight: 'bold' 
                }}
              >
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--accent-yellow)',
                    cursor: 'pointer'
                  }}
                />
                <span>Remember this desk.</span>
              </label>

              {/* Forgot Password handwritten text */}
              <span 
                onClick={() => showToast('Clue secure code sent to mail trace inbox!', 'info')}
                style={{ 
                  fontFamily: 'var(--font-hand)', 
                  fontSize: '1.15rem', 
                  fontWeight: 'bold', 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  color: 'var(--text-dark)'
                }}
              >
                Lost my keys?
              </span>

            </div>

            {/* Let's Debug Button (Yellow Highlighter Sticky) */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                background: 'var(--paper-yellow)',
                color: 'var(--text-dark)',
                border: '2.5px solid var(--text-dark)',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
                transform: 'rotate(-1.5deg)',
                padding: '12px 24px',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-hand)',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                marginTop: '10px'
              }}
            >
              Let's Debug <ArrowRight size={18} />
            </button>

          </form>

          {/* Social login stickers */}
          <div style={{ marginTop: '40px', maxWidth: '440px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.08em', display: 'block', marginBottom: '14px' }}>
              continue via sticker stamps
            </span>
            <div style={{ display: 'flex', gap: '14px' }}>
              
              {/* Google Sticker */}
              <button 
                onClick={handleEnterWorkspace}
                className="mood-sticker"
                style={{ 
                  flex: 1, 
                  background: 'var(--paper-beige)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  transform: 'rotate(-2deg)' 
                }}
              >
                <ChromeIcon /> Google Sticker
              </button>

              {/* GitHub Sticker */}
              <button 
                onClick={handleEnterWorkspace}
                className="mood-sticker"
                style={{ 
                  flex: 1, 
                  background: 'var(--paper-beige)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  transform: 'rotate(1.5deg)' 
                }}
              >
                <GithubIcon /> GitHub Sticker
              </button>

            </div>
          </div>

          {/* Back button */}
          <div style={{ marginTop: '30px' }}>
            <span 
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
              style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Back to Main notebook overview
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
