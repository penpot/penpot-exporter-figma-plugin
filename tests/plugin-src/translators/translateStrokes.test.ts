import { describe, expect, it } from 'vitest';

import { translateStrokes } from '@plugin/translators/translateStrokes';

const mixed = Symbol('mixed');
// @ts-expect-error - Mocking global figma object
global.figma = { mixed };

const createNode = (
  overrides: Record<string, unknown> = {}
): MinimalStrokesMixin & IndividualStrokesMixin =>
  ({
    strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1, visible: true }],
    strokeWeight: 2,
    strokeTopWeight: 2,
    strokeRightWeight: 2,
    strokeBottomWeight: 2,
    strokeLeftWeight: 2,
    strokeAlign: 'INSIDE',
    dashPattern: [],
    ...overrides
  }) as unknown as MinimalStrokesMixin & IndividualStrokesMixin;

describe('translateStrokes', () => {
  it('should use a single width when every side is the same', () => {
    const [stroke] = translateStrokes(createNode());

    expect(stroke.strokeWidth).toBe(2);
    expect(stroke.strokePerSide).toBeUndefined();
  });

  it('should export the width of each side when they differ', () => {
    const [stroke] = translateStrokes(
      createNode({
        strokeWeight: mixed,
        strokeTopWeight: 0,
        strokeRightWeight: 1,
        strokeBottomWeight: 4,
        strokeLeftWeight: 2
      })
    );

    expect(stroke).toMatchObject({
      strokeWidth: 4,
      strokePerSide: true,
      strokeWidthTop: 0,
      strokeWidthRight: 1,
      strokeWidthBottom: 4,
      strokeWidthLeft: 2
    });
  });
});
