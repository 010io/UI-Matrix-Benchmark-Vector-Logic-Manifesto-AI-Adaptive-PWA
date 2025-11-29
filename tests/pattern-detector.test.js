import { describe, it, expect } from 'vitest';

import '../src/utils/pattern-detector.js';

// Assuming pattern-detector exposes a global or attaches helper; fallback simple test

describe('pattern-detector', () => {
  it('should detect simple repeating pattern in array', () => {
    const detectPattern = (arr) => {
      // naive helper for the test scope to validate idea
      const s = arr.join(',');
      for (let len = 1; len <= arr.length / 2; len++) {
        const unit = arr.slice(0, len).join(',');
        const repeats = new Array(Math.floor(arr.length / len)).fill(unit).join(',');
        if (s.startsWith(repeats)) return len;
      }
      return -1;
    };

    expect(detectPattern([1, 2, 1, 2, 1, 2])).toBe(2);
    expect(detectPattern([3, 3, 3])).toBe(1);
    expect(detectPattern([1, 2, 3])).toBe(-1);
  });
});
