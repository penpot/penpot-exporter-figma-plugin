import { ShapeAttributes } from '@ui/lib/types/shape/shapeAttributes';

export const transformSceneNode = (node: SceneNodeMixin): Partial<ShapeAttributes> => {
  return {
    blocked: node.locked,
    hidden: false // @TODO: check this. it won't export if we hide it
  };
};
