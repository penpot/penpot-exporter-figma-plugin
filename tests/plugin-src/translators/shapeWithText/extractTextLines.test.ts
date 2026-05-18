import { describe, expect, it } from 'vitest';

import { extractTextLines } from '@plugin/translators/shapeWithText/extractTextLines';

describe('extractTextLines', () => {
  it('returns an empty list when the SVG has no <text> element', () => {
    expect(extractTextLines('<svg><rect width="10" height="10"/></svg>')).toEqual([]);
  });

  it('returns an empty list when the <text> element has no <tspan> children', () => {
    expect(extractTextLines('<svg><text font-size="16"></text></svg>')).toEqual([]);
  });

  it('extracts a single line', () => {
    expect(extractTextLines('<svg><text><tspan x="0" y="10">Hello</tspan></text></svg>')).toEqual([
      'Hello'
    ]);
  });

  it('extracts multiple tspan lines in document order', () => {
    expect(
      extractTextLines(
        '<svg><text>' +
          '<tspan x="50" y="77">INTER </tspan>' +
          '<tspan x="74" y="173">TWO-L</tspan>' +
          '</text></svg>'
      )
    ).toEqual(['INTER ', 'TWO-L']);
  });

  it('decodes common XML entities', () => {
    expect(
      extractTextLines(
        '<svg><text>' +
          '<tspan x="0" y="0">A &amp; B</tspan>' +
          '<tspan x="0" y="20">&lt;tag&gt;</tspan>' +
          '<tspan x="0" y="40">&quot;quoted&quot;</tspan>' +
          '<tspan x="0" y="60">&#65;</tspan>' +
          '<tspan x="0" y="80">&#x4E2D;</tspan>' +
          '</text></svg>'
      )
    ).toEqual(['A & B', '<tag>', '"quoted"', 'A', '中']);
  });

  it('ignores tspans inside <defs>', () => {
    expect(
      extractTextLines(
        '<svg><defs><text><tspan>defs content</tspan></text></defs>' +
          '<text><tspan x="0" y="0">real content</tspan></text>' +
          '</svg>'
      )
    ).toEqual(['real content']);
  });
});
