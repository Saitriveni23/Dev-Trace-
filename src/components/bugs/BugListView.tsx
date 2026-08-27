import React, { useState, useEffect } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug, BugStatus, BugSeverity, BugPriority } from '../../types';
import {
  SeverityBadge, StatusBadge, PriorityBadge, FlagBadge,
  EmbargoIndicator, DependencyIndicator, TagChip
} from '../common/Badge';
import {
  ChevronUp, ChevronDown, ArrowUpDown, Filter,
  X, AlertTriangle, Users
} from 'lucide-react';
import BugDetailPanel from './BugDetailView';

const STATUS_ORDER: BugStatus[] = ['UNCONFIRMED', 'CONFIRMED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED'];
const SEVERITIES: BugSeverity[] = ['BLOCKER', 'CRITICAL', 'MAJOR', 'NORMAL', 'MINOR', 'TRIVIAL', 'ENHANCEMENT'];
const PRIORITIES: BugPriority[] = ['P1', 'P2', 'P3', 'P4', 'P5'];

type SortKey = 'id' | 'severity' | 'priority' | 'status' | 'updatedAt' | 'createdAt';

// Playful Mascot doodle for the empty state
const PlayfulEmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="playful-empty-state">
    <div className="empty-state-mascot">
      <svg 
        viewBox="0 0 100 100" 
        width="80" 
        height="80" 
        fill="none" 
        stroke="var(--accent-yellow)" 
        strokeWidth="6" 
        strokeLinecap="round"
      >
        <path d="M 35 25 Q 25 10 15 15" />
        <path d="M 65 25 Q 75 10 85 15" />
        <circle cx="15" cy="15" r="4" fill="currentColor" />
        <circle cx="85" cy="15" r="4" fill="currentColor" />
        <path d="M 25 45 C 20 25, 80 25, 75 45 C 80 70, 70 85, 50 85 C 30 85, 20 70, 25 45 Z" fill="var(--bg-surface)" stroke="currentColor" />
        <circle cx="40" cy="42" r="5" fill="currentColor" />
        <circle cx="60" cy="42" r="5" fill="currentColor" />
        <circle cx="34" cy="50" r="3" fill="var(--accent-coral)" stroke="none" />
        <circle cx="66" cy="50" r="3" fill="var(--accent-coral)" stroke="none" />
        <path d="M 40 60 Q 50 50 60 60" stroke="currentColor" strokeWidth="5" fill="none" />
        <path d="M 18 45 L 8 42" />
        <path d="M 82 45 L 92 42" />
        <path d="M 15 60 L 5 62" />
        <path d="M 85 60 L 95 62" />
      </svg>
    </div>
    
    <div style={{ 
      fontFamily: 'var(--font-hand)', 
      fontSize: '1.8rem', 
      color: 'var(--accent-yellow)', 
      marginTop: '16px',
      fontWeight: 'bold'
    }}>
      No sketchnotes found!
    </div>
    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0 20px', maxWidth: '320px' }}>
      Either your query returned nothing or the bugs have crawled away to hide!
    </div>
    <button className="btn btn-primary" onClick={onClear}>
      Reset BugStudio Filters
    </button>
  </div>
);

