/**
 * Keyboard Shortcuts
 * Швидкі команди для тестування
 */

class KeyboardShortcuts {
  constructor() {
    this.shortcuts = {
      'b': () => document.getElementById('run-benchmark')?.click(),
      's': () => document.getElementById('stress-test')?.click(),
      'c': () => document.getElementById('chaos-mode')?.click(),
      'e': () => this.exportResults(),
      'h': () => this.showHelp(),
      '?': () => this.showHelp()
    };

    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleKeydown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (this.shortcuts[key]) {
      e.preventDefault();
      this.shortcuts[key]();
    }
  }

  exportResults() {
    const results = {
      timestamp: new Date().toISOString(),
      vector: {
        size: document.getElementById('vector-size')?.textContent,
        time: document.getElementById('vector-time')?.textContent,
        aiScore: document.getElementById('vector-ai-score')?.textContent,
        tokens: document.getElementById('vector-tokens')?.textContent
      },
      dom: {
        size: document.getElementById('dom-size')?.textContent,
        time: document.getElementById('dom-time')?.textContent,
        aiScore: document.getElementById('dom-ai-score')?.textContent,
        tokens: document.getElementById('dom-tokens')?.textContent
      }
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showHelp() {
    alert(`⌨️ Keyboard Shortcuts:\n\nB - Run Benchmark\nS - Stress Test\nC - Chaos Mode\nE - Export Results\nH or ? - Show Help`);
  }
}

window.KeyboardShortcuts = new KeyboardShortcuts();
