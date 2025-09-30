import { overrides } from '@plugin/libraries';
import { translateTouched } from '@plugin/translators';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformOverrides = (
  node: SceneNode
): Pick<ShapeAttributes, 'touched' | 'componentPropertyReferences'> => {
  return {
    touched: translateTouched(overrides.get(node.id)),
    componentPropertyReferences: node.componentPropertyReferences
  };
};
