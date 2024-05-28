import { translateBlurEffects, translateShadowEffects } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformEffects = (node: BlendMixin): Partial<ShapeAttributes> => {
  return {
    shadow: translateShadowEffects(node.effects),
    blur: translateBlurEffects(node.effects)
  };
};
