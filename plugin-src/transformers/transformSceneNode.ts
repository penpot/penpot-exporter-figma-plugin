import { PenpotNode } from '@ui/lib/types/penpotNode';

import {
  transformBooleanNode,
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
  baseY: number = 0,
  baseRotation: number = 0
): Promise<PenpotNode | undefined> => {
  switch (node.type) {
    case 'RECTANGLE':
      return await transformRectangleNode(node, baseX, baseY, baseRotation);
    case 'ELLIPSE':
      return await transformEllipseNode(node, baseX, baseY, baseRotation);
    case 'SECTION':
    case 'FRAME':
      return await transformFrameNode(node, baseX, baseY, baseRotation);
    case 'GROUP':
      return await transformGroupNode(node, baseX, baseY, baseRotation);
    case 'TEXT':
      return await transformTextNode(node, baseX, baseY, baseRotation);
    case 'VECTOR':
      return await transformVectorNode(node, baseX, baseY, baseRotation);
    case 'STAR':
    case 'POLYGON':
    case 'LINE':
      return await transformPathNode(node, baseX, baseY, baseRotation);
    case 'BOOLEAN_OPERATION':
      return await transformBooleanNode(node, baseX, baseY, baseRotation);
  }

  console.error(`Unsupported node type: ${node.type}`);
};
