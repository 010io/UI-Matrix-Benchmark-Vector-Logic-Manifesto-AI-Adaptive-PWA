/**
 * Main Application Logic
 * Orchestrates benchmark execution and UI updates
 */

// Initialize renderers
const vectorRenderer = new VectorRenderer();
const domRenderer = new DomRenderer();
const figmaSimulator = new FigmaSimulator();
const benchmarkEngine = new BenchmarkEngine();
const exportEngine = new ExportEngine();

// Initialize stress-test utilities
const chaosDOM = new ChaosMode();
const chaosVector = new ChaosMode();
const domFPSMeter = new FPSMeter();
const vectorFPSMeter = new FPSMeter();
const memoryMonitor = new MemoryMonitor();
const llmCalculator = new LLMCostCalculator();

// Screen props for testing
const testProps = {
  title: 'Завантаження документів',
  description: 'Додайте необхідні документи для перевірки'
};

// Current scale
let currentScale = 1.0;

// Cache for AI results
let cachedAIResults = null;

// DOM elements
const elements = {
  vectorSize: document.getElementById('vector-size'),
  vectorTime: document.getElementById('vector-time'),
  vectorAIScore: document.getElementById('vector-ai-score'),
  vectorTokens: document.getElementById('vector-tokens'),
  vectorPreview: document.getElementById('vector-preview'),

  domSize: document.getElementById('dom-size'),
  domTime: document.getElementById('dom-time'),
  domAIScore: document.getElementById('dom-ai-score'),
  domTokens: document.getElementById('dom-tokens'),
  domPreview: document.getElementById('dom-preview'),

  figmaSize: document.getElementById('figma-size'),
  figmaTime: document.getElementById('figma-time'),
  figmaAIScore: document.getElementById('figma-ai-score'),
  figmaTokens: document.getElementById('figma-tokens'),
  figmaPreviewCode: document.getElementById('figma-preview-code'),

  scaleSlider: document.getElementById('scale-slider'),
  scaleValue: document.getElementById('scale-value'),

  runBenchmark: document.getElementById('run-benchmark'),
  stressTest: document.getElementById('stress-test'),
  exportTest: document.getElementById('export-test'),

  exportSection: document.getElementById('export-section'),
  efficiencyMultiplier: document.getElementById('efficiency-multiplier')
};

// Format bytes helper
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Update scale
elements.scaleSlider?.addEventListener('input', (e) => {
  currentScale = parseFloat(e.target.value);
  elements.scaleValue.textContent = `${currentScale.toFixed(1)}x`;

  if (benchmarkResults) {
    updatePreviews();
  }
});

// Run benchmark
let benchmarkResults = null;

elements.runBenchmark?.addEventListener('click', async () => {
  console.log('🚀 Starting comprehensive benchmark...');

  elements.runBenchmark.textContent = '⏳ Running...';
  elements.runBenchmark.disabled = true;

  await new Promise(resolve => setTimeout(resolve, 100));

  benchmarkResults = benchmarkEngine.runBenchmark({
    vector: vectorRenderer,
    dom: domRenderer,
    figma: figmaSimulator
  }, testProps);

  const vectorOutput = vectorRenderer.render(testProps, currentScale);
  const domOutput = domRenderer.render(testProps, currentScale);
  const figmaOutput = figmaSimulator.render(testProps);

  const vectorAI = exportEngine.analyzeAIFriendliness(vectorOutput);
  const domAI = exportEngine.analyzeAIFriendliness(domOutput);
  const figmaAI = exportEngine.analyzeAIFriendliness(figmaOutput);

  updateMetrics(vectorAI, domAI, figmaAI);
  updatePreviews();
  updateTable();

  cachedAIResults = { vectorAI, domAI, figmaAI };

  const vectorSize = benchmarkResults.vector.single.size || 1;
  const vectorTokens = vectorAI.estimatedTokens || 1;
  const sizeRatio = (benchmarkResults.dom.single.size / vectorSize).toFixed(1);
  const tokenRatio = (domAI.estimatedTokens / vectorTokens).toFixed(1);
  elements.efficiencyMultiplier.textContent = `${sizeRatio}x меншу вагу та ${tokenRatio}x менше токенів`;

  benchmarkEngine.generateReport();
  console.log('\n🤖 AI-Friendliness Analysis:');
  console.log('Vector:', vectorAI);
  console.log('DOM:', domAI);
  console.log('Figma:', figmaAI);

  elements.runBenchmark.textContent = '✅ Benchmark Complete';
  setTimeout(() => {
    elements.runBenchmark.textContent = '🚀 Run Benchmark';
    elements.runBenchmark.disabled = false;
  }, 2000);
});

