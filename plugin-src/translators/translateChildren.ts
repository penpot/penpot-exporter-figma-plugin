import { yieldByTime } from '@common/sleep';

import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';
import { transformMaskIds } from '@plugin/transformers/partials';

import type { PenpotNode } from '@ui/types';

// #region agent log
let currentDepth = 0;
let maxDepthReached = 0;
let totalNodesProcessed = 0;
// #endregion

/**
 * Translates the children of a node that acts as a mask.
 * We need to split the children into two groups: the ones that are masked and the ones that are not.
 *
 * The masked children will be grouped together in a mask group.
 * The unmasked children will be returned as they are.
 *
 * @maskIndex The index of the mask node in the children array
 */
export const translateMaskChildren = async (
  children: readonly SceneNode[],
  maskIndex: number
): Promise<PenpotNode[]> => {
  const maskChild = children[maskIndex];

  if (
    maskChild.type === 'STICKY' ||
    maskChild.type === 'CONNECTOR' ||
    maskChild.type === 'CODE_BLOCK' ||
    maskChild.type === 'WIDGET' ||
    maskChild.type === 'EMBED' ||
    maskChild.type === 'LINK_UNFURL' ||
    maskChild.type === 'MEDIA' ||
    maskChild.type === 'SECTION' ||
    maskChild.type === 'TABLE' ||
    maskChild.type === 'SHAPE_WITH_TEXT'
  ) {
    return await translateChildren(children);
  }

  const unmaskedChildren = await translateChildren(children.slice(0, maskIndex));
  const maskedChildren = await translateChildren(children.slice(maskIndex));

  const maskGroup = {
    ...transformMaskIds(maskChild),
    ...transformGroupNodeLike(maskChild),
    children: maskedChildren,
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

export const translateChildren = async (children: readonly SceneNode[]): Promise<PenpotNode[]> => {
  // #region agent log
  currentDepth++;
  if (currentDepth > maxDepthReached) {
    maxDepthReached = currentDepth;
  }
  const entryDepth = currentDepth;
  const childrenCount = children.length;
  console.log('[DEBUG H2-recursion] translateChildren ENTRY', JSON.stringify({depth:entryDepth,childrenCount,maxDepthReached,totalNodesProcessed}));
  // #endregion

  const transformedChildren: PenpotNode[] = [];

  // #region agent log
  console.log('[DEBUG H2-recursion] Starting for loop', JSON.stringify({depth:entryDepth,childrenCount}));
  // #endregion

  for (const child of children) {
    // #region agent log
    totalNodesProcessed++;
    console.log('[DEBUG H2-recursion] Processing child', JSON.stringify({totalNodesProcessed,currentDepth,childType:child.type,childName:child.name}));
    // #endregion

    const penpotNode = await transformSceneNode(child);

    // #region agent log
    console.log('[DEBUG H2-recursion] Child processed', JSON.stringify({totalNodesProcessed,currentDepth,childName:child.name,penpotNodeType:penpotNode?.type}));
    // #endregion

    if (penpotNode) transformedChildren.push(penpotNode);

    await yieldByTime();
  }

  // #region agent log
  console.log('[DEBUG H2-recursion] For loop complete', JSON.stringify({depth:entryDepth,transformedCount:transformedChildren.length}));
  currentDepth--;
  console.log('[DEBUG H2-recursion] translateChildren EXIT', JSON.stringify({depth:entryDepth,childrenCount,transformedCount:transformedChildren.length,totalNodesProcessed}));
  // #endregion

  return transformedChildren;
};
