import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiColors } from '@ui/parser/libraries';

export const createColorsLibrary = async (file: PenpotFile) => {
  let librariesBuilt = 1;
  const libraries = uiColors.all();

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: libraries.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'libraries'
  });

  for (const library of libraries) {
    for (let index = 0; index < library.fills.length; index++) {
      file.addLibraryColor({
        ...library.colors[index],
        id: library.fills[index].fillColorRefId,
        refFile: library.fills[index].fillColorRefFile,
        color: library.fills[index].fillColor,
        opacity: library.fills[index].fillOpacity,
        image: library.fills[index].fillImage,
        gradient: library.fills[index].fillColorGradient
      });

      sendMessage({
        type: 'PROGRESS_PROCESSED_ITEMS',
        data: librariesBuilt++
      });

      await sleep(0);
    }
  }
};
