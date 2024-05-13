import { PenpotFile } from '@ui/lib/types/penpotFile';
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';

import { createPenpotItem } from '.';

export const createPenpotComponent = (
  file: PenpotFile,
  { type, children = [], ...rest }: ComponentShape
) => {
  const asda = file.startComponent(rest);

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.finishComponent();

  file.createComponentInstance({ componentId: asda, name: 'test', x: 0, y: 0, mainInstance: true });
};
