class FPSMeter {
  constructor(displayElementId) {
    this.display = document.getElementById(displayElementId);
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.lastFrameTime = performance.now();
    this.frameTimes = [];
    this.maxSamples = 60;
    this.jsExecutionTimes = [];
  }

  tick() {
    const now = performance.now();
    
    if (this.lastFrameTime) {
      const frameTime = now - this.lastFrameTime;
      this.frameTimes.push(frameTime);
      if (this.frameTimes.length > this.maxSamples) {
        this.frameTimes.shift();
      }
    }
    
    this.lastFrameTime = now;
    this.frames++;

    if (now - this.lastTime >= 500) {
      this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));
      
      const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      const maxFrameTime = Math.max(...this.frameTimes);
      const avgJsTime = this.jsExecutionTimes.length > 0 
        ? this.jsExecutionTimes.reduce((a, b) => a + b, 0) / this.jsExecutionTimes.length 
        : 0;
      
      let color = '#00ff00';
      if (avgFrameTime > 16.67) color = '#fbbf24';
      if (avgFrameTime > 33.33) color = '#f87171';
      
      if (this.display) {
        this.display.textContent = `${this.fps} FPS (${avgFrameTime.toFixed(1)}ms) [JS: ${avgJsTime.toFixed(1)}ms]`;
        this.display.style.color = color;
        this.display.title = `Max frame: ${maxFrameTime.toFixed(1)}ms | Avg JS: ${avgJsTime.toFixed(1)}ms`;
      }
      
      this.frames = 0;
      this.lastTime = now;
      this.jsExecutionTimes = [];
    }
  }

  recordJsTime(duration) {
    this.jsExecutionTimes.push(duration);
    if (this.jsExecutionTimes.length > 60) {
      this.jsExecutionTimes.shift();
    }
  }

  getFPS() {
    return this.fps;
  }
  
  getAverageFPS() {
    if (this.frameTimes.length === 0) return 0;
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    return Math.round(1000 / avgFrameTime);
  }
  
  getGrade() {
    const fps = this.fps;
    if (fps >= 55) return { grade: 'A', label: 'Excellent', color: '#00ff00' };
    if (fps >= 45) return { grade: 'B', label: 'Good', color: '#7fff00' };
    if (fps >= 30) return { grade: 'C', label: 'Fair', color: '#fbbf24' };
    return { grade: 'F', label: 'Poor', color: '#f87171' };
  }
}

window.FPSMeter = FPSMeter;
