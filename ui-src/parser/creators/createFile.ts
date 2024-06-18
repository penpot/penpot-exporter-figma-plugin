import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { createFile as createPenpotFile } from '@ui/lib/penpot';
import { PenpotPage } from '@ui/lib/types/penpotPage';
import { idLibrary } from '@ui/parser';
import { createComponentLibrary, createPage } from '@ui/parser/creators';
import { uiComponents } from '@ui/parser/libraries';

export const createFile = async (name: string, children: PenpotPage[]) => {
  const file = createPenpotFile(name);
  let pagesBuilt = 1;

  uiComponents.init();
  idLibrary.init();

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: children.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'building'
  });

  for (const page of children) {
    await createPage(file, page);

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: pagesBuilt++
    });

    await sleep(0);
  }

  await createComponentLibrary(file);

  return file;
};
