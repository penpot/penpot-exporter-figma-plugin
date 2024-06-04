import { remoteComponentsLibrary } from '@plugin/RemoteComponentLibrary';

import { PenpotFile } from '@ui/lib/types/penpotFile';
import { createItem } from '@ui/parser/creators/createItems';
import { PenpotNode } from '@ui/types';

export const createRemoteComponents = (file: PenpotFile) => {
  file.addPage('Remote Components');

  Object.entries(remoteComponentsLibrary.all()).forEach(([, component]) => {
    createItem(file, component as PenpotNode, true);
  });

  file.closePage();
};
