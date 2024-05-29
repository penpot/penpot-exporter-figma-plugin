import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { components } from '@ui/parser/libraries';

import { createPenpotItem } from '.';

export const createComponentLibrary = (file: PenpotFile) => {
  components.getComponents().forEach(({ children = [], ...rest }: ComponentShape) => {
    file.startComponent(rest);

    for (const child of children) {
      createPenpotItem(file, child);
    }

    file.finishComponent();
  });
};
