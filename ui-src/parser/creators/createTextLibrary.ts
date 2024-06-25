import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { uiTypographies } from '@ui/parser/libraries';

export const createTextLibrary = async (file: PenpotFile) => {
  let librariesBuilt = 1;
  const libraries = uiTypographies.all();

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: libraries.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'typoLibraries'
  });

  for (const library of libraries) {
    file.addLibraryTypography({
      ...library.typography,
      fontId: library.textStyle.fontId,
      fontVariantId: library.textStyle.fontVariantId,
      letterSpacing: library.textStyle.letterSpacing,
      fontWeight: library.textStyle.fontWeight,
      fontStyle: library.textStyle.fontStyle,
      fontFamily: library.textStyle.fontFamily,
      fontSize: library.textStyle.fontSize,
      textTransform: library.textStyle.textTransform,
      lineHeight: library.textStyle.lineHeight
    });

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: librariesBuilt++
    });

    await sleep(0);
  }
};
