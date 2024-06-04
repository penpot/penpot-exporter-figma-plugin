import { componentsLibrary } from '@plugin/ComponentLibrary';
import { imagesLibrary } from '@plugin/ImageLibrary';
import { remoteComponentsLibrary } from '@plugin/RemoteComponentLibrary';

import { createFile } from '@ui/lib/penpot';
import { createComponentLibrary, createPage, createRemoteComponents } from '@ui/parser/creators';
import { remoteUiComponents, uiComponents } from '@ui/parser/libraries';
import { PenpotDocument } from '@ui/types';

import { idLibrary } from '.';

export const parse = ({
  name,
  children = [],
  components,
  remoteComponents,
  images
}: PenpotDocument) => {
  componentsLibrary.init(components);
  remoteComponentsLibrary.init(remoteComponents);

  imagesLibrary.init(images);

  uiComponents.init();
  remoteUiComponents.init();
  idLibrary.init();

  const file = createFile(name);

  for (const page of children) {
    createPage(file, page);
  }

  createRemoteComponents(file);

  createComponentLibrary(file);
  createComponentLibrary(file, true);

  return file;
};
