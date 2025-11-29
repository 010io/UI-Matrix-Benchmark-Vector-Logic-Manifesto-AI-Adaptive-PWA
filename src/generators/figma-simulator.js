/**
 * Figma Simulator - Static Asset Approach
 * 
 * Philosophy: "What happens when you export from design tools"
 * This simulates the bloat of static exports (large JSON or base64 images)
 */

class FigmaSimulator {
  constructor() {
    // Simulate a large design export
    this.exportFormat = 'json'; // or 'base64'
  }
  
  /**
   * Generate a mock Figma export (intentionally bloated)
   * @param {Object} props - Screen properties
   * @returns {string} Mock export data
   */
  render(props = {}) {
    // Simulate Figma's verbose JSON structure
    const mockExport = {
      version: "1.0",
      metadata: {
        tool: "Figma",
        exportDate: new Date().toISOString(),
        artboardName: props.title || 'Upload Screen',
        width: 360,
        height: 680,
      },
      layers: [
        {
          id: "layer_1",
          type: "FRAME",
          name: "Screen Container",
          x: 0,
          y: 0,
          width: 360,
          height: 680,
          fills: [{ type: "SOLID", color: { r: 0.886, g: 0.925, b: 0.957 } }],
          children: [
            {
              id: "layer_2",
              type: "RECTANGLE",
              name: "Card Background",
              x: 8,
              y: 16,
              width: 344,
              height: 648,
              fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }],
              cornerRadius: 24,
              children: [
                {
                  id: "layer_3",
                  type: "TEXT",
                  name: "Title",
                  x: 24,
                  y: 48,
                  width: 296,
                  height: 24,
                  characters: props.title || 'Завантаження документів',
                  style: {
                    fontFamily: "e-Ukraine",
                    fontWeight: 700,
                    fontSize: 18,
                    textAlignHorizontal: "LEFT",
                    textAlignVertical: "TOP",
                    letterSpacing: 0,
                    lineHeight: { value: 140, unit: "PERCENT" },
                    fills: [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }]
                  }
                },
                {
                  id: "layer_4",
                  type: "TEXT",
                  name: "Description",
                  x: 24,
                  y: 80,
                  width: 296,
                  height: 20,
                  characters: props.description || 'Додайте необхідні документи',
                  style: {
                    fontFamily: "e-Ukraine",
                    fontWeight: 400,
                    fontSize: 14,
                    textAlignHorizontal: "LEFT",
                    textAlignVertical: "TOP",
                    letterSpacing: 0,
                    lineHeight: { value: 140, unit: "PERCENT" },
                    fills: [{ type: "SOLID", color: { r: 0.216, g: 0.255, b: 0.318 } }]
                  }
                },
                {
                  id: "layer_5",
                  type: "FRAME",
                  name: "Upload Zone",
                  x: 24,
                  y: 124,
                  width: 312,
                  height: 120,
                  fills: [{ type: "SOLID", color: { r: 0.961, g: 0.973, b: 0.980 } }],
                  strokes: [{ 
                    type: "SOLID", 
                    color: { r: 0.820, g: 0.835, b: 0.863 },
                    strokeWeight: 2,
                    strokeDashes: [8, 8]
                  }],
                  cornerRadius: 16,
                  children: [
                    {
                      id: "layer_6",
                      type: "TEXT",
                      name: "Upload Label",
                      x: 106,
                      y: 52,
                      width: 100,
                      height: 16,
                      characters: "Додати файл",
                      style: {
                        fontFamily: "e-Ukraine",
                        fontWeight: 400,
                        fontSize: 16,
                        textAlignHorizontal: "CENTER",
                        fills: [{ type: "SOLID", color: { r: 0.420, g: 0.451, b: 0.502 } }]
                      }
                    }
                  ]
                },
                {
                  id: "layer_7",
                  type: "RECTANGLE",
                  name: "Next Button",
                  x: 24,
                  y: 276,
                  width: 312,
                  height: 56,
                  fills: [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }],
                  cornerRadius: 16,
                  children: [
                    {
                      id: "layer_8",
                      type: "TEXT",
                      name: "Button Label",
                      x: 131,
                      y: 20,
                      width: 50,
                      height: 18,
                      characters: "Далі",
                      style: {
                        fontFamily: "e-Ukraine",
                        fontWeight: 600,
                        fontSize: 18,
                        textAlignHorizontal: "CENTER",
                        fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      // Add more bloat: duplicate data, unnecessary metadata
      exportSettings: {
        format: "JSON",
        includeMetadata: true,
        includeStyles: true,
        includeAssets: true,
        compressed: false
      },
      // Simulate padding with unnecessary data
      _internalCache: Array(100).fill(null).map((_, i) => ({
        cacheId: `cache_${i}`,
        timestamp: Date.now(),
        data: "unused_metadata_for_bloat_simulation"
      }))
    };
    
    // Return stringified JSON (intentionally uncompressed)
    return JSON.stringify(mockExport, null, 2);
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
  module.exports = FigmaSimulator;
}
window.FigmaSimulator = FigmaSimulator;
