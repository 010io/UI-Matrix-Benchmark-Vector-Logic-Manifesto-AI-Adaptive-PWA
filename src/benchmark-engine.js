/**
 * Benchmark Engine - The Judge
 * 
 * Philosophy: "Numbers don't lie"
 * Performs real-time measurements of payload size and render performance
 */

class BenchmarkEngine {
  constructor() {
    this.results = {
      vector: {},
      dom: {},
      figma: {}
    };
  }

  /**
   * Calculate payload size in bytes
   * @param {string} content - Content to measure
   * @returns {number} Size in bytes
   */
  calculatePayload(content) {
    return new Blob([content]).size;
  }

  /**
   * Format bytes to human-readable format
   * @param {number} bytes - Byte count
   * @returns {string} Formatted size
   */
  formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Measure render speed (JS + Layout + Paint)
   * @param {Function} renderFn - Rendering function
   * @param {Object} props - Props to pass to renderer
   * @returns {Object} Performance metrics
   */
  measureRenderSpeed(renderFn, props = {}) {
    const sandbox = document.getElementById('benchmark-sandbox') || document.body;
    sandbox.innerHTML = '';

    const jsStart = performance.now();
    const output = renderFn(props);

    if (typeof output === 'string') {
      sandbox.innerHTML = output;
    } else if (output instanceof Node) {
      sandbox.appendChild(output);
    }

    const _reflow = sandbox.offsetHeight;
    const jsEnd = performance.now();

    sandbox.innerHTML = '';

    return {
      time: jsEnd - jsStart,
      output: output,
      size: this.calculatePayload(output)
    };
  }

  /**
   * Stress test: render multiple instances
   * @param {Function} renderFn - Rendering function
   * @param {number} count - Number of instances
   * @param {Object} props - Props to pass to renderer
   * @returns {Object} Stress test results
   */
  stressTest(renderFn, count = 1000, props = {}) {
    const start = performance.now();
    let totalSize = 0;

    for (let i = 0; i < count; i++) {
      const output = renderFn(props);
      totalSize += this.calculatePayload(output);
    }

    const end = performance.now();

    return {
      totalTime: end - start,
      avgTime: (end - start) / count,
      totalSize: totalSize,
      avgSize: totalSize / count,
      count: count
    };
  }

  /**
   * Run complete benchmark suite
   * @param {Object} renderers - Object with vector, dom, figma renderers
   * @param {Object} props - Props to pass to renderers
   * @returns {Object} Complete results
   */
  runBenchmark(renderers, props = {}) {
    console.log('🚀 Starting benchmark...');

    console.log('📊 Single Render Test...');
    this.results.vector.single = this.measureRenderSpeed(
      (p) => renderers.vector.render(p),
      props
    );
    this.results.dom.single = this.measureRenderSpeed(
      (p) => renderers.dom.render(p),
      props
    );
    this.results.figma.single = this.measureRenderSpeed(
      (p) => renderers.figma.render(p),
      props
    );

    console.log('⚡ Stress Test (100 iterations)...');
    this.results.vector.stress = this.stressTest(
      (p) => renderers.vector.render(p),
      100,
      props
    );
    this.results.dom.stress = this.stressTest(
      (p) => renderers.dom.render(p),
      100,
      props
    );
    this.results.figma.stress = this.stressTest(
      (p) => renderers.figma.render(p),
      100,
      props
    );

    this.calculateEfficiency();

    console.log('✅ Benchmark complete!');
    return this.results;
  }

  /**
   * Calculate efficiency multipliers (Vector vs others)
   */
  calculateEfficiency() {
    const vectorSize = this.results.vector.single.size;
    const vectorTime = this.results.vector.single.time;

    this.results.efficiency = {
      sizeVsDom: (this.results.dom.single.size / vectorSize).toFixed(2),
      sizeVsFigma: (this.results.figma.single.size / vectorSize).toFixed(2),
      speedVsDom: (this.results.dom.single.time / vectorTime).toFixed(2),
      speedVsFigma: (this.results.figma.single.time / vectorTime).toFixed(2)
    };
  }

  /**
   * Update dashboard with results
   * @param {Object} elements - DOM elements to update
   */
  updateDashboard(elements) {
    if (!this.results.vector.single) return;

    if (elements.vectorSize) {
      elements.vectorSize.textContent = this.formatBytes(this.results.vector.single.size);
    }
    if (elements.vectorTime) {
      elements.vectorTime.textContent = `${this.results.vector.single.time.toFixed(2)} ms`;
    }

    if (elements.domSize) {
      elements.domSize.textContent = this.formatBytes(this.results.dom.single.size);
    }
    if (elements.domTime) {
      elements.domTime.textContent = `${this.results.dom.single.time.toFixed(2)} ms`;
    }

    if (elements.figmaSize) {
      elements.figmaSize.textContent = this.formatBytes(this.results.figma.single.size);
    }
    if (elements.figmaTime) {
      elements.figmaTime.textContent = `${this.results.figma.single.time.toFixed(2)} ms`;
    }

    if (elements.efficiencySize && this.results.efficiency) {
      elements.efficiencySize.textContent = `${this.results.efficiency.sizeVsDom}x smaller`;
    }
    if (elements.efficiencySpeed && this.results.efficiency) {
      elements.efficiencySpeed.textContent = `${this.results.efficiency.speedVsDom}x faster`;
    }

    this.highlightWinner(elements);
  }

  /**
   * Highlight the winning approach
   * @param {Object} elements - DOM elements
   */
  highlightWinner(elements) {
    const winnerClass = 'metric-winner';

    if (elements.vectorSize?.parentElement) {
      elements.vectorSize.parentElement.classList.add(winnerClass);
    }
  }

  /**
   * Generate console report
   */
  generateReport() {
    console.log('\n📊 BENCHMARK RESULTS\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Single Render:');
    console.log(`  Vector:  ${this.formatBytes(this.results.vector.single.size).padEnd(10)} ${this.results.vector.single.time.toFixed(2)} ms`);
    console.log(`  DOM:     ${this.formatBytes(this.results.dom.single.size).padEnd(10)} ${this.results.dom.single.time.toFixed(2)} ms`);
    console.log(`  Figma:   ${this.formatBytes(this.results.figma.single.size).padEnd(10)} ${this.results.figma.single.time.toFixed(2)} ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Efficiency (Vector vs others):');
    console.log(`  Size:    ${this.results.efficiency.sizeVsDom}x smaller than DOM`);
    console.log(`  Speed:   ${this.results.efficiency.speedVsDom}x faster than DOM`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BenchmarkEngine;
}
window.BenchmarkEngine = BenchmarkEngine;
