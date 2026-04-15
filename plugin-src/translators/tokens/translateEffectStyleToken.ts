import { translateStyleTokenName } from '@plugin/translators/tokens/translateStyleTokenName';
import { rgbToString } from '@plugin/utils/rgbToString';

import type { ShadowTokenValue, Token } from '@ui/lib/types/shapes/tokens';

const isShadowEffect = (effect: Effect): effect is DropShadowEffect | InnerShadowEffect => {
  return effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW';
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
  const shadows = style.effects.filter(isShadowEffect);

  if (shadows.length === 0) return null;

  const name = translateStyleTokenName(style.name);

  return [
    name,
    {
      $value: shadows.map(translateShadowEffect),
      $type: 'shadow' as const,
      $description: style.description
    }
  ];
};
