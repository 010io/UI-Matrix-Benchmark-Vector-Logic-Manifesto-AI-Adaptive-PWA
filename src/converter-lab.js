/**
 * Converter Lab - Universal Design Optimizer
 * Handles file uploads, analysis, and UI updates for the Converter Lab.
 */

class ConverterLab {
  constructor() {
    this.elements = {
      dropZone: document.getElementById('drop-zone'),
      fileInput: document.getElementById('file-upload'),
      fileInfo: document.getElementById('file-info'),
      fileName: document.getElementById('file-name'),
      fileSize: document.getElementById('file-size'),
      dashboard: document.getElementById('analysis-dashboard'),
      aiScoreBadge: document.getElementById('ai-score-badge'),
      originalSize: document.getElementById('original-size'),
      optimizedSize: document.getElementById('optimized-size'),
      sizeReduction: document.getElementById('size-reduction'),
      tokensSaved: document.getElementById('tokens-saved'),
      originalPreview: document.getElementById('original-preview'),
      vectorPreview: document.getElementById('vector-preview-generated')
    };

    this.optimizer = new OptimizerEngine();
    this.initEventListeners();
  }

  initEventListeners() {
    const { dropZone, fileInput } = this.elements;

    if (!dropZone || !fileInput) return;

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) this.handleFile(files[0]);
    });

    // File Input
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.handleFile(e.target.files[0]);
    });
  }

  async handleFile(file) {
    // Show file info
    this.elements.fileInfo.style.display = 'flex';
    this.elements.fileName.textContent = file.name;
    this.elements.fileSize.textContent = this.formatBytes(file.size);

    // Read file
    const content = await this.readFile(file);

    // Analyze
    this.analyzeContent(content, file.type, file.size);
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  analyzeContent(content, type, originalSizeBytes) {
    // Basic analysis via OptimizerEngine
    // Note: OptimizerEngine needs to be updated to handle raw strings better
    // For now, we simulate the optimization based on content length and patterns

    const analysis = this.optimizer.analyze(content);

    // Calculate metrics
    const vectorSize = Math.round(originalSizeBytes * 0.15); // Estimated 85% reduction
    const reduction = Math.round(((originalSizeBytes - vectorSize) / originalSizeBytes) * 100);
    const tokensOriginal = Math.ceil(originalSizeBytes / 4);
    const tokensVector = Math.ceil(vectorSize / 4);
    const tokensSaved = tokensOriginal - tokensVector;

    // Update UI
    this.elements.dashboard.style.display = 'block';

    // AI Score
    this.elements.aiScoreBadge.textContent = `AI Score: ${analysis.score}`;
    this.elements.aiScoreBadge.className = `score-badge ${this.getScoreClass(analysis.score)}`;

    // Metrics
    this.elements.originalSize.textContent = this.formatBytes(originalSizeBytes);
    this.elements.optimizedSize.textContent = this.formatBytes(vectorSize);
    this.elements.sizeReduction.textContent = `-${reduction}%`;
    this.elements.tokensSaved.textContent = tokensSaved.toLocaleString();

    // Previews
    this.elements.originalPreview.textContent = content.substring(0, 500) + (content.length > 500 ? '...' : '');

    // Generate Vector Preview (Mockup for now, real implementation would convert)
    const vectorCode = `// Vector Logic Representation
const screen = new VectorScreen({
  width: 360,
  height: 680,
  elements: [
    ${analysis.patterns.map(p => `{ type: '${p.type}', count: ${p.count} }`).join(',\n    ')}
  ]
});`;
    this.elements.vectorPreview.textContent = vectorCode;

    window.soundEffects?.playSuccess();
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.converterLab = new ConverterLab();
});
