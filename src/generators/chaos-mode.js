/**
 * Chaos Mode - Particle Storm Stress Test
 * The ultimate DOM vs Vector performance showdown
 * 
 * DOM Approach: 10,000 individual <div> elements
 * Vector Approach: Single <svg> with path string
 */

class ChaosMode {
  constructor() {
    this.particleCount = 10000;
    this.particles = [];
    this.animationFrameId = null;
    this.isRunning = false;
    
    // Particle properties
    this.maxSpeed = 2;
    this.particleSize = 3;
  }
  
  /**
   * Initialize particles with random properties
   */
  initParticles(width, height) {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * this.maxSpeed,
        vy: (Math.random() - 0.5) * this.maxSpeed,
        color: this.getRandomColor()
      });
    }
  }
  
  /**
   * Get random Diia-themed color
   */
  getRandomColor() {
    const colors = [
      '#67C3F3', // Diia Blue
      '#5ab3e3',
      '#4aa3d3',
      '#3a93c3',
      '#2a83b3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  /**
   * Update particle positions
   */
  updateParticles(width, height) {
    for (let particle of this.particles) {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off walls
      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }
    }
  }
  
  /**
   * DOM Implementation - Individual divs (SLOW)
   */
  renderDOM(container, width, height) {
    // Clear container
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.overflow = 'hidden';
    container.style.background = '#0a0e27';
    
    // Create divs for each particle
    for (let particle of this.particles) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = particle.x + 'px';
      div.style.top = particle.y + 'px';
      div.style.width = this.particleSize + 'px';
      div.style.height = this.particleSize + 'px';
      div.style.borderRadius = '50%';
      div.style.backgroundColor = particle.color;
      div.style.pointerEvents = 'none';
      container.appendChild(div);
    }
  }
  
  /**
   * Update DOM particles (move existing divs)
   */
  updateDOM(container, width, height) {
    this.updateParticles(width, height);
    const divs = container.children;
    
    for (let i = 0; i < this.particles.length; i++) {
      if (divs[i]) {
        divs[i].style.left = this.particles[i].x + 'px';
        divs[i].style.top = this.particles[i].y + 'px';
      }
    }
  }
  
  /**
   * Vector Implementation - Single SVG with path (FAST)
   */
  renderVector(container, width, height) {
    container.innerHTML = '';
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    
    // Create single SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.background = '#0a0e27';
    
    // Group all particles
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = 'particles';
    
    // Build path string (ultra-fast)
    let circles = '';
    for (let particle of this.particles) {
      circles += `<circle cx="${particle.x}" cy="${particle.y}" r="${this.particleSize}" fill="${particle.color}"/>`;
    }
    
    g.innerHTML = circles;
    svg.appendChild(g);
    container.appendChild(svg);
  }
  
  /**
   * Update vector particles (modify SVG)
   */
  updateVector(container, width, height) {
    this.updateParticles(width, height);
    
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    const g = svg.querySelector('#particles');
    if (!g) return;
    
    // Rebuild circles (still faster than DOM manipulation)
    let circles = '';
    for (let particle of this.particles) {
      circles += `<circle cx="${particle.x}" cy="${particle.y}" r="${this.particleSize}" fill="${particle.color}"/>`;
    }
    g.innerHTML = circles;
  }
  
  /**
   * Start animation loop
   */
  start(mode, container, width, height, fpsCallback) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.initParticles(width, height);
    
    // Initial render
    if (mode === 'dom') {
      this.renderDOM(container, width, height);
    } else {
      this.renderVector(container, width, height);
    }
    
    // Animation loop
    const animate = () => {
      if (!this.isRunning) return;
      
      if (mode === 'dom') {
        this.updateDOM(container, width, height);
      } else {
        this.updateVector(container, width, height);
      }
      
      // FPS callback
      if (fpsCallback) fpsCallback();
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  /**
   * Stop animation
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Set particle count
   */
  setParticleCount(count) {
    this.particleCount = Math.max(100, Math.min(20000, count));
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChaosMode;
}
