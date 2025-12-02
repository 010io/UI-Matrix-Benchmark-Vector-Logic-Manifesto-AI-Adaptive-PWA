/**
 * PWA Enhancements - Responsive, Accessible, Hybrid rendering
 */

class PWAEnhancements {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.accessibility = localStorage.getItem('accessibility') || 'normal';
    this.renderMode = this.detectRenderMode();
    
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupAccessibility();
    this.setupQRCode();
    this.setupResponsive();
    this.setupRetroSounds();
    this.applyTheme();
    this.applyAccessibility();
  }

  detectRenderMode() {
    const memory = navigator.deviceMemory || 4;
    const connection = navigator.connection?.effectiveType || '4g';
    
    if (memory <= 2 || connection === '3g' || connection === '4g') {
      return 'hybrid'; // Math + Vector mix
    }
    return 'full';
  }

  setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
      this.playSound('click');
    });
  }

  applyTheme() {
    const root = document.documentElement;
    
    if (this.theme === 'light') {
      root.style.setProperty('--diia-bg', '#ffffff');
      root.style.setProperty('--diia-bg-card', '#f5f5f5');
      root.style.setProperty('--diia-text', '#000000');
      root.style.setProperty('--diia-text-secondary', '#666666');
      root.style.setProperty('--diia-border', '#e0e0e0');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      root.style.setProperty('--diia-bg', '#0a0e27');
      root.style.setProperty('--diia-bg-card', '#1a1f3a');
      root.style.setProperty('--diia-text', '#ffffff');
      root.style.setProperty('--diia-text-secondary', '#a1a1aa');
      root.style.setProperty('--diia-border', '#27272a');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }

  setupAccessibility() {
    const menu = document.querySelector('.accessibility-menu') || this.createAccessibilityMenu();
    
    document.querySelectorAll('[data-accessibility]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.accessibility = e.target.dataset.accessibility;
        localStorage.setItem('accessibility', this.accessibility);
        this.applyAccessibility();
        this.playSound('click');
      });
    });
  }

  createAccessibilityMenu() {
    const menu = document.createElement('div');
    menu.className = 'accessibility-menu';
    menu.innerHTML = `
      <button class="accessibility-btn" title="Accessibility">♿</button>
      <div class="accessibility-options">
        <button data-accessibility="normal">Normal</button>
        <button data-accessibility="large-text">Large Text (18px)</button>
        <button data-accessibility="high-contrast">High Contrast</button>
        <button data-accessibility="dyslexia">Dyslexia Font</button>
      </div>
    `;
    document.body.appendChild(menu);
    return menu;
  }

  applyAccessibility() {
    const root = document.documentElement;
    document.body.classList.remove('large-text', 'high-contrast', 'dyslexia');
    
    switch (this.accessibility) {
      case 'large-text':
        root.style.fontSize = '18px';
        document.body.classList.add('large-text');
        break;
      case 'high-contrast':
        root.style.setProperty('--diia-primary', '#FF00FF');
        root.style.setProperty('--diia-success', '#00FF00');
        root.style.setProperty('--diia-error', '#FF0000');
        document.body.classList.add('high-contrast');
        break;
      case 'dyslexia':
        document.body.classList.add('dyslexia');
        break;
      default:
        root.style.fontSize = '16px';
    }
  }

  setupQRCode() {
    const qrBtn = document.createElement('button');
    qrBtn.className = 'qr-button';
    qrBtn.textContent = '📱 QR Code';
    qrBtn.addEventListener('click', () => this.showQRCode());
    
    const header = document.querySelector('.header-content');
    if (header) header.appendChild(qrBtn);
  }

  showQRCode() {
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.innerHTML = `
      <div class="qr-content">
        <h3>Scan to open on another device</h3>
        <div id="qr-container"></div>
        <p>${window.location.href}</p>
        <button onclick="this.closest('.qr-modal').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Simple QR generation (use qrcode.js library if available)
    this.generateQR(window.location.href, 'qr-container');
    this.playSound('success');
  }

  generateQR(text, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Fallback: show URL as text
    const qr = document.createElement('div');
    qr.className = 'qr-fallback';
    qr.textContent = '📲 ' + text;
    container.appendChild(qr);
  }

  setupResponsive() {
    const observer = new ResizeObserver(() => {
      const width = window.innerWidth;
      document.body.classList.remove('mobile', 'tablet', 'desktop', 'tv');
      
      if (width < 480) document.body.classList.add('mobile');
      else if (width < 1024) document.body.classList.add('tablet');
      else if (width < 1920) document.body.classList.add('desktop');
      else document.body.classList.add('tv');
    });
    
    observer.observe(document.body);
    observer.disconnect();
    observer.observe(document.body);
  }

  setupRetroSounds() {
    window.retroSounds = {
      click: () => this.playRetroSound(400, 0.1),
      success: () => this.playRetroSound(800, 0.2),
      error: () => this.playRetroSound(200, 0.15),
      start: () => this.playRetroSound(600, 0.15),
      complete: () => this.playRetroSound(1000, 0.2)
    };
  }

  playRetroSound(freq, duration) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.value = freq;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  playSound(type) {
    if (window.retroSounds && window.retroSounds[type]) {
      window.retroSounds[type]();
    }
  }
}

// Hybrid Rendering for weak devices
class HybridRenderer {
  constructor(renderMode) {
    this.mode = renderMode;
  }

  render(content, scale = 1) {
    if (this.mode === 'hybrid') {
      return this.renderHybrid(content, scale);
    }
    return this.renderFull(content, scale);
  }

  renderHybrid(content, scale) {
    // Use SVG for structure, CSS for styling (lighter than full DOM)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 312 * scale);
    svg.setAttribute('height', 600 * scale);
    svg.setAttribute('viewBox', `0 0 ${312 * scale} ${600 * scale}`);
    
    // Minimal SVG with text only
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 16);
    text.setAttribute('y', 40);
    text.setAttribute('font-size', 20 * scale);
    text.setAttribute('fill', '#67C3F3');
    text.textContent = content.title || 'Content';
    
    svg.appendChild(text);
    return svg;
  }

  renderFull(content, scale) {
    const div = document.createElement('div');
    div.innerHTML = `<h1>${content.title}</h1><p>${content.description}</p>`;
    return div;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PWAEnhancements();
});
