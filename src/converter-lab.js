/**
 * Converter Lab - UI Controller
 * 
 * Manages the Universal Design Converter interface
 * Handles user interactions, updates stats, and renders analysis
 * 
 * @version 1.0.0
 */

import { OptimizerEngine } from './generators/optimizer-engine.js';
import { PatternDetector } from './utils/pattern-detector.js';
import { TokenEstimator } from './utils/token-estimator.js';

export class ConverterLab {
  constructor() {
    this.optimizer = new OptimizerEngine();
    this.patternDetector = new PatternDetector();
    this.tokenEstimator = new TokenEstimator();
    
    this.elements = {};
    this.currentResult = null;
  }
  
  /**
   * Initialize converter interface
   */
  init() {
    // Get DOM elements
    this.elements = {
      inputCode: document.getElementById('input-code'),
      outputCode: document.getElementById('output-code'),
      analyzeBtn: document.getElementById('analyze-btn'),
      copyBtn: document.getElementById('copy-output'),
      downloadBtn: document.getElementById('download-output'),
      
      // Stats
      inputSize: document.getElementById('input-size'),
      inputLines: document.getElementById('input-lines'),
      inputTokens: document.getElementById('input-tokens'),
      outputSize: document.getElementById('output-size'),
      reduction: document.getElementById('reduction'),
      aiScore: document.getElementById('ai-score'),
      
      // Dashboard
      dashboard: document.querySelector('.analysis-dashboard'),
      bytesSaved: document.getElementById('bytes-saved'),
      scoreCircle: document.querySelector('.score-circle'),
      scoreNumber: document.querySelector('.score-number'),
      patternsList: document.getElementById('patterns-list'),
      suggestionsList: document.getElementById('suggestions-list'),
      
      // Token tables
      gpt4Before: document.getElementById('gpt4-before'),
      gpt4After: document.getElementById('gpt4-after'),
      claudeBefore: document.getElementById('claude-before'),
      claudeAfter: document.getElementById('claude-after'),
      geminiBefore: document.getElementById('gemini-before'),
      geminiAfter: document.getElementById('gemini-after'),
      
      // Comparison bar
      comparisonBar: document.querySelector('.comparison-bar'),
      barOriginal: document.querySelector('.bar-segment.original'),
      barOptimized: document.querySelector('.bar-segment.optimized')
    };
    
    // Event listeners
    this.attachEventListeners();
    
    console.log('✅ Converter Lab initialized');
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Input textarea - update stats on input
    if (this.elements.inputCode) {
      this.elements.inputCode.addEventListener('input', () => {
        this.updateInputStats();
      });
      
      // Allow paste
      this.elements.inputCode.addEventListener('paste', () => {
        setTimeout(() => this.updateInputStats(), 100);
      });
    }
    
    // Analyze button
    if (this.elements.analyzeBtn) {
      this.elements.analyzeBtn.addEventListener('click', () => {
        this.analyze();
      });
    }
    
    // Copy button
    if (this.elements.copyBtn) {
      this.elements.copyBtn.addEventListener('click', () => {
        this.copyToClipboard();
      });
    }
    
    // Download button
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.addEventListener('click', () => {
        this.downloadOutput();
      });
    }
  }
  
  /**
   * Update input stats (size, lines, tokens)
   */
  updateInputStats() {
    const code = this.elements.inputCode.value;
    
    if (!code) {
      this.elements.inputSize.textContent = '0 KB';
      this.elements.inputLines.textContent = '0';
      this.elements.inputTokens.textContent = '~0';
      return;
    }
    
    const size = new Blob([code]).size;
    const lines = code.split('\n').length;
    const tokens = this.tokenEstimator.estimate(code, 'gpt-4');
    
    this.elements.inputSize.textContent = (size / 1024).toFixed(2) + ' KB';
    this.elements.inputLines.textContent = lines.toString();
    this.elements.inputTokens.textContent = '~' + tokens.toString();
  }
  
  /**
   * Analyze and optimize code
   */
  async analyze() {
    const code = this.elements.inputCode.value.trim();
    
    if (!code) {
      alert('Будь ласка, вставте код для аналізу');
      return;
    }
    
    // Show loading state
    this.elements.analyzeBtn.textContent = '⚡ Аналізую...';
    this.elements.analyzeBtn.disabled = true;
    
    try {
      // Analyze (with small delay to show loading)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.currentResult = this.optimizer.analyze(code);
      
      // Update UI
      this.displayResults();
      
      // Show dashboard
      if (this.elements.dashboard) {
        this.elements.dashboard.style.display = 'block';
      }
      
      console.log('✅ Analysis complete:', this.currentResult);
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      alert('Помилка аналізу: ' + error.message);
    } finally {
      // Reset button
      this.elements.analyzeBtn.textContent = '⚡ Analyze & Optimize';
      this.elements.analyzeBtn.disabled = false;
    }
  }
  
  /**
   * Display analysis results
   */
  displayResults() {
    const result = this.currentResult;
    if (!result) return;
    
    // Output code
    this.elements.outputCode.value = result.optimized;
    
    // Output stats
    this.elements.outputSize.textContent = (result.stats.optimizedSize / 1024).toFixed(2) + ' KB';
    this.elements.reduction.textContent = result.stats.reduction;
    this.elements.aiScore.textContent = result.stats.aiScoreAfter.toString();
    
    // Dashboard metrics
    this.elements.bytesSaved.textContent = result.stats.bytesSaved.toLocaleString();
    
    // AI Score meter
    const score = result.stats.aiScoreAfter;
    this.elements.scoreNumber.textContent = score.toString();
    
    // Set score level
    if (score >= 70) {
      this.elements.scoreCircle.dataset.score = 'high';
    } else if (score >= 40) {
      this.elements.scoreCircle.dataset.score = 'medium';
    } else {
      this.elements.scoreCircle.dataset.score = 'low';
    }
    
    // Comparison bar
    const reductionPercent = parseFloat(result.stats.reduction);
    const optimizedPercent = Math.max(5, 100 - reductionPercent); // Min 5% for visibility
    
    this.elements.barOptimized.style.width = optimizedPercent + '%';
    
    // Token costs
    const tokenComparison = this.tokenEstimator.compareCosts(result.original, result.optimized);
    
    this.elements.gpt4Before.textContent = tokenComparison['gpt-4'].tokensBefore.toLocaleString();
    this.elements.gpt4After.textContent = tokenComparison['gpt-4'].tokensAfter.toLocaleString();
    
    this.elements.claudeBefore.textContent = tokenComparison['claude'].tokensBefore.toLocaleString();
    this.elements.claudeAfter.textContent = tokenComparison['claude'].tokensAfter.toLocaleString();
    
    this.elements.geminiBefore.textContent = tokenComparison['gemini'].tokensBefore.toLocaleString();
    this.elements.geminiAfter.textContent = tokenComparison['gemini'].tokensAfter.toLocaleString();
    
    // Patterns
    this.displayPatterns(result.patterns);
    
    // Suggestions
    this.displaySuggestions(result.suggestions);
  }
  
  /**
   * Display detected patterns
   */
  displayPatterns(patterns) {
    if (!this.elements.patternsList) return;
    
    this.elements.patternsList.innerHTML = '';
    
    if (patterns.length === 0) {
      this.elements.patternsList.innerHTML = '<li class="no-patterns">Патерни не знайдено</li>';
      return;
    }
    
    patterns.forEach(pattern => {
      const li = document.createElement('li');
      li.className = 'pattern-item';
      li.innerHTML = `
        <div class="pattern-header">
          <span class="pattern-type">${pattern.type}</span>
          <span class="pattern-count">${pattern.count}×</span>
        </div>
        <div class="pattern-suggestion">${pattern.suggestion}</div>
        ${pattern.formula ? `<code class="pattern-code">${this.escapeHTML(pattern.formula)}</code>` : ''}
      `;
      this.elements.patternsList.appendChild(li);
    });
  }
  
  /**
   * Display optimization suggestions
   */
  displaySuggestions(suggestions) {
    if (!this.elements.suggestionsList) return;
    
    this.elements.suggestionsList.innerHTML = '';
    
    if (suggestions.length === 0) {
      this.elements.suggestionsList.innerHTML = '<li class="no-suggestions">✅ Код вже оптимізований!</li>';
      return;
    }
    
    suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.className = `suggestion-item priority-${suggestion.priority}`;
      li.innerHTML = `
        <span class="suggestion-icon">${this.getSuggestionIcon(suggestion.type)}</span>
        <span class="suggestion-text">${suggestion.message}</span>
      `;
      this.elements.suggestionsList.appendChild(li);
    });
  }
  
  /**
   * Get suggestion icon
   */
  getSuggestionIcon(type) {
    const icons = {
      warning: '⚠️',
      optimization: '⚡',
      style: '🎨',
      'design-system': '🎯'
    };
    return icons[type] || '💡';
  }
  
  /**
   * Copy output to clipboard
   */
  async copyToClipboard() {
    const code = this.elements.outputCode.value;
    
    if (!code) {
      alert('Немає коду для копіювання');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(code);
      
      // Visual feedback
      const originalText = this.elements.copyBtn.textContent;
      this.elements.copyBtn.textContent = '✅ Скопійовано!';
      this.elements.copyBtn.style.background = 'var(--diia-success)';
      
      setTimeout(() => {
        this.elements.copyBtn.textContent = originalText;
        this.elements.copyBtn.style.background = '';
      }, 2000);
      
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Помилка копіювання');
    }
  }
  
  /**
   * Download output as file
   */
  downloadOutput() {
    const code = this.elements.outputCode.value;
    
    if (!code) {
      alert('Немає коду для завантаження');
      return;
    }
    
    const filename = 'vector-logic-optimized.js';
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Downloaded:', filename);
  }
  
  /**
   * Escape HTML for safe display
   */
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.converterLab = new ConverterLab();
}
