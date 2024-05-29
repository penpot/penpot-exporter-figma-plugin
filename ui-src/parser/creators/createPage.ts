import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotPage } from '@ui/lib/types/penpotPage';

import { createItem } from '.';

export const createPage = (file: PenpotFile, { name, options, children = [] }: PenpotPage) => {
  file.addPage(name, options);

  for (const child of children) {
    createItem(file, child);
  }

  file.closePage();
};
