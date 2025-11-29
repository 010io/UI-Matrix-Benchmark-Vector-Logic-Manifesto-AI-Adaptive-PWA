/**
 * Diia Dashboard Renderer - Real screen with three rendering approaches
 */

class DiiaScreenRenderer {
  constructor() {
    this.screenData = {
      user: {
        name: 'Омельченко Ігор',
        id: '3409400000',
        photo: '👤'
      },
      documents: [
        { icon: '🆔', title: 'Е-Паспорт', status: 'Активний', validity: '90%' },
        { icon: '🚗', title: 'Водійське посвідчення', status: 'Активне', validity: '85%' },
        { icon: '🏥', title: 'Декларація з лікарем', status: 'Актуально', validity: '100%' }
      ],
      services: [
        { icon: '🛠️', title: 'Реєстрація ФОП', status: 'Готово' },
        { icon: '🗳️', title: 'Е-Вибори', status: 'Нова' },
        { icon: '📋', title: 'Податкова декларація', status: 'Актуально' }
      ],
      notifications: [
        { type: 'info', text: 'Оновлення Diia доступне' },
        { type: 'warning', text: 'Паспорт закінчується через 6 місяців' }
      ]
    };
  }

  renderVector(scale = 1) {
    const P = 16 * scale;
    const parts = [];
    let y = P;

    // Header
    parts.push(`<text x="${P}" y="${y + 24}" font-size="${20 * scale}" font-weight="700" fill="#67C3F3">Дія</text>`);
    y += 40 * scale;

    // User Card
    const cardHeight = 80 * scale;
    parts.push(`<rect x="${P}" y="${y}" width="${280 * scale}" height="${cardHeight}" rx="${12 * scale}" fill="#1a1f3a" stroke="#27272a" stroke-width="1"/>`);
    parts.push(`<circle cx="${P + 24 * scale}" cy="${y + 24 * scale}" r="${16 * scale}" fill="#67C3F3" opacity="0.3"/>`);
    parts.push(`<text x="${P + 48 * scale}" y="${y + 20 * scale}" font-size="${14 * scale}" font-weight="600" fill="#ffffff">${this.screenData.user.name}</text>`);
    parts.push(`<text x="${P + 48 * scale}" y="${y + 40 * scale}" font-size="${12 * scale}" fill="#a1a1aa">ID: ${this.screenData.user.id}</text>`);
    y += cardHeight + 16 * scale;

    // Documents Section
    parts.push(`<text x="${P}" y="${y + 16 * scale}" font-size="${16 * scale}" font-weight="600" fill="#ffffff">Документи</text>`);
    y += 32 * scale;

    this.screenData.documents.forEach((doc, i) => {
      const docHeight = 60 * scale;
      parts.push(`<rect x="${P}" y="${y}" width="${280 * scale}" height="${docHeight}" rx="${8 * scale}" fill="#27272a" opacity="0.5"/>`);
      parts.push(`<text x="${P + 12 * scale}" y="${y + 18 * scale}" font-size="${14 * scale}">${doc.icon}</text>`);
      parts.push(`<text x="${P + 40 * scale}" y="${y + 18 * scale}" font-size="${13 * scale}" font-weight="500" fill="#ffffff">${doc.title}</text>`);
      parts.push(`<text x="${P + 40 * scale}" y="${y + 36 * scale}" font-size="${11 * scale}" fill="#a1a1aa">${doc.status}</text>`);
      parts.push(`<rect x="${P + 200 * scale}" y="${y + 8 * scale}" width="${60 * scale}" height="${4 * scale}" rx="${2 * scale}" fill="#27272a"/>`);
      parts.push(`<rect x="${P + 200 * scale}" y="${y + 8 * scale}" width="${60 * scale * (doc.validity / 100)}" height="${4 * scale}" rx="${2 * scale}" fill="#67C3F3"/>`);
      y += docHeight + 8 * scale;
    });

    y += 8 * scale;

    // Services Section
    parts.push(`<text x="${P}" y="${y + 16 * scale}" font-size="${16 * scale}" font-weight="600" fill="#ffffff">Послуги</text>`);
    y += 32 * scale;

    this.screenData.services.forEach((svc, i) => {
      const svcHeight = 48 * scale;
      parts.push(`<rect x="${P}" y="${y}" width="${280 * scale}" height="${svcHeight}" rx="${8 * scale}" fill="#27272a" opacity="0.3"/>`);
      parts.push(`<text x="${P + 12 * scale}" y="${y + 16 * scale}" font-size="${14 * scale}">${svc.icon}</text>`);
      parts.push(`<text x="${P + 40 * scale}" y="${y + 16 * scale}" font-size="${13 * scale}" font-weight="500" fill="#ffffff">${svc.title}</text>`);
      parts.push(`<text x="${P + 220 * scale}" y="${y + 16 * scale}" font-size="${11 * scale}" fill="#4CAF50">${svc.status}</text>`);
      y += svcHeight + 6 * scale;
    });

    const svg = `<svg width="${312 * scale}" height="${y}" viewBox="0 0 ${312 * scale} ${y}" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
    return svg;
  }

  renderDOM(scale = 1) {
    const html = `
      <div style="width: ${312 * scale}px; background: #0a0e27; color: #ffffff; padding: ${16 * scale}px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; border-radius: ${12 * scale}px;">
        <h1 style="font-size: ${20 * scale}px; margin: 0 0 ${24 * scale}px 0; color: #67C3F3;">Дія</h1>
        
        <div style="background: #1a1f3a; border: 1px solid #27272a; border-radius: ${12 * scale}px; padding: ${16 * scale}px; margin-bottom: ${16 * scale}px; display: flex; gap: ${12 * scale}px;">
          <div style="width: ${32 * scale}px; height: ${32 * scale}px; background: rgba(103, 195, 243, 0.3); border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="font-weight: 600; font-size: ${14 * scale}px;">${this.screenData.user.name}</div>
            <div style="font-size: ${12 * scale}px; color: #a1a1aa;">ID: ${this.screenData.user.id}</div>
          </div>
        </div>

        <h2 style="font-size: ${16 * scale}px; margin: ${24 * scale}px 0 ${12 * scale}px 0;">Документи</h2>
        ${this.screenData.documents.map(doc => `
          <div style="background: rgba(39, 39, 42, 0.5); border-radius: ${8 * scale}px; padding: ${12 * scale}px; margin-bottom: ${8 * scale}px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: ${8 * scale}px;">
              <span style="font-size: ${13 * scale}px; font-weight: 500;">${doc.icon} ${doc.title}</span>
              <span style="font-size: ${11 * scale}px; color: #4CAF50;">${doc.status}</span>
            </div>
            <div style="background: #27272a; height: ${4 * scale}px; border-radius: ${2 * scale}px; overflow: hidden;">
              <div style="background: #67C3F3; height: 100%; width: ${doc.validity}%;"></div>
            </div>
          </div>
        `).join('')}

        <h2 style="font-size: ${16 * scale}px; margin: ${24 * scale}px 0 ${12 * scale}px 0;">Послуги</h2>
        ${this.screenData.services.map(svc => `
          <div style="background: rgba(39, 39, 42, 0.3); border-radius: ${8 * scale}px; padding: ${12 * scale}px; margin-bottom: ${6 * scale}px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: ${13 * scale}px; font-weight: 500;">${svc.icon} ${svc.title}</span>
            <span style="font-size: ${11 * scale}px; color: #4CAF50;">${svc.status}</span>
          </div>
        `).join('')}
      </div>
    `;
    return html;
  }

  renderFigma(scale = 1) {
    const figmaJSON = {
      name: 'Diia Dashboard Screen',
      type: 'FRAME',
      width: 312 * scale,
      height: 600 * scale,
      fills: [{ color: '#0a0e27' }],
      children: [
        {
          name: 'Header',
          type: 'TEXT',
          content: 'Дія',
          fontSize: 20 * scale,
          fontWeight: 700,
          fills: [{ color: '#67C3F3' }]
        },
        {
          name: 'User Card',
          type: 'COMPONENT',
          width: 280 * scale,
          height: 80 * scale,
          fills: [{ color: '#1a1f3a' }],
          strokes: [{ color: '#27272a' }]
        },
        {
          name: 'Documents Section',
          type: 'GROUP',
          children: this.screenData.documents.map(doc => ({
            name: doc.title,
            type: 'COMPONENT',
            width: 280 * scale,
            height: 60 * scale,
            fills: [{ color: '#27272a', opacity: 0.5 }]
          }))
        },
        {
          name: 'Services Section',
          type: 'GROUP',
          children: this.screenData.services.map(svc => ({
            name: svc.title,
            type: 'COMPONENT',
            width: 280 * scale,
            height: 48 * scale,
            fills: [{ color: '#27272a', opacity: 0.3 }]
          }))
        }
      ]
    };
    return JSON.stringify(figmaJSON, null, 2);
  }
}

window.DiiaScreenRenderer = DiiaScreenRenderer;
