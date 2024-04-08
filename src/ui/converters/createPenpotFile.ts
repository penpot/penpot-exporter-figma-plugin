import { createPenpotItem } from '.';
import { NodeData } from '../../common/interfaces';
import { createFile } from '../penpot';

export const createPenpotFile = (node: NodeData) => {
  const file = createFile(node.name);
  for (const page of node.children) {
    createPenpotItem(file, page, 0, 0);
  }
  return file;
};
