/**
 * Vector Renderer - Mathematical UI Generation
 * 
 * Philosophy: "Why store pixels when you can store formulas?"
 * This class generates UI using pure mathematical calculations,
 * producing infinitely scalable, minimal-payload SVG output.
 */

class VectorRenderer {
  constructor() {
    // Design Tokens (Mathematical Constants)
    this.WIDTH = 360;
    this.HEIGHT = 680;
    this.PADDING = 16;
    this.BORDER_RADIUS = 16;
    this.GOLDEN_RATIO = 1.618;
    
    // Layout Engine State
    this.currentY = 0;
  }
  
  /**
   * Stack Layout Engine: Advance Y coordinate
   * @param {number} height - Height of the element
   * @param {number} gap - Gap after the element
   * @returns {number} Current Y position after advancement
   */
  advanceY(height, gap = 0) {
    this.currentY += height + gap;
    return this.currentY;
  }
  
  /**
   * Reset layout engine for new render
   */
  reset() {
    this.currentY = 0;
  }
  
  /**
   * Generate Diia Upload Screen using mathematical formulas
   * @param {Object} props - Screen properties
   * @returns {string} SVG markup
   */
  render(props = {}, scale = 1) {
    this.reset();
    
    // Apply scale to all dimensions
    const W = this.WIDTH * scale;
    const H = this.HEIGHT * scale;
    const P = this.PADDING * scale;
    const R = this.BORDER_RADIUS * scale;
    
    // Start layout from top padding
    this.currentY = 24 * scale;
    
    // 1. Title Block (Mathematical Text Positioning)
    const titleY = this.currentY;
    const titleSize = 18 * scale;
    const titleSvg = `<text x="${P}" y="${titleY + titleSize}" font-family="e-Ukraine, Arial, sans-serif" font-weight="bold" font-size="${titleSize}" fill="#111827">${props.title || 'Завантаження документів'}</text>`;
    this.advanceY(24 * scale, 8 * scale);
    
    // 2. Description Block
    const descY = this.currentY;
    const descSize = 14 * scale;
    const descSvg = `<text x="${P}" y="${descY + descSize}" font-family="e-Ukraine, Arial, sans-serif" font-size="${descSize}" fill="#374151">${props.description || 'Додайте необхідні документи'}</text>`;
    this.advanceY(20 * scale, 24 * scale);
    
    // 3. Upload Zone (Formula-based Dashed Border)
    const zoneHeight = 120 * scale;
    const zoneY = this.currentY;
    const zoneWidth = W - (P * 2);
    
    // Mathematical definition of dashed border (stroke-dasharray)
    // Pattern: 8px dash, 8px gap (scaled)
    const dashPattern = `${8 * scale} ${8 * scale}`;
    
    const uploadZoneSvg = `
      <g transform="translate(${P}, ${zoneY})">
        <!-- Background -->
        <rect width="${zoneWidth}" height="${zoneHeight}" rx="${R}" fill="#F5F8FA" />
        <!-- Dashed border via mathematical formula -->
        <rect width="${zoneWidth}" height="${zoneHeight}" rx="${R}" fill="none" stroke="#D1D5DB" stroke-width="${2 * scale}" stroke-dasharray="${dashPattern}" />
        <!-- Upload Icon (SVG Path - Pure Geometry) -->
        <g transform="translate(${zoneWidth / 2}, ${zoneHeight / 2 - 30 * scale})">
          <path d="M${-12 * scale},${12 * scale} L0,0 L${12 * scale},${12 * scale}" stroke="#67C3F3" stroke-width="${2 * scale}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="0" y1="0" x2="0" y2="${24 * scale}" stroke="#67C3F3" stroke-width="${2 * scale}" stroke-linecap="round"/>
        </g>
        <!-- Centered Text (Formula: x = width/2) -->
        <text x="${zoneWidth / 2}" y="${zoneHeight / 2 + 20 * scale}" text-anchor="middle" font-family="e-Ukraine, Arial, sans-serif" font-size="${16 * scale}" fill="#6B7280">Додати файл</text>
      </g>
    `;
    this.advanceY(zoneHeight, 32 * scale);
    
    // 4. Button (Mathematical Centering & Sizing)
    const btnHeight = 56 * scale;
    const btnY = this.currentY;
    const buttonSvg = `
      <g transform="translate(${P}, ${btnY})">
        <!-- Black Button Background -->
        <rect width="${zoneWidth}" height="${btnHeight}" rx="${R}" fill="#000000" />
        <!-- Centered Text (Formula-based) -->
        <text x="${zoneWidth / 2}" y="${btnHeight / 2 + 6 * scale}" text-anchor="middle" font-family="e-Ukraine, Arial, sans-serif" font-weight="600" font-size="${18 * scale}" fill="#FFFFFF">Далі</text>
      </g>
    `;
    
    // 5. Assemble Final SVG (Mathematical Viewport)
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="background: #E2ECF4;">
      <!-- Card Container (Formula: padding = 8px, border-radius = 24px) -->
      <rect x="8" y="16" width="${W - 16}" height="${H - 32}" rx="24" fill="white" />
      
      <!-- Content Layer -->
      <g transform="translate(0, 32)">
        ${titleSvg}
        ${descSvg}
        ${uploadZoneSvg}
        ${buttonSvg}
      </g>
    </svg>`;
  }
  
  /**
   * Get payload size in bytes
   * @param {Object} props - Screen properties
   * @returns {number} Size in bytes
   */
  getPayloadSize(props = {}) {
    const output = this.render(props);
    return new Blob([output]).size;
  }
}

// Export for use in benchmark
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VectorRenderer;
}
