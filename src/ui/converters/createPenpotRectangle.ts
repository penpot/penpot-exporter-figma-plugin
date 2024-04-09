import { ExportFile, NodeData } from '../../common/interfaces';
import { translateFills } from '../translators';

export const createPenpotRectangle = (
  file: ExportFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.penpotFile.createRect({
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills /*, node.width, node.height*/)
  });
};
