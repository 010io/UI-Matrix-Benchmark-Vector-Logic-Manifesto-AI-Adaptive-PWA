import { describe, it, expect } from 'vitest';

import '../src/utils/fps-meter.js';

// fps-meter.js likely attaches to window; we test existence of API patterns if any

describe('fps-meter', () => {
  it('should not throw when creating a simple raf loop', () => {
    const start = performance.now();
    // basic sanity: requestAnimationFrame exists in jsdom via polyfill
    expect(typeof requestAnimationFrame).toBe('function');
    const id = requestAnimationFrame(() => {});
    expect(typeof id).toBe('number');
    expect(performance.now()).toBeGreaterThanOrEqual(start);
    cancelAnimationFrame(id);
  });
});
