import React, { useEffect } from 'react';
import { useBugs } from '../../context/BugContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dispatch } = useBugs();

  const icons = {
    success: <CheckCircle2 size={16} color="var(--color-success)" />,
    error: <XCircle size={16} color="var(--color-danger)" />,
    warning: <AlertTriangle size={16} color="var(--color-warn)" />,
    info: <Info size={16} color="var(--color-info)" />,
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div className="toast-icon">{icons[t.type]}</div>
          <span className="toast-message">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: t.id })}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
