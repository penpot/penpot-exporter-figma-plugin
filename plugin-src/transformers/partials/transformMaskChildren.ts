import { transformGroupNodeLike, transformSceneNode } from '@plugin/transformers';

import { PenpotNode } from '@ui/lib/types/penpotNode';

export const transformMaskChildren = async (
  children: readonly SceneNode[],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  const maskIndex = children.findIndex(child => isMaskNode(child) && isMask(child));

  if (maskIndex === -1) {
    return transformChildren(children, baseX, baseY);
  }

  const maskChild = children[maskIndex];
  const unmaskedChildren = await transformChildren(children.slice(0, maskIndex), baseX, baseY);
  const maskedChildren = await transformChildren(children.slice(maskIndex), baseX, baseY);

  const maskGroup = {
    ...transformGroupNodeLike(maskChild, baseX, baseY),
    children: maskedChildren,
    maskedGroup: true
  };

  return [...unmaskedChildren, maskGroup];
};

const transformChildren = async (
  children: readonly SceneNode[],
  baseX: number,
  baseY: number
): Promise<PenpotNode[]> => {
  return (await Promise.all(children.map(child => transformSceneNode(child, baseX, baseY)))).filter(
    (child): child is PenpotNode => !!child
  );
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
