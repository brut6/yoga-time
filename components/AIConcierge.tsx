
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { aiService } from '../services';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export const AIConcierge: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: "Hello. I'm Aura. How is your energy today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (isOpen && !chatSession) {
      const session = aiService.createChatSession();
      if (session) {
        setChatSession(session);
      } else {
        setMessages(prev => [...prev, { 
          id: 'error', 
          role: 'model', 
          text: "I'm currently offline (API Key missing). Please check back later." 
        }]);
      }
    }
  }, [isOpen, chatSession]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Stable SDK: sendMessageStream takes string directly, returns object with .stream
      const result = await chatSession.sendMessageStream(userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      let fullText = "";
      
      // Add placeholder for streaming message
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: "", isStreaming: true }]);

      for await (const chunk of result.stream) {
        let chunkText = "";
        try {
          // Robust text extraction for stable SDK
          if (typeof chunk.text === 'function') {
            chunkText = chunk.text();
          } else if (typeof chunk.text === 'string') {
            chunkText = chunk.text;
          }
        } catch (err) {
          // Continue stream even if one chunk fails
        }

        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => prev.map(m => 
            m.id === botMsgId ? { ...m, text: fullText } : m
          ));
        }
      }
      
      // Finalize
      setMessages(prev => prev.map(m => 
        m.id === botMsgId ? { ...m, isStreaming: false } : m
      ));

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm having trouble connecting right now. Let's try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      backgroundColor: 'rgba(253, 251, 249, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 24px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E3DACE 0%, #F5F0EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✦</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.95rem' }}>Aura</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>AI Concierge</div>
          </div>
        </div>
        <button onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--text-2)', padding: 8 }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, overflowY: 'auto', padding: '24px', 
        display: 'flex', flexDirection: 'column', gap: 24 
      }} className="hide-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%'
          }}>
            <div style={{ 
              padding: '16px 20px', 
              borderRadius: 24,
              borderTopRightRadius: msg.role === 'user' ? 4 : 24,
              borderTopLeftRadius: msg.role === 'model' ? 4 : 24,
              backgroundColor: msg.role === 'user' ? 'var(--text-1)' : '#FFFFFF',
              color: msg.role === 'user' ? '#FFFFFF' : 'var(--text-1)',
              boxShadow: msg.role === 'model' ? '0 4px 20px rgba(0,0,0,0.03)' : '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
              {msg.isStreaming && <span style={{ display: 'inline-block', width: 6, height: 6, backgroundColor: 'currentColor', borderRadius: '50%', marginLeft: 4, animation: 'pulse 1s infinite' }}></span>}
            </div>
          </div>
        ))}
        {isTyping && !messages[messages.length - 1].isStreaming && (
          <div style={{ alignSelf: 'flex-start', marginLeft: 12, opacity: 0.5, fontSize: '0.8rem', fontStyle: 'italic' }}>
            Aura is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ 
        padding: '16px 24px', 
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12,
          backgroundColor: '#F5F3F0',
          borderRadius: 32,
          padding: '8px 8px 8px 20px'
        }}>
          <input 
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Aura..."
            style={{ 
              flex: 1, background: 'transparent', border: 'none', 
              outline: 'none', fontSize: '1rem', color: 'var(--text-1)' 
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            style={{ 
              width: 40, height: 40, borderRadius: '50%', 
              backgroundColor: input.trim() ? 'var(--text-1)' : '#E0E0E0',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
