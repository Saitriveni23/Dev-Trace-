import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug, BugStatus, BugResolution, BugAttachment } from '../../types';
import { SeverityBadge, PriorityBadge } from '../common/Badge';
import { X, Sparkles, Send, CheckSquare, Square, Paperclip, Printer, Image, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { TEAM_MEMBERS } from '../team/TeamView';

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

export default function BugDetailPanel({ bugId, onClose }: Props) {
  const { getBugById, dispatch, currentUser, showToast } = useBugs();
  const bug = getBugById(bugId);
  const [newComment, setNewComment] = useState('');

  // Interactive reproduction checklist state
  const [reproSteps, setReproSteps] = useState([
    { id: 1, text: 'Clear compiler build cache directories.', done: true },
    { id: 2, text: 'Trigger rapid double loader clicks.', done: false },
    { id: 3, text: ' Sanity check client handshake index pools.', done: false },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !bug) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `bugs/${bug.id}/${Date.now()}_${file.name}`);
      const uploadSnapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadSnapshot.ref);

      const newAttachment: BugAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: 'screenshot',
        uploadedBy: currentUser.name,
        uploadedAt: new Date().toISOString(),
        url: downloadURL
      };

      const updatedAttachments = [...(bug.attachments || []), newAttachment];
      dispatch({
        type: 'UPDATE_BUG',
        payload: {
          ...bug,
          attachments: updatedAttachments
        }
      });

      confetti({ particleCount: 30, spread: 20 });
      showToast('Polaroid evidence snapshot attached to case dossier! 📸', 'success');
    } catch (error: any) {
      console.error('Evidence upload failed:', error);
      showToast(`Evidence upload failed: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  if (!bug) return null;

  const handleStatusChange = (newStatus: BugStatus) => {
    dispatch({
      type: 'UPDATE_BUG_STATUS',
      payload: {
        id: bug.id,
        status: newStatus,
        resolution: ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(newStatus) ? 'FIXED' : null
      }
    });

    if (['RESOLVED', 'VERIFIED'].includes(newStatus)) {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast('Glitch resolved! Victory confetti dispatched! 🥳🎉', 'success');
    } else {
      showToast(`Status updated: ${newStatus}`, 'success');
    }
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assigneeName = e.target.value;
    const member = TEAM_MEMBERS.find(m => m.name === assigneeName);
    
    dispatch({
      type: 'UPDATE_BUG',
      payload: {
        ...bug,
        assignee: assigneeName,
        assigneeEmail: member ? `${member.name.toLowerCase()}@devtrace.app` : bug.assigneeEmail
      }
    });
    showToast(`Case assigned to ${assigneeName}`, 'success');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
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
    
    confetti({ particleCount: 30, spread: 30 });
    showToast('Clue memo pinned!', 'success');
    setNewComment('');
  };

  const toggleReproStep = (id: number) => {
    setReproSteps(reproSteps.map(step => {
      if (step.id === id) {
        const nextDone = !step.done;
        if (nextDone) {
          confetti({ particleCount: 20, spread: 20 });
        }
        return { ...step, done: nextDone };
      }
      return step;
    }));
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="detail-panel-overlay" onClick={onClose}>
      
      {/* Dossier Investigation Folder Container */}
      <div 
        className="detail-panel" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '1000px',
          background: 'var(--paper-beige)',
          color: 'var(--text-dark)',
          border: '4.5px solid var(--text-dark)',
          boxShadow: '12px 12px 0px rgba(0, 0, 0, 0.95)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Metal Binder Clips on top */}
        <div style={{ position: 'absolute', top: '-14px', left: '80px', width: '32px', height: '24px', background: '#3F3D56', border: '2.5px solid var(--text-dark)', borderRadius: '4px' }} />
        <div style={{ position: 'absolute', top: '-14px', right: '80px', width: '32px', height: '24px', background: '#3F3D56', border: '2.5px solid var(--text-dark)', borderRadius: '4px' }} />

        {/* Bug Title Taped to Notebook */}
        <div 
          style={{ 
            background: 'var(--accent-yellow)', 
            color: 'var(--text-dark)', 
            border: '2.5px solid var(--text-dark)', 
            padding: '12px 18px', 
            borderRadius: '2px',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
            transform: 'rotate(-1deg)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Masking tape */}
          <div className="tape-strip" style={{ width: '60px', top: '-10px', left: '30px' }}></div>
          
          <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.25rem' }}>
            CASE #{bug.id}: {bug.title}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="navbar-icon-btn print-doodle-btn"
              onClick={() => window.print()}
              style={{ background: 'var(--text-dark)', color: 'white', border: '2px solid white', borderRadius: '50%', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              data-tooltip="Print this case dossier"
              data-tooltip-pos="bottom"
            >
              <Printer size={13} strokeWidth={2.5} />
            </button>
            <button
              className="modal-close-doodle"
              onClick={onClose}
              style={{ background: 'var(--text-dark)', color: 'white', border: '2px solid white', borderRadius: '50%', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              data-tooltip="Close this case dossier"
              data-tooltip-pos="bottom"
            >
              <X size={13} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Dossier contents split layout */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* LEFT DOSSIER PAGE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Description on notebook paper */}
            <div 
              style={{
                background: 'white',
                backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px)',
                backgroundSize: '100% 24px',
                border: '2.5px solid var(--text-dark)',
                borderRadius: '6px',
                padding: '20px 20px 20px 40px',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
                position: 'relative',
                lineHeight: '24px'
              }}
            >
              <div style={{ position: 'absolute', left: '30px', top: 0, bottom: 0, width: '2px', borderLeft: '2px solid rgba(255, 123, 107, 0.4)' }} />
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.15rem', color: 'var(--accent-purple)', display: 'block', marginBottom: '12px' }}>
                Case Description Memo
              </span>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', color: 'var(--text-dark)', whiteSpace: 'pre-wrap', margin: 0 }}>
                {bug.description}
              </p>
            </div>

            {/* Evidence checklist */}
            <div style={{ background: 'var(--paper-blue)', border: '2px solid var(--text-dark)', borderRadius: '6px', padding: '18px', boxShadow: '4px 4px 0px rgba(0,0,0,0.15)', transform: 'rotate(0.5deg)' }}>
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.1rem', display: 'block', marginBottom: '12px', color: 'var(--text-dark)' }}>
                Evidence Reproduction Checklist
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {reproSteps.map(step => (
                  <div
                    key={step.id}
                    onClick={() => toggleReproStep(step.id)}
                    data-tooltip={step.done ? 'Mark this step as not reproduced' : 'Mark this step as reproduced'}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      fontFamily: 'var(--font-hand)',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textDecoration: step.done ? 'line-through' : 'none',
                      color: step.done ? 'rgba(0,0,0,0.35)' : 'var(--text-dark)'
                    }}
                  >
                    {step.done ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pinned screenshots gallery */}
            <div style={{ position: 'relative', background: 'white', border: '2.5px solid var(--text-dark)', borderRadius: '6px', padding: '18px', boxShadow: '4px 4px 0px rgba(0,0,0,0.15)' }}>
              <div className="tape-strip" style={{ width: '70px', top: '-10px', left: '20px' }}></div>
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.1rem', display: 'block', marginBottom: '14px', color: 'var(--text-dark)' }}>
                Evidence Screenshots Pinned
              </span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {(bug.attachments || [])
                  .filter(a => a.type === 'screenshot' && a.url)
                  .map((att, idx) => {
                    const angle = (idx % 2 === 0) ? -2 : 2;
                    return (
                      <div 
                        key={att.id} 
                        style={{ 
                          background: 'var(--paper-beige)', 
                          border: '1.5px solid var(--text-dark)', 
                          padding: '6px 6px 16px', 
                          boxShadow: '2px 2px 0px rgba(0,0,0,0.85)', 
                          transform: `rotate(${angle}deg)`, 
                          position: 'relative' 
                        }}
                      >
                        <div className="tape-strip-side" style={{ transform: `rotate(${angle * 22.5}deg)`, top: '-6px', right: '-6px', width: '24px', height: '8px' }}></div>
                        <img 
                          src={att.url} 
                          alt={att.name} 
                          style={{ width: '100%', height: '90px', objectFit: 'cover', border: '1px solid var(--text-dark)' }} 
                        />
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', textAlign: 'center', marginTop: '6px', fontWeight: 900, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {att.name.toUpperCase()}
                        </div>
                      </div>
                    );
                  })}

                {/* Upload attachment Polaroids card */}
                <div
                  onClick={() => !isUploading && document.getElementById('screenshot-file-picker')?.click()}
                  data-tooltip={isUploading ? 'Uploading file...' : 'Upload a screenshot as evidence'}
                  style={{
                    background: 'rgba(0,0,0,0.02)',
                    border: '2px dashed rgba(0,0,0,0.15)',
                    borderRadius: '4px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    minHeight: '125px',
                    textAlign: 'center',
                    opacity: isUploading ? 0.6 : 1
                  }}
                >
                  <input 
                    type="file" 
                    id="screenshot-file-picker" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleScreenshotUpload}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={18} style={{ color: 'rgba(0,0,0,0.4)', marginBottom: '4px' }} />
                  ) : (
                    <Image size={18} style={{ color: 'rgba(0,0,0,0.4)', marginBottom: '4px' }} />
                  )}
                  <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase' }}>
                    {isUploading ? 'Uploading...' : 'Pin Evidence File'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Root Cause sticky note */}
            <div className="metric-sticky-card note-purple" style={{ transform: 'rotate(-1.5deg)', minHeight: 'auto', padding: '18px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
              <div className="tape-strip" style={{ width: '60px', top: '-10px' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px dashed rgba(0,0,0,0.15)', paddingBottom: '6px', marginBottom: '8px', width: '100%' }}>
                <Sparkles size={14} style={{ color: 'var(--text-dark)' }} />
                <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1rem', color: 'var(--text-dark)' }}>AI Root Cause Diagnosis</span>
              </div>
              <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', color: 'var(--text-dark)', textAlign: 'left', lineHeight: 1.3, width: '100%', margin: 0 }}>
                ✍ "Glitch maps to connection pool init leaks. SANITY CHECK: Ensure version trace matches connection drivers."
              </p>
            </div>

            {/* Related issues connected with red thread */}
            <div style={{ background: 'var(--paper-pink)', border: '2px solid var(--text-dark)', borderRadius: '6px', padding: '18px', boxShadow: '4px 4px 0px rgba(0,0,0,0.15)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                {/* Red thread indicator */}
                <div style={{ width: 14, height: 3, background: 'var(--accent-coral)' }}></div>
                <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.1rem' }}>Red-Thread Connected Cases</span>
              </div>

              {/* Red String Line connector graphics */}
              <div style={{ position: 'relative', display: 'flex', gap: '20px' }}>
                
                {/* Simulated Red string SVG thread connector */}
                <svg style={{ position: 'absolute', top: '15px', left: '80px', width: '120px', height: '24px', pointerEvents: 'none', stroke: 'var(--accent-coral)', strokeWidth: '3' }}>
                  <path d="M 0 5 Q 60 20 120 5" fill="none" strokeDasharray="3 3" />
                </svg>

                <div style={{ background: 'white', border: '1.5px solid var(--text-dark)', padding: '8px 12px', borderRadius: '4px', boxShadow: '2px 2px 0px rgba(0,0,0,0.9)', transform: 'rotate(-2deg)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 900, color: 'var(--accent-coral)' }}>#BS-1045</span>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold' }}>Phantom Scroll</div>
                </div>

                <div style={{ background: 'white', border: '1.5px solid var(--text-dark)', padding: '8px 12px', borderRadius: '4px', boxShadow: '2px 2px 0px rgba(0,0,0,0.9)', transform: 'rotate(1.5deg)', marginLeft: '60px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 900, color: 'var(--accent-coral)' }}>#BS-1112</span>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold' }}>Infinite Loop</div>
                </div>
              </div>
            </div>

            {/* Timeline drawn vertically */}
            <div style={{ background: '#17161F', border: '2px solid var(--text-dark)', borderRadius: '6px', padding: '18px', color: 'white', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '14px' }}>
                Case Audit Log Trail
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px' }}>
                {/* Vertical dotted bar */}
                <div style={{ position: 'absolute', left: '8px', top: '4px', bottom: '4px', width: '2px', borderLeft: '2px dashed rgba(255,255,255,0.15)' }} />

                {bug.auditLog.map((log, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-22px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-yellow)' }} />
                    <div style={{ fontSize: '0.82rem', fontWeight: 900 }}>
                      {log.user} modified <span style={{ color: 'var(--accent-coral)' }}>{log.field}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.6 }}>
                      Changed from "{log.oldValue || 'none'}" to "{log.newValue}" • {formatDate(log.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Assignee Polaroid card */}
            <div 
              style={{
                background: 'white',
                border: '2.5px solid var(--text-dark)',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.9)',
                transform: 'rotate(-1deg)',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div className="tape-strip" style={{ width: '60px', top: '-10px' }}></div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2.5px solid var(--text-dark)', margin: '0 auto 10px', overflow: 'hidden', background: 'var(--paper-beige)' }}>
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${bug.assigneeEmail}`} 
                  alt="assignee" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              
              <select 
                value={bug.assignee}
                onChange={handleAssigneeChange}
                style={{ fontFamily: 'var(--font-marker)', fontSize: '1.1rem', color: 'var(--text-dark)', background: 'transparent', border: '1px solid var(--text-dark)', borderRadius: '4px', textAlign: 'center', width: '100%', marginBottom: '4px' }}
              >
                {TEAM_MEMBERS.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>

              <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'rgba(0,0,0,0.5)', fontWeight: 'bold' }}>Lead Detective</div>
            </div>

            {/* Severity Sticker */}
            <div style={{ background: 'var(--paper-yellow)', border: '2px solid var(--text-dark)', padding: '12px 16px', borderRadius: '4px', boxShadow: '3px 3px 0px rgba(0,0,0,0.95)', transform: 'rotate(1.5deg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.9rem', color: 'var(--text-dark)' }}>CASE SEVERITY</span>
              <SeverityBadge severity={bug.severity} />
            </div>

            {/* Priority Sticker */}
            <div style={{ background: 'var(--paper-blue)', border: '2px solid var(--text-dark)', padding: '12px 16px', borderRadius: '4px', boxShadow: '3px 3px 0px rgba(0,0,0,0.95)', transform: 'rotate(-1deg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '0.9rem', color: 'var(--text-dark)' }}>CASE PRIORITY</span>
              <PriorityBadge priority={bug.priority} />
            </div>

            {/* Developer comments inside sticky notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.1rem' }}>Dispatch Memos</span>
              
              {bug.comments.length === 0 ? (
                <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', fontStyle: 'italic', opacity: 0.5 }}>
                  No comments logged. Pinned clue sticky below.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {bug.comments.map((comment, idx) => (
                    <div 
                      key={comment.id}
                      className="metric-sticky-card"
                      style={{
                        background: '#FDFBF7',
                        border: '1.5px solid var(--text-dark)',
                        borderRadius: '4px',
                        minHeight: 'auto',
                        padding: '12px 14px',
                        boxShadow: '2.5px 2.5px 0px rgba(0,0,0,0.95)',
                        transform: `rotate(${(idx % 2 === 0 ? -1.5 : 2)}deg)`,
                        alignItems: 'flex-start'
                      }}
                    >
                      <div className="tape-strip" style={{ width: '40px', top: '-8px', left: '10px' }}></div>
                      <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', color: 'var(--text-dark)', margin: '0 0 6px 0', fontWeight: 'bold', lineHeight: 1.2 }}>
                        {comment.content}
                      </p>
                      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '0.62rem', opacity: 0.5, fontWeight: 900, color: 'var(--text-dark)' }}>
                        <span>{comment.author}</span>
                        <span>{formatDate(comment.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  placeholder="Scribe new clue..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  style={{
                    border: '2px solid var(--text-dark)',
                    borderRadius: '4px',
                    background: 'white',
                    padding: '8px 10px',
                    flex: 1,
                    fontFamily: 'var(--font-hand)',
                    fontSize: '1.1rem',
                    color: 'var(--text-dark)',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ border: '2px solid var(--text-dark)', padding: '6px 12px' }}
                  data-tooltip="Post this comment to the case"
                >
                  Pin Clue
                </button>
              </form>
            </div>

            {/* Case Actions */}
            <div style={{ borderTop: '2px dashed rgba(0,0,0,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.45)' }}>Case Status Manager</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(STATUS_TRANSITIONS[bug.status] ?? []).map(s => (
                  <button
                    key={s}
                    className="btn btn-secondary btn-sm"
                    style={{ border: '1.5px solid var(--text-dark)', color: 'var(--text-dark)', fontWeight: 'bold' }}
                    onClick={() => handleStatusChange(s)}
                    data-tooltip={`Change case status to ${s}`}
                  >
                    → {s}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Media Print styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .detail-panel-overlay {
              background: transparent !important;
              position: static !important;
              padding: 0 !important;
            }
            .detail-panel, .detail-panel * {
              visibility: visible;
            }
            .detail-panel {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border: 3.5px solid black !important;
              background: white !important;
              color: black !important;
              padding: 0 !important;
            }
            .modal-close-doodle, .print-doodle-btn, form, input, button {
              display: none !important;
            }
          }
        `}</style>

      </div>
    </div>
  );
}
