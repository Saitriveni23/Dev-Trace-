import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import { Sparkles, Send, Bug, Cpu, Terminal, ArrowRight, UserPlus, FileCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  noteClass: string;
  angle: number;
}

// Cute Robot Bug Mascot SVG
const RobotBug = () => (
  <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto', animation: 'mascot-float 3s infinite ease-in-out' }}>
    <svg 
      viewBox="0 0 100 100" 
      width="100%" 
      height="100%" 
      fill="none" 
      stroke="var(--text-dark)" 
      strokeWidth="5"
      strokeLinecap="round"
    >
      {/* Mechanical Antenna with lights */}
      <path d="M 35 25 Q 25 8 18 12" />
      <path d="M 65 25 Q 75 8 82 12" />
      <circle cx="18" cy="12" r="4.5" fill="var(--accent-mint)" stroke="var(--text-dark)" strokeWidth="2" />
      <circle cx="82" cy="12" r="4.5" fill="var(--accent-mint)" stroke="var(--text-dark)" strokeWidth="2" />

      {/* Robot Metallic Head/Body */}
      <path d="M 22 45 C 18 28, 82 28, 78 45 C 83 66, 73 78, 50 78 C 27 78, 17 66, 22 45 Z" fill="var(--paper-blue)" stroke="currentColor" />
      
      {/* Metal plate panels line */}
      <path d="M 20 54 L 80 54" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" />
      <circle cx="50" cy="54" r="5" fill="var(--accent-yellow)" stroke="currentColor" strokeWidth="2" />

      {/* Glowing Matrix Eyes */}
      <circle cx="38" cy="44" r="7" fill="var(--accent-mint)" stroke="var(--text-dark)" strokeWidth="2" />
      <circle cx="62" cy="44" r="7" fill="var(--accent-mint)" stroke="var(--text-dark)" strokeWidth="2" />
      <circle cx="38" cy="44" r="2.5" fill="white" stroke="none" />
      <circle cx="62" cy="44" r="2.5" fill="white" stroke="none" />

      {/* Mechanical Crawly Legs */}
      <path d="M 14 45 L 4 48 M 86 45 L 96 48" strokeWidth="4" />
      <path d="M 12 60 L 2 64 M 88 60 L 98 64" strokeWidth="4" />
    </svg>
  </div>
);

