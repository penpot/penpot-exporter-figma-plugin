import { ShapeAttributes } from '@ui/lib/types/shapes/shape';

export const transformSceneNode = (
  node: SceneNodeMixin
): Pick<ShapeAttributes, 'blocked' | 'hidden'> => {
  return {
    blocked: node.locked,
    hidden: !node.visible
  };
};
