import { generateUuid, rgbToHex } from '@plugin/utils';

import type { Shadow, ShadowStyle } from '@ui/lib/types/utils/shadow';

export const isShadowEffect = (effect: Effect): effect is DropShadowEffect | InnerShadowEffect => {
  return effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW';
};

// Returns shadow effects in Figma's paint order (reverse of the effects array).
export const shadowEffectsInPaintOrder = (
  effects: readonly Effect[]
): (DropShadowEffect | InnerShadowEffect)[] => effects.filter(isShadowEffect).reverse();

export const translateShadowEffect = (effect: DropShadowEffect | InnerShadowEffect): Shadow => {
  return {
    id: generateUuid(),
    style: translateShadowType(effect),
    offsetX: effect.offset.x,
    offsetY: effect.offset.y,
    blur: effect.radius,
    spread: effect.spread ?? 0,
    hidden: !effect.visible,
    color: {
      color: rgbToHex(effect.color),
      opacity: effect.color.a
    }
  };
};

export const translateShadowEffects = (effects: readonly Effect[]): Shadow[] =>
  shadowEffectsInPaintOrder(effects).map(translateShadowEffect);

const translateShadowType = (effect: DropShadowEffect | InnerShadowEffect): ShadowStyle => {
  switch (effect.type) {
    case 'DROP_SHADOW':
      return 'drop-shadow';
    case 'INNER_SHADOW':
      return 'inner-shadow';
  }
};
