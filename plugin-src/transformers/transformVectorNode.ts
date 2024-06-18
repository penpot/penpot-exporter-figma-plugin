import {
  transformConstraints,
  transformFigmaIds,
  transformOverrides,
  transformVectorPaths
} from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';

import { transformGroupNodeLike } from '.';

/*
 * Vector nodes can have multiple vector paths, each with its own fills.
 *
 * If there are no regions on the vector network, we treat it like a normal `PathShape`.
 * If there are regions, we treat the vector node as a `GroupShape` with multiple `PathShape` children.
 */
export const transformVectorNode = (node: VectorNode): GroupShape | PathShape => {
  const children = transformVectorPaths(node);

  if (children.length === 1) {
    return {
      ...children[0],
      name: node.name,
      ...transformFigmaIds(node),
      ...transformConstraints(node),
      ...transformOverrides(node)
    };
  }

  return {
    ...transformGroupNodeLike(node),
    ...transformFigmaIds(node),
    ...transformConstraints(node),
    ...transformOverrides(node),
    children
  };
};
