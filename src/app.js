/**
 * Main Application Logic - Updated with Sound Effects & Statistics
 */

const vectorRenderer = new VectorRenderer();
const domRenderer = new DomRenderer();
const figmaSimulator = new FigmaSimulator();
const benchmarkEngine = new BenchmarkEngine();
const exportEngine = new ExportEngine();

const chaosDOM = new ChaosMode();
const chaosVector = new ChaosMode();
const chaosHistory = new ChaosHistory();

const testProps = {
  title: 'Завантаження документів',
  description: 'Додайте необхідні документи для перевірки'
};

let currentScale = 1.0;
let cachedAIResults = null;
let chaosRunning = false;

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

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

elements.scaleSlider?.addEventListener('input', (e) => {
  currentScale = parseFloat(e.target.value);
  elements.scaleValue.textContent = `${currentScale.toFixed(1)}x`;
  window.soundEffects?.playClick();
});

let benchmarkResults = null;

elements.runBenchmark?.addEventListener('click', async () => {
  console.log('🚀 Starting comprehensive benchmark...');
  try {
    window.soundEffects?.playStart();
    elements.runBenchmark.textContent = '⏳ Running...';
    elements.runBenchmark.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 100));

    if (!benchmarkEngine || !vectorRenderer || !domRenderer || !figmaSimulator) {
      console.error('❌ Renderers not initialized');
      throw new Error('Renderers not ready');
    }

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
    updateTable();
    updateStatistics(vectorAI, domAI, figmaAI);

    cachedAIResults = { vectorAI, domAI, figmaAI };

    const vectorSize = benchmarkResults.vector.single.size || 1;
    const vectorTokens = vectorAI.estimatedTokens || 1;
    const sizeRatio = (benchmarkResults.dom.single.size / vectorSize).toFixed(1);
    const tokenRatio = (domAI.estimatedTokens / vectorTokens).toFixed(1);
    elements.efficiencyMultiplier.textContent = `${sizeRatio}x меншу вагу та ${tokenRatio}x менше токенів`;

    benchmarkEngine.generateReport();
    window.soundEffects?.playSuccess();

    elements.runBenchmark.textContent = '✅ Benchmark Complete';
    setTimeout(() => {
      elements.runBenchmark.textContent = '🚀 Запустити Benchmark';
      elements.runBenchmark.disabled = false;
    }, 2000);
  } catch (err) {
    console.error('❌ Benchmark error:', err);
    elements.runBenchmark.textContent = '❌ Error';
    elements.runBenchmark.disabled = false;
  }
});

function updateMetrics(vectorAI, domAI, figmaAI) {
  if (!benchmarkResults) return;

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

function updateTable() {
  if (!benchmarkResults || !cachedAIResults) return;

  const { vectorAI, domAI, figmaAI } = cachedAIResults;

  document.getElementById('table-vector-size').textContent = formatBytes(benchmarkResults.vector.single.size);
  document.getElementById('table-dom-size').textContent = formatBytes(benchmarkResults.dom.single.size);
  document.getElementById('table-figma-size').textContent = formatBytes(benchmarkResults.figma.single.size);

  document.getElementById('table-vector-tokens').textContent = vectorAI.estimatedTokens;
  document.getElementById('table-dom-tokens').textContent = domAI.estimatedTokens;
  document.getElementById('table-figma-tokens').textContent = figmaAI.estimatedTokens;

  document.getElementById('table-vector-render').textContent = `${benchmarkResults.vector.single.time.toFixed(2)} ms`;
  document.getElementById('table-dom-render').textContent = `${benchmarkResults.dom.single.time.toFixed(2)} ms`;
  document.getElementById('table-figma-render').textContent = `${benchmarkResults.figma.single.time.toFixed(2)} ms`;
}

function updateStatistics(vectorAI, domAI, figmaAI) {
  if (!benchmarkResults) return;

  const vectorSize = benchmarkResults.vector.single.size;
  const domSize = benchmarkResults.dom.single.size;
  const figmaSize = benchmarkResults.figma.single.size;

  const totalSavings = (domSize + figmaSize - vectorSize * 2);
  const renderSpeedup = (benchmarkResults.dom.single.time / benchmarkResults.vector.single.time).toFixed(1);
  const aiEfficiency = ((vectorAI.aiFriendlyScore - domAI.aiFriendlyScore) / domAI.aiFriendlyScore * 100).toFixed(0);
  const costSavings = ((domAI.estimatedTokens - vectorAI.estimatedTokens) * 0.015 / 1000).toFixed(2);

  const dataSavingsEl = document.getElementById('data-savings');
  const renderSpeedupEl = document.getElementById('render-speedup');
  const aiEfficiencyEl = document.getElementById('ai-efficiency');
  const costSavingsEl = document.getElementById('cost-savings');

  if (dataSavingsEl) dataSavingsEl.textContent = `${(totalSavings / 1024).toFixed(1)} KB`;
  if (renderSpeedupEl) renderSpeedupEl.textContent = `${renderSpeedup}x`;
  if (aiEfficiencyEl) aiEfficiencyEl.textContent = `+${aiEfficiency}%`;
  if (costSavingsEl) costSavingsEl.textContent = `$${costSavings}`;
}

elements.stressTest?.addEventListener('click', async () => {
  console.log('⚡ Running stress test...');
  try {
    window.soundEffects?.playStart();
    elements.stressTest.textContent = '⏳ Testing...';
    elements.stressTest.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 100));

    const stressResults = {
      vector: benchmarkEngine.stressTest((p) => vectorRenderer.render(p), 100, testProps),
      dom: benchmarkEngine.stressTest((p) => domRenderer.render(p), 100, testProps),
      figma: benchmarkEngine.stressTest((p) => figmaSimulator.render(p), 100, testProps)
    };

    window.soundEffects?.playSuccess();
    alert(`Stress Test Complete!\n\nVector: ${stressResults.vector.totalTime.toFixed(0)}ms\nDOM: ${stressResults.dom.totalTime.toFixed(0)}ms\n\nVector is ${(stressResults.dom.totalTime / stressResults.vector.totalTime).toFixed(1)}x faster!`);

    elements.stressTest.textContent = '⚡ Stress Test (100x)';
    elements.stressTest.disabled = false;
  } catch (err) {
    console.error('❌ Stress test error:', err);
    elements.stressTest.textContent = '❌ Error';
    elements.stressTest.disabled = false;
  }
});

