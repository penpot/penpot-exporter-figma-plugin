import { toArray } from '@common/map';
import { sleep } from '@common/sleep';

import { images as imagesLibrary } from '@plugin/libraries';

export const processImages = async (): Promise<Record<string, Uint8Array<ArrayBuffer>>> => {
  const imageToDownload = toArray(imagesLibrary);
  const images: Record<string, Uint8Array<ArrayBuffer>> = {};

  if (imageToDownload.length === 0) return images;

  let currentImage = 1;

  figma.ui.postMessage({
    type: 'PROGRESS_TOTAL_ITEMS',
    data: imageToDownload.length
  });

  figma.ui.postMessage({
    type: 'PROGRESS_STEP',
    data: 'images'
  });

  for (const [key, image] of imageToDownload) {
    const bytes = await image?.getBytesAsync();

    if (bytes) {
      images[key] = bytes as Uint8Array<ArrayBuffer>;
    }

    figma.ui.postMessage({
      type: 'PROGRESS_PROCESSED_ITEMS',
      data: currentImage++
    });

    await sleep(0);
  }

  await sleep(20);

  return images;
};
