import { describe, expect, it } from 'vitest';

import { extractTextLayout } from '@plugin/translators/shapeWithText/extractTextLayout';

const aabb = { x: 314, y: 460 };

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

  it('computes text bbox from the trailing path in the outlined SVG', () => {
    // editable: 1 shape rect.
    // outlined: same rect + 1 path with text glyphs at (20..60, 30..50).
    const layout = extractTextLayout(
      '<svg><rect width="100" height="100"/></svg>',
      '<svg><rect width="100" height="100"/><path d="M 20 30 L 60 30 L 60 50 L 20 50 Z"/></svg>',
      aabb
    );

    expect(layout).toEqual({ x: aabb.x + 20, y: aabb.y + 30, width: 40, height: 20 });
  });

  it('applies svgOrigin offset (shadow margin alignment)', () => {
    // svgOrigin = (10, 10) means the shape's bbox top-left lives at (10, 10) in
    // SVG-local coords. Text path minX=30, minY=30 → canvas: aabb + (30-10, 30-10).
    const layout = extractTextLayout(
      '<svg><path d="M 10 10 L 60 10 L 60 60 L 10 60 Z"/></svg>',
      '<svg><path d="M 10 10 L 60 10 L 60 60 L 10 60 Z"/><path d="M 30 30 L 50 30 L 50 50 L 30 50 Z"/></svg>',
      aabb,
      { x: 10, y: 10 }
    );

    expect(layout).toEqual({ x: aabb.x + 20, y: aabb.y + 20, width: 20, height: 20 });
  });

  it('ignores geometry inside <defs> (filter / clipPath)', () => {
    const layout = extractTextLayout(
      '<svg><defs><filter><feGaussianBlur/></filter></defs><rect width="100" height="100"/></svg>',
      '<svg><defs><filter><feGaussianBlur/></filter></defs><rect width="100" height="100"/><path d="M 5 5 L 15 5 L 15 15 L 5 15 Z"/></svg>',
      aabb
    );

    expect(layout).toEqual({ x: aabb.x + 5, y: aabb.y + 5, width: 10, height: 10 });
  });

  it('handles shapes composed of multiple drawables (e.g. speech bubble = bubble + pointer)', () => {
    const layout = extractTextLayout(
      '<svg><path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/><path d="M 45 50 L 50 60 L 55 50 Z"/></svg>',
      '<svg><path d="M 0 0 L 100 0 L 100 50 L 0 50 Z"/><path d="M 45 50 L 50 60 L 55 50 Z"/><path d="M 30 20 L 70 20 L 70 30 L 30 30 Z"/></svg>',
      aabb
    );

    expect(layout).toEqual({ x: aabb.x + 30, y: aabb.y + 20, width: 40, height: 10 });
  });

  it('matches the bbox of a real Figma SQUARE export (HEADER 3 fixture)', () => {
    // Outlined path captured from a real `node.exportAsync({svgOutlineText: true})`
    // on a SQUARE SWT (label "HEADER 3", Inter Bold 36).
    // We assert width/height — exact letters of the bbox come straight from
    // Figma's rasterizer, so no heuristic involved.
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

    const layout = extractTextLayout(editable, outlined, { x: 0, y: 0 });

    expect(layout).toBeDefined();
    expect(layout!.x).toBeCloseTo(45.2901, 4);
    expect(layout!.y).toBeCloseTo(50.8182, 4);
    expect(layout!.width).toBeGreaterThan(0);
    expect(layout!.height).toBeGreaterThan(0);
  });
});
