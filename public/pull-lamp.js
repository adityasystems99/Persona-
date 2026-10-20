// Pull Lamp Standalone SVG Web Component (<pull-lamp>)
// Zero runtime dependencies, Shadow DOM, realistic 2nd-order spring physics
(() => {
  if (typeof window === 'undefined' || customElements.get('pull-lamp')) return;

  function playClick() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (_) {}
  }

  class PullLampElement extends HTMLElement {
    static get observedAttributes() {
      return ['on'];
    }

    constructor() {
      super();
      this.pull = 0;
      this.sway = 0;
      this.velocity = 0;
      this.sideVelocity = 0;
      this.light = 0;
      this.lastTime = 0;
      this.frame = 0;
      this.drag = null;
      this.moved = 0;

      this.motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.handleMotionChange = () => {
        if (this.motionMedia.matches) {
          cancelAnimationFrame(this.frame);
          this.frame = 0;
          this.pull = 0;
          this.sway = 0;
          this.velocity = 0;
          this.sideVelocity = 0;
          this.light = this.hasAttribute('on') ? 1 : 0;
          this.renderPose(0, 0, this.light);
        }
      };
    }

    connectedCallback() {
      if (this.shadowRoot) {
        this.motionMedia.addEventListener('change', this.handleMotionChange);
        this.updateAria();
        this.startAnimation();
        return;
      }

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            aspect-ratio: 480 / 560;
            --light: 0;
            isolation: isolate;
            user-select: none;
            -webkit-user-select: none;
          }
          * { box-sizing: border-box; }
          .art { position: relative; width: 100%; height: 100%; }
          svg { display: block; width: 100%; height: 100%; overflow: visible; }
          .lit { opacity: var(--light); will-change: opacity; }
          .handle {
            position: absolute;
            left: calc(350 / 480 * 100%);
            top: calc(329 / 560 * 100%);
            width: 48px;
            height: 48px;
            transform: translate(-50%, -50%);
            border: 0;
            border-radius: 50%;
            background: transparent;
            cursor: grab;
            touch-action: none;
            -webkit-tap-highlight-color: transparent;
            z-index: 10;
          }
          .handle:active { cursor: grabbing; }
          .handle:focus-visible {
            outline: 2px solid #e0be77;
            outline-offset: 4px;
            background: rgba(224, 190, 119, 0.15);
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        </style>
        <div class="art">
          <svg viewBox="0 0 480 560" aria-hidden="true">
            <defs>
              <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#4a3826"/>
                <stop offset="25%" stop-color="#bf9c62"/>
                <stop offset="45%" stop-color="#ffe4a5"/>
                <stop offset="60%" stop-color="#a27d47"/>
                <stop offset="100%" stop-color="#49331f"/>
              </linearGradient>
              <linearGradient id="brass-edge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#5a412b"/>
                <stop offset="50%" stop-color="#eac98f"/>
                <stop offset="100%" stop-color="#795433"/>
              </linearGradient>
              <linearGradient id="enamel" x1="0" y1="0" x2="1" y2="0.85">
                <stop offset="0%" stop-color="#7fa78e"/>
                <stop offset="18%" stop-color="#3d6350"/>
                <stop offset="45%" stop-color="#214232"/>
                <stop offset="75%" stop-color="#122a1f"/>
                <stop offset="100%" stop-color="#081811"/>
              </linearGradient>
              <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#476450"/>
                <stop offset="40%" stop-color="#163627"/>
                <stop offset="100%" stop-color="#0a1c14"/>
              </linearGradient>
              <linearGradient id="light-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ffe2aa" stop-opacity="0.32"/>
                <stop offset="100%" stop-color="#ffd892" stop-opacity="0"/>
              </linearGradient>
              <radialGradient id="light-pool" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffd997" stop-opacity="0.65"/>
                <stop offset="55%" stop-color="#ffd28a" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#ffd28a" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="lamp-underglow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fffde1"/>
                <stop offset="45%" stop-color="#ffe6a2"/>
                <stop offset="100%" stop-color="#b17839"/>
              </radialGradient>
              <radialGradient id="desk-shadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000000" stop-opacity="0.55"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
              </radialGradient>
              <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="12"/>
              </filter>
            </defs>
            <ellipse cx="245" cy="496" rx="169" ry="29" fill="url(#desk-shadow)"/>
            <g class="lit">
              <path d="M91 216 L10 487 Q240 547 470 487 L389 216 Z" fill="url(#light-beam)"/>
              <ellipse cx="240" cy="487" rx="225" ry="60" fill="url(#light-pool)"/>
            </g>
            <path d="M320 487 Q410 507 456 492" fill="none" stroke="#0b1511" stroke-width="4" stroke-linecap="round"/>
            <ellipse cx="240" cy="477" rx="112" ry="25" fill="#0b1f16"/>
            <path d="M128 468 Q132 447 240 445 Q346 447 352 468 L351 478 Q240 518 129 478 Z" fill="url(#base)"/>
            <ellipse cx="240" cy="467" rx="112" ry="23" fill="url(#enamel)"/>
            <path d="M140 465 Q240 433 340 465" fill="none" stroke="#d2dec5" stroke-opacity="0.25" stroke-width="1.5"/>
            <ellipse cx="240" cy="464" rx="28" ry="8" fill="url(#brass)"/>
            <rect x="230" y="213" width="20" height="249" rx="8" fill="url(#brass)"/>
            <path d="M233 225 V451" stroke="#ffedc6" stroke-opacity="0.4" stroke-width="1.5"/>
            <rect x="220" y="208" width="40" height="42" rx="12" fill="url(#brass)"/>
            <ellipse cx="240" cy="216" rx="153" ry="24" fill="#0b1810"/>
            <ellipse class="lit" cx="240" cy="224" rx="141" ry="23" fill="#ffcf77" filter="url(#soft-glow)"/>
            <ellipse class="lit" cx="240" cy="220" rx="146" ry="18" fill="url(#lamp-underglow)"/>
            <path d="M86 216 C92 151 139 110 206 103 Q240 99 274 103 C341 110 388 151 394 216 Q240 244 86 216 Z" fill="url(#enamel)"/>
            <path d="M102 188 C123 140 159 118 208 113" fill="none" stroke="#e0f0e2" stroke-opacity="0.35" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M87 215 Q240 246 393 215" fill="none" stroke="url(#brass-edge)" stroke-width="4"/>
            <ellipse cx="240" cy="102" rx="16" ry="5" fill="url(#brass)"/>
            <path id="cord-base" d="M350 226 Q350 274 350 329" fill="none" stroke="url(#brass)" stroke-width="2.5"/>
            <path id="cord-beads" d="M350 226 Q350 274 350 329" fill="none" stroke="#ffe3a4" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0.1 5.5"/>
            <g id="knob" transform="translate(0, 0)">
              <ellipse cx="350" cy="332" rx="7" ry="10" fill="url(#brass)"/>
              <ellipse cx="348" cy="329" rx="1.8" ry="4.5" fill="#fff5d9" opacity="0.75"/>
            </g>
          </svg>
          <button class="handle" type="button" aria-label="Switch to light theme" aria-pressed="false"></button>
          <span class="sr-only">Pull cord to toggle illumination.</span>
        </div>
      `;

      this.button = root.querySelector('.handle');
      this.cordBase = root.getElementById('cord-base');
      this.cordBeads = root.getElementById('cord-beads');
      this.knob = root.getElementById('knob');

      this.light = this.hasAttribute('on') ? 1 : 0;
      this.motionMedia.addEventListener('change', this.handleMotionChange);

      this.button.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        const rect = this.getBoundingClientRect();
        this.drag = {
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          scale: 480 / (rect.width || 480),
        };
        this.button.setPointerCapture(e.pointerId);
        this.moved = 0;
      });

      this.button.addEventListener('pointermove', (e) => {
        if (!this.drag || e.pointerId !== this.drag.id) return;
        const dx = (e.clientX - this.drag.x) * this.drag.scale;
        const dy = (e.clientY - this.drag.y) * this.drag.scale;
        this.moved = Math.max(this.moved, Math.hypot(dx, dy));
        this.pull = Math.max(0, Math.min(65, dy));
        this.sway = Math.max(-28, Math.min(28, dx));
        this.renderPose(this.pull, this.sway, this.light);
      });

      this.button.addEventListener('pointerup', (e) => this.handleRelease(e, false));
      this.button.addEventListener('pointercancel', (e) => this.handleRelease(e, true));
      this.button.addEventListener('lostpointercapture', (e) => {
        if (this.drag) this.handleRelease(e, true);
      });

      this.button.addEventListener('click', (e) => {
        if (e.detail === 0) this.toggle();
      });

      this.updateAria();
      this.renderPose(0, 0, this.light);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.motionMedia?.removeEventListener('change', this.handleMotionChange);
      this.drag = null;
    }

    attributeChangedCallback() {
      if (!this.button) return;
      this.updateAria();
      this.startAnimation();
    }

    updateAria() {
      const isOn = this.hasAttribute('on');
      this.button.setAttribute('aria-pressed', String(isOn));
      this.button.setAttribute('aria-label', isOn ? 'Switch to dark theme' : 'Switch to light theme');
    }

    handleRelease(e, cancelled) {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const shouldToggle = !cancelled && (this.pull > 16 || this.moved < 5);
      this.drag = null;

      if (this.button.hasPointerCapture(e.pointerId)) {
        this.button.releasePointerCapture(e.pointerId);
      }

      if (shouldToggle) {
        this.toggle();
      }
      this.startAnimation();
    }

    toggle() {
      playClick();
      this.toggleAttribute('on');
      const isNowOn = this.hasAttribute('on');
      this.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme: isNowOn ? 'light' : 'dark' },
          bubbles: true,
          composed: true,
        })
      );
    }

    startAnimation() {
      if (this.motionMedia.matches) {
        this.pull = 0;
        this.sway = 0;
        this.light = this.hasAttribute('on') ? 1 : 0;
        this.renderPose(0, 0, this.light);
        return;
      }
      if (!this.frame) {
        this.lastTime = performance.now();
        this.frame = requestAnimationFrame(this.physicsTick);
      }
    }

    physicsTick = (now) => {
      const dt = this.lastTime ? Math.min((now - this.lastTime) / 1000, 0.032) : 0.016;
      this.lastTime = now;

      if (!this.drag) {
        this.velocity += (-this.pull * 220 - this.velocity * 19) * dt;
        this.pull += this.velocity * dt;
        this.sideVelocity += (-this.sway * 100 - this.sideVelocity * 9) * dt;
        this.sway += this.sideVelocity * dt;
      }

      const targetLight = this.hasAttribute('on') ? 1 : 0;
      this.light += (targetLight - this.light) * (1 - Math.exp(-dt * 9));
      this.renderPose(this.pull, this.sway, this.light);

      const totalEnergy =
        Math.abs(this.pull) +
        Math.abs(this.velocity) +
        Math.abs(this.sway) +
        Math.abs(this.sideVelocity) +
        Math.abs(targetLight - this.light);

      if (totalEnergy > 0.015 || this.drag) {
        this.frame = requestAnimationFrame(this.physicsTick);
      } else {
        this.frame = 0;
        this.renderPose(0, 0, targetLight);
      }
    };

    renderPose(pull = 0, sway = 0, light = 0) {
      this.style.setProperty('--light', String(Math.max(0, Math.min(1, light))));
      const anchorX = 350;
      const anchorY = 226;
      const endX = anchorX + sway;
      const endY = 329 + pull;
      const ctrlX = anchorX + sway * 0.22;
      const ctrlY = 277 + pull * 0.45;
      const d = `M ${anchorX} ${anchorY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
      if (this.cordBase) this.cordBase.setAttribute('d', d);
      if (this.cordBeads) this.cordBeads.setAttribute('d', d);
      if (this.knob) this.knob.setAttribute('transform', `translate(${sway}, ${pull})`);
      if (this.button) {
        this.button.style.left = `${(endX / 480) * 100}%`;
        this.button.style.top = `${((endY + 3) / 560) * 100}%`;
      }
    }
  }

  customElements.define('pull-lamp', PullLampElement);
})();
