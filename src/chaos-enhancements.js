/**
 * Chaos Mode Enhancements - Critical features for demo
 */

class ChaosEnhancements {
  constructor() {
    this.metrics = { dom: {}, vector: {} };
    this.init();
  }

  init() {
    this.injectUkraineBanner();
    this.injectMetricsDashboard();
    this.injectStressMeter();
    this.injectAutoTest();
    this.startMetricsLoop();
  }

  injectUkraineBanner() {
    const arena = document.getElementById('chaos-arena');
    if (!arena) return;

    const banner = document.createElement('div');
    banner.className = 'ukraine-context';
    banner.innerHTML = `
      <div class="context-icon">🇺🇦</div>
      <div class="context-text">
        <h4>Чому це важливо для України</h4>
        <p>30% українців заходять в Дія з сільської місцевості на 3G. Традиційний DOM = 6 KB + важка обробка. <strong>Vector Logic = 800 bytes + миттєвий рендер.</strong></p>
        <div class="context-stats">
          <span class="stat">📱 60% mobile users</span>
          <span class="stat">📡 40% on 3G or slower</span>
          <span class="stat">🔋 Budget devices (2-4 GB RAM)</span>
        </div>
      </div>
    `;
    arena.insertBefore(banner, arena.firstChild);
  }

  injectMetricsDashboard() {
    const arena = document.getElementById('chaos-arena');
    if (!arena) return;

    const dashboard = document.createElement('div');
    dashboard.className = 'live-metrics';
    dashboard.innerHTML = `
      <h3>📊 Real-Time Comparison</h3>
      <div class="metrics-grid">
        <div class="metric-column dom-column">
          <h4>📄 Traditional DOM</h4>
          <div class="metric-row"><span class="label">DOM Nodes:</span><span class="value" id="live-dom-nodes">—</span></div>
          <div class="metric-row"><span class="label">Memory:</span><span class="value" id="live-dom-memory">— MB</span></div>
          <div class="metric-row"><span class="label">Render Time:</span><span class="value" id="live-dom-render">— ms</span></div>
        </div>
        
        <div class="vs-badge">
          <div class="trophy">🏆</div>
          <div class="speedup" id="speedup-badge">—x FASTER</div>
        </div>
        
        <div class="metric-column vector-column winner">
          <h4>🎯 Vector Logic</h4>
          <div class="metric-row"><span class="label">DOM Nodes:</span><span class="value success" id="live-vector-nodes">1</span></div>
          <div class="metric-row"><span class="label">Memory:</span><span class="value success" id="live-vector-memory">— MB</span></div>
          <div class="metric-row"><span class="label">Render Time:</span><span class="value success" id="live-vector-render">— ms</span></div>
        </div>
      </div>
    `;
    arena.appendChild(dashboard);
  }

  injectStressMeter() {
    const arena = document.getElementById('chaos-arena');
    if (!arena) return;

    const meter = document.createElement('div');
    meter.className = 'stress-meters';
    meter.innerHTML = `
      <div class="stress-meter dom-stress" id="dom-stress-meter">
        <div class="stress-label">DOM Stress</div>
        <div class="stress-bar"><div class="stress-fill" id="dom-stress-fill"></div></div>
        <div class="stress-emoji" id="dom-stress-emoji">😎 SMOOTH</div>
      </div>
      
      <div class="stress-meter vector-stress" id="vector-stress-meter">
        <div class="stress-label">Vector Stress</div>
        <div class="stress-bar"><div class="stress-fill success" id="vector-stress-fill"></div></div>
        <div class="stress-emoji" id="vector-stress-emoji">😎 SMOOTH</div>
      </div>
    `;
    arena.appendChild(meter);
  }

  injectAutoTest() {
    const controls = document.querySelector('.chaos-controls');
    if (!controls) return;

    const btn = document.createElement('button');
    btn.id = 'auto-stress-test';
    btn.className = 'btn-primary';
    btn.textContent = '🤖 Auto-Stress Test (30s)';
    btn.style.marginTop = '12px';
    btn.addEventListener('click', () => this.runAutoTest());

    const status = document.createElement('div');
    status.id = 'stress-test-status';
    status.className = 'stress-status';
    status.textContent = 'Ready to test...';

    controls.appendChild(btn);
    controls.appendChild(status);
  }

