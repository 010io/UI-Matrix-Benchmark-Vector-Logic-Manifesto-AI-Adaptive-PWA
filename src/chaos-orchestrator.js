/**
 * Chaos Orchestrator - Sequential Test Runner
 * 
 * Manages the execution of performance benchmarks, ensuring tests run
 * one at a time for accurate FPS measurements and fair comparison.
 * 
 * Flow: Settings → DOM Test → Vector Test → Comparison → History
 */

class ChaosOrchestrator {
    constructor() {
        this.chaosDOM = new ChaosMode();
        this.chaosVector = new ChaosMode();
        this.history = new ChaosHistory();

        // Test state
        this.isRunning = false;
        this.currentTest = null;
        this.testResults = {
            dom: null,
            vector: null
        };

        // Default settings
        this.settings = {
            particleCount: 500,      // Default: 500 (min)
            speed: 1.0,              // Speed multiplier
            particleSize: 4,         // Pixel size
            colorScheme: 'diia',     // 'diia', 'rainbow', 'monochrome'
            enable3D: false,         // 3D effect toggle
            testDuration: 5          // Seconds per test
        };

        // FPS tracking
        this.fpsRecorder = {
            dom: [],
            vector: []
        };

        this.initElements();
    }

    initElements() {
        this.elements = {
            // Test panels
            testPanel: document.getElementById('sequential-test-panel'),
            currentTestName: document.getElementById('current-test-name'),
            currentFPS: document.getElementById('current-fps'),
            progressBar: document.getElementById('test-progress'),

            // Settings
            particleCountInput: document.getElementById('particle-count-input'),
            particleCountValue: document.getElementById('particle-count-value'),
            speedInput: document.getElementById('speed-input'),
            speedValue: document.getElementById('speed-value'),
            sizeInput: document.getElementById('size-input'),
            colorSchemeSelect: document.getElementById('color-scheme'),
            enable3DCheckbox: document.getElementById('enable-3d'),

            // Controls
            startButton: document.getElementById('start-sequential-test'),
            stopButton: document.getElementById('stop-sequential-test'),

            // Results
            comparisonPanel: document.getElementById('comparison-panel'),
            domAvgFPS: document.getElementById('dom-avg-fps'),
            vectorAvgFPS: document.getElementById('vector-avg-fps'),
            speedupValue: document.getElementById('speedup-value'),

            // History
            historyList: document.getElementById('history-list'),
            clearHistoryButton: document.getElementById('clear-history')
        };

        this.attachEventListeners();
        this.loadSettings();
        this.renderHistory();
    }

    attachEventListeners() {
        // Settings changes → auto-restart
        if (this.elements.particleCountInput) {
            this.elements.particleCountInput.addEventListener('input', (e) => {
                this.settings.particleCount = parseInt(e.target.value);
                this.elements.particleCountValue.textContent = this.settings.particleCount;
                this.saveSettings();
                if (this.isRunning) this.restartTest();
            });
        }

        if (this.elements.speedInput) {
            this.elements.speedInput.addEventListener('input', (e) => {
                this.settings.speed = parseFloat(e.target.value);
                this.elements.speedValue.textContent = this.settings.speed + 'x';
                this.saveSettings();
                if (this.isRunning) this.restartTest();
            });
        }

        if (this.elements.sizeInput) {
            this.elements.sizeInput.addEventListener('change', (e) => {
                this.settings.particleSize = parseInt(e.target.value);
                this.saveSettings();
                if (this.isRunning) this.restartTest();
            });
        }

        if (this.elements.colorSchemeSelect) {
            this.elements.colorSchemeSelect.addEventListener('change', (e) => {
                this.settings.colorScheme = e.target.value;
                this.saveSettings();
                if (this.isRunning) this.restartTest();
            });
        }

        if (this.elements.enable3DCheckbox) {
            this.elements.enable3DCheckbox.addEventListener('change', (e) => {
                this.settings.enable3D = e.target.checked;
                this.saveSettings();
                if (this.isRunning) this.restartTest();
            });
        }

        // Test controls
        if (this.elements.startButton) {
            this.elements.startButton.addEventListener('click', () => this.startSequentialTest());
        }

        if (this.elements.stopButton) {
            this.elements.stopButton.addEventListener('click', () => this.stopTest());
        }

        if (this.elements.clearHistoryButton) {
            this.elements.clearHistoryButton.addEventListener('click', () => {
                this.history.clear();
                this.renderHistory();
            });
        }
    }

