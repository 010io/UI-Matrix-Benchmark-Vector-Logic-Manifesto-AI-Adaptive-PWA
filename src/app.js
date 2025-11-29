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
const chaosMode = new ChaosMode();
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
  
  // Re-render previews with new scale
  if (benchmarkResults) {
    updatePreviews();
  }
});

// Run benchmark
let benchmarkResults = null;

elements.runBenchmark?.addEventListener('click', async () => {
  console.log('🚀 Starting comprehensive benchmark...');
  
  // Show loading state
  elements.runBenchmark.textContent = '⏳ Running...';
  elements.runBenchmark.disabled = true;
  
  // Small delay for UI update
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Run benchmark
  benchmarkResults = benchmarkEngine.runBenchmark({
    vector: vectorRenderer,
    dom: domRenderer,
    figma: figmaSimulator
  }, testProps);
  
  // Run AI analysis
  const vectorOutput = vectorRenderer.render(testProps, currentScale);
  const domOutput = domRenderer.render(testProps, currentScale);
  const figmaOutput = figmaSimulator.render(testProps);
  
  const vectorAI = exportEngine.analyzeAIFriendliness(vectorOutput);
  const domAI = exportEngine.analyzeAIFriendliness(domOutput);
  const figmaAI = exportEngine.analyzeAIFriendliness(figmaOutput);
  
  // Update UI
  updateMetrics(vectorAI, domAI, figmaAI);
  updatePreviews();
  updateTable();
  
  // Calculate efficiency
  const sizeRatio = (benchmarkResults.dom.single.size / benchmarkResults.vector.single.size).toFixed(1);
  const tokenRatio = (domAI.estimatedTokens / vectorAI.estimatedTokens).toFixed(1);
  elements.efficiencyMultiplier.textContent = `${sizeRatio}x меншу вагу та ${tokenRatio}x менше токенів`;
  
  // Console report
  benchmarkEngine.generateReport();
  console.log('\n🤖 AI-Friendliness Analysis:');
  console.log('Vector:', vectorAI);
  console.log('DOM:', domAI);
  console.log('Figma:', figmaAI);
  
  // Reset button
  elements.runBenchmark.textContent = '✅ Benchmark Complete';
  setTimeout(() => {
    elements.runBenchmark.textContent = '🚀 Run Benchmark';
    elements.runBenchmark.disabled = false;
  }, 2000);
});

// Update metrics
function updateMetrics(vectorAI, domAI, figmaAI) {
  // Vector
  elements.vectorSize.textContent = formatBytes(benchmarkResults.vector.single.size);
  elements.vectorTime.textContent = `${benchmarkResults.vector.single.time.toFixed(2)} ms`;
  elements.vectorAIScore.textContent = `${vectorAI.aiFriendlyScore}/100`;
  elements.vectorTokens.textContent = `${vectorAI.estimatedTokens}`;
  
  // DOM
  elements.domSize.textContent = formatBytes(benchmarkResults.dom.single.size);
  elements.domTime.textContent = `${benchmarkResults.dom.single.time.toFixed(2)} ms`;
  elements.domAIScore.textContent = `${domAI.aiFriendlyScore}/100`;
  elements.domTokens.textContent = `${domAI.estimatedTokens}`;
  
  // Figma
  elements.figmaSize.textContent = formatBytes(benchmarkResults.figma.single.size);
  elements.figmaTime.textContent = `${benchmarkResults.figma.single.time.toFixed(2)} ms`;
  elements.figmaAIScore.textContent = `${figmaAI.aiFriendlyScore}/100`;
  elements.figmaTokens.textContent = `${figmaAI.estimatedTokens}`;
}

// Update previews
function updatePreviews() {
  // Vector preview (SVG)
  const vectorOutput = vectorRenderer.render(testProps, currentScale * 0.5); // Scale down for preview
  elements.vectorPreview.innerHTML = vectorOutput;
  
  // DOM preview
  const domOutput = domRenderer.render(testProps, currentScale * 0.5);
  elements.domPreview.innerHTML = domOutput;
  
  // Figma preview (show truncated JSON)
  const figmaOutput = figmaSimulator.render(testProps);
  const truncated = figmaOutput.substring(0, 200) + '\n  ...\n  (truncated)\n}';
  elements.figmaPreviewCode.textContent = truncated;
}

