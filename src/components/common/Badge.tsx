import React from 'react';
import type { Bug, BugFlag } from '../../types';
import { Lock, Link2 } from 'lucide-react';

/* =============================================
   Severity Badge - Redesigned as an Ink Stamp
   ============================================= */
export function SeverityBadge({ severity }: { severity: Bug['severity'] }) {
  const icons: Record<string, string> = {
    BLOCKER: '💥', CRITICAL: '🚨', MAJOR: '🔥', NORMAL: '✏️',
    MINOR: '🍃', TRIVIAL: '🥚', ENHANCEMENT: '✨'
  };
  return (
    <span className={`badge badge-stamp badge-severity-${severity}`} style={{ fontSize: '0.72rem', display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
      <span>{icons[severity]}</span>
      <span>{severity}</span>
    </span>
  );
}

/* =============================================
   Status Badge - Redesigned as handwritten label
   ============================================= */
export function StatusBadge({ status }: { status: Bug['status'] }) {
  const labels: Record<string, string> = {
    UNCONFIRMED: 'unconfirmed?', CONFIRMED: 'confirmed ✓',
    IN_PROGRESS: 'working ✎', RESOLVED: 'resolved ✔',
    VERIFIED: 'verified ★', CLOSED: 'closed ✕'
  };
  return (
    <span className={`badge badge-status badge-status-${status}`}>
      {labels[status] ?? status}
    </span>
  );
}

/* =============================================
   Priority Badge - Circled marker look
   ============================================= */
export function PriorityBadge({ priority }: { priority: Bug['priority'] }) {
  const bgColors: Record<string, string> = {
    P1: 'var(--accent-coral)',
    P2: 'var(--accent-coral)',
    P3: 'var(--accent-yellow)',
    P4: 'var(--accent-mint)',
    P5: 'var(--accent-mint)',
  };
  const color = bgColors[priority] || 'var(--accent-yellow)';
  
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid var(--text-dark)',
        background: color,
        color: 'var(--text-dark)',
        fontWeight: 800,
        fontSize: '0.75rem',
        boxShadow: '1px 1px 0px rgba(0,0,0,0.8)',
        fontFamily: 'var(--font-mono)'
      }}
      title={`Priority ${priority}`}
    >
      {priority}
    </span>
  );
}

/* =============================================
   Flag Badge - Bookmark style
   ============================================= */
export function FlagBadge({ flag }: { flag: BugFlag }) {
  const bgColors: Record<string, string> = {
    review: 'var(--accent-yellow)',
    needinfo: 'var(--accent-purple)',
    'sec-audit': 'var(--accent-coral)',
    'qa-verify': 'var(--accent-mint)',
    'rel-blocker': 'var(--accent-coral)'
  };
  const color = bgColors[flag.type] ?? 'var(--accent-yellow)';
  const statusIcon = { '?': '?', '+': '+', '-': '−', 'X': '✕' }[flag.status];
  
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        background: color,
        color: 'var(--text-dark)',
        border: '1.5px solid var(--text-dark)',
        borderRadius: '3px',
        fontSize: '0.68rem',
        fontWeight: 800,
        fontFamily: 'var(--font-mono)',
        boxShadow: '1.5px 1.5px 0px rgba(0, 0, 0, 0.9)',
        transform: 'rotate(-1deg)'
      }}
      title={flag.note}
    >
      <span>{flag.type}</span>
      <span style={{ borderLeft: '1px solid var(--text-dark)', paddingLeft: '4px', fontWeight: 900 }}>
        {statusIcon}
      </span>
    </span>
  );
}

/* =============================================
   Security Embargo Indicator
   ============================================= */
export function EmbargoIndicator() {
  return (
    <span 
      title="Security Embargoed" 
      style={{ 
        color: 'var(--accent-coral)', 
        marginRight: 6, 
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle'
      }}
    >
      <Lock size={12} strokeWidth={2.5} />
    </span>
  );
}

/* =============================================
   Dependency Indicator
   ============================================= */
export function DependencyIndicator({ blocksCount, dependsCount }: { blocksCount: number; dependsCount: number }) {
  if (blocksCount === 0 && dependsCount === 0) return null;
  return (
    <span 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 3, 
        color: 'var(--text-dark)', 
        fontSize: '0.7rem', 
        fontWeight: 800,
        background: 'rgba(255, 255, 255, 0.6)',
        padding: '1px 5px',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: '3px',
        transform: 'rotate(-1deg)'
      }}
      title={`Blocks ${blocksCount}, Depends on ${dependsCount}`}
    >
      <Link2 size={11} strokeWidth={2.5} />
      {blocksCount > 0 && `↑${blocksCount}`}
      {dependsCount > 0 && `↓${dependsCount}`}
    </span>
  );
}

/* =============================================
   Tag chip - Masking Tape look
   ============================================= */
export function TagChip({ label }: { label: string }) {
  return <span className="tag">#{label}</span>;
}

/* =============================================
   CVSS Score Chip
   ============================================= */
export function CvssChip({ score }: { score: number }) {
  const color = score >= 9 ? 'var(--accent-coral)' :
    score >= 7 ? 'var(--accent-coral)' :
    score >= 4 ? 'var(--accent-yellow)' : 'var(--accent-mint)';
  const label = score >= 9 ? 'CRITICAL' : score >= 7 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      background: 'white',
      border: '2px solid var(--text-dark)',
      borderRadius: '4px',
      fontSize: '0.72rem',
      fontWeight: 800,
      color: 'var(--text-dark)',
      boxShadow: '2px 2px 0px rgba(0,0,0,0.9)',
      transform: 'rotate(-1deg)'
    }}>
      <span style={{ 
        width: 8, 
        height: 8, 
        borderRadius: '50%', 
        background: color, 
        border: '1px solid var(--text-dark)',
        display: 'inline-block' 
      }}></span>
      CVSS {score.toFixed(1)} · {label}
    </span>
  );
}

/* =============================================
   Resolution chip
   ============================================= */
export function ResolutionBadge({ resolution }: { resolution: Bug['resolution'] }) {
  if (!resolution) return null;
  const colors: Record<string, string> = {
    FIXED: 'var(--accent-mint)', INVALID: 'var(--text-muted)',
    WONTFIX: 'var(--text-muted)', DUPLICATE: 'var(--accent-purple)',
    WORKSFORME: 'var(--accent-yellow)', NOT_A_BUG: 'var(--text-muted)',
    MOVED: 'var(--accent-purple)'
  };
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      background: colors[resolution] || 'var(--accent-yellow)',
      border: '2px solid var(--text-dark)',
      borderRadius: '4px',
      fontSize: '0.72rem',
      fontWeight: 800,
      color: 'var(--text-dark)',
      boxShadow: '2.5px 2.5px 0px rgba(0,0,0,0.9)',
      transform: 'rotate(1.5deg)'
    }}>
      {resolution}
    </span>
  );
}
