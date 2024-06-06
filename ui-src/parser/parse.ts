import { componentsLibrary } from '@plugin/ComponentLibrary';
// @TODO: Direct import on purpose, to avoid problems with the tsc linting
import { sleep } from '@plugin/utils/sleep';

import { sendMessage } from '@ui/context';
import { createFile } from '@ui/lib/penpot';
import { createComponentLibrary, createPage } from '@ui/parser/creators';
import { uiComponents, uiImages } from '@ui/parser/libraries';
import { PenpotDocument } from '@ui/types';

import { idLibrary, parseImage } from '.';

const optimizeImages = async (images: Record<string, Uint8Array>) => {
  const imagesToOptimize = Object.entries(images);
  let imagesOptimized = 1;

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'optimization'
  });

  sendMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imagesToOptimize.length
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

export const parse = async ({ name, children = [], components, images }: PenpotDocument) => {
  componentsLibrary.init(components);

  await optimizeImages(images);

  sendMessage({
    type: 'PROGRESS_STEP',
    data: 'downloading'
  });

  await sleep(20);

  uiComponents.init();
  idLibrary.init();

  const file = createFile(name);

  for (const page of children) {
    await createPage(file, page);
  }

  createComponentLibrary(file);

  return file;
};
