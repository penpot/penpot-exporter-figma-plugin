import { identifiers, swappedInstances } from '@plugin/libraries';
import { generateDeterministicUuid } from '@plugin/utils';

import type { ShapeAttributes, ShapeBaseAttributes } from '@ui/lib/types/shapes/shape';
import type { Uuid } from '@ui/lib/types/utils/uuid';

const parseFigmaId = (figmaId: string): Uuid => {
  const id = identifiers.get(figmaId);

  if (id) {
    return id;
  }

  const newId = generateDeterministicUuid(figmaId);

  identifiers.set(figmaId, newId);

  return newId;
};

// A nested node id is `I<instance>;<path in main>`. Inside a swapped instance the path
// belongs to the new component, so it is resolved relative to the closest swapped ancestor.
const getRelatedNodeId = (nodeId: string): string | undefined => {
  const ids = nodeId.split(';');

  for (let i = ids.length - 1; i > 0; i--) {
    if (i === 1 || swappedInstances.has(ids.slice(0, i).join(';'))) {
      return ids.slice(i).join(';');
    }
  }
};

const isSwappedInstance = async (
  node: InstanceNode,
  mainComponent: ComponentNode
): Promise<boolean> => {
  const relatedNodeId = getRelatedNodeId(node.id);
  if (!relatedNodeId) {
    return false;
  }

  // The replaced node is a nested instance when its own id still contains a path
  const replacedNode = await figma.getNodeByIdAsync(
    relatedNodeId.includes(';') ? `I${relatedNodeId}` : relatedNodeId
  );
  if (replacedNode?.type !== 'INSTANCE') {
    return false;
  }

  const replacedMainComponent = await replacedNode.getMainComponentAsync();

  return replacedMainComponent !== null && replacedMainComponent.key !== mainComponent.key;
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

// Must run before the instance children are transformed so their refs follow the swap.
export const transformInstanceIds = async (
  node: InstanceNode,
  mainComponent: ComponentNode
): Promise<Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> & Pick<ShapeAttributes, 'componentId'>> => {
  const shapeRef = transformShapeRef(node);
  const mainRootId = generateDeterministicUuid(`id-${mainComponent.key}`);
  const swapped = shapeRef !== undefined && (await isSwappedInstance(node, mainComponent));

  if (swapped) {
    // The copy refers to the new component; the replaced main child becomes its swap slot
    swappedInstances.set(node.id, shapeRef);
  }

  return {
    id: transformId(node),
    shapeRef: swapped ? mainRootId : (shapeRef ?? mainRootId),
    componentId: generateDeterministicUuid(mainComponent.key)
  };
};

// Prefix lets multiple Penpot shapes share one Figma id without colliding.
const transformPrefixedIds = (
  node: SceneNode,
  prefix: string
): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => {
  const normalizedId = normalizeNodeId(node.id);
  const relatedNodeId = getRelatedNodeId(node.id);

  return {
    id: parseFigmaId(`${prefix}${normalizedId}`),
    shapeRef: relatedNodeId ? parseFigmaId(`${prefix}${relatedNodeId}`) : undefined
  };
};

export const transformMaskIds = (node: SceneNode): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> =>
  transformPrefixedIds(node, 'M');

export const transformVectorIds = (
  node: SceneNode,
  index: number
): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => transformPrefixedIds(node, `V${index}`);

export const transformChildIds = (
  node: SceneNode,
  index: number
): Pick<ShapeBaseAttributes, 'id' | 'shapeRef'> => transformPrefixedIds(node, `C${index}`);
