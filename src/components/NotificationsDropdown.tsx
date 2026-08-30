import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New Clue Discovered",
      message: "Lead Detective Alex commented on Case #104.",
      time: "2m ago",
      type: "message",
      read: false
    },
    {
      id: 2,
      title: "Critical Blockage",
      message: "Memory leak detected in production environment.",
      time: "1h ago",
      type: "alert",
      read: false
    },
    {
      id: 3,
      title: "Case Closed",
      message: "The Phantom Scroll issue has been resolved.",
      time: "3h ago",
      type: "success",
      read: true
    }
  ];

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

  return (
    <div className="paper-clip-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <div className="paper-clip-decoration" />
      <button
        className="navbar-icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        data-tooltip={isOpen ? undefined : "View alerts and notifications"}
        data-tooltip-pos="bottom"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {notifications.some(n => !n.read) && <span className="notification-dot" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '120%',
              right: '-10px',
              width: '320px',
              background: 'var(--bg-surface)',
              border: '2px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
              zIndex: 100,
              fontFamily: 'var(--font-sans)',
              transformOrigin: 'top right'
            }}
          >
            {/* Sketchbook tape decoration */}
            <div className="tape-strip" style={{ 
              width: '40px', 
              top: '-10px', 
              left: '50%', 
              transform: 'translateX(-50%) rotate(-2deg)' 
            }} />

            <div style={{ padding: '12px 8px', borderBottom: '1px dashed rgba(255,255,255,0.1)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-marker)', fontSize: '1.1rem', color: 'var(--text-white)' }}>
                Latest Intel
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-coral)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-hand)' }}
              >
                Clear all
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '350px', overflowY: 'auto' }}>
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '4px', 
                    background: notif.read ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(255, 255, 255, 0.03)'}
                >
                  <div style={{ marginTop: '2px', color: notif.type === 'message' ? 'var(--accent-blue)' : notif.type === 'alert' ? 'var(--accent-coral)' : 'var(--accent-mint)' }}>
                    {notif.type === 'message' && <MessageSquare size={16} />}
                    {notif.type === 'alert' && <AlertTriangle size={16} />}
                    {notif.type === 'success' && <CheckCircle2 size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: notif.read ? 'var(--text-muted)' : 'var(--text-white)', marginBottom: '4px' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '6px' }}>
                      {notif.message}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-hand)' }}>
                      {notif.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  cursor: 'pointer', 
                  padding: '4px',
                  width: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-white)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                View all cases
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
