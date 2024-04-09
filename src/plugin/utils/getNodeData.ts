import { NodeData, TextData } from '../../common/interfaces';

export const getNodeData = (node: BaseNode, children: (NodeData | TextData)[]): NodeData => {
  return {
    id: node.id,
    type: node.type,
    name: node.name,
    children: children,
    x: 'x' in node ? node.x : 0,
    y: 'y' in node ? node.y : 0,
    width: 'width' in node ? node.width : 0,
    height: 'height' in node ? node.height : 0,
    fills: 'fills' in node ? (node.fills === figma.mixed ? [] : node.fills) : [], // TODO: Support mixed fills
    imageFill: ''
  } as NodeData;
};
