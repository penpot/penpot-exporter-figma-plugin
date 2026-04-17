import { sanitizeUniqueName } from '@plugin/translators/tokens/sanitizeUniqueName';
import { rgbToString } from '@plugin/utils/rgbToString';

import type { ShadowTokenValue, Token } from '@ui/lib/types/shapes/tokens';

const isShadowEffect = (effect: Effect): effect is DropShadowEffect | InnerShadowEffect => {
  return effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW';
};

const isVisibleEffect = (effect: Effect): boolean => {
  return effect.visible !== false;
};

const translateShadowEffect = (effect: DropShadowEffect | InnerShadowEffect): ShadowTokenValue => {
  return {
    color: rgbToString(effect.color),
    x: String(effect.offset.x),
    y: String(effect.offset.y),
    blur: String(effect.radius),
    spread: String(effect.spread ?? 0),
    inset: effect.type === 'INNER_SHADOW'
  };
};

export const translateEffectStyleToken = (style: EffectStyle): [string, Token] | null => {
  const shadows = style.effects.filter(isShadowEffect).filter(isVisibleEffect);

  if (shadows.length === 0) return null;

  const name = sanitizeUniqueName(style.name);

  return [
    name,
    {
      // Figma applies shadows in reverse order, matching the existing shape export path.
      $value: shadows.reverse().map(translateShadowEffect),
      $type: 'shadow' as const,
      $description: style.description
    }
  ];
};
