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
  remote: boolean = false
): Promise<PenpotNode | undefined> => {
  let penpotNode: PenpotNode | undefined;

  figma.ui.postMessage({
    type: 'PROGRESS_NODE',
    data: node.name
  });

  switch (node.type) {
    case 'RECTANGLE':
      penpotNode = await transformRectangleNode(node, baseX, baseY);
      break;
    case 'ELLIPSE':
      penpotNode = await transformEllipseNode(node, baseX, baseY);
      break;
    case 'SECTION':
    case 'FRAME':
    case 'COMPONENT_SET':
      penpotNode = await transformFrameNode(node, baseX, baseY, remote);
      break;
    case 'GROUP':
      penpotNode = await transformGroupNode(node, baseX, baseY, remote);
      break;
    case 'TEXT':
      penpotNode = await transformTextNode(node, baseX, baseY);
      break;
    case 'VECTOR':
      penpotNode = await transformVectorNode(node, baseX, baseY);
      break;
    case 'STAR':
    case 'POLYGON':
    case 'LINE':
      penpotNode = await transformPathNode(node, baseX, baseY);
      break;
    case 'BOOLEAN_OPERATION':
      penpotNode = await transformBooleanNode(node, baseX, baseY, remote);
      break;
    case 'COMPONENT':
      penpotNode = await transformComponentNode(node, baseX, baseY, remote);
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
