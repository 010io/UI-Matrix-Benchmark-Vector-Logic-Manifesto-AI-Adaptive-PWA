/**
 * Optimizer Engine - Universal Design Converter
 * 
 * Transforms bloated design tool exports (Figma/Adobe/Sketch) into clean Vector Logic
 * Features: Digital Liposuction, Pattern Recognition, AI Scoring
 * 
 * @version 1.0.0
 * @author 010io (Igor Omelchenko)
 */

/**
 * OptimizerEngine Class
 * 
 * Main engine for analyzing and optimizing SVG/HTML code
 * 
 * @class
 * @example
 * const optimizer = new OptimizerEngine();
 * const result = optimizer.analyze(figmaSVG);
 * console.log(result.stats.reduction); // "78.5%"
 */
export class OptimizerEngine {
  constructor() {
    // Format signatures for auto-detection
    this.formatSignatures = {
      figma: [
        'xmlns:xlink="http://www.w3.org/1999/xlink"',
        'fill-rule="evenodd"',
        'clip-rule="evenodd"',
        /id="[A-Z0-9]{8,}"/  // Figma uses long random IDs
      ],
      adobe: [
        'xmlns:adobe',
        'xmlns:i',
        'data-name=',
        'Adobe Illustrator',
        /<g id="Layer_\d+"/
      ],
      sketch: [
        'sketch:type',
        'xmlns:sketch',
        /<g id="Page-\d+"/
      ],
      penpot: [
        'xmlns:penpot',
        'penpot:',
        'data-penpot'
      ]
    };

    // Statistics
    this.stats = {
      analyzed: 0,
      optimized: 0,
      totalBytesSaved: 0
    };
  }

  /**
   * Main analysis entry point
   * 
   * @param {string} rawCode - Raw SVG/HTML code
   * @param {Object} [options={}] - Analysis options
   * @returns {Object} Analysis result with optimized code and stats
   */
  analyze(rawCode, options = {}) {
    if (!rawCode || typeof rawCode !== 'string') {
      throw new TypeError('Input must be a non-empty string');
    }

    this.stats.analyzed++;

    const originalSize = new Blob([rawCode]).size;
    const originalLines = rawCode.split('\n').length;

    // 1. Detect format
    const detectedFormat = this.detectFormat(rawCode);

    // 2. Clean SVG (Digital Liposuction)
    let cleaned = this.cleanSVG(rawCode, detectedFormat);

    // 3. Detect patterns
    const patterns = this.detectPatterns(cleaned);

    // 4. Generate Vector Logic suggestions
    const vectorLogic = this.generateVectorLogic(patterns, cleaned);

    // 5. Calculate sizes and scores
    const optimizedSize = new Blob([vectorLogic]).size;
    const optimizedLines = vectorLogic.split('\n').length;

    const bytesSaved = originalSize - optimizedSize;
    this.stats.totalBytesSaved += bytesSaved;
    this.stats.optimized++;

    const reduction = ((bytesSaved / originalSize) * 100).toFixed(1);
    const aiScoreBefore = this.calculateAIScore(rawCode);
    const aiScoreAfter = this.calculateAIScore(vectorLogic);

    // 6. Estimate token costs
    const tokensBefore = this.estimateTokens(rawCode);
    const tokensAfter = this.estimateTokens(vectorLogic);

    return {
      original: rawCode,
      optimized: vectorLogic,
      format: detectedFormat,
      patterns: patterns,
      stats: {
        originalSize,
        optimizedSize,
        bytesSaved,
        reduction: reduction + '%',
        originalLines,
        optimizedLines,
        aiScoreBefore,
        aiScoreAfter,
        aiImprovement: ((aiScoreAfter - aiScoreBefore) / aiScoreBefore * 100).toFixed(1) + '%',
        tokensBefore,
        tokensAfter,
        tokensSaved: tokensBefore - tokensAfter
      },
      suggestions: this.generateSuggestions(patterns, cleaned)
    };
  }

