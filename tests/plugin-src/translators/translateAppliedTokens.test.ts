import { beforeEach, describe, expect, it } from 'vitest';

import { variables } from '@plugin/libraries';
import { translateAppliedTokens } from '@plugin/translators/translateAppliedTokens';

const createNode = (overrides: Partial<SceneNode> = {}): SceneNode =>
  ({
    type: 'VECTOR',
    strokes: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1, visible: true }],
    ...overrides
  }) as unknown as SceneNode;

describe('translateAppliedTokens', () => {
  beforeEach(() => {
    variables.clear();
  });

  it('maps a uniform stroke weight token to strokeWidth', () => {
    variables.set('var-1.borderWidth', 'Border.width');

    const result = translateAppliedTokens({ strokeWeight: { id: 'var-1' } }, createNode());

    expect(result).toEqual({ strokeWidth: 'Border.width' });
  });

  it.each([
    ['strokeTopWeight', 'strokeWidthTop'],
    ['strokeRightWeight', 'strokeWidthRight'],
    ['strokeBottomWeight', 'strokeWidthBottom'],
    ['strokeLeftWeight', 'strokeWidthLeft']
  ])('maps %s to %s', (figmaProp, penpotProp) => {
    variables.set('var-1.borderWidth', 'Border.width');

    const result = translateAppliedTokens({ [figmaProp]: { id: 'var-1' } }, createNode());

    expect(result).toEqual({ [penpotProp]: 'Border.width' });
  });

  it('maps all per-side stroke weights when bound individually', () => {
    variables.set('var-t.borderWidth', 'Border.top');
    variables.set('var-r.borderWidth', 'Border.right');
    variables.set('var-b.borderWidth', 'Border.bottom');
    variables.set('var-l.borderWidth', 'Border.left');

    const result = translateAppliedTokens(
      {
        strokeTopWeight: { id: 'var-t' },
        strokeRightWeight: { id: 'var-r' },
        strokeBottomWeight: { id: 'var-b' },
        strokeLeftWeight: { id: 'var-l' }
      },
      createNode()
    );

    expect(result).toEqual({
      strokeWidthTop: 'Border.top',
      strokeWidthRight: 'Border.right',
      strokeWidthBottom: 'Border.bottom',
      strokeWidthLeft: 'Border.left'
    });
  });

  it('ignores a bound variable not registered in the variables map', () => {
    const result = translateAppliedTokens({ strokeWeight: { id: 'var-unknown' } }, createNode());

    expect(result).toEqual({});
  });

  it('ignores stroke weight token when node has no strokes', () => {
    variables.set('var-1.borderWidth', 'Border.width');

    const node = createNode({ strokes: [] });
    const result = translateAppliedTokens({ strokeWeight: { id: 'var-1' } }, node);

    expect(result).toEqual({});
  });
});
