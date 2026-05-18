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
    expect(out?.content).toBe('M 100 200 L 110 200 Z');
    expect(out?.svgOrigin).toEqual({ x: 0, y: 0 });
  });

  it('drops geometry inside <defs>', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><path d="M 0 0 L 5 5"/><defs><clipPath><path d="M 0 0 L 999 999"/></clipPath></defs></svg>',
      aabb
    );
    expect(out).toBeDefined();
    expect(out?.content).not.toContain('999');
  });

  it('converts <rect> into an M/L/Z subpath offset by aabb', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><rect x="0" y="0" width="10" height="20"/></svg>',
      aabb
    );
    expect(out?.content).toBe('M 100 200 L 110 200 L 110 220 L 100 220 Z');
  });

  it('converts <rect rx="32" /> into a rounded path with cubic corners', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><rect x="0" y="0" width="100" height="60" rx="32" ry="32"/></svg>',
      aabb
    );
    const content = out?.content ?? '';
    // Four corner curves + four straight edges + close.
    expect((content.match(/C /g) ?? []).length).toBe(4);
    expect((content.match(/L /g) ?? []).length).toBe(4);
    expect(content.endsWith('Z')).toBe(true);
    // First subpath starts at top-left + rx, offset by aabb.
    expect(content.startsWith('M 132 200')).toBe(true);
  });

  it('clamps the corner radius to half the smaller side', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><rect x="0" y="0" width="20" height="20" rx="999"/></svg>',
      aabb
    );
    // rx clamped to 10 (w/2); the start point lands at x0 + rx = 110.
    expect(out?.content.startsWith('M 110 200')).toBe(true);
  });

  it('emits cubic approximation for <circle>', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><circle cx="5" cy="5" r="5"/></svg>',
      aabb
    );
    expect(out?.content).toContain('C ');
    expect(out?.content).toContain('Z');
  });

  it('converts <polygon> points into a closed M/L subpath', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><polygon points="0,0 10,0 5,10"/></svg>',
      aabb
    );
    expect(out?.content).toBe('M 100 200 L 110 200 L 105 210 Z');
  });

  it('warns and skips polygons with malformed points', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><polygon points="0"/><path d="M 0 0 L 1 1"/></svg>',
      aabb
    );
    expect(console.warn).toHaveBeenCalled();
    expect(out?.content).toBe('M 100 200 L 101 201');
  });

  it('applies each element transform before the AABB offset', () => {
    // rotate(90) around origin: (10, 0) → (0, 10); then translate by aabb.
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><path d="M 0 0 L 10 0" transform="rotate(90)"/></svg>',
      aabb
    );
    expect(out?.content).toBe('M 100 200 L 100 210');
  });

  it('concatenates multiple drawable elements', () => {
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><path d="M 0 0 L 1 1"/><rect x="2" y="2" width="3" height="3"/></svg>',
      aabb
    );
    expect((out?.content.match(/M /g) ?? []).length).toBe(2);
  });

  it('aligns the drawn geometry to aabb even when the SVG viewBox includes a shadow margin', () => {
    // Figma exports the path offset by the shadow margin inside the viewBox.
    // The drawn shape lives at (10, 10)-(60, 60) in SVG coords; aligning the
    // bounding box top-left to aabb means the rendered shape lands at
    // aabb.(x, y), not aabb.(x + 10, y + 10).
    const out = translateShapeWithTextGeometry(
      node,
      '<svg><rect x="10" y="10" width="50" height="50"/></svg>',
      aabb
    );
    expect(out?.content).toBe('M 100 200 L 150 200 L 150 250 L 100 250 Z');
    expect(out?.svgOrigin).toEqual({ x: 10, y: 10 });
  });
});