  /**
   * Detect source format (Figma/Adobe/Sketch/Penpot/Generic)
   * 
   * @param {string} code - Code to analyze
   * @returns {string} Detected format
   */
  detectFormat(code) {
    const lowerCode = code.toLowerCase();

    for (const [format, signatures] of Object.entries(this.formatSignatures)) {
      const matches = signatures.filter(sig => {
        if (sig instanceof RegExp) {
          return sig.test(code);
        }
        return lowerCode.includes(sig.toLowerCase());
      });

      if (matches.length >= 2) {
        return format;
      }
    }

    // Check if it's SVG at all
    if (code.includes('<svg') || code.includes('<?xml')) {
      return 'generic-svg';
    }

    return 'unknown';
  }

  /**
   * Clean SVG - Digital Liposuction
   * 
   * Removes metadata, comments, redundant attributes, and bloat
   * 
   * @param {string} svg - Raw SVG code
   * @param {string} format - Detected format
   * @returns {string} Cleaned SVG
   */
  cleanSVG(svg, format = 'generic') {
    let cleaned = svg;

    // Remove XML comments
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

    // Remove XML declarations
    cleaned = cleaned.replace(/<\?xml[^?]*\?>/g, '');

    // Remove Adobe-specific namespaces and attributes
    if (format === 'adobe') {
      cleaned = cleaned.replace(/xmlns:adobe="[^"]*"/g, '');
      cleaned = cleaned.replace(/xmlns:i="[^"]*"/g, '');
      cleaned = cleaned.replace(/data-name="[^"]*"/g, '');
      cleaned = cleaned.replace(/i:extraneous="[^"]*"/g, '');
    }

    // Remove Figma-specific bloat
    if (format === 'figma') {
      cleaned = cleaned.replace(/fill-rule="evenodd"/g, '');
      cleaned = cleaned.replace(/clip-rule="evenodd"/g, '');
    }

    // Remove generic bloat
    cleaned = cleaned
      // Remove empty groups
      .replace(/<g>\s*<\/g>/g, '')
      // Remove redundant xlink namespace
      .replace(/xmlns:xlink="[^"]*"/g, '')
      // Remove overly specific IDs (keep short ones)
      .replace(/id="[A-Za-z0-9_-]{15,}"/g, '')
      // Round long decimals to 2 places
      .replace(/(\d+\.\d{2})\d+/g, '$1')
      // Remove unnecessary fill="none" on paths (default)
      .replace(/fill="none"\s*/g, '')
      // Remove empty transform attributes
      .replace(/transform=""\s*/g, '')
      // Collapse multiple spaces
      .replace(/\s{2,}/g, ' ')
      // Remove spaces before closing tags
      .replace(/\s+>/g, '>')
      // Remove spaces after opening tags
      .replace(/>\s+</g, '><');

    // Merge nested groups with no attributes
    cleaned = this.mergeRedundantGroups(cleaned);

    return cleaned.trim();
  }

  /**
   * Merge redundant nested groups
   * 
   * @param {string} svg - SVG code
   * @returns {string} SVG with merged groups
   */
  mergeRedundantGroups(svg) {
    // Simple pattern: <g><g>content</g></g> -> <g>content</g>
    let previous = '';
    let current = svg;
    let iterations = 0;
    const maxIterations = 10;

    while (previous !== current && iterations < maxIterations) {
      previous = current;
      current = current.replace(/<g>(\s*<g[^>]*>[\s\S]*?<\/g>\s*)<\/g>/g, '$1');
      iterations++;
    }

    return current;
  }

