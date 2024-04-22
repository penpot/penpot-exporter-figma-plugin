import { rgbToHex } from '@plugin/utils';

import { Shadow, ShadowStyle } from '@ui/lib/types/utils/shadow';

export const translateShadowEffect = (effect: Effect): Shadow | undefined => {
  if (effect.type !== 'DROP_SHADOW' && effect.type !== 'INNER_SHADOW') {
    return;
  }

  return {
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

export const translateShadowEffects = (effects: readonly Effect[]): Shadow[] => {
  const shadows: Shadow[] = [];

  for (const effect of effects) {
    const shadow = translateShadowEffect(effect);
    if (shadow) {
      // effects are applied in reverse order in Figma, that's why we unshift
      shadows.unshift(shadow);
    }
  }

  return shadows;
};

const translateShadowType = (effect: DropShadowEffect | InnerShadowEffect): ShadowStyle => {
  switch (effect.type) {
    case 'DROP_SHADOW':
      return 'drop-shadow';
    case 'INNER_SHADOW':
      return 'inner-shadow';
  }
};
