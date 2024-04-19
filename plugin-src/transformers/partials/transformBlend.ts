import { translateBlendMode } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

export const transformBlend = (
  node: SceneNodeMixin & MinimalBlendMixin
): Partial<ShapeAttributes> => {
  return {
    blendMode: translateBlendMode(node.blendMode),
    opacity: !node.visible ? 0 : node.opacity // @TODO: check this. If we use the property hidden and it's hidden, it won't export
  };
};
