import { componentsLibrary } from '@plugin/ComponentLibrary';
import { imagesLibrary } from '@plugin/ImageLibrary';

import { createFile } from '@ui/lib/penpot';
import { createComponentLibrary, createPage } from '@ui/parser/creators';
import { uiComponents } from '@ui/parser/libraries/UiComponents';
import { PenpotDocument } from '@ui/types';

import { idLibrary } from '.';

export const parse = ({ name, children = [], components, images }: PenpotDocument) => {
  componentsLibrary.init(components);
  imagesLibrary.init(images);

  uiComponents.init();
  idLibrary.init();

  const file = createFile(name);

  for (const page of children) {
    createPage(file, page);
  }

  createComponentLibrary(file);

  return file;
};
