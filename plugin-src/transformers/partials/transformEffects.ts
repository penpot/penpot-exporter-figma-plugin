import {
  translateBackgroundBlurEffects,
  translateBlurEffects,
  translateShadowEffects
} from '@plugin/translators';
import { exportsBackgroundBlur } from '@plugin/utils';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformEffects = (
  node: BlendMixin
): Pick<ShapeAttributes, 'shadow' | 'blur' | 'backgroundBlur'> => {
  return {
    shadow: translateShadowEffects(node.effects),
    blur: translateBlurEffects(node.effects),
    backgroundBlur: exportsBackgroundBlur()
      ? translateBackgroundBlurEffects(node.effects)
      : undefined
  };
};
