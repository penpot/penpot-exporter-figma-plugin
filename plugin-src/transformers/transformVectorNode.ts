import { transformGroupNodeLike, transformNodeAsImageRect } from '@plugin/transformers';
import {
  transformConstraints,
  transformIds,
  transformOverrides,
  transformVariableConsumptionMap,
  transformVectorPaths
} from '@plugin/transformers/partials';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';
import type { RectShape } from '@ui/lib/types/shapes/rectShape';

const isVectorDataAccessible = (node: VectorNode): boolean => {
  try {
    const network = node.vectorNetwork;
    void network.regions;
    void network.vertices;
    void network.segments;
    void node.vectorPaths;
    return true;
  } catch (error) {
    console.warn(`Vector data unavailable for "${node.name}", rasterizing.`, error);
    return false;
  }
};

/*
 * Vector nodes can have multiple vector paths, each with its own fills.
 *
 * If there are no regions on the vector network, we treat it like a normal `PathShape`.
 * If there are regions, we treat the vector node as a `GroupShape` with multiple `PathShape` children.
 *
 * If Figma cannot expose the vector network (corrupt or unsupported data) we fall
 * back to rasterizing the node as a PNG image fill to preserve visual fidelity.
 */
export const transformVectorNode = async (
  node: VectorNode
): Promise<GroupShape | PathShape | RectShape | undefined> => {
  if (!isVectorDataAccessible(node)) {
    return await transformNodeAsImageRect(node);
  }

  const children = transformVectorPaths(node);

  if (children.length === 0) {
    return await transformNodeAsImageRect(node);
  }

  if (children.length === 1) {
    return {
      ...children[0],
      name: node.name,
      ...transformIds(node),
      ...transformConstraints(node),
      ...transformVariableConsumptionMap(node),
      ...transformOverrides(node)
    };
  }

  return {
    ...transformGroupNodeLike(node),
    ...transformIds(node),
    ...transformConstraints(node),
    ...transformVariableConsumptionMap(node),
    ...transformOverrides(node),
    children
  };
};
