import { translateBlendMode } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformBlend = (
  node: SceneNodeMixin & MinimalBlendMixin
): Pick<ShapeAttributes, 'blendMode' | 'opacity'> => {
  return {
    blendMode: translateBlendMode(node.blendMode),
    opacity: !node.visible ? 0 : node.opacity // @TODO: check this. If we use the property hidden and it's hidden, it won't export
  };
};
