import { componentsLibrary } from '@plugin/ComponentLibrary';
import { styleLibrary } from '@plugin/StyleLibrary';
// @TODO: Direct import on purpose, to avoid problems with the tsc linting
import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { createFile } from '@ui/parser/creators';
import { uiImages } from '@ui/parser/libraries';
import { uiColorLibraries } from '@ui/parser/libraries/UiColorLibraries';
import { PenpotDocument } from '@ui/types';

import { parseImage } from '.';

const optimizeImages = async (images: Record<string, Uint8Array>) => {
  const imagesToOptimize = Object.entries(images);

  if (imagesToOptimize.length === 0) return;

  let imagesOptimized = 1;

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imagesToOptimize.length
  });

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'optimization'
  });

  for (const [key, bytes] of imagesToOptimize) {
    if (bytes) {
      uiImages.register(key, await parseImage(bytes));
    }

    sendMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: imagesOptimized++
    });

    await sleep(0);
  }
};

export const parse = async ({
  name,
  children = [],
  components,
  images,
  styles
}: PenpotDocument) => {
  componentsLibrary.init(components);
  uiColorLibraries.init(styles);

  await optimizeImages(images);

  return createFile(name, children);
};
