import { calculateAdjustment } from '@plugin/utils';

import { PenpotNode } from '@ui/lib/types/penpotNode';

import {
  transformEllipseNode,
  transformFrameNode,
  transformGroupNode,
  transformImageNode,
  transformPathNode,
  transformRectangleNode,
  transformTextNode
} from '.';

export const transformSceneNode = async (
  node: SceneNode,
  baseX: number = 0,
  baseY: number = 0
): Promise<PenpotNode | undefined> => {
  // @TODO: when penpot 2.0, manage image as fills for the basic types
  if (
    'fills' in node &&
    node.fills !== figma.mixed &&
    node.fills.find(fill => fill.type === 'IMAGE')
  ) {
    // If the nested frames extended the bounds of the rasterized image, we need to
    // account for this both in position on the canvas and the calculated width and
    // height of the image.
    const [adjustedX, adjustedY] = calculateAdjustment(node);
    return await transformImageNode(node, baseX + adjustedX, baseY + adjustedY);
  }

  switch (node.type) {
    case 'RECTANGLE':
      return transformRectangleNode(node, baseX, baseY);
    case 'ELLIPSE':
      return transformEllipseNode(node, baseX, baseY);
    case 'SECTION':
    case 'FRAME':
      return await transformFrameNode(node, baseX, baseY);
    case 'GROUP':
      return await transformGroupNode(node, baseX, baseY);
    case 'TEXT':
      return transformTextNode(node, baseX, baseY);
    case 'STAR':
    case 'POLYGON':
    case 'VECTOR':
    case 'LINE':
      return transformPathNode(node, baseX, baseY);
  }

  console.error(`Unsupported node type: ${node.type}`);
};
