import { createPenpotItem } from '.';
import { ExportFile, NodeData } from '../../common/interfaces';

export const createPenpotGroup = (
  file: ExportFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.penpotFile.addGroup({
    type: Symbol.for('group'),
    name: node.name
  });

  for (const child of node.children) {
    createPenpotItem(file, child, baseX, baseY);
  }

  file.penpotFile.closeGroup();
};
