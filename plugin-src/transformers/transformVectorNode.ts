import { transformGroupNodeLike } from '@plugin/transformers';
import {
  transformConstraints,
  transformIds,
  transformOverrides,
  transformVariableConsumptionMap,
  transformVectorPaths
} from '@plugin/transformers/partials';
import { mergePathShapes } from '@plugin/translators/vectors';

import type { GroupShape } from '@ui/lib/types/shapes/groupShape';
import type { PathShape } from '@ui/lib/types/shapes/pathShape';

/*
 * Vector nodes can have multiple vector paths, each with its own fills.
 *
 * If there are no regions on the vector network, we treat it like a normal `PathShape`.
 * If there are regions, we treat the vector node as a `GroupShape` with multiple `PathShape` children,
 * unless they can be merged into a single `PathShape` (see `mergePathShapes`).
 */
export const transformVectorNode = (node: VectorNode): GroupShape | PathShape | undefined => {
  const children = transformVectorPaths(node);

  if (children.length === 0) {
    return;
  }

  const path = children.length === 1 ? children[0] : mergePathShapes(children);

  if (path) {
    return {
      ...path,
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
