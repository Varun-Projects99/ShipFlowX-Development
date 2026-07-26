import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3">
      {/* Bot Avatar Icon */}
      <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow text-xs font-bold shrink-0 shadow-sm">
        AI
      </div>
      
      {/* Indicator Bubble */}
      <div className="bg-brand-card border border-brand-border px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-md">
        <span className="w-2 h-2 bg-brand-yellow/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-brand-yellow/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-brand-yellow/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
