/**
 * DOM Renderer - Traditional HTML/CSS Approach
 * 
 * Philosophy: "The way everyone does it (and why it's bloated)"
 * This class generates UI using verbose HTML markup and CSS classes,
 * demonstrating the payload overhead of traditional approaches.
 */

class DomRenderer {
  constructor() {
    this.verbose = true;
  }

  /**
   * Generate Diia Upload Screen using traditional DOM approach
   * @param {Object} props - Screen properties
   * @returns {string} HTML markup
   */
  render(props = {}, scale = 1) {
    return `
      <div class="diia-screen-container" style="transform: scale(${scale}); transform-origin: top left;">
        <div class="diia-card">
          <div class="title-section">
            <h2 class="title-text">${props.title || 'Завантаження документів'}</h2>
          </div>
          <div class="description-section">
            <p class="description-text">${props.description || 'Додайте необхідні документи'}</p>
          </div>
          <div class="upload-zone-wrapper">
            <label class="upload-zone">
              <div class="upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L12 16M12 4L8 8M12 4L16 8" stroke="#67C3F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="upload-text">Додати файл</span>
              <input type="file" class="file-input-hidden" multiple />
            </label>
          </div>
          <div class="button-wrapper">
            <button class="next-button">Далі</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get payload size in bytes
   * @param {Object} props - Screen properties
   * @returns {number} Size in bytes
   */
  getPayloadSize(props = {}) {
    const output = this.render(props);
    return new Blob([output]).size;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DomRenderer;
}
window.DomRenderer = DomRenderer;
