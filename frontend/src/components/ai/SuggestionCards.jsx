import React from 'react';
import { Clock, ArrowLeftRight, FileText, Search, AlertTriangle, Shield, HelpCircle } from 'lucide-react';
import { AI_SUGGESTIONS } from '../../constants/aiSuggestions';

const IconMap = {
  Clock,
  ArrowLeftRight,
  FileText,
  Search,
  AlertTriangle,
  Shield
};

const SuggestionCards = ({ onSelect }) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto py-2.5 scrollbar-none w-full shrink-0 select-none border-t border-brand-border/30 bg-slate-900/30 px-4">
      {AI_SUGGESTIONS.map((sug, idx) => {
        const IconComponent = IconMap[sug.icon] || HelpCircle;
        return (
          <button
            key={idx}
            onClick={() => onSelect(sug.text)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-brand-border/60 bg-brand-card/45 hover:bg-brand-card hover:border-brand-yellow/45 text-left transition-all duration-200 shrink-0 text-slate-300 hover:text-white text-[11px] font-semibold hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <IconComponent size={12} className="text-brand-yellow/80 shrink-0" />
            <span className="truncate max-w-[200px]">{sug.text}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SuggestionCards;
