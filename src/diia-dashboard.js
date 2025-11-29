/**
 * Diia Dashboard Renderer - Real screen with three rendering approaches
 */

class DiiaScreenRenderer {
  constructor() {
    this.screenData = {
      user: { name: 'Омельченко Ігор', id: '3409400000' },
      documents: [
        { icon: '🆔', title: 'Е-Паспорт', status: 'Активний', validity: 90 },
        { icon: '🚗', title: 'Водійське посвідчення', status: 'Активне', validity: 85 },
        { icon: '🏥', title: 'Декларація з лікарем', status: 'Актуально', validity: 100 }
      ],
      services: [
        { icon: '🛠️', title: 'Реєстрація ФОП', status: 'Готово' },
        { icon: '🗳️', title: 'Е-Вибори', status: 'Нова' },
        { icon: '📋', title: 'Податкова декларація', status: 'Актуально' }
      ]
    };
  }

  renderVector(scale = 1) {
    const parts = [];
    let y = 16;

    // Header
    parts.push(`<text x="16" y="${y + 20}" font-size="20" font-weight="700" fill="#67C3F3">Дія</text>`);
    y += 40;

    // User Card
    parts.push(`<rect x="16" y="${y}" width="280" height="72" rx="12" fill="#1a1f3a" stroke="#27272a" stroke-width="1"/>`);
    parts.push(`<circle cx="40" cy="${y + 20}" r="14" fill="#67C3F3" opacity="0.3"/>`);
    parts.push(`<text x="60" y="${y + 18}" font-size="14" font-weight="600" fill="#fff">Омельченко Ігор</text>`);
    parts.push(`<text x="60" y="${y + 36}" font-size="12" fill="#a1a1aa">ID: 3409400000</text>`);
    y += 88;

    // Documents
    parts.push(`<text x="16" y="${y + 14}" font-size="14" font-weight="600" fill="#fff">Документи</text>`);
    y += 28;

    this.screenData.documents.forEach(doc => {
      parts.push(`<rect x="16" y="${y}" width="280" height="56" rx="8" fill="#27272a" opacity="0.5"/>`);
      parts.push(`<text x="28" y="${y + 18}" font-size="14">${doc.icon}</text>`);
      parts.push(`<text x="52" y="${y + 16}" font-size="13" font-weight="500" fill="#fff">${doc.title}</text>`);
      parts.push(`<text x="52" y="${y + 32}" font-size="11" fill="#a1a1aa">${doc.status}</text>`);
      parts.push(`<rect x="220" y="${y + 8}" width="60" height="3" rx="1.5" fill="#27272a"/>`);
      parts.push(`<rect x="220" y="${y + 8}" width="${60 * doc.validity / 100}" height="3" rx="1.5" fill="#67C3F3"/>`);
      y += 64;
    });

    // Services
    parts.push(`<text x="16" y="${y + 14}" font-size="14" font-weight="600" fill="#fff">Послуги</text>`);
    y += 28;

    this.screenData.services.forEach(svc => {
      parts.push(`<rect x="16" y="${y}" width="280" height="44" rx="8" fill="#27272a" opacity="0.3"/>`);
      parts.push(`<text x="28" y="${y + 14}" font-size="14">${svc.icon}</text>`);
      parts.push(`<text x="52" y="${y + 14}" font-size="13" font-weight="500" fill="#fff">${svc.title}</text>`);
      parts.push(`<text x="240" y="${y + 14}" font-size="11" fill="#4CAF50">${svc.status}</text>`);
      y += 52;
    });

    return `<svg width="312" height="${y}" viewBox="0 0 312 ${y}" xmlns="http://www.w3.org/2000/svg" style="background:#0a0e27">${parts.join('')}</svg>`;
  }

  renderDOM(scale = 1) {
    const docs = this.screenData.documents.map(d => `
      <div style="background:rgba(39,39,42,0.5);border-radius:8px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:13px;font-weight:500">${d.icon} ${d.title}</span>
          <span style="font-size:11px;color:#4CAF50">${d.status}</span>
        </div>
        <div style="background:#27272a;height:3px;border-radius:1.5px;overflow:hidden">
          <div style="background:#67C3F3;height:100%;width:${d.validity}%"></div>
        </div>
      </div>
    `).join('');

    const svcs = this.screenData.services.map(s => `
      <div style="background:rgba(39,39,42,0.3);border-radius:8px;padding:12px;margin-bottom:6px;display:flex;justify-content:space-between">
        <span style="font-size:13px;font-weight:500">${s.icon} ${s.title}</span>
        <span style="font-size:11px;color:#4CAF50">${s.status}</span>
      </div>
    `).join('');

    return `<div style="width:312px;background:#0a0e27;color:#fff;padding:16px;font-family:system-ui;border-radius:12px">
      <h1 style="font-size:20px;margin:0 0 24px 0;color:#67C3F3">Дія</h1>
      <div style="background:#1a1f3a;border:1px solid #27272a;border-radius:12px;padding:16px;margin-bottom:16px;display:flex;gap:12px">
        <div style="width:32px;height:32px;background:rgba(103,195,243,0.3);border-radius:50%"></div>
        <div><div style="font-weight:600;font-size:14px">Омельченко Ігор</div><div style="font-size:12px;color:#a1a1aa">ID: 3409400000</div></div>
      </div>
      <h2 style="font-size:14px;margin:24px 0 12px 0">Документи</h2>${docs}
      <h2 style="font-size:14px;margin:24px 0 12px 0">Послуги</h2>${svcs}
    </div>`;
  }

  renderFigma(scale = 1) {
    return JSON.stringify({
      name: 'Diia Dashboard',
      type: 'FRAME',
      width: 312,
      height: 600,
      fills: [{ color: '#0a0e27' }],
      children: [
        { name: 'Header', type: 'TEXT', content: 'Дія', fontSize: 20, fills: [{ color: '#67C3F3' }] },
        { name: 'User Card', type: 'COMPONENT', width: 280, height: 72, fills: [{ color: '#1a1f3a' }] },
        ...this.screenData.documents.map(d => ({ name: d.title, type: 'COMPONENT', width: 280, height: 56, fills: [{ color: '#27272a' }] })),
        ...this.screenData.services.map(s => ({ name: s.title, type: 'COMPONENT', width: 280, height: 44, fills: [{ color: '#27272a' }] }))
      ]
    }, null, 2);
  }
}

window.DiiaScreenRenderer = DiiaScreenRenderer;
