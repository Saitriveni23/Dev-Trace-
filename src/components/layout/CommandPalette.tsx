import React, { useState, useEffect, useRef } from 'react';
import {
  Command, Search, Plus, BarChart2, ShieldAlert, GitBranch,
  List, LayoutGrid, Bug, Zap, UserCheck, ArrowRight
} from 'lucide-react';
import { useBugs } from '../../context/BugContext';

interface Props { onClose: () => void; }

const COMMANDS = [
  { id: 'new-bug', name: 'File a new bug report', desc: '⌘N', icon: <Plus size={15} />, shortcut: ['⌘', 'N'] },
  { id: 'view-list', name: 'Go to Issue List', desc: 'All issues table view', icon: <List size={15} />, shortcut: [] },
  { id: 'view-kanban', name: 'Go to Kanban Board', desc: 'Column-based workflow board', icon: <LayoutGrid size={15} />, shortcut: [] },
  { id: 'view-graph', name: 'Dependency Graph', desc: 'Visual blocker DAG visualizer', icon: <GitBranch size={15} />, shortcut: [] },
  { id: 'view-analytics', name: 'Engineering Analytics', desc: 'MTTR, SLA, defect metrics', icon: <BarChart2 size={15} />, shortcut: [] },
  { id: 'view-security', name: 'Security Portal', desc: 'Embargoed CVEs & CVSS tracker', icon: <ShieldAlert size={15} />, shortcut: [] },
  { id: 'filter-me', name: 'Assigned to Me', desc: 'Show only my issues', icon: <UserCheck size={15} />, shortcut: [] },
  { id: 'filter-p1', name: 'Filter: Priority P1', desc: 'Critical release blockers', icon: <Zap size={15} />, shortcut: [] },
  { id: 'filter-blocker', name: 'Filter: Blockers Only', desc: 'Issues blocking other issues', icon: <Bug size={15} />, shortcut: [] },
  { id: 'filter-embargo', name: 'Filter: Embargoed Security', desc: 'Active confidential CVEs', icon: <ShieldAlert size={15} />, shortcut: [] },
  { id: 'search', name: 'Advanced Search', desc: 'Boolean expression builder', icon: <Search size={15} />, shortcut: [] },
];

export default function CommandPalette({ onClose }: Props) {
  const { dispatch } = useBugs();
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = COMMANDS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { setHighlighted(0); }, [query]);

  const execute = (id: string) => {
    switch (id) {
      case 'view-list': dispatch({ type: 'SET_VIEW', payload: 'list' }); break;
      case 'view-kanban': dispatch({ type: 'SET_VIEW', payload: 'kanban' }); break;
      case 'view-graph': dispatch({ type: 'SET_VIEW', payload: 'graph' }); break;
      case 'view-analytics': dispatch({ type: 'SET_VIEW', payload: 'analytics' }); break;
      case 'view-security': dispatch({ type: 'SET_VIEW', payload: 'security' }); break;
      case 'filter-me':
        dispatch({ type: 'SET_SEARCH_QUERY', payload: `assigned:me is:open` });
        dispatch({ type: 'SET_VIEW', payload: 'list' });
        break;
      case 'filter-p1':
        dispatch({ type: 'SET_SEARCH_QUERY', payload: 'is:open priority:P1' });
        dispatch({ type: 'SET_VIEW', payload: 'list' });
        break;
      case 'filter-blocker':
        dispatch({ type: 'SET_SEARCH_QUERY', payload: 'is:open is:blocker' });
        dispatch({ type: 'SET_VIEW', payload: 'list' });
        break;
      case 'filter-embargo':
        dispatch({ type: 'SET_SEARCH_QUERY', payload: 'embargo:true' });
        dispatch({ type: 'SET_VIEW', payload: 'list' });
        break;
      case 'search':
        dispatch({ type: 'SET_VIEW', payload: 'search' });
        break;
    }
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === 'Enter' && filtered[highlighted]) execute(filtered[highlighted].id);
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-input-wrap">
          <Command size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="command-input"
            placeholder="Type a command, search bugs, or navigate…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          <span className="kbd">ESC</span>
        </div>
        <div className="command-results">
          <div className="command-section-label">Actions</div>
          {filtered.map((cmd, i) => (
            <div
              key={cmd.id}
              className={`command-item ${i === highlighted ? 'highlighted' : ''}`}
              onClick={() => execute(cmd.id)}
              onMouseEnter={() => setHighlighted(i)}
            >
              <div className="command-item-icon">{cmd.icon}</div>
              <div className="command-item-text">
                <div className="command-item-name">{cmd.name}</div>
                {cmd.desc && <div className="command-item-desc">{cmd.desc}</div>}
              </div>
              {cmd.shortcut.length > 0 && (
                <div className="command-item-shortcut">
                  {cmd.shortcut.map((k, ki) => <span key={ki} className="kbd">{k}</span>)}
                </div>
              )}
              <ArrowRight size={13} style={{ color: 'var(--text-disabled)', flexShrink: 0 }} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No commands match "{query}"
            </div>
          )}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-disabled)', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="kbd">↑</span><span className="kbd">↓</span> navigate
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-disabled)', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="kbd">⏎</span> execute
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-disabled)', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="kbd">ESC</span> close
          </span>
        </div>
      </div>
    </div>
  );
}
