import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

export const transformProportion = (node: LayoutMixin): Partial<ShapeAttributes> => {
  return {
    proportionLock: node.constrainProportions
  };
};
