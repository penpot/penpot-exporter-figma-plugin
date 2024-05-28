import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformProportion = (node: LayoutMixin): Partial<ShapeAttributes> => {
  return {
    proportionLock: node.constrainProportions
  };
};
