import { componentsLibrary } from '@plugin/ComponentLibrary';

import { createFile } from '@ui/lib/penpot';
import { createComponentLibrary, createPage } from '@ui/parser/creators';
import { uiComponents } from '@ui/parser/libraries/UiComponents';
import { PenpotDocument } from '@ui/types';

export const parse = ({ name, children = [], components }: PenpotDocument) => {
  componentsLibrary.init(components);
  uiComponents.init();

  const file = createFile(name);

  for (const page of children) {
    createPage(file, page);
  }

  createComponentLibrary(file);

  return file;
};
