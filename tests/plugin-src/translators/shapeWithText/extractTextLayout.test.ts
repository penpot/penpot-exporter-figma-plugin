import { describe, expect, it } from 'vitest';

import { extractTextLayout } from '@plugin/translators/shapeWithText/extractTextLayout';

const aabb = { x: 314, y: 460, width: 200, height: 100 };

describe('extractTextLayout', () => {
  it('returns undefined when outlined has no more drawables than editable', () => {
    expect(
      extractTextLayout(
        '<svg><rect width="100" height="100"/></svg>',
        '<svg><rect width="100" height="100"/></svg>',
        aabb
      )
    ).toBeUndefined();
  });

  it('returns undefined when outlined export is empty', () => {
    expect(
      extractTextLayout('<svg><rect width="100" height="100"/></svg>', '<svg></svg>', aabb)
    ).toBeUndefined();
  });

  it('pads frame width around the glyph bbox center to absorb Penpot metric drift', () => {
    // editable: 1 shape rect.
    // outlined: same rect + 1 path with text glyphs at (20..60, 30..50).
    // bbWidth=40, pad=max(40*0.2, 8)=8 → width=48, x shifted left by pad/2.
    const layout = extractTextLayout(
      '<svg><rect width="100" height="100"/></svg>',
      '<svg><rect width="100" height="100"/><path d="M 20 30 L 60 30 L 60 50 L 20 50 Z"/></svg>',
      aabb
    );

    expect(layout).toEqual({
      x: aabb.x + 20 - 4,
      y: aabb.y + 30,
      width: 48,
      height: 20
    });
  });

  it('applies svgOrigin offset (shadow margin alignment)', () => {
    // svgOrigin = (10, 10) → text path (30..50, 30..50) in SVG-local lands at
    // canvas minX = aabb.x + (30 - 10) = aabb.x + 20. bbWidth=20, pad=8.
    const layout = extractTextLayout(
      '<svg><path d="M 10 10 L 60 10 L 60 60 L 10 60 Z"/></svg>',
      '<svg><path d="M 10 10 L 60 10 L 60 60 L 10 60 Z"/><path d="M 30 30 L 50 30 L 50 50 L 30 50 Z"/></svg>',
      aabb,
      { x: 10, y: 10 }
    );

    expect(layout).toEqual({
      x: aabb.x + (30 - 10) - 4,
      y: aabb.y + (30 - 10),
      width: 28,
      height: 20
    });
  });

  it('ignores geometry inside <defs> (filter / clipPath)', () => {
    // Text path (5..15, 5..15): bbWidth=10, pad=max(2, 8)=8.
    const layout = extractTextLayout(
      '<svg><defs><filter><feGaussianBlur/></filter></defs><rect width="100" height="100"/></svg>',
      '<svg><defs><filter><feGaussianBlur/></filter></defs><rect width="100" height="100"/><path d="M 5 5 L 15 5 L 15 15 L 5 15 Z"/></svg>',
      aabb
    );

    expect(layout).toEqual({
      x: aabb.x + 5 - 4,
      y: aabb.y + 5,
      width: 18,
      height: 10
    });
  });

  it('handles shapes composed of multiple drawables (e.g. speech bubble = bubble + pointer)', () => {
    // Text path (30..70, 20..30): bbWidth=40, pad=max(8, 8)=8.
    const layout = extractTextLayout(
      '<svg><path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/><path d="M 45 50 L 50 60 L 55 50 Z"/></svg>',
      '<svg><path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/><path d="M 45 50 L 50 60 L 55 50 Z"/><path d="M 30 20 L 70 20 L 70 30 L 30 30 Z"/></svg>',
      aabb
    );

    expect(layout).toEqual({
      x: aabb.x + 30 - 4,
      y: aabb.y + 20,
      width: 48,
      height: 10
    });
  });

  it('returns undefined for non-axis-aligned rotations (caller falls back to AABB)', () => {
    const layout = extractTextLayout(
      '<svg><rect width="100" height="100"/></svg>',
      '<svg><rect width="100" height="100"/><path d="M 20 30 L 60 30 L 60 50 L 20 50 Z"/></svg>',
      aabb,
      { x: 0, y: 0 },
      45
    );

    expect(layout).toBeUndefined();
  });

  it('swaps local width/height for 90° rotation (reading axis pads along canvas y)', () => {
    // Glyph canvas bbox (20..60, 30..50): bbWidth=40, bbHeight=20.
    // 90° rotation: reading direction = canvas y, so readingSpan = bbHeight = 20.
    // pad = max(20*0.2, 8) = 8; localW = 28; localH = bbWidth = 40.
    const layout = extractTextLayout(
      '<svg><rect width="100" height="100"/></svg>',
      '<svg><rect width="100" height="100"/><path d="M 20 30 L 60 30 L 60 50 L 20 50 Z"/></svg>',
      aabb,
      { x: 0, y: 0 },
      90
    );

    expect(layout).toEqual({
      x: aabb.x + 40 - 14,
      y: aabb.y + 40 - 20,
      width: 28,
      height: 40
    });
  });

  it('keeps glyph bbox dimensions for 180° rotation', () => {
    // 180°: no axis swap. bbWidth=40, bbHeight=20; pad=8; localW=48, localH=20.
    const layout = extractTextLayout(
      '<svg><rect width="100" height="100"/></svg>',
      '<svg><rect width="100" height="100"/><path d="M 20 30 L 60 30 L 60 50 L 20 50 Z"/></svg>',
      aabb,
      { x: 0, y: 0 },
      180
    );

    expect(layout).toEqual({
      x: aabb.x + 40 - 24,
      y: aabb.y + 40 - 10,
      width: 48,
      height: 20
    });
  });

  it('normalizes negative rotation (-90° behaves like 270°)', () => {
    const layout = extractTextLayout(
      '<svg><rect width="100" height="100"/></svg>',
      '<svg><rect width="100" height="100"/><path d="M 20 30 L 60 30 L 60 50 L 20 50 Z"/></svg>',
      aabb,
      { x: 0, y: 0 },
      -90
    );

    expect(layout).toEqual({
      x: aabb.x + 40 - 14,
      y: aabb.y + 40 - 20,
      width: 28,
      height: 40
    });
  });

  it('matches the bbox of a real Figma SQUARE export (HEADER 3 fixture)', () => {
    // Outlined path captured from a real `node.exportAsync({svgOutlineText: true})`
    // on a SQUARE SWT (label "HEADER 3", Inter Bold 36).
    const editable =
      '<svg width="176" height="176" viewBox="0 0 176 176">' +
      '<rect width="176" height="176" fill="#0887A0"/>' +
      '<text font-family="Inter" font-size="36"><tspan x="50.804" y="77.0909">HEA</tspan><tspan x="37.4791" y="125.091">DER 3</tspan></text>' +
      '</svg>';
    const outlined =
      '<svg width="176" height="176" viewBox="0 0 176 176">' +
      '<rect width="176" height="176" fill="#0887A0"/>' +
      '<path d="M53.0796 77V50.8182H58.6151V61.6207H69.8523V50.8182H75.375V77H69.8523V66.1847H58.6151V77ZM45.2901 120.257H48.8058L80 145Z"/>' +
      '</svg>';

    const layout = extractTextLayout(editable, outlined, { x: 0, y: 0, width: 176, height: 176 });

    expect(layout).toBeDefined();
    expect(layout!.y).toBeCloseTo(50.8182, 4);
    expect(layout!.width).toBeGreaterThan(0);
    expect(layout!.height).toBeGreaterThan(0);
  });
});
