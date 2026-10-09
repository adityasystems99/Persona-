import React from 'react';

interface TimerRingProps {
  remainingSeconds: number;
  totalSeconds: number;
  size?: number;
  strokeWidth?: number;
  isRunning: boolean;
  isCompleted: boolean;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  remainingSeconds,
  totalSeconds,
  size = 180,
  strokeWidth = 10,
  isRunning,
  isCompleted,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Progress from 0 (completed) to 1 (full time left)
  const safeTotal = totalSeconds > 0 ? totalSeconds : 1800;
  const progressRatio = Math.max(0, Math.min(1, remainingSeconds / safeTotal));
  const strokeDashoffset = circumference - progressRatio * circumference;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Track background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
          fill="transparent"
        />

        {/* Dynamic active circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={isCompleted ? 'url(#completedGradient)' : 'url(#timerGradient)'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.4s ease-out',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {isCompleted ? (
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-2xl">🎉</span>
            <span className="text-lg font-bold text-emerald-600 mt-1">Done!</span>
            <span className="text-[11px] text-emerald-500 font-medium">30m logged</span>
          </div>
        ) : (
          <>
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              {isRunning ? 'Focusing...' : remainingSeconds < totalSeconds ? 'Paused' : 'Ready'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
