
import { ComponentShape } from '@ui/lib/types/shapes/componentShape';
import { createPenpotItem } from '.';
import { PenpotFile } from '@ui/lib/types/penpotFile';

export const createPenpotComponent = (
  file: PenpotFile,
  { type, children = [], ...rest }: ComponentShape
) => {
  file.startComponent(rest);

  for (const child of children) {
    createPenpotItem(file, child);
  }

  file.finishComponent();
};
