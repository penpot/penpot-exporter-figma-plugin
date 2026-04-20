import { translateAppliedStyleTokens, translateAppliedTokens } from '@plugin/translators';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformVariableConsumptionMap = (
  node: SceneNode
): Pick<ShapeAttributes, 'appliedTokens'> => {
  return {
    appliedTokens: {
      ...translateAppliedStyleTokens(node),
      ...translateAppliedTokens(node.boundVariables, node)
    }
  };
};
