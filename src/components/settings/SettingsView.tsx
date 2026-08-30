import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, BookOpen, Code, Database, User, Save } from 'lucide-react';
import { useBugs } from '../../context/BugContext';

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
  const { currentUser, dispatch, showToast } = useBugs();
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileRole, setProfileRole] = useState(currentUser.role);
  
  const [theme, setTheme] = useState<'dark' | 'notebook' | 'light'>(() => {
    return (localStorage.getItem('devtrace_theme') as any) || 'dark';
  });
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

  useEffect(() => {
    localStorage.setItem('devtrace_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    dispatch({ type: 'UPDATE_USER', payload: { ...currentUser, name: profileName, role: profileRole as any } });
    showToast('Profile preferences updated', 'success');
  };

  return (
    <div style={{
      padding: '32px 36px',
      background: 'var(--bg-notebook)',
      minHeight: '100%',
      backgroundImage: `
        linear-gradient(var(--bg-grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--bg-grid) 1px, transparent 1px)
      `,
      backgroundSize: '28px 28px',
      color: 'var(--text-white)'
    }}>

      {/* Header */}
      <div style={{ marginBottom: '36px', position: 'relative' }}>
        <div className="tape-strip" style={{ width: '80px', top: '-12px', left: '-4px', transform: 'rotate(-2deg)' }} />
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '2.4rem',
          fontWeight: 900,
          color: 'var(--text-white)',
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          Case <span style={{ color: 'var(--accent-yellow)' }}>Preferences</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-hand)',
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          margin: '4px 0 0',
          transform: 'rotate(-0.5deg)',
          display: 'inline-block'
        }}>
          Configure your investigation workspace
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', maxWidth: '960px' }}>

        {/* USER PROFILE SECTION */}
        <div style={{
          gridColumn: '1 / -1',
          background: 'var(--bg-surface)',
          border: '2.5px solid var(--bg-secondary)',
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
            color: 'var(--accent-yellow)',
            margin: '0 0 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User size={15} /> Detective Profile
          </h2>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--text-dark)', overflow: 'hidden', background: 'var(--paper-beige)' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Display Name</label>
                  <input 
                    value={profileName} 
                    onChange={e => setProfileName(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '2px solid var(--text-dark)', borderRadius: '4px', background: 'transparent', color: 'var(--text-white)', fontFamily: 'var(--font-sans)' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Role</label>
                  <select 
                    value={profileRole}
                    onChange={e => setProfileRole(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', border: '2px solid var(--text-dark)', borderRadius: '4px', background: 'transparent', color: 'var(--text-white)', fontFamily: 'var(--font-sans)' }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Lead Detective">Lead Detective</option>
                    <option value="Security Officer">Security Officer</option>
                    <option value="Contributor">Contributor</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                style={{ alignSelf: 'flex-start', background: 'var(--accent-yellow)', color: 'var(--text-dark)', border: '2px solid var(--text-dark)', padding: '6px 16px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '2px 2px 0px rgba(0,0,0,0.9)' }}
              >
                <Save size={14} /> Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* THEME SECTION */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '2.5px solid var(--bg-secondary)',
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
            color: 'var(--accent-yellow)',
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
                data-tooltip={theme === t.id ? `${t.label} is active` : `Switch to ${t.label} theme`}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  background: theme === t.id ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                  color: theme === t.id ? 'var(--text-dark)' : 'var(--text-muted)',
                  border: `2px solid ${theme === t.id ? 'var(--text-dark)' : 'var(--border-subtle)'}`,
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
          background: 'var(--bg-surface)',
          border: '2.5px solid var(--bg-secondary)',
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
            color: 'var(--accent-yellow)',
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
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-white)' }}>{labels[key]}</span>
                  <div
                    onClick={() => toggleNotif(key as any)}
                    data-tooltip={val ? `Turn off ${labels[key].replace(/^\S+\s/, '').toLowerCase()}` : `Turn on ${labels[key].replace(/^\S+\s/, '').toLowerCase()}`}
                    style={{
                      width: '38px',
                      height: '20px',
                      borderRadius: '10px',
                      background: val ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                      border: `1.5px solid ${val ? 'var(--text-dark)' : 'var(--border-subtle)'}`,
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
                      background: 'var(--paper-beige)',
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
          background: 'var(--bg-surface)',
          border: '2.5px solid var(--bg-secondary)',
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
            color: 'var(--accent-yellow)',
            margin: '0 0 20px'
          }}>
            🔌 Integration Stickers
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {INTEGRATIONS.map(intg => (
              <div
                key={intg.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: `2px solid ${integrations[intg.id] ? 'var(--accent-mint)' : 'var(--border-subtle)'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  boxShadow: integrations[intg.id] ? '0 0 16px rgba(52,211,153,0.15), 3px 3px 0px rgba(0,0,0,0.95)' : '3px 3px 0px rgba(0,0,0,0.95)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  transform: `rotate(${intg.id === 'slack' ? '1.5deg' : intg.id === 'vscode' ? '-1deg' : intg.id === 'firebase' ? '1deg' : '-0.5deg'})`
                }}
                onClick={() => setIntegrations(prev => ({ ...prev, [intg.id]: !prev[intg.id] }))}
                data-tooltip={integrations[intg.id] ? `Disconnect ${intg.label}` : `Connect ${intg.label}`}
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

          {integrations['github'] && (
            <div style={{
              marginTop: '24px',
              background: '#1A2233',
              border: '2px dashed var(--accent-yellow)',
              borderRadius: '8px',
              padding: '20px',
              color: '#FFFFFF'
            }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-yellow)', marginBottom: '10px' }}>
                🐙 Live GitHub Sync Instructions
              </h3>
              <p style={{ fontSize: '0.74rem', lineHeight: '1.4', color: '#9CA3AF', marginBottom: '12px' }}>
                To automatically detect issues and commits pushed to GitHub and display them as stickers on your board in real-time, configure your repository with these steps:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.72rem' }}>
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Step 1: Generate Firebase Service Account Key</strong>
                  <span style={{ display: 'block', color: '#9CA3AF', marginTop: '2px' }}>
                    In your **Firebase Console**, go to Project Settings (gear icon) &gt; **Service accounts**. Click **Generate new private key** and save the downloaded JSON file.
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Step 2: Add Secret to GitHub</strong>
                  <span style={{ display: 'block', color: '#9CA3AF', marginTop: '2px' }}>
                    In your GitHub Repository, go to **Settings &gt; Secrets and variables &gt; Actions &gt; New repository secret**. Name it <code style={{ color: 'var(--accent-yellow)' }}>FIREBASE_SERVICE_ACCOUNT</code> and paste the entire JSON key file content.
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Step 3: Push Workflow File</strong>
                  <span style={{ display: 'block', color: '#9CA3AF', marginTop: '2px' }}>
                    The workflow is already configured at <code style={{ color: 'var(--accent-purple)' }}>.github/workflows/devtrace-sync.yml</code>. Pushing this project to your repository activates it immediately!
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
