import { toArray } from '@common/map';
import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotContext } from '@ui/lib/types/penpotContext';
import { colors } from '@ui/parser';

export const createColorsLibrary = async (context: PenpotContext) => {
  let librariesBuilt = 1;
  const libraries = toArray(colors);

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: libraries.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'libraries'
  });

  for (const [_, library] of libraries) {
    for (let index = 0; index < library.fills.length; index++) {
      context.addLibraryColor({
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
