import { beforeEach, describe, expect, it, vi } from 'vitest';

import { translateShapeWithTextGeometry } from '@plugin/translators/shapeWithText/translateShapeWithTextGeometry';

const node = {
  id: '7:1',
  name: 'sample',
  shapeType: 'DIAMOND'
} as unknown as ShapeWithTextNode;

const aabb: Rect = { x: 100, y: 200, width: 50, height: 50 };

describe('translateShapeWithTextGeometry', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns undefined when SVG has no drawable elements', () => {
    expect(
      translateShapeWithTextGeometry(node, '<svg><text>only text</text></svg>', aabb)
    ).toBeUndefined();
  });

  it('translates a single <path> by the AABB origin', () => {
    const out = translateShapeWithTextGeometry(node, '<svg><path d="M 0 0 L 10 0 Z"/></svg>', aabb);
    expect(out).toBe('M 100 200 L 110 200 Z');
  });

  it('drops geometry inside <defs>', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><path d="M 0 0 L 5 5"/><defs><clipPath><path d="M 0 0 L 999 999"/></clipPath></defs></svg>',
      aabb
    );
    expect(out).toBeDefined();
    expect(out).not.toContain('999');
  });

  it('converts <rect> into an M/L/Z subpath offset by aabb', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><rect x="0" y="0" width="10" height="20"/></svg>',
      aabb
    );
    expect(out).toBe('M 100 200 L 110 200 L 110 220 L 100 220 Z');
  });

  it('emits cubic approximation for <circle>', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><circle cx="5" cy="5" r="5"/></svg>',
      aabb
    );
    expect(out).toBeDefined();
    expect(out).toContain('C ');
    expect(out).toContain('Z');
  });

  it('converts <polygon> points into a closed M/L subpath', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><polygon points="0,0 10,0 5,10"/></svg>',
      aabb
    );
    expect(out).toBe('M 100 200 L 110 200 L 105 210 Z');
  });

  it('warns and skips polygons with malformed points', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><polygon points="0"/><path d="M 0 0 L 1 1"/></svg>',
      aabb
    );
    expect(console.warn).toHaveBeenCalled();
    expect(out).toBe('M 100 200 L 101 201');
  });

  it('applies each element transform before the AABB offset', () => {
    // rotate(90) around origin: (10, 0) → (0, 10); then translate by aabb.
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><path d="M 0 0 L 10 0" transform="rotate(90)"/></svg>',
      aabb
    );
    expect(out).toBe('M 100 200 L 100 210');
  });

  it('concatenates multiple drawable elements', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><path d="M 0 0 L 1 1"/><rect x="2" y="2" width="3" height="3"/></svg>',
      aabb
    ) as string;
    expect((out.match(/M /g) ?? []).length).toBe(2);
  });
});