export default function AIAssistantView() {
  const { bugs, showToast } = useBugs();
  const [query, setQuery] = useState('');
  
  // Conversation list state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello detective! I am BugBot, your silicon debugging assistant. I can help decipher stack traces, hunt duplicate cases, or generate fix scripts. Scribe your query below!',
      timestamp: new Date(),
      noteClass: 'note-yellow',
      angle: -1
    }
  ]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
      noteClass: 'note-blue',
      angle: 1.5
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    // Generate responsive silicon bug reply based on keywords
    setTimeout(() => {
      let botReply = '';
      const textLower = textToSend.toLowerCase();

      if (textLower.includes('explain') || textLower.includes('error')) {
        botReply = '🤖 BugBot Clue: The exception points to a null pointer allocation at initialization. Line 84 tries to reference the client socket before the handler handshake completes. Wrap inside an index sanity check!';
      } else if (textLower.includes('duplicate')) {
        botReply = `🤖 BugBot Clue: Pinned cases BS-1045 ("Phantom Scroll") and BS-1112 ("Infinite Spinner") share 88% stack match indexes. Recommend merging case references together!`;
      } else if (textLower.includes('fix')) {
        botReply = '🤖 BugBot Clue: Add a null-guard safety trace: \n`if (clientSocket === null) { return; }` \nThis prevents early call events before hydration!';
      } else if (textLower.includes('test')) {
        botReply = '🤖 BugBot Clue: Generate test case: \n`test("should guard null client socket", () => { expect(initSocket(null)).toBeUndefined(); });` \nThis secures the handler routine!';
      } else if (textLower.includes('assign')) {
        botReply = '🤖 BugBot Clue: Tagging Lead Detective Alex for this task. P1 blockages are Alex\'s specialty!';
      } else {
        botReply = `🤖 BugBot Clue: Scribed query received. Tracking error logs... Recommend trying one of my fast-clue stickers above to scan the stack trail!`;
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date(),
        noteClass: 'note-yellow',
        angle: -1.5
      };

      setMessages(prev => [...prev, botMsg]);
      
      confetti({
        particleCount: 30,
        spread: 30,
        colors: ['#66D9A8', '#8B5CF6']
      });
      showToast('AI Clue decrypted!', 'success');
    }, 900);
  };

  const handleFeatureClick = (feature: string) => {
    let text = '';
    switch (feature) {
      case 'explain':
        text = 'Explain error stack trace for socket handler pool crash.';
        break;
      case 'duplicate':
        text = 'Find duplicates for the connection pool socket leak.';
        break;
      case 'fix':
        text = 'Suggest fix code for null-reference handler crash.';
        break;
      case 'test':
        text = 'Generate test cases for connection stability.';
        break;
      case 'assign':
        text = 'Assign developer to resolve connection pool blocking.';
        break;
    }
    handleSend(text);
  };

  return (
    <div 
      className="ai-assistant-page" 
      style={{ 
        background: '#0E0D14',
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          radial-gradient(rgba(255, 255, 255, 0.015) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '24px 24px, 48px 48px',
        minHeight: '100%', 
        padding: '30px', 
        color: 'var(--text-white)',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: '30px',
        position: 'relative'
      }}
    >
      {/* Floating doodles backgrounds */}
      <span style={{ position: 'absolute', top: '10%', right: '5%', color: 'rgba(255,255,255,0.03)', fontSize: '5rem', fontFamily: 'var(--font-hand)', pointerEvents: 'none' }}>🤖 silicon</span>
      <span style={{ position: 'absolute', bottom: '15%', left: '20%', color: 'rgba(255,255,255,0.02)', fontSize: '6rem', fontFamily: 'var(--font-hand)', pointerEvents: 'none' }}>★ test cases</span>

      {/* Left Column: Robot Mascot and Feature Stickers */}
      <div 
        style={{ 
          borderRight: '2px dashed rgba(255,255,255,0.08)', 
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <RobotBug />
          <div style={{ fontFamily: 'var(--font-marker)', fontSize: '1.2rem', color: 'var(--accent-mint)', marginTop: '8px' }}>
            BugBot Assistant
          </div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            .. crawling trails ..
          </div>
        </div>

        {/* Feature quick stickers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-yellow)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Clue Stickers</span>
          
          <button
            onClick={() => handleFeatureClick('explain')}
            className="mood-sticker"
            style={{ width: '100%', textAlign: 'left', background: 'var(--paper-beige)', display: 'flex', alignItems: 'center', gap: '6px', transform: 'rotate(-1.5deg)' }}
          >
            <Terminal size={12} /> Explain Error
          </button>

          <button
            onClick={() => handleFeatureClick('duplicate')}
            className="mood-sticker"
            style={{ width: '100%', textAlign: 'left', background: 'var(--paper-yellow)', display: 'flex', alignItems: 'center', gap: '6px', transform: 'rotate(1deg)' }}
          >
            <Bug size={12} /> Find Duplicate
          </button>

          <button
            onClick={() => handleFeatureClick('fix')}
            className="mood-sticker"
            style={{ width: '100%', textAlign: 'left', background: 'var(--paper-blue)', display: 'flex', alignItems: 'center', gap: '6px', transform: 'rotate(-2deg)' }}
          >
            <Sparkles size={12} /> Suggest Fix
          </button>

          <button
            onClick={() => handleFeatureClick('test')}
            className="mood-sticker"
            style={{ width: '100%', textAlign: 'left', background: 'var(--paper-pink)', display: 'flex', alignItems: 'center', gap: '6px', transform: 'rotate(1.5deg)' }}
          >
            <FileCode size={12} /> Test Cases
          </button>

          <button
            onClick={() => handleFeatureClick('assign')}
            className="mood-sticker"
            style={{ width: '100%', textAlign: 'left', background: 'var(--paper-blue)', display: 'flex', alignItems: 'center', gap: '6px', transform: 'rotate(-1deg)' }}
          >
            <UserPlus size={12} /> Assign Dev
          </button>
        </div>
      </div>

      {/* Right Column: Chat notebook interface */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
        
        {/* Scrollable messages container */}
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '10px 10px 30px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '30px' 
          }}
        >
          {messages.map(msg => {
            const isBot = msg.sender === 'assistant';
            return (
              <div 
                key={msg.id}
                style={{
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '70%',
                  position: 'relative'
                }}
              >
                {/* Sticky Note Bubble */}
                <div 
                  className={`metric-sticky-card ${msg.noteClass}`}
                  style={{
                    minHeight: 'auto',
                    padding: '16px 20px',
                    borderRadius: '2px',
                    transform: `rotate(${msg.angle}deg)`,
                    boxShadow: '4px 4px 0px rgba(0,0,0,0.95)',
                    alignItems: 'flex-start',
                    textAlign: 'left'
                  }}
                >
                  <div className="tape-strip" style={{ width: '50px', top: '-10px', left: '20px' }}></div>
                  
                  {/* Sender title */}
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    {isBot ? 'BugBot silicon' : 'Lead Detective'}
                  </span>

                  <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: 'var(--text-dark)', lineHeight: 1.3, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input box styled like ruled line */}
        <form 
          onSubmit={e => { e.preventDefault(); handleSend(query); }}
          style={{ 
            borderTop: '2px solid rgba(255,255,255,0.06)', 
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ flex: 1, borderBottom: '2.5px solid var(--accent-yellow)', display: 'flex', alignItems: 'center', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', paddingRight: '8px' }}>$</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Scribe your query or drag trace details here..."
              style={{
                background: 'transparent',
                border: 'none',
                flex: 1,
                fontFamily: 'var(--font-hand)',
                fontSize: '1.4rem',
                color: 'var(--text-white)',
                outline: 'none'
              }}
            />
          </div>
          <button 
            type="submit"
            className="btn btn-primary"
            style={{
              boxShadow: '3px 3px 0px rgba(0,0,0,0.9)',
              transform: 'rotate(-1.5deg)',
              padding: '10px 18px'
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>

    </div>
  );
}
