import { createPenpotItem } from '.';
import { ExportFile, NodeData } from '../../common/interfaces';
import { translateFills } from '../translators';

export const createPenpotBoard = (
  file: ExportFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.penpotFile.addArtboard({
    type: Symbol.for('frame'),
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills, node.width, node.height)
  });
  for (const child of node.children) {
    createPenpotItem(file, child, node.x + baseX, node.y + baseY);
  }
  file.penpotFile.closeArtboard();
};
