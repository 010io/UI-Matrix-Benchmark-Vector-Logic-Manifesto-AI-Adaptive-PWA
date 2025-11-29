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
    this.styleInjected = false;
  }
  
  injectStyles() {
    if (this.styleInjected) return;
    const style = document.createElement('style');
    style.textContent = `
      .diia-screen-container { width: 360px; height: 680px; background: #E2ECF4; position: relative; font-family: 'e-Ukraine', Arial, sans-serif; }
      .diia-card { position: absolute; top: 16px; left: 8px; right: 8px; bottom: 16px; background: white; border-radius: 24px; padding: 32px 16px 16px 16px; display: flex; flex-direction: column; gap: 0; }
      .title-text { font-size: 18px; font-weight: bold; color: #111827; margin: 0; padding: 0; line-height: 1.4; }
      .description-text { font-size: 14px; color: #374151; margin: 0; padding: 0; line-height: 1.4; }
      .upload-zone { width: 100%; min-height: 120px; background: #F5F8FA; border: 2px dashed #D1D5DB; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; position: relative; padding: 16px; }
      .next-button { width: 100%; height: 56px; background: #000000; color: #FFFFFF; border: none; border-radius: 16px; font-size: 18px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; font-family: 'e-Ukraine', Arial, sans-serif; }
      .next-button:hover { opacity: 0.9; }
    `;
    document.head.appendChild(style);
    this.styleInjected = true;
  }
  
  /**
   * Generate Diia Upload Screen using traditional DOM approach
   * @param {Object} props - Screen properties
   * @returns {string} HTML markup
   */
  render(props = {}, scale = 1) {
    this.injectStyles();
    
    return `
      <div class="diia-screen-container" style="transform: scale(${scale}); transform-origin: top left;">
        <div class="diia-card">
          <div class="title-section" style="margin-bottom: 8px;">
            <h2 class="title-text">${props.title || 'Завантаження документів'}</h2>
          </div>
          <div class="description-section" style="margin-bottom: 24px;">
            <p class="description-text">${props.description || 'Додайте необхідні документи'}</p>
          </div>
          <div class="upload-zone-wrapper" style="margin-bottom: 32px; flex: 1; display: flex; align-items: flex-start;">
            <label class="upload-zone">
              <div class="upload-icon" style="width: 24px; height: 24px; margin-bottom: 8px; position: relative;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L12 16M12 4L8 8M12 4L16 8" stroke="#67C3F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="upload-text" style="font-size: 16px; color: #6B7280; text-align: center;">Додати файл</span>
              <input type="file" class="file-input-hidden" style="display: none; position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer;" multiple />
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