  /**
   * Detect geometric patterns and primitives
   * 
   * @param {string} svg - Cleaned SVG
   * @returns {Array} Detected patterns
   */
  detectPatterns(svg) {
    const patterns = [];

    // Detect rectangles
    const rectMatches = svg.match(/<rect[^>]*>/g) || [];
    if (rectMatches.length > 0) {
      patterns.push({
        type: 'rectangle',
        count: rectMatches.length,
        suggestion: 'Replace with mathematical rect() function',
        formula: 'const rect = (x, y, w, h, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`'
      });
    }

    // Detect circles
    const circleMatches = svg.match(/<circle[^>]*>/g) || [];
    if (circleMatches.length > 0) {
      patterns.push({
        type: 'circle',
        count: circleMatches.length,
        suggestion: 'Replace with mathematical circle() function',
        formula: 'const circle = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`'
      });
    }

    // Detect paths (complex)
    const pathMatches = svg.match(/<path[^>]*d="[^"]*"[^>]*>/g) || [];
    if (pathMatches.length > 0) {
      const simplePaths = pathMatches.filter(p => {
        const d = p.match(/d="([^"]*)"/)?.[1] || '';
        // Simple if it only has M, L commands (straight lines)
        return /^[ML\d\s,.-]+$/.test(d);
      });

      if (simplePaths.length > 0) {
        patterns.push({
          type: 'simple-path',
          count: simplePaths.length,
          suggestion: 'Convert straight-line paths to line() functions',
          formula: 'const line = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}"/>`'
        });
      }

      if (pathMatches.length > simplePaths.length) {
        patterns.push({
          type: 'complex-path',
          count: pathMatches.length - simplePaths.length,
          suggestion: 'Keep complex paths, but extract as reusable components',
          formula: null
        });
      }
    }

    // Detect text elements
    const textMatches = svg.match(/<text[^>]*>[\s\S]*?<\/text>/g) || [];
    if (textMatches.length > 0) {
      patterns.push({
        type: 'text',
        count: textMatches.length,
        suggestion: 'Extract text content as props, keep formatting as template',
        formula: 'const text = (x, y, content, size = 14) => `<text x="${x}" y="${y}" font-size="${size}">${content}</text>`'
      });
    }

    // Detect gradients
    const gradientMatches = svg.match(/<(linear|radial)Gradient[^>]*>[\s\S]*?<\/(linear|radial)Gradient>/g) || [];
    if (gradientMatches.length > 0) {
      patterns.push({
        type: 'gradient',
        count: gradientMatches.length,
        suggestion: 'Move gradients to design tokens, reference by ID',
        formula: null
      });
    }

    // Detect repeating elements (identical subtrees)
    const duplicates = this.findDuplicates(svg);
    if (duplicates.length > 0) {
      patterns.push({
        type: 'duplicate-elements',
        count: duplicates.length,
        suggestion: `Found ${duplicates.length} repeating patterns - extract as components or use loops`,
        formula: duplicates.map((d, i) => `// Pattern ${i + 1}: repeated ${d.count} times`).join('\n')
      });
    }

