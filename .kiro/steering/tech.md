# Technology Stack

## 1. Core Stack

### Frontend
- **Vanilla JavaScript (ES6+)**: Zero dependencies, maximum transparency
- **SVG 2.0**: Mathematical vector graphics
- **Web APIs**: Performance API, Blob API, Service Worker API

### Why No Framework?
This is a **proof-of-concept** demonstrating raw performance. Using React/Vue would:
- Add dependency bloat (contradicting our thesis)
- Obscure the mathematical rendering logic
- Make benchmark comparisons less clear

**For production Diia integration:** The vector renderer could be wrapped in React/Vue components.

### Styling
- **Custom CSS**: Cyberpunk/Matrix theme with Diia color palette
- **CSS Variables**: For design tokens
- **Grid/Flexbox**: Modern  layout without libraries

## 2. Architecture Patterns

### Mathematical Rendering Engine
- **Design Tokens as Constants**: `WIDTH`, `HEIGHT`, `PADDING`
- **Stack Layout Algorithm**: `advanceY(height, gap)`
- **Formula-based Paths**: SVG paths calculated mathematically

### Benchmark Methodology
- **Blob API**: Exact byte size measurement
- **Performance API**: Sub-millisecond timing accuracy
- **Statistical Analysis**: Multiple iterations for reliability

### PWA Infrastructure
- **Service Worker**: Cache-first strategy for offline support
- **Web Manifest**: Installable as standalone app
- **Responsive Design**: Mobile-first approach

## 3. Dependencies

**Runtime:** NONE (Pure vanilla JS)

**Development (optional):**
- `http-server` or `serve`: Local development server
- Browser DevTools: Performance profiling

**Rationale:** Zero dependencies demonstrates:
1. Simplicity of the vector approach
2. No "hidden" framework overhead
3. True apples-to-apples comparison

## 4. Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Vector payload | <1 KB | ~800 bytes |
| DOM payload | Reference | ~4-6 KB |
| Figma export | Reference | ~15-20 KB |
| Vector render time | <5ms | ~1-3ms |
| AI tokens (Vector) | <300 | ~200 |
| AI tokens (DOM) | Reference | ~1000+ |
| Lighthouse PWA score | >90 | TBD |

## 5. Browser Support

### Minimum Requirements
- **ES6 Support**: Arrow functions, classes, template literals
- **SVG 2.0**: Inline SVG rendering
- **Service Workers**: For PWA functionality

### Tested Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Graceful Degradation
- Service Worker fails → App still works online
- No ES6 → Fallback error message

## 6. Conventions

### Code Style
- **Naming**: camelCase for functions, PascalCase for classes
- **Comments**: JSDoc for public methods
- **Formatting**: 2-space indentation, single quotes

### File Organization
```
src/
├── generators/     # Rendering engines
├── benchmark-engine.js
├── export-engine.js
└── app.js         # Main orchestrator
```

## 7. Deployment

### GitHub Pages
- **Build process:** None required (static files)
- **Deployment:** Git push to main branch
- **URL:** `https://010io.github.io/{repo-name}/`

### Edge Cases
- **CORS**: Not applicable (same-origin resources)
- **CDN**: GitHub Pages CDN included
- **SSL**: Automatic HTTPS

## 8. Future Enhancements (Post-Contest)

### Phase 2: Integration
- Wrap vector renderer in React components
- Connect to Diia Design System API
- Real Diia component library

### Phase 3: AI Integration
- LLM prompt templates for generating formulas
- Formula optimization engine
- Natural language → Mathematical UI

### Phase 4: Production
- TypeScript conversion
- Unit tests for renderers
- Performance regression suite
- CDN distribution

## 9. Security Considerations

### XSS Prevention
- SVG sanitization (no `<script>` tags allowed)
- Template literal escaping

### Content Security Policy (CSP)
```
default-src 'self';
style-src 'self' 'unsafe-inline';
script-src 'self';
```

### Service Worker Security
- Cache only first-party resources
- HTTPS-only deployment (GitHub Pages enforces this)

## 10. Why This Stack for Diia?

1. **Transparency:** Government code should be auditable
2. **Performance:** Rural Ukraine needs fast-loading apps
3. **Longevity:** No framework lock-in, no deprecation risk
4. **Education:** Shows engineering fundamentals
5. **Innovation:** Demonstrates Ukrainian tech leadership
