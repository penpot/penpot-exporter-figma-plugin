import { registerComponentProperties } from '@plugin/registerComponentProperties';
import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformComponentSetStrokesAndCornerRadius,
  transformConstraints,
  transformDimension,
  transformEffects,
  transformFigmaIds,
  transformFills,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode
} from '@plugin/transformers/partials';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';

export const transformComponentSetNode = async (node: ComponentSetNode): Promise<FrameShape> => {
  registerComponentProperties(node);

  return {
    type: 'frame',
    name: node.name,
    showContent: !node.clipsContent,
    isVariantContainer: true,
    ...transformFigmaIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node, true),
    ...transformConstraints(node),
    ...transformOverrides(node),
    ...transformAutoLayout(node),
    ...transformComponentSetStrokesAndCornerRadius(node),
    ...(await transformChildren(node))
  };
};
