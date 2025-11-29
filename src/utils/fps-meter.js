/**
 * FPS Meter - Real-time Frame Rate Monitor
 * Shows the true performance difference between DOM and Vector
 */

class FPSMeter {
  constructor() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.maxHistory = 60; // Store last 60 fps readings
  }
  
  /**
   * Update FPS calculation (call this every frame)
   */
  update() {
    this.frames++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;
    
    // Update every second
    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta);
      this.fpsHistory.push(this.fps);
      
      // Keep history limited
      if (this.fpsHistory.length > this.maxHistory) {
        this.fpsHistory.shift();
      }
      
      this.frames = 0;
      this.lastTime = currentTime;
    }
  }
  
  /**
   * Get current FPS
   */
  getFPS() {
    return this.fps;
  }
  
  /**
   * Get average FPS from history
   */
  getAverageFPS() {
    if (this.fpsHistory.length === 0) return 0;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }
  
  /**
   * Get minimum FPS from history
   */
  getMinFPS() {
    if (this.fpsHistory.length === 0) return 0;
    return Math.min(...this.fpsHistory);
  }
  
  /**
   * Reset meter
   */
  reset() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
  }
  
  /**
   * Get performance grade
   */
  getGrade() {
    const fps = this.fps;
    if (fps >= 55) return { grade: 'A', color: '#22c55e', label: 'Excellent' };
    if (fps >= 40) return { grade: 'B', color: '#eab308', label: 'Good' };
    if (fps >= 25) return { grade: 'C', color: '#f59e0b', label: 'Fair' };
    if (fps >= 15) return { grade: 'D', color: '#ef4444', label: 'Poor' };
    return { grade: 'F', color: '#dc2626', label: 'Critical' };
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FPSMeter;
}
