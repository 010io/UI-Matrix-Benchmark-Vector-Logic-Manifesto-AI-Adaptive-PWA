/**
 * Vector Renderer - Mathematical UI Generation Engine
 * 
 * Production-grade SVG generator for Diia Design System
 * Features: Design tokens, accessibility, performance optimization, type safety
 * 
 * @version 2.0.0
 * @author 010io (Igor Omelchenko)
 * @license MIT
 */

/**
 * Design tokens - Single source of truth for Diia Design System
 * @const {Object}
 */
const DIIA_TOKENS = Object.freeze({
  // Color palette
  colors: {
    primary: '#67C3F3',      // Diia Blue
    background: '#E2ECF4',   // Light Blue Gray
    dark: '#0a0e27',         // Near Black
    cardBg: '#FFFFFF',       // Pure White
    text: '#000000',         // Black
    textSecondary: '#666666', // Gray
    textTertiary: '#999999', // Light Gray
    flag: {
      blue: '#005BBB',       // Ukrainian Blue
      yellow: '#FFD700'      // Ukrainian Yellow
    }
  },

  // Layout system (8px grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },

  // Typography scale
  fontSize: {
    xs: 7,
    sm: 8,
    base: 10,
    md: 14,
    lg: 18,
    xl: 32,
    xxl: 40
  },

  // Border radius
  radius: {
    sm: 8,
    md: 16,
    lg: 24
  },

  // Dimensions
  canvas: {
    width: 360,
    height: 680
  },

  card: {
    height: 220,
    photoRadius: 45,
    qrSize: 60,
    flagWidth: 40,
    flagHeight: 24
  },

  // Mathematical constants
  goldenRatio: 1.618,

  // Animation
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
});

/**
 * @typedef {Object} DiiaCardProps
 * @property {string} [title='ПОСВІДЧЕННЯ ВОДІЯ'] - Document title
 * @property {string} [firstName='ТАРАС'] - First name
 * @property {string} [lastName='ШЕВЧЕНКО'] - Last name
 * @property {string} [birthDate='09.03.1814'] - Birth date
 * @property {string} [cardNumber='AAA 123456'] - Card number
 */

/**
 * Vector Renderer Class
 * 
 * Generates mathematical SVG-based UI components for Diia ecosystem
 * All rendering is pure - no side effects, deterministic output
 * 
 * @class
 * @example
 * const renderer = new VectorRenderer();
 * const svg = renderer.renderDiiaIDCard({ firstName: 'ОЛЕНА' }, 2);
 */
