import React, { useState } from 'react';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../data/quotes';

export const QuoteCard: React.FC = () => {
  // Rotate by day index by default, with manual override
  const todayDayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const defaultIdx = todayDayOfYear % MOTIVATIONAL_QUOTES.length;

  const [currentIdx, setCurrentIdx] = useState(defaultIdx);
  const [animating, setAnimating] = useState(false);

  const quote = MOTIVATIONAL_QUOTES[currentIdx];

  const handleNextQuote = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setAnimating(false);
    }, 150);
  };

  return (
    <div className="card-soft p-5 bg-[#101229]/80 border border-violet-500/20 text-white relative overflow-hidden group">
      {/* Subtle decorative background watermark */}
      <div className="absolute -right-4 -bottom-4 text-violet-500/5 pointer-events-none transform rotate-12">
        <Quote size={96} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Sparkles size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
            Mission Directive
          </span>
        </div>
        <button
          onClick={handleNextQuote}
          title="Cycle motivational quote"
          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-300 hover:bg-violet-950/40 transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={animating ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className={`transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-slate-100 font-semibold text-sm leading-relaxed mb-2">
          "{quote.text}"
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="text-violet-300 font-medium">{quote.author}</span>
          <span className="px-2 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/20 text-violet-400 font-mono text-[10px]">
            {quote.category}
          </span>
        </div>
      </div>
    </div>
  );
};
