import { translateStyleTokenName } from '@plugin/translators/tokens/translateStyleTokenName';
import { rgbToString } from '@plugin/utils/rgbToString';

import type { ShadowTokenValue, Token } from '@ui/lib/types/shapes/tokens';

const isShadowEffect = (effect: Effect): effect is DropShadowEffect | InnerShadowEffect => {
  return effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW';
};

const translateShadowEffect = (effect: DropShadowEffect | InnerShadowEffect): ShadowTokenValue => {
  return {
    color: rgbToString({ ...effect.color, a: effect.color.a }),
    x: effect.offset.x,
    y: effect.offset.y,
    blur: effect.radius,
    spread: effect.spread ?? 0,
    type: effect.type === 'DROP_SHADOW' ? 'drop' : 'inset'
  };
};

export const translateEffectStyleToken = (style: EffectStyle): [string, Token][] => {
  const shadows = style.effects.filter(isShadowEffect);

  return shadows.map(effect => {
    const name = translateStyleTokenName(style.name);

    return [
      name,
      {
        $value: translateShadowEffect(effect),
        $type: 'shadow' as const,
        $description: style.description
      }
    ];
  });
};
