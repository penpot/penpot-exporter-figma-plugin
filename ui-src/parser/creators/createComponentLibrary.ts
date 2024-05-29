import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { components } from '@ui/parser/libraries';

import { createItem } from '.';

export const createComponentLibrary = (file: PenpotFile) => {
  components.getComponents().forEach(({ children = [], ...rest }: ComponentShape) => {
    file.startComponent(rest);

    for (const child of children) {
      createItem(file, child);
    }

    file.finishComponent();
  });
};
