/**
 * Export Engine - Multi-Format Conversion
 * Правильний розрахунок LLM токенів
 */

class ExportEngine {
  constructor() {
    this.vectorRenderer = null;
  }
  
  setVectorRenderer(renderer) {
    this.vectorRenderer = renderer;
  }
  
  toReactNative(props = {}) {
    return `import React from 'react';\nimport { View, Text, TouchableOpacity, StyleSheet } from 'react-native';\nimport Svg, { Rect, Path, Text as SvgText, G } from 'react-native-svg';\n\nconst DiiaUploadScreen = () => {\n  return (\n    <View style={styles.container}>\n      <Svg width={360} height={680} viewBox="0 0 360 680">\n        <Rect x={8} y={16} width={344} height={648} rx={24} fill="white" />\n        <G transform="translate(0, 32)">\n          <SvgText x={16} y={42} fontFamily="e-Ukraine" fontWeight="bold" fontSize={18} fill="#111827">\n            ${props.title || 'Завантаження документів'}\n          </SvgText>\n          <SvgText x={16} y={70} fontFamily="e-Ukraine" fontSize={14} fill="#374151">\n            ${props.description || 'Додайте необхідні документи'}\n          </SvgText>\n          <Rect x={16} y={94} width={328} height={120} rx={16} fill="#F5F8FA" />\n          <Rect x={16} y={94} width={328} height={120} rx={16} fill="none" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="8 8" />\n          <Rect x={16} y={246} width={328} height={56} rx={16} fill="#000000" />\n          <SvgText x={180} y={280} textAnchor="middle" fontFamily="e-Ukraine" fontWeight="600" fontSize={18} fill="#FFFFFF">\n            Далі\n          </SvgText>\n        </G>\n      </Svg>\n    </View>\n  );\n};\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    backgroundColor: '#E2ECF4',\n  },\n});\n\nexport default DiiaUploadScreen;`;
  }
  
  toSwiftUI(props = {}) {
    return `import SwiftUI\n\nstruct DiiaUploadScreen: View {\n    var body: some View {\n        ZStack {\n            Color(red: 0.886, green: 0.925, blue: 0.957)\n                .ignoresSafeArea()\n            \n            VStack(spacing: 0) {\n                VStack(alignment: .leading, spacing: 8) {\n                    Text("${props.title || 'Завантаження документів'}")\n                        .font(.system(size: 18, weight: .bold))\n                        .foregroundColor(Color(red: 0.067, green: 0.094, blue: 0.153))\n                    \n                    Text("${props.description || 'Додайте необхідні документи'}")\n                        .font(.system(size: 14))\n                        .foregroundColor(Color(red: 0.216, green: 0.255, blue: 0.318))\n                }\n                .padding(.horizontal, 16)\n                .frame(maxWidth: .infinity, alignment: .leading)\n                \n                Spacer().frame(height: 24)\n                \n                RoundedRectangle(cornerRadius: 16)\n                    .stroke(style: StrokeStyle(lineWidth: 2, dash: [8, 8]))\n                    .foregroundColor(Color(red: 0.820, green: 0.835, blue: 0.863))\n                    .background(\n                        RoundedRectangle(cornerRadius: 16)\n                            .fill(Color(red: 0.961, green: 0.973, blue: 0.980))\n                    )\n                    .frame(height: 120)\n                    .overlay(\n                        Text("Додати файл")\n                            .font(.system(size: 16))\n                            .foregroundColor(Color(red: 0.420, green: 0.451, blue: 0.502))\n                    )\n                    .padding(.horizontal, 16)\n                \n                Spacer()\n                \n                Button(action: {}) {\n                    Text("Далі")\n                        .font(.system(size: 18, weight: .semibold))\n                        .foregroundColor(.white)\n                        .frame(maxWidth: .infinity)\n                        .frame(height: 56)\n                        .background(Color.black)\n                        .cornerRadius(16)\n                }\n                .padding(.horizontal, 16)\n                .padding(.bottom, 16)\n            }\n            .frame(maxWidth: 360, maxHeight: 680)\n            .background(Color.white)\n            .cornerRadius(24)\n            .padding(8)\n        }\n    }\n}`;
  }
  
