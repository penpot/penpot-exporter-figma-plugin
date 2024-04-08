import { createPenpotItem } from '.';
import { NodeData } from '../interfaces';
import { PenpotFile } from '../penpot';

export const createPenpotGroup = (
  file: PenpotFile,
  node: NodeData,
  baseX: number,
  baseY: number
) => {
  file.addGroup({ name: node.name });
  for (const child of node.children) {
    createPenpotItem(file, child, baseX, baseY);
  }
  file.closeGroup();
};
