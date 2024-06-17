import { translateConstraintH, translateConstraintV } from '@plugin/translators';

import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformConstraints = (
  node: ConstraintMixin
): Pick<ShapeAttributes, 'constraints-h' | 'constraints-v'> => {
  return {
    'constraints-h': translateConstraintH(node.constraints.horizontal),
    'constraints-v': translateConstraintV(node.constraints.vertical)
  };
};
