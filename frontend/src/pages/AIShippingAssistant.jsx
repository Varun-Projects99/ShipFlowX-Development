import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ai/ChatWindow';
import ChatInput from '../components/ai/ChatInput';
import SuggestionCards from '../components/ai/SuggestionCards';
import { getAIResponse } from '../services/aiAssistantService';

const AIShippingAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial welcome greeting from AI coordinator
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: "Welcome to the **ShipFlowX Intelligence Center**.\n\nI can help you coordinate international freight dispatches, check customs clearances, calculate tariff rules, or explain transit delays. What details can I compile for you today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Send message handler
  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // 1. Append user query
    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Fetch simulated AI answer from service
      const response = await getAIResponse(text);
      
      const botMsg = {
        sender: 'bot',
        text: response.text,
        timestamp: response.timestamp
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "⚠️ System connection anomaly. Could not verify response credentials. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset conversation logs
  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: "Conversation cleared. Ready for your next logistics query. Ask me about rates, prohibited items, or documents.",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col overflow-hidden max-w-7xl mx-auto px-4 md:px-8 pb-3 space-y-2">
      
      {/* Upper Navigation Bar containing backlink and title inline to maximize height */}
      <div className="flex items-center justify-between shrink-0 select-none pb-1 border-b border-brand-border/30">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider group transition-colors"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </Link>
          <div className="w-[1px] h-3 bg-brand-border/60"></div>
          <div className="flex items-center gap-1.5">
            <Bot size={18} className="text-brand-yellow" />
            <h1 className="text-sm font-black text-white tracking-tight uppercase">AI Copilot Terminal</h1>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-semibold hidden sm:block">
          Interactive customs & rate estimation assistant
        </p>
      </div>

      {/* Chat Console Board - Viewport Height Contained */}
      <div className="flex-grow flex flex-col min-h-0 bg-brand-card/25 border border-brand-border rounded-xl shadow-premium overflow-hidden w-full">
        
        {/* Sub Header */}
        <div className="px-6 py-2.5 border-b border-brand-border bg-brand-card/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-widest bg-brand-yellow/10 px-2 py-0.5 rounded">
              Engine Active
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Secure Socket Connected
            </span>
          </div>
        </div>

        {/* Scrollable message feed window - Dynamic Height Maximize */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Horizontal Suggestion Cards row positioned inline above text input box */}
        <SuggestionCards onSelect={handleSendMessage} />

        {/* Text Input Panel */}
        <ChatInput 
          onSend={handleSendMessage} 
          onClear={handleClearChat} 
          isLoading={isLoading} 
        />
        
      </div>

    </div>
  );
};

export default AIShippingAssistant;
