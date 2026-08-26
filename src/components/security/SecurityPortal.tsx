import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Shield, Lock, Clock, AlertTriangle, ChevronRight, ExternalLink } from 'lucide-react';
import { CvssChip } from '../common/Badge';
import BugDetailPanel from '../bugs/BugDetailView';

export default function SecurityPortal() {
  const { bugs, dispatch, selectedBugId } = useBugs();
  const embargoed = bugs.filter(b => b.security.isEmbargoed);
  const active = embargoed.filter(b => !['CLOSED'].includes(b.status));
  const resolved = embargoed.filter(b => ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(b.status));

  const getDaysUntilExpiry = (expiry?: string) => {
    if (!expiry) return null;
    return Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const totalCvss = active.filter(b => b.security.cvssScore !== undefined);
  const avgCvss = totalCvss.length > 0
    ? (totalCvss.reduce((s, b) => s + (b.security.cvssScore ?? 0), 0) / totalCvss.length).toFixed(1)
    : 'N/A';

  return (
    <div className="security-view">
      {/* Header */}
      <div className="security-header">
        <div className="security-header-icon">
          <Shield size={24} />
        </div>
        <div className="security-header-text">
          <h2>Security Advisory Portal</h2>
          <p>Confidential vulnerability management, embargo tracking, and CVE coordination</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, flexShrink: 0 }}>
          {[
            { label: 'Active Embargoes', value: active.length, color: 'var(--color-danger)' },
            { label: 'Avg CVSS', value: avgCvss, color: 'var(--color-warn)' },
            { label: 'Resolved CVEs', value: resolved.length, color: 'var(--color-success)' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Embargoes */}
      {active.length > 0 && (
        <>
          <div style={{ marginBottom: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} style={{ color: 'var(--color-danger)' }} />
            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-danger)' }}>
              Active Embargoes ({active.length})
            </span>
          </div>
          <div className="embargo-grid" style={{ marginBottom: 24 }}>
            {active.map(bug => {
              const daysLeft = getDaysUntilExpiry(bug.security.embargoExpiry);
              const isUrgent = daysLeft !== null && daysLeft <= 7;
              return (
                <div
                  key={bug.id}
                  className="embargo-card"
                  onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Lock size={13} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                    {bug.security.cveId && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-danger)', fontSize: '0.88rem' }}>
                        {bug.security.cveId}
                      </span>
                    )}
                    {bug.security.cvssScore !== undefined && <CvssChip score={bug.security.cvssScore} />}
                    <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>
                    {bug.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700 }}>{bug.id}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bug.product}</span>
                  </div>
                  {bug.security.embargoExpiry && (
                    <div style={{
                      marginTop: 10, padding: '6px 10px',
                      background: isUrgent ? 'var(--color-danger-muted)' : 'var(--bg-overlay)',
                      border: `1px solid ${isUrgent ? 'var(--border-danger)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      <Clock size={11} style={{ color: isUrgent ? 'var(--color-danger)' : 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isUrgent ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                        {daysLeft !== null
                          ? daysLeft <= 0
                            ? '⚠ Embargo Expired!'
                            : `${daysLeft}d until disclosure`
                          : 'No expiry set'}
                      </span>
                    </div>
                  )}
                  {bug.security.restrictedGroups.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                      {bug.security.restrictedGroups.map(g => (
                        <span key={g} style={{
                          padding: '2px 7px', background: 'var(--color-danger-muted)', border: '1px solid hsla(0,80%,60%,0.2)',
                          borderRadius: 'var(--radius-full)', fontSize: '0.66rem', fontWeight: 700, color: 'var(--color-danger)'
                        }}>{g}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CVSS Calculator callout */}
      <div style={{
        padding: '16px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', marginBottom: 24
      }}>
        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 8 }}>
          🧮 CVSS 3.1 Score Guide
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { range: '9.0–10.0', label: 'Critical', color: 'var(--sev-blocker)', bg: 'var(--sev-blocker-bg)' },
            { range: '7.0–8.9', label: 'High', color: 'var(--sev-critical)', bg: 'var(--sev-critical-bg)' },
            { range: '4.0–6.9', label: 'Medium', color: 'var(--sev-major)', bg: 'var(--sev-major-bg)' },
            { range: '0.1–3.9', label: 'Low', color: 'var(--sev-minor)', bg: 'var(--sev-minor-bg)' },
            { range: '0.0', label: 'None', color: 'var(--text-muted)', bg: 'var(--bg-overlay)' },
          ].map(r => (
            <div key={r.label} style={{
              padding: '6px 14px', background: r.bg, border: `1px solid ${r.color}44`,
              borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span style={{ fontWeight: 900, color: r.color, fontSize: '0.82rem' }}>{r.label}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resolved CVEs */}
      {resolved.length > 0 && (
        <>
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-success)', marginBottom: 12 }}>
            ✓ Resolved CVEs ({resolved.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {resolved.map(bug => (
              <div
                key={bug.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s'
                }}
                onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-success)' }}>
                  {bug.security.cveId ?? '—'}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', flex: 1 }}>{bug.title}</span>
                {bug.security.cvssScore !== undefined && <CvssChip score={bug.security.cvssScore} />}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{bug.id}</span>
                <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </>
      )}

      {embargoed.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Shield size={24} /></div>
          <div className="empty-state-title">No embargoed security issues</div>
          <div className="empty-state-desc">All clear! No confidential CVEs or security embargoes are currently active in the tracker.</div>
        </div>
      )}

      {selectedBugId && (
        <BugDetailPanel
          bugId={selectedBugId}
          onClose={() => dispatch({ type: 'SELECT_BUG', payload: null })}
        />
      )}
    </div>
  );
}
