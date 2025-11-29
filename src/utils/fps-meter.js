class FPSMeter {
  constructor(displayElementId) {
    this.display = document.getElementById(displayElementId);
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 0;
  }

  tick() {
    this.frames++;
    const now = performance.now();

    // Update counter every 500ms to avoid flickering
    if (now - this.lastTime >= 500) {
      this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));

      // Visual health indication
      let color = '#00ff00'; // Green
      if (this.fps < 45) color = '#fbbf24'; // Yellow
      if (this.fps < 30) color = '#f87171'; // Red

      if (this.display) {
        this.display.innerHTML = `<span style="color: ${color}">${this.fps} FPS</span>`;
      }

      this.frames = 0;
      this.lastTime = now;
    }
  }

  getFPS() {
    return this.fps;
  }
}

window.FPSMeter = FPSMeter;
