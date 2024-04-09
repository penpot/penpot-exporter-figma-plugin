import { NodeData, TextData } from '../../common/interfaces';
import { getImageFill, getNodeData, getTextData } from '../utils';

export async function traverse(baseNode: BaseNode): Promise<NodeData | TextData> {
  const children: (NodeData | TextData)[] = [];
  if ('children' in baseNode && baseNode.type !== 'INSTANCE') {
    for (const child of baseNode.children) {
      children.push(await traverse(child));
    }
  }

  const nodeData = getNodeData(baseNode, children);

  if (nodeData.fills) {
    nodeData.imageFill = await getImageFill(baseNode, nodeData);
  }

  const textNode = getTextData(baseNode, nodeData);
  if (textNode) {
    return textNode;
  }

  return nodeData;
}