// Update metrics
function updateMetrics(vectorAI, domAI, figmaAI) {
  if (!benchmarkResults) {
    console.error('Benchmark results not available');
    return;
  }

  elements.vectorSize.textContent = formatBytes(benchmarkResults.vector.single.size);
  elements.vectorTime.textContent = `${benchmarkResults.vector.single.time.toFixed(2)} ms`;
  elements.vectorAIScore.textContent = `${vectorAI.aiFriendlyScore}/100`;
  elements.vectorTokens.textContent = `${vectorAI.estimatedTokens}`;

  elements.domSize.textContent = formatBytes(benchmarkResults.dom.single.size);
  elements.domTime.textContent = `${benchmarkResults.dom.single.time.toFixed(2)} ms`;
  elements.domAIScore.textContent = `${domAI.aiFriendlyScore}/100`;
  elements.domTokens.textContent = `${domAI.estimatedTokens}`;

  elements.figmaSize.textContent = formatBytes(benchmarkResults.figma.single.size);
  elements.figmaTime.textContent = `${benchmarkResults.figma.single.time.toFixed(2)} ms`;
  elements.figmaAIScore.textContent = `${figmaAI.aiFriendlyScore}/100`;
  elements.figmaTokens.textContent = `${figmaAI.estimatedTokens}`;
}

// Update previews
function updatePreviews() {
  const vectorOutput = vectorRenderer.render(testProps, currentScale * 0.5);
  elements.vectorPreview.innerHTML = vectorOutput;

  const domOutput = domRenderer.render(testProps, currentScale * 0.5);
  elements.domPreview.innerHTML = domOutput;

  const figmaOutput = figmaSimulator.render(testProps);
  const truncated = figmaOutput.substring(0, 200) + '\n  ...\n  (truncated)\n}';
  elements.figmaPreviewCode.textContent = truncated;
}

// Update comparison table
function updateTable() {
  if (!benchmarkResults || !cachedAIResults) return;

  const { vectorAI, domAI, figmaAI } = cachedAIResults;

  document.getElementById('table-vector-size').textContent = formatBytes(benchmarkResults.vector.single.size);
  document.getElementById('table-dom-size').textContent = formatBytes(benchmarkResults.dom.single.size);
  document.getElementById('table-figma-size').textContent = formatBytes(benchmarkResults.figma.single.size);

  document.getElementById('table-vector-tokens').textContent = vectorAI.estimatedTokens;
  document.getElementById('table-dom-tokens').textContent = domAI.estimatedTokens;
  document.getElementById('table-figma-tokens').textContent = figmaAI.estimatedTokens;
}

// Stress test
elements.stressTest?.addEventListener('click', async () => {
  console.log('⚡ Running stress test...');
  elements.stressTest.textContent = '⏳ Testing...';
  elements.stressTest.disabled = true;

  await new Promise(resolve => setTimeout(resolve, 100));

  const stressResults = {
    vector: benchmarkEngine.stressTest((p) => vectorRenderer.render(p), 100, testProps),
    dom: benchmarkEngine.stressTest((p) => domRenderer.render(p), 100, testProps),
    figma: benchmarkEngine.stressTest((p) => figmaSimulator.render(p), 100, testProps)
  };

  console.log('\n⚡ STRESS TEST RESULTS (100 iterations):');
  console.log('Vector:', `${stressResults.vector.totalTime.toFixed(2)}ms total`, `${stressResults.vector.avgTime.toFixed(2)}ms avg`);
  console.log('DOM:', `${stressResults.dom.totalTime.toFixed(2)}ms total`, `${stressResults.dom.avgTime.toFixed(2)}ms avg`);
  console.log('Figma:', `${stressResults.figma.totalTime.toFixed(2)}ms total`, `${stressResults.figma.avgTime.toFixed(2)}ms avg`);

  alert(`Stress Test Complete!\n\nVector: ${stressResults.vector.totalTime.toFixed(0)}ms\nDOM: ${stressResults.dom.totalTime.toFixed(0)}ms\n\nVector is ${(stressResults.dom.totalTime / stressResults.vector.totalTime).toFixed(1)}x faster!`);

  elements.stressTest.textContent = '⚡ Stress Test (100x)';
  elements.stressTest.disabled = false;
});

