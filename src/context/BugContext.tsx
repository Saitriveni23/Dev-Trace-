import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Bug, BugStatus, BugResolution, BugSeverity, BugPriority, BugFlag, BugComment, Product, SavedSearch, UserProfile, MetricSummary } from '../types';
import { INITIAL_BUGS, PRODUCTS, INITIAL_SAVED_SEARCHES, CURRENT_USER, USERS } from '../services/seedData';

interface BugState {
  bugs: Bug[];
  products: Product[];
  savedSearches: SavedSearch[];
  currentUser: UserProfile;
  users: UserProfile[];
  selectedBugId: string | null;
  activeView: 'landing' | 'login' | 'list' | 'kanban' | 'dashboard' | 'analytics' | 'security' | 'graph' | 'search' | 'assistant' | 'sprint' | 'mobile' | 'sketch' | 'github';
  searchQuery: string;
  filterProduct: string | null;
  filterStatus: BugStatus | null;
  filterSeverity: BugSeverity | null;
  filterPriority: BugPriority | null;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }[];
}

type BugAction =
  | { type: 'SET_VIEW'; payload: BugState['activeView'] }
  | { type: 'SELECT_BUG'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_PRODUCT'; payload: string | null }
  | { type: 'SET_FILTER_STATUS'; payload: BugStatus | null }
  | { type: 'SET_FILTER_SEVERITY'; payload: BugSeverity | null }
  | { type: 'SET_FILTER_PRIORITY'; payload: BugPriority | null }
  | { type: 'CREATE_BUG'; payload: Bug }
  | { type: 'UPDATE_BUG'; payload: Bug }
  | { type: 'UPDATE_BUG_STATUS'; payload: { id: string; status: BugStatus; resolution?: BugResolution } }
  | { type: 'UPDATE_BUG_FLAG'; payload: { bugId: string; flag: BugFlag } }
  | { type: 'ADD_COMMENT'; payload: { bugId: string; comment: BugComment } }
  | { type: 'ADD_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' | 'warning' } }
  | { type: 'REMOVE_TOAST'; payload: string };

