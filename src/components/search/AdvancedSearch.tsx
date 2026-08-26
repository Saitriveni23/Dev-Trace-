import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Search, Plus, Trash2, Play, ChevronDown, X } from 'lucide-react';
import type { Bug } from '../../types';
import { SeverityBadge, StatusBadge, PriorityBadge } from '../common/Badge';
import BugDetailPanel from '../bugs/BugDetailView';

type FieldKey = keyof Bug | 'any_text' | 'is_blocked' | 'is_blocker';
type Operator = 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in' | 'is_empty';

interface Condition {
  id: string;
  field: FieldKey;
  operator: Operator;
  value: string;
}

const FIELD_OPTIONS: { value: FieldKey; label: string }[] = [
  { value: 'any_text', label: 'Any Text' },
  { value: 'title', label: 'Title' },
  { value: 'id', label: 'Bug ID' },
  { value: 'status', label: 'Status' },
  { value: 'severity', label: 'Severity' },
  { value: 'priority', label: 'Priority' },
  { value: 'product', label: 'Product' },
  { value: 'component', label: 'Component' },
  { value: 'assignee', label: 'Assignee' },
  { value: 'reporter', label: 'Reporter' },
  { value: 'os', label: 'OS' },
  { value: 'is_blocker', label: 'Is Blocker' },
  { value: 'is_blocked', label: 'Is Blocked' },
];

const OPERATOR_OPTIONS: { value: Operator; label: string }[] = [
  { value: 'equals', label: '= equals' },
  { value: 'not_equals', label: '≠ not equals' },
  { value: 'contains', label: '∋ contains' },
  { value: 'in', label: '∈ is one of' },
  { value: 'is_empty', label: '∅ is empty' },
];

function applyCondition(bug: Bug, cond: Condition): boolean {
  const val = cond.value.trim().toLowerCase();
  switch (cond.field) {
    case 'any_text':
      return bug.title.toLowerCase().includes(val) || bug.description.toLowerCase().includes(val) || bug.id.toLowerCase().includes(val);
    case 'title': return bug.title.toLowerCase().includes(val);
    case 'id': return bug.id.toLowerCase() === val;
    case 'status':
      return cond.operator === 'equals' ? bug.status === val.toUpperCase() :
        cond.operator === 'not_equals' ? bug.status !== val.toUpperCase() : true;
    case 'severity':
      return cond.operator === 'equals' ? bug.severity === val.toUpperCase() :
        cond.operator === 'not_equals' ? bug.severity !== val.toUpperCase() : true;
    case 'priority':
      return cond.operator === 'equals' ? bug.priority === val.toUpperCase() :
        cond.operator === 'not_equals' ? bug.priority !== val.toUpperCase() : true;
    case 'product': return bug.product.toLowerCase().includes(val);
    case 'component': return bug.component.toLowerCase().includes(val);
    case 'assignee': return bug.assignee.toLowerCase().includes(val) || bug.assigneeEmail.toLowerCase().includes(val);
    case 'reporter': return bug.reporter.toLowerCase().includes(val);
    case 'os': return bug.os.toLowerCase() === val || val === 'all';
    case 'is_blocker': return bug.blocks.length > 0;
    case 'is_blocked': return bug.dependsOn.length > 0;
    default: return true;
  }
}

