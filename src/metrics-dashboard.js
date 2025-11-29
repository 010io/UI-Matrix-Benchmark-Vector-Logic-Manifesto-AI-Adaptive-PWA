/**
 * Real-time Metrics Dashboard
 * Відстежує FPS, RAM, JS execution time в реальному часі
 */

class MetricsDashboard {
  constructor() {
    this.metrics = {
      fps: [],
      memory: [],
      jsTime: [],
      renderTime: []
    };
    this.maxDataPoints = 60;
    this.isRecording = false;
  }

  start() {
    this.isRecording = true;
    this.metrics = { fps: [], memory: [], jsTime: [], renderTime: [] };
  }

  stop() {
    this.isRecording = false;
  }

  recordFrame(fps, jsTime, renderTime) {
    if (!this.isRecording) return;

    this.metrics.fps.push(fps);
    this.metrics.jsTime.push(jsTime);
    this.metrics.renderTime.push(renderTime);

    if (this.metrics.fps.length > this.maxDataPoints) {
      this.metrics.fps.shift();
      this.metrics.jsTime.shift();
      this.metrics.renderTime.shift();
    }

    if (performance.memory) {
      this.metrics.memory.push(performance.memory.usedJSHeapSize / 1048576);
      if (this.metrics.memory.length > this.maxDataPoints) {
        this.metrics.memory.shift();
      }
    }
  }

  getStats() {
    return {
      avgFps: this.average(this.metrics.fps),
      minFps: Math.min(...this.metrics.fps),
      maxFps: Math.max(...this.metrics.fps),
      avgJsTime: this.average(this.metrics.jsTime),
      avgMemory: this.average(this.metrics.memory),
      maxMemory: Math.max(...this.metrics.memory)
    };
  }

  average(arr) {
    return arr.length ? arr.reduce((a, b) => a + b) / arr.length : 0;
  }

  exportJSON() {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      stats: this.getStats()
    }, null, 2);
  }
}

window.MetricsDashboard = MetricsDashboard;
