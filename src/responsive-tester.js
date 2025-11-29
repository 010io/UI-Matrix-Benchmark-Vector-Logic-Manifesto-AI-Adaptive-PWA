/**
 * Responsive Breakpoints Tester
 * Тестує Vector Logic на різних розмірах екрану
 */

class ResponsiveTester {
  constructor(vectorRenderer, domRenderer) {
    this.vectorRenderer = vectorRenderer;
    this.domRenderer = domRenderer;
    this.breakpoints = {
      mobile: { width: 375, height: 667, name: 'iPhone SE' },
      tablet: { width: 768, height: 1024, name: 'iPad' },
      desktop: { width: 1920, height: 1080, name: 'Desktop' },
      ultrawide: { width: 3440, height: 1440, name: 'Ultrawide' }
    };
  }

  testBreakpoint(breakpointKey, props = {}) {
    const bp = this.breakpoints[breakpointKey];
    if (!bp) return null;

    const sandbox = document.getElementById('benchmark-sandbox') || document.body;
    sandbox.style.width = bp.width + 'px';
    sandbox.style.height = bp.height + 'px';

    const vectorStart = performance.now();
    const vectorOutput = this.vectorRenderer.render(props);
    const vectorTime = performance.now() - vectorStart;
    const vectorSize = new Blob([vectorOutput]).size;

    const domStart = performance.now();
    const domOutput = this.domRenderer.render(props);
    const domTime = performance.now() - domStart;
    const domSize = new Blob([domOutput]).size;

    sandbox.style.width = '';
    sandbox.style.height = '';

    return {
      breakpoint: bp.name,
      width: bp.width,
      height: bp.height,
      vector: { time: vectorTime, size: vectorSize },
      dom: { time: domTime, size: domSize },
      speedup: (domTime / vectorTime).toFixed(2),
      sizeReduction: ((domSize - vectorSize) / domSize * 100).toFixed(1)
    };
  }

  testAllBreakpoints(props = {}) {
    const results = {};
    for (const key in this.breakpoints) {
      results[key] = this.testBreakpoint(key, props);
    }
    return results;
  }

  generateReport(results) {
    let report = '📱 RESPONSIVE BREAKPOINTS TEST\n\n';
    for (const [key, data] of Object.entries(results)) {
      report += `${data.breakpoint} (${data.width}x${data.height}):\n`;
      report += `  Vector: ${data.vector.time.toFixed(2)}ms (${(data.vector.size / 1024).toFixed(1)}KB)\n`;
      report += `  DOM:    ${data.dom.time.toFixed(2)}ms (${(data.dom.size / 1024).toFixed(1)}KB)\n`;
      report += `  Speedup: ${data.speedup}x | Size Reduction: ${data.sizeReduction}%\n\n`;
    }
    return report;
  }
}

window.ResponsiveTester = ResponsiveTester;
