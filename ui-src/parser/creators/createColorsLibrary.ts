import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiColorLibraries } from '@ui/parser/libraries/UiColorLibraries';

export const createColorsLibrary = async (file: PenpotFile) => {
  let librariesBuilt = 1;
  const libraries = uiColorLibraries.all();

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: libraries.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'libraries'
  });

  for (const library of libraries) {
    for (const style of library.styles) {
      file.addLibraryColor(style.color);

      sendMessage({
        type: 'PROGRESS_PROCESSED_ITEMS',
        data: librariesBuilt++
      });

      await sleep(0);
    }
  }
};
