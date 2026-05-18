import { describe, expect, it } from 'vitest';

import { extractTextLayout } from '@plugin/translators/shapeWithText/extractTextLayout';

const aabb = { x: 6888, y: 285 };

describe('extractTextLayout', () => {
  it('returns undefined when no <text> element is present', () => {
    expect(extractTextLayout('<svg><path d="M 0 0"/></svg>', aabb)).toBeUndefined();
  });

  it('returns undefined when the text has no tspans', () => {
    expect(extractTextLayout('<svg><text font-size="16"></text></svg>', aabb)).toBeUndefined();
  });

  it('returns undefined when font-size is missing', () => {
    expect(
      extractTextLayout('<svg><text><tspan x="10" y="20">Hi</tspan></text></svg>', aabb)
    ).toBeUndefined();
  });

  it('positions a single-line text using the centring and wrap ratios', () => {
    // fontSize 36, "Hello" = 5 chars.
    // Centre (CENTER ratio 0.55): 20 + 5 * 36 * 0.55 / 2 = 69.5
    // Width (WRAP ratio 0.7): 5 * 36 * 0.7 = 126
    // Box left: 69.5 - 63 = 6.5
    // ascender 28.8, descender 7.2 → height 36
    const layout = extractTextLayout(
      '<svg><text font-size="36"><tspan x="20" y="50">Hello</tspan></text></svg>',
      aabb
    );

    expect(layout).toBeDefined();
    expect(layout!.width).toBeCloseTo(126);
    expect(layout!.height).toBeCloseTo(36);
    expect(layout!.x).toBeCloseTo(aabb.x + 6.5);
    expect(layout!.y).toBeCloseTo(aabb.y + 50 - 28.8);
  });

  it('counts decoded XML entities instead of raw escaped source length', () => {
    // "&" decoded = 1 char.
    // Width: 1 * 10 * 0.7 = 7. Centre: 20 + 1 * 10 * 0.55 / 2 = 22.75.
    // Box left: 22.75 - 3.5 = 19.25.
    const layout = extractTextLayout(
      '<svg><text font-size="10"><tspan x="20" y="50">&amp;</tspan></text></svg>',
      aabb
    );

    expect(layout).toBeDefined();
    expect(layout!.width).toBeCloseTo(7);
    expect(layout!.x).toBeCloseTo(aabb.x + 19.25);
  });

  it('centres on the averaged per-line midpoint under the centring ratio', () => {
    // Figma "Normal left Arrow" sample.
    // line0 midpoint: 78.2881 + 12 * 36 * 0.55 / 2 = 197.09
    // line1 midpoint: 119.098 + 5 * 36 * 0.55 / 2 = 168.598
    // averaged centre: 182.844
    // width: 12 * 36 * 0.7 = 302.4
    const layout = extractTextLayout(
      '<svg><text font-size="36">' +
        '<tspan x="78.2881" y="95.0909">Normal left </tspan>' +
        '<tspan x="119.098" y="143.091">Arrow</tspan>' +
        '</text></svg>',
      aabb
    );

    expect(layout).toBeDefined();
    expect(layout!.height).toBeCloseTo(48 + 36, 0);
    expect(layout!.width).toBeCloseTo(302.4, 1);
    const centerX = layout!.x + layout!.width / 2;
    expect(centerX - aabb.x).toBeCloseTo(182.844, 1);
  });

  it('recovers a sensible centre when lines only differ by a trailing space', () => {
    // Figma "Inverted Triangle" sample with `<text transform="translate(214 112) rotate(180)">`.
    // The previous heuristic derived a tiny char-width ratio from the 1.51px
    // x-offset between lines (whose only delta is a narrow space character),
    // landing the text in the wrong half of the shape. The new averaging
    // approach lands it close to the shape's centre instead.
    const layout = extractTextLayout(
      '<svg><text transform="translate(214 112) rotate(180)" font-size="36">' +
        '<tspan x="0.551872" y="37.0909">Inverted </tspan>' +
        '<tspan x="2.05515" y="85.0909">Triangle</tspan>' +
        '</text></svg>',
      { x: 0, y: 0 }
    );

    expect(layout).toBeDefined();
    const centerX = layout!.x + layout!.width / 2;
    // Old heuristic placed the centre at aabb-local x ≈ 199.85 (upper-right
    // of the 285-wide AABB). The new heuristic lands at ≈128.55 — within
    // ~14px of the triangle centroid (142.5), matching Figma's visual centre.
    expect(centerX).toBeGreaterThan(120);
    expect(centerX).toBeLessThan(140);
  });

  it('projects the text centre through a 45° rotation in <text transform>', () => {
    // Local centre is (20 + 99/2, 50 - 28.8 + 36/2) = (69.5, 39.2).
    // After rotate(45) around the SVG origin: x' = (cx - cy) / √2, y' = (cx + cy) / √2.
    const localCx = 20 + (5 * 36 * 0.55) / 2;
    const localCy = 50 - 28.8 + 36 / 2;
    const cos = Math.cos(Math.PI / 4);
    const sin = Math.sin(Math.PI / 4);
    const expectedCx = localCx * cos - localCy * sin;
    const expectedCy = localCx * sin + localCy * cos;

    const layout = extractTextLayout(
      '<svg><text font-size="36" transform="rotate(45)">' +
        '<tspan x="20" y="50">Hello</tspan>' +
        '</text></svg>',
      aabb
    );

    expect(layout).toBeDefined();
    const centerX = layout!.x + layout!.width / 2;
    const centerY = layout!.y + layout!.height / 2;
    expect(centerX).toBeCloseTo(aabb.x + expectedCx, 2);
    expect(centerY).toBeCloseTo(aabb.y + expectedCy, 2);
    // Width/height stay axis-aligned (the parent node's rotation rotates the
    // rect around its centre downstream via transformRotationAndPosition).
    // Width uses WRAP ratio 0.7 (5 * 36 * 0.7 = 126).
    expect(layout!.width).toBeCloseTo(126);
    expect(layout!.height).toBeCloseTo(36);
  });

  it("respects the <text> element's transform (translate + rotate)", () => {
    // Rotated arrow sample: text is centered around the projected midpoint.
    const layout = extractTextLayout(
      '<svg><text transform="translate(251 154) rotate(-180)" font-size="36">' +
        '<tspan x="18.8298" y="37.0909">Rotated left </tspan>' +
        '<tspan x="65.0982" y="85.0909">Arrow</tspan>' +
        '</text></svg>',
      { x: 7261, y: 285 }
    );

    expect(layout).toBeDefined();
    // The centre of the projected rect should land inside the AABB (not at its corner).
    const centerX = layout!.x + layout!.width / 2;
    const centerY = layout!.y + layout!.height / 2;
    expect(centerX).toBeGreaterThan(7261);
    expect(centerX).toBeLessThan(7261 + 305);
    expect(centerY).toBeGreaterThan(285);
    expect(centerY).toBeLessThan(285 + 212);
  });
});
