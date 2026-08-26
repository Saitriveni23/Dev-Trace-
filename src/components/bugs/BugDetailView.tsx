import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug, BugStatus, BugResolution } from '../../types';
import {
  SeverityBadge, StatusBadge, PriorityBadge, FlagBadge,
  ResolutionBadge, CvssChip, TagChip
} from '../common/Badge';
import {
  X, ExternalLink, GitCommit, GitPullRequest as PR, Clock,
  AlertOctagon, Link2, ChevronRight, MessageSquare, Paperclip,
  Shield, Activity, CheckCircle, Edit3, Send, Lock, Unlock
} from 'lucide-react';

interface Props {
  bugId: string;
  onClose: () => void;
}

const STATUS_TRANSITIONS: Record<BugStatus, BugStatus[]> = {
  UNCONFIRMED: ['CONFIRMED', 'CLOSED'],
  CONFIRMED: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'CONFIRMED'],
  RESOLVED: ['VERIFIED', 'CONFIRMED'],
  VERIFIED: ['CLOSED', 'CONFIRMED'],
  CLOSED: ['CONFIRMED'],
};

const RESOLUTION_OPTIONS: BugResolution[] = ['FIXED', 'INVALID', 'WONTFIX', 'DUPLICATE', 'WORKSFORME', 'NOT_A_BUG'];

type TabId = 'overview' | 'comments' | 'flags' | 'audit' | 'security';

