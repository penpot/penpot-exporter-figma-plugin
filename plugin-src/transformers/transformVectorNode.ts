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

/*
 * Vector nodes can have multiple vector paths, each with its own fills.
 *
 * If there are no regions on the vector network, we treat it like a normal `PathShape`.
 * If there are regions, we treat the vector node as a `GroupShape` with multiple `PathShape` children.
 *
 * If Figma cannot expose the vector network (corrupt or unsupported data) or
 * we cannot produce any path, we rasterize the node as a PNG image fill so the
 * exported shape still matches the Figma preview.
 */
export const transformVectorNode = async (
  node: VectorNode
): Promise<GroupShape | PathShape | RectShape | undefined> => {
  let children: PathShape[];
  try {
    children = transformVectorPaths(node);
  } catch (error) {
    console.warn(`Could not transform vector "${node.name}", rasterizing.`, error);
    return await transformNodeAsImageRect(node);
  }

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
