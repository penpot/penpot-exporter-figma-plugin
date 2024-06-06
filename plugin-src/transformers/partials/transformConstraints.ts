import { translateConstraintH, translateConstraintV } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformConstraints = (
  node: ConstraintMixin
): Pick<ShapeAttributes, 'constraintsH' | 'constraintsV'> => {
  return {
    constraintsH: translateConstraintH(node.constraints.horizontal),
    constraintsV: translateConstraintV(node.constraints.vertical)
  };
};
