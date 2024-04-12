import { createPenpotItem } from '.';
import { PenpotFile } from '../lib/penpot';
import { PenpotPage } from '../lib/types/penpotPage';

export const createPenpotPage = (file: PenpotFile, node: PenpotPage) => {
  file.addPage(node.name);

  for (const child of node.children ?? []) {
    createPenpotItem(file, child);
  }

  file.closePage();
};
