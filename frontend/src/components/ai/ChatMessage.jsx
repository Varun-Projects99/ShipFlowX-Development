import React from 'react';
import { Bot, User } from 'lucide-react';
import { formatMessage } from '../../utils/chatFormatter';
import { formatTimestamp } from '../../utils/messageTimestamp';

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 w-full ${isBot ? '' : 'flex-row-reverse'}`}>
      
      {/* Speaker Avatar Node */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
        isBot 
          ? 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow' 
          : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
      }`}>
        {isBot ? <Bot size={15} /> : <User size={15} />}
      </div>

      {/* Message Text Bubble Container */}
      <div className="flex flex-col max-w-[90%] md:max-w-[85%] space-y-1">
        <div className={`px-4.5 py-3 rounded-2xl text-sm leading-relaxed shadow-md border ${
          isBot 
            ? 'bg-brand-card border-brand-border rounded-tl-none text-slate-300' 
            : 'bg-brand-yellow/10 border-brand-yellow/20 rounded-tr-none text-slate-100'
        }`}>
          {formatMessage(message.text)}
        </div>
        
        {/* Timestamp */}
        <span className={`text-[9px] text-slate-500 font-semibold px-1 ${
          isBot ? 'text-left' : 'text-right'
        }`}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>

    </div>
  );
};

export default ChatMessage;
