import { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';

export const transformFigmaIds = (
  node: SceneNode
): Required<Pick<ShapeBaseAttributes, 'figmaId'>> & Pick<ShapeBaseAttributes, 'figmaRelatedId'> => {
  return {
    figmaId: normalizeNodeId(node.id),
    figmaRelatedId: getRelatedNodeId(node.id)
  };
};

export const transformMaskFigmaIds = (
  node: SceneNode
): Required<Pick<ShapeBaseAttributes, 'figmaId'>> & Pick<ShapeBaseAttributes, 'figmaRelatedId'> => {
  const transformedIds = transformFigmaIds(node);

  return {
    figmaId: `M${transformedIds.figmaId}`,
    figmaRelatedId: transformedIds.figmaRelatedId ? `M${transformedIds.figmaRelatedId}` : undefined
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
