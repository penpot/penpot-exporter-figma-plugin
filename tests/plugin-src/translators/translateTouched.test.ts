import { beforeEach, describe, expect, it } from 'vitest';

import { clearAllState, overrides } from '@plugin/libraries';
import { translateTouched } from '@plugin/translators/translateTouched';

const createNode = (
  layoutMode: AutoLayoutMixin['layoutMode'],
  parentLayoutMode: AutoLayoutMixin['layoutMode'] = 'NONE'
): SceneNode =>
  ({
    id: '1:2',
    type: 'INSTANCE',
    layoutMode,
    parent: { type: 'FRAME', layoutMode: parentLayoutMode }
  }) as unknown as SceneNode;

describe('translateTouched', () => {
  beforeEach(() => {
    clearAllState();
  });

  it('maps only the horizontal sizing when a horizontal layout fixes its width', () => {
    overrides.set('1:2', ['primaryAxisSizingMode']);

    expect(translateTouched(createNode('HORIZONTAL'))).toEqual(['layout-item-h-sizing']);
  });

  it('maps the primary axis sizing of a vertical layout to the vertical sizing', () => {
    overrides.set('1:2', ['primaryAxisSizingMode']);

    expect(translateTouched(createNode('VERTICAL'))).toEqual(['layout-item-v-sizing']);
  });

  it('maps the counter axis sizing of a vertical layout to the horizontal sizing', () => {
    overrides.set('1:2', ['counterAxisSizingMode']);

    expect(translateTouched(createNode('VERTICAL'))).toEqual(['layout-item-h-sizing']);
  });

  it('maps layout grow to the parent primary axis', () => {
    overrides.set('1:2', ['layoutGrow']);

    expect(translateTouched(createNode('NONE', 'HORIZONTAL'))).toEqual(['layout-item-h-sizing']);
    expect(translateTouched(createNode('NONE', 'VERTICAL'))).toEqual(['layout-item-v-sizing']);
  });

  it('maps layout align to the parent counter axis', () => {
    overrides.set('1:2', ['layoutAlign']);

    expect(translateTouched(createNode('NONE', 'HORIZONTAL'))).toEqual([
      'layout-item-align-self',
      'layout-item-v-sizing'
    ]);
    expect(translateTouched(createNode('NONE', 'VERTICAL'))).toEqual([
      'layout-item-align-self',
      'layout-item-h-sizing'
    ]);
  });
});
