import { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';

export const transformFigmaIds = (
  node: SceneNode,
  isMasked: boolean = false
): Pick<ShapeBaseAttributes, 'figmaId' | 'figmaRelatedId'> => {
  const id = normalizeNodeId(node.id);
  const relatedId = getRelatedNodeId(node.id);
  const prefix = isMasked ? 'M' : '';

  return {
    figmaId: `${prefix}${id}`,
    figmaRelatedId: relatedId ? `${prefix}${relatedId}` : undefined
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
