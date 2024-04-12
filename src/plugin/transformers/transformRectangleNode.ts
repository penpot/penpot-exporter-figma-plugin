import { RectShape } from '../../ui/lib/types/rect/rectShape';
import { translateFills } from '../translators/translateFills';

export const transformRectangleNode = (
  node: RectangleNode,
  baseX: number,
  baseY: number
): RectShape => {
  return {
    type: 'rect',
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills, node.width, node.height)
  };
};
