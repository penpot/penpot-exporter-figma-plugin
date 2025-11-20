import { translateAppliedTokens } from '@plugin/translators';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformVariableConsumptionMap = (
  node: SceneNode
): Pick<ShapeAttributes, 'appliedTokens'> => {
  return {
    appliedTokens: translateAppliedTokens(node.boundVariables, node)
  };
};