export default function BugDetailPanel({ bugId, onClose }: Props) {
  const { getBugById, dispatch, currentUser, showToast } = useBugs();
  const bug = getBugById(bugId);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [newComment, setNewComment] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<BugResolution>('FIXED');

  if (!bug) return null;

  const handleStatusChange = (newStatus: BugStatus) => {
    const needsResolution = ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(newStatus);
    dispatch({
      type: 'UPDATE_BUG_STATUS',
      payload: {
        id: bug.id,
        status: newStatus,
        resolution: needsResolution ? selectedResolution : null
      }
    });
    showToast(`Status updated to ${newStatus}`, 'success');
    setShowStatusMenu(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        bugId: bug.id,
        comment: {
          id: `c-${Date.now()}`,
          author: currentUser.name,
          authorEmail: currentUser.email,
          authorAvatar: currentUser.avatar,
          timestamp: new Date().toISOString(),
          content: newComment.trim(),
          reactions: []
        }
      }
    });
    showToast('Comment added', 'success');
    setNewComment('');
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const STATUS_ORDER: BugStatus[] = ['UNCONFIRMED', 'CONFIRMED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED'];
  const currentStatusIdx = STATUS_ORDER.indexOf(bug.status);

  const STATUS_COLORS: Record<BugStatus, string> = {
    UNCONFIRMED: 'var(--status-unconfirmed)', CONFIRMED: 'var(--status-confirmed)',
    IN_PROGRESS: 'var(--status-in_progress)', RESOLVED: 'var(--status-resolved)',
    VERIFIED: 'var(--status-verified)', CLOSED: 'var(--status-closed)'
  };

  const spent = bug.timeTracking.spentHours;
  const estimated = bug.timeTracking.estimatedHours;
  const progress = estimated > 0 ? Math.min((spent / estimated) * 100, 100) : 0;

  const cvssColor = bug.security.cvssScore
    ? bug.security.cvssScore >= 9 ? 'var(--sev-blocker)'
    : bug.security.cvssScore >= 7 ? 'var(--sev-critical)'
    : bug.security.cvssScore >= 4 ? 'var(--sev-major)'
    : 'var(--sev-minor)'
    : 'var(--text-muted)';

  const tabs: { id: TabId; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity size={13} /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare size={13} />, count: bug.comments.length },
    { id: 'flags', label: 'Flags', icon: <CheckCircle size={13} />, count: bug.flags.length },
    { id: 'audit', label: 'Audit Log', icon: <Clock size={13} />, count: bug.auditLog.length },
    ...(bug.security.isEmbargoed ? [{ id: 'security' as TabId, label: 'Security', icon: <Shield size={13} /> }] : []),
  ];

  return (
    <div className="detail-panel-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-header">
          <div className="detail-header-meta">
            <span className="detail-id">{bug.id}</span>
            <StatusBadge status={bug.status} />
            {bug.resolution && <ResolutionBadge resolution={bug.resolution} />}
            {bug.security.isEmbargoed && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-danger)', fontSize: '0.72rem', fontWeight: 700 }}>
                <Lock size={11} /> EMBARGOED
              </span>
            )}
            <button className="detail-close-btn" onClick={onClose}><X size={16} /></button>
          </div>
          <div className="detail-title">{bug.title}</div>

          {/* Status lifecycle stepper */}
          <div className="status-steps" style={{ marginTop: 14 }}>
            {STATUS_ORDER.map((s, i) => {
              const isPast = i < currentStatusIdx;
              const isActive = i === currentStatusIdx;
              return (
                <div key={s} className="status-step">
                  <div className="status-step-node" onClick={() => STATUS_TRANSITIONS[bug.status]?.includes(s) && handleStatusChange(s)}>
                    <div className={`status-step-circle ${isActive ? 'active' : isPast ? 'past' : ''}`}
                      style={{
                        cursor: STATUS_TRANSITIONS[bug.status]?.includes(s) ? 'pointer' : 'default',
                        borderColor: isActive ? STATUS_COLORS[s] : isPast ? 'var(--color-success)' : undefined
                      }}>
                      {isPast ? '✓' : isActive ? '●' : i + 1}
                    </div>
                    <div className="status-step-label" style={{ color: isActive ? STATUS_COLORS[s] : undefined }}>
                      {s === 'IN_PROGRESS' ? 'WIP' : s === 'UNCONFIRMED' ? 'UNCFM' : s.slice(0, 6)}
                    </div>
                  </div>
                  {i < STATUS_ORDER.length - 1 && (
                    <div className={`status-step-line ${isPast ? 'past' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action bar */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 8, flexWrap: 'wrap', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowStatusMenu(m => !m)}>
              <Edit3 size={12} /> Change Status
            </button>
            {showStatusMenu && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--bg-elevated)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 6,
                zIndex: 50, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 'var(--shadow-lg)'
              }}>
                {(STATUS_TRANSITIONS[bug.status] ?? []).map(s => (
                  <button
                    key={s}
                    style={{
                      padding: '7px 12px', textAlign: 'left', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem', color: STATUS_COLORS[s], fontWeight: 600,
                      background: 'transparent', cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => handleStatusChange(s)}
                  >
                    → {s}
                  </button>
                ))}
                {['RESOLVED', 'CLOSED'].some(s => (STATUS_TRANSITIONS[bug.status] ?? []).includes(s as BugStatus)) && (
                  <>
                    <div className="divider" />
                    <select
                      className="form-select"
                      style={{ fontSize: '0.78rem', padding: '5px 24px 5px 8px' }}
                      value={selectedResolution ?? 'FIXED'}
                      onChange={e => setSelectedResolution(e.target.value as BugResolution)}
                    >
                      {RESOLUTION_OPTIONS.map(r => (
                        <option key={r} value={r as string}>{r}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            )}
          </div>
          {bug.assigneeEmail !== currentUser.email && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                dispatch({ type: 'UPDATE_BUG', payload: { ...bug, assignee: currentUser.name, assigneeEmail: currentUser.email, updatedAt: new Date().toISOString() } });
                showToast('Assigned to yourself', 'success');
              }}
            >
              Assign to Me
            </button>
          )}
          {bug.gitBranch && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-success)', fontFamily: 'var(--font-mono)', background: 'var(--color-success-muted)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid hsla(152,62%,52%,0.3)' }}>
              <GitCommit size={12} /> {bug.gitBranch}
            </span>
          )}
          {bug.pullRequestUrl && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--color-primary)', background: 'var(--color-primary-muted)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid hsla(224,85%,62%,0.3)' }}>
              <PR size={12} /> PR Open
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ padding: '0 20px', marginBottom: 0 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span style={{ background: 'var(--bg-overlay)', padding: '0 5px', borderRadius: 'var(--radius-full)', fontSize: '0.68rem', fontWeight: 700 }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="detail-body">

          {/* === OVERVIEW TAB === */}
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <div className="detail-section">
                <div className="detail-section-title">Description</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {bug.description.split('\n').map((line, i) => {
                    if (line.startsWith('### ')) return <h4 key={i} style={{ color: 'var(--text-primary)', fontWeight: 700, margin: '12px 0 4px', fontSize: '0.9rem' }}>{line.slice(4)}</h4>;
                    if (line.startsWith('`') && line.endsWith('`')) return <code key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'var(--bg-base)', padding: '1px 5px', borderRadius: 4 }}>{line.slice(1, -1)}</code>;
                    return <span key={i}>{line}<br /></span>;
                  })}
                </div>
              </div>

              {/* Stack trace */}
              {bug.stackTrace && (
                <div className="detail-section">
                  <div className="detail-section-title">Stack Trace / Crash Log</div>
                  <div className="stack-trace">
                    <div className="stack-trace-header">
                      <AlertOctagon size={12} style={{ color: 'var(--color-danger)' }} />
                      <span className="stack-trace-title">CRASH TRACE</span>
                    </div>
                    <div className="stack-trace-body">
                      {bug.stackTrace.split('\n').map((line, i) => {
                        const cls = line.includes('ERROR') || line.includes('panic') || line.includes('FATAL')
                          ? 'stack-trace-line-error'
                          : line.includes('src/') || line.includes('/raft_') || line.includes('/dom_')
                          ? 'stack-trace-line-frame-main'
                          : line.includes('deps/') || line.includes('/heap.') || line.includes('internal')
                          ? 'stack-trace-line-frame-dep'
                          : '';
                        return <div key={i} className={cls}>{line}</div>;
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata grid */}
              <div className="detail-section">
                <div className="detail-section-title">Metadata</div>
                <div className="detail-grid">
                  <div className="detail-field">
                    <div className="detail-field-label">Product</div>
                    <div className="detail-field-value">{bug.product}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">Component</div>
                    <div className="detail-field-value">{bug.component}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">Version</div>
                    <div className="detail-field-value mono">{bug.version}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">Target Milestone</div>
                    <div className="detail-field-value">{bug.targetMilestone}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">OS / Arch</div>
                    <div className="detail-field-value">{bug.os} / {bug.architecture}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">Reporter</div>
                    <div className="detail-field-value">{bug.reporter}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">Assignee</div>
                    <div className="detail-field-value">{bug.assignee}</div>
                  </div>
                  <div className="detail-field">
                    <div className="detail-field-label">Created</div>
                    <div className="detail-field-value mono" style={{ fontSize: '0.72rem' }}>{formatDate(bug.createdAt)}</div>
                  </div>
                </div>
                {bug.environment && (
                  <div style={{ marginTop: 10 }}>
                    <div className="detail-field-label" style={{ marginBottom: 4 }}>Environment</div>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {bug.environment}
                    </code>
                  </div>
                )}
              </div>

              {/* Time tracking */}
              <div className="detail-section">
                <div className="detail-section-title">Time Tracking</div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {spent}h spent / {estimated}h estimated
                    </span>
                    <span style={{ color: progress > 90 ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: 700 }}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${progress}%`,
                        background: progress > 90 ? 'var(--color-danger)' : progress > 60 ? 'var(--color-warn)' : 'var(--color-primary)'
                      }}
                    />
                  </div>
                </div>
                {bug.timeTracking.deadline && (
                  <div style={{ fontSize: '0.78rem', color: new Date(bug.timeTracking.deadline) < new Date() ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Deadline: {new Date(bug.timeTracking.deadline).toLocaleDateString()}
                    {new Date(bug.timeTracking.deadline) < new Date() && <span style={{ marginLeft: 6, fontWeight: 700 }}>⚠ SLA BREACH</span>}
                  </div>
                )}
              </div>

              {/* Dependencies */}
              {(bug.dependsOn.length > 0 || bug.blocks.length > 0) && (
                <div className="detail-section">
                  <div className="detail-section-title">Dependencies</div>
                  {bug.dependsOn.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>DEPENDS ON</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {bug.dependsOn.map(id => (
                          <span key={id} style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
                            color: 'var(--color-warn)', background: 'var(--color-warn-muted)',
                            padding: '2px 9px', borderRadius: 'var(--radius-full)', border: '1px solid hsla(32,90%,58%,0.3)'
                          }}>↓ {id}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {bug.blocks.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>BLOCKS</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {bug.blocks.map(id => (
                          <span key={id} style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700,
                            color: 'var(--color-danger)', background: 'var(--color-danger-muted)',
                            padding: '2px 9px', borderRadius: 'var(--radius-full)', border: '1px solid hsla(0,80%,60%,0.3)'
                          }}>⛔ {id}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {bug.tags.length > 0 && (
                <div className="detail-section">
                  <div className="detail-section-title">Tags</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {bug.tags.map(t => <TagChip key={t} label={t} />)}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {bug.attachments.length > 0 && (
                <div className="detail-section">
                  <div className="detail-section-title">Attachments ({bug.attachments.length})</div>
                  {bug.attachments.map(att => (
                    <div key={att.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                      background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 6,
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <Paperclip size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)', flex: 1 }}>{att.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{(att.size / 1024).toFixed(1)}KB</span>
                      <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--bg-overlay)', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {att.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === COMMENTS TAB === */}
          {activeTab === 'comments' && (
            <>
              <div className="comment-list" style={{ marginBottom: 20 }}>
                {bug.comments.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon"><MessageSquare size={22} /></div>
                    <div className="empty-state-title">No comments yet</div>
                    <div className="empty-state-desc">Be the first to add context, findings, or a patch.</div>
                  </div>
                )}
                {bug.comments.map(c => (
                  <div key={c.id} className="comment-card">
                    <img className="comment-avatar" src={c.authorAvatar} alt={c.author} />
                    <div className="comment-body">
                      <div className="comment-meta">
                        <span className="comment-author">{c.author}</span>
                        {c.isInternal && <span className="comment-internal-badge">Internal</span>}
                        <span className="comment-time">{new Date(c.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="comment-content">{c.content}</div>
                      {c.patchDiff && (
                        <div className="patch-diff">
                          <div className="patch-diff-header"><Paperclip size={11} style={{ display: 'inline', marginRight: 4 }} />Patch Diff</div>
                          <div className="patch-diff-body">
                            {c.patchDiff.split('\n').map((line, i) => (
                              <div key={i} className={line.startsWith('+') ? 'patch-line-add' : line.startsWith('-') ? 'patch-line-remove' : 'patch-line-context'}>
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {c.reactions.length > 0 && (
                        <div className="comment-reactions">
                          {c.reactions.map(r => (
                            <span key={r.emoji} className="reaction-pill">
                              {r.emoji} <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{r.users.length}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <img className="comment-avatar" src={currentUser.avatar} alt={currentUser.name} />
                  <div style={{ flex: 1 }}>
                    <textarea
                      className="form-textarea"
                      placeholder="Add a comment, finding, or attach a patch…"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      rows={4}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send size={13} /> Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* === FLAGS TAB === */}
          {activeTab === 'flags' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Review flags control the patch approval workflow. <strong style={{ color: 'var(--text-secondary)' }}>?</strong> = requested, <strong style={{ color: 'var(--color-success)' }}>+</strong> = granted, <strong style={{ color: 'var(--color-danger)' }}>−</strong> = denied.
                </p>
              </div>
              <div className="flag-list">
                {bug.flags.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon"><CheckCircle size={22} /></div>
                    <div className="empty-state-title">No review flags set</div>
                  </div>
                )}
                {bug.flags.map(flag => (
                  <div key={flag.id} className="flag-row">
                    <FlagBadge flag={flag} />
                    <div className="flag-type-label">{flag.type}</div>
                    {flag.requestee && (
                      <div className="flag-requestee">→ {flag.requestee}</div>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                      {flag.status === '?' && (
                        <>
                          <button
                            className="btn btn-xs"
                            style={{ background: 'var(--color-success-muted)', color: 'var(--color-success)', border: '1px solid hsla(152,62%,52%,0.4)' }}
                            onClick={() => {
                              dispatch({ type: 'UPDATE_BUG_FLAG', payload: { bugId: bug.id, flag: { ...flag, status: '+' } } });
                              showToast(`${flag.type}+ granted`, 'success');
                            }}
                          >+ Grant</button>
                          <button
                            className="btn btn-xs btn-danger"
                            onClick={() => {
                              dispatch({ type: 'UPDATE_BUG_FLAG', payload: { bugId: bug.id, flag: { ...flag, status: '-' } } });
                              showToast(`${flag.type}- denied`, 'warning');
                            }}
                          >− Deny</button>
                        </>
                      )}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(flag.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* === AUDIT LOG TAB === */}
          {activeTab === 'audit' && (
            <div className="audit-list">
              {bug.auditLog.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-title">No audit entries yet</div>
                </div>
              )}
              {bug.auditLog.map(entry => (
                <div key={entry.id} className="audit-entry">
                  <div className="audit-dot" />
                  <span className="audit-user">{entry.user}</span>
                  <span className="audit-field">changed {entry.field}</span>
                  <span className="audit-from">from {entry.oldValue}</span>
                  <span className="audit-arrow">→</span>
                  <span className="audit-to">{entry.newValue}</span>
                  <span className="audit-time">{new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          )}

          {/* === SECURITY TAB === */}
          {activeTab === 'security' && bug.security.isEmbargoed && (
            <>
              <div className="security-embargo-card">
                <div className="security-embargo-header">
                  <Lock size={14} />
                  <span className="security-embargo-title">🔒 Security Embargoed Advisory</span>
                </div>
                {bug.security.cveId && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-danger)', fontSize: '0.9rem' }}>{bug.security.cveId}</span>
                    {bug.security.cvssScore && <CvssChip score={bug.security.cvssScore} />}
                  </div>
                )}
                {bug.security.cvssScore !== undefined && (
                  <div className="cvss-bar-container">
                    <div className="cvss-label">
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>CVSS v3.1 Base Score</span>
                      <span className="cvss-score-value" style={{ color: cvssColor }}>{bug.security.cvssScore.toFixed(1)} / 10</span>
                    </div>
                    <div className="cvss-bar">
                      <div className="cvss-bar-fill" style={{ width: `${(bug.security.cvssScore / 10) * 100}%`, background: cvssColor }} />
                    </div>
                  </div>
                )}
                {bug.security.cvssVector && (
                  <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                    {bug.security.cvssVector}
                  </div>
                )}
              </div>

              {bug.security.embargoExpiry && (
                <div style={{ padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: 14 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>EMBARGO EXPIRY</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-warn)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(bug.security.embargoExpiry).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {Math.ceil((new Date(bug.security.embargoExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                  </div>
                </div>
              )}

              {bug.security.restrictedGroups.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>RESTRICTED ACCESS GROUPS</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {bug.security.restrictedGroups.map(g => (
                      <span key={g} style={{
                        padding: '3px 10px', background: 'var(--color-danger-muted)', border: '1px solid hsla(0,80%,60%,0.3)',
                        borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)'
                      }}><Shield size={10} style={{ display: 'inline', marginRight: 4 }} />{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {bug.security.publicDisclosurePlan && (
                <div style={{ padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>PUBLIC DISCLOSURE PLAN</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{bug.security.publicDisclosurePlan}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
