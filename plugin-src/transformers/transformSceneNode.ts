import { PenpotNode } from '@ui/lib/types/penpotNode';

import {
  transformEllipseNode,
  transformFrameNode,
  transformGroupNode,
  transformPathNode,
  transformRectangleNode,
  transformTextNode,
  transformVectorNode
} from '.';

export const transformSceneNode = async (
  node: SceneNode,
  baseX: number = 0,
  baseY: number = 0
): Promise<PenpotNode | undefined> => {
  switch (node.type) {
    case 'RECTANGLE':
      return await transformRectangleNode(node, baseX, baseY);
    case 'ELLIPSE':
      return await transformEllipseNode(node, baseX, baseY);
    case 'SECTION':
    case 'FRAME':
      return await transformFrameNode(node, baseX, baseY);
    case 'GROUP':
      return await transformGroupNode(node, baseX, baseY);
    case 'TEXT':
      return await transformTextNode(node, baseX, baseY);
    case 'VECTOR':
      return await transformVectorNode(node, baseX, baseY);
    case 'STAR':
    case 'POLYGON':
    case 'LINE':
      return await transformPathNode(node, baseX, baseY);
  }

  console.error(`Unsupported node type: ${node.type}`);
};
