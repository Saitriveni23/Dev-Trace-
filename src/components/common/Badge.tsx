import React from 'react';
import type { Bug, BugFlag } from '../../types';
import { Lock, Link2, ChevronUp } from 'lucide-react';

/* =============================================
   Severity Badge
   ============================================= */
export function SeverityBadge({ severity }: { severity: Bug['severity'] }) {
  const icons: Record<string, string> = {
    BLOCKER: '⛔', CRITICAL: '🔴', MAJOR: '🟠', NORMAL: '🔵',
    MINOR: '🟢', TRIVIAL: '⚪', ENHANCEMENT: '💜'
  };
  return (
    <span className={`badge badge-severity-${severity}`}>
      {icons[severity]} {severity}
    </span>
  );
}

/* =============================================
   Status Badge
   ============================================= */
export function StatusBadge({ status }: { status: Bug['status'] }) {
  const labels: Record<string, string> = {
    UNCONFIRMED: '? UNCONFIRMED', CONFIRMED: '✓ CONFIRMED',
    IN_PROGRESS: '⟳ IN PROGRESS', RESOLVED: '✔ RESOLVED',
    VERIFIED: '✔✔ VERIFIED', CLOSED: '✕ CLOSED'
  };
  return (
    <span className={`badge badge-status-${status}`}>
      {labels[status] ?? status}
    </span>
  );
}

/* =============================================
   Priority Badge
   ============================================= */
export function PriorityBadge({ priority }: { priority: Bug['priority'] }) {
  return (
    <span className={`badge badge-prio-${priority}`}>
      {priority === 'P1' ? '↑↑ ' : priority === 'P2' ? '↑ ' : priority === 'P5' ? '↓ ' : ''}
      {priority}
    </span>
  );
}

/* =============================================
   Flag Badge
   ============================================= */
export function FlagBadge({ flag }: { flag: BugFlag }) {
  const cls: Record<string, string> = {
    review: 'flag-badge-review',
    needinfo: 'flag-badge-needinfo',
    'sec-audit': 'flag-badge-sec',
    'qa-verify': 'flag-badge-qa',
    'rel-blocker': 'flag-badge-rel'
  };
  const color = cls[flag.type] ?? 'flag-badge-review';
  const statusIcon = { '?': '?', '+': '+', '-': '−', 'X': '✕' }[flag.status];
  return (
    <span className={`flag-badge ${color}`} title={flag.note}>
      {flag.type}{statusIcon}
    </span>
  );
}

/* =============================================
   Security Embargo Indicator
   ============================================= */
export function EmbargoIndicator() {
  return (
    <span title="Security Embargoed" className="security-indicator">
      <Lock size={12} />
    </span>
  );
}

/* =============================================
   Dependency Indicator
   ============================================= */
export function DependencyIndicator({ blocksCount, dependsCount }: { blocksCount: number; dependsCount: number }) {
  if (blocksCount === 0 && dependsCount === 0) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--color-warn)', fontSize: '0.7rem', fontWeight: 700 }}
      title={`Blocks ${blocksCount}, Depends on ${dependsCount}`}
    >
      <Link2 size={11} />
      {blocksCount > 0 && `↑${blocksCount}`}
      {dependsCount > 0 && `↓${dependsCount}`}
    </span>
  );
}

/* =============================================
   Tag chip
   ============================================= */
export function TagChip({ label }: { label: string }) {
  return <span className="tag">#{label}</span>;
}

/* =============================================
   CVSS Score Chip
   ============================================= */
export function CvssChip({ score }: { score: number }) {
  const color = score >= 9 ? 'var(--sev-blocker)' :
    score >= 7 ? 'var(--sev-critical)' :
    score >= 4 ? 'var(--sev-major)' : 'var(--sev-minor)';
  const label = score >= 9 ? 'CRITICAL' : score >= 7 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px',
      background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800, color
    }}>
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
    FIXED: 'var(--color-success)', INVALID: 'var(--text-muted)',
    WONTFIX: 'var(--text-muted)', DUPLICATE: 'var(--color-info)',
    WORKSFORME: 'var(--color-warn)', NOT_A_BUG: 'var(--text-muted)',
    MOVED: 'var(--color-accent)'
  };
  const bg: Record<string, string> = {
    FIXED: 'var(--color-success-muted)', INVALID: 'var(--bg-overlay)',
    WONTFIX: 'var(--bg-overlay)', DUPLICATE: 'var(--color-info-muted)',
    WORKSFORME: 'var(--color-warn-muted)', NOT_A_BUG: 'var(--bg-overlay)',
    MOVED: 'var(--color-accent-muted)'
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
      background: bg[resolution] ?? 'var(--bg-overlay)',
      border: `1px solid ${colors[resolution] ?? 'var(--border)'}44`,
      borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 800,
      color: colors[resolution] ?? 'var(--text-muted)'
    }}>
      {resolution}
    </span>
  );
}
