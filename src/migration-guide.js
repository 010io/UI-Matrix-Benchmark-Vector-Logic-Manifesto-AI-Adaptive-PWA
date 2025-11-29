/**
 * Migration Guide - Три підходи до UI розробки
 */

class MigrationGuide {
  static approaches = {
    vector: {
      name: '🎯 Vector Logic',
      icon: '📐',
      description: 'Математичні формули в SVG',
      tools: ['SVG', 'Canvas', 'WebGL', 'Three.js'],
      pros: ['5-25x менше коду', '80-95 AI Score', '♾️ Infinite scaling', 'Експорт в будь-що', 'Мінімальний bundle'],
      cons: ['Потребує математичного мислення', 'Складніше для дизайнерів'],
      useCase: 'Оптимальний для AI, мобільних, масштабування',
      examples: ['y = prevY + height + gap', '<svg><rect x="0" y="0" width="100" height="40"/></svg>']
    },
    dom: {
      name: '📄 DOM/HTML',
      icon: '🌐',
      description: 'Традиційний HTML + CSS + JS',
      tools: ['React', 'Vue', 'Angular', 'Svelte', 'Tailwind CSS'],
      pros: ['Знайомий синтаксис', 'Підтримка браузерів', 'Багато бібліотек', 'SEO friendly'],
      cons: ['Громіздкий', '40-60 AI Score', 'Обмежена масштабованість', 'Велика bundle'],
      useCase: 'Для звичайних веб-сайтів та додатків',
      examples: ['<div class="flex flex-col gap-4 p-6">...</div>', 'margin: 16px; padding: 8px;']
    },
    figma: {
      name: '🎨 Figma & Design Tools',
      icon: '🖌️',
      description: 'JSON/SVG експорт з дизайн-інструментів',
      tools: ['Figma', 'Adobe XD', 'Sketch', 'Penpot', 'Framer'],
      pros: ['Візуальний редактор', 'Дизайнери розуміють', 'Прототипування', 'Collaboration'],
      cons: ['Величезний розмір', 'Статичні дані', 'Неефективно для AI', 'Потребує конвертації', 'Дорого'],
      useCase: 'Для дизайнерів, не для продакшену',
      examples: ['{"type":"rect","x":0,"y":0,"width":100,"height":40}', 'Figma JSON export']
    }
  };

  static comparisons = [
    {
      metric: 'Розмір файлу',
      vector: '~800 bytes',
      dom: '~4-6 KB',
      figma: '~18-20 KB'
    },
    {
      metric: 'LLM Tokens',
      vector: '~200-300',
      dom: '~800-1000',
      figma: '~4000+'
    },
    {
      metric: 'Час рендеру',
      vector: '~1-2 ms',
      dom: '~5-10 ms',
      figma: '~10-20 ms'
    },
    {
      metric: 'AI Score',
      vector: '80-95',
      dom: '40-60',
      figma: '10-30'
    },
    {
      metric: 'Масштабованість',
      vector: '♾️ Infinite',
      dom: '⚠️ Limited',
      figma: '❌ Fixed'
    },
    {
      metric: 'Експорт форматів',
      vector: '✅ All',
      dom: '⚠️ Web only',
      figma: '❌ Static'
    }
  ];

  static generateHTML() {
    let html = '<div class="migration-container">';
    
    // Approaches section
    html += '<div class="approaches-section"><h3>📊 ТРИ ПІДХОДИ</h3><div class="approaches-grid">';
    
    for (const [key, approach] of Object.entries(this.approaches)) {
      html += `
        <div class="approach-card">
          <div class="approach-header">${approach.icon} ${approach.name}</div>
          <p class="approach-desc">${approach.description}</p>
          
          <div class="approach-tools">
            <strong>Інструменти:</strong>
            <div class="tools-list">${approach.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>
          </div>
          
          <div class="approach-pros">
            <strong>✅ Переваги:</strong>
            <ul>${approach.pros.map(p => `<li>${p}</li>`).join('')}</ul>
          </div>
          
          <div class="approach-cons">
            <strong>⚠️ Недоліки:</strong>
            <ul>${approach.cons.map(c => `<li>${c}</li>`).join('')}</ul>
          </div>
          
          <div class="approach-usecase">
            <strong>💡 Коли використовувати:</strong>
            <p>${approach.useCase}</p>
          </div>
          
          <div class="approach-examples">
            <strong>📝 Приклади:</strong>
            ${approach.examples.map(ex => `<code>${ex}</code>`).join('')}
          </div>
        </div>`;
    }
    
    html += '</div></div>';
    
    // Comparison table
    html += '<div class="comparison-section"><h3>📈 ПОРІВНЯННЯ</h3><table class="comparison-table"><thead><tr><th>Метрика</th><th>🎯 Vector</th><th>📄 DOM</th><th>🎨 Figma</th></tr></thead><tbody>';
    
    this.comparisons.forEach(comp => {
      html += `<tr><td>${comp.metric}</td><td class="vector-cell">${comp.vector}</td><td class="dom-cell">${comp.dom}</td><td class="figma-cell">${comp.figma}</td></tr>`;
    });
    
    html += '</tbody></table></div>';
    
    html += '</div>';
    return html;
  }

  static showGuide() {
    const modal = document.createElement('div');
    modal.className = 'guide-modal';
    modal.innerHTML = `
      <div class="guide-modal-content">
        <button class="guide-close" onclick="this.parentElement.parentElement.remove()">✕</button>
        <h2>📚 Три підходи до UI розробки</h2>
        ${this.generateHTML()}
      </div>
    `;
    document.body.appendChild(modal);
  }
}

window.MigrationGuide = MigrationGuide;
