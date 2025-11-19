import type { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformProportion = (
  node: AspectRatioLockMixin
): Pick<ShapeAttributes, 'proportionLock'> => {
  return {
    proportionLock: node.targetAspectRatio !== null
  };
};
