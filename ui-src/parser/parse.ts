import { componentsLibrary } from '@plugin/ComponentLibrary';

import { createFile } from '@ui/lib/penpot';
import { createComponentLibrary, createPage } from '@ui/parser/creators';
import { uiComponents, uiImages } from '@ui/parser/libraries';
import { PenpotDocument } from '@ui/types';

import { idLibrary, parseImage } from '.';

export const parse = async ({ name, children = [], components, images }: PenpotDocument) => {
  componentsLibrary.init(components);

  for (const [key, bytes] of Object.entries(images)) {
    if (!bytes) continue;

    uiImages.register(key, await parseImage(bytes));
  }

  uiComponents.init();
  idLibrary.init();

  const file = createFile(name);

  for (const page of children) {
    createPage(file, page);
  }

  createComponentLibrary(file);

  return file;
};
