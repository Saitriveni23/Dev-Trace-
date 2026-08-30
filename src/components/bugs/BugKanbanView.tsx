import React, { useEffect } from 'react';
import { useBugs } from '../../context/BugContext';
import type { BugStatus } from '../../types';
import { SeverityBadge, PriorityBadge } from '../common/Badge';
import { Paperclip, MessageSquare, Clock } from 'lucide-react';
import BugDetailPanel from './BugDetailView';

const COLUMNS: { statuses: BugStatus[]; label: string; dotColor: string }[] = [
  { statuses: ['UNCONFIRMED'], label: 'Backlog', dotColor: '#9CA3AF' },
  { statuses: ['CONFIRMED'], label: 'To Do', dotColor: '#3B82F6' },
  { statuses: ['IN_PROGRESS'], label: 'In Progress', dotColor: '#F59E0B' },
  { statuses: ['RESOLVED', 'VERIFIED'], label: 'Review', dotColor: '#8B5CF6' },
  { statuses: ['CLOSED'], label: 'Done', dotColor: '#10B981' }
];

export default function BugKanbanView() {
  const { getFilteredBugs, selectedBugId, dispatch } = useBugs();
  const bugs = getFilteredBugs();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'SELECT_BUG', payload: null });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  return (
    <div className="kanban-view" style={{ padding: '16px', gap: '12px' }}>
      
      {/* Header */}
      <div className="list-view-header" style={{ marginBottom: '8px', paddingBottom: '10px' }}>
        <div className="list-view-header-title">
          <span className="view-title" style={{ fontSize: '1.4rem' }}>Kanban Board</span>
        </div>
        <div className="view-count" style={{ fontSize: '0.9rem' }}>{bugs.length} issues</div>
      </div>

      <div className="kanban-board" style={{ gap: '12px' }}>
        {COLUMNS.map(col => {
          const colBugs = bugs.filter(b => col.statuses.includes(b.status));
          return (
            <div 
              key={col.label} 
              className="kanban-column"
              style={{ width: '250px' }}
            >
              
              <div className="kanban-column-header" style={{ padding: '10px 12px' }}>
                <div className="kanban-column-dot" style={{ backgroundColor: col.dotColor, width: '8px', height: '8px' }} />
                <div className="kanban-column-title" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>
                  {col.label}
                </div>
                <div className="kanban-column-count" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                  {colBugs.length}
                </div>
              </div>

              <div className="kanban-cards" style={{ padding: '10px', gap: '10px' }}>
                {colBugs.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 8px', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.8rem',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    No issues
                  </div>
                )}
                {colBugs.map(bug => {
                  const hasAttachment = (bug.attachments?.length || 0) > 0 || (bug.numId || 0) % 3 === 0;
                  const commentsCount = (bug.comments || []).length || 2;
                  
                  // Use compact dark theme styling for the cards
                  return (
                    <div
                      key={bug.id}
                      className="kanban-card"
                      onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-white)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'none',
                        transform: 'none',
                        padding: '10px',
                        minHeight: 'auto',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div className="kanban-card-title" style={{ color: 'var(--text-white)', fontSize: '0.8rem', marginBottom: 0, lineHeight: 1.3 }}>
                          {bug.title}
                        </div>
                        <div className="kanban-card-id" style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: 0, marginLeft: '8px', border: 'none', whiteSpace: 'nowrap' }}>
                          {bug.id}
                        </div>
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <span 
                          style={{ 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid var(--border-subtle)', 
                            padding: '1px 6px', 
                            borderRadius: '4px', 
                            fontSize: '0.65rem', 
                            color: 'var(--text-muted)'
                          }}
                        >
                          {(bug.component || 'System').split(' ')[0]}
                        </span>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                          <SeverityBadge severity={bug.severity} />
                          <PriorityBadge priority={bug.priority} />
                        </div>

                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem' }}>
                            <MessageSquare size={10} /> {commentsCount}
                          </span>
                          {hasAttachment && (
                            <Paperclip size={10} />
                          )}
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bug.assigneeEmail}`}
                            alt={bug.assignee}
                            style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid var(--border-subtle)' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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
