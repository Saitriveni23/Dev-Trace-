import React from 'react';
import {
  List, LayoutGrid, BarChart2, ShieldAlert, GitBranch,
  Search, Flame, HelpCircle, UserCheck, GitPullRequest, Star,
  Atom, Database, ShieldCheck, Layers, Filter, Bug
} from 'lucide-react';
import { useBugs } from '../../context/BugContext';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Atom, Database, ShieldCheck, Layers, Flame, HelpCircle, UserCheck, GitPullRequest, Star
};

const STATUS_COLORS: Record<string, string> = {
  UNCONFIRMED: 'var(--status-unconfirmed)',
  CONFIRMED: 'var(--status-confirmed)',
  IN_PROGRESS: 'var(--status-in_progress)',
  RESOLVED: 'var(--status-resolved)',
  VERIFIED: 'var(--status-verified)',
  CLOSED: 'var(--status-closed)',
};

export default function Sidebar() {
  const { activeView, dispatch, bugs, products, savedSearches, filterProduct, getMetrics } = useBugs();
  const metrics = getMetrics();

  const openCount = bugs.filter(b => !['CLOSED'].includes(b.status)).length;
  const blocker = bugs.filter(b => (b.severity === 'BLOCKER' || b.severity === 'CRITICAL') && b.status !== 'CLOSED').length;

  const views = [
    { id: 'list', icon: <List size={15} />, label: 'All Issues', count: openCount },
    { id: 'kanban', icon: <LayoutGrid size={15} />, label: 'Kanban Board', count: null },
    { id: 'graph', icon: <GitBranch size={15} />, label: 'Dependency Graph', count: null },
    { id: 'analytics', icon: <BarChart2 size={15} />, label: 'Analytics', count: null },
    { id: 'security', icon: <ShieldAlert size={15} />, label: 'Security Portal', count: metrics.securityEmbargoes || null },
    { id: 'search', icon: <Search size={15} />, label: 'Advanced Search', count: null },
  ] as const;

  return (
    <aside className="sidebar">
      {/* Views */}
      <div className="sidebar-section-label">Navigation</div>
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
              v.id === 'security' ? { background: 'var(--color-danger-muted)', color: 'var(--color-danger)' } :
              v.id === 'list' && openCount > 0 ? {} : {}
            }>{v.count}</span>
          )}
        </div>
      ))}

      <div className="sidebar-divider" />

      {/* Products */}
      <div className="sidebar-section-label">Products</div>
      <div
        className={`product-chip ${!filterProduct ? 'active' : ''}`}
        onClick={() => dispatch({ type: 'SET_FILTER_PRODUCT', payload: null })}
      >
        <div className="product-chip-icon" style={{ background: 'var(--bg-overlay)', color: 'var(--text-muted)' }}>
          <Bug size={12} />
        </div>
        All Products
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
              style={{ background: 'var(--bg-overlay)', color: 'var(--color-accent)' }}
            >
              <Icon size={12} />
            </div>
            <span style={{ flex: 1 }}>{p.name}</span>
            {count > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{count}</span>}
          </div>
        );
      })}

      <div className="sidebar-divider" />

      {/* Saved Searches */}
      <div className="sidebar-section-label">Saved Queries</div>
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
      <div className="sidebar-section-label">Quick Filters</div>
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
    </aside>
  );
}
