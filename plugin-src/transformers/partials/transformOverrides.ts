import { translateTouched } from '@plugin/translators';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformOverrides = (
  node: SceneNode
): Pick<ShapeAttributes, 'touched' | 'componentPropertyReferences'> => {
  return {
    touched: translateTouched(node),
    componentPropertyReferences: node.componentPropertyReferences
  };
};
