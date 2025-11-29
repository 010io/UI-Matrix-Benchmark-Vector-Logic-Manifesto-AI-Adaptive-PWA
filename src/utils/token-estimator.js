/**
 * Token Estimator - LLM Token Cost Calculator
 * 
 * Estimates token counts and API costs for major LLMs
 * 
 * @version 1.0.0
 */

export class TokenEstimator {
  constructor() {
    // Token-to-character ratios (approximate)
    this.ratios = {
      'gpt-4': 4.0,        // ~1 token per 4 chars
      'gpt-3.5': 4.0,
      'claude': 3.5,       // ~1 token per 3.5 chars
      'gemini': 4.0,       // ~1 token per 4 chars
      'codex': 3.0         // ~1 token per 3 chars (code-optimized)
    };
    
    // API pricing (USD per 1M tokens) - as of 2024
    this.pricing = {
      'gpt-4': {
        input: 30.00,
        output: 60.00
      },
      'gpt-3.5': {
        input: 0.50,
        output: 1.50
      },
      'claude': {
        input: 15.00,
        output: 75.00
      },
      'gemini': {
        input: 7.00,
        output: 21.00
      }
    };
  }
  
  /**
   * Estimate tokens for all LLMs
   * 
   * @param {string} text - Text to analyze
   * @returns {Object} Token estimates for each LLM
   */
  estimateAll(text) {
    const compressed = text.replace(/\s+/g, ' ').trim();
    const charCount = compressed.length;
    
    const estimates = {};
    
    Object.entries(this.ratios).forEach(([model, ratio]) => {
      estimates[model] = Math.ceil(charCount / ratio);
    });
    
    return estimates;
  }
  
  /**
   * Estimate tokens for specific model
   * 
   * @param {string} text - Text to analyze
   * @param {string} model - Model name
   * @returns {number} Token count
   */
  estimate(text, model = 'gpt-4') {
    const compressed = text.replace(/\s+/g, ' ').trim();
    const ratio = this.ratios[model] || 4.0;
    
    return Math.ceil(compressed.length / ratio);
  }
  
  /**
   * Calculate API cost
   * 
   * @param {number} tokens - Token count
   * @param {string} model - Model name
   * @param {string} [type='input'] - 'input' or 'output'
   * @returns {number} Cost in USD
   */
  calculateCost(tokens, model = 'gpt-4', type = 'input') {
    const pricing = this.pricing[model];
    if (!pricing) return 0;
    
    const costPer1M = pricing[type] || pricing.input;
    return (tokens / 1000000) * costPer1M;
  }
  
  /**
   * Compare costs before and after optimization
   * 
   * @param {string} before - Original text
   * @param {string} after - Optimized text
   * @returns {Object} Cost comparison for all models
   */
  compareCosts(before, after) {
    const comparison = {};
    
    Object.keys(this.pricing).forEach(model => {
      const tokensBefore = this.estimate(before, model);
      const tokensAfter = this.estimate(after, model);
      const tokensSaved = tokensBefore - tokensAfter;
      
      const costBefore = this.calculateCost(tokensBefore, model, 'input');
      const costAfter = this.calculateCost(tokensAfter, model, 'input');
      const costSaved = costBefore - costAfter;
      
      comparison[model] = {
        tokensBefore,
        tokensAfter,
        tokensSaved,
        reductionPercent: ((tokensSaved / tokensBefore) * 100).toFixed(1),
        costBefore: costBefore.toFixed(6),
        costAfter: costAfter.toFixed(6),
        costSaved: costSaved.toFixed(6),
        // Extrapolate monthly savings (100 requests/day)
        monthlySavings: (costSaved * 100 * 30).toFixed(2)
      };
    });
    
    return comparison;
  }
  
  /**
   * Get detailed breakdown for display
   * 
   * @param {string} text - Text to analyze
   * @returns {Object} Detailed breakdown
   */
  getBreakdown(text) {
    const estimates = this.estimateAll(text);
    
    const breakdown = {
      characterCount: text.length,
      compressedCharCount: text.replace(/\s+/g, ' ').trim().length,
      models: {}
    };
    
    Object.entries(estimates).forEach(([model, tokens]) => {
      const pricing = this.pricing[model];
      
      breakdown.models[model] = {
        tokens,
        costPerCall: pricing ? this.calculateCost(tokens, model, 'input') : null,
        costPer100Calls: pricing ? this.calculateCost(tokens * 100, model, 'input') : null,
        costPerMonth: pricing ? this.calculateCost(tokens * 100 * 30, model, 'input') : null
      };
    });
    
    return breakdown;
  }
}
