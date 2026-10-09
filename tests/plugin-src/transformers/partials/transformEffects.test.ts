import { beforeEach, describe, expect, it } from 'vitest';

import { transformEffects } from '@plugin/transformers/partials';
import { setExportOptions } from '@plugin/utils';

const node = {
  effects: [
    { type: 'LAYER_BLUR', blurType: 'NORMAL', radius: 4, visible: true },
    { type: 'BACKGROUND_BLUR', blurType: 'NORMAL', radius: 12, visible: true }
  ]
} as unknown as BlendMixin;

describe('transformEffects', () => {
  beforeEach(() => {
    setExportOptions({ backgroundBlur: false });
  });

  it('drops the background blur when the option is off', () => {
    const { blur, backgroundBlur } = transformEffects(node);

    expect(blur).toMatchObject({ type: 'layer-blur', value: 4 });
    expect(backgroundBlur).toBeUndefined();
  });

  it('keeps the background blur when the option is on', () => {
    setExportOptions({ backgroundBlur: true });

    const { blur, backgroundBlur } = transformEffects(node);

    expect(blur).toMatchObject({ type: 'layer-blur', value: 4 });
    expect(backgroundBlur).toMatchObject({ type: 'background-blur', value: 12 });
  });
});
