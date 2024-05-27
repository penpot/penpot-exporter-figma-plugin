import { components } from '@ui/converters/Components';
import { createFile } from '@ui/lib/penpot';
import { PenpotDocument } from '@ui/lib/types/penpotDocument';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

import { createPenpotItem, createPenpotPage } from '.';

export const createPenpotFile = (node: PenpotDocument) => {
  components.clearComponents();
  const file = createFile(node.name);

  for (const page of node.children ?? []) {
    createPenpotPage(file, page);
  }

  addComponentLibrary(file);

  return file;
};

const addComponentLibrary = (file: PenpotFile) => {
  components.getComponents().forEach(({ children = [], ...rest }: ComponentShape) => {
    file.startComponent(rest);

    for (const child of children) {
      createPenpotItem(file, child);
    }

    file.finishComponent();
  });
};
