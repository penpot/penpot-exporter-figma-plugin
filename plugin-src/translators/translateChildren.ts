import { yieldByTime } from '@common/sleep';

import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';
import { transformMaskIds } from '@plugin/transformers/partials';

import type { PenpotNode } from '@ui/types';

/**
 * Translates the children of a node that acts as a mask.
 * We need to split the children into two groups: the ones that are masked and the ones that are not.
 *
 * The masked children will be grouped together in a mask group.
 * The unmasked children will be returned as they are.
 *
 * As in Figma, a mask only applies to the siblings above it until the next mask,
 * which starts a mask group of its own.
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
    maskChild.type === 'TABLE'
  ) {
    return await translateChildren(children);
  }

  const nextMaskIndex = children.findIndex((child, index) => index > maskIndex && isMask(child));
  const maskEnd = nextMaskIndex === -1 ? children.length : nextMaskIndex;

  const unmaskedChildren = await translateChildren(children.slice(0, maskIndex));
  const maskedChildren = await translateChildren(children.slice(maskIndex, maskEnd));

  const maskGroup = {
    ...transformMaskIds(maskChild),
    ...transformGroupNodeLike(maskChild),
    children: maskedChildren,
    maskedGroup: true
  };

  if (nextMaskIndex === -1) {
    return [...unmaskedChildren, maskGroup];
  }

  return [
    ...unmaskedChildren,
    maskGroup,
    ...(await translateMaskChildren(children.slice(nextMaskIndex), 0))
  ];
};

const isMask = (node: SceneNode): boolean => 'isMask' in node && node.isMask;

export const translateChildren = async (children: readonly SceneNode[]): Promise<PenpotNode[]> => {
  const transformedChildren: PenpotNode[] = [];

  for (const child of children) {
    const penpotNode = await transformSceneNode(child);

    if (penpotNode) transformedChildren.push(penpotNode);

    await yieldByTime();
  }

  return transformedChildren;
};
