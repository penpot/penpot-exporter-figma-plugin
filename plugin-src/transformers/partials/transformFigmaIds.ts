import { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';

export const transformFigmaIds = (
  node: SceneNode
): Pick<ShapeBaseAttributes, 'figmaId' | 'figmaRelatedId'> => {
  return {
    figmaId: normalizeNodeId(node.id),
    figmaRelatedId: getRelatedNodeId(node.id)
  };
};

const getRelatedNodeId = (nodeId: string): string | undefined => {
  const ids = nodeId.split(';');

  if (ids.length > 1) {
    return ids.slice(1).join(';');
  }
};

const normalizeNodeId = (nodeId: string): string => {
  return nodeId.replace('I', '');
};
