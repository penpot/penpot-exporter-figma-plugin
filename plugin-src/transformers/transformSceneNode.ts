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
  baseY: number = 0,
  zIndex: number = 0
): Promise<PenpotNode | undefined> => {
  let penpotNode: PenpotNode | undefined;

  figma.ui.postMessage({
    type: 'PROGRESS_CURRENT_ITEM',
    data: node.name
  });

  switch (node.type) {
    case 'RECTANGLE':
      penpotNode = transformRectangleNode(node, baseX, baseY, zIndex);
      break;
    case 'ELLIPSE':
      penpotNode = transformEllipseNode(node, baseX, baseY, zIndex);
      break;
    case 'SECTION':
    case 'FRAME':
    case 'COMPONENT_SET':
      penpotNode = await transformFrameNode(node, baseX, baseY, zIndex);
      break;
    case 'GROUP':
      penpotNode = await transformGroupNode(node, baseX, baseY, zIndex);
      break;
    case 'TEXT':
      penpotNode = transformTextNode(node, baseX, baseY, zIndex);
      break;
    case 'VECTOR':
      penpotNode = transformVectorNode(node, baseX, baseY, zIndex);
      break;
    case 'STAR':
    case 'POLYGON':
    case 'LINE':
      penpotNode = transformPathNode(node, baseX, baseY, zIndex);
      break;
    case 'BOOLEAN_OPERATION':
      penpotNode = await transformBooleanNode(node, baseX, baseY, zIndex);
      break;
    case 'COMPONENT':
      penpotNode = await transformComponentNode(node, baseX, baseY, zIndex);
      break;
    case 'INSTANCE':
      penpotNode = await transformInstanceNode(node, baseX, baseY, zIndex);
      break;
  }

  if (penpotNode === undefined) {
    console.error(`Unsupported node type: ${node.type}`);
  }

  return penpotNode;
};
