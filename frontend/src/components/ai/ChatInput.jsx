import React, { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';

const ChatInput = ({ onSend, onClear, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full border-t border-brand-border bg-slate-900/60 p-4 backdrop-blur-md rounded-b-xl items-center">
      {/* Clear Chat Button */}
      <button
        type="button"
        onClick={onClear}
        title="Clear conversation"
        className="w-11 h-11 bg-slate-900 border border-brand-border text-slate-400 hover:text-red-400 hover:border-red-500/20 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0"
      >
        <Trash2 size={18} />
      </button>

      {/* Message Input Box */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isLoading ? "AI is typing..." : "Type your logistics query here..."}
        disabled={isLoading}
        className="flex-grow bg-slate-950/70 border border-brand-border/80 focus:border-brand-yellow/60 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-yellow/30 disabled:opacity-60 transition-all duration-200"
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="w-11 h-11 bg-brand-yellow hover:bg-brand-yellow/90 disabled:bg-brand-yellow/20 text-brand-dark disabled:text-brand-dark/40 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 shadow-glow-yellow/10"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;
