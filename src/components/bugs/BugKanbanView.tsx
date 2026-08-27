import React from 'react';
import { useBugs } from '../../context/BugContext';
import type { BugStatus } from '../../types';
import { SeverityBadge, PriorityBadge } from '../common/Badge';
import { Paperclip, MessageSquare } from 'lucide-react';
import BugDetailPanel from './BugDetailView';

const COLUMNS: { statuses: BugStatus[]; label: string; bgClass: string; noteClass: string; pinColor: string }[] = [
  { statuses: ['UNCONFIRMED'], label: 'Backlog 📝', bgClass: 'bg-cork', noteClass: 'note-yellow', pinColor: '#FF7B6B' },
  { statuses: ['CONFIRMED'], label: 'To Do 🎯', bgClass: 'bg-cork', noteClass: 'note-orange', pinColor: '#FFD84D' },
  { statuses: ['IN_PROGRESS'], label: 'In Progress ⚡', bgClass: 'bg-cork', noteClass: 'note-purple', pinColor: '#8B5CF6' },
  { statuses: ['RESOLVED', 'VERIFIED'], label: 'Review 🔍', bgClass: 'bg-cork', noteClass: 'note-blue', pinColor: '#66D9A8' },
  { statuses: ['CLOSED'], label: 'Done 🎉', bgClass: 'bg-cork', noteClass: 'note-green', pinColor: '#FAFAFA' }
];

// Interactive Push Pin component
const PushPin = ({ color }: { color: string }) => (
  <div style={{
    position: 'absolute',
    top: '-9px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none'
  }}>
    <div style={{
      width: '13px',
      height: '9px',
      borderRadius: '3px 3px 0 0',
      background: color,
      border: '2px solid #1F1E25',
      boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
    }} />
    <div style={{
      width: '9px',
      height: '5px',
      background: color,
      border: '2px solid #1F1E25',
      borderTop: 'none'
    }} />
    <div style={{
      width: '2px',
      height: '7px',
      background: '#9CA3AF',
      boxShadow: '1px 1px 0px rgba(0,0,0,0.4)'
    }} />
  </div>
);

// Doodle connectors featuring footprints trails connecting cards
const DoodleConnector = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    margin: '-4px 0', 
    color: 'rgba(255,255,255,0.15)',
    pointerEvents: 'none',
    userSelect: 'none'
  }}>
    {/* Dotted path + footprints SVGs */}
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M 17 2 Q 22 12 17 22" strokeDasharray="3 3" />
      {/* Tiny footprints */}
      <circle cx="13" cy="8" r="1.5" fill="currentColor" />
      <circle cx="21" cy="14" r="1.5" fill="currentColor" />
    </svg>
  </div>
);

