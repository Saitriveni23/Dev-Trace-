import React from 'react';
import { useBugs } from '../../context/BugContext';
import type { BugStatus } from '../../types';
import { SeverityBadge, PriorityBadge, FlagBadge, EmbargoIndicator } from '../common/Badge';
import BugDetailPanel from './BugDetailView';

const COLUMNS: { status: BugStatus; label: string; color: string }[] = [
  { status: 'UNCONFIRMED', label: 'Unconfirmed', color: 'var(--status-unconfirmed)' },
  { status: 'CONFIRMED', label: 'Confirmed', color: 'var(--status-confirmed)' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'var(--status-in_progress)' },
  { status: 'RESOLVED', label: 'Resolved', color: 'var(--status-resolved)' },
  { status: 'VERIFIED', label: 'Verified', color: 'var(--status-verified)' },
  { status: 'CLOSED', label: 'Closed', color: 'var(--status-closed)' },
];

export default function BugKanbanView() {
  const { getFilteredBugs, selectedBugId, dispatch } = useBugs();
  const bugs = getFilteredBugs();

  return (
    <div className="kanban-view">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <span className="view-title">Kanban Board</span>
        <span className="view-count">{bugs.length} issues</span>
      </div>
      <div className="kanban-board">
        {COLUMNS.map(col => {
          const colBugs = bugs.filter(b => b.status === col.status);
          return (
            <div key={col.status} className="kanban-column">
              <div className="kanban-column-header">
                <div className="kanban-column-dot" style={{ background: col.color }} />
                <span className="kanban-column-title">{col.label}</span>
                <span className="kanban-column-count">{colBugs.length}</span>
              </div>
              <div className="kanban-cards">
                {colBugs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-disabled)', fontSize: '0.78rem' }}>
                    No issues
                  </div>
                )}
                {colBugs.map(bug => (
                  <div
                    key={bug.id}
                    className="kanban-card"
                    onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
                    style={bug.security.isEmbargoed ? { borderLeft: '2px solid var(--color-danger)' } : {}}
                  >
                    <div className="kanban-card-id">
                      {bug.security.isEmbargoed && <EmbargoIndicator />}
                      {bug.id}
                    </div>
                    <div className="kanban-card-title">{bug.title}</div>
                    <div className="kanban-card-footer">
                      <SeverityBadge severity={bug.severity} />
                      <PriorityBadge priority={bug.priority} />
                      {bug.flags.filter(f => f.status === '?').slice(0, 1).map(f =>
                        <FlagBadge key={f.id} flag={f} />
                      )}
                      {bug.blocks.length > 0 && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-warn)', fontWeight: 700 }}>
                          ⛔ blocks {bug.blocks.length}
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bug.assigneeEmail}`}
                        alt={bug.assignee}
                        style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--bg-elevated)' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {bug.assignee.split(' ')[0]}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
                        {bug.component.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
