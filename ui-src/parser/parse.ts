import { createFile } from '@ui/lib/penpot';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';
import { createComponentLibrary, createPenpotPage } from '@ui/parser/creators';
import { components } from '@ui/parser/libraries';

export const parse = (node: PenpotDocument) => {
  components.clearComponents();

  const file = createFile(node.name);

  for (const page of node.children ?? []) {
    createPenpotPage(file, page);
  }

  createComponentLibrary(file);

  return file;
};