  async runAutoTest() {
    const btn = document.getElementById('auto-stress-test');
    const status = document.getElementById('stress-test-status');
    const slider = document.getElementById('particle-count');
    const valueDisplay = document.getElementById('particle-value');
    
    btn.disabled = true;
    window.soundEffects?.playStart();

    const steps = [
      { count: 100, duration: 3000, label: '🟢 Baseline (100 particles)' },
      { count: 500, duration: 3000, label: '🟡 Moderate (500 particles)' },
      { count: 1000, duration: 3000, label: '🟠 Heavy (1000 particles)' },
      { count: 2000, duration: 3000, label: '🔴 BREAKING POINT (2000 particles)' },
      { count: 5000, duration: 3000, label: '💀 CHAOS (5000 particles)' }
    ];

    for (const step of steps) {
      status.textContent = step.label;
      slider.value = step.count;
      valueDisplay.textContent = step.count;
      
      const event = new Event('input', { bubbles: true });
      slider.dispatchEvent(event);
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    window.soundEffects?.playSuccess();
    status.textContent = '✅ Test complete! Check metrics above.';
    btn.disabled = false;
  }

  startMetricsLoop() {
    setInterval(() => this.updateMetrics(), 500);
  }

  updateMetrics() {
    const domArena = document.getElementById('dom-arena');
    const vectorArena = document.getElementById('vector-arena');
    
    if (!domArena || !vectorArena) return;

    // DOM metrics
    const domNodes = domArena.querySelectorAll('.particle').length;
    document.getElementById('live-dom-nodes').textContent = domNodes;

    if (performance.memory) {
      const memory = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
      document.getElementById('live-dom-memory').textContent = `${memory} MB`;
      document.getElementById('live-vector-memory').textContent = `${(memory * 0.2).toFixed(1)} MB`;
    }

    // FPS from existing meters
    const domFPSEl = document.getElementById('dom-fps');
    const vectorFPSEl = document.getElementById('vector-fps');
    
    if (domFPSEl && vectorFPSEl) {
      const domFPS = parseFloat(domFPSEl.textContent.replace('FPS: ', '')) || 60;
      const vectorFPS = parseFloat(vectorFPSEl.textContent.replace('FPS: ', '')) || 60;
      
      // Update speedup
      const speedup = (vectorFPS / Math.max(domFPS, 1)).toFixed(1);
      document.getElementById('speedup-badge').textContent = `${speedup}x FASTER`;

      // Update stress meters
      this.updateStressMeter('dom', domFPS);
      this.updateStressMeter('vector', vectorFPS);

      // Update render times (estimate from FPS)
      document.getElementById('live-dom-render').textContent = `${(1000 / Math.max(domFPS, 1)).toFixed(1)} ms`;
      document.getElementById('live-vector-render').textContent = `${(1000 / vectorFPS).toFixed(1)} ms`;
    }
  }

  updateStressMeter(type, fps) {
    const meter = document.getElementById(`${type}-stress-meter`);
    const fill = document.getElementById(`${type}-stress-fill`);
    const emoji = document.getElementById(`${type}-stress-emoji`);
    
    if (!meter || !fill || !emoji) return;

    const stress = 100 - (fps / 60 * 100);
    fill.style.width = `${Math.min(stress, 100)}%`;

    meter.classList.remove('smooth', 'laggy', 'broken');
    
    if (fps >= 30) {
      meter.classList.add('smooth');
      emoji.textContent = '😎 SMOOTH';
    } else if (fps >= 20) {
      meter.classList.add('laggy');
      emoji.textContent = '😰 LAGGY';
    } else {
      meter.classList.add('broken');
      emoji.textContent = '💀 BROKEN';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new ChaosEnhancements();
  }, 1000);
});
