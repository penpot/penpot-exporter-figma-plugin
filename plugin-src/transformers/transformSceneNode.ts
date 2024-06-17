import { PenpotNode } from '@ui/types';

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
} from '.';

export const transformSceneNode = async (
  node: SceneNode,
  baseRotation: number = 0
): Promise<PenpotNode | undefined> => {
  let penpotNode: PenpotNode | undefined;

  figma.ui.postMessage({
    type: 'PROGRESS_CURRENT_ITEM',
    data: node.name
  });

  switch (node.type) {
    case 'RECTANGLE':
      penpotNode = transformRectangleNode(node, baseRotation);
      break;
    case 'ELLIPSE':
      penpotNode = transformEllipseNode(node, baseRotation);
      break;
    case 'SECTION':
    case 'FRAME':
    case 'COMPONENT_SET':
      penpotNode = await transformFrameNode(node, baseRotation);
      break;
    case 'GROUP':
      penpotNode = await transformGroupNode(node, baseRotation);
      break;
    case 'TEXT':
      penpotNode = transformTextNode(node, baseRotation);
      break;
    case 'VECTOR':
      penpotNode = transformVectorNode(node, baseRotation);
      break;
    case 'LINE':
      penpotNode = transformLineNode(node, baseRotation);
      break;
    case 'STAR':
    case 'POLYGON':
      penpotNode = transformPathNode(node, baseRotation);
      break;
    case 'BOOLEAN_OPERATION':
      penpotNode = await transformBooleanNode(node, baseRotation);
      break;
    case 'COMPONENT':
      penpotNode = await transformComponentNode(node, baseRotation);
      break;
    case 'INSTANCE':
      penpotNode = await transformInstanceNode(node, baseRotation);
      break;
  }

  if (penpotNode === undefined) {
    console.error(`Unsupported node type: ${node.type}`);
  }

  return penpotNode;
};
