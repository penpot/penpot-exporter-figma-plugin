import { createPenpotItem } from '.';
import { ExportFile, NodeData } from '../../common/interfaces';

export const createPenpotPage = (file: ExportFile, node: NodeData) => {
  file.penpotFile.addPage(node.name);
  for (const child of node.children) {
    createPenpotItem(file, child, 0, 0);
  }
  file.penpotFile.closePage();
};
