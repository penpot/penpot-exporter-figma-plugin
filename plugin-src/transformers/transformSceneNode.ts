import { PenpotNode } from '@ui/lib/types/penpotNode';

import {
  transformEllipseNode,
  transformFrameNode,
  transformGroupNode,
  transformPathNode,
  transformRectangleNode,
  transformTextNode
} from '.';

export const transformSceneNode = async (
  node: SceneNode,
  baseX: number = 0,
  baseY: number = 0
): Promise<PenpotNode | undefined> => {
  figma.ui.postMessage({
    type: 'PROGRESS',
    data: node.name
  });

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
    case 'STAR':
    case 'POLYGON':
    case 'VECTOR':
    case 'LINE':
      return await transformPathNode(node, baseX, baseY);
  }

  console.error(`Unsupported node type: ${node.type}`);
};
