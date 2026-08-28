import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBugs } from '../context/BugContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User as UserIcon, FolderGit, Settings, Sun, 
  Activity, Compass, ShieldAlert, Sparkles, LogIn 
} from 'lucide-react';

export default function ProfileDropdown() {
  const { user, loginWithGoogle, logout } = useAuth();
  const { dispatch, showToast } = useBugs();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await loginWithGoogle();
      if (res.isMock) {
        showToast('Firebase Auth inactive. Entered DevTrace via Local Sandbox Session! 🕵️', 'warning');
      } else {
        showToast('Successfully logged in with Google! 🛡️', 'success');
      }
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
    } catch (err: any) {
      console.error(err);
      showToast(`Google Login failed: ${err.message || 'Popup closed'}`, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      showToast('Logged out successfully! zZ', 'info');
      dispatch({ type: 'SET_VIEW', payload: 'landing' });
    } catch (err: any) {
      showToast(`Logout failed: ${err.message}`, 'error');
    }
  };

  const handleThemeToggle = () => {
    const isLight = document.body.classList.toggle('light-notebook');
    showToast(`Notebook Cover: ${isLight ? 'Light Layout' : 'Original Sketchbook'}`, 'success');
  };

  // If not logged in, show "Continue with Google"
  if (!user) {
    return (
      <button 
        onClick={handleGoogleLogin} 
        disabled={isLoggingIn}
        className="navbar-btn navbar-btn-primary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-hand)',
          fontSize: '1.05rem',
          transform: 'rotate(1deg)',
          padding: '6px 12px'
        }}
      >
        {isLoggingIn ? (
          <span className="spinner-loader" style={{ 
            width: '14px', 
            height: '14px', 
            border: '2px solid white', 
            borderTopColor: 'transparent', 
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 1s linear infinite'
          }} />
        ) : (
          <LogIn size={15} strokeWidth={2.5} />
        )}
        <span>Continue with Google</span>
      </button>
    );
  }

  // Retrieve details
  const photoUrl = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
  const firstName = user.displayName ? user.displayName.split(' ')[0] : 'Detective';

  return (
    <div className="profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      
      {/* Profile/Avatar Button in Navbar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          padding: '4px 10px',
          background: 'var(--paper-beige)',
          color: 'var(--text-dark)',
          border: '2px solid var(--text-dark)',
          borderRadius: '4px',
          boxShadow: '2.5px 2.5px 0px rgba(0,0,0,0.95)',
          userSelect: 'none',
          transition: 'transform 0.2s ease'
        }}
        className="profile-navbar-trigger"
      >
        {/* Profile Avatar Frame with online indicator */}
        <div style={{ position: 'relative', width: '28px', height: '28px' }}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px', border: '1.5px solid var(--text-dark)' }}
            src={photoUrl}
            alt={user.displayName || 'User'}
            title={`${user.displayName} — Google Logged In`}
          />
          {/* Online green indicator dot */}
          <span 
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              background: 'var(--accent-mint)',
              border: '1.5px solid var(--text-dark)',
              borderRadius: '50%'
            }}
          />
        </div>
        
        {/* Name displaying first name */}
        <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {firstName}
        </span>
      </div>

      {/* Dropdown Panel with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '42px',
              right: '0px',
              width: '270px',
              background: 'var(--paper-yellow)',
              border: '3.5px solid var(--text-dark)',
              borderRadius: '6px',
              boxShadow: '6px 6px 0px rgba(0,0,0,0.95)',
              padding: '16px',
              zIndex: 999,
              textAlign: 'left'
            }}
            role="menu"
            aria-orientation="vertical"
          >
            {/* Masking tape topper */}
            <div className="tape-strip" style={{ width: '60px', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}></div>
            
            {/* Profile User Info header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderBottom: '2px dashed rgba(0,0,0,0.15)', paddingBottom: '14px', marginBottom: '10px' }}>
              <img 
                src={photoUrl} 
                alt="Google Profile" 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  border: '2.5px solid var(--text-dark)',
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.15)'
                }}
              />
              <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
                <div style={{ fontFamily: 'var(--font-marker)', fontSize: '1.25rem', color: 'var(--text-dark)' }}>
                  {user.displayName || 'Sprint Detective'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(0,0,0,0.5)', marginTop: '2px' }}>
                  {user.email}
                </div>
              </div>
              
              {/* Badges details */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 900, background: 'var(--accent-mint)', color: 'var(--text-dark)', padding: '2px 6px', border: '1.5px solid var(--text-dark)', borderRadius: '2px' }}>
                  Google Verified 🛡️
                </span>
                <span style={{ fontSize: '0.62rem', fontWeight: 900, background: 'var(--accent-yellow)', color: 'var(--text-dark)', padding: '2px 6px', border: '1.5px solid var(--text-dark)', borderRadius: '2px' }}>
                  Sprint Detective 🕵️
                </span>
              </div>
            </div>

            {/* Menu Items links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div 
                className="dropdown-menu-item"
                onClick={() => { setIsOpen(false); dispatch({ type: 'SET_VIEW', payload: 'dashboard' }); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 'bold' }}
              >
                <Compass size={14} />
                <span>My Workspace</span>
              </div>

              <div 
                className="dropdown-menu-item"
                onClick={() => { setIsOpen(false); dispatch({ type: 'SET_VIEW', payload: 'list' }); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 'bold' }}
              >
                <FolderGit size={14} />
                <span>Assigned Bugs</span>
              </div>

              <div 
                className="dropdown-menu-item"
                onClick={() => { setIsOpen(false); dispatch({ type: 'SET_VIEW', payload: 'sprint' }); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 'bold' }}
              >
                <Activity size={14} />
                <span>Activity Timeline</span>
              </div>

              <div 
                className="dropdown-menu-item"
                onClick={() => { setIsOpen(false); dispatch({ type: 'SET_VIEW', payload: 'assistant' }); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 'bold' }}
              >
                <Settings size={14} />
                <span>Settings</span>
              </div>

              <div 
                className="dropdown-menu-item"
                onClick={handleThemeToggle}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 'bold' }}
              >
                <Sun size={14} />
                <span>Theme Toggle</span>
              </div>

              {/* Divider */}
              <div style={{ height: '2px', borderBottom: '2px dashed rgba(0,0,0,0.15)', margin: '8px 0' }} />

              {/* Logout button (turns into a red paper strip on hover) */}
              <div 
                className="dropdown-logout-strip"
                onClick={handleLogout}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 12px', 
                  borderRadius: '2px', 
                  cursor: 'pointer', 
                  fontFamily: 'var(--font-marker)', 
                  fontSize: '1.1rem', 
                  color: 'white', 
                  background: 'var(--text-dark)',
                  border: '2px solid var(--text-dark)',
                  boxShadow: '1.5px 1.5px 0px rgba(0,0,0,0.85)',
                  transition: 'background 0.2s ease, transform 0.1s ease',
                  marginTop: '4px'
                }}
              >
                <LogOut size={14} strokeWidth={2.5} />
                <span>LOGOUT SESSION</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .profile-navbar-trigger:hover {
          transform: rotate(-1.5deg) scale(1.02);
        }
        .dropdown-menu-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        .dropdown-logout-strip:hover {
          background: var(--accent-coral) !important;
          transform: translateY(1px);
        }
      `}</style>

    </div>
  );
}