  toPDFInstructions(props = {}) {
    return `PDF Generation Instructions (PostScript-like):\n    \n% Define page\nnewpath\n0 0 360 680 rect\n0.886 0.925 0.957 setrgbcolor fill\n\n% Card background\nnewpath\n8 16 344 648 24 roundrect\n1 1 1 setrgbcolor fill\n\n% Title\n/e-Ukraine findfont 18 scalefont setfont\n0.067 0.094 0.153 setrgbcolor\n16 642 moveto\n(${props.title || 'Завантаження документів'}) show\n\n% Description\n/e-Ukraine findfont 14 scalefont setfont\n0.216 0.255 0.318 setrgbcolor\n16 622 moveto\n(${props.description || 'Додайте необхідні документи'}) show\n\n% Upload zone (dashed rectangle)\nnewpath\n16 502 328 120 16 roundrect\n[8 8] 0 setdash\n0.820 0.835 0.863 setrgbcolor\n2 setlinewidth stroke\n\n% Button\nnewpath\n16 246 328 56 16 roundrect\n0 0 0 setrgbcolor fill\n\nshowpage`;
  }
  
  analyzeAIFriendliness(content) {
    const elementCount = (content.match(/<[^>]+>/g) || []).length;
    const classCount = (content.match(/class=/g) || []).length;
    const styleCount = (content.match(/style=/g) || []).length;
    const divCount = (content.match(/<div/g) || []).length;
    
    const hasFormulas = content.includes('stroke-dasharray') || 
                       content.includes('transform') || 
                       content.includes('viewBox');
    
    let estimatedTokens;
    if (hasFormulas) {
      estimatedTokens = Math.ceil(content.length / 4) + (elementCount * 2);
    } else {
      estimatedTokens = Math.ceil(content.length / 4) + (elementCount * 5) + (classCount * 15) + (styleCount * 10) + (divCount * 20);
    }
    
    let isParsable = true;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/xml');
      isParsable = !doc.querySelector('parsererror');
    } catch (e) {
      isParsable = false;
    }
    
    const numberCount = (content.match(/\d+(\.\d+)?/g) || []).length;
    
    return {
      estimatedTokens: Math.max(200, estimatedTokens),
      elementCount,
      isParsable,
      numberCount,
      hasFormulas,
      aiFriendlyScore: this.calculateAIScore(estimatedTokens, elementCount, hasFormulas),
      structureType: hasFormulas ? 'Mathematical (Formulaic)' : 'Declarative (Markup)'
    };
  }
  
  calculateAIScore(tokens, elements, hasFormulas) {
    let score = 100;
    
    if (tokens > 1000) score -= 20;
    if (tokens > 5000) score -= 30;
    
    if (elements > 50) score -= 15;
    if (elements > 100) score -= 25;
    
    if (hasFormulas) score += 15;
    
    return Math.max(0, Math.min(100, score));
  }
  
  generateComparisonReport(renderers, props = {}) {
    const vectorOutput = renderers.vector.render(props);
    const domOutput = renderers.dom.render(props);
    const figmaOutput = renderers.figma.render(props);
    
    return {
      payloadSize: {
        vector: new Blob([vectorOutput]).size,
        dom: new Blob([domOutput]).size,
        figma: new Blob([figmaOutput]).size
      },
      aiAnalysis: {
        vector: this.analyzeAIFriendliness(vectorOutput),
        dom: this.analyzeAIFriendliness(domOutput),
        figma: this.analyzeAIFriendliness(figmaOutput)
      },
      exportFormats: {
        reactNative: new Blob([this.toReactNative(props)]).size,
        swiftUI: new Blob([this.toSwiftUI(props)]).size,
        pdf: new Blob([this.toPDFInstructions(props)]).size
      },
      advantages: {
        vector: [
          'Математична основа (легко генерувати AI)',
          'Мінімальний розмір (~1KB)',
          'Безкінечна масштабованість',
          'Прямий експорт в PDF/SVG',
          'Низька кількість токенів для LLM'
        ],
        dom: [
          'Знайомий синтаксис для розробників',
          'Підтримка браузерів'
        ],
        figma: [
          'Візуальний редактор'
        ]
      }
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExportEngine;
}
window.ExportEngine = ExportEngine;
