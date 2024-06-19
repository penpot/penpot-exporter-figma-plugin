import { nodeQueue } from '@plugin/Queue';
import { transformGroupNodeLike } from '@plugin/transformers';
import { transformMaskFigmaIds } from '@plugin/transformers/partials';

import { PenpotNode } from '@ui/types';

/**
 * Translates the children of a node that acts as a mask.
 * We need to split the children into two groups: the ones that are masked and the ones that are not.
 *
 * The masked children will be grouped together in a mask group.
 * The unmasked children will be returned as they are.
 *
 * @maskIndex The index of the mask node in the children array
 */
export const translateMaskChildren = (
  children: readonly SceneNode[],
  maskIndex: number
): PenpotNode[] => {
  const maskChild = children[maskIndex];

  const unmaskedChildren = translateChildren(children.slice(0, maskIndex));
  const maskedChildren = translateChildren(children.slice(maskIndex));

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
    return [...unmaskedChildren, ...maskedChildren];
  }

  const maskGroup = {
    ...transformMaskFigmaIds(maskChild),
    ...transformGroupNodeLike(maskChild),
    children: maskedChildren,
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

export const translateChildren = (children: readonly SceneNode[]): PenpotNode[] => {
  const transformedChildren: PenpotNode[] = [];
  let count = 0;

  for (const child of children) {
    nodeQueue.enqueue([child, count++]).then(([penpotNode, position]) => {
      if (penpotNode) transformedChildren[position] = penpotNode;
    });
  }

  return transformedChildren;
};