function bugReducer(state: BugState, action: BugAction): BugState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.payload, selectedBugId: null };
    case 'SELECT_BUG':
      return { ...state, selectedBugId: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTER_PRODUCT':
      return { ...state, filterProduct: action.payload };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    case 'SET_FILTER_SEVERITY':
      return { ...state, filterSeverity: action.payload };
    case 'SET_FILTER_PRIORITY':
      return { ...state, filterPriority: action.payload };
    case 'CREATE_BUG':
      return { ...state, bugs: [action.payload, ...state.bugs] };
    case 'UPDATE_BUG':
      return {
        ...state,
        bugs: state.bugs.map(b => b.id === action.payload.id ? action.payload : b)
      };
    case 'UPDATE_BUG_STATUS': {
      const now = new Date().toISOString();
      return {
        ...state,
        bugs: state.bugs.map(b => {
          if (b.id !== action.payload.id) return b;
          return {
            ...b,
            status: action.payload.status,
            resolution: action.payload.resolution ?? b.resolution,
            updatedAt: now,
            resolvedAt: ['RESOLVED', 'CLOSED', 'VERIFIED'].includes(action.payload.status) ? now : b.resolvedAt,
            auditLog: [
              {
                id: `aud-${Date.now()}`,
                timestamp: now,
                user: state.currentUser.username,
                field: 'Status',
                oldValue: b.status,
                newValue: action.payload.status,
              },
              ...b.auditLog
            ]
          };
        })
      };
    }
    case 'UPDATE_BUG_FLAG': {
      return {
        ...state,
        bugs: state.bugs.map(b => {
          if (b.id !== action.payload.bugId) return b;
          const flags = b.flags.some(f => f.id === action.payload.flag.id)
            ? b.flags.map(f => f.id === action.payload.flag.id ? action.payload.flag : f)
            : [...b.flags, action.payload.flag];
          return { ...b, flags, updatedAt: new Date().toISOString() };
        })
      };
    }
    case 'ADD_COMMENT': {
      return {
        ...state,
        bugs: state.bugs.map(b => {
          if (b.id !== action.payload.bugId) return b;
          return {
            ...b,
            comments: [...b.comments, action.payload.comment],
            updatedAt: new Date().toISOString()
          };
        })
      };
    }
    case 'ADD_TOAST': {
      const id = `toast-${Date.now()}`;
      return {
        ...state,
        toasts: [...state.toasts, { id, ...action.payload }]
      };
    }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

const initialState: BugState = {
  bugs: INITIAL_BUGS,
  products: PRODUCTS,
  savedSearches: INITIAL_SAVED_SEARCHES,
  currentUser: CURRENT_USER,
  users: USERS,
  selectedBugId: null,
  activeView: 'landing',
  searchQuery: '',
  filterProduct: null,
  filterStatus: null,
  filterSeverity: null,
  filterPriority: null,
  toasts: [],
};

interface BugContextType extends BugState {
  dispatch: React.Dispatch<BugAction>;
  getFilteredBugs: () => Bug[];
  getMetrics: () => MetricSummary;
  getBugById: (id: string) => Bug | undefined;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const BugContext = createContext<BugContextType | null>(null);

export function BugProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bugReducer, initialState);

  const getFilteredBugs = useCallback((): Bug[] => {
    let result = state.bugs;
    const q = state.searchQuery.toLowerCase().trim();

    if (q) {
      // Simple query parsing: detect field:value patterns
      const queryTokens = q.split(/\s+/);
      queryTokens.forEach(token => {
        if (token.startsWith('is:')) {
          const val = token.slice(3);
          if (val === 'open') result = result.filter(b => !['RESOLVED', 'CLOSED', 'VERIFIED'].includes(b.status));
          if (val === 'closed') result = result.filter(b => ['RESOLVED', 'CLOSED', 'VERIFIED'].includes(b.status));
          if (val === 'blocker') result = result.filter(b => b.blocks.length > 0);
        } else if (token.startsWith('priority:')) {
          const val = token.slice(9).toUpperCase();
          result = result.filter(b => b.priority === val);
        } else if (token.startsWith('severity:')) {
          const val = token.slice(9).toUpperCase();
          result = result.filter(b => b.severity === val);
        } else if (token.startsWith('status:')) {
          const val = token.slice(7).toUpperCase();
          result = result.filter(b => b.status === val);
        } else if (token.startsWith('embargo:')) {
          const val = token.slice(8);
          result = result.filter(b => b.security.isEmbargoed === (val === 'true'));
        } else if (token.startsWith('product:')) {
          const val = token.slice(8).replace(/"/g, '').toLowerCase();
          result = result.filter(b => b.product.toLowerCase().includes(val));
        } else if (token.startsWith('assigned:')) {
          const val = token.slice(9);
          if (val === 'me') {
            result = result.filter(b => b.assigneeEmail === state.currentUser.email);
          } else {
            result = result.filter(b => b.assignee.toLowerCase().includes(val));
          }
        } else if (token.length > 2) {
          // Full-text search across title, description, tags, id
          result = result.filter(b =>
            b.title.toLowerCase().includes(token) ||
            b.description.toLowerCase().includes(token) ||
            b.id.toLowerCase().includes(token) ||
            b.tags.some(t => t.toLowerCase().includes(token))
          );
        }
      });
    }

    if (state.filterProduct) {
      result = result.filter(b => b.product === state.filterProduct);
    }
    if (state.filterStatus) {
      result = result.filter(b => b.status === state.filterStatus);
    }
    if (state.filterSeverity) {
      result = result.filter(b => b.severity === state.filterSeverity);
    }
    if (state.filterPriority) {
      result = result.filter(b => b.priority === state.filterPriority);
    }

    return result;
  }, [state.bugs, state.searchQuery, state.filterProduct, state.filterStatus, state.filterSeverity, state.filterPriority, state.currentUser.email]);

  const getMetrics = useCallback((): MetricSummary => {
    const bugs = state.bugs;
    const openBugs = bugs.filter(b => !['CLOSED'].includes(b.status));
    const resolvedBugs = bugs.filter(b => ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(b.status) && b.resolvedAt);

    let totalDays = 0;
    resolvedBugs.forEach(b => {
      if (b.resolvedAt) {
        const created = new Date(b.createdAt).getTime();
        const resolved = new Date(b.resolvedAt).getTime();
        totalDays += (resolved - created) / (1000 * 60 * 60 * 24);
      }
    });

    const mttr = resolvedBugs.length > 0 ? totalDays / resolvedBugs.length : 0;

    return {
      totalBugs: bugs.length,
      openBugs: openBugs.length,
      resolvedBugs: resolvedBugs.length,
      criticalBlockers: bugs.filter(b => (b.severity === 'BLOCKER' || b.severity === 'CRITICAL') && !['CLOSED'].includes(b.status)).length,
      slaBreaches: bugs.filter(b => {
        if (b.timeTracking.deadline && !['RESOLVED', 'VERIFIED', 'CLOSED'].includes(b.status)) {
          return new Date(b.timeTracking.deadline) < new Date();
        }
        return false;
      }).length,
      meanTimeToResolutionDays: Math.round(mttr * 10) / 10,
      bugsNeedingInfo: bugs.filter(b => b.flags.some(f => f.type === 'needinfo' && f.status === '?')).length,
      securityEmbargoes: bugs.filter(b => b.security.isEmbargoed && !['CLOSED'].includes(b.status)).length,
    };
  }, [state.bugs]);

  const getBugById = useCallback((id: string) => {
    return state.bugs.find(b => b.id === id);
  }, [state.bugs]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    dispatch({ type: 'ADD_TOAST', payload: { message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: `toast-${Date.now() - 10}` });
    }, 4000);
  }, []);

  return (
    <BugContext.Provider value={{
      ...state,
      dispatch,
      getFilteredBugs,
      getMetrics,
      getBugById,
      showToast,
    }}>
      {children}
    </BugContext.Provider>
  );
}

export function useBugs() {
  const ctx = useContext(BugContext);
  if (!ctx) throw new Error('useBugs must be used within BugProvider');
  return ctx;
}
