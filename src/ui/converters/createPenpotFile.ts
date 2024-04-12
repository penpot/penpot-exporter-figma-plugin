import { createFile } from '@ui/lib/penpot.js';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';

import { createPenpotPage } from '.';

export const createPenpotFile = (node: PenpotDocument) => {
  const file = createFile(node.name);

  for (const page of node.children ?? []) {
    createPenpotPage(file, page);
  }

  return file;
};
