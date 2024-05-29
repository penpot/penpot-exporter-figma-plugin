import { translateBlurEffects, translateShadowEffects } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformEffects = (node: BlendMixin): Pick<ShapeAttributes, 'shadow' | 'blur'> => {
  return {
    shadow: translateShadowEffects(node.effects),
    blur: translateBlurEffects(node.effects)
  };
};
