import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformSceneNode = (
  node: SceneNodeMixin
): Pick<ShapeAttributes, 'blocked' | 'hidden'> => {
  return {
    blocked: node.locked,
    hidden: false // @TODO: check this. it won't export if we hide it
  };
};
