/**
 * Chaos Mode - Particle Storm Stress Test
 * The ultimate DOM vs Vector performance showdown
 * 
 * DOM Approach: 10,000 individual <div> elements
 * Vector Approach: Single <svg> with path string
 */

class ChaosMode {
  constructor() {
    this.particleCount = 2000; // Reduced from 10000 for better default performance
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
    const r = this.particleSize; // Radius
    
    for (let particle of this.particles) {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off walls (taking radius into account)
      // Left wall
      if (particle.x < r) {
        particle.x = r;
        particle.vx *= -1;
      }
      // Right wall
      else if (particle.x > width - r) {
        particle.x = width - r;
        particle.vx *= -1;
      }
      
      // Top wall
      if (particle.y < r) {
        particle.y = r;
        particle.vy *= -1;
      }
      // Bottom wall
      else if (particle.y > height - r) {
        particle.y = height - r;
        particle.vy *= -1;
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
    const fragment = document.createDocumentFragment();
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
      // Optimization: use transform instead of left/top for smoother DOM (still slow due to count)
      // div.style.transform = `translate(${particle.x}px, ${particle.y}px)`; 
      // Sticking to left/top to demonstrate "bad" DOM performance
      fragment.appendChild(div);
    }
    container.appendChild(fragment);
  }
  
  /**
   * Update DOM particles (move existing divs)
   */
  updateDOM(container, width, height) {
    this.updateParticles(width, height);
    const divs = container.children;
    
    for (let i = 0; i < this.particles.length; i++) {
      if (divs[i]) {
        divs[i].style.left = (this.particles[i].x - this.particleSize) + 'px';
        divs[i].style.top = (this.particles[i].y - this.particleSize) + 'px';
      }
    }
  }
  
  /**
   * Vector Implementation - Single SVG with Path (FAST)
   * Using a single <path> element is significantly faster than thousands of <circle> elements
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
    
    // Create a single path for all particles
    // Note: We can only use one color for a single path. 
    // For multi-color, we'd need one path per color group.
    // To keep it simple and fast, we'll use Diia Blue for all in Vector mode,
    // or create a few groups. Let's do groups for parity.
    
    const colors = ['#67C3F3', '#5ab3e3', '#4aa3d3', '#3a93c3', '#2a83b3'];
    
    colors.forEach(color => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', color);
        path.setAttribute('id', `particles-${color.replace('#', '')}`);
        svg.appendChild(path);
    });
    
    container.appendChild(svg);
    this.updateVector(container, width, height);
  }
  
  /**
   * Update vector particles (modify SVG Path d attributes)
   */
  updateVector(container, width, height) {
    this.updateParticles(width, height);
    
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    // Group particles by color to build paths
    const paths = {};
    const colors = ['#67C3F3', '#5ab3e3', '#4aa3d3', '#3a93c3', '#2a83b3'];
    colors.forEach(c => paths[c] = '');
    
    // Build path data: M x,y h 3 v 3 h -3 z (rectangles are faster than circles in path)
    // Or use M x,y l 0.1 0 for stroke-cap round dots (if stroke is used)
    // Let's use small rects for speed: M x y h s v s h -s z
    const s = this.particleSize;
    
    for (let particle of this.particles) {
        // Simple rect shape
        paths[particle.color] += `M${Math.round(particle.x)} ${Math.round(particle.y)}h${s}v${s}h-${s}z`;
    }
    
    // Update DOM once per color
    for (let color of colors) {
        const pathEl = svg.querySelector(`#particles-${color.replace('#', '')}`);
        if (pathEl) {
            pathEl.setAttribute('d', paths[color]);
        }
    }
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
