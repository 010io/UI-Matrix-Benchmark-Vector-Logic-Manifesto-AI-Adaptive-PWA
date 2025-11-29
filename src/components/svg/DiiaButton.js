/**
 * Diia Button - Pure SVG Interactive Component
 * 
 * Vector-based button with hover states, ripple effects, and accessibility
 * Fully keyboard navigable and screen reader friendly
 * 
 * @version 1.0.0
 */

/**
 * Generate Diia Button SVG
 * 
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {number} [options.width=200] - Button width
 * @param {number} [options.height=48] - Button height
 * @param {string} [options.variant='primary'] - 'primary' | 'secondary' | 'outline'
 * @param {boolean} [options.disabled=false] - Disabled state
 * @param {string} [options.id='diia-btn'] - Unique button ID
 * @returns {string} SVG markup
 */
function generateDiiaButton({
  text,
  width = 200,
  height = 48,
  variant = 'primary',
  disabled = false,
  id = 'diia-btn'
} = {}) {
  // Variant styles
  const variants = {
    primary: {
      fill: disabled ? '#D1D5DB' : '#67C3F3',
      textColor: '#FFFFFF',
      hoverFill: '#4BA3D3',
      activeFill: '#3893C3'
    },
    secondary: {
      fill: disabled ? '#F3F4F6' : '#E2ECF4',
      textColor: disabled ? '#9CA3AF' : '#67C3F3',
      hoverFill: '#D3E4F0',
      activeFill: '#C3D4E0'
    },
    outline: {
      fill: 'transparent',
      textColor: disabled ? '#9CA3AF' : '#67C3F3',
      stroke: disabled ? '#D1D5DB' : '#67C3F3',
      hoverFill: 'rgba(103, 195, 243, 0.1)',
      activeFill: 'rgba(103, 195, 243, 0.2)'
    }
  };
  
  const style = variants[variant] || variants.primary;
  const borderRadius = 12;
  
  return `
<svg 
  width="${width}" 
  height="${height}" 
  viewBox="0 0 ${width} ${height}"
  xmlns="http://www.w3.org/2000/svg"
  class="diia-button diia-button--${variant} ${disabled ? 'diia-button--disabled' : ''}"
  role="button"
  tabindex="${disabled ? '-1' : '0'}"
  aria-label="${text}"
  aria-disabled="${disabled}"
  data-button-id="${id}"
>
  <defs>
    <!-- Drop shadow -->
    <filter id="${id}-shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.1"/>
    </filter>
    
    <!-- Ripple effect (activated via JavaScript) -->
    <radialGradient id="${id}-ripple">
      <stop offset="0%" stop-color="white" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <!-- Button background -->
  <rect 
    x="0" 
    y="0" 
    width="${width}" 
    height="${height}" 
    rx="${borderRadius}"
    fill="${style.fill}"
    ${style.stroke ? `stroke="${style.stroke}" stroke-width="2"` : ''}
    filter="${disabled ? 'none' : `url(#${id}-shadow)`}"
    class="diia-button__bg"
  />
  
  <!-- Hover overlay -->
  ${!disabled ? `
  <rect 
    x="0" 
    y="0" 
    width="${width}" 
    height="${height}" 
    rx="${borderRadius}"
    fill="${style.hoverFill}"
    opacity="0"
    class="diia-button__hover"
  />
  ` : ''}
  
  <!-- Active/pressed overlay -->
  ${!disabled ? `
  <rect 
    x="0" 
    y="0" 
    width="${width}" 
    height="${height}" 
    rx="${borderRadius}"
    fill="${style.activeFill}"
    opacity="0"
    class="diia-button__active"
  />
  ` : ''}
  
  <!-- Ripple effect (only visible during click animation) -->
  ${!disabled ? `
  <circle 
    cx="${width / 2}" 
    cy="${height / 2}" 
    r="0"
    fill="url(#${id}-ripple)"
    class="diia-button__ripple"
  />
  ` : ''}
  
  <!-- Button text -->
  <text 
    x="${width / 2}" 
    y="${height / 2 + 1}" 
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="e-Ukraine, Inter, sans-serif" 
    font-size="14" 
    font-weight="600"
    fill="${style.textColor}"
    pointer-events="none"
    class="diia-button__text"
  >${text}</text>
  
  <style>
    /* Button transitions */
    .diia-button__bg,
    .diia-button__hover,
    .diia-button__active,
    .diia-button__text {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Hover state */
    .diia-button:not(.diia-button--disabled):hover .diia-button__hover {
      opacity: 1;
    }
    
    /* Active/pressed state */
    .diia-button:not(.diia-button--disabled):active .diia-button__active {
      opacity: 1;
    }
    
    /* Focus state (keyboard navigation) */
    .diia-button:focus {
      outline: 2px solid #67C3F3;
      outline-offset: 2px;
    }
    
    /* Disabled cursor */
    .diia-button--disabled {
      cursor: not-allowed;
    }
    
    .diia-button:not(.diia-button--disabled) {
      cursor: pointer;
    }
    
    /* Ripple animation */
    @keyframes ripple {
      0% {
        r: 0;
        opacity: 1;
      }
      100% {
        r: ${Math.max(width, height)};
        opacity: 0;
      }
    }
    
    .diia-button__ripple.active {
      animation: ripple 0.6s ease-out;
    }
  </style>
</svg>
  `.trim();
}

/**
 * DiiaButton Class Component
 * 
 * @class
 * @example
 * const button = new DiiaButton({ text: 'Увійти', variant: 'primary' });
 * button.onClick(() => console.log('Clicked!'));
 * document.body.innerHTML += button.render();
 */
class DiiaButton {
  /**
   * @param {Object} options - Button configuration
   */
  constructor(options = {}) {
    this.options = {
      text: 'Button',
      width: 200,
      height: 48,
      variant: 'primary',
      disabled: false,
      id: `diia-btn-${Math.random().toString(36).substr(2, 9)}`,
      ...options
    };
    
    this.clickHandler = null;
  }
  
  /**
   * Render button SVG
   * @returns {string} SVG markup
   */
  render() {
    const svg = generateDiiaButton(this.options);
    
    // Auto-attach event listeners after render
    if (typeof window !== 'undefined') {
      setTimeout(() => this._attachListeners(), 0);
    }
    
    return svg;
  }
  
  /**
   * Set click handler
   * @param {Function} handler - Click callback
   */
  onClick(handler) {
    this.clickHandler = handler;
    return this;
  }
  
  /**
   * Enable button
   */
  enable() {
    this.options.disabled = false;
    this._updateDOM();
  }
  
  /**
   * Disable button
   */
  disable() {
    this.options.disabled = true;
    this._updateDOM();
  }
  
  /**
   * Attach event listeners (private)
   * @private
   */
  _attachListeners() {
    const button = document.querySelector(`[data-button-id="${this.options.id}"]`);
    if (!button || this.options.disabled) return;
    
    // Click handler
    button.addEventListener('click', (e) => {
      this._animateRipple(e);
      if (this.clickHandler) {
        this.clickHandler(e);
      }
    });
    
    // Keyboard support (Enter / Space)
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._animateRipple(e);
        if (this.clickHandler) {
          this.clickHandler(e);
        }
      }
    });
  }
  
  /**
   * Animate ripple effect
   * @private
   */
  _animateRipple(event) {
    const button = event.currentTarget;
    const ripple = button.querySelector('.diia-button__ripple');
    
    if (ripple) {
      // Reset animation
      ripple.classList.remove('active');
      
      // Get click position
      const rect = button.getBoundingClientRect();
      const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
      const y = event.clientY ? event.clientY - rect.top : rect.height / 2;
      
      // Set ripple position
      ripple.setAttribute('cx', x);
      ripple.setAttribute('cy', y);
      
      // Trigger animation
      setTimeout(() => ripple.classList.add('active'), 0);
    }
  }
  
  /**
   * Update DOM if already rendered
   * @private
   */
  _updateDOM() {
    const button = document.querySelector(`[data-button-id="${this.options.id}"]`);
    if (button) {
      const parent = button.parentNode;
      parent.innerHTML = this.render();
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DiiaButton, generateDiiaButton };
}

if (typeof window !== 'undefined') {
  window.DiiaButton = DiiaButton;
  window.generateDiiaButton = generateDiiaButton;
}
