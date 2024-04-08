import { NodeData } from '../interfaces';
import { PenpotFile } from '../penpot';
import { translateFills } from '../translators';

export const createPenpotCircle = (
  file: PenpotFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.createCircle({
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills /*, node.width, node.height*/)
  });
};