// Export test
elements.exportTest?.addEventListener('click', () => {
  console.log('📦 Testing export capabilities...');

  const rnCode = exportEngine.toReactNative(testProps);
  const swiftCode = exportEngine.toSwiftUI(testProps);
  const pdfCode = exportEngine.toPDFInstructions(testProps);

  const rnSize = new Blob([rnCode]).size;
  const swiftSize = new Blob([swiftCode]).size;
  const pdfSize = new Blob([pdfCode]).size;

  document.getElementById('export-rn-size').textContent = formatBytes(rnSize);
  document.getElementById('export-swift-size').textContent = formatBytes(swiftSize);
  document.getElementById('export-pdf-size').textContent = formatBytes(pdfSize);

  elements.exportSection.style.display = 'block';

  console.log('📦 Export sizes:', { rnSize, swiftSize, pdfSize });
});

// Download export
function downloadExport(format) {
  let content, filename, mimeType;

  switch (format) {
    case 'reactnative':
      content = exportEngine.toReactNative(testProps);
      filename = 'DiiaUploadScreen.tsx';
      mimeType = 'text/typescript';
      break;
    case 'swiftui':
      content = exportEngine.toSwiftUI(testProps);
      filename = 'DiiaUploadScreen.swift';
      mimeType = 'text/swift';
      break;
    case 'pdf':
      content = exportEngine.toPDFInstructions(testProps);
      filename = 'diia-screen.ps';
      mimeType = 'application/postscript';
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Chaos mode handlers
let chaosRunning = false;

const chaosElements = {
  chaosButton: document.getElementById('chaos-mode'),
  stopButton: document.getElementById('stop-chaos'),
  arena: document.getElementById('chaos-arena'),
  domArena: document.getElementById('dom-arena'),
  vectorArena: document.getElementById('vector-arena'),
  domFPS: document.getElementById('dom-fps'),
  vectorFPS: document.getElementById('vector-fps'),
  domMemory: document.getElementById('dom-memory'),
  vectorMemory: document.getElementById('vector-memory'),
  domGrade: document.getElementById('dom-grade'),
  vectorGrade: document.getElementById('vector-grade')
};

chaosElements.chaosButton?.addEventListener('click', () => {
  console.log('🌪️ Starting CHAOS MODE...');

  if (chaosElements.arena) {
    chaosElements.arena.style.display = 'block';
    chaosElements.arena.scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => {
    startChaosMode();
  }, 500);
});

chaosElements.stopButton?.addEventListener('click', () => {
  stopChaosMode();
});

function startChaosMode() {
  if (chaosRunning) return;

  chaosRunning = true;

  if (chaosElements.chaosButton) chaosElements.chaosButton.disabled = true;
  if (chaosElements.stopButton) chaosElements.stopButton.disabled = false;

  const particleSlider = document.getElementById('particle-count');
  const particleValue = document.getElementById('particle-value');
  let count = 2000;

  if (particleSlider) {
    count = parseInt(particleSlider.value);

    particleSlider.addEventListener('input', (e) => {
      const newCount = parseInt(e.target.value);
      if (particleValue) particleValue.textContent = newCount;
      if (chaosElements.chaosButton) {
        chaosElements.chaosButton.textContent = `🌪️ Start Chaos (${(newCount / 1000).toFixed(1)}K Particles)`;
      }
    });
  }

  chaosDOM.init('dom-arena', 'dom', count);
  chaosVector.init('vector-arena', 'vector', count);

  chaosDOM.start();
  chaosVector.start();

  console.log('⚡ CHAOS MODE ACTIVE');
  console.log('  DOM: Individual <div> elements (heavy rendering)');
  console.log('  Vector: Single <svg> (optimized)');
}

function stopChaosMode() {
  chaosRunning = false;
  chaosDOM.stop();
  chaosVector.stop();

  if (chaosElements.chaosButton) chaosElements.chaosButton.disabled = false;
  if (chaosElements.stopButton) chaosElements.stopButton.disabled = true;

  console.log('🛑 Chaos mode stopped');
  console.log(`Vector FPS: ${chaosVector.fpsMeter?.getFPS() || 'N/A'}`);
  console.log(`DOM FPS: ${chaosDOM.fpsMeter?.getFPS() || 'N/A'}`);
}

// Auto-run benchmark on load
window.addEventListener('load', () => {
  console.log('🎯 Vector Logic Manifesto initialized');
  console.log('💡 Click "Run Benchmark" to see the comparison');
  console.log('🌪️ Click "Start Chaos" for the ultimate performance showdown');
});
