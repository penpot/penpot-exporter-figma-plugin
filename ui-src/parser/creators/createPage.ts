import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotPage } from '@ui/lib/types/penpotPage';

import { createPenpotItem } from '.';

export const createPage = (file: PenpotFile, node: PenpotPage) => {
  file.addPage(node.name, node.options);

  for (const child of node.children ?? []) {
    createPenpotItem(file, child);
  }

  file.closePage();
};
