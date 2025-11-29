/**
 * LLM Cost Calculator
 * Estimates token usage and costs for AI generation
 */

class LLMCostCalculator {
  constructor() {
    // Token pricing (OpenAI GPT-4 pricing as baseline)
    this.pricing = {
      inputTokenPer1K: 0.03,   // $0.03 per 1K input tokens
      outputTokenPer1K: 0.06   // $0.06 per 1K output tokens
    };
    
    // Approximate: 1 token ≈ 4 characters (English)
    // For code, it's closer to 1 token ≈ 3 characters
    this.charsPerToken = 3.5;
  }
  
  /**
   * Estimate token count from content
   */
  estimateTokens(content) {
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    return Math.ceil(content.length / this.charsPerToken);
  }
  
  /**
   * Calculate cost for generation
   */
  calculateCost(tokens, type = 'output') {
    const pricePerToken = type === 'input' 
      ? this.pricing.inputTokenPer1K / 1000
      : this.pricing.outputTokenPer1K / 1000;
    
    return tokens * pricePerToken;
  }
  
  /**
   * Compare costs between approaches
   */
  compare(vectorContent, domContent, figmaContent) {
    const vectorTokens = this.estimateTokens(vectorContent);
    const domTokens = this.estimateTokens(domContent);
    const figmaTokens = this.estimateTokens(figmaContent);
    
    const vectorCost = this.calculateCost(vectorTokens);
    const domCost = this.calculateCost(domTokens);
    const figmaCost = this.calculateCost(figmaTokens);
    
    return {
      vector: {
        tokens: vectorTokens,
        cost: vectorCost,
        costPer1000: vectorCost * 1000,
        efficiency: 1.0
      },
      dom: {
        tokens: domTokens,
        cost: domCost,
        costPer1000: domCost * 1000,
        efficiency: vectorTokens / domTokens
      },
      figma: {
        tokens: figmaTokens,
        cost: figmaCost,
        costPer1000: figmaCost * 1000,
        efficiency: vectorTokens / figmaTokens
      },
      savings: {
        vsDOM: {
          tokens: domTokens - vectorTokens,
          cost: domCost - vectorCost,
          percentage: ((domCost - vectorCost) / domCost * 100).toFixed(1)
        },
        vsFigma: {
          tokens: figmaTokens - vectorTokens,
          cost: figmaCost - vectorCost,
          percentage: ((figmaCost - vectorCost) / figmaCost * 100).toFixed(1)
        }
      }
    };
  }
  
  /**
   * Format cost in dollars
   */
  formatCost(cost) {
    if (cost < 0.01) {
      return `$${(cost * 1000).toFixed(3)}‰`; // Per mille
    }
    return `$${cost.toFixed(4)}`;
  }
  
  /**
   * Generate AI readiness report
   */
  generateReport(comparison) {
    const report = {
      summary: `Vector Logic saves ${comparison.savings.vsDOM.percentage}% tokens vs DOM (${comparison.savings.vsDOM.tokens} tokens)`,
      
      costAnalysis: {
        perGeneration: {
          vector: this.formatCost(comparison.vector.cost),
          dom: this.formatCost(comparison.dom.cost),
          figma: this.formatCost(comparison.figma.cost)
        },
        per1000Screens: {
          vector: this.formatCost(comparison.vector.costPer1000),
          dom: this.formatCost(comparison.dom.costPer1000),
          figma: this.formatCost(comparison.figma.costPer1000)
        }
      },
      
      efficiency: {
        domMultiplier: (1 / comparison.dom.efficiency).toFixed(1) + 'x more tokens',
        figmaMultiplier: (1 / comparison.figma.efficiency).toFixed(1) + 'x more tokens'
      },
      
      aiAdvantages: [
        'Smaller context window usage',
        'Faster generation time',
        'Lower API costs',
        'Better prompt engineering',
        'Mathematical reasoning instead of template filling'
      ]
    };
    
    return report;
  }
  
  /**
   * Calculate ROI for switching to Vector approach
   */
  calculateROI(screensPerMonth, approach = 'dom') {
    const vectorCostPerScreen = this.calculateCost(this.estimateTokens('<svg>...</svg>'));
    const comparisonCostPerScreen = approach === 'dom'
      ? this.calculateCost(this.estimateTokens('<div>...</div>'))
      : this.calculateCost(this.estimateTokens('{"layers": [...]}'));
    
    const monthlySavings = (comparisonCostPerScreen - vectorCostPerScreen) * screensPerMonth;
    const yearlySavings = monthlySavings * 12;
    
    return {
      monthly: monthlySavings,
      yearly: yearlySavings,
      formatted: {
        monthly: this.formatCost(monthlySavings),
        yearly: this.formatCost(yearlySavings)
      }
    };
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LLMCostCalculator;
}
