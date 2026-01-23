import { identifiers } from '@plugin/libraries';
import { generateDeterministicUuid } from '@plugin/utils';

import type { ShapeAttributes, ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';
import type { Uuid } from '@ui/lib/types/utils/uuid';

// #region agent log
let identifiersLogCounter = 0;
// #endregion

const parseFigmaId = (figmaId: string): Uuid => {
  const id = identifiers.get(figmaId);

  if (id) {
    return id;
  }

  const newId = generateDeterministicUuid(figmaId);

  identifiers.set(figmaId, newId);

  // #region agent log
  identifiersLogCounter++;
  if (identifiersLogCounter % 100 === 0 || identifiers.size > 500) {
    console.log('[DEBUG H3-identifiers] identifiers map growth', JSON.stringify({mapSize:identifiers.size,totalCalls:identifiersLogCounter}));
  }
  // #endregion

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

export const transformIds = (node: SceneNode): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  return {
    id: transformId(node),
    shapeRef: transformShapeRef(node)
  };
};

export const transformComponentIds = (
  node: ComponentNode
): Pick<ShapeBaseAttributes, 'id'> & Pick<ShapeAttributes, 'componentId'> => {
  return {
    id: generateDeterministicUuid(`id-${node.key}`),
    componentId: generateDeterministicUuid(node.key)
  };
};

export const transformInstanceIds = (
  node: InstanceNode,
  mainComponent: ComponentNode
): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> & Pick<ShapeAttributes, 'componentId'> => {
  return {
    id: transformId(node),
    shapeRef: transformShapeRef(node) ?? generateDeterministicUuid(`id-${mainComponent.key}`),
    componentId: generateDeterministicUuid(mainComponent.key)
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
