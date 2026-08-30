import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Bell, Terminal } from 'lucide-react';
import { useBugs } from '../../context/BugContext';
import NewBugModal from '../bugs/NewBugModal';
import CommandPalette from './CommandPalette';
import ProfileDropdown from '../ProfileDropdown';
import NotificationsDropdown from '../NotificationsDropdown';

// Cute hand-drawn style Bug Mascot SVG
const BugMascot = () => (
  <div className="bug-mascot-container" style={{ color: 'var(--text-dark)' }}>
    <svg 
      viewBox="0 0 100 100" 
      width="34" 
      height="34" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="7" 
      strokeLinecap="round"
    >
      {/* Antennas */}
      <path d="M 35 25 Q 25 10 15 15" />
      <path d="M 65 25 Q 75 10 85 15" />
      {/* Antenna tips */}
      <circle cx="15" cy="15" r="4" fill="currentColor" />
      <circle cx="85" cy="15" r="4" fill="currentColor" />
      
      {/* Body/Head - slightly irregular hand-drawn oval */}
      <path d="M 25 45 C 20 25, 80 25, 75 45 C 80 70, 70 85, 50 85 C 30 85, 20 70, 25 45 Z" fill="var(--paper-beige)" stroke="currentColor" />
      
      {/* Eyes */}
      <circle cx="40" cy="42" r="5" fill="currentColor" />
      <circle cx="60" cy="42" r="5" fill="currentColor" />
      
      {/* Rosy cheeks */}
      <circle cx="34" cy="50" r="3" fill="var(--accent-coral)" stroke="none" />
      <circle cx="66" cy="50" r="3" fill="var(--accent-coral)" stroke="none" />
      
      {/* Playful smile */}
      <path d="M 45 55 Q 50 62 55 55" stroke="currentColor" strokeWidth="5" fill="none" />
      
      {/* Crawly Legs */}
      <path d="M 18 45 L 8 42" />
      <path d="M 82 45 L 92 42" />
      <path d="M 15 60 L 5 62" />
      <path d="M 85 60 L 95 62" />
      <path d="M 22 75 L 14 82" />
      <path d="M 78 75 L 86 82" />
    </svg>
  </div>
);

export default function Navbar() {
  const { searchQuery, dispatch, currentUser, showToast } = useBugs();
  const [showNewBug, setShowNewBug] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(true);
      }
      if (e.key === 'Escape') {
        setShowPalette(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowNewBug(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div
          className="navbar-brand"
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
          style={{ cursor: 'pointer' }}
          data-tooltip="Go back to the DevTrace landing page"
          data-tooltip-pos="bottom"
        >
          <div className="brand-logo-container">
            <BugMascot />
          </div>
          <span className="brand-name">Dev<span style={{ color: 'var(--accent-yellow)' }}>Trace</span></span>
          <span className="brand-version">T-02</span>
        </div>

        <div className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input
            ref={searchRef}
            className="navbar-search-input"
            data-tour-id="tour-search"
            placeholder="Search sketchnotes, bug IDs, tags… (⌘K)"
            value={searchQuery}
            onChange={e => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            title="Search across bugs by title, ID, or tag"
          />
          <div className="navbar-search-shortcut">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            className="navbar-btn"
            onClick={() => setShowNewBug(true)}
            data-tour-id="tour-new-sticker"
            data-tooltip="Report a new bug (shortcut: ⌘N / Ctrl+N)"
            data-tooltip-pos="bottom"
            aria-label="New Sticker"
            style={{
              background: 'var(--accent-yellow)',
              color: 'var(--text-dark)',
              border: '2px solid var(--text-dark)',
              borderRadius: '4px',
              padding: '6px 14px',
              fontWeight: 'bold',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '2px 2px 0px rgba(0,0,0,1)',
              transform: 'rotate(-1deg)'
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            New Sticker
          </button>

          <button
            className="navbar-icon-btn"
            onClick={() => setShowPalette(true)}
            data-tooltip="Notebook command line (open the full command palette with ⌘K / Ctrl+K)"
            data-tooltip-pos="bottom"
            aria-label="Command line"
          >
            <Terminal size={16} />
          </button>

          <NotificationsDropdown />

          <ProfileDropdown />
        </div>
      </nav>

      {showNewBug && <NewBugModal onClose={() => setShowNewBug(false)} />}
      {showPalette && <CommandPalette onClose={() => setShowPalette(false)} />}
    </>
  );
}
