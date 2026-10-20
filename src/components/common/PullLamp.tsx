import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface PullLampProps {
  /** Controlled theme state ('light' | 'dark'). When 'light', lamp is illuminated. */
  theme?: 'light' | 'dark';
  /** Callback fired when theme is toggled by pulling the cord or clicking */
  onThemeChange?: (theme: 'light' | 'dark') => void;
  /** Size width in pixels or CSS string. Default: '100%' */
  width?: number | string;
  /** Custom class name */
  className?: string;
  /** Enable subtle mechanical click audio using Web Audio API (zero external assets). Default: true */
  soundEnabled?: boolean;
}

/**
 * Play a tiny mechanical pull-chain switch click using Web Audio API (zero audio files needed)
 */
function playSwitchClick() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio permission/context errors silently
  }
}

export const PullLamp: React.FC<PullLampProps> = ({
  theme = 'dark',
  onThemeChange,
  width = '100%',
  className = '',
  soundEnabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cordBaseRef = useRef<SVGPathElement>(null);
  const cordBeadsRef = useRef<SVGPathElement>(null);
  const knobRef = useRef<SVGGElement>(null);

  const isLight = theme === 'light';

  // Physics state
  const stateRef = useRef({
    pull: 0,
    sway: 0,
    velocity: 0,
    sideVelocity: 0,
    light: isLight ? 1 : 0,
    drag: null as { id: number; startX: number; startY: number; scale: number } | null,
    moved: 0,
    lastTime: 0,
    frame: 0,
  });

  const [currentLight, setCurrentLight] = useState<number>(isLight ? 1 : 0);

  // Keep target light synced with prop
  useEffect(() => {
    stateRef.current.light = isLight ? 1 : 0;
    setCurrentLight(isLight ? 1 : 0);
  }, [isLight]);

  const updatePose = useCallback((pull: number, sway: number, lightValue: number) => {
    const clampedLight = Math.max(0, Math.min(1, lightValue));
    if (containerRef.current) {
      containerRef.current.style.setProperty('--light', String(clampedLight));
    }

    const anchorX = 350;
    const anchorY = 226;
    const endX = anchorX + sway;
    const endY = 329 + pull;
    const ctrlX = anchorX + sway * 0.22;
    const ctrlY = 277 + pull * 0.45;

    const pathData = `M ${anchorX} ${anchorY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

    if (cordBaseRef.current) cordBaseRef.current.setAttribute('d', pathData);
    if (cordBeadsRef.current) cordBeadsRef.current.setAttribute('d', pathData);
    if (knobRef.current) knobRef.current.setAttribute('transform', `translate(${sway}, ${pull})`);

    if (buttonRef.current) {
      buttonRef.current.style.left = `${(endX / 480) * 100}%`;
      buttonRef.current.style.top = `${((endY + 3) / 560) * 100}%`;
    }
  }, []);

  const triggerToggle = useCallback(() => {
    if (soundEnabled) playSwitchClick();
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange?.(nextTheme);

    // Dispatch global bubbling event
    if (containerRef.current) {
      containerRef.current.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme: nextTheme },
          bubbles: true,
          composed: true,
        })
      );
    }
  }, [theme, onThemeChange, soundEnabled]);

  const startAnimation = useCallback(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      stateRef.current.pull = 0;
      stateRef.current.sway = 0;
      const target = isLight ? 1 : 0;
      updatePose(0, 0, target);
      setCurrentLight(target);
      return;
    }

    if (!stateRef.current.frame) {
      stateRef.current.lastTime = performance.now();

      const tick = (now: number) => {
        const s = stateRef.current;
        const dt = s.lastTime ? Math.min((now - s.lastTime) / 1000, 0.032) : 0.016;
        s.lastTime = now;

        if (!s.drag) {
          // Vertical spring damping: (-pull * k - velocity * d) * dt
          s.velocity += (-s.pull * 220 - s.velocity * 19) * dt;
          s.pull += s.velocity * dt;

          // Horizontal pendulum sway damping
          s.sideVelocity += (-s.sway * 100 - s.sideVelocity * 9) * dt;
          s.sway += s.sideVelocity * dt;
        }

        // Exponential light glow convergence
        const targetLight = isLight ? 1 : 0;
        s.light += (targetLight - s.light) * (1 - Math.exp(-dt * 9));
        setCurrentLight(s.light);

        updatePose(s.pull, s.sway, s.light);

        const energy =
          Math.abs(s.pull) +
          Math.abs(s.velocity) +
          Math.abs(s.sway) +
          Math.abs(s.sideVelocity) +
          Math.abs(targetLight - s.light);

        if (energy > 0.015 || s.drag) {
          s.frame = requestAnimationFrame(tick);
        } else {
          s.frame = 0;
          updatePose(0, 0, targetLight);
          setCurrentLight(targetLight);
        }
      };

      stateRef.current.frame = requestAnimationFrame(tick);
    }
  }, [isLight, updatePose]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const target = e.currentTarget;
    const rect = containerRef.current?.getBoundingClientRect();
    const scale = 480 / (rect?.width || 480);

    stateRef.current.drag = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      scale,
    };
    stateRef.current.moved = 0;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = stateRef.current;
    if (!s.drag || e.pointerId !== s.drag.id) return;

    const dx = (e.clientX - s.drag.startX) * s.drag.scale;
    const dy = (e.clientY - s.drag.startY) * s.drag.scale;
    s.moved = Math.max(s.moved, Math.hypot(dx, dy));

    // Clamp limits for natural feel
    s.pull = Math.max(0, Math.min(65, dy));
    s.sway = Math.max(-28, Math.min(28, dx));

    updatePose(s.pull, s.sway, s.light);
  };

  const handlePointerRelease = (e: React.PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const s = stateRef.current;
    if (!s.drag || e.pointerId !== s.drag.id) return;

    const shouldToggle = !cancelled && (s.pull > 16 || s.moved < 5);
    s.drag = null;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (shouldToggle) {
      triggerToggle();
    }
    startAnimation();
  };

  // Click handler (handles Space / Enter keyboard activation where e.detail === 0)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) {
      triggerToggle();
      startAnimation();
    }
  };

  useEffect(() => {
    startAnimation();
    return () => {
      if (stateRef.current.frame) {
        cancelAnimationFrame(stateRef.current.frame);
      }
    };
  }, [startAnimation]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none isolate ${className}`}
      style={{
        width,
        aspectRatio: '480 / 560',
        ['--light' as string]: String(currentLight),
      }}
    >
      <svg
        viewBox="0 0 480 560"
        aria-hidden="true"
        className="block w-full h-full overflow-visible"
      >
        <defs>
          {/* Polished Brass Gradient */}
          <linearGradient id="banker-brass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a3826" />
            <stop offset="25%" stopColor="#bf9c62" />
            <stop offset="45%" stopColor="#ffe4a5" />
            <stop offset="60%" stopColor="#a27d47" />
            <stop offset="100%" stopColor="#49331f" />
          </linearGradient>

          {/* Brass Rim Trim */}
          <linearGradient id="banker-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5a412b" />
            <stop offset="50%" stopColor="#eac98f" />
            <stop offset="100%" stopColor="#795433" />
          </linearGradient>

          {/* Deep Enamel Banker's Green */}
          <linearGradient id="banker-enamel" x1="0" y1="0" x2="1" y2="0.85">
            <stop offset="0%" stopColor="#7ea58e" />
            <stop offset="18%" stopColor="#3d6350" />
            <stop offset="45%" stopColor="#214232" />
            <stop offset="75%" stopColor="#122a1f" />
            <stop offset="100%" stopColor="#081811" />
          </linearGradient>

          {/* Cast Iron Heavy Base */}
          <linearGradient id="banker-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#476450" />
            <stop offset="40%" stopColor="#163627" />
            <stop offset="100%" stopColor="#0a1c14" />
          </linearGradient>

          {/* Projected Ambient Beam Cone */}
          <linearGradient id="banker-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe2aa" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ffd892" stopOpacity="0" />
          </linearGradient>

          {/* Desk Surface Warm Pool Glow */}
          <radialGradient id="banker-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd997" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#ffd28a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffd28a" stopOpacity="0" />
          </radialGradient>

          {/* Inner Hood Soft Ambient Glow */}
          <radialGradient id="banker-underglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffde1" />
            <stop offset="45%" stopColor="#ffe6a2" />
            <stop offset="100%" stopColor="#b17839" />
          </radialGradient>

          {/* Ground Contact Shadow */}
          <radialGradient id="banker-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Diffused Glow Filter */}
          <filter id="banker-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Shadow under Base */}
        <ellipse cx="245" cy="496" rx="169" ry="29" fill="url(#banker-shadow)" />

        {/* Ambient Projected Illumination */}
        <g style={{ opacity: 'var(--light)', transition: 'opacity 0.05s linear' }}>
          <path d="M91 216 L10 487 Q240 547 470 487 L389 216 Z" fill="url(#banker-beam)" />
          <ellipse cx="240" cy="487" rx="225" ry="60" fill="url(#banker-pool)" />
        </g>

        {/* Heavy Weighted Cast Base */}
        <path d="M320 487 Q410 507 456 492" fill="none" stroke="#0b1511" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="240" cy="477" rx="112" ry="25" fill="#0b1f16" />
        <path d="M128 468 Q132 447 240 445 Q346 447 352 468 L351 478 Q240 518 129 478 Z" fill="url(#banker-base)" />
        <ellipse cx="240" cy="467" rx="112" ry="23" fill="url(#banker-enamel)" />
        <path d="M140 465 Q240 433 340 465" fill="none" stroke="#d2dec5" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* Solid Brass Column Stem & Arm Fitting */}
        <ellipse cx="240" cy="464" rx="28" ry="8" fill="url(#banker-brass)" />
        <rect x="230" y="213" width="20" height="249" rx="8" fill="url(#banker-brass)" />
        <path d="M233 225 V451" stroke="#ffedc6" strokeOpacity="0.4" strokeWidth="1.5" />
        <rect x="220" y="208" width="40" height="42" rx="12" fill="url(#banker-brass)" />

        {/* Underside Socket Glow */}
        <ellipse cx="240" cy="216" rx="153" ry="24" fill="#0b1810" />
        <ellipse
          cx="240"
          cy="224"
          rx="141"
          ry="23"
          fill="#ffcf77"
          filter="url(#banker-soft)"
          style={{ opacity: 'var(--light)', transition: 'opacity 0.05s linear' }}
        />
        <ellipse
          cx="240"
          cy="220"
          rx="146"
          ry="18"
          fill="url(#banker-underglow)"
          style={{ opacity: 'var(--light)', transition: 'opacity 0.05s linear' }}
        />

        {/* Vintage Banker's Green Enamel Hood */}
        <path
          d="M86 216 C92 151 139 110 206 103 Q240 99 274 103 C341 110 388 151 394 216 Q240 244 86 216 Z"
          fill="url(#banker-enamel)"
        />
        {/* Curved Glaze Specular Highlight */}
        <path
          d="M102 188 C123 140 159 118 208 113"
          fill="none"
          stroke="#e0f0e2"
          strokeOpacity="0.35"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Brass Rolled Rim */}
        <path d="M87 215 Q240 246 393 215" fill="none" stroke="url(#banker-edge)" strokeWidth="4" />
        {/* Top Brass Finial Nut */}
        <ellipse cx="240" cy="102" rx="16" ry="5" fill="url(#banker-brass)" />

        {/* Segmented Beaded Pull Chain */}
        <path
          ref={cordBaseRef}
          d="M350 226 Q350 274 350 329"
          fill="none"
          stroke="url(#banker-brass)"
          strokeWidth="2.5"
        />
        <path
          ref={cordBeadsRef}
          d="M350 226 Q350 274 350 329"
          fill="none"
          stroke="#ffe3a4"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="0.1 5.5"
        />

        {/* Brass Teardrop Pull Knob */}
        <g ref={knobRef} transform="translate(0, 0)">
          <ellipse cx="350" cy="332" rx="7" ry="10" fill="url(#banker-brass)" />
          <ellipse cx="348" cy="329" rx="1.8" ry="4.5" fill="#fff5d9" opacity="0.75" />
        </g>
      </svg>

      {/* Accessible Keyboard & Pointer Target positioned over teardrop knob */}
      <button
        ref={buttonRef}
        type="button"
        aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        aria-pressed={isLight}
        title={isLight ? 'Pull cord to switch to Dark Mode' : 'Pull cord to switch to Light Mode'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => handlePointerRelease(e, false)}
        onPointerCancel={(e) => handlePointerRelease(e, true)}
        onClick={handleClick}
        className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-transparent cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#e0be77] focus-visible:outline-offset-4 focus-visible:bg-[#e0be77]/20 z-10 touch-none"
        style={{
          left: 'calc(350 / 480 * 100%)',
          top: 'calc(329 / 560 * 100%)',
        }}
      />
      <span className="sr-only">
        Pull the brass cord down or press Enter or Space to toggle illumination.
      </span>
    </div>
  );
};

export default PullLamp;
