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

  it('positions a single-line text using the fallback char-width ratio', () => {
    // fontSize 36, "Hello" = 5 chars * 36 * 0.55 = 99 wide
    // ascender 28.8, descender 7.2 → height 36
    const layout = extractTextLayout(
      '<svg><text font-size="36"><tspan x="20" y="50">Hello</tspan></text></svg>',
      aabb
    );

    expect(layout).toBeDefined();
    expect(layout!.width).toBeCloseTo(99);
    expect(layout!.height).toBeCloseTo(36);
    // tspan.x is treated as the start of the only line; with the fallback ratio
    // applied to a single tspan, the derived width matches the fallback so the
    // box left aligns to tspan.x.
    expect(layout!.x).toBeCloseTo(aabb.x + 20);
    expect(layout!.y).toBeCloseTo(aabb.y + 50 - 28.8);
  });

  it('counts decoded XML entities instead of raw escaped source length', () => {
    const layout = extractTextLayout(
      '<svg><text font-size="10"><tspan x="20" y="50">&amp;</tspan></text></svg>',
      aabb
    );

    expect(layout).toBeDefined();
    expect(layout!.width).toBeCloseTo(5.5);
    expect(layout!.x).toBeCloseTo(aabb.x + 20);
  });

  it('preserves the derived centre while floors the wrap width to the fallback', () => {
    // Mirrors the Figma "Normal left Arrow" sample. Lines centred under the
    // derived ratio share a centre; width is floored to fallback*longestChars*fontSize
    // so Penpot's real glyph rendering doesn't over-wrap.
    const layout = extractTextLayout(
      '<svg><text font-size="36">' +
        '<tspan x="78.2881" y="95.0909">Normal left </tspan>' +
        '<tspan x="119.098" y="143.091">Arrow</tspan>' +
        '</text></svg>',
      aabb
    );

    expect(layout).toBeDefined();
    expect(layout!.height).toBeCloseTo(48 + 36, 0);
    // longest line = 12 chars * 36 * 0.55 = 237.6
    expect(layout!.width).toBeCloseTo(237.6, 1);
    // Centre of the box should match the derived line centres.
    const centerX = layout!.x + layout!.width / 2;
    expect(centerX - aabb.x).toBeCloseTo(148.27, 0);
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
