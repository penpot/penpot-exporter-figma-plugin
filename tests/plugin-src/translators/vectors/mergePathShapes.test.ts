import { describe, expect, it } from 'vitest';

import { mergePathShapes } from '@plugin/translators/vectors/mergePathShapes';

import type { PathShape } from '@ui/lib/types/shapes/pathShape';

const black = [{ fillColor: '#000000', fillOpacity: 1 }];

// Clockwise squares in screen coordinates (y down)
const square = 'M 0 0 L 10 0 L 10 10 L 0 10 Z';
const farSquare = 'M 20 20 L 30 20 L 30 30 L 20 30 Z';
const reversedSquare = 'M 20 20 L 20 30 L 30 30 L 30 20 Z';

const path = (content: string, overrides: Partial<PathShape> = {}): PathShape => ({
  type: 'path',
  name: 'svg-path',
  id: `id-${content}`,
  content,
  svgAttrs: { fillRule: 'nonzero' },
  fills: black,
  strokes: [],
  ...overrides
});

describe('mergePathShapes', () => {
  it('merges paths with the same fill drawn in the same direction', () => {
    const merged = mergePathShapes([path(square), path(farSquare)]);

    expect(merged).toEqual(path(square, { content: `${square} ${farSquare}` }));
  });

  it('merges curved paths drawn in the same direction', () => {
    const circle = 'M 0 5 C 0 2, 2 0, 5 0 C 8 0, 10 2, 10 5 C 10 8, 8 10, 5 10 C 2 10, 0 8, 0 5 Z';

    expect(mergePathShapes([path(circle), path(farSquare)])?.content).toBe(
      `${circle} ${farSquare}`
    );
  });

  it('keeps paths drawn in opposite directions apart', () => {
    expect(mergePathShapes([path(square), path(reversedSquare)])).toBeUndefined();
  });

  it('keeps paths with different fills apart', () => {
    const red = [{ fillColor: '#ff0000', fillOpacity: 1 }];

    expect(mergePathShapes([path(square), path(farSquare, { fills: red })])).toBeUndefined();
  });

  it('keeps paths with strokes apart', () => {
    const strokes = [{ strokeColor: '#000000', strokeWidth: 1 }];

    expect(
      mergePathShapes([path(square, { strokes }), path(farSquare, { strokes })])
    ).toBeUndefined();
  });

  it('keeps evenodd paths apart', () => {
    const evenodd = { svgAttrs: { fillRule: 'evenodd' as const } };

    expect(mergePathShapes([path(square, evenodd), path(farSquare, evenodd)])).toBeUndefined();
  });

  it('keeps paths with several subpaths apart', () => {
    expect(mergePathShapes([path(`${square} ${farSquare}`), path(farSquare)])).toBeUndefined();
  });
});
