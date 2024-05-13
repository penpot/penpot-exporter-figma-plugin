import { transformVectorPathsAsChildren } from '@plugin/transformers/partials';

import { GroupShape } from '@ui/lib/types/shapes/groupShape';
import { PathShape } from '@ui/lib/types/shapes/pathShape';

import { transformGroupNodeLike, transformPathNode } from '.';

/*
 * Vector nodes can have multiple vector paths, each with its own fills.
 *
 * If the fills are not mixed, we treat it like a normal `PathShape`.
 * If the fills are mixed, we treat the vector node as a `GroupShape` with multiple `PathShape` children.
 */
export const transformVectorNode = async (
  node: VectorNode,
  baseX: number,
  baseY: number
): Promise<GroupShape | PathShape> => {
  if (node.fills !== figma.mixed) return transformPathNode(node, baseX, baseY);

  return {
    ...transformGroupNodeLike(node, baseX, baseY),
    ...(await transformVectorPathsAsChildren(node, baseX, baseY))
  };
};
