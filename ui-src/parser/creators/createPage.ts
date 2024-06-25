import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotPage } from '@ui/lib/types/penpotPage';

import { createItems } from '.';

export const createPage = (file: PenpotFile, { name, options, children = [] }: PenpotPage) => {
  file.addPage(name, options);

  createItems(file, children);

  file.closePage();
};
