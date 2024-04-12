import { CircleShape } from '../../ui/lib/types/circle/circleShape';
import { translateFills } from '../translators/translateFills';

export const transformEllipseNode = (
  node: EllipseNode,
  baseX: number,
  baseY: number
): CircleShape => {
  return {
    type: 'circle',
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills, node.width, node.height)
  };
};
