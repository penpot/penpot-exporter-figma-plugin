import { identifiers } from '@plugin/libraries';
import { generateDeterministicUuid, generateUuid } from '@plugin/utils';

import type { ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';
import type { Uuid } from '@ui/lib/types/utils/uuid';

const parseFigmaId = (figmaId: string): Uuid => {
  const id = identifiers.get(figmaId);

  if (id) {
    return id;
  }

  const newId = generateUuid();

  identifiers.set(figmaId, newId);

  return newId;
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

const transformShapeRef = (node: SceneNode): Uuid | undefined => {
  const relatedNodeId = getRelatedNodeId(node.id);
  if (!relatedNodeId) {
    return;
  }

  return parseFigmaId(relatedNodeId);
};

export const transformId = (node: SceneNode): Uuid => {
  return parseFigmaId(normalizeNodeId(node.id));
};

export const transformComponentId = (node: ComponentNode): Uuid => {
  return generateDeterministicUuid(node.key);
};

export const transformIds = (node: SceneNode): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  return {
    id: transformId(node),
    shapeRef: transformShapeRef(node)
  };
};

export const transformMaskIds = (node: SceneNode): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  const normalizedId = normalizeNodeId(node.id);
  const relatedNodeId = getRelatedNodeId(node.id);

  return {
    id: parseFigmaId(`M${normalizedId}`),
    shapeRef: relatedNodeId ? parseFigmaId(`M${relatedNodeId}`) : undefined
  };
};

export const transformVectorIds = (
  node: SceneNode,
  index: number
): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  const normalizedId = normalizeNodeId(node.id);
  const relatedNodeId = getRelatedNodeId(node.id);

  return {
    id: parseFigmaId(`V${index}${normalizedId}`),
    shapeRef: relatedNodeId ? parseFigmaId(`V${index}${relatedNodeId}`) : undefined
  };
};