// Update comparison table
function updateTable() {
  const vectorSize = benchmarkResults.vector.single.size;
  const domSize = benchmarkResults.dom.single.size;
  const figmaSize = benchmarkResults.figma.single.size;
  
  document.getElementById('table-vector-size').textContent = formatBytes(vectorSize);
  document.getElementById('table-dom-size').textContent = formatBytes(domSize);
  document.getElementById('table-figma-size').textContent = formatBytes(figmaSize);
  
  const vectorOutput = vectorRenderer.render(testProps);
  const domOutput = domRenderer.render(testProps);
  const figmaOutput = figmaSimulator.render(testProps);
  
  const vectorAI = exportEngine.analyzeAIFriendliness(vectorOutput);
  const domAI = exportEngine.analyzeAIFriendliness(domOutput);
  const figmaAI = exportEngine.analyzeAIFriendliness(figmaOutput);
  
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
let chaosArenaVisible = false;

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
  
  // Show arena
  chaosElements.arena.style.display = 'block';
  chaosArenaVisible = true;
  
  // Scroll to arena
  chaosElements.arena.scrollIntoView({ behavior: 'smooth' });
  
  // Start after small delay
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
  domFPSMeter.reset();
  vectorFPSMeter.reset();
  memoryMonitor.reset();
  
  const arenaWidth = 800;
  const arenaHeight = 400;
  
  // Start DOM chaos (will lag)
  chaosMode.start('dom', chaosElements.domArena, arenaWidth, arenaHeight, () => {
    domFPSMeter.update();
    updateChaosMetrics('dom', domFPSMeter);
  });
  
  // Start Vector chaos (will stay smooth)
  chaosMode.start('vector', chaosElements.vectorArena, arenaWidth, arenaHeight, () => {
    vectorFPSMeter.update();
    updateChaosMetrics('vector', vectorFPSMeter);
  });
  
  console.log('⚡ CHAOS MODE ACTIVE - Watch the FPS difference!');
}

function stopChaosMode() {
  chaosRunning = false;
  chaosMode.stop();
  
  console.log('🛑 Chaos mode stopped');
  console.log('Final Stats:');
  console.log('  DOM FPS:', domFPSMeter.getFPS(), '(avg:', domFPSMeter.getAverageFPS() + ')');
  console.log('  Vector FPS:', vectorFPSMeter.getFPS(), '(avg:', vectorFPSMeter.getAverageFPS() + ')');
}

function updateChaosMetrics(type, fpsMeter) {
  const fps = fpsMeter.getFPS();
  const avgFPS = fpsMeter.getAverageFPS();
  const grade = fpsMeter.getGrade();
  
  if (type === 'dom') {
    chaosElements.domFPS.textContent = `FPS: ${fps}`;
    chaosElements.domFPS.style.backgroundColor = grade.color;
    chaosElements.domGrade.textContent = `${grade.grade} (${grade.label})`;
    chaosElements.domGrade.style.color = grade.color;
  } else {
    chaosElements.vectorFPS.textContent = `FPS: ${fps}`;
    chaosElements.vectorFPS.style.backgroundColor = grade.color;
    chaosElements.vectorGrade.textContent = `${grade.grade} (${grade.label})`;
    chaosElements.vectorGrade.style.color = grade.color;
  }
  
  // Update memory (if available)
  if (memoryMonitor.isAvailable()) {
    memoryMonitor.sample();
    const mem = memoryMonitor.getUsageMB();
    if (type === 'dom') {
      chaosElements.domMemory.textContent = `${mem.used} MB`;
    } else {
      chaosElements.vectorMemory.textContent = `${mem.used} MB`;
    }
  } else {
    chaosElements.domMemory.textContent = 'N/A';
    chaosElements.vectorMemory.textContent = 'N/A';
  }
}

// Auto-run benchmark on load
window.addEventListener('load', () => {
  console.log('🎯 Vector Logic Manifesto initialized');
  console.log('💡 Click "Run Benchmark" to see the comparison');
  console.log('🌪️ Click "Start Chaos" for the ultimate performance showdown');
});
