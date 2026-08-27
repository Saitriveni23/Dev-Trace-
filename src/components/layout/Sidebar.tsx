import React from 'react';
import {
  List, LayoutGrid, BarChart2, ShieldAlert, GitBranch,
  Search, Flame, HelpCircle, UserCheck, GitPullRequest, Star,
  Atom, Database, ShieldCheck, Layers, Bug, Sparkles, Calendar, Smartphone
} from 'lucide-react';
import { useBugs } from '../../context/BugContext';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Atom, Database, ShieldCheck, Layers, Flame, HelpCircle, UserCheck, GitPullRequest, Star
};

const STATUS_COLORS: Record<string, string> = {
  UNCONFIRMED: 'var(--accent-coral)',
  CONFIRMED: 'var(--accent-purple)',
  IN_PROGRESS: 'var(--accent-yellow)',
  RESOLVED: 'var(--accent-mint)',
  VERIFIED: 'var(--accent-yellow)',
  CLOSED: 'var(--text-muted)',
};

// Peeking mascot component
const PeekingMascot = () => (
  <div style={{
    position: 'absolute',
    bottom: '-12px',
    left: '24px',
    zIndex: 5,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    {/* Speech Bubble doodle */}
    <div style={{
      background: 'var(--paper-yellow)',
      color: 'var(--text-dark)',
      border: '2px solid var(--text-dark)',
      borderRadius: '8px',
      padding: '4px 8px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      fontFamily: 'var(--font-hand)',
      boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
      transform: 'rotate(-4deg) translateY(4px)',
      position: 'relative'
    }}>
      Fix them all! 🐛
      <div style={{
        position: 'absolute',
        bottom: '-5px',
        left: '20px',
        width: '0',
        height: '0',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '5px solid var(--text-dark)'
      }}></div>
    </div>
    
    {/* Head of Bug peeking */}
    <svg 
      viewBox="0 0 100 60" 
      width="44" 
      height="30" 
      fill="none" 
      stroke="var(--text-white)" 
      strokeWidth="6" 
      strokeLinecap="round"
      style={{ animation: 'mascot-wobble 3s infinite ease-in-out' }}
    >
      <path d="M 20 60 C 15 20, 85 20, 80 60" fill="var(--bg-surface)" stroke="currentColor" />
      <circle cx="38" cy="40" r="4" fill="currentColor" />
      <circle cx="62" cy="40" r="4" fill="currentColor" />
      <path d="M 45 50 Q 50 54 55 50" stroke="currentColor" strokeWidth="4" fill="none" />
      {/* Antennas */}
      <path d="M 32 25 Q 24 10 16 14" />
      <path d="M 68 25 Q 76 10 84 14" />
    </svg>
  </div>
);

export default function Sidebar() {
  const { activeView, dispatch, bugs, products, savedSearches, filterProduct, getMetrics } = useBugs();
  const metrics = getMetrics();

  const openCount = bugs.filter(b => !['CLOSED'].includes(b.status)).length;

  const views = [
    { id: 'list', icon: <List size={15} />, label: 'All Sketchnotes', count: openCount },
    { id: 'kanban', icon: <LayoutGrid size={15} />, label: 'Sticky Kanban', count: null },
    { id: 'graph', icon: <GitBranch size={15} />, label: 'Dependency Graph', count: null },
    { id: 'dashboard', icon: <Layers size={15} />, label: 'Desk Dashboard', count: null },
    { id: 'analytics', icon: <BarChart2 size={15} />, label: 'BugStudio Analytics', count: null },
    { id: 'assistant', icon: <Sparkles size={15} />, label: 'AI Assistant', count: null },
    { id: 'sprint', icon: <Calendar size={15} />, label: 'Sprint Planner', count: null },
    { id: 'mobile', icon: <Smartphone size={15} />, label: 'Mobile Workspace', count: null },
    { id: 'security', icon: <ShieldAlert size={15} />, label: 'Security Embargo', count: metrics.securityEmbargoes || null },
    { id: 'search', icon: <Search size={15} />, label: 'Notebook Search', count: null },
  ] as const;

  return (
    <aside className="sidebar" style={{ position: 'relative' }}>
      {/* Views */}
      <div className="sidebar-section-label">Sketchbook Views</div>
      {views.map(v => (
        <div
          key={v.id}
          className={`sidebar-item ${activeView === v.id ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: v.id as typeof activeView })}
        >
          <span className="sidebar-item-icon">{v.icon}</span>
          <span>{v.label}</span>
          {v.count !== null && v.count !== undefined && v.count > 0 && (
            <span className="sidebar-item-count" style={
              v.id === 'security' ? { background: 'rgba(255, 123, 107, 0.2)', color: 'var(--accent-coral)' } : {}
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
          >
            <div
              className="product-chip-icon"
              style={filterProduct === p.name ? {} : { color: 'var(--accent-purple)' }}
            >
              <Icon size={12} />
            </div>
            <span style={{ flex: 1 }}>{p.name}</span>
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
            title={s.description}
          >
            <span className="sidebar-item-icon"><Icon size={14} /></span>
            <span style={{ fontSize: '0.82rem' }}>{s.name}</span>
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
          >
            <span
              className="sidebar-item-icon"
              style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0, margin: '3px 4px' }}
            />
            <span style={{ fontSize: '0.82rem' }}>{status.replace('_', ' ')}</span>
            <span className="sidebar-item-count">{count}</span>
          </div>
        );
      })}
      
      {/* Spacer to push mascot down */}
      <div style={{ height: '70px', flexShrink: 0 }} />
      
      <PeekingMascot />
    </aside>
  );
}
