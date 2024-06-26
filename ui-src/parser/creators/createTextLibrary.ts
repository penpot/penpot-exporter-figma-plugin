import { toArray } from '@common/map';
import { sleep } from '@common/sleep';

import { sendMessage } from '@ui/context';
import { PenpotFile } from '@ui/lib/types/penpotFile';
import { typographies } from '@ui/parser';

export const createTextLibrary = async (file: PenpotFile) => {
  let librariesBuilt = 1;
  const libraries = toArray(typographies);

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: libraries.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'typoLibraries'
  });

  for (const [_, library] of libraries) {
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
