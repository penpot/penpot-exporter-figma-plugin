import { PenpotNode } from '@ui/types';

import {
  transformBooleanNode,
  transformComponentNode,
  transformEllipseNode,
  transformFrameNode,
  transformGroupNode,
  transformInstanceNode,
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
  let penpotNode: PenpotNode | undefined;

  figma.ui.postMessage({
    type: 'PROGRESS_CURRENT_ITEM',
    data: node.name
  });

  switch (node.type) {
    case 'RECTANGLE':
      penpotNode = transformRectangleNode(node, baseX, baseY);
      break;
    case 'ELLIPSE':
      penpotNode = transformEllipseNode(node, baseX, baseY);
      break;
    case 'SECTION':
    case 'FRAME':
    case 'COMPONENT_SET':
      penpotNode = await transformFrameNode(node, baseX, baseY);
      break;
    case 'GROUP':
      penpotNode = await transformGroupNode(node, baseX, baseY);
      break;
    case 'TEXT':
      penpotNode = transformTextNode(node, baseX, baseY);
      break;
    case 'VECTOR':
      penpotNode = transformVectorNode(node, baseX, baseY);
      break;
    case 'STAR':
    case 'POLYGON':
    case 'LINE':
      penpotNode = transformPathNode(node, baseX, baseY);
      break;
    case 'BOOLEAN_OPERATION':
      penpotNode = await transformBooleanNode(node, baseX, baseY);
      break;
    case 'COMPONENT':
      penpotNode = await transformComponentNode(node, baseX, baseY);
      break;
    case 'INSTANCE':
      penpotNode = await transformInstanceNode(node, baseX, baseY);
      break;
  }

  if (penpotNode === undefined) {
    console.error(`Unsupported node type: ${node.type}`);
  }

  return penpotNode;
};
