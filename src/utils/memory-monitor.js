/**
 * Memory Monitor - Tracks RAM usage
 * Uses performance.memory API (Chrome/Edge only)
 */

class MemoryMonitor {
  constructor() {
    this.isSupported = 'memory' in performance;
    this.samples = [];
    this.maxSamples = 30;
  }
  
  /**
   * Check if memory API is available
   */
  isAvailable() {
    return this.isSupported;
  }
  
  /**
   * Get current memory usage
   */
  getCurrentUsage() {
    if (!this.isSupported) {
      return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      };
    }
    
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };
  }
  
  /**
   * Record a memory sample
   */
  sample() {
    const usage = this.getCurrentUsage();
    this.samples.push(usage.usedJSHeapSize);
    
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
    
    return usage;
  }
  
  /**
   * Get memory in MB
   */
  getUsageMB() {
    const usage = this.getCurrentUsage();
    return {
      used: (usage.usedJSHeapSize / 1048576).toFixed(2),
      total: (usage.totalJSHeapSize / 1048576).toFixed(2),
      limit: (usage.jsHeapSizeLimit / 1048576).toFixed(2)
    };
  }
  
  /**
   * Get peak memory from samples
   */
  getPeakUsage() {
    if (this.samples.length === 0) return 0;
    return Math.max(...this.samples);
  }
  
  /**
   * Get memory delta (increase/decrease)
   */
  getDelta() {
    if (this.samples.length < 2) return 0;
    const latest = this.samples[this.samples.length - 1];
    const previous = this.samples[this.samples.length - 2];
    return latest - previous;
  }
  
  /**
   * Reset monitor
   */
  reset() {
    this.samples = [];
  }
  
  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoryMonitor;
}
window.MemoryMonitor = MemoryMonitor;
