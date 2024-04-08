import { createPenpotItem } from '.';
import { NodeData } from '../interfaces';
import { PenpotFile } from '../penpot';

export const createPenpotPage = (file: PenpotFile, node: NodeData) => {
  file.addPage(node.name);
  for (const child of node.children) {
    createPenpotItem(file, child, 0, 0);
  }
  file.closePage();
};
