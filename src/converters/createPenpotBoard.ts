import { createPenpotItem } from '.';
import { NodeData } from '../interfaces';
import { PenpotFile } from '../penpot';
import { translateFills } from '../translators';

export const createPenpotBoard = (
  file: PenpotFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.addArtboard({
    name: node.name,
    x: node.x + baseX,
    y: node.y + baseY,
    width: node.width,
    height: node.height,
    fills: translateFills(node.fills /*, node.width, node.height*/)
  });
  for (const child of node.children) {
    createPenpotItem(file, child, node.x + baseX, node.y + baseY);
  }
  file.closeArtboard();
};
