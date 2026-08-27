import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Plus, Wifi } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 'tm1',
    name: 'Triveni',
    role: 'Lead Detective',
    avatar: 'T',
    color: '#FBBF24',
    xp: 86,
    level: 12,
    bugs: 14,
    online: true,
    note: 'Hunting critical crash bugs 🔍',
  },
  {
    id: 'tm2',
    name: 'Alex Rivera',
    role: 'Senior Clue Analyst',
    avatar: 'A',
    color: '#60A5FA',
    xp: 74,
    level: 9,
    bugs: 8,
    online: true,
    note: 'Reviewing Sprint #14 evidence',
  },
  {
    id: 'tm3',
    name: 'Priya Menon',
    role: 'Evidence Specialist',
    avatar: 'P',
    color: '#34D399',
    xp: 55,
    level: 6,
    bugs: 5,
    online: false,
    note: 'Deep in API debugging 🐛',
  },
  {
    id: 'tm4',
    name: 'Jordan Kim',
    role: 'Junior Inspector',
    avatar: 'J',
    color: '#F9A8D4',
    xp: 32,
    level: 3,
    bugs: 3,
    online: true,
    note: 'Learning the ropes! 🎯',
  },
  {
    id: 'tm5',
    name: 'Morgan Lee',
    role: 'Design Sleuth',
    avatar: 'M',
    color: '#C084FC',
    xp: 61,
    level: 7,
    bugs: 6,
    online: false,
    note: 'Tracking UI regression cases',
  },
];

const ROTATE_OFFSETS = ['-2deg', '1.5deg', '-1deg', '2.5deg', '-1.5deg'];

export default function TeamView() {
  const { bugs } = useBugs();
  const [inviteEmail, setInviteEmail] = useState('');
  const [invited, setInvited] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInvited(true);
    setTimeout(() => {
      setInvited(false);
      setInviteEmail('');
    }, 2500);
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
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <div style={{ position: 'relative' }}>
          <div className="tape-strip" style={{ width: '80px', top: '-12px', left: '-4px', transform: 'rotate(-3deg)' }} />
          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Detective <span style={{ color: '#FBBF24' }}>Squad</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: '#9CA3AF', margin: '4px 0 0', transform: 'rotate(-1deg)', display: 'inline-block' }}>
            Your investigation team — case assignments &amp; XP progress
          </p>
        </div>

        {/* Online count */}
        <div style={{
          background: '#1A2233',
          border: '2px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '6px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '3px 3px 0px rgba(0,0,0,0.95)'
        }}>
          <Wifi size={14} color="#34D399" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399' }}>
            {TEAM_MEMBERS.filter(m => m.online).length} online
          </span>
        </div>
      </div>

      {/* Cork Board — Team Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '28px',
        padding: '24px',
        background: '#0D1117',
        border: '3px solid #1A2233',
        borderRadius: '12px',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(251,191,36,0.02) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(96,165,250,0.02) 0%, transparent 50%)
        `,
        marginBottom: '36px'
      }}>
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={member.id}
            style={{
              background: '#111827',
              border: `2.5px solid ${member.color}30`,
              borderRadius: '8px',
              padding: '20px',
              transform: `rotate(${ROTATE_OFFSETS[idx % ROTATE_OFFSETS.length]})`,
              boxShadow: '5px 5px 0px rgba(0,0,0,0.95)',
              position: 'relative',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) translateY(-4px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = `8px 8px 0px rgba(0,0,0,0.95), 0 0 20px ${member.color}20`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = `rotate(${ROTATE_OFFSETS[idx % ROTATE_OFFSETS.length]})`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = '5px 5px 0px rgba(0,0,0,0.95)';
            }}
          >
            {/* Tape pin at top */}
            <div className="tape-strip" style={{ width: '36px', top: '-8px', left: '50%', transform: 'translateX(-50%) rotate(0deg)' }} />

            {/* Online indicator */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: member.online ? '#34D399' : '#4B5563',
              boxShadow: member.online ? '0 0 6px rgba(52,211,153,0.6)' : 'none'
            }} />

            {/* Avatar */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: `${member.color}20`,
              border: `2.5px solid ${member.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: member.color,
              fontFamily: 'var(--font-sans)',
              margin: '12px auto 12px',
              boxShadow: `0 0 16px ${member.color}30`
            }}>
              {member.avatar}
            </div>

            {/* Name & role */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#FFFFFF', fontFamily: 'var(--font-sans)' }}>
                {member.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: member.color, fontFamily: 'var(--font-hand)', fontWeight: 'bold', marginTop: '2px' }}>
                {member.role}
              </div>
            </div>

            {/* Stat row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px dashed rgba(255,255,255,0.08)',
              paddingTop: '10px',
              marginBottom: '10px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FBBF24' }}>Lv{member.level}</div>
                <div style={{ fontSize: '0.6rem', color: '#9CA3AF' }}>Level</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#60A5FA' }}>{member.bugs}</div>
                <div style={{ fontSize: '0.6rem', color: '#9CA3AF' }}>Bugs</div>
              </div>
            </div>

            {/* XP bar */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.62rem', color: '#9CA3AF' }}>XP Progress</span>
                <span style={{ fontSize: '0.62rem', color: member.color, fontWeight: 'bold' }}>{member.xp}%</span>
              </div>
              <div style={{ height: '5px', background: '#1A2233', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${member.xp}%`,
                  height: '100%',
                  background: member.color,
                  borderRadius: '3px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>

            {/* Sticky note */}
            <div style={{
              fontFamily: 'var(--font-hand)',
              fontSize: '0.75rem',
              color: '#9CA3AF',
              fontStyle: 'italic'
            }}>
              {member.note}
            </div>
          </div>
        ))}
      </div>

      {/* Invite sticky note form */}
      <div style={{
        background: '#FEF9C3',
        border: '2px solid #111827',
        borderRadius: '6px',
        padding: '20px 24px',
        maxWidth: '440px',
        transform: 'rotate(-1deg)',
        boxShadow: '5px 5px 0px rgba(0,0,0,0.95)',
        position: 'relative'
      }}>
        <div className="tape-strip" style={{ width: '60px', top: '-8px', left: '24px' }} />
        <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.3rem', color: '#111827', margin: '0 0 12px', fontWeight: 900 }}>
          📨 Invite a New Detective
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            placeholder="detective@agency.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.7)',
              border: '2px solid #111827',
              borderRadius: '4px',
              padding: '8px 12px',
              fontFamily: 'var(--font-hand)',
              fontSize: '0.9rem',
              color: '#111827',
              outline: 'none'
            }}
          />
          <button
            onClick={handleInvite}
            style={{
              background: '#FBBF24',
              color: '#111827',
              border: '2px solid #111827',
              borderRadius: '4px',
              padding: '8px 14px',
              fontWeight: 900,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={14} /> Send
          </button>
        </div>
        {invited && (
          <p style={{ fontFamily: 'var(--font-hand)', color: '#059669', margin: '8px 0 0', fontSize: '0.88rem' }}>
            ✅ Invite sent! They'll join the squad soon.
          </p>
        )}
      </div>
    </div>
  );
}
