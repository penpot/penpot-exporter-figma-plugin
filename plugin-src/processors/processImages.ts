import { sleep } from '@common/sleep';

import { images } from '@plugin/libraries';

export const processImages = async (): Promise<Record<string, Uint8Array<ArrayBuffer>>> => {
  const processedImages: Record<string, Uint8Array<ArrayBuffer>> = {};

  if (images.size === 0) return processedImages;

  let currentImage = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: images.size
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'images'
  });

  for (const [key, image] of images.entries()) {
    const bytes = await image?.getBytesAsync();

    if (bytes) {
      processedImages[key] = bytes as Uint8Array<ArrayBuffer>;
    }

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentImage++
    });

    await sleep(0);
  }

  await sleep(20);

  return processedImages;
};
