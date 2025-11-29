/**
 * Pattern Detector - Intelligent SVG Pattern Recognition
 * 
 * Detects geometric primitives, repeating elements, and optimization opportunities
 * 
 * @version 1.0.0
 */

export class PatternDetector {
  constructor() {
    this.patterns = [];
  }
  
  /**
   * Analyze SVG for patterns
   * 
   * @param {string} svg - SVG code
   * @returns {Array} Detected patterns with suggestions
   */
  analyze(svg) {
    this.patterns = [];
    
    // Detect all pattern types
    this.detectGeometric(svg);
    this.detectLayout(svg);
    this.detectColors(svg);
    this.detectRepeating(svg);
    
    return this.patterns;
  }
  
  /**
   * Detect geometric primitives
   */
  detectGeometric(svg) {
    // Rectangles with rounded corners
    const roundedRects = (svg.match(/<rect[^>]*rx="[^"]+"/g) || []).length;
    if (roundedRects > 0) {
      this.patterns.push({
        type: 'geometry',
        element: 'rounded-rectangle',
        count: roundedRects,
        suggestion: 'Use design token for border-radius',
        code: 'const RADIUS = { sm: 8, md: 12, lg: 16 };'
      });
    }
    
    // Ellipses (can be optimized to circles)
    const ellipses = svg.match(/<ellipse[^>]*rx="([^"]+)"[^>]*ry="\1"/g) || [];
    if (ellipses.length > 0) {
      this.patterns.push({
        type: 'geometry',
        element: 'ellipse-as-circle',
        count: ellipses.length,
        suggestion: 'Replace ellipses with equal rx/ry as circles',
        code: '<ellipse rx="10" ry="10"/> → <circle r="10"/>'
      });
    }
  }
  
  /**
   * Detect layout patterns
   */
  detectLayout(svg) {
    // Extract all element positions
    const elements = [];
    const positionRegex = /<\w+[^>]*\s(x|cx)="(\d+(?:\.\d+)?)"[^>]*\s(y|cy)="(\d+(?:\.\d+)?)"/g;
    let match;
    
    while ((match = positionRegex.exec(svg)) !== null) {
      elements.push({
        x: parseFloat(match[2]),
        y: parseFloat(match[4])
      });
    }
    
    if (elements.length < 3) return;
    
    // Check for grid layout (equally spaced in x and y)
    const spacingsX = [];

    const spacingsY = [];
    
    for (let i = 1; i < elements.length; i++) {
      const dx = elements[i].x - elements[i - 1].x;
      const dy = elements[i].y - elements[i - 1].y;
      
      if (Math.abs(dx) > 0.1) spacingsX.push(Math.round(dx));
      if (Math.abs(dy) > 0.1) spacingsY.push(Math.round(dy));
    }
    
    // Find most common spacing
    const mostCommonX = this.findMostCommon(spacingsX);
    const mostCommonY = this.findMostCommon(spacingsY);
    
    if (mostCommonX && spacingsX.filter(s => s === mostCommonX).length >= 3) {
      this.patterns.push({
        type: 'layout',
        element: 'grid-horizontal',
        count: spacingsX.filter(s => s === mostCommonX).length,
        suggestion: `Horizontal grid detected (spacing: ${mostCommonX}px)`,
        code: `const GAP_X = ${mostCommonX};\nelements.map((el, i) => ({ ...el, x: i * GAP_X }))`
      });
    }
    
    if (mostCommonY && spacingsY.filter(s => s === mostCommonY).length >= 3) {
      this.patterns.push({
        type: 'layout',
        element: 'grid-vertical',
        count: spacingsY.filter(s => s === mostCommonY).length,
        suggestion: `Vertical grid detected (spacing: ${mostCommonY}px)`,
        code: `const GAP_Y = ${mostCommonY};\nelements.map((el, i) => ({ ...el, y: i * GAP_Y }))`
      });
    }
  }
  
  /**
   * Detect color patterns
   */
  detectColors(svg) {
    // Extract all colors
    const colorRegex = /(fill|stroke)="(#[0-9a-fA-F]{6}|rgb\([^)]+\))"/g;
    const colors = {};
    let match;
    
    while ((match = colorRegex.exec(svg)) !== null) {
      const color = match[2];
      colors[color] = (colors[color] || 0) + 1;
    }
    
    const colorEntries = Object.entries(colors).sort((a, b) => b[1] - a[1]);
    
    if (colorEntries.length > 5) {
      this.patterns.push({
        type: 'design-system',
        element: 'color-palette',
        count: colorEntries.length,
        suggestion: 'Extract colors to design tokens',
        code: colorEntries.slice(0, 5).map(([color, count], i) => 
          `const COLOR_${i + 1} = '${color}'; // Used ${count} times`
        ).join('\n')
      });
    }
    
    // Detect gradients
    const gradients = svg.match(/<(linear|radial)Gradient/g) || [];
    if (gradients.length > 0) {
      this.patterns.push({
        type: 'design-system',
        element: 'gradients',
        count: gradients.length,
        suggestion: 'Move gradients to <defs> and reuse by ID',
        code: null
      });
    }
  }
  
  /**
   * Detect repeating elements
   */
  detectRepeating(svg) {
    // Find all complete elements
    const elementRegex = /<(\w+)([^>]*)>(.*?)<\/\1>/gs;
    const elements = [];
    let match;
    
    while ((match = elementRegex.exec(svg)) !== null) {
      elements.push(match[0]);
    }
    
    // Find duplicates
    const seen = {};
    elements.forEach(el => {
      // Normalize (remove varying attributes like x, y)
      const normalized = el
        .replace(/\s(x|y|cx|cy|transform|id)="[^"]*"/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (normalized.length > 30) {
        seen[normalized] = (seen[normalized] || 0) + 1;
      }
    });
    
    const duplicates = Object.entries(seen).filter(([_, count]) => count > 1);
    
    if (duplicates.length > 0) {
      duplicates.forEach(([pattern, count]) => {
        this.patterns.push({
          type: 'duplication',
          element: 'repeated-component',
          count,
          suggestion: `Element repeated ${count} times - extract as component`,
          code: `const Component = (x, y) => \`${pattern.substring(0, 80)}...\`;`
        });
      });
    }
  }
  
  /**
   * Find most common value in array
   */
  findMostCommon(arr) {
    if (arr.length === 0) return null;
    
    const counts = {};
    arr.forEach(val => counts[val] = (counts[val] || 0) + 1);
    
    let max = 0;
    let mostCommon = null;
    
    Object.entries(counts).forEach(([val, count]) => {
      if (count > max) {
        max = count;
        mostCommon = parseFloat(val);
      }
    });
    
    return mostCommon;
  }
}
