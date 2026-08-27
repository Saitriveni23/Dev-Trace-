import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import type { Bug } from '../../types';
import { GitPullRequest, GitCommit, RefreshCw, Layers, CheckSquare, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GitCommitData {
  sha: string;
  author: string;
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'refactor';
}

interface GitPRData {
  number: number;
  title: string;
  author: string;
  status: 'APPROVED' | 'DRAFT' | 'REVIEW';
  branch: string;
}

export default function GithubSyncView() {
  const { showToast, dispatch } = useBugs();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedIssuesCount, setSyncedIssuesCount] = useState(0);

  // Synced mock commits representing recent history
  const [commits] = useState<GitCommitData[]>([
    { sha: 'abf45ce', author: 'Alex Detective', date: 'Today, 7:14 PM', message: 'feat: integrate Firebase App configuration and login auth handlers', type: 'feat' },
    { sha: '850aa24', author: 'Alex Detective', date: 'Today, 7:20 PM', message: 'feat: implement Firebase Google popup authentication handlers', type: 'feat' },
    { sha: 'fa73972', author: 'Alex Detective', date: 'Today, 7:48 PM', message: 'fix: add default fallback values for Firebase configuration properties', type: 'fix' },
    { sha: '7a9aab5', author: 'Alex Detective', date: 'Today, 7:38 PM', message: 'feat: complete Google Auth integration with ProfileDropdown and session persistence', type: 'feat' },
  ]);

  // Pull Requests list
  const [prs] = useState<GitPRData[]>([
    { number: 42, title: '🔐 Setup Google popup authentication stamps', author: 'Alex Detective', status: 'APPROVED', branch: 'feat-google-auth' },
    { number: 43, title: '☕ Fills Productivity Coffee meter soundscapes', author: 'Caffeine Scribe', status: 'REVIEW', branch: 'feat-coffee-tempo' },
    { number: 44, title: '📸 Add Polaroid evidence screenshots container', author: 'Evidence Collector', status: 'DRAFT', branch: 'feat-polaroid-snaps' },
  ]);

  // GitHub Repository Issues to Sync
  const [githubIssues, setGithubIssues] = useState([
    { number: 108, title: 'Page scroll failure when consuming double espresso', category: 'UI GLITCH', severity: 'HIGH' },
    { number: 114, title: 'Database connection pool leakage logs warning warnings', category: 'DATABASE', severity: 'CRITICAL' },
    { number: 120, title: 'BugBot asleep antennas do not wag on focus changes', category: 'mascot', severity: 'LOW' }
  ]);

  const handleRepositorySync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedIssuesCount(syncedIssuesCount + githubIssues.length);
      
      // Inject github issues directly into BugContext bug state!
      githubIssues.forEach((issue) => {
        const latestNum = 1300 + Math.floor(Math.random() * 100);
        const newBug: Bug = {
          id: `BS-${latestNum}`,
          numId: latestNum,
          title: `[GitHub #${issue.number}] ${issue.title}`,
          description: `Imported GitHub repository tracker issue. Synced from remote GitHub webhook.`,
          product: 'GitHub Synced',
          component: issue.category,
          version: '1.0.0',
          targetMilestone: 'Next Release',
          status: 'UNCONFIRMED',
          resolution: null,
          duplicateBugs: [],
          severity: issue.severity as any,
          priority: 'P2',
          reporter: 'GitHub Webhook',
          reporterEmail: 'webhook@github.com',
          assignee: 'Alex Detective',
          assigneeEmail: 'detective@bugstudio.io',
          ccList: [],
          os: 'All',
          architecture: 'All',
          environment: 'production',
          tags: ['github', 'synced'],
          flags: [],
          dependsOn: [],
          blocks: [],
          security: { isEmbargoed: false, restrictedGroups: [] },
          timeTracking: { estimatedHours: 0, spentHours: 0, remainingHours: 0 },
          comments: [],
          attachments: [],
          auditLog: [
            {
              id: `aud-sync-${Date.now()}`,
              timestamp: new Date().toISOString(),
              user: 'GitHub Webhook',
              field: 'Status',
              oldValue: '',
              newValue: 'UNCONFIRMED'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        dispatch({
          type: 'CREATE_BUG',
          payload: newBug
        });
      });

      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('GitHub Sync completed! 3 issues imported as workspace stickers! 🐙', 'success');
      setGithubIssues([]); // Clear since they are now synced
    }, 1500);
  };

  return (
    <div className="github-sync-view" style={{ background: 'var(--bg-notebook)', minHeight: '100vh', padding: '30px', color: 'var(--text-white)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #201E2B', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <span className="view-title">GitHub Sync Station 🐙</span>
          <span className="view-count" style={{ marginLeft: '12px' }}>Repository Integration Portal</span>
        </div>

        <button 
          onClick={handleRepositorySync}
          disabled={isSyncing || githubIssues.length === 0}
          className="navbar-btn navbar-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: githubIssues.length === 0 ? 0.6 : 1 }}
        >
          <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Repository Issues'}</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: Commits Branch trail & Pull Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Commits timeline */}
          <div style={{ background: '#17161F', border: '3px solid var(--text-dark)', borderRadius: '8px', padding: '20px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-mint)', display: 'block', marginBottom: '16px' }}>
              Branch Commits Trail
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px' }}>
              {/* Branch connecting lines */}
              <div style={{ position: 'absolute', left: '10px', top: '10px', bottom: '10px', width: '2px', borderLeft: '3px dashed var(--accent-mint)' }} />

              {commits.map((c) => (
                <div key={c.sha} style={{ position: 'relative', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  
                  {/* Git branch node dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: c.type === 'feat' ? 'var(--accent-mint)' : 'var(--accent-coral)',
                    border: '2.5px solid #17161F'
                  }} />

                  <div 
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
                        commit {c.sha}
                      </div>
                      <p style={{ margin: '4px 0', fontSize: '0.88rem', fontWeight: 'bold' }}>{c.message}</p>
                      <span style={{ fontSize: '0.68rem', opacity: 0.6 }}>{c.author} • {c.date}</span>
                    </div>

                    <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                      {c.type}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Pull Requests binder tabs list */}
          <div style={{ background: '#17161F', border: '3px solid var(--text-dark)', borderRadius: '8px', padding: '20px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-purple)', display: 'block', marginBottom: '16px' }}>
              Pull Request Binder Logs
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prs.map(pr => (
                <div 
                  key={pr.number} 
                  style={{
                    background: 'white',
                    color: 'var(--text-dark)',
                    border: '2.5px solid var(--text-dark)',
                    borderRadius: '2px',
                    padding: '12px 16px',
                    transform: `rotate(${(pr.number % 2 === 0 ? -1 : 1)}deg)`,
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.85)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GitPullRequest size={13} style={{ color: 'var(--accent-purple)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 'bold', color: 'rgba(0,0,0,0.45)' }}>PR #{pr.number}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-marker)', fontSize: '1.05rem', margin: '4px 0' }}>{pr.title}</div>
                    <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', fontWeight: 'bold' }}>
                      branch: {pr.branch} • by {pr.author}
                    </span>
                  </div>

                  {/* Stamp style badge */}
                  <span style={{
                    fontFamily: 'var(--font-marker)',
                    fontSize: '0.72rem',
                    border: `2px solid ${pr.status === 'APPROVED' ? 'var(--accent-mint)' : pr.status === 'REVIEW' ? 'var(--accent-yellow)' : 'var(--accent-coral)'}`,
                    color: pr.status === 'APPROVED' ? 'var(--accent-mint)' : pr.status === 'REVIEW' ? '#A27B00' : 'var(--accent-coral)',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    transform: 'rotate(-4deg)',
                    fontWeight: 900
                  }}>
                    {pr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sync status & repository issues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Synchronized state status card */}
          <div className="metric-sticky-card note-yellow" style={{ transform: 'rotate(-1.5deg)', minHeight: 'auto', padding: '16px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
            <div className="tape-strip" style={{ width: '60px', top: '-10px' }}></div>
            <span style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' }}>synced status</span>
            <h4 style={{ fontFamily: 'var(--font-marker)', fontSize: '1.25rem', color: 'var(--text-dark)', margin: '6px 0 2px 0' }}>
              Connected to Dev-Trace-
            </h4>
            <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', color: 'rgba(0,0,0,0.6)', fontWeight: 'bold', margin: 0 }}>
              Synced Issues Count: {syncedIssuesCount} cases resolved today.
            </p>
          </div>

          {/* GitHub issues list waiting for synchronization */}
          <div style={{ background: '#17161F', border: '3px solid var(--text-dark)', borderRadius: '8px', padding: '20px', boxShadow: '4px 4px 0px rgba(0,0,0,0.95)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-yellow)', display: 'block', marginBottom: '14px' }}>
              Remote Repository Issues ({githubIssues.length})
            </span>

            {githubIssues.length === 0 ? (
              <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px 0' }}>
                All remote issues synced! 🎉
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {githubIssues.map(issue => (
                  <div 
                    key={issue.number} 
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>#ISSUE-{issue.number}</span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--accent-coral)', fontWeight: 'bold' }}>{issue.severity}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold', margin: '4px 0' }}>{issue.title}</div>
                    <span style={{ fontSize: '0.68rem', opacity: 0.6 }}>Category: {issue.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        .spin-anim {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}