elements.exportTest?.addEventListener('click', () => {
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
});

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

const chaosElements = {
  chaosButton: document.getElementById('chaos-mode'),
  stopButton: document.getElementById('stop-chaos'),
  arena: document.getElementById('chaos-arena'),
  domArena: document.getElementById('dom-arena'),
  vectorArena: document.getElementById('vector-arena'),
  domFPS: document.getElementById('dom-fps'),
  vectorFPS: document.getElementById('vector-fps')
};

chaosElements.chaosButton?.addEventListener('click', () => {
  if (chaosElements.arena) {
    chaosElements.arena.style.display = 'block';
    chaosElements.arena.scrollIntoView({ behavior: 'smooth' });
  }

  // Initialize orchestrator on first click
  if (!window.chaosOrchestrator) {
    window.chaosOrchestrator = new ChaosOrchestrator();
    console.log('✅ Enhanced Chaos Mode initialized - Sequential testing ready');
  }
});

chaosElements.stopButton?.addEventListener('click', () => {
  // Old stopChaosMode() call removed as part of chaos mode logic removal
});


const responsiveTestBtn = document.getElementById('responsive-test');
if (responsiveTestBtn) {
  responsiveTestBtn.addEventListener('click', async () => {
    window.soundEffects?.playStart();
    responsiveTestBtn.textContent = '⏳ Testing...';
    responsiveTestBtn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 100));

    const tester = new ResponsiveTester(vectorRenderer, domRenderer);
    const results = tester.testAllBreakpoints(testProps);
    const report = tester.generateReport(results);

    console.log(report);
    window.soundEffects?.playSuccess();
    alert(report);

    responsiveTestBtn.textContent = '📱 Responsive Test';
    responsiveTestBtn.disabled = false;
  });
}

const exportResultsBtn = document.getElementById('export-results');
if (exportResultsBtn) {
  exportResultsBtn.addEventListener('click', () => {
    window.soundEffects?.playClick();
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
      },
      figma: {
        size: document.getElementById('figma-size')?.textContent,
        time: document.getElementById('figma-time')?.textContent,
        aiScore: document.getElementById('figma-ai-score')?.textContent,
        tokens: document.getElementById('figma-tokens')?.textContent
      }
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

const guideBtn = document.createElement('button');
guideBtn.id = 'show-guide';
guideBtn.className = 'btn-secondary';
guideBtn.textContent = '📚 Migration Guide';
guideBtn.style.marginTop = '12px';
guideBtn.addEventListener('click', () => {
  window.soundEffects?.playClick();
  window.MigrationGuide?.showGuide();
});

const galleryBtn = document.createElement('button');
galleryBtn.id = 'show-gallery';
galleryBtn.className = 'btn-secondary';
galleryBtn.textContent = '📱 Device Comparison';
galleryBtn.style.marginTop = '12px';
galleryBtn.addEventListener('click', () => {
  window.soundEffects?.playClick();
  window.ScreenshotGallery?.showGallery();
});

const controlPanel = document.querySelector('.control-panel');
if (controlPanel) {
  const controlsGrid = controlPanel.querySelector('.controls-grid');
  if (controlsGrid) {
    controlsGrid.parentElement.insertBefore(guideBtn, controlsGrid.nextSibling);
    controlsGrid.parentElement.insertBefore(galleryBtn, guideBtn.nextSibling);
  }
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.style.colorScheme =
      document.documentElement.style.colorScheme === 'light' ? 'dark' : 'light';
    window.soundEffects?.playClick();
  });
}

window.addEventListener('load', () => {
  console.log('🎯 Vector Logic Manifesto initialized');
  console.log('💡 Click "Run Benchmark" to see the comparison');
  console.log('🌪️ Click "Start Chaos" for sequential performance test');
  window.soundEffects?.playComplete();
});
