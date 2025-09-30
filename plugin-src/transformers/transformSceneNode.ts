import {
  transformBooleanNode,
  transformComponentNode,
  transformEllipseNode,
  transformFrameNode,
  transformGroupNode,
  transformInstanceNode,
  transformLineNode,
  transformPathNode,
  transformRectangleNode,
  transformTextNode,
  transformVectorNode
} from '@plugin/transformers';

import type { PenpotNode } from '@ui/types';

export const transformSceneNode = async (node: SceneNode): Promise<PenpotNode | undefined> => {
  let penpotNode: PenpotNode | undefined;

  figma.ui.postMessage({
    type: 'PROGRESS_CURRENT_ITEM',
    data: node.name
  });

  switch (node.type) {
    case 'RECTANGLE':
      penpotNode = transformRectangleNode(node);
      break;
    case 'ELLIPSE':
      penpotNode = transformEllipseNode(node);
      break;
    case 'SECTION':
    case 'FRAME':
    case 'COMPONENT_SET':
      penpotNode = await transformFrameNode(node);
      break;
    case 'GROUP':
      penpotNode = await transformGroupNode(node);
      break;
    case 'TEXT':
      penpotNode = transformTextNode(node);
      break;
    case 'VECTOR':
      penpotNode = transformVectorNode(node);
      break;
    case 'LINE':
      penpotNode = transformLineNode(node);
      break;
    case 'STAR':
    case 'POLYGON':
      penpotNode = transformPathNode(node);
      break;
    case 'BOOLEAN_OPERATION':
      penpotNode = await transformBooleanNode(node);
      break;
    case 'COMPONENT':
      penpotNode = await transformComponentNode(node);
      break;
    case 'INSTANCE':
      penpotNode = await transformInstanceNode(node);
      break;
  }

  if (penpotNode === undefined) {
    console.warn(`Unsupported node type: ${node.type}`);
  }

  return penpotNode;
};
