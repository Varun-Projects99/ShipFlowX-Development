import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { Bot } from 'lucide-react';

const ChatWindow = ({ messages, isLoading }) => {
  const containerRef = useRef(null);

  // Auto-scroll container internally. 
  // Avoids calling scrollIntoView which causes the browser window to scroll and show the Footer.
  useEffect(() => {
    if (containerRef.current) {
      // Use setTimeout to ensure DOM updates are rendered before measuring scrollHeight
      const timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={containerRef}
      className="flex-grow overflow-y-auto px-6 py-6 space-y-5 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent min-h-0"
    >
      
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center text-brand-yellow/80 shadow-inner animate-pulse-slow">
            <Bot size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold text-base">Cargo Terminal Assistant</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              Hello! I am your AI shipping coordinator. Ask me about rates, transport times, restricted cargo items, or customs protocols.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))
      )}

      {/* Typing loader bubble */}
      {isLoading && <TypingIndicator />}

    </div>
  );
};

export default ChatWindow;
