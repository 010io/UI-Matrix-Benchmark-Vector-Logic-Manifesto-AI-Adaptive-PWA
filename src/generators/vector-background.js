/**
 * Vector Background Generator
 * 
 * Generates animated geometric patterns for backgrounds
 * Performance-optimized with requestAnimationFrame
 * 
 * @version 1.0.0
 */

class VectorBackground {
  /**
   * @param {HTMLElement} container - Container element
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      particleCount: options.particleCount || 50,
      color: options.color || '#67C3F3',
      opacity: options.opacity || 0.3,
      speed: options.speed || 0.5,
      connectionDistance: options.connectionDistance || 150,
      parallax: options.parallax || false,
      ...options
    };
    
    this.particles = [];
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    
    this.init();
  }
  
  /**
   * Initialize background
   */
  init() {
    // Create SVG canvas
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.style.position = 'absolute';
    this.svg.style.top = '0';
    this.svg.style.left = '0';
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';
    this.svg.style.pointerEvents = 'none';
    this.svg.style.zIndex = '0';
    
    this.container.style.position = 'relative';
    this.container.appendChild(this.svg);
    
    this.resize();
    this.createParticles();
    
    // Event listeners
    window.addEventListener('resize', () => this.resize());
    
    if (this.options.parallax) {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
    }
    
    this.animate();
  }
  
  /**
   * Resize handler
   */
  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
  }
  
  /**
   * Create particles
   */
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed,
        radius: Math.random() * 2 + 1
      });
    }
  }
  
  /**
   * Animation loop
   */
  animate() {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Update particle positions
   */
  update() {
    this.particles.forEach(p => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Parallax effect
      if (this.options.parallax) {
        const dx = (this.mouse.x - this.width / 2) * 0.01;
        const dy = (this.mouse.y - this.height / 2) * 0.01;
        p.x += dx;
        p.y += dy;
      }
      
      // Bounce off edges
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;
      
      // Keep in bounds
      p.x = Math.max(0, Math.min(this.width, p.x));
      p.y = Math.max(0, Math.min(this.height, p.y));
    });
  }
  
  /**
   * Render particles and connections
   */
  render() {
    // Clear SVG
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
    
    // Draw connections
    const connections = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    connections.setAttribute('opacity', this.options.opacity * 0.5);
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.options.connectionDistance) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', p1.x);
          line.setAttribute('y1', p1.y);
          line.setAttribute('x2', p2.x);
          line.setAttribute('y2', p2.y);
          line.setAttribute('stroke', this.options.color);
          line.setAttribute('stroke-width', '1');
          line.setAttribute('opacity', 1 - distance / this.options.connectionDistance);
          connections.appendChild(line);
        }
      }
    }
    
    this.svg.appendChild(connections);
    
    // Draw particles
    const particles = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    particles.setAttribute('opacity', this.options.opacity);
    
    this.particles.forEach(p => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', p.x);
      circle.setAttribute('cy', p.y);
      circle.setAttribute('r', p.radius);
      circle.setAttribute('fill', this.options.color);
      particles.appendChild(circle);
    });
    
    this.svg.appendChild(particles);
  }
  
  /**
   * Destroy background
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VectorBackground;
}

if (typeof window !== 'undefined') {
  window.VectorBackground = VectorBackground;
}
