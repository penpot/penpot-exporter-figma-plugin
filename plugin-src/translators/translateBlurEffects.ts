import { Blur } from '@ui/lib/types/utils/blur';

export const translateBlurEffects = (effect: readonly Effect[]): Blur | undefined => {
  const blur = effect.find(effect => effect.type === 'LAYER_BLUR');

  if (!blur) {
    return;
  }

  return {
    type: 'layer-blur',
    value: blur.radius,
    hidden: !blur.visible
  };
};
