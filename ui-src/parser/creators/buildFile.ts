import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { PenpotPage } from '@ui/lib/types/penpotPage';
import { components, identifiers } from '@ui/parser';
import {
  createColorsLibrary,
  createComponentsLibrary,
  createPage,
  createTextLibrary
} from '@ui/parser/creators';

export const buildFile = async (file: PenpotFile, children: PenpotPage[]) => {
  let pagesBuilt = 1;

  components.clear();
  identifiers.clear();

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: children.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'building'
  });

  for (const page of children) {
    createPage(file, page);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: pagesBuilt++
    });

    await sleep(0);
  }

  await createColorsLibrary(file);
  await createTextLibrary(file);

  await createComponentsLibrary(file);

  return file;
};
