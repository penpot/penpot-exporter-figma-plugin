import { describe, expect, it } from 'vitest';

import { IDENTITY, parseSvgTransform } from '@plugin/translators/shapeWithText/parseSvgTransform';
import { applyMatrixToPoint } from '@plugin/utils';

const project = (m: number[][], x: number, y: number): number[] => applyMatrixToPoint(m, [x, y]);

describe('parseSvgTransform', () => {
  it('returns identity for missing or empty input', () => {
    expect(parseSvgTransform(undefined)).toEqual(IDENTITY);
    expect(parseSvgTransform('')).toEqual(IDENTITY);
  });

  it('parses translate(tx, ty)', () => {
    expect(project(parseSvgTransform('translate(10, 20)'), 1, 2)).toEqual([11, 22]);
  });

  it('parses rotate(angle) around the origin', () => {
    const [x, y] = project(parseSvgTransform('rotate(90)'), 10, 0);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(10);
  });

  it('parses rotate(angle cx cy) around an arbitrary pivot', () => {
    // 90° around (5, 0): (10, 0) → (5, 5)
    const [x, y] = project(parseSvgTransform('rotate(90 5 0)'), 10, 0);
    expect(x).toBeCloseTo(5);
    expect(y).toBeCloseTo(5);
  });

  it('parses matrix(a b c d e f)', () => {
    expect(project(parseSvgTransform('matrix(2 0 0 3 100 200)'), 1, 1)).toEqual([102, 203]);
  });

  it('composes multiple functions left-to-right', () => {
    // translate then rotate: rotate applied first (closest to point), then translate
    const [x, y] = project(parseSvgTransform('translate(10 20) rotate(90)'), 1, 0);
    expect(x).toBeCloseTo(10);
    expect(y).toBeCloseTo(21);
  });

  it('handles the Figma form: rotate(-45 0 541.644)', () => {
    // The pivot must stay fixed.
    const [x, y] = project(parseSvgTransform('rotate(-45 0 541.644)'), 0, 541.644);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(541.644);
  });
});
