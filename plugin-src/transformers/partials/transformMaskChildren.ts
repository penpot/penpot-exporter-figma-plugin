import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';

import { PenpotNode } from '@ui/lib/types/penpotNode';

export const transformMaskChildren = async (
  children: readonly SceneNode[],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  const maskIndex = children.findIndex(child => isMaskNode(child) && isMask(child));
  if (maskIndex === -1) {
    return (
      await Promise.all(children.map(child => transformSceneNode(child, baseX, baseY)))
    ).filter((child): child is PenpotNode => !!child);
  }

  const unmaskedChildren = await transformMaskChildren(children.slice(0, maskIndex), baseX, baseY);
  const maskedChildren = children.slice(maskIndex);

  const maskGroup = {
    ...transformGroupNodeLike(maskedChildren[0], baseX, baseY),
    children: await transformMaskChildren(maskedChildren, baseX, baseY),
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

const isMask = (node: MaskNode): boolean => {
  return node.isMask;
};

const isMaskNode = (node: SceneNode): node is MaskNode => {
  return 'isMask' in node;
};

type MaskNode =
  | FrameNode
  | GroupNode
  | ComponentSetNode
  | ComponentNode
  | InstanceNode
  | BooleanOperationNode
  | VectorNode
  | StarNode
  | LineNode
  | EllipseNode
  | PolygonNode
  | RectangleNode
  | TextNode
  | StampNode
  | HighlightNode
  | WashiTapeNode;
