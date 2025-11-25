import {
  transformAutoLayout,
  transformBlend,
  transformChildren,
  transformComponentSetStrokesAndCornerRadius,
  transformConstraints,
  transformDimension,
  transformEffects,
  transformFills,
  transformIds,
  transformLayoutAttributes,
  transformOverrides,
  transformProportion,
  transformRotationAndPosition,
  transformSceneNode,
  transformVariableConsumptionMap
} from '@plugin/transformers/partials';
import {
  registerComponentProperties,
  registerVariantProperties
} from '@plugin/translators/components';

import type { FrameShape } from '@ui/lib/types/shapes/frameShape';

export const transformComponentSetNode = async (node: ComponentSetNode): Promise<FrameShape> => {
  registerComponentProperties(node);
  registerVariantProperties(node);

  return {
    type: 'frame',
    name: node.name,
    showContent: !node.clipsContent,
    isVariantContainer: true,
    ...transformIds(node),
    ...transformFills(node),
    ...transformEffects(node),
    ...transformDimension(node),
    ...transformRotationAndPosition(node),
    ...transformSceneNode(node),
    ...transformBlend(node),
    ...transformProportion(node),
    ...transformLayoutAttributes(node, true),
    ...transformConstraints(node),
    ...transformAutoLayout(node),
    ...transformComponentSetStrokesAndCornerRadius(node),
    ...transformVariableConsumptionMap(node),
    ...(await transformChildren(node)),
    ...transformOverrides(node)
  };
};
