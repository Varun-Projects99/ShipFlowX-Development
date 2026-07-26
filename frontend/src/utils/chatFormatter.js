import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Parses markdown-like patterns inside messages:
 * - Bold text (**text**) - with recursive parsing support for nested elements
 * - Code blocks (`text`)
 * - Links ([text](url)) - rendered as clickable buttons/anchors
 * 
 * Uses pure JS createElement to avoid Vite .js file JSX parser errors.
 * 
 * @param {string} text The raw string message
 * @returns {React.ReactNode} React elements representing the formatted text
 */
export const formatMessage = (text) => {
  if (!text) return '';

  // Match bold text (**text**), code blocks (`text`), and markdown links ([text](url))
  const regex = /(\`[^\`]+\`|\*\*[^\*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    // 1. Code Block Match
    if (part.startsWith('`') && part.endsWith('`')) {
      return React.createElement(
        'code',
        {
          key: idx,
          className: 'bg-brand-dark px-1.5 py-0.5 rounded text-brand-yellow font-mono text-xs border border-brand-border/50'
        },
        part.slice(1, -1)
      );
    }
    
    // 2. Bold Text Match (Supports recursive formatting for nested links inside bold tags)
    if (part.startsWith('**') && part.endsWith('**')) {
      const innerContent = part.slice(2, -2);
      return React.createElement(
        'strong',
        {
          key: idx,
          className: 'font-bold text-slate-100'
        },
        ...formatMessage(innerContent)
      );
    }

    // 3. Markdown Link Match -> Styled as a Premium CTA Button
    if (part.startsWith('[') && part.endsWith(')')) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        const isLocal = linkUrl.startsWith('/');
        
        return React.createElement(
          isLocal ? Link : 'a',
          {
            key: idx,
            to: isLocal ? linkUrl : undefined,
            href: isLocal ? undefined : linkUrl,
            target: isLocal ? undefined : '_blank',
            rel: isLocal ? undefined : 'noopener noreferrer',
            className: 'inline-flex items-center gap-1.5 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-dark font-black px-4 py-2.5 rounded-xl text-xs mt-2.5 transition-all shadow-glow-yellow/10 hover:scale-[1.02] active:scale-[0.98]'
          },
          linkText
        );
      }
    }
    
    // 4. Line Breaks Handler
    const subParts = part.split('\n');
    if (subParts.length > 1) {
      return subParts.map((sub, sIdx) => {
        const elements = [sub];
        if (sIdx < subParts.length - 1) {
          elements.push(React.createElement('br', { key: `br-${sIdx}` }));
        }
        return React.createElement(
          React.Fragment, 
          { key: `${idx}-${sIdx}` }, 
          ...elements
        );
      });
    }

    return part;
  });
};