export default function BugListView() {
  const {
    getFilteredBugs, selectedBugId, dispatch,
    filterStatus, filterSeverity, filterPriority, searchQuery
  } = useBugs();

  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const bugs = getFilteredBugs();

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const currentIdx = bugs.findIndex(b => b.id === selectedBugId);
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = currentIdx + 1;
        if (next < bugs.length) dispatch({ type: 'SELECT_BUG', payload: bugs[next].id });
      }
      if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = currentIdx - 1;
        if (prev >= 0) dispatch({ type: 'SELECT_BUG', payload: bugs[prev].id });
      }
      if (e.key === 'Escape') dispatch({ type: 'SELECT_BUG', payload: null });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bugs, selectedBugId, dispatch]);

  const sortedBugs = [...bugs].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'id': cmp = a.numId - b.numId; break;
      case 'severity': cmp = SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity); break;
      case 'priority': cmp = PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority); break;
      case 'status': cmp = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status); break;
      case 'updatedAt': cmp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(); break;
      case 'createdAt': cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_FILTER_STATUS', payload: null });
    dispatch({ type: 'SET_FILTER_SEVERITY', payload: null });
    dispatch({ type: 'SET_FILTER_PRIORITY', payload: null });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  const hasActiveFilters = filterStatus || filterSeverity || filterPriority || searchQuery;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = Date.now();
    const diff = (now - d.getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="list-view">
      <div className="list-view-header">
        <div className="list-view-header-title">
          <span className="view-title">BugStudio Sketchbook</span>
          <span className="view-count">{sortedBugs.length} notes</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ color: 'var(--accent-coral)', fontSize: '0.78rem' }}>
              <X size={13} /> Wipe Filters
            </button>
          )}
          <button className={`btn btn-secondary btn-sm ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(f => !f)}>
            <Filter size={13} /> filter clip
          </button>
        </div>
      </div>

      {/* Filter strip */}
      {showFilters && (
        <div className="filter-strip">
          <span style={{ color: 'var(--accent-yellow)', fontWeight: 800, fontFamily: 'var(--font-hand)', fontSize: '1.1rem' }}>Marks:</span>
          {STATUS_ORDER.map(s => (
            <button
              key={s}
              className={`filter-chip ${filterStatus === s ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER_STATUS', payload: filterStatus === s ? null : s })}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
          <div style={{ width: 1, height: 16, background: '#2D2B3D' }} />
          <span style={{ color: 'var(--accent-yellow)', fontWeight: 800, fontFamily: 'var(--font-hand)', fontSize: '1.1rem' }}>Severity:</span>
          {SEVERITIES.map(s => (
            <button
              key={s}
              className={`filter-chip ${filterSeverity === s ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER_SEVERITY', payload: filterSeverity === s ? null : s })}
            >
              {s}
            </button>
          ))}
          <div style={{ width: 1, height: 16, background: '#2D2B3D' }} />
          {PRIORITIES.map(p => (
            <button
              key={p}
              className={`filter-chip ${filterPriority === p ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER_PRIORITY', payload: filterPriority === p ? null : p })}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Use keys <span className="kbd">j</span> / <span className="kbd">k</span> to flip notes &nbsp;·&nbsp;
            <span className="kbd">ESC</span> close detail &nbsp;·&nbsp;
            <span className="kbd">⌘K</span> command panel
          </span>
        </div>
        
        {/* Sort triggers */}
        <div style={{ display: 'flex', gap: 10, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Sort notebooks by:</span>
          <span style={{ cursor: 'pointer', color: sortKey === 'updatedAt' ? 'var(--accent-yellow)' : 'inherit' }} onClick={() => toggleSort('updatedAt')}>
            Updated <SortIcon k="updatedAt" />
          </span>
          <span style={{ cursor: 'pointer', color: sortKey === 'severity' ? 'var(--accent-yellow)' : 'inherit' }} onClick={() => toggleSort('severity')}>
            Severity <SortIcon k="severity" />
          </span>
          <span style={{ cursor: 'pointer', color: sortKey === 'priority' ? 'var(--accent-yellow)' : 'inherit' }} onClick={() => toggleSort('priority')}>
            Priority <SortIcon k="priority" />
          </span>
        </div>
      </div>

      {/* Sticky Note Cards Grid */}
      <div className="bug-table-wrapper" style={{ padding: 0 }}>
        {sortedBugs.length === 0 ? (
          <PlayfulEmptyState onClear={clearFilters} />
        ) : (
          <div className="bug-cards-grid">
            {sortedBugs.map(bug => (
              <BugCard
                key={bug.id}
                bug={bug}
                selected={selectedBugId === bug.id}
                onClick={() => dispatch({ type: 'SELECT_BUG', payload: selectedBugId === bug.id ? null : bug.id })}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>

      {selectedBugId && (
        <BugDetailPanel
          bugId={selectedBugId}
          onClose={() => dispatch({ type: 'SELECT_BUG', payload: null })}
        />
      )}
    </div>
  );
}

function BugCard({
  bug, selected, onClick, formatTime
}: {
  bug: Bug; selected: boolean; onClick: () => void; formatTime: (d: string) => string;
}) {
  const importantFlags = bug.flags.filter(f => f.status === '?' || f.status === '-');
  
  // Deterministic slight angle rotation based on bug ID to look hand-placed
  const angle = ((bug.numId * 19) % 7) - 3; // -3deg to +3deg
  const colorIndex = bug.numId % 4; // 4 color types

  return (
    <div
      className={`bug-card-notebook bug-card-color-${colorIndex} ${selected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {/* masking tape strip decoration */}
      <div className="tape-strip"></div>
      
      <div className="bug-card-header">
        <span className="bug-card-id">
          {bug.security.isEmbargoed && <EmbargoIndicator />}
          {bug.id}
        </span>
        <div style={{ transform: 'rotate(2deg)' }}>
          <PriorityBadge priority={bug.priority} />
        </div>
      </div>
      
      <div className="bug-card-title">
        {bug.title}
      </div>
      
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', margin: '4px 0 12px' }}>
        <DependencyIndicator blocksCount={bug.blocks.length} dependsCount={bug.dependsOn.length} />
        {bug.tags.slice(0, 2).map(t => <TagChip key={t} label={t} />)}
      </div>
      
      <div className="bug-card-footer">
        <SeverityBadge severity={bug.severity} />
        
        <div className="bug-card-meta">
          <img
            style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid var(--text-dark)' }}
            src={`https://images.unsplash.com/photo-15${bug.numId % 9}0489944761-15a19d654956?w=64&fit=crop&q=80`}
            alt={bug.assignee}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            {bug.assignee.split(' ')[0]}
          </span>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '6px',
        fontSize: '0.65rem',
        color: 'rgba(31, 30, 37, 0.6)',
        fontFamily: 'var(--font-mono)'
      }}>
        <span>{bug.product.split(' ')[0]}</span>
        <span>{formatTime(bug.updatedAt)}</span>
      </div>
    </div>
  );
}
