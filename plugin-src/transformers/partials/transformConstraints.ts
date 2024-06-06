import { translateConstraint } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformConstraints = (
  node: ConstraintMixin
): Pick<ShapeAttributes, 'constraintsH' | 'constraintsV'> => {
  return {
    constraintsH: translateConstraint(node.constraints.horizontal),
    constraintsV: translateConstraint(node.constraints.vertical)
  };
};
