import { translateConstraintH, translateConstraintV } from '@plugin/translators';

import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformConstraints = (
  node: ConstraintMixin
): Pick<ShapeAttributes, 'constraintsH' | 'constraintsV'> => {
  // Figma reports undefined constraints for some nodes, e.g. component sets inside auto layouts
  if (!node.constraints) return {};

  return {
    constraintsH: translateConstraintH(node.constraints.horizontal),
    constraintsV: translateConstraintV(node.constraints.vertical)
  };
};
