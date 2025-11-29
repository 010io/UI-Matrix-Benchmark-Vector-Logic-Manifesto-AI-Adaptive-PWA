/**
 * Diia Logo - Pure SVG Component
 * 
 * Mathematical vector logo with theme support and animations
 * Accessible, scalable, performance-optimized
 * 
 * @version 1.0.0
 */

/**
 * Generate Diia Logo SVG
 * 
 * @param {Object} options - Logo options
 * @param {number} [options.width=200] - Logo width
 * @param {number} [options.height=40] - Logo height
 * @param {string} [options.color='#67C3F3'] - Logo color
 * @param {boolean} [options.animated=false] - Enable hover animation
 * @param {string} [options.className=''] - Additional CSS classes
 * @returns {string} SVG markup
 */
function generateDiiaLogo({
  width = 200,
  height = 40,
  color = '#67C3F3',
  animated = false,
  className = ''
} = {}) {
  const animationStyle = animated ? `
    <style>
      .diia-logo-text {
        transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .diia-logo:hover .diia-logo-text {
        fill: #4BA3D3;
      }
      .diia-logo:hover .diia-logo-glow {
        opacity: 1;
      }
      .diia-logo-glow {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    </style>
  ` : '';
  
  return `
<svg 
  width="${width}" 
  height="${height}" 
  viewBox="0 0 200 40" 
  class="diia-logo ${className}"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Логотип Дія"
>
  <defs>
    <!-- Holographic glow effect -->
    <filter id="diia-logo-glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Gradient for premium look -->
    <linearGradient id="diia-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  
  ${animationStyle}
  
  <!-- Glow layer (only visible on hover if animated) -->
  <text 
    x="0" 
    y="30" 
    font-family="e-Ukraine, Inter, sans-serif" 
    font-size="32" 
    font-weight="700"
    fill="url(#diia-logo-gradient)"
    filter="url(#diia-logo-glow)"
    class="diia-logo-glow"
  >Дія</text>
  
  <!-- Main text -->
  <text 
    x="0" 
    y="30" 
    font-family="e-Ukraine, Inter, sans-serif" 
    font-size="32" 
    font-weight="700"
    fill="${color}"
    class="diia-logo-text"
  >Дія</text>
  
  <!-- Optional tagline -->
  <text 
    x="0" 
    y="38" 
    font-family="Inter, sans-serif" 
    font-size="6" 
    fill="#999"
    opacity="0.7"
  >Держава у смартфоні</text>
</svg>
  `.trim();
}

/**
 * DiiaLogo Class Component
 * 
 * @class
 * @example
 * const logo = new DiiaLogo({ animated: true });
 * document.body.innerHTML += logo.render();
 */
class DiiaLogo {
  /**
   * @param {Object} options - Logo configuration
   */
  constructor(options = {}) {
    this.options = {
      width: 200,
      height: 40,
      color: '#67C3F3',
      animated: false,
      className: '',
      ...options
    };
  }
  
  /**
   * Render logo SVG
   * @returns {string} SVG markup
   */
  render() {
    return generateDiiaLogo(this.options);
  }
  
  /**
   * Update logo options
   * @param {Object} newOptions - New options to merge
   */
  update(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }
  
  /**
   * Get SVG as data URL for use in img src
   * @returns {string} Data URL
   */
  toDataURL() {
    const svg = this.render();
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiiaLogo, generateDiiaLogo };
}

if (typeof window !== 'undefined') {
  window.DiiaLogo = DiiaLogo;
  window.generateDiiaLogo = generateDiiaLogo;
}
