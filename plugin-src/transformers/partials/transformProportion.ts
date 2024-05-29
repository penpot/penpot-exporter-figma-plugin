import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformProportion = (node: LayoutMixin): Pick<ShapeAttributes, 'proportionLock'> => {
  return {
    proportionLock: node.constrainProportions
  };
};