    saveSettings() {
        localStorage.setItem('chaosSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('chaosSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }

        // Update UI
        if (this.elements.particleCountInput) {
            this.elements.particleCountInput.value = this.settings.particleCount;
            this.elements.particleCountValue.textContent = this.settings.particleCount;
        }
        if (this.elements.speedInput) {
            this.elements.speedInput.value = this.settings.speed;
            this.elements.speedValue.textContent = this.settings.speed + 'x';
        }
        if (this.elements.sizeInput) {
            this.elements.sizeInput.value = this.settings.particleSize;
        }
        if (this.elements.colorSchemeSelect) {
            this.elements.colorSchemeSelect.value = this.settings.colorScheme;
        }
        if (this.elements.enable3DCheckbox) {
            this.elements.enable3DCheckbox.checked = this.settings.enable3D;
        }
    }

    async startSequentialTest() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.fpsRecorder = { dom: [], vector: [] };
        this.testResults = { dom: null, vector: null };

        // Update UI
        this.elements.startButton.disabled = true;
        this.elements.stopButton.disabled = false;
        this.elements.comparisonPanel.style.display = 'none';

        // Run tests sequentially
        await this.runDOMTest();
        await this.delay(1000); // Pause between tests
        await this.runVectorTest();

        // Compare results
        this.showComparison();

        // Reset UI
        this.isRunning = false;
        this.elements.startButton.disabled = false;
        this.elements.stopButton.disabled = true;

