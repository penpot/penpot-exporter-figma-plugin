import { generateUuid } from '@plugin/utils';

import type { BackgroundBlur } from '@ui/lib/types/utils/backgroundBlur';

export const translateBackgroundBlurEffects = (
  effects: readonly Effect[]
): BackgroundBlur | undefined => {
  // Penpot only stores a single radius, so a progressive background blur is
  // flattened to its end radius, the same way layer blurs are handled.
  const blur = effects.find(effect => effect.type === 'BACKGROUND_BLUR') as
    | BlurEffectBase
    | undefined;

  if (!blur) {
    return;
  }

  return {
    id: generateUuid(),
    type: 'background-blur',
    value: blur.radius,
    hidden: !blur.visible
  };
};
