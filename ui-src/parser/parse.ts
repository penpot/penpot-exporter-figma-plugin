import { createFile } from '@ui/lib/penpot';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';
import { createComponentLibrary, createPage } from '@ui/parser/creators';
import { components } from '@ui/parser/libraries';

export const parse = ({ name, children = [] }: PenpotDocument) => {
  components.clear();

  const file = createFile(name);

  for (const page of children) {
    createPage(file, page);
  }

  createComponentLibrary(file);

  return file;
};
