import { describe, expect, it } from 'vitest';

import {
  PATH_SHAPE_TYPES,
  isPathShapeType,
  translateShapeWithTextPath
} from '@plugin/translators/translateShapeWithTextPath';

const origin = { x: 0, y: 0 };
const size = { width: 100, height: 100 };

describe('translateShapeWithTextPath', () => {
  it('exposes the full set of supported path shape types', () => {
    expect(PATH_SHAPE_TYPES.size).toBe(15);
  });

  it('recognises supported shape types via isPathShapeType', () => {
    expect(isPathShapeType('DIAMOND')).toBe(true);
    expect(isPathShapeType('SQUARE')).toBe(false);
    expect(isPathShapeType('ENG_DATABASE')).toBe(false);
  });

  it('produces a closed diamond with four vertices', () => {
    const path = translateShapeWithTextPath('DIAMOND', origin, size);

    expect(path).toBe('M 50 0 L 100 50 L 50 100 L 0 50 Z');
  });

  it('produces an upward triangle with apex on top', () => {
    expect(translateShapeWithTextPath('TRIANGLE_UP', origin, size)).toBe(
      'M 50 0 L 100 100 L 0 100 Z'
    );
  });

  it('produces a downward triangle with apex on bottom', () => {
    expect(translateShapeWithTextPath('TRIANGLE_DOWN', origin, size)).toBe(
      'M 0 0 L 100 0 L 50 100 Z'
    );
  });

  it('produces a flat-top hexagon with six vertices', () => {
    expect(translateShapeWithTextPath('HEXAGON', origin, size)).toBe(
      'M 25 0 L 75 0 L 100 50 L 75 100 L 25 100 L 0 50 Z'
    );
  });

  it('produces a closed pentagon with apex pointing up', () => {
    const path = translateShapeWithTextPath('PENTAGON', origin, size);

    expect(path.startsWith('M ')).toBe(true);
    expect(path.endsWith(' Z')).toBe(true);
    expect((path.match(/L /g) ?? []).length).toBe(4); // 4 line segments + initial M = 5 vertices
  });

  it('offsets all path coordinates by the origin', () => {
    const path = translateShapeWithTextPath('DIAMOND', { x: 100, y: 200 }, size);

    expect(path).toBe('M 150 200 L 200 250 L 150 300 L 100 250 Z');
  });

  it('emits three subpaths for INTERNAL_STORAGE', () => {
    const path = translateShapeWithTextPath('INTERNAL_STORAGE', origin, size);

    expect((path.match(/M /g) ?? []).length).toBe(3);
    expect(path).toContain('L 100 0');
  });

  it('produces a chevron pointing right', () => {
    expect(translateShapeWithTextPath('CHEVRON', origin, size)).toBe(
      'M 0 0 L 75 0 L 100 50 L 75 100 L 0 100 Z'
    );
  });

  it('produces an arrow pointing right', () => {
    const path = translateShapeWithTextPath('ARROW_RIGHT', origin, size);

    expect(path).toContain('M 0 30'); // body top-left
    expect(path).toContain('L 100 50'); // arrow tip
  });
});
