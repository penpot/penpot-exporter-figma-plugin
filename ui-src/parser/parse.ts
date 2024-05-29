import { createFile } from '@ui/lib/penpot';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';
import { createComponentLibrary, createPage } from '@ui/parser/creators';
import { components } from '@ui/parser/libraries';

export const parse = (node: PenpotDocument) => {
  components.clear();

  const file = createFile(node.name);

  for (const page of node.children ?? []) {
    createPage(file, page);
  }

  createComponentLibrary(file);

  return file;
};
