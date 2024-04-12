import { createPenpotPage } from '.';
import { createFile } from '../lib/penpot';
import { PenpotDocument } from '../lib/types/penpotDocument';

export const createPenpotFile = (node: PenpotDocument) => {
  const file = createFile(node.name);

  for (const page of node.children ?? []) {
    createPenpotPage(file, page);
  }

  return file;
};
