import { PenpotFile } from '@ui/lib/penpot';
import { PenpotPage } from '@ui/lib/types/penpotPage';

import { createPenpotItem } from '.';

export const createPenpotPage = (file: PenpotFile, node: PenpotPage) => {
  file.addPage(node.name, node.options);

  for (const child of node.children ?? []) {
    createPenpotItem(file, child);
  }

  file.closePage();
};
