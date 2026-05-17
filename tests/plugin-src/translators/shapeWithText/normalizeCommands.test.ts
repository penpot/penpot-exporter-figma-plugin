import { parseSVG } from 'svg-path-parser';
import { describe, expect, it } from 'vitest';

import { normalizeCommands } from '@plugin/translators/shapeWithText/normalizeCommands';

const summarize = (path: string): string[] => normalizeCommands(parseSVG(path)).map(c => c.command);

describe('normalizeCommands', () => {
  it('expands H/V to lineto with absolute coordinates', () => {
    expect(summarize('M 0 0 H 10 V 20 H 0 Z')).toEqual([
      'moveto',
      'lineto',
      'lineto',
      'lineto',
      'closepath'
    ]);
  });

  it('keeps M/L/C/Z unchanged', () => {
    expect(summarize('M 0 0 L 10 0 C 20 0 30 10 30 20 Z')).toEqual([
      'moveto',
      'lineto',
      'curveto',
      'closepath'
    ]);
  });

  it('converts smooth curveto into a curveto by reflecting the previous control point', () => {
    // After C 10,0 20,10 30,10 the reflected x1 for S is (2*30 - 20, 2*10 - 10) = (40,10)
    const out = normalizeCommands(parseSVG('M 0 0 C 10 0 20 10 30 10 S 60 30 70 30'));
    const smooth = out[2];
    if (smooth.command !== 'curveto') throw new Error('expected curveto');
    expect(smooth.x1).toBe(40);
    expect(smooth.y1).toBe(10);
    expect(smooth.x2).toBe(60);
    expect(smooth.y2).toBe(30);
  });

  it('converts quadratic curveto into a curveto', () => {
    const out = normalizeCommands(parseSVG('M 0 0 Q 10 10 20 0'));
    const cubic = out[1];
    if (cubic.command !== 'curveto') throw new Error('expected curveto');
    // c1 = start + 2/3 * (q - start) = (0,0) + 2/3 * (10,10) ≈ (6.66, 6.66)
    expect(cubic.x1).toBeCloseTo(20 / 3);
    expect(cubic.y1).toBeCloseTo(20 / 3);
    // c2 = end + 2/3 * (q - end) = (20,0) + 2/3 * (-10,10) ≈ (13.33, 6.66)
    expect(cubic.x2).toBeCloseTo(20 - 20 / 3);
    expect(cubic.y2).toBeCloseTo(20 / 3);
    expect(cubic.x).toBe(20);
    expect(cubic.y).toBe(0);
  });

  it('treats relative commands as absolute after normalization', () => {
    // m 10 10 h 20 v 20 z  →  M(10,10) L(30,10) L(30,30) Z
    const out = normalizeCommands(parseSVG('m 10 10 h 20 v 20 z'));
    expect(out.map(c => c.command)).toEqual(['moveto', 'lineto', 'lineto', 'closepath']);

    const lineto1 = out[1];
    if (lineto1.command !== 'lineto') throw new Error('expected lineto');
    expect(lineto1.x).toBe(30);
    expect(lineto1.y).toBe(10);

    const lineto2 = out[2];
    if (lineto2.command !== 'lineto') throw new Error('expected lineto');
    expect(lineto2.x).toBe(30);
    expect(lineto2.y).toBe(30);
  });

  it('degrades arcs to a straight line so geometry never silently disappears', () => {
    const out = normalizeCommands(parseSVG('M 0 0 A 10 10 0 0 1 20 0'));
    expect(out.map(c => c.command)).toEqual(['moveto', 'lineto']);
  });
});