class VectorRenderer {
  /**
   * Creates a new VectorRenderer instance
   * @constructor
   */
  constructor() {
    // Design tokens (immutable reference)
    this.tokens = DIIA_TOKENS;

    // Layout state (mutable for stacking calculations)
    this.currentY = 0;

    // 3D tilt state (bounded to [-1, 1])
    this.tiltX = 0;
    this.tiltY = 0;

    // Performance: Pattern cache for repeated renders
    /** @type {Map<string, string>} */
    this.patternCache = new Map();

    // Statistics
    this.stats = {
      rendersCount: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  /**
   * Get current configuration
   * @returns {Object} Current renderer config
   */
  getConfig() {
    return {
      tokens: this.tokens,
      tilt: { x: this.tiltX, y: this.tiltY },
      stats: { ...this.stats }
    };
  }

  /**
   * Reset layout engine
   * @returns {void}
   */
  reset() {
    this.currentY = 0;
  }

  /**
   * Advance Y position for vertical stacking
   * @param {number} height - Height to advance
   * @param {number} [gap=0] - Optional gap
   * @returns {number} New Y position
   */
  advanceY(height, gap = 0) {
    this.currentY += height + gap;
    return this.currentY;
  }

  /**
   * Set 3D tilt for holographic effects
   * Values are clamped to [-1, 1] range for safety
   * 
   * @param {number} x - Horizontal tilt
   * @param {number} y - Vertical tilt
   * @returns {void}
   */
  setTilt(x, y) {
    this.tiltX = this._clamp(x, -1, 1);
    this.tiltY = this._clamp(y, -1, 1);
  }

  /**
   * Clamp value between min and max
   * @private
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum bound
   * @param {number} max - Maximum bound
   * @returns {number} Clamped value
   */
  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Validate props object
   * @private
   * @param {*} props - Props to validate
   * @throws {TypeError} If props is not an object
   * @returns {void}
   */
  _validateProps(props) {
    if (props !== null && typeof props !== 'object') {
      throw new TypeError(`Props must be an object, got ${typeof props}`);
    }
  }

  /**
   * Validate scale parameter
   * @private
   * @param {*} scale - Scale to validate
   * @throws {TypeError} If scale is not a number
   * @throws {RangeError} If scale is out of safe range
   * @returns {void}
   */
  _validateScale(scale) {
    if (typeof scale !== 'number') {
      throw new TypeError(`Scale must be a number, got ${typeof scale}`);
    }
    if (scale <= 0 || scale > 100) {
      throw new RangeError(`Scale must be between 0 and 100, got ${scale}`);
    }
    if (scale > 10) {
      console.warn(`⚠️ Large scale (${scale}x) may impact performance`);
    }
  }

  /**
   * Generate holographic gradient with tilt-based animation
   * 
   * @param {string} id - Unique gradient ID
   * @param {number} [offsetX=0] - X offset multiplier
   * @param {number} [offsetY=0] - Y offset multiplier
   * @returns {string} SVG linearGradient definition
   */
  generateHologramGradient(id, offsetX = 0, offsetY = 0) {
    const x1 = 0 + offsetX * 100;
    const y1 = 0 + offsetY * 100;
    const x2 = 100 + offsetX * 100;
    const y2 = 100 + offsetY * 100;

    return `
      <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="30%" stop-color="${this.tokens.colors.primary}" stop-opacity="0.15" />
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.2" />
        <stop offset="100%" stop-color="${this.tokens.colors.primary}" stop-opacity="0.05" />
      </linearGradient>
    `;
  }

  /**
   * Generate security pattern (diagonal vector grid)
   * Uses caching for performance optimization
   * 
   * @param {number} width - Pattern width
   * @param {number} height - Pattern height
   * @param {number} [scale=1] - Scale multiplier
   * @returns {string} SVG path elements
   */
  generateSecurityPattern(width, height, scale = 1) {
    const cacheKey = `pattern_${width}_${height}_${scale}`;

    if (this.patternCache.has(cacheKey)) {
      this.stats.cacheHits++;
      return this.patternCache.get(cacheKey);
    }

    this.stats.cacheMisses++;

    const parts = [];
    const spacing = 20 * scale;
    const strokeWidth = 0.5 * scale;

    for (let i = 0; i < width; i += spacing) {
      parts.push(`<path d="M${i} 0 L${i - spacing} ${height}" stroke="white" stroke-width="${strokeWidth}" stroke-opacity="0.1"/>`);
    }

    const pattern = parts.join('');
    
    if (this.patternCache.size >= 50) {
      const firstKey = this.patternCache.keys().next().value;
      this.patternCache.delete(firstKey);
    }
    
    this.patternCache.set(cacheKey, pattern);
    return pattern;
  }

  /**
   * Generate Vector QR Code (simplified mathematical pattern)
   * 
   * Note: This is a decorative pattern, not a real QR code
   * For production, use a proper QR library
   * 
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} size - QR code size
   * @param {number} [scale=1] - Scale multiplier
   * @param {string} [color] - Fill color
   * @returns {string} SVG path element
   */
  generateVectorQR(x, y, size, scale = 1, color = this.tokens.colors.dark) {
    const actualSize = size * scale;
    const gridSize = 21;
    const pixelSize = actualSize / gridSize;

    const pattern = [
      1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
      1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1,
      1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1,
      1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1,
      1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    const qrParts = [];
    for (let i = 0; i < gridSize && i < 8; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = i * gridSize + j;
        if (index >= pattern.length) break;
        if (pattern[index] === 1) {
          const px = x + j * pixelSize;
          const py = y + i * pixelSize;
          qrParts.push(`M${px} ${py} h${pixelSize} v${pixelSize} h${-pixelSize} z`);
        }
      }
    }

    return `<path d="${qrParts.join(' ')}" fill="${color}" role="img" aria-label="QR код"/>`;
  }

  /**
   * Render realistic Diia ID Card
   * 
   * @param {DiiaCardProps} [props={}] - Card properties
   * @param {number} [scale=1] - Scale multiplier (1 = 360x680)
   * @returns {string} Complete SVG markup
   * @throws {TypeError} If props is invalid
   * @throws {RangeError} If scale is out of bounds
   */
  renderDiiaIDCard(props = {}, scale = 1) {
    this._validateProps(props);
    this._validateScale(scale);

    this.reset();
    this.stats.rendersCount++;

    const W = this.tokens.canvas.width * scale;
    const H = this.tokens.canvas.height * scale;
    const P = this.tokens.spacing.md * scale;
    const R = this.tokens.radius.lg * scale;
    const cardW = W - (P * 2);
    const cardH = this.tokens.card.height * scale;
    const cardX = P;
    const cardY = P + (this.tokens.spacing.xl * scale);
    const cardR = this.tokens.radius.md * scale;

    const parts = [];
    parts.push(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diia ID Card">`);
    parts.push(`<defs>`);
    parts.push(this.generateHologramGradient('holo-gradient', this.tiltX * 0.5, this.tiltY * 0.5));
    parts.push(`<filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/></filter>`);
    parts.push(`<clipPath id="card-clip"><rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}"/></clipPath></defs>`);
    parts.push(`<rect width="${W}" height="${H}" rx="${R}" fill="${this.tokens.colors.background}"/>`);
    parts.push(`<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}" fill="${this.tokens.colors.cardBg}" filter="url(#shadow)"/>`);
    parts.push(`<g opacity="0.3" clip-path="url(#card-clip)">`);
    parts.push(this.generateSecurityPattern(cardW, cardH, scale));
    parts.push(`</g>`);
    parts.push(`<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${cardR}" fill="url(#holo-gradient)" aria-hidden="true"/>`);

    const flagX = cardX + (P * 2);
    const flagY = cardY + (P * 2);
    const flagW = this.tokens.card.flagWidth * scale;
    const flagH = this.tokens.card.flagHeight * scale;
    const flagHalfH = Math.round(flagH / 2);

    parts.push(`<g role="img" aria-label="Прапор України"><rect x="${flagX}" y="${flagY}" width="${flagW}" height="${flagHalfH}" fill="${this.tokens.colors.flag.blue}"/><rect x="${flagX}" y="${flagY + flagHalfH}" width="${flagW}" height="${flagH - flagHalfH}" fill="${this.tokens.colors.flag.yellow}"/></g>`);

    const titleX = flagX + flagW + (12 * scale);
    const titleY = flagY + (18 * scale);
    parts.push(`<text x="${titleX}" y="${titleY}" font-family="e-Ukraine, Inter, sans-serif" font-weight="bold" font-size="${this.tokens.fontSize.md * scale}" fill="${this.tokens.colors.dark}">УКРАЇНА</text>`);
    parts.push(`<text x="${titleX}" y="${titleY + 16 * scale}" font-family="e-Ukraine, Inter, sans-serif" font-size="${this.tokens.fontSize.base * scale}" fill="${this.tokens.colors.textSecondary}">${props.title || 'ПОСВІДЧЕННЯ ВОДІЯ'}</text>`);

    const photoR = this.tokens.card.photoRadius * scale;
    const photoX = cardX + (P * 2) + photoR;
    const photoY = cardY + (90 * scale);
    parts.push(`<circle cx="${photoX}" cy="${photoY}" r="${photoR}" fill="#D0D0D0" stroke="${this.tokens.colors.primary}" stroke-width="${2 * scale}" role="img" aria-label="Фото"/>`);
    parts.push(`<text x="${photoX}" y="${photoY + 5 * scale}" font-size="${this.tokens.fontSize.xxl * scale}" text-anchor="middle" opacity="0.3" aria-hidden="true">👤</text>`);

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
      parts.push(`<text x="${dataX}" y="${dataY}" font-family="e-Ukraine, Inter, sans-serif" font-size="${this.tokens.fontSize.xs * scale}" fill="${this.tokens.colors.textSecondary}">${field.label}</text>`);
      dataY += 12 * scale;
      parts.push(`<text x="${dataX}" y="${dataY}" font-family="e-Ukraine, Inter, sans-serif" font-weight="600" font-size="${this.tokens.fontSize.base * scale}" fill="${this.tokens.colors.dark}">${field.value}</text>`);
      dataY += 18 * scale;
    });

    const qrSize = this.tokens.card.qrSize * scale;
    const qrX = cardX + cardW - qrSize - (P * 2);
    const qrY = cardY + cardH - qrSize - (P * 2);
    parts.push(`<rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" fill="white"/>`);
    parts.push(this.generateVectorQR(qrX, qrY, this.tokens.card.qrSize, scale));

    const logoX = cardX + (P * 2);
    const logoY = cardY + cardH - (40 * scale);
    parts.push(`<text x="${logoX}" y="${logoY}" font-family="e-Ukraine, Inter, sans-serif" font-weight="bold" font-size="${this.tokens.fontSize.lg * scale}" fill="${this.tokens.colors.primary}" role="img" aria-label="Дія логотип">Дія</text>`);
    parts.push(`<text x="${cardX + cardW / 2}" y="${cardY + cardH - 12 * scale}" text-anchor="middle" font-family="monospace" font-size="${this.tokens.fontSize.sm * scale}" fill="${this.tokens.colors.textTertiary}">№ ${props.cardNumber || 'AAA 123456'}</text>`);
    parts.push(`</svg>`);

    return parts.join('');
  }

  /**
   * Legacy render method (backwards compatibility)
   * @param {DiiaCardProps} [props={}] - Card properties
   * @param {number} [scale=1] - Scale multiplier
   * @returns {string} SVG markup
   */
  /**
   * Render Upload Documents Screen (Vector Logic)
   * Matches the DOM renderer output but using pure SVG
   * 
   * @param {Object} props - Screen properties
   * @param {number} [scale=1] - Scale multiplier
   * @returns {string} SVG markup
   */
  renderUploadScreen(props = {}, scale = 1) {
    this._validateScale(scale);

    const width = this.tokens.canvas.width * scale;
    const height = this.tokens.canvas.height * scale;
    const P = this.tokens.spacing.md * scale; // Padding 16px

    const parts = [];
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${props.title || 'Завантаження документів'}">`);

    // Background
    parts.push(`<rect width="${width}" height="${height}" fill="${this.tokens.colors.background}" rx="${this.tokens.radius.lg * scale}"/>`);

    // Card Container (White bg)
    const cardY = 16 * scale;
    const cardX = 8 * scale;
    const cardW = width - (16 * scale);
    const cardH = height - (32 * scale);

    parts.push(`<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="${24 * scale}" fill="${this.tokens.colors.cardBg}"/>`);

    // Content Area
    const contentX = cardX + P;
    let currentY = cardY + (32 * scale);

    // Title
    parts.push(`<text x="${contentX}" y="${currentY}" font-family="e-Ukraine, Inter, sans-serif" font-weight="bold" font-size="${18 * scale}" fill="#111827">${props.title || 'Завантаження документів'}</text>`);

    // Subtitle/Description
    currentY += 24 * scale;
    parts.push(`<text x="${contentX}" y="${currentY}" font-family="e-Ukraine, Inter, sans-serif" font-size="${14 * scale}" fill="#374151">${props.subtitle || props.description || 'Додайте необхідні документи'}</text>`);

    // Upload Zone
    currentY += 32 * scale;
    const zoneH = 120 * scale;
    const zoneW = cardW - (P * 2);

    // Dashed border rect
    parts.push(`<rect x="${contentX}" y="${currentY}" width="${zoneW}" height="${zoneH}" rx="${16 * scale}" fill="#F5F8FA" stroke="#D1D5DB" stroke-width="${2 * scale}" stroke-dasharray="${8 * scale} ${8 * scale}"/>`);

    // Upload Icon & Text (Centered in zone)
    const centerX = contentX + (zoneW / 2);
    const centerY = currentY + (zoneH / 2);

    // Arrow Icon (Simple path)
    const arrowSize = 24 * scale;
    const arrowY = centerY - (12 * scale);

    parts.push(`<path d="M${centerX} ${arrowY} L${centerX} ${arrowY + 12 * scale} M${centerX} ${arrowY} L${centerX - 4 * scale} ${arrowY + 4 * scale} M${centerX} ${arrowY} L${centerX + 4 * scale} ${arrowY + 4 * scale}" stroke="#67C3F3" stroke-width="${2 * scale}" stroke-linecap="round" stroke-linejoin="round"/>`);

    // "Add File" Text
    parts.push(`<text x="${centerX}" y="${centerY + 16 * scale}" text-anchor="middle" font-family="e-Ukraine, Inter, sans-serif" font-size="${16 * scale}" fill="#6B7280">${props.buttonText || 'Додати файл'}</text>`);

    // Bottom Button "Next"
    const btnH = 56 * scale;
    const btnY = cardY + cardH - btnH - P;

    parts.push(`<rect x="${contentX}" y="${btnY}" width="${zoneW}" height="${btnH}" rx="${16 * scale}" fill="#000000"/>`);
    parts.push(`<text x="${centerX}" y="${btnY + (btnH / 2) + (6 * scale)}" text-anchor="middle" font-family="e-Ukraine, Inter, sans-serif" font-weight="600" font-size="${18 * scale}" fill="#FFFFFF">Далі</text>`);

    parts.push(`</svg>`);
    return parts.join('');
  }

  /**
   * Smart render method - chooses appropriate renderer based on props
   * @param {Object} [props={}] - Component properties
   * @param {number} [scale=1] - Scale multiplier
   * @returns {string} SVG markup
   */
  render(props = {}, scale = 1) {
    // Heuristic: If props contain 'buttonText' or 'subtitle', it's likely the Upload Screen
    if (props.buttonText || props.subtitle || props.description) {
      return this.renderUploadScreen(props, scale);
    }
    // Default to ID Card
    return this.renderDiiaIDCard(props, scale);
  }

  /**
   * Get payload size in bytes
   * @param {DiiaCardProps} [props={}] - Card properties
   * @param {number} [scale=1] - Scale multiplier
   * @returns {number} Size in bytes
   */
  getPayloadSize(props = {}, scale = 1) {
    const output = this.renderDiiaIDCard(props, scale);
    return new Blob([output]).size;
  }

  /**
   * Clear pattern cache
   * Use when memory optimization is needed
   * @returns {void}
   */
  clearCache() {
    this.patternCache.clear();
    this.stats.cacheHits = 0;
    this.stats.cacheMisses = 0;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VectorRenderer;
}
window.VectorRenderer = VectorRenderer;
