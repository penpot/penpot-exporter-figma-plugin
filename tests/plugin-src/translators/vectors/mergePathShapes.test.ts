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

  it('merges a path with a hole into a path drawn in the same direction as its outline', () => {
    // Square with a counter-clockwise hole, like a stroke outlined into a fill
    const frame = `${square} M 2 2 L 2 8 L 8 8 L 8 2 Z`;

    expect(mergePathShapes([path(frame), path(farSquare)])?.content).toBe(`${frame} ${farSquare}`);
  });

  it('keeps a path with a hole apart from a path drawn in the opposite direction', () => {
    const frame = `${square} M 2 2 L 2 8 L 8 8 L 8 2 Z`;

    expect(mergePathShapes([path(frame), path(reversedSquare)])).toBeUndefined();
  });

  it('merges the regions of a flattened outlined icon', () => {
    // Filter icon with a cross, flattened in Figma: the funnel outline has a hole
    const funnel =
      'M 0.5 0 C 0.31 0 0.136 0.108 0.052 0.278 C -0.032 0.448 -0.013 0.652 0.102 0.803 L 6 8.552 L 6 13.833 C 6 14.015 6.098 14.182 6.257 14.27 L 9.257 15.937 C 9.412 16.023 9.601 16.021 9.754 15.931 C 9.906 15.841 10 15.677 10 15.5 L 10 8.552 L 15.898 0.803 C 16.013 0.652 16.032 0.448 15.948 0.278 C 15.864 0.108 15.69 0 15.5 0 L 0.5 0 Z ' +
      'M 6.898 8.081 L 1.509 1 L 14.491 1 L 9.102 8.081 C 9.036 8.168 9 8.274 9 8.383 L 9 14.65 L 7 13.539 L 7 8.383 C 7 8.274 6.964 8.168 6.898 8.081 Z';
    const cross =
      'M 12 11.293 C 11.805 11.098 11.488 11.098 11.293 11.293 C 11.098 11.488 11.098 11.805 11.293 12 L 12.439 13.146 L 11.293 14.293 C 11.098 14.488 11.098 14.805 11.293 15 C 11.488 15.195 11.805 15.195 12 15 L 13.146 13.854 L 14.293 15 C 14.488 15.195 14.805 15.195 15 15 C 15.195 14.805 15.195 14.488 15 14.293 L 13.854 13.146 L 15 12 C 15.195 11.805 15.195 11.488 15 11.293 C 14.805 11.098 14.488 11.098 14.293 11.293 L 13.146 12.439 L 12 11.293 Z';

    expect(mergePathShapes([path(funnel), path(cross)])?.content).toBe(`${funnel} ${cross}`);
  });
});
