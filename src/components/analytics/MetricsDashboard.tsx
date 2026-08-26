import React, { useState, useEffect } from 'react';
import { useBugs } from '../../context/BugContext';
import { BarChart2, TrendingDown, TrendingUp, Clock, ShieldAlert, Zap, Users, Bug, Activity } from 'lucide-react';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MetricsDashboard() {
  const { bugs, getMetrics } = useBugs();
  const metrics = getMetrics();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Derive analytics data
  const productCounts = bugs.reduce((acc, b) => {
    const name = b.product.split(' ').slice(0, 2).join(' ');
    if (!acc[name]) acc[name] = { open: 0, resolved: 0 };
    if (['RESOLVED', 'VERIFIED', 'CLOSED'].includes(b.status)) acc[name].resolved++;
    else acc[name].open++;
    return acc;
  }, {} as Record<string, { open: number; resolved: number }>);

  const severityCounts = bugs.reduce((acc, b) => {
    if (!acc[b.severity]) acc[b.severity] = 0;
    acc[b.severity]++;
    return acc;
  }, {} as Record<string, number>);

  const componentHotspots = bugs.reduce((acc, b) => {
    const key = b.component.split(' ').slice(0, 2).join(' ');
    if (!acc[key]) acc[key] = 0;
    acc[key]++;
    return acc;
  }, {} as Record<string, number>);

  const topComponents = Object.entries(componentHotspots).sort(([, a], [, b]) => b - a).slice(0, 6);
  const maxComponent = Math.max(...topComponents.map(([, v]) => v));

  // Simulated 7-day inflow/outflow
  const weekData = WEEK_DAYS.map((day, i) => ({
    day,
    created: Math.max(0, Math.floor(Math.random() * 4 + 1)),
    resolved: Math.max(0, Math.floor(Math.random() * 3))
  }));

  const maxWeekVal = Math.max(...weekData.flatMap(d => [d.created, d.resolved]));

  const SEVER_COLORS: Record<string, string> = {
    BLOCKER: '#f87171', CRITICAL: '#fb923c', MAJOR: '#facc15',
    NORMAL: '#60a5fa', MINOR: '#4ade80', TRIVIAL: '#94a3b8', ENHANCEMENT: '#c084fc'
  };

  const totalSev = Object.values(severityCounts).reduce((s, v) => s + v, 0);

  // SVG donut segments
  const donutEntries = Object.entries(severityCounts).map(([sev, count]) => ({
    sev, count, color: SEVER_COLORS[sev] ?? '#60a5fa',
    pct: count / totalSev
  }));

  let donutOffset = 0;
  const DONUT_R = 48;
  const DONUT_CIRC = 2 * Math.PI * DONUT_R;

  const metricCards = [
    { label: 'Total Issues', value: metrics.totalBugs, icon: <Bug size={18} />, kind: 'primary', trend: '+3 this week' },
    { label: 'Open Issues', value: metrics.openBugs, icon: <Activity size={18} />, kind: 'info', trend: null },
    { label: 'Resolved', value: metrics.resolvedBugs, icon: <TrendingDown size={18} />, kind: 'success', trend: '+2 this week' },
    { label: 'Critical Blockers', value: metrics.criticalBlockers, icon: <Zap size={18} />, kind: 'danger', trend: metrics.criticalBlockers > 0 ? '⚠ Urgent' : '✓ Clear' },
    { label: 'SLA Breaches', value: metrics.slaBreaches, icon: <Clock size={18} />, kind: metrics.slaBreaches > 0 ? 'warn' : 'success', trend: null },
    { label: 'Avg. MTTR', value: `${metrics.meanTimeToResolutionDays}d`, icon: <TrendingDown size={18} />, kind: 'accent', trend: null },
    { label: 'Needs Info', value: metrics.bugsNeedingInfo, icon: <Users size={18} />, kind: 'warn', trend: null },
    { label: 'Embargoes', value: metrics.securityEmbargoes, icon: <ShieldAlert size={18} />, kind: metrics.securityEmbargoes > 0 ? 'danger' : 'success', trend: null },
  ];

  return (
    <div className="analytics-view">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <BarChart2 size={20} style={{ color: 'var(--color-primary)' }} />
        <span className="view-title">Engineering Analytics</span>
        <span className="view-count">Live</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Data as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid" style={{ marginBottom: 20 }}>
        {metricCards.map((m, i) => (
          <div
            key={m.label}
            className={`metric-card ${m.kind}`}
            style={{ animationDelay: `${i * 60}ms`, opacity: animateIn ? 1 : 0, transform: animateIn ? 'none' : 'translateY(16px)', transition: `opacity 0.4s ${i * 60}ms ease, transform 0.4s ${i * 60}ms ease` }}
          >
            <div className={`metric-icon ${m.kind}`}>{m.icon}</div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-label">{m.label}</div>
            {m.trend && <div style={{ fontSize: '0.7rem', marginTop: 4, color: 'var(--text-muted)' }}>{m.trend}</div>}
          </div>
        ))}
      </div>

      <div className="charts-grid">
        {/* Bug Inflow / Outflow chart */}
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="chart-title">7-Day Bug Velocity</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-danger)', display: 'inline-block' }} />Opened
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-success)', display: 'inline-block' }} />Resolved
              </span>
            </div>
          </div>
          <div className="bar-chart">
            {weekData.map(d => (
              <div key={d.day} className="bar-item">
                <div className="bar-val">{d.created}</div>
                <div
                  className="bar-fill"
                  style={{
                    height: animateIn ? `${(d.created / (maxWeekVal + 1)) * 120}px` : '4px',
                    background: 'linear-gradient(180deg, var(--color-danger), hsla(0,80%,60%,0.5))',
                    marginBottom: 2
                  }}
                />
                <div
                  className="bar-fill"
                  style={{
                    height: animateIn ? `${(d.resolved / (maxWeekVal + 1)) * 80}px` : '4px',
                    background: 'linear-gradient(180deg, var(--color-success), hsla(152,62%,52%,0.4))',
                  }}
                />
                <div className="bar-val" style={{ color: 'var(--color-success)' }}>{d.resolved}</div>
                <div className="bar-label">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution Donut */}
        <div className="chart-card">
          <div className="chart-title">Severity Distribution</div>
          <div className="donut-chart-wrap">
            <svg width={120} height={120} viewBox="0 0 120 120">
              <circle cx={60} cy={60} r={DONUT_R} fill="none" stroke="var(--bg-overlay)" strokeWidth={14} />
              {donutEntries.map(entry => {
                const dashArr = entry.pct * DONUT_CIRC;
                const offset = DONUT_CIRC - donutOffset;
                donutOffset += dashArr;
                return (
                  <circle
                    key={entry.sev}
                    cx={60} cy={60} r={DONUT_R}
                    fill="none"
                    stroke={entry.color}
                    strokeWidth={14}
                    strokeDasharray={`${animateIn ? dashArr : 0} ${DONUT_CIRC}`}
                    strokeDashoffset={offset}
                    transform="rotate(-90 60 60)"
                    style={{ transition: `stroke-dasharray 1s ${donutEntries.indexOf(entry) * 150}ms ease` }}
                  />
                );
              })}
              <text x={60} y={55} textAnchor="middle" fontSize={18} fontWeight={900} fill="var(--text-primary)" fontFamily="Inter, sans-serif">{totalSev}</text>
              <text x={60} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--text-muted)" fontFamily="Inter, sans-serif">TOTAL</text>
            </svg>
            <div className="donut-legend">
              {donutEntries.map(e => (
                <div key={e.sev} className="donut-legend-item">
                  <div className="donut-legend-dot" style={{ background: e.color }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{e.sev}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '0.78rem', color: e.color }}>{e.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Component Hotspot Heatmap */}
      <div className="chart-card" style={{ marginTop: 14 }}>
        <div className="chart-title" style={{ marginBottom: 14 }}>Component Defect Density</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topComponents.map(([comp, count]) => {
            const pct = count / maxComponent;
            const color = pct > 0.8 ? 'var(--sev-blocker)' : pct > 0.6 ? 'var(--sev-critical)' : pct > 0.4 ? 'var(--sev-major)' : 'var(--color-primary)';
            return (
              <div key={comp} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 160, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>
                  {comp}
                </div>
                <div style={{ flex: 1, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-full)', overflow: 'hidden', height: 20 }}>
                  <div style={{
                    height: '100%',
                    width: animateIn ? `${pct * 100}%` : '0%',
                    background: `linear-gradient(90deg, ${color}cc, ${color}44)`,
                    borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: count > 0 ? 30 : 0
                  }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 14 }}>
        {Object.entries(productCounts).map(([prod, counts]) => {
          const total = counts.open + counts.resolved;
          const resolvedPct = total > 0 ? (counts.resolved / total) * 100 : 0;
          return (
            <div key={prod} className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{prod}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{total} total</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--color-danger-muted)', borderRadius: 'var(--radius-md)', border: '1px solid hsla(0,80%,60%,0.2)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-danger)' }}>{counts.open}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>OPEN</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--color-success-muted)', borderRadius: 'var(--radius-md)', border: '1px solid hsla(152,62%,52%,0.2)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-success)' }}>{counts.resolved}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>RESOLVED</div>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: animateIn ? `${resolvedPct}%` : '0%',
                    background: resolvedPct > 60 ? 'var(--color-success)' : resolvedPct > 30 ? 'var(--color-warn)' : 'var(--color-danger)',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                {Math.round(resolvedPct)}% resolved
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
