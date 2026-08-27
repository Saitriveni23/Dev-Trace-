import React from 'react';
import { BugProvider, useBugs } from './context/BugContext';
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
import './index.css';

function AppInner() {
  const { activeView } = useBugs();

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
      case 'mobile':    return <BugMobileView />;
      case 'security':  return <SecurityPortal />;
      case 'graph':     return <DependencyGraph />;
      case 'search':    return <AdvancedSearch />;
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
    <BugProvider>
      <AppInner />
    </BugProvider>
  );
}
