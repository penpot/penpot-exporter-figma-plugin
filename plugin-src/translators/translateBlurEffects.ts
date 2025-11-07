import { generateUuid } from '@plugin/utils/generateUuid';

import type { Blur } from '@ui/lib/types/utils/blur';

export const translateBlurEffects = (effect: readonly Effect[]): Blur | undefined => {
  const blur = effect.find(effect => effect.type === 'LAYER_BLUR') as BlurEffectBase;

  if (!blur) {
    return;
  }

  return {
    id: generateUuid(),
    type: 'layer-blur',
    value: blur.radius,
    hidden: !blur.visible
  };
};
