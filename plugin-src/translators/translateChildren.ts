import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';

import { PenpotNode } from '@ui/lib/types/penpotNode';

export const translateMaskChildren = async (
  children: readonly SceneNode[],
  maskedIndex: number,
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  const maskChild = children[maskedIndex];
  const unmaskedChildren = await translateNonMaskChildren(
    children.slice(0, maskedIndex),
    baseX,
    baseY
  );
  const maskedChildren = await translateNonMaskChildren(children.slice(maskedIndex), baseX, baseY);

  const maskGroup = {
    ...transformGroupNodeLike(maskChild, baseX, baseY),
    children: maskedChildren,
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

export const translateNonMaskChildren = async (
  children: readonly SceneNode[],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  return (await Promise.all(children.map(child => transformSceneNode(child, baseX, baseY)))).filter(
    (child): child is PenpotNode => !!child
  );
};
