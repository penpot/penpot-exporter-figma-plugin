import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';

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
export const translateMaskChildren = async (
  children: readonly SceneNode[],
  maskIndex: number,
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  const maskChild = children[maskIndex];
  const unmaskedChildren = await translateChildren(children.slice(0, maskIndex), baseX, baseY);
  const maskedChildren = await translateChildren(children.slice(maskIndex), baseX, baseY);

  const maskGroup = {
    ...transformGroupNodeLike(maskChild, baseX, baseY),
    children: maskedChildren,
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

export const translateChildren = async (
  children: readonly SceneNode[],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  return (await Promise.all(children.map(child => transformSceneNode(child, baseX, baseY)))).filter(
    (child): child is PenpotNode => !!child
  );
};