        // Save to history
        this.saveToHistory();
        this.renderHistory();
    }

    async runDOMTest() {
        return new Promise((resolve) => {
            this.currentTest = 'dom';
            this.elements.currentTestName.textContent = '📄 Testing DOM...';
            this.elements.testPanel.style.display = 'block';

            // Initialize DOM chaos
            this.chaosDOM.init('sequential-test-canvas', 'dom', this.settings.particleCount);
            this.applySettings(this.chaosDOM);
            this.chaosDOM.start();

            // Record FPS for N seconds
            const startTime = Date.now();
            const duration = this.settings.testDuration * 1000;

            const recorder = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = (elapsed / duration) * 100;

                this.elements.progressBar.style.width = progress + '%';

                const fps = this.chaosDOM.fpsMeter ? this.chaosDOM.fpsMeter.getFPS() : 0;
                this.fpsRecorder.dom.push(fps);
                this.elements.currentFPS.textContent = `FPS: ${fps}`;

                if (elapsed >= duration) {
                    clearInterval(recorder);
                    this.chaosDOM.stop();

                    // Calculate average
                    const avgFPS = this.calculateAverage(this.fpsRecorder.dom);
                    this.testResults.dom = { avgFPS, fpsData: this.fpsRecorder.dom };

                    resolve();
                }
            }, 100); // Sample every 100ms
        });
    }

    async runVectorTest() {
        return new Promise((resolve) => {
            this.currentTest = 'vector';
            this.elements.currentTestName.textContent = '🎯 Testing Vector...';
            this.elements.progressBar.style.width = '0%';

            // Clear DOM canvas
            document.getElementById('sequential-test-canvas').innerHTML = '';

            // Initialize Vector chaos
            this.chaosVector.init('sequential-test-canvas', 'vector', this.settings.particleCount);
            this.applySettings(this.chaosVector);
            this.chaosVector.start();

            // Record FPS
            const startTime = Date.now();
            const duration = this.settings.testDuration * 1000;

            const recorder = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = (elapsed / duration) * 100;

                this.elements.progressBar.style.width = progress + '%';

                const fps = this.chaosVector.fpsMeter ? this.chaosVector.fpsMeter.getFPS() : 0;
                this.fpsRecorder.vector.push(fps);
                this.elements.currentFPS.textContent = `FPS: ${fps}`;

                if (elapsed >= duration) {
                    clearInterval(recorder);
                    this.chaosVector.stop();

                    // Calculate average
                    const avgFPS = this.calculateAverage(this.fpsRecorder.vector);
                    this.testResults.vector = { avgFPS, fpsData: this.fpsRecorder.vector };

                    this.elements.testPanel.style.display = 'none';
                    resolve();
                }
            }, 100);
        });
    }

    applySettings(chaosInstance) {
        // Apply speed multiplier
        chaosInstance.particles.forEach(p => {
            p.vx *= this.settings.speed;
            p.vy *= this.settings.speed;
        });

        // Apply color scheme
        const colors = this.getColorScheme();
        chaosInstance.particles.forEach((p, i) => {
            p.color = colors[i % colors.length];
        });

        // Apply size (placeholder - requires ChaosMode update)
        chaosInstance.particleSize = this.settings.particleSize;

        // Apply 3D effect (placeholder)
        chaosInstance.enable3D = this.settings.enable3D;
    }

    getColorScheme() {
        switch (this.settings.colorScheme) {
            case 'diia':
                return ['#67C3F3', '#000000'];
            case 'rainbow':
                return ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
            case 'monochrome':
                return ['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333'];
            default:
                return ['#67C3F3', '#000000'];
        }
    }

    showComparison() {
        this.elements.comparisonPanel.style.display = 'block';

        const domFPS = this.testResults.dom.avgFPS;
        const vectorFPS = this.testResults.vector.avgFPS;
        const speedup = (vectorFPS / domFPS).toFixed(2);

        this.elements.domAvgFPS.textContent = domFPS.toFixed(1);
        this.elements.vectorAvgFPS.textContent = vectorFPS.toFixed(1);
        this.elements.speedupValue.textContent = speedup + 'x';

        // Visual indicator
        if (speedup > 1.5) {
            this.elements.speedupValue.className = 'speedup-value success';
        } else if (speedup > 1.0) {
            this.elements.speedupValue.className = 'speedup-value warning';
        } else {
            this.elements.speedupValue.className = 'speedup-value neutral';
        }
    }

    saveToHistory() {
        const testRun = {
            timestamp: Date.now(),
            settings: { ...this.settings },
            results: {
                dom: this.testResults.dom,
                vector: this.testResults.vector
            }
        };

        // Store in enhanced history
        const runs = JSON.parse(sessionStorage.getItem('chaosTestRuns') || '[]');
        runs.push(testRun);
        sessionStorage.setItem('chaosTestRuns', JSON.stringify(runs));
    }

    renderHistory() {
        if (!this.elements.historyList) return;

        const runs = JSON.parse(sessionStorage.getItem('chaosTestRuns') || '[]');

        if (runs.length === 0) {
            this.elements.historyList.innerHTML = '<div class="empty-history">No tests yet</div>';
            return;
        }

        this.elements.historyList.innerHTML = runs.reverse().map((run, index) => `
      <div class="history-item" data-index="${index}">
        <div class="history-header">
          <span class="history-time">${new Date(run.timestamp).toLocaleTimeString()}</span>
          <span class="history-particles">${run.settings.particleCount} particles</span>
        </div>
        <div class="history-results">
          <span>DOM: ${run.results.dom.avgFPS.toFixed(1)} FPS</span>
          <span>Vector: ${run.results.vector.avgFPS.toFixed(1)} FPS</span>
          <span class="speedup">${(run.results.vector.avgFPS / run.results.dom.avgFPS).toFixed(2)}x</span>
        </div>
        <button class="replay-btn" onclick="window.chaosOrchestrator.replayTest(${runs.length - 1 - index})">🔄 Replay</button>
      </div>
    `).join('');
    }

    replayTest(index) {
        const runs = JSON.parse(sessionStorage.getItem('chaosTestRuns') || '[]');
        const run = runs[index];

        if (!run) return;

        // Show replay UI (placeholder)
        alert(`Replay Test from ${new Date(run.timestamp).toLocaleString()}\\n\\nDOM: ${run.results.dom.avgFPS.toFixed(1)} FPS\\nVector: ${run.results.vector.avgFPS.toFixed(1)} FPS\\n\\nSpeedup: ${(run.results.vector.avgFPS / run.results.dom.avgFPS).toFixed(2)}x`);
    }

    stopTest() {
        this.chaosDOM.stop();
        this.chaosVector.stop();
        this.isRunning = false;
        this.elements.startButton.disabled = false;
        this.elements.stopButton.disabled = true;
        this.elements.testPanel.style.display = 'none';
    }

    restartTest() {
        if (this.isRunning) {
            this.stopTest();
            setTimeout(() => this.startSequentialTest(), 500);
        }
    }

    calculateAverage(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize globally
window.ChaosOrchestrator = ChaosOrchestrator;
