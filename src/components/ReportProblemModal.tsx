import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { X, HelpCircle, Send } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function ReportProblemModal({ onClose }: Props) {
  const { showToast } = useBugs();
  const [issue, setIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    setIsSubmitting(true);
    // Simulate sending feedback
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Tip received! The Chief will look into it.', 'success');
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div 
        className="modal-content"
        style={{
          background: 'var(--paper-beige)',
          color: 'var(--text-dark)',
          width: '100%',
          maxWidth: '500px',
          borderRadius: '4px',
          boxShadow: '8px 12px 0px rgba(0,0,0,0.85)',
          border: '2.5px solid var(--text-dark)',
          position: 'relative',
          transform: 'rotate(1deg)'
        }}
      >
        {/* Tape decoration */}
        <div className="tape-strip" style={{ width: '120px', top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 30px 16px', borderBottom: '2px dashed rgba(0,0,0,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-coral)' }}>
              <HelpCircle size={24} />
              <h2 style={{ fontFamily: 'var(--font-marker)', fontSize: '2rem', margin: 0, color: 'var(--text-dark)' }}>
                Report a Problem
              </h2>
            </div>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', margin: '4px 0 0', color: 'var(--text-muted)' }}>
              Submit a confidential tip about DevTrace.
            </p>
          </div>
          <button 
            className="navbar-icon-btn" 
            onClick={onClose}
            style={{ color: 'var(--text-dark)', border: '2px solid transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 30px 30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-marker)', fontSize: '1.2rem', marginBottom: '8px' }}>
              What's the issue, detective?
            </label>
            <textarea
              className="sketch-input"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the glitch you found in our workspace..."
              rows={5}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-hand)',
                fontSize: '1.2rem',
                border: '2px solid rgba(0,0,0,0.1)',
                borderRadius: '4px',
                padding: '12px',
                resize: 'none'
              }}
              autoFocus
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              className="navbar-btn"
              onClick={onClose}
              style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', background: 'transparent', color: 'var(--text-dark)' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="navbar-btn navbar-btn-primary"
              disabled={isSubmitting || !issue.trim()}
              style={{ 
                fontFamily: 'var(--font-marker)', 
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transform: 'rotate(-1deg)'
              }}
            >
              {isSubmitting ? (
                <>Sending...</>
              ) : (
                <>
                  <Send size={16} /> Submit Tip
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
