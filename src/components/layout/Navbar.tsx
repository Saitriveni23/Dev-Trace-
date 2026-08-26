import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Bell, Terminal, Zap, ChevronDown } from 'lucide-react';
import { useBugs } from '../../context/BugContext';
import NewBugModal from '../bugs/NewBugModal';
import CommandPalette from './CommandPalette';

export default function Navbar() {
  const { searchQuery, dispatch, currentUser } = useBugs();
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
        <div className="navbar-brand">
          <div className="brand-logo">
            <Zap size={16} color="white" />
          </div>
          <span className="brand-name">DevTrace</span>
          <span className="brand-version">v2.0</span>
        </div>

        <div className="navbar-search">
          <Search size={14} className="navbar-search-icon" />
          <input
            ref={searchRef}
            className="navbar-search-input"
            placeholder="Search bugs, IDs, tags… or press ⌘K for commands"
            value={searchQuery}
            onChange={e => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            onFocus={() => { /* auto-focus */ }}
          />
          <div className="navbar-search-shortcut">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            className="navbar-btn navbar-btn-primary"
            onClick={() => setShowNewBug(true)}
            title="New Bug (⌘N)"
          >
            <Plus size={14} />
            New Bug
          </button>

          <button className="navbar-icon-btn" title="Open Terminal / Quick Query">
            <Terminal size={16} />
          </button>

          <button className="navbar-icon-btn" title="Notifications">
            <Bell size={16} />
            <span className="notification-dot" />
          </button>

          <img
            className="user-avatar"
            src={currentUser.avatar}
            alt={currentUser.name}
            title={`${currentUser.name} — ${currentUser.role}`}
          />
        </div>
      </nav>

      {showNewBug && <NewBugModal onClose={() => setShowNewBug(false)} />}
      {showPalette && <CommandPalette onClose={() => setShowPalette(false)} />}
    </>
  );
}