    return patterns;
  }

  /**
   * Find duplicate SVG subtrees
   * 
   * @param {string} svg - SVG code
   * @returns {Array} Duplicate patterns
   */
  findDuplicates(svg) {
    const duplicates = [];

    // Extract all complete elements
    const elementRegex = /<(\w+)[^>]*>(?:[\s\S]*?<\/\1>|[^<]*)/g;
    const elements = svg.match(elementRegex) || [];

    // Count occurrences
    const counts = {};
    elements.forEach(el => {
      // Normalize: remove attributes that vary (x, y, transform)
      const normalized = el
        .replace(/\s(x|y|cx|cy|transform)="[^"]*"/g, '')
        .replace(/\s+/g, ' ');

      if (normalized.length > 50) { // Only count substantial elements
        counts[normalized] = (counts[normalized] || 0) + 1;
      }
    });

    // Find elements that appear more than once
    Object.entries(counts).forEach(([pattern, count]) => {
      if (count > 1) {
        duplicates.push({ pattern, count });
      }
    });

    return duplicates;
  }

  /**
   * Generate Vector Logic code from patterns
   * 
   * @param {Array} patterns - Detected patterns
   * @param {string} cleanedSVG - Cleaned SVG code
   * @returns {string} Vector Logic code
   */
  generateVectorLogic(patterns, cleanedSVG) {
    let code = '/**\n * Vector Logic - Optimized Output\n * Generated by Universal Design Converter\n */\n\n';

    // Add detected pattern functions
    if (patterns.length > 0) {
      code += '// Detected Patterns - Suggested Refactoring:\n';
      patterns.forEach(p => {
        if (p.formula) {
          code += `// ${p.type} (${p.count} instances)\n${p.formula}\n\n`;
        } else {
          code += `// ${p.suggestion}\n\n`;
        }
      });
      code += '// Original SVG (cleaned):\n';
    }

    // Wrap in template literal for easy integration
    code += 'export const generateSVG = (props = {}) => {\n';
    code += '  const { width = 360, height = 680 } = props;\n\n';
    code += '  return `\n';
    code += cleanedSVG.split('\n').map(line => '    ' + line).join('\n');
    code += '\n  `;\n';
    code += '};\n';

    return code;
  }

  /**
   * Calculate AI Friendliness Score (0-100)
   * 
   * Based on token count, complexity, and readability
   * 
   * @param {string} code - Code to score
   * @returns {number} Score (0-100)
   */
  calculateAIScore(code) {
    const tokens = this.estimateTokens(code);
    const lines = code.split('\n').length;
    const avgLineLength = code.length / lines;

    // Scoring factors
    const tokenScore = Math.max(0, 100 - (tokens / 10)); // Fewer tokens = better
    const complexityScore = Math.max(0, 100 - (avgLineLength / 2)); // Shorter lines = better
    const sizeScore = Math.max(0, 100 - (code.length / 100)); // Smaller = better

    // Weighted average
    const score = (tokenScore * 0.5) + (complexityScore * 0.3) + (sizeScore * 0.2);

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Estimate token count for LLMs
   * 
   * Rough heuristic: ~1 token per 4 characters for GPT-4
   * 
   * @param {string} code - Code to analyze
   * @returns {number} Estimated token count
   */
  estimateTokens(code) {
    // Remove whitespace for more accurate count
    const compressed = code.replace(/\s+/g, ' ').trim();

    // GPT-4 approximation: ~1 token per 4 chars
    return Math.ceil(compressed.length / 4);
  }

  /**
   * Generate optimization suggestions
   * 
   * @param {Array} patterns - Detected patterns
   * @param {string} svg - Cleaned SVG
   * @returns {Array} Suggestions
   */
  generateSuggestions(patterns, svg) {
    const suggestions = [];

    // Size-based suggestions
    const size = new Blob([svg]).size;
    if (size > 10000) {
      suggestions.push({
        type: 'warning',
        priority: 'high',
        message: `Large file size (${(size / 1024).toFixed(1)}KB). Consider splitting into smaller components.`
      });
    }

    // Pattern-based suggestions
    patterns.forEach(p => {
      if (p.count > 5) {
        suggestions.push({
          type: 'optimization',
          priority: 'medium',
          message: `${p.count} ${p.type} elements detected - extract into reusable function`
        });
      }
    });

    // Check for inline styles
    if (svg.includes('style=')) {
      suggestions.push({
        type: 'style',
        priority: 'medium',
        message: 'Inline styles detected - extract to CSS variables for consistency'
      });
    }

    // Check for hardcoded colors
    const colorMatches = svg.match(/(fill|stroke)="#[0-9a-fA-F]{6}"/g) || [];
    if (colorMatches.length > 5) {
      suggestions.push({
        type: 'design-system',
        priority: 'high',
        message: `${colorMatches.length} hardcoded colors - map to design tokens`
      });
    }

    // Figma-specific recommendations
    if (this.detectFormat(svg) === 'figma') {
      suggestions.push({
        type: 'tooling',
        priority: 'info',
        message: 'Figma detected: Use "SVG Export" plugin with SVGO for better results.'
      });
      suggestions.push({
        type: 'workflow',
        priority: 'info',
        message: 'To automate: Use "figma-js" to fetch nodes and "svg-parser" to generate formulas.'
      });
    }

    return suggestions;
  }

  /**
   * Get engine statistics
   * 
   * @returns {Object} Statistics
   */
  getStats() {
    return { ...this.stats };
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OptimizerEngine };
}
