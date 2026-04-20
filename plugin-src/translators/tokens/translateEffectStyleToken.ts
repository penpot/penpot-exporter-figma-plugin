import { sanitizeUniqueName } from '@plugin/translators/tokens/sanitizeUniqueName';
import { shadowEffectsInPaintOrder } from '@plugin/translators/translateShadowEffects';
import { rgbToString } from '@plugin/utils/rgbToString';

import type { ShadowTokenValue, Token } from '@ui/lib/types/shapes/tokens';

const translateShadowEffectToken = (
  effect: DropShadowEffect | InnerShadowEffect
): ShadowTokenValue => {
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
  const shadows = shadowEffectsInPaintOrder(style.effects).filter(
    effect => effect.visible !== false
  );

  if (shadows.length === 0) return null;

  const name = sanitizeUniqueName(style.name);

  return [
    name,
    {
      $value: shadows.map(translateShadowEffectToken),
      $type: 'shadow' as const,
      $description: style.description
    }
  ];
};
