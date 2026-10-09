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
    <div className="card-soft p-5 bg-gradient-to-br from-white via-rose-50/30 to-amber-50/30 relative overflow-hidden group">
      {/* Subtle decorative background watermark */}
      <div className="absolute -right-4 -bottom-4 text-rose-500/5 pointer-events-none transform rotate-12">
        <Quote size={96} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Sparkles size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Daily Mindset
          </span>
        </div>
        <button
          onClick={handleNextQuote}
          title="Cycle motivational quote"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={animating ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className={`transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-slate-800 font-semibold text-sm leading-relaxed mb-2">
          "{quote.text}"
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{quote.author}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
            {quote.category}
          </span>
        </div>
      </div>
    </div>
  );
};
