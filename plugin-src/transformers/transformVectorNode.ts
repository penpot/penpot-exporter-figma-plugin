import { transformVectorPathsAsChildren } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';

import { transformGroupNodeLike, transformPathNode } from '.';

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
  // if ((node.vectorNetwork.regions ?? []).length === 0) {
  //   return transformPathNode(node, baseX, baseY);
  // }

  console.log(node);

  return {
    ...transformGroupNodeLike(node, baseX, baseY),
    ...(await transformVectorPathsAsChildren(node, baseX, baseY))
  };
};
