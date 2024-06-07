import { translateBlendMode } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformBlend = (
  node: SceneNodeMixin & MinimalBlendMixin
): Pick<ShapeAttributes, 'blendMode' | 'hidden' | 'opacity'> => {
  return {
    blendMode: translateBlendMode(node.blendMode),
    hidden: !node.visible,
    opacity: node.opacity
  };
};
