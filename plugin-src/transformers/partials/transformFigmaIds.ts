import { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';

export const transformFigmaIds = (
  node: SceneNode
): Required<Pick<ShapeBaseAttributes, 'figmaId'>> => {
  return {
    figmaId: normalizeNodeId(node.id)
  };
};

export const transformMaskFigmaIds = (
  node: SceneNode
): Required<Pick<ShapeBaseAttributes, 'figmaId'>> => {
  const transformedIds = transformFigmaIds(node);

  return {
    figmaId: `M${transformedIds.figmaId}`
  };
};

const normalizeNodeId = (nodeId: string): string => {
  return nodeId.replace('I', '');
};
