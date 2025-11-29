/**
 * Vector Renderer - Mathematical UI Generation (UPGRADED)
 * 
 * Now features:
 * - Realistic Diia ID Card design
 * - Holographic gradient effects  
 * - 3D tilt mathematics
 * - Deep zoom support (up to 5000%)
 * - Security patterns (vector grid)
 */

class VectorRenderer {
  constructor() {
    // Design tokens (base scale)
    this.WIDTH = 360;
    this.HEIGHT = 680;
    this.PADDING = 16;
    this.BORDER_RADIUS = 24;
    this.GOLDEN_RATIO = 1.618;
    
    // Diia colors
    this.DIIA_BLUE = '#67C3F3';
    this.DIIA_BG = '#E2ECF4';
    this.DIIA_DARK = '#0a0e27';
    this.DIIA_CARD_BG = '#FFFFFF';
    
    // Layout state
    this.currentY = 0;
    
    // 3D tilt state
    this.tiltX = 0;
    this.tiltY = 0;
  }
  
  /**
   * Reset layout engine
   */
  reset() {
    this.currentY = 0;
  }
  
  /**
   * Advance Y position (stack layout)
   */
  advanceY(height, gap = 0) {
    this.currentY += height + gap;
    return this.currentY;
  }
  
  /**
   * Set 3D tilt (from mouse/gyroscope)
   */
  setTilt(x, y) {
    this.tiltX = x;
    this.tiltY = y;
  }
  
  /**
   * Generate holographic gradient (living effect)
   */
  generateHologramGradient(id, offsetX = 0, offsetY = 0) {
    // Gradient moves based on tilt/mouse position
    const x1 = 0 + offsetX * 100;
    const y1 = 0 + offsetY * 100;
    const x2 = 100 + offsetX * 100;
    const y2 = 100 + offsetY * 100;
    
    return `
      <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="30%" stop-color="${this.DIIA_BLUE}" stop-opacity="0.15" />
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.2" />
        <stop offset="100%" stop-color="${this.DIIA_BLUE}" stop-opacity="0.05" />
      </linearGradient>
    `;
  }
  
  /**
   * Generate security pattern (vector grid)
   */
  generateSecurityPattern(width, height, scale = 1) {
    let pattern = '';
    const spacing = 20 * scale;
    
    for (let i = 0; i < width; i += spacing) {
      pattern += `<path d="M${i} 0 L${i - spacing} ${height}" stroke="white" stroke-width="${0.5 * scale}" stroke-opacity="0.1"/>`;
    }
    
    return pattern;
  }
  
