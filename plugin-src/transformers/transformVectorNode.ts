import { transformVectorPaths } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';

import { transformGroupNodeLike } from '.';

/*
 * Vector nodes can have multiple vector paths, each with its own fills.
 *
 * If there are no regions on the vector network, we treat it like a normal `PathShape`.
 * If there are regions, we treat the vector node as a `GroupShape` with multiple `PathShape` children.
 */
export const transformVectorNode = async (
  node: VectorNode,
  baseX: number,
  baseY: number
): Promise<GroupShape | PathShape> => {
  const children = await transformVectorPaths(node, baseX, baseY);

  if (children.length === 1) {
    return {
      ...children[0],
      name: node.name
    };
  }

  return {
    ...transformGroupNodeLike(node, baseX, baseY, true),
    children
  };
};
