import React from 'react';
import { X, Sparkles, Sun, Moon, Volume2, MoveDown } from 'lucide-react';
import { PullLamp } from '../common/PullLamp';
import { useTheme } from '../../context/ThemeContext';

interface LampThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LampThemeModal: React.FC<LampThemeModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0e1022] dark:bg-[#0e1022] border border-violet-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Ambient background glow according to lamp status */}
        <div
          className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            theme === 'light' ? 'bg-amber-400/20' : 'bg-violet-600/15'
          }`}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-violet-900/30 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Vintage Banker&apos;s Lamp</span>
              </h2>
              <p className="text-xs text-slate-400">
                Draggable cord theme switcher with 2nd-order spring physics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-violet-900/40 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Mode Badge */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                theme === 'light'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                  : 'bg-violet-950/70 text-violet-300 border-violet-500/30'
              }`}
            >
              {theme === 'light' ? <Sun size={13} /> : <Moon size={13} />}
              <span>{theme === 'light' ? 'Warm Daylight Illumination' : 'Dark Cosmic Orbit'}</span>
            </span>
          </div>

          <div className="flex items-center text-[11px] text-slate-400 gap-1.5">
            <Volume2 size={13} className="text-violet-400" />
            <span>Tactile Click Enabled</span>
          </div>
        </div>

        {/* Interactive Lamp Display */}
        <div className="py-2 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-[340px]">
            <PullLamp
              theme={theme}
              onThemeChange={(newTheme) => setTheme(newTheme)}
              width="100%"
              soundEnabled={true}
            />
          </div>

          {/* Interactive Hint */}
          <div className="flex items-center gap-2 text-xs text-amber-300/80 bg-amber-950/30 border border-amber-500/20 px-3.5 py-1.5 rounded-full mt-1 animate-pulse">
            <MoveDown size={14} className="animate-bounce" />
            <span>Drag the brass bead chain down &bull; Or click directly</span>
          </div>
        </div>

        {/* Footer controls & accessibility guidance */}
        <div className="mt-4 pt-4 border-t border-violet-900/30 flex items-center justify-between text-xs text-slate-400">
          <span>Accessible: Tab to focus &amp; press Space / Enter</span>
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="px-3 py-1.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/50 text-slate-200 border border-violet-500/30 text-xs font-medium transition-all"
          >
            Toggle Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default LampThemeModal;
