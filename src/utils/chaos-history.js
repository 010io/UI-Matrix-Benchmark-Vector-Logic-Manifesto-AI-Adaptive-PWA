class ChaosHistory {
  constructor() {
    this.runs = [];
    this.load();
  }

  add(type, fps, jsTime, particleCount) {
    this.runs.push({
      type,
      fps,
      jsTime,
      particleCount,
      timestamp: Date.now()
    });
    this.save();
  }

  save() {
    sessionStorage.setItem('chaosRuns', JSON.stringify(this.runs));
  }

  load() {
    const data = sessionStorage.getItem('chaosRuns');
    this.runs = data ? JSON.parse(data) : [];
  }

  clear() {
    this.runs = [];
    sessionStorage.removeItem('chaosRuns');
  }

  getLastRun(type) {
    return this.runs.filter(r => r.type === type).pop();
  }

  getComparison() {
    const dom = this.getLastRun('dom');
    const vector = this.getLastRun('vector');
    
    if (!dom || !vector) return null;
    
    return {
      dom,
      vector,
      speedup: (dom.jsTime / vector.jsTime).toFixed(1),
      fpsGain: (vector.fps - dom.fps).toFixed(0)
    };
  }
}

window.ChaosHistory = ChaosHistory;
