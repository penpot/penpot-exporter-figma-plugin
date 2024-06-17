import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformProportion = (
  node: LayoutMixin
): Pick<ShapeAttributes, 'proportion-lock'> => {
  return {
    'proportion-lock': node.constrainProportions
  };
};
