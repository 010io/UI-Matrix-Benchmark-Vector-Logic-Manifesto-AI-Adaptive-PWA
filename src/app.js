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
  setTimeout(() => startSequentialChaos(), 500);
});

chaosElements.stopButton?.addEventListener('click', () => {
  stopChaosMode();
});

async function startSequentialChaos() {
  if (chaosRunning) return;
  chaosRunning = true;

  try {
    const particleSlider = document.getElementById('particle-count');
    const count = particleSlider ? parseInt(particleSlider.value) : 2000;

    chaosElements.chaosButton.disabled = true;
    chaosElements.stopButton.disabled = false;

    window.soundEffects?.playStart();

    const diiaRenderer = new DiiaScreenRenderer();
    const results = {};

    // Test 1: DOM Rendering
    chaosElements.chaosButton.textContent = '📄 Testing DOM...';
    chaosElements.arena.innerHTML = `
      <div style="padding: 20px; background: #0a0e27; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="color: #67C3F3; margin-bottom: 10px;">📄 DOM Rendering</h3>
        <div id="dom-screen-preview" style="background: #1a1f3a; border-radius: 8px; padding: 10px; overflow-y: auto; max-height: 400px;"></div>
        <div style="margin-top: 10px; font-size: 12px; color: #a1a1aa;" id="dom-screen-metrics"></div>
      </div>
    `;
    
    const domStart = performance.now();
    const domHtml = diiaRenderer.renderDOM(1);
    document.getElementById('dom-screen-preview').innerHTML = domHtml;
    const domTime = performance.now() - domStart;
    const domSize = new Blob([domHtml]).size;
    document.getElementById('dom-screen-metrics').textContent = `⏱️ ${domTime.toFixed(2)}ms | 📦 ${(domSize / 1024).toFixed(2)}KB`;
    results.dom = { time: domTime, size: domSize };

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Vector Rendering
    chaosElements.chaosButton.textContent = '🎯 Testing Vector...';
    chaosElements.arena.innerHTML += `
      <div style="padding: 20px; background: #0a0e27; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="color: #67C3F3; margin-bottom: 10px;">🎯 Vector Rendering</h3>
        <div id="vector-screen-preview" style="background: #1a1f3a; border-radius: 8px; padding: 10px; overflow-y: auto; max-height: 400px;"></div>
        <div style="margin-top: 10px; font-size: 12px; color: #a1a1aa;" id="vector-screen-metrics"></div>
      </div>
    `;
    
    const vectorStart = performance.now();
    const vectorSvg = diiaRenderer.renderVector(1);
    document.getElementById('vector-screen-preview').innerHTML = vectorSvg;
    const vectorTime = performance.now() - vectorStart;
    const vectorSize = new Blob([vectorSvg]).size;
    document.getElementById('vector-screen-metrics').textContent = `⏱️ ${vectorTime.toFixed(2)}ms | 📦 ${(vectorSize / 1024).toFixed(2)}KB`;
    results.vector = { time: vectorTime, size: vectorSize };

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Figma Simulation
    chaosElements.chaosButton.textContent = '🎨 Testing Figma...';
    chaosElements.arena.innerHTML += `
      <div style="padding: 20px; background: #0a0e27; border-radius: 12px;">
        <h3 style="color: #67C3F3; margin-bottom: 10px;">🎨 Figma Export</h3>
        <div id="figma-screen-preview" style="background: #1a1f3a; border-radius: 8px; padding: 10px; overflow-y: auto; max-height: 400px; font-family: monospace; font-size: 11px; color: #67C3F3;"></div>
        <div style="margin-top: 10px; font-size: 12px; color: #a1a1aa;" id="figma-screen-metrics"></div>
      </div>
    `;
    
    const figmaStart = performance.now();
    const figmaJson = diiaRenderer.renderFigma(1);
    document.getElementById('figma-screen-preview').textContent = figmaJson.substring(0, 500) + '...';
    const figmaTime = performance.now() - figmaStart;
    const figmaSize = new Blob([figmaJson]).size;
    document.getElementById('figma-screen-metrics').textContent = `⏱️ ${figmaTime.toFixed(2)}ms | 📦 ${(figmaSize / 1024).toFixed(2)}KB`;
    results.figma = { time: figmaTime, size: figmaSize };

    await new Promise(resolve => setTimeout(resolve, 1000));

    window.soundEffects?.playSuccess();
    const speedup = (results.dom.time / results.vector.time).toFixed(1);
    const sizeReduction = ((results.dom.size - results.vector.size) / results.dom.size * 100).toFixed(0);
    
    alert(`📊 DIIA SCREEN RENDERING TEST\n\n📄 DOM: ${results.dom.time.toFixed(2)}ms (${(results.dom.size / 1024).toFixed(2)}KB)\n🎯 Vector: ${results.vector.time.toFixed(2)}ms (${(results.vector.size / 1024).toFixed(2)}KB)\n🎨 Figma: ${results.figma.time.toFixed(2)}ms (${(results.figma.size / 1024).toFixed(2)}KB)\n\n⚡ Vector is ${speedup}x faster and ${sizeReduction}% smaller!`);

    chaosElements.chaosButton.textContent = '🌪️ Chaos Mode (Diia Screens)';
    chaosElements.chaosButton.disabled = false;
    chaosElements.stopButton.disabled = true;
    chaosRunning = false;
  } catch (err) {
    console.error('❌ Chaos mode error:', err);
    chaosRunning = false;
    chaosElements.chaosButton.disabled = false;
    chaosElements.stopButton.disabled = true;
  }
}

function stopChaosMode() {
  chaosRunning = false;
  chaosDOM.stop();
  chaosVector.stop();

  chaosElements.chaosButton.disabled = false;
  chaosElements.stopButton.disabled = true;
  chaosElements.chaosButton.textContent = '🌪️ Chaos Mode (10K Particles)';

  console.log('🛑 Chaos mode stopped');
}

// Responsive Test
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

// Export Results
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

// Migration Guide & Screenshot Gallery
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
