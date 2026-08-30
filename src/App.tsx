import React, { useEffect } from 'react';
import { BugProvider, useBugs } from './context/BugContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import BugListView from './components/bugs/BugListView';
import BugKanbanView from './components/bugs/BugKanbanView';
import MetricsDashboard from './components/analytics/MetricsDashboard';
import BugAnalyticsView from './components/analytics/BugAnalyticsView';
import AIAssistantView from './components/analytics/AIAssistantView';
import SprintPlannerView from './components/analytics/SprintPlannerView';
import BugMobileView from './components/bugs/BugMobileView';
import SecurityPortal from './components/security/SecurityPortal';
import DependencyGraph from './components/graph/DependencyGraph';
import AdvancedSearch from './components/search/AdvancedSearch';
import LandingPage from './components/layout/LandingPage';
import LoginPage from './components/layout/LoginPage';
import ToastContainer from './components/common/Toast';
import SketchBoardView from './components/analytics/SketchBoardView';
import GithubSyncView from './components/github/GithubSyncView';
import TeamView from './components/team/TeamView';
import SettingsView from './components/settings/SettingsView';
import './index.css';

function AppInner() {
  const { user, loading } = useAuth();
  const { activeView, guestMode, dispatch } = useBugs();

  useEffect(() => {
    // Restore theme from localStorage
    if (localStorage.getItem('devtrace_theme') === 'light') {
      document.body.classList.add('light-theme');
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user && !guestMode) {
        if (activeView !== 'landing' && activeView !== 'login') {
          dispatch({ type: 'SET_VIEW', payload: 'landing' });
        }
      }
    }
  }, [user, loading, activeView, guestMode, dispatch]);

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-notebook)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-marker)', fontSize: '2rem', color: 'var(--accent-yellow)' }}>
            Examining case files... 🔍
          </div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: 'white', marginTop: '10px' }}>
            Unrolling detective notebooks
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  if (activeView === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'list':      return <BugListView />;
      case 'kanban':    return <BugKanbanView />;
      case 'dashboard': return <MetricsDashboard />;
      case 'analytics': return <BugAnalyticsView />;
      case 'assistant': return <AIAssistantView />;
      case 'sprint':    return <SprintPlannerView />;
      case 'sketch':    return <SketchBoardView />;
      case 'github':    return <GithubSyncView />;
      case 'mobile':    return <BugMobileView />;
      case 'security':  return <SecurityPortal />;
      case 'graph':     return <DependencyGraph />;
      case 'search':    return <AdvancedSearch />;
      case 'team':      return <TeamView />;
      case 'settings':  return <SettingsView />;
      default:          return <BugListView />;
    }
  };

  return (
    <>
      <div className="app">
        <div className="app-navbar"><Navbar /></div>
        <div className="app-sidebar"><Sidebar /></div>
        <div className="app-main">{renderView()}</div>
      </div>
      <ToastContainer />
    </>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <BugProvider>
        <AppInner />
      </BugProvider>
    </AuthProvider>
  );
}
