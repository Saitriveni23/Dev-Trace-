import React, { useState, useEffect, useCallback } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug, BugStatus, BugSeverity, BugPriority } from '../../types';
import {
  SeverityBadge, StatusBadge, PriorityBadge, FlagBadge,
  EmbargoIndicator, DependencyIndicator, TagChip
} from '../common/Badge';
import {
  ChevronUp, ChevronDown, ArrowUpDown, Filter,
  X, AlertTriangle, RefreshCw, Users
} from 'lucide-react';
import BugDetailPanel from './BugDetailView';

const STATUS_ORDER: BugStatus[] = ['UNCONFIRMED', 'CONFIRMED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED'];
const SEVERITIES: BugSeverity[] = ['BLOCKER', 'CRITICAL', 'MAJOR', 'NORMAL', 'MINOR', 'TRIVIAL', 'ENHANCEMENT'];
const PRIORITIES: BugPriority[] = ['P1', 'P2', 'P3', 'P4', 'P5'];

type SortKey = 'id' | 'severity' | 'priority' | 'status' | 'updatedAt' | 'createdAt';

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
        <span className="view-title">Issue Tracker</span>
        <span className="view-count">{sortedBugs.length} issues</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ color: 'var(--color-warn)', fontSize: '0.78rem' }}>
              <X size={13} /> Clear Filters
            </button>
          )}
          <button className={`btn btn-secondary btn-sm ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(f => !f)}>
            <Filter size={13} /> Filters
          </button>
        </div>
      </div>

      {/* Filter strip */}
      {showFilters && (
        <div className="filter-strip">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS:</span>
          {STATUS_ORDER.map(s => (
            <button
              key={s}
              className={`filter-chip ${filterStatus === s ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER_STATUS', payload: filterStatus === s ? null : s })}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
          <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SEVERITY:</span>
          {SEVERITIES.map(s => (
            <button
              key={s}
              className={`filter-chip ${filterSeverity === s ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_FILTER_SEVERITY', payload: filterSeverity === s ? null : s })}
            >
              {s}
            </button>
          ))}
          <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
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
      <div style={{ padding: '0 24px 8px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-disabled)' }}>
          <span className="kbd">j</span>/<span className="kbd">k</span> navigate &nbsp;
          <span className="kbd">ESC</span> close &nbsp;
          <span className="kbd">⌘K</span> commands
        </span>
      </div>

      {/* Table */}
      <div className="bug-table-wrapper">
        {sortedBugs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Filter size={24} /></div>
            <div className="empty-state-title">No issues match</div>
            <div className="empty-state-desc">Try adjusting your search query or clearing the active filters.</div>
            {hasActiveFilters && (
              <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <table className="bug-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('id')} style={{ width: 80 }}>
                  ID <SortIcon k="id" />
                </th>
                <th style={{ minWidth: 340 }}>Title / Description</th>
                <th onClick={() => toggleSort('severity')} style={{ width: 120 }}>
                  Severity <SortIcon k="severity" />
                </th>
                <th onClick={() => toggleSort('priority')} style={{ width: 80 }}>
                  Pri <SortIcon k="priority" />
                </th>
                <th onClick={() => toggleSort('status')} style={{ width: 130 }}>
                  Status <SortIcon k="status" />
                </th>
                <th style={{ width: 130 }}>Assignee</th>
                <th style={{ width: 110 }}>Product</th>
                <th style={{ width: 100 }}>Flags</th>
                <th onClick={() => toggleSort('updatedAt')} style={{ width: 80 }}>
                  Updated <SortIcon k="updatedAt" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBugs.map(bug => (
                <BugRow
                  key={bug.id}
                  bug={bug}
                  selected={selectedBugId === bug.id}
                  onClick={() => dispatch({ type: 'SELECT_BUG', payload: selectedBugId === bug.id ? null : bug.id })}
                  formatTime={formatTime}
                />
              ))}
            </tbody>
          </table>
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

function BugRow({
  bug, selected, onClick, formatTime
}: {
  bug: Bug; selected: boolean; onClick: () => void; formatTime: (d: string) => string;
}) {
  const importantFlags = bug.flags.filter(f => f.status === '?' || f.status === '-');

  return (
    <tr
      className={`bug-row ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <td className="bug-id-cell">{bug.id}</td>
      <td>
        <div className="bug-title-cell">
          {bug.security.isEmbargoed && <EmbargoIndicator />}
          {bug.title}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
          <DependencyIndicator blocksCount={bug.blocks.length} dependsCount={bug.dependsOn.length} />
          {bug.tags.slice(0, 3).map(t => <TagChip key={t} label={t} />)}
        </div>
      </td>
      <td><SeverityBadge severity={bug.severity} /></td>
      <td><PriorityBadge priority={bug.priority} /></td>
      <td><StatusBadge status={bug.status} /></td>
      <td>
        <div className="assignee-cell">
          <img
            className="assignee-avatar"
            src={`https://images.unsplash.com/photo-15${bug.numId % 9}0489944761-15a19d654956?w=64&fit=crop&q=80`}
            alt={bug.assignee}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="assignee-name">{bug.assignee.split(' ')[0]}</span>
        </div>
      </td>
      <td>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {bug.product.split(' ').slice(0, 2).join(' ')}
        </span>
      </td>
      <td>
        <div className="flags-cell">
          {importantFlags.slice(0, 3).map(f => <FlagBadge key={f.id} flag={f} />)}
        </div>
      </td>
      <td>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
          {formatTime(bug.updatedAt)}
        </span>
      </td>
    </tr>
  );
}
