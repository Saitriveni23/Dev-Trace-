import React from 'react';
import {
  List, LayoutGrid, BarChart2, ShieldAlert, GitBranch,
  Search, Flame, HelpCircle, UserCheck, GitPullRequest, Star,
  Atom, Database, ShieldCheck, Layers, Bug, Sparkles, Calendar, Smartphone, Palette, Users, Settings
} from 'lucide-react';
import { useBugs } from '../../context/BugContext';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Atom, Database, ShieldCheck, Layers, Flame, HelpCircle, UserCheck, GitPullRequest, Star
};

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const STATUS_COLORS: Record<string, string> = {
  UNCONFIRMED: 'var(--accent-coral)',
  CONFIRMED: 'var(--accent-purple)',
  IN_PROGRESS: 'var(--accent-yellow)',
  RESOLVED: 'var(--accent-mint)',
  VERIFIED: 'var(--accent-yellow)',
  CLOSED: 'var(--text-muted)',
};

// Bottom detective mascot profile card with XP progress
const DetectiveProfileCard = () => (
  <div style={{
    background: '#1A2233',
    border: '2.5px solid var(--accent-yellow)',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    transform: 'rotate(-1deg)',
    margin: '16px 12px 12px 12px'
  }}>
    {/* Detective Mascot mini drawing */}
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: '#F9F5E9',
      border: '1.5px solid #111827',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      <svg viewBox="0 0 100 80" width="24" height="18" fill="#111827" stroke="currentColor" strokeWidth="6">
        <path d="M 20 60 C 10 20, 90 20, 80 60" fill="#EF4444" />
        <circle cx="38" cy="40" r="3" />
        <circle cx="62" cy="40" r="3" />
        <path d="M 25 15 Q 15 5 5 10 M 75 15 Q 85 5 95 10" strokeWidth="4" />
      </svg>
    </div>

    {/* Text info and XP bar */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#FFFFFF' }}>Det. Triveni</span>
      <span style={{ fontSize: '0.68rem', color: '#FBBF24', fontFamily: 'var(--font-hand)', fontWeight: 'bold' }}>Lead Clue Collector</span>
      
      {/* XP Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
        <div style={{ flex: 1, height: '6px', background: '#111827', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '68%', height: '100%', background: '#FBBF24' }} />
        </div>
        <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#9CA3AF' }}>68% XP</span>
      </div>
    </div>
  </div>
);

export default function Sidebar() {
  const { activeView, dispatch, bugs, products, savedSearches, filterProduct, getMetrics } = useBugs();
  const metrics = getMetrics();

  const openCount = bugs.filter(b => !['CLOSED'].includes(b.status)).length;

  const views = [
    { id: 'dashboard', icon: <Layers size={15} />, label: 'Overview', count: null },
    { id: 'list', icon: <Bug size={15} />, label: 'Bugs', count: openCount },
    { id: 'kanban', icon: <LayoutGrid size={15} />, label: 'Board', count: null },
    { id: 'graph', icon: <GitBranch size={15} />, label: 'Reports', count: null },
    { id: 'analytics', icon: <BarChart2 size={15} />, label: 'Analytics', count: null },
    { id: 'assistant', icon: <Sparkles size={15} />, label: 'AI Assistant', count: null },
    { id: 'team', icon: <Users size={15} />, label: 'Team', count: null },
    { id: 'settings', icon: <Settings size={15} />, label: 'Settings', count: null },
    { id: 'sketch', icon: <Palette size={15} />, label: 'Doodle Canvas', count: null },
    { id: 'github', icon: <GithubIcon size={15} />, label: 'GitHub Sync', count: null },
  ] as const;

  return (
    <aside className="sidebar" style={{ position: 'relative' }}>
      {/* Views */}
      <div className="sidebar-section-label">Workspace Views</div>
      {views.map(v => (
        <div
          key={v.id}
          className={`sidebar-item ${activeView === v.id ? 'active' : ''}`}
          style={activeView === v.id ? { background: '#FBBF24', color: '#111827', fontWeight: 800, borderRadius: '4px', boxShadow: '2px 2px 0px rgba(0,0,0,0.95)' } : {}}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: v.id as typeof activeView })}
        >
          <span className="sidebar-item-icon" style={activeView === v.id ? { color: '#111827' } : {}}>{v.icon}</span>
          <span>{v.label}</span>
          {v.count !== null && v.count !== undefined && v.count > 0 && (
            <span className="sidebar-item-count" style={
              (v.id as string) === 'security' ? { background: 'rgba(255, 123, 107, 0.2)', color: 'var(--accent-coral)' } : {}
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
      
      {/* Detective Profile Card */}
      <DetectiveProfileCard />
    </aside>
  );
}
