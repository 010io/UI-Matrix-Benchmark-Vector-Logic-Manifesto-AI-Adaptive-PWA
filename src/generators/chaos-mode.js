/**
 * Chaos Mode - Particle Storm Stress Test
 * The ultimate DOM vs Vector performance showdown
 * 
 * Real Engineering Implementation:
 * - DOM: Individual <div> elements with translate3d (Hardware Accelerated but heavy on Layout/Composite)
 * - Vector: Single <svg> with <path> d attribute (Pure Math, lightweight)
 */

class ChaosMode {
  constructor() {
    this.particles = [];
    this.animationId = null;
    this.width = 800;
    this.height = 400;
    this.rendererType = 'dom';
    this.container = null;
    this.fpsMeter = null;
    this.pathElement = null;
    this.dBuffer = null;
  }

  // Initialize with real FPS meter
  init(containerId, type, count = 1000) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container not found: ${containerId}`);
      return;
    }
    this.rendererType = type;
    this.particles = [];
    this.dBuffer = new Array(count);

    this.width = this.container.clientWidth || 800;
    this.height = this.container.clientHeight || 400;

    const fpsDisplayId = type === 'dom' ? 'dom-fps' : 'vector-fps';
    if (typeof FPSMeter !== 'undefined') {
      this.fpsMeter = new FPSMeter(fpsDisplayId);
    } else {
      this.fpsMeter = { tick: () => { }, getFPS: () => 0 };
    }

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        color: Math.random() > 0.5 ? '#67C3F3' : '#000000'
      });
    }

    this.renderInitialState();
  }

  renderInitialState() {
    this.container.innerHTML = '';

    if (this.rendererType === 'dom') {
      // DOM: Create thousands of DIVs. This kills the browser.
      const fragment = document.createDocumentFragment();
      this.particles.forEach(p => {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.width = '4px';
        el.style.height = '4px';
        el.style.background = p.color;
        el.style.borderRadius = '50%';
        // Use translate3d for GPU acceleration
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        p.element = el;
        fragment.appendChild(el);
      });
      this.container.appendChild(fragment);

    } else {
      // VECTOR: Single SVG Path.
      this.container.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${this.width} ${this.height}" style="overflow: visible;">
        <path id="chaos-path-${this.rendererType}" fill="none" stroke="#67C3F3" stroke-width="4" stroke-linecap="round" />
      </svg>`;
      this.pathElement = this.container.querySelector('path');
    }
  }

  start() {
    if (this.animationId) return;

    const update = () => {
      if (this.fpsMeter) this.fpsMeter.tick();

      const particleCount = this.particles.length;
      const w = this.width;
      const h = this.height;

      for (let i = 0; i < particleCount; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      if (this.rendererType === 'dom') {
        for (let i = 0; i < particleCount; i++) {
          const p = this.particles[i];
          if (p.element) {
            p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
          }
        }
        this.container.offsetHeight;
      } else {
        if (this.pathElement) {
          for (let i = 0; i < particleCount; i++) {
            const p = this.particles[i];
            this.dBuffer[i] = `M${Math.round(p.x)} ${Math.round(p.y)}l.1 0`;
          }
          this.pathElement.setAttribute('d', this.dBuffer.join(' '));
        }
      }

      this.animationId = requestAnimationFrame(update);
    };

    this.animationId = requestAnimationFrame(update);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setParticleCount(count) {
    this.dBuffer = new Array(count);
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChaosMode;
} else {
  window.ChaosMode = ChaosMode;
}
