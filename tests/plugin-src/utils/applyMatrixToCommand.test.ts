import type { Command } from 'svg-path-parser';
import { describe, expect, it } from 'vitest';

import { applyMatrixToCommand } from '@plugin/utils/applyMatrixToCommand';

const TRANSLATE_10_20: Transform = [
  [1, 0, 10],
  [0, 1, 20]
];

const ROTATE_90: Transform = [
  [0, -1, 0],
  [1, 0, 0]
];

describe('applyMatrixToCommand', () => {
  it('translates moveto', () => {
    const cmd: Command = { command: 'moveto', code: 'M', relative: false, x: 3, y: 4 };
    const out = applyMatrixToCommand(cmd, TRANSLATE_10_20);
    expect(out).toEqual({ command: 'moveto', code: 'M', relative: false, x: 13, y: 24 });
  });

  it('translates lineto', () => {
    const cmd: Command = { command: 'lineto', code: 'L', relative: false, x: 1, y: 2 };
    const out = applyMatrixToCommand(cmd, TRANSLATE_10_20);
    expect(out).toEqual({ command: 'lineto', code: 'L', relative: false, x: 11, y: 22 });
  });

  it('rotates curveto end + both control points', () => {
    const cmd: Command = {
      command: 'curveto',
      code: 'C',
      relative: false,
      x1: 1,
      y1: 0,
      x2: 2,
      y2: 0,
      x: 3,
      y: 0
    };
    const out = applyMatrixToCommand(cmd, ROTATE_90);
    if (out.command !== 'curveto') throw new Error('expected curveto');
    expect(out.x1).toBeCloseTo(0);
    expect(out.y1).toBeCloseTo(1);
    expect(out.x2).toBeCloseTo(0);
    expect(out.y2).toBeCloseTo(2);
    expect(out.x).toBeCloseTo(0);
    expect(out.y).toBeCloseTo(3);
  });

  it('returns closepath unchanged', () => {
    const cmd: Command = { command: 'closepath', code: 'Z', relative: false };
    expect(applyMatrixToCommand(cmd, TRANSLATE_10_20)).toEqual(cmd);
  });
});
