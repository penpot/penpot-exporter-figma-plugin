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

const createShape = (type: SceneNode['type'], id: string = '1:2'): SceneNode =>
  ({ id, type, parent: null }) as unknown as SceneNode;

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

  it('maps layout grids to the guides group', () => {
    overrides.set('1:2', ['layoutGrids']);

    expect(translateTouched(createShape('FRAME'))).toContain('grids-group');
  });

  it('maps the wrap spacing and alignment to the gap and align content', () => {
    overrides.set('1:2', ['counterAxisSpacing']);

    expect(translateTouched(createShape('FRAME'))).toEqual(['layout-gap']);

    overrides.set('1:2', ['counterAxisAlignContent']);

    expect(translateTouched(createShape('FRAME'))).toEqual(['layout-align-content', 'layout-gap']);
  });

  it.each(['STAR', 'POLYGON'] as const)(
    'marks the content of a %s with an overridden point count as touched',
    type => {
      overrides.set('1:2', ['pointCount']);

      expect(translateTouched(createShape(type))).toEqual(['geometry-group', 'content-group']);
    }
  );

  it('marks the content of a path with overridden corners as touched', () => {
    overrides.set('1:2', ['innerRadius', 'cornerRadius']);

    expect(translateTouched(createShape('STAR'))).toEqual(['radius-group', 'content-group']);
  });

  it('marks the content of a path inside a resized instance as touched', () => {
    overrides.set('1:2', ['width']);

    expect(translateTouched(createShape('VECTOR', 'I1:2;3:4'))).toEqual([
      'geometry-group',
      'content-group'
    ]);
  });

  it('does not mark the content of a path with non geometric overrides', () => {
    overrides.set('1:2', ['fills']);

    expect(translateTouched(createShape('VECTOR'))).toEqual(['fill-group']);
  });

  it('does not mark the content of a resized non path shape', () => {
    overrides.set('1:2', ['width', 'cornerRadius']);

    expect(translateTouched(createShape('RECTANGLE'))).toEqual(['geometry-group', 'radius-group']);
  });
});
