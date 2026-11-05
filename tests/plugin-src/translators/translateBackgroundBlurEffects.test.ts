import { describe, expect, it } from 'vitest';

import { translateBackgroundBlurEffects } from '@plugin/translators';

const backgroundBlur = (overrides: Partial<Effect> = {}): Effect =>
  ({
    type: 'BACKGROUND_BLUR',
    blurType: 'NORMAL',
    radius: 12,
    visible: true,
    ...overrides
  }) as Effect;

const layerBlur = (): Effect =>
  ({ type: 'LAYER_BLUR', blurType: 'NORMAL', radius: 4, visible: true }) as Effect;

describe('translateBackgroundBlurEffects', () => {
  it('translates a background blur into a Penpot background-blur', () => {
    const blur = translateBackgroundBlurEffects([backgroundBlur()]);

    expect(blur).toMatchObject({
      type: 'background-blur',
      value: 12,
      hidden: false
    });
    expect(blur?.id).toEqual(expect.any(String));
  });

  it('marks an invisible background blur as hidden', () => {
    expect(translateBackgroundBlurEffects([backgroundBlur({ visible: false })])).toMatchObject({
      hidden: true
    });
  });

  it('flattens a progressive background blur to its end radius', () => {
    const blur = translateBackgroundBlurEffects([
      {
        type: 'BACKGROUND_BLUR',
        blurType: 'PROGRESSIVE',
        radius: 20,
        startRadius: 0,
        startOffset: { x: 0, y: 0 },
        endOffset: { x: 0, y: 1 },
        visible: true
      } as Effect
    ]);

    expect(blur).toMatchObject({ type: 'background-blur', value: 20 });
  });

  it('returns undefined when there is no background blur', () => {
    expect(translateBackgroundBlurEffects([])).toBeUndefined();
    expect(translateBackgroundBlurEffects([layerBlur()])).toBeUndefined();
  });

  it('picks the background blur when a layer blur is also present', () => {
    expect(translateBackgroundBlurEffects([layerBlur(), backgroundBlur()])).toMatchObject({
      type: 'background-blur',
      value: 12
    });
  });
});
