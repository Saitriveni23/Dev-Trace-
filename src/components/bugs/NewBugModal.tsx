import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug, BugSeverity, BugPriority, OperatingSystem, Architecture } from '../../types';
import { X, Plus, AlertTriangle } from 'lucide-react';

interface Props { onClose: () => void; }

const SEVERITIES: BugSeverity[] = ['BLOCKER', 'CRITICAL', 'MAJOR', 'NORMAL', 'MINOR', 'TRIVIAL', 'ENHANCEMENT'];
const PRIORITIES: BugPriority[] = ['P1', 'P2', 'P3', 'P4', 'P5'];
const OS_OPTIONS: OperatingSystem[] = ['macOS', 'Linux', 'Windows', 'iOS', 'Android', 'All'];
const ARCH_OPTIONS: Architecture[] = ['ARM64', 'x86_64', 'Wasm', 'Universal', 'All'];

export default function NewBugModal({ onClose }: Props) {
  const { products, currentUser, dispatch, showToast } = useBugs();
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [product, setProduct] = useState(products[0]?.name ?? '');
  const [component, setComponent] = useState('');
  const [severity, setSeverity] = useState<BugSeverity>('NORMAL');
  const [priority, setPriority] = useState<BugPriority>('P3');
  const [os, setOs] = useState<OperatingSystem>('All');
  const [arch, setArch] = useState<Architecture>('All');
  const [environment, setEnvironment] = useState('');
  const [version, setVersion] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [tags, setTags] = useState('');

  const selectedProduct = products.find(p => p.name === product);
  const components = selectedProduct?.components ?? [];
  const versions = selectedProduct?.versions ?? [];
  const milestones = selectedProduct?.milestones ?? [];

  const steps = ['Product & Component', 'Bug Details', 'Environment', 'Review'];

  const handleSubmit = () => {
    if (!title.trim() || !product || !component) {
      showToast('Title, product, and component are required', 'error');
      return;
    }
    const now = new Date().toISOString();
    const latestNum = 1100 + Math.floor(Math.random() * 100);
    const newBug: Bug = {
      id: `DT-${latestNum}`,
      numId: latestNum,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      product,
      component,
      version: version || (versions[0] ?? 'HEAD'),
      targetMilestone: milestones[0] ?? 'Unspecified',
      status: 'UNCONFIRMED',
      resolution: null,
      duplicateBugs: [],
      severity,
      priority,
      reporter: currentUser.name,
      reporterEmail: currentUser.email,
      assignee: currentUser.name,
      assigneeEmail: currentUser.email,
      ccList: [],
      os,
      architecture: arch,
      environment: environment.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      flags: [],
      dependsOn: [],
      blocks: [],
      security: { isEmbargoed: false, restrictedGroups: [] },
      timeTracking: { estimatedHours: 0, spentHours: 0, remainingHours: 0 },
      stackTrace: stackTrace.trim() || undefined,
      comments: [],
      attachments: [],
      auditLog: [
        {
          id: `aud-new-${Date.now()}`,
          timestamp: now,
          user: currentUser.username,
          field: 'Status',
          oldValue: '',
          newValue: 'UNCONFIRMED'
        }
      ],
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'CREATE_BUG', payload: newBug });
    showToast(`Bug ${newBug.id} filed successfully`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <Plus size={18} style={{ color: 'var(--color-primary)' }} />
          <h2 className="modal-title">File a Bug Report</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Step progress */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 0, alignItems: 'center' }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: i <= step ? 'pointer' : 'default' }}
                onClick={() => i <= step && setStep(i)}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 800,
                  background: i === step ? 'var(--color-primary-muted)' : i < step ? 'var(--color-success-muted)' : 'var(--bg-overlay)',
                  color: i === step ? 'var(--color-primary)' : i < step ? 'var(--color-success)' : 'var(--text-muted)',
                  border: `2px solid ${i === step ? 'var(--color-primary)' : i < step ? 'var(--color-success)' : 'var(--border)'}`,
                  flexShrink: 0
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: i === step ? 700 : 500, color: i === step ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < step ? 'var(--color-success)' : 'var(--border-subtle)', margin: '0 8px', minWidth: 16 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="modal-body">
          {/* Step 0: Product & Component */}
          {step === 0 && (
            <>
              <div className="form-group">
                <label className="form-label">Product <span className="required">*</span></label>
                <select className="form-select" value={product} onChange={e => { setProduct(e.target.value); setComponent(''); setVersion(''); }}>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Component <span className="required">*</span></label>
                <select className="form-select" value={component} onChange={e => setComponent(e.target.value)}>
                  <option value="">-- Select Component --</option>
                  {components.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                {component && components.find(c => c.name === component) && (
                  <div className="form-hint">{components.find(c => c.name === component)?.description}</div>
                )}
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Version</label>
                  <select className="form-select" value={version} onChange={e => setVersion(e.target.value)}>
                    {versions.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select className="form-select" value={severity} onChange={e => setSeverity(e.target.value as BugSeverity)}>
                    {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      style={{
                        flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.85rem',
                        border: `2px solid ${priority === p ? 'var(--color-primary)' : 'var(--border)'}`,
                        background: priority === p ? 'var(--color-primary-muted)' : 'var(--bg-overlay)',
                        color: priority === p ? 'var(--color-primary)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.15s'
                      }}
                    >{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 1: Bug Details */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Title / Summary <span className="required">*</span></label>
                <input
                  className="form-input"
                  placeholder="Concise description of the bug (be specific)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Full Description (Markdown)</label>
                <textarea
                  className="form-textarea"
                  placeholder={`### Summary\n\n### Steps to Reproduce\n1. \n2. \n\n### Expected Result\n\n### Actual Result`}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={8}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  className="form-input"
                  placeholder="e.g. regression, crash, security, ui"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 2: Environment */}
          {step === 2 && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Operating System</label>
                  <select className="form-select" value={os} onChange={e => setOs(e.target.value as OperatingSystem)}>
                    {OS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Architecture</label>
                  <select className="form-select" value={arch} onChange={e => setArch(e.target.value as Architecture)}>
                    {ARCH_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Environment Details</label>
                <input
                  className="form-input"
                  placeholder="e.g. Ubuntu 24.04, Node v20.12, V8 v12.4, glibc 2.38"
                  value={environment}
                  onChange={e => setEnvironment(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stack Trace / Crash Log (optional)</label>
                <textarea
                  className="form-textarea"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                  placeholder="Paste crash trace, ASAN output, or panic log here…"
                  value={stackTrace}
                  onChange={e => setStackTrace(e.target.value)}
                  rows={6}
                />
              </div>
            </>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <>
              <div style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Bug Summary Preview</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 8, color: 'var(--text-primary)' }}>{title || <span style={{ color: 'var(--color-danger)', fontStyle: 'italic' }}>No title provided</span>}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className={`badge badge-severity-${severity}`}>{severity}</span>
                  <span className={`badge badge-prio-${priority}`}>{priority}</span>
                  <span className="tag">#{product}</span>
                  {component && <span className="tag">#{component}</span>}
                </div>
                {description && (
                  <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, maxHeight: 100, overflow: 'hidden' }}>
                    {description.slice(0, 200)}{description.length > 200 && '…'}
                  </div>
                )}
              </div>
              {!title.trim() && (
                <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: 'var(--color-danger-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-danger)', marginBottom: 12 }}>
                  <AlertTriangle size={14} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                    A title / summary is required before filing.
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {step < steps.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && !component}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!title.trim() || !component}
            >
              <Plus size={14} /> File Bug Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