export default function BugKanbanView() {
  const { getFilteredBugs, selectedBugId, dispatch } = useBugs();
  const bugs = getFilteredBugs();

  return (
    <div className="kanban-view" style={{ background: '#0F0E13', minHeight: '100vh', padding: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2.5px solid #201E2B', paddingBottom: '16px', marginBottom: '24px' }}>
        <span className="view-title">Cork board Kanban</span>
        <span className="view-count">{bugs.length} pinned sticky notes</span>
      </div>

      <div className="kanban-board" style={{ marginTop: '10px', display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {COLUMNS.map(col => {
          const colBugs = bugs.filter(b => col.statuses.includes(b.status));
          return (
            <div 
              key={col.label} 
              className={`kanban-column ${col.bgClass}`} 
              style={{ 
                flex: '0 0 280px',
                padding: '20px 14px', 
                borderRadius: '8px',
                border: '4px solid var(--text-dark)',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.9)',
                minHeight: '70vh',
                position: 'relative'
              }}
            >
              
              {/* Notebook Paper Column Label with pushpins */}
              <div 
                style={{ 
                  background: 'white',
                  border: '2px solid var(--text-dark)',
                  borderRadius: '2px',
                  padding: '8px 12px',
                  marginBottom: '20px',
                  position: 'relative',
                  transform: 'rotate(-2deg)',
                  boxShadow: '2.5px 2.5px 0px rgba(0,0,0,0.95)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <PushPin color={col.pinColor} />
                <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1rem', color: 'var(--text-dark)' }}>
                  {col.label}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--text-dark)', color: 'white', padding: '1px 6px', borderRadius: '4px' }}>
                  {colBugs.length}
                </span>
              </div>

              <div className="kanban-cards" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {colBugs.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 10px', 
                    color: 'rgba(255,255,255,0.3)', 
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-hand)',
                    fontWeight: 'bold',
                    background: 'rgba(0,0,0,0.2)',
                    border: '2px dashed rgba(255,255,255,0.06)',
                    borderRadius: '6px'
                  }}>
                    Clear Column! 📌
                  </div>
                )}
                {colBugs.map((bug, index) => {
                  const angle = ((bug.numId * 13) % 7) - 3;
                  const hasAttachment = bug.attachments.length > 0 || bug.numId % 3 === 0;
                  const mockDueDates = ['Friday!', 'ASAP', 'Sep 5th', 'Tomorrow', 'Urgent!'];
                  const dueDate = mockDueDates[bug.numId % mockDueDates.length];
                  const commentsCount = (bug.comments || []).length || 2;

                  return (
                    <React.Fragment key={bug.id}>
                      {index > 0 && <DoodleConnector />}

                      <div
                        className={`kanban-card ${col.noteClass}`}
                        onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
                        style={{ 
                          transform: `rotate(${angle}deg)`,
                          border: '2px solid var(--text-dark)',
                          borderRadius: '2px',
                          boxShadow: '3px 3px 0px rgba(0,0,0,0.9)',
                          position: 'relative',
                          padding: '16px 14px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        {/* Tape Strip decoration */}
                        <div className="tape-strip" style={{ width: '50px', top: '-8px', left: '15px' }}></div>

                        {/* Pushpin decoration */}
                        <PushPin color={col.pinColor} />

                        {/* Polaroid Avatar & Bug ID */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'rgba(0,0,0,0.45)' }}>
                            {bug.id}
                          </span>
                          
                          {/* Polaroid User Avatar */}
                          <div style={{ 
                            background: 'white', 
                            padding: '2px 2px 5px', 
                            border: '1px solid var(--text-dark)',
                            boxShadow: '1px 1px 0px rgba(0,0,0,0.5)',
                            transform: 'rotate(-4deg)'
                          }}>
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bug.assigneeEmail}`}
                              alt={bug.assignee}
                              style={{ width: 20, height: 20, objectFit: 'cover' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        </div>

                        {/* Title text */}
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2 }}>
                          {bug.title}
                        </div>

                        {/* Washi tape component label */}
                        <div style={{ marginTop: '8px' }}>
                          <span 
                            style={{ 
                              background: 'var(--paper-beige)', 
                              border: '1.5px solid var(--text-dark)', 
                              padding: '2px 8px', 
                              borderRadius: '2px', 
                              fontSize: '0.68rem', 
                              fontWeight: 'bold',
                              color: 'var(--text-dark)',
                              transform: 'rotate(1deg)',
                              display: 'inline-block'
                            }}
                          >
                            🏷️ {bug.component.split(' ')[0]}
                          </span>
                        </div>

                        {/* Footer details: Priority badge, comments, clips */}
                        <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '6px', marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <SeverityBadge severity={bug.severity} />
                            <PriorityBadge priority={bug.priority} />
                          </div>

                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--text-dark)' }}>
                            {/* Comments bubble count */}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                              <MessageSquare size={10} /> {commentsCount}
                            </span>

                            {/* Paperclip */}
                            {hasAttachment && (
                              <Paperclip size={10} strokeWidth={2.5} />
                            )}
                          </div>
                        </div>

                        {/* Due Date */}
                        <div style={{ marginTop: '4px', textAlign: 'right', fontSize: '0.72rem', fontFamily: 'var(--font-hand)', fontWeight: 'bold', color: 'var(--accent-coral)', transform: 'rotate(-1.5deg)' }}>
                          Due: {dueDate}
                        </div>

                      </div>
                    </React.Fragment>
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
