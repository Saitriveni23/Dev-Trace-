import React, { useState } from 'react';
import { Bell, Moon, Sun, BookOpen, Code, Database } from 'lucide-react';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const SlackIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
    <path d="M16 10h5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-5v3z" />
    <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
    <path d="M14 16v5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-5h3z" />
    <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
    <path d="M8 14H3c-.83 0-1.5.67-1.5 1.5S2.17 17 3 17h5v-3z" />
    <path d="M10 9.5C10 10.33 9.33 11 8.5 11h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z" />
    <path d="M10 8V3c0-.83.67-1.5 1.5-1.5S13 2.17 13 3v5h-3z" />
  </svg>
);

const INTEGRATIONS = [
  { id: 'github', label: 'GitHub', icon: <GithubIcon size={18} />, color: '#FFFFFF', desc: 'Sync commits & PRs', connected: true },
  { id: 'slack',  label: 'Slack',  icon: <SlackIcon size={18} />, color: '#4A154B', desc: 'Bug alert notifications', connected: false },
  { id: 'vscode', label: 'VS Code', icon: <Code size={18} />, color: '#007ACC', desc: 'IDE extension support', connected: true },
  { id: 'firebase', label: 'Firebase', icon: <Database size={18} />, color: '#FFCA28', desc: 'Auth & Firestore backend', connected: true },
];

export default function SettingsView() {
  const [theme, setTheme] = useState<'dark' | 'notebook' | 'light'>('dark');
  const [notifications, setNotifications] = useState({
    criticalBugs: true,
    sprintUpdates: true,
    teamMentions: true,
    aiSuggestions: false,
    weeklyReport: true,
  });
  const [integrations, setIntegrations] = useState<Record<string, boolean>>(
    INTEGRATIONS.reduce((acc, i) => ({ ...acc, [i.id]: i.connected }), {})
  );

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      padding: '32px 36px',
      background: '#080A12',
      minHeight: '100%',
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
      `,
      backgroundSize: '28px 28px',
      color: '#FFFFFF'
    }}>

      {/* Header */}
      <div style={{ marginBottom: '36px', position: 'relative' }}>
        <div className="tape-strip" style={{ width: '80px', top: '-12px', left: '-4px', transform: 'rotate(-2deg)' }} />
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '2.4rem',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          Case <span style={{ color: '#FBBF24' }}>Preferences</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-hand)',
          fontSize: '1.1rem',
          color: '#9CA3AF',
          margin: '4px 0 0',
          transform: 'rotate(-0.5deg)',
          display: 'inline-block'
        }}>
          Configure your investigation workspace
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', maxWidth: '960px' }}>

        {/* THEME SECTION */}
        <div style={{
          background: '#111827',
          border: '2.5px solid #1A2233',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
          position: 'relative'
        }}>
          <div className="tape-strip" style={{ width: '50px', top: '-8px', left: '20px' }} />
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#FBBF24',
            margin: '0 0 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BookOpen size={15} /> Workspace Theme
          </h2>

          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { id: 'dark', label: 'Dark Cover', icon: <Moon size={16} /> },
              { id: 'notebook', label: 'Notebook', icon: <BookOpen size={16} /> },
              { id: 'light', label: 'Light Cover', icon: <Sun size={16} /> },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  background: theme === t.id ? '#FBBF24' : '#1A2233',
                  color: theme === t.id ? '#111827' : '#9CA3AF',
                  border: `2px solid ${theme === t.id ? '#111827' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: theme === t.id ? '2px 2px 0px rgba(0,0,0,0.95)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS SECTION */}
        <div style={{
          background: '#111827',
          border: '2.5px solid #1A2233',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
          position: 'relative'
        }}>
          <div className="tape-strip" style={{ width: '50px', top: '-8px', right: '20px' }} />
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#FBBF24',
            margin: '0 0 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Bell size={15} /> Notification Rules
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(Object.entries(notifications) as [string, boolean][]).map(([key, val]) => {
              const labels: Record<string, string> = {
                criticalBugs: '🔴 Critical bug alerts',
                sprintUpdates: '📅 Sprint updates',
                teamMentions: '💬 Team mentions',
                aiSuggestions: '🤖 AI suggestions',
                weeklyReport: '📊 Weekly report',
              };
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px dashed rgba(255,255,255,0.06)',
                    paddingBottom: '10px'
                  }}
                >
                  <span style={{ fontSize: '0.84rem', color: '#D1D5DB' }}>{labels[key]}</span>
                  <div
                    onClick={() => toggleNotif(key as any)}
                    style={{
                      width: '38px',
                      height: '20px',
                      borderRadius: '10px',
                      background: val ? '#FBBF24' : '#1A2233',
                      border: `1.5px solid ${val ? '#111827' : 'rgba(255,255,255,0.1)'}`,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      top: '2px',
                      left: val ? '20px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTEGRATIONS SECTION — spans both columns */}
        <div style={{
          gridColumn: '1 / -1',
          background: '#111827',
          border: '2.5px solid #1A2233',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
          position: 'relative'
        }}>
          <div className="tape-strip" style={{ width: '50px', top: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#FBBF24',
            margin: '0 0 20px'
          }}>
            🔌 Integration Stickers
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {INTEGRATIONS.map(intg => (
              <div
                key={intg.id}
                style={{
                  background: '#1A2233',
                  border: `2px solid ${integrations[intg.id] ? '#34D399' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  boxShadow: integrations[intg.id] ? '0 0 16px rgba(52,211,153,0.15), 3px 3px 0px rgba(0,0,0,0.95)' : '3px 3px 0px rgba(0,0,0,0.95)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  transform: `rotate(${intg.id === 'slack' ? '1.5deg' : intg.id === 'vscode' ? '-1deg' : intg.id === 'firebase' ? '1deg' : '-0.5deg'})`
                }}
                onClick={() => setIntegrations(prev => ({ ...prev, [intg.id]: !prev[intg.id] }))}
              >
                <div style={{ color: intg.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  {intg.icon}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>{intg.label}</div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginBottom: '10px' }}>{intg.desc}</div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  background: integrations[intg.id] ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.1)',
                  color: integrations[intg.id] ? '#34D399' : '#EF4444',
                  border: `1px solid ${integrations[intg.id] ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.2)'}`,
                }}>
                  {integrations[intg.id] ? '✓ Connected' : '✗ Disconnected'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
