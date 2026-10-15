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

// The mask group takes its attributes from the mask, so it keeps the mask overrides too, but not its
// swap slot, which belongs to the mask itself
export const transformMaskOverrides = (
  node: SceneNode
): Pick<ShapeAttributes, 'touched' | 'componentPropertyReferences'> => {
  const { touched, componentPropertyReferences } = transformOverrides(node);

  return {
    touched: touched?.filter(group => !group.startsWith('swap-slot-')),
    componentPropertyReferences
  };
};
