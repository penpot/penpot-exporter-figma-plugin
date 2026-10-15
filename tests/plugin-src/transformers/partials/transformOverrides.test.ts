import { beforeEach, describe, expect, it } from 'vitest';

import { clearAllState, overrides, swappedInstances } from '@plugin/libraries';
import {
  transformMaskOverrides,
  transformOverrides
} from '@plugin/transformers/partials/transformOverrides';
import { generateDeterministicUuid } from '@plugin/utils';

const swapSlot = generateDeterministicUuid('3:4');

const mask = {
  id: '1:2',
  type: 'INSTANCE',
  componentPropertyReferences: { visible: 'Show mask#1:0' }
} as unknown as SceneNode;

describe('transformMaskOverrides', () => {
  beforeEach(() => {
    clearAllState();
    overrides.set('1:2', ['name', 'visible']);
    swappedInstances.set('1:2', swapSlot);
  });

  it('keeps the overrides of the mask without its swap slot', () => {
    expect(transformOverrides(mask).touched).toContain(`swap-slot-${swapSlot}`);
    expect(transformMaskOverrides(mask)).toEqual({
      touched: ['name-group', 'visibility-group', 'mask-group'],
      componentPropertyReferences: { visible: 'Show mask#1:0' }
    });
  });

  it('marks the mask of the group as touched when the mask visibility is set by a property', () => {
    overrides.clear();

    expect(transformMaskOverrides(mask).touched).toEqual(['mask-group']);
  });

  it('keeps the mask of the group when the mask visibility does not change', () => {
    overrides.set('1:2', ['name']);

    const fixedMask = { ...mask, componentPropertyReferences: null } as unknown as SceneNode;

    expect(transformMaskOverrides(fixedMask).touched).toEqual(['name-group']);
  });
});