  /**
   * Generate Vector QR Code (simplified mathematical pattern)
   */
  generateVectorQR(x, y, size, scale = 1) {
    const actualSize = size * scale;
    const pixelSize = actualSize / 21; // 21x21 QR grid
    
    // Simplified QR pattern (mathematical, not real QR)
    const pattern = [
      1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,1,1,1,1,1,1,
      1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,
      1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1,
      1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,
      1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1,
      1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,
      1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
      0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,
    ];
    
    let qrPath = '';
    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 21; j++) {
        const index = (i *21 + j) % pattern.length;
        if (pattern[index] === 1) {
          const px = x + j * pixelSize;
          const py = y + i * pixelSize;
          qrPath += `M${px} ${py} h${pixelSize} v${pixelSize} h${-pixelSize} z `;
        }
      }
    }
    
    return `<path d="${qrPath}" fill="${this.DIIA_DARK}"/>`;
  }
  
  /**
   * Render realistic Diia ID Card
   */
  renderDiiaIDCard(props = {}, scale = 1) {
    this.reset();
    
    const W = this.WIDTH * scale;
    const H = this.HEIGHT * scale;
    const P = this.PADDING * scale;
    const R = this.BORDER_RADIUS * scale;
    
    // Card dimensions (horizontal ID format)
    const cardW = W - (P * 2);
    const cardH = 220 * scale;
    const cardX = P;
    const cardY = P + (32 * scale);
    const cardR = 16 * scale;
    
    // SVG start
    let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Definitions (gradients, patterns)
    svg += `<defs>`;
    svg += this.generateHologramGradient('holo-gradient', this.tiltX * 0.5, this.tiltY * 0.5);
    svg += `<filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/></filter>`;
    svg += `</defs>`;
    
    // Background
    svg += `<rect width="${W}" height="${H}" rx="${R}" fill="${this.DIIA_BG}"/>`;
    
    // Main card background
    svg += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}" fill="${this.DIIA_CARD_BG}" filter="url(#shadow)"/>`;
    
    // Security pattern overlay
    svg += `<g opacity="0.3" clip-path="url(#card-clip)">`;
    svg += `<clipPath id="card-clip"><rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}"/></clipPath>`;
    svg += this.generateSecurityPattern(cardW, cardH, scale);
    svg += `</g>`;
    
    // Hologram overlay
    svg += `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}" fill="url(#holo-gradient)"/>`;
    
    // Country flag (blue/yellow)
    const flagX = cardX + (P * 2);
    const flagY = cardY + (P * 2);
    const flagW = 40 * scale;
    const flagH = 24 * scale;
    
    svg += `<rect x="${flagX}" y="${flagY}" width="${flagW}" height="${flagH/2}" fill="#005BBB"/>`;
    svg += `<rect x="${flagX}" y="${flagY + flagH/2}" width="${flagW}" height="${flagH/2}" fill="#FFD700"/>`;
    
    // Title "UKRAINE"
    const titleX = flagX + flagW + (12 * scale);
    const titleY = flagY + (18 * scale);
    
    svg += `<text x="${titleX}" y="${titleY}" font-family="e-Ukraine, sans-serif" font-weight="bold" font-size="${14*scale}" fill="${this.DIIA_DARK}">УКРАЇНА</text>`;
    
    // Document type
    const subtitleY = titleY + (16 * scale);
    svg += `<text x="${titleX}" y="${subtitleY}" font-family="e-Ukraine, sans-serif" font-size="${10*scale}" fill="#666">${props.title || 'ПОСВІДЧЕННЯ ВОДІЯ'}</text>`;
    
    // Photo placeholder (circle)
    const photoR = 45 * scale;
    const photoX = cardX + (P * 2) + photoR;
    const photoY = cardY + (90 * scale);
    
    svg += `<circle cx="${photoX}" cy="${photoY}" r="${photoR}" fill="#D0D0D0" stroke="${this.DIIA_BLUE}" stroke-width="${2*scale}"/>`;
    svg += `<text x="${photoX}" y="${photoY + 5*scale}" font-size="${40*scale}" text-anchor="middle" opacity="0.3">👤</text>`;
    
    // Personal data (right side)
    const dataX = photoX + photoR + (20 * scale);
    let dataY = cardY + (70 * scale);
    
    const fields = [
      { label: '1. Прізвище', value: props.lastName || 'ШЕВЧЕНКО' },
      { label: '2. Ім\'я', value: props.firstName || 'ТАРАС' },
      { label: '3. Дата народження', value: props.birthDate || '09.03.1814' },
      { label: '4a. Дата видачі', value: '15.11.2024' },
      { label: '4c. Дійсне до', value: '15.11.2034' }
    ];
    
    fields.forEach((field) => {
      svg += `<text x="${dataX}" y="${dataY}" font-family="e-Ukraine, sans-serif" font-size="${7*scale}" fill="#888">${field.label}</text>`;
      dataY += 12 * scale;
      svg += `<text x="${dataX}" y="${dataY}" font-family="e-Ukraine, sans-serif" font-weight="600" font-size="${10*scale}" fill="${this.DIIA_DARK}">${field.value}</text>`;
      dataY += 18 * scale;
    });
    
    // Vector QR Code (bottom right)
    const qrSize = 60 * scale;
    const qrX = cardX + cardW - qrSize - (P * 2);
    const qrY = cardY + cardH - qrSize - (P * 2);
    
    svg += `<rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" fill="white"/>`;
    svg += this.generateVectorQR(qrX, qrY, 60, scale);
    
    // Diia logo (bottom left)
    const logoX = cardX + (P * 2);
    const logoY = cardY + cardH - (40 * scale);
    
    svg += `<text x="${logoX}" y="${logoY}" font-family="e-Ukraine, sans-serif" font-weight="bold" font-size="${18*scale}" fill="${this.DIIA_BLUE}">Дія</text>`;
    
    // Card number (bottom center)
    const numberY = cardY + cardH - (12 * scale);
    svg += `<text x="${cardX + cardW/2}" y="${numberY}" text-anchor="middle" font-family="monospace" font-size="${8*scale}" fill="#999">№ ${props.cardNumber || 'AAA 123456'}</text>`;
    
    svg += `</svg>`;
    
    return svg;
  }
  
  /**
   * Legacy render method (for backwards compatibility)
   */
  render(props = {}, scale = 1) {
    return this.renderDiiaIDCard(props, scale);
  }
  
  /**
   * Get payload size in bytes
   */
  getPayloadSize() {
    const output = this.render();
    return new Blob([output]).size;
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VectorRenderer;
}