export default function AdvancedSearch() {
  const { bugs, dispatch, selectedBugId } = useBugs();
  const [conjunction, setConjunction] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: 'c-1', field: 'any_text', operator: 'contains', value: '' }
  ]);
  const [results, setResults] = useState<Bug[] | null>(null);

  const addCondition = () => {
    setConditions(cs => [...cs, { id: `c-${Date.now()}`, field: 'status', operator: 'equals', value: '' }]);
  };

  const removeCondition = (id: string) => {
    setConditions(cs => cs.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, patch: Partial<Condition>) => {
    setConditions(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const runSearch = () => {
    const res = bugs.filter(bug => {
      const matches = conditions.map(c => applyCondition(bug, c));
      return conjunction === 'AND' ? matches.every(Boolean) : matches.some(Boolean);
    });
    setResults(res);
  };

  const clearSearch = () => {
    setResults(null);
    setConditions([{ id: 'c-1', field: 'any_text', operator: 'contains', value: '' }]);
  };

  return (
    <div style={{ padding: 24, overflow: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Search size={18} style={{ color: 'var(--color-primary)' }} />
        <span className="view-title">Advanced Boolean Search</span>
      </div>

      {/* Query Builder */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Match</span>
          {(['AND', 'OR'] as const).map(c => (
            <button
              key={c}
              className={`btn btn-sm ${conjunction === c ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setConjunction(c)}
            >{c}</button>
          ))}
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>of the following conditions:</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {conditions.map(cond => (
            <div key={cond.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                className="form-select"
                value={cond.field}
                onChange={e => updateCondition(cond.id, { field: e.target.value as FieldKey })}
                style={{ width: 160, flexShrink: 0 }}
              >
                {FIELD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select
                className="form-select"
                value={cond.operator}
                onChange={e => updateCondition(cond.id, { operator: e.target.value as Operator })}
                style={{ width: 140, flexShrink: 0 }}
              >
                {OPERATOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {cond.operator !== 'is_empty' && cond.field !== 'is_blocker' && cond.field !== 'is_blocked' && (
                <input
                  className="form-input"
                  placeholder="Value…"
                  value={cond.value}
                  onChange={e => updateCondition(cond.id, { value: e.target.value })}
                  style={{ flex: 1 }}
                />
              )}
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--color-danger)', flexShrink: 0 }}
                onClick={() => removeCondition(cond.id)}
                disabled={conditions.length === 1}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={addCondition}>
            <Plus size={13} /> Add Condition
          </button>
          <button className="btn btn-primary" onClick={runSearch}>
            <Play size={13} /> Run Query
          </button>
          {results !== null && (
            <button className="btn btn-ghost btn-sm" onClick={clearSearch}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick example queries */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', alignSelf: 'center' }}>Examples:</span>
        {[
          {
            label: 'Open P1 Blockers',
            conditions: [
              { id: 'e-1', field: 'status' as FieldKey, operator: 'not_equals' as Operator, value: 'CLOSED' },
              { id: 'e-2', field: 'priority' as FieldKey, operator: 'equals' as Operator, value: 'P1' }
            ],
            conj: 'AND' as const
          },
          {
            label: 'Raft or QUIC bugs',
            conditions: [
              { id: 'e-3', field: 'component' as FieldKey, operator: 'contains' as Operator, value: 'Raft' },
              { id: 'e-4', field: 'component' as FieldKey, operator: 'contains' as Operator, value: 'QUIC' }
            ],
            conj: 'OR' as const
          },
          {
            label: 'All Blockers',
            conditions: [{ id: 'e-5', field: 'is_blocker' as FieldKey, operator: 'equals' as Operator, value: '' }],
            conj: 'AND' as const
          },
        ].map(ex => (
          <button
            key={ex.label}
            className="filter-chip"
            onClick={() => { setConditions(ex.conditions); setConjunction(ex.conj); setResults(null); }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {results !== null && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Results</span>
            <span className="view-count">{results.length} issues</span>
          </div>
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No issues match your query</div>
              <div className="empty-state-desc">Try adjusting the conditions or switching from AND to OR.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map(bug => (
                <div
                  key={bug.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  onClick={() => dispatch({ type: 'SELECT_BUG', payload: bug.id })}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>{bug.id}</span>
                  <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bug.title}</span>
                  <SeverityBadge severity={bug.severity} />
                  <StatusBadge status={bug.status} />
                  <PriorityBadge priority={bug.priority} />
                </div>
              ))}
            </div>
          )}
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
