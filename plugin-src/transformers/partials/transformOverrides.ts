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
// swap slot, which belongs to the mask itself. It only masks while the mask is visible, so its mask
// changes along with the visibility of the mask, overridden or set through a component property.
export const transformMaskOverrides = (
  node: SceneNode
): Pick<ShapeAttributes, 'touched' | 'componentPropertyReferences'> => {
  const { touched = [], componentPropertyReferences } = transformOverrides(node);

  const visibilityOverridden =
    touched.includes('visibility-group') || componentPropertyReferences?.visible !== undefined;

  return {
    touched: [
      ...touched.filter(group => !group.startsWith('swap-slot-')),
      ...(visibilityOverridden ? (['mask-group'] as const) : [])
    ],
    componentPropertyReferences
  };
};
