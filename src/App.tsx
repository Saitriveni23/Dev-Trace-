import React from 'react';
import { BugProvider, useBugs } from './context/BugContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import BugListView from './components/bugs/BugListView';
import BugKanbanView from './components/bugs/BugKanbanView';
import MetricsDashboard from './components/analytics/MetricsDashboard';
import SecurityPortal from './components/security/SecurityPortal';
import DependencyGraph from './components/graph/DependencyGraph';
import AdvancedSearch from './components/search/AdvancedSearch';
import ToastContainer from './components/common/Toast';
import './index.css';

function AppInner() {
  const { activeView } = useBugs();

  const renderView = () => {
    switch (activeView) {
      case 'list':      return <BugListView />;
      case 'kanban':    return <BugKanbanView />;
      case 'analytics': return <MetricsDashboard />;
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
